/**
 * Abuse-prevention primitives for QR code destination URLs.
 *
 * Pure helpers (no I/O) except {@link checkSafeBrowsing}, which performs a
 * real Google Safe Browsing v4 lookup when GOOGLE_SAFE_BROWSING_API_KEY is set
 * and reports `'unavailable'` (documented degraded path) when it is not.
 *
 * No `any` is used anywhere in this module; every input is validated.
 */

import { createHash, createHmac, timingSafeEqual } from 'node:crypto';

/** URL schemes that must never be a QR destination (XSS / local-file risk). */
const BLOCKED_SCHEMES = new Set(['javascript', 'data', 'vbscript', 'file']);

/**
 * True when the URL uses a blocked scheme such as `javascript:`, `data:`,
 * `vbscript:` or `file:`. Scheme matching is case-insensitive and ignores
 * whitespace / control-character smuggling inside the scheme token.
 */
export function isBlockedScheme(url: string): boolean {
  if (typeof url !== 'string') return false;
  // Strip whitespace and C0 control characters so `java\tscript:` cannot slip through.
  const cleaned = url.replace(/[\s\x00-\x1f\x7f]+/g, '');
  const match = /^([a-zA-Z][a-zA-Z0-9+.-]*):/.exec(cleaned);
  if (!match?.[1]) return false;
  return BLOCKED_SCHEMES.has(match[1].toLowerCase());
}

/** Parse one dotted-quad component that may be decimal, octal or hex. */
function parseNumericPart(part: string): number | null {
  if (/^0x[0-9a-fA-F]+$/.test(part)) return parseInt(part, 16);
  if (/^0[0-7]+$/.test(part)) return parseInt(part, 8);
  if (/^[0-9]+$/.test(part)) return parseInt(part, 10);
  return null;
}

/**
 * Interpret a hostname as an IPv4 address, tolerating decimal / octal / hex
 * obfuscations (`2130706433`, `0177.0.0.1`, `0x7f.0.0.1`, `0x7f000001`).
 * Returns the four octets, or null when the host is not numeric IPv4.
 * Follows classic inet_aton semantics for 1–4 part addresses.
 */
function parseObfuscatedIPv4(host: string): [number, number, number, number] | null {
  const parts = host.split('.');
  if (parts.length < 1 || parts.length > 4) return null;
  const nums: number[] = [];
  for (const part of parts) {
    const n = parseNumericPart(part);
    if (n === null || n > 0xffffffff) return null;
    nums.push(n);
  }
  const n = parts.length;
  // inet_aton range rule: each of the first n-1 parts must fit in a byte,
  // the last part must fit in 8*(5-n) bits.
  for (let i = 0; i < n - 1; i++) {
    if (nums[i] > 0xff) return null;
  }
  if (nums[n - 1] > 2 ** (8 * (5 - n)) - 1) return null;
  let value: number;
  if (n === 1) value = nums[0];
  else if (n === 2) value = nums[0] * 2 ** 24 + nums[1];
  else if (n === 3) value = nums[0] * 2 ** 24 + nums[1] * 2 ** 8 + nums[2];
  else value = nums[0] * 2 ** 24 + nums[1] * 2 ** 16 + nums[2] * 2 ** 8 + nums[3];
  return [
    Math.floor(value / 2 ** 24) % 256,
    Math.floor(value / 2 ** 16) % 256,
    Math.floor(value / 2 ** 8) % 256,
    value % 256,
  ];
}

/** True when four octets fall inside a non-routable / loopback range we block. */
function isBlockedOctets(o: [number, number, number, number]): boolean {
  const [a, b] = o;
  return (
    a === 127 || // 127.0.0.0/8 loopback
    a === 10 || // 10.0.0.0/8 private
    (a === 172 && b >= 16 && b <= 31) || // 172.16.0.0/12 private
    (a === 192 && b === 168) || // 192.168.0.0/16 private
    (a === 169 && b === 254) // 169.254.0.0/16 link-local
  );
}

/**
 * True when the URL targets a private / loopback / link-local address or host:
 * `localhost`, `127.0.0.0/8`, `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`,
 * `169.254.0.0/16`, `::1`, `*.local`, plus decimal/octal/hex IP obfuscations
 * of the same ranges (SSRF protection for dynamic QR destinations).
 */
export function isPrivateNetworkTarget(url: string): boolean {
  if (typeof url !== 'string') return false;
  let hostname: string;
  try {
    hostname = new URL(url).hostname.toLowerCase().replace(/\.$/, '');
  } catch {
    return false;
  }
  if (hostname === 'localhost' || hostname === 'local' || hostname.endsWith('.local')) {
    return true;
  }
  // IPv6: loopback in compressed or fully-expanded form, and IPv4-mapped loopback/private.
  if (hostname.includes(':')) {
    const h = hostname.replace(/^\[|\]$/g, '');
    const groups = h.split(':');
    const expanded = groups.length === 8 && groups.every((g) => /^0*$/.test(g) || g === '1');
    if (h === '::1' || expanded) return true;
    const mapped = /^::ffff:(\d+\.\d+\.\d+\.\d+)$/.exec(h);
    if (mapped?.[1]) {
      const octets = parseObfuscatedIPv4(mapped[1]);
      return octets !== null && isBlockedOctets(octets);
    }
    return false;
  }
  const octets = parseObfuscatedIPv4(hostname);
  return octets !== null && isBlockedOctets(octets);
}

/**
 * Tight local blocklist of hostile destination patterns.
 *
 * Intentionally conservative: entries must be exact-host (or exact-host-suffix)
 * matches for confirmed-malicious infrastructure. Broad phishing-phrase
 * patterns like `/login.*verify.*account/i` are NOT here — they false-positive
 * on legitimate pages and belong in Safe Browsing, not in a local list.
 * The list is empty by default and extended only with reviewed entries.
 */
export const LOCAL_BLOCKLIST: RegExp[] = [];

/**
 * True when the URL's host matches {@link LOCAL_BLOCKLIST}.
 * An empty blocklist blocks nothing (fail-open by design; Safe Browsing is
 * the live threat feed).
 */
export function matchesLocalBlocklist(url: string): boolean {
  if (typeof url !== 'string' || LOCAL_BLOCKLIST.length === 0) return false;
  let hostname: string;
  try {
    hostname = new URL(url).hostname.toLowerCase();
  } catch {
    return false;
  }
  return LOCAL_BLOCKLIST.some((re) => re.test(hostname));
}

/** Hosts of public URL shorteners — warning-level only, never a hard block. */
const SHORTENER_HOSTS = new Set([
  'bit.ly',
  'tinyurl.com',
  't.co',
  'goo.gl',
  'is.gd',
  'buff.ly',
  'ow.ly',
  'bitly.com',
  'tiny.cc',
  'shorturl.at',
  'rb.gy',
]);

/**
 * True when the URL points at a known public URL shortener.
 * Warning-level signal (shorteners hide the real destination); callers should
 * surface a warning, not reject the QR.
 */
export function isUrlShortener(url: string): boolean {
  if (typeof url !== 'string') return false;
  let hostname: string;
  try {
    hostname = new URL(url).hostname.toLowerCase().replace(/\.$/, '');
  } catch {
    return false;
  }
  return (
    SHORTENER_HOSTS.has(hostname) || [...SHORTENER_HOSTS].some((h) => hostname.endsWith(`.${h}`))
  );
}

export type SafeBrowsingVerdict = 'clean' | 'threat' | 'unavailable';

interface SafeBrowsingResponse {
  matches?: unknown[];
}

/**
 * Real Google Safe Browsing v4 Threat Matches lookup for one URL.
 *
 * - Returns `'threat'` when the API reports any match (malware,
 *   social-engineering, unwanted software, potentially-harmful app).
 * - Returns `'clean'` when the API reports no matches.
 * - Returns `'unavailable'` when GOOGLE_SAFE_BROWSING_API_KEY is not set, or
 *   when the request fails/times out (5s). This is a documented degraded path:
 *   callers treat it as pass-with-warning, NEVER as a verified clean verdict.
 */
export async function checkSafeBrowsing(url: string): Promise<SafeBrowsingVerdict> {
  const apiKey = process.env.GOOGLE_SAFE_BROWSING_API_KEY;
  if (!apiKey) return 'unavailable';
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  try {
    const res = await fetch(
      `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${encodeURIComponent(apiKey)}`,
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          client: { clientId: 'nextqrcode', clientVersion: '1.0.0' },
          threatInfo: {
            threatTypes: [
              'MALWARE',
              'SOCIAL_ENGINEERING',
              'UNWANTED_SOFTWARE',
              'POTENTIALLY_HARMFUL_APPLICATION',
            ],
            platformTypes: ['ANY_PLATFORM'],
            threatEntryTypes: ['URL'],
            threatEntries: [{ url }],
          },
        }),
        signal: controller.signal,
      }
    );
    if (!res.ok) return 'unavailable';
    const data = (await res.json()) as SafeBrowsingResponse;
    return data && Array.isArray(data.matches) && data.matches.length > 0 ? 'threat' : 'clean';
  } catch {
    return 'unavailable';
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * HMAC-SHA256 of an IP address, keyed with IP_HASH_SALT plus the current UTC
 * date so hashes rotate daily (limits long-term re-identification).
 * Returns `'unknown'` when no salt is configured or the IP is empty.
 */
export function hashIp(ip: string): string {
  const salt = process.env.IP_HASH_SALT;
  if (!salt || typeof ip !== 'string' || ip.trim() === '') return 'unknown';
  const date = new Date().toISOString().slice(0, 10); // YYYY-MM-DD (UTC)
  return createHmac('sha256', `${salt}:${date}`).update(ip.trim()).digest('hex');
}

export interface ParsedUserAgent {
  deviceType: 'mobile' | 'tablet' | 'desktop';
  os: 'iOS' | 'Android' | 'Windows' | 'macOS' | 'Linux' | 'Unknown';
  browser: 'Chrome' | 'Safari' | 'Firefox' | 'Edge' | 'Unknown';
}

const TABLET_RE = /ipad|tablet|kindle|silk|playbook|nexus\s*7|nexus\s*10|sm-t\d|gt-p\d/i;
const MOBILE_RE = /iphone|ipod|android.*mobile|mobile|blackberry|iemobile|opera\s*mini|fennec/i;
const IOS_RE = /iphone|ipad|ipod|cpu\s+(?:iphone\s+)?os/i;
const ANDROID_RE = /android/i;
const WINDOWS_RE = /windows\s+nt/i;
const MACOS_RE = /mac\s+os\s+x|macintosh/i;
const LINUX_RE = /linux/i;
const EDGE_RE = /edg(?:e|a|ios)?\/|edge\//i;
const CHROME_RE = /chrome\/|crios\/|chromium\//i;
const FIREFOX_RE = /firefox\/|fxios\//i;
const SAFARI_RE = /safari\//i;

/**
 * Minimal real user-agent parser for scan analytics.
 * Check order matters: tablet before mobile, Edge before Chrome (Edge UAs
 * contain "Chrome"), Chrome before Safari (Chrome UAs contain "Safari").
 */
export function parseUserAgent(ua: string): ParsedUserAgent {
  const s = typeof ua === 'string' ? ua : '';
  const deviceType: ParsedUserAgent['deviceType'] = TABLET_RE.test(s)
    ? 'tablet'
    : MOBILE_RE.test(s) || ANDROID_RE.test(s)
      ? 'mobile'
      : 'desktop';
  const os: ParsedUserAgent['os'] = IOS_RE.test(s)
    ? 'iOS'
    : ANDROID_RE.test(s)
      ? 'Android'
      : WINDOWS_RE.test(s)
        ? 'Windows'
        : MACOS_RE.test(s)
          ? 'macOS'
          : LINUX_RE.test(s)
            ? 'Linux'
            : 'Unknown';
  const browser: ParsedUserAgent['browser'] = EDGE_RE.test(s)
    ? 'Edge'
    : CHROME_RE.test(s)
      ? 'Chrome'
      : FIREFOX_RE.test(s)
        ? 'Firefox'
        : SAFARI_RE.test(s)
          ? 'Safari'
          : 'Unknown';
  return { deviceType, os, browser };
}

/** SHA-256 hex digest of a plaintext password (server-side only). */
export function hashPassword(password: string): string {
  return createHash('sha256').update(password, 'utf8').digest('hex');
}

function unlockTokenSecret(): string {
  return process.env.PASSWORD_TOKEN_SECRET || process.env.IP_HASH_SALT || '';
}

/**
 * Mint a single-use-capable bearer token that lets a browser skip the unlock
 * form for a password-protected QR (`/r/[publicId]?t=<token>`).
 * HMAC-SHA256 over the publicId; empty string when no secret is configured
 * (callers must then always show the unlock form).
 */
export function createUnlockToken(publicId: string): string {
  const secret = unlockTokenSecret();
  if (!secret) return '';
  return createHmac('sha256', secret).update(`unlock:${publicId}`).digest('hex');
}

/** Timing-safe verification of a token minted by {@link createUnlockToken}. */
export function verifyUnlockToken(publicId: string, token: string): boolean {
  const expected = createUnlockToken(publicId);
  if (!expected || typeof token !== 'string' || token === '') return false;
  const a = Buffer.from(expected, 'utf8');
  const b = Buffer.from(token, 'utf8');
  return a.length === b.length && timingSafeEqual(a, b);
}
