import { describe, expect, it, vi, afterEach } from 'vitest';
import {
  isBlockedScheme,
  isPrivateNetworkTarget,
  matchesLocalBlocklist,
  isUrlShortener,
  checkSafeBrowsing,
  hashIp,
  parseUserAgent,
  hashPassword,
  createUnlockToken,
  verifyUnlockToken,
} from '../abuse';

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('isBlockedScheme', () => {
  it.each([
    ['javascript:alert(1)', true],
    ['JaVaScRiPt:alert(1)', true],
    ['  javascript:alert(1)', true],
    ['java\tscript:alert(1)', true],
    ['data:text/html,<h1>x</h1>', true],
    ['DATA:text/plain;base64,SGVsbG8=', true],
    ['vbscript:msgbox("x")', true],
    ['file:///etc/passwd', true],
    ['FILE:///C:/Windows', true],
  ])('blocks %s', (url, expected) => {
    expect(isBlockedScheme(url)).toBe(expected);
  });

  it.each([
    'https://example.com',
    'http://example.com/path?q=1',
    'mailto:user@example.com',
    'tel:+1234567890',
    '/relative/path',
    'not a url at all',
    'C:\\Windows\\path',
    '',
  ])('allows %s', (url) => {
    expect(isBlockedScheme(url)).toBe(false);
  });
});

describe('isPrivateNetworkTarget', () => {
  it.each([
    'http://localhost/',
    'http://localhost:3000/x',
    'http://LOCALHOST/',
    'http://127.0.0.1/',
    'http://127.1.2.3:8080/',
    'http://10.0.0.5/',
    'http://10.255.255.255/',
    'http://172.16.0.1/',
    'http://172.31.255.254/',
    'http://192.168.1.1/',
    'http://192.168.0.1/admin',
    'http://169.254.169.254/latest/meta-data/', // cloud metadata
    'http://[::1]/',
    'http://printer.local/',
    // obfuscations of 127.0.0.1
    'http://2130706433/',
    'http://0177.0.0.1/',
    'http://0x7f.0.0.1/',
    'http://0x7f000001/',
    'http://0x7f.1/',
    // obfuscation of 192.168.1.1
    'http://3232235777/',
    'http://0xC0.0xA8.0x1.0x1/',
  ])('blocks %s', (url) => {
    expect(isPrivateNetworkTarget(url)).toBe(true);
  });

  it.each([
    'https://example.com/',
    'http://8.8.8.8/',
    'http://1.1.1.1/',
    'http://172.15.0.1/', // just outside 172.16/12
    'http://172.32.0.1/', // just outside 172.16/12
    'http://11.0.0.1/',
    'http://192.167.1.1/',
    'http://[2001:db8::1]/',
    'not a url',
  ])('allows %s', (url) => {
    expect(isPrivateNetworkTarget(url)).toBe(false);
  });
});

describe('matchesLocalBlocklist', () => {
  it('blocks nothing with the default (empty, tight) list', () => {
    expect(matchesLocalBlocklist('https://example.com/login?verify=account')).toBe(false);
    expect(matchesLocalBlocklist('https://bit.ly/abc')).toBe(false);
  });
});

describe('isUrlShortener', () => {
  it.each([
    'https://bit.ly/abc123',
    'http://tinyurl.com/xyz',
    'https://t.co/abc',
    'https://goo.gl/maps/x',
    'https://is.gd/abc',
    'https://buff.ly/2x',
    'https://ow.ly/abc',
    'https://sub.bit.ly/abc',
  ])('flags %s as a shortener (warning level)', (url) => {
    expect(isUrlShortener(url)).toBe(true);
  });

  it.each(['https://example.com/', 'https://bitly.example.com/', 'not a url'])(
    'does not flag %s',
    (url) => {
      expect(isUrlShortener(url)).toBe(false);
    }
  );
});

describe('checkSafeBrowsing', () => {
  it("returns 'unavailable' when no API key is configured (documented degraded path)", async () => {
    vi.stubEnv('GOOGLE_SAFE_BROWSING_API_KEY', '');
    await expect(checkSafeBrowsing('https://example.com/')).resolves.toBe('unavailable');
  });

  it("returns 'unavailable' (never fake-clean) when the API errors", async () => {
    vi.stubEnv('GOOGLE_SAFE_BROWSING_API_KEY', 'test-key');
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')));
    await expect(checkSafeBrowsing('https://example.com/')).resolves.toBe('unavailable');
  });

  it("returns 'threat' when the API reports matches", async () => {
    vi.stubEnv('GOOGLE_SAFE_BROWSING_API_KEY', 'test-key');
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ matches: [{ threatType: 'MALWARE' }] }),
      })
    );
    await expect(checkSafeBrowsing('https://evil.example/')).resolves.toBe('threat');
  });

  it("returns 'clean' when the API reports no matches", async () => {
    vi.stubEnv('GOOGLE_SAFE_BROWSING_API_KEY', 'test-key');
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({}) })
    );
    await expect(checkSafeBrowsing('https://example.com/')).resolves.toBe('clean');
  });
});

describe('hashIp', () => {
  it("returns 'unknown' when no salt is configured", () => {
    vi.stubEnv('IP_HASH_SALT', '');
    expect(hashIp('1.2.3.4')).toBe('unknown');
  });

  it('is deterministic within a day and produces a 64-char hex digest', () => {
    vi.stubEnv('IP_HASH_SALT', 'test-salt');
    const a = hashIp('1.2.3.4');
    const b = hashIp('1.2.3.4');
    expect(a).toBe(b);
    expect(a).toMatch(/^[0-9a-f]{64}$/);
    expect(hashIp('5.6.7.8')).not.toBe(a);
  });
});

describe('parseUserAgent', () => {
  it('parses a Chrome on Windows desktop UA', () => {
    expect(
      parseUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
      )
    ).toEqual({ deviceType: 'desktop', os: 'Windows', browser: 'Chrome' });
  });

  it('parses an iPhone Safari UA', () => {
    expect(
      parseUserAgent(
        'Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Mobile/15E148 Safari/604.1'
      )
    ).toEqual({ deviceType: 'mobile', os: 'iOS', browser: 'Safari' });
  });

  it('parses an Android Chrome UA', () => {
    expect(
      parseUserAgent(
        'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36'
      )
    ).toEqual({ deviceType: 'mobile', os: 'Android', browser: 'Chrome' });
  });

  it('prefers Edge over Chrome and tablet over mobile', () => {
    expect(
      parseUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0'
      ).browser
    ).toBe('Edge');
    expect(
      parseUserAgent(
        'Mozilla/5.0 (iPad; CPU OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Mobile/15E148 Safari/604.1'
      )
    ).toEqual({ deviceType: 'tablet', os: 'iOS', browser: 'Safari' });
  });

  it('parses Firefox on Linux', () => {
    expect(
      parseUserAgent('Mozilla/5.0 (X11; Linux x86_64; rv:133.0) Gecko/20100101 Firefox/133.0')
    ).toEqual({ deviceType: 'desktop', os: 'Linux', browser: 'Firefox' });
  });

  it('returns Unknown for garbage input', () => {
    expect(parseUserAgent('')).toEqual({
      deviceType: 'desktop',
      os: 'Unknown',
      browser: 'Unknown',
    });
  });
});

describe('password helpers', () => {
  it('hashPassword is a stable 64-char hex digest', () => {
    const h = hashPassword('s3cret');
    expect(h).toMatch(/^[0-9a-f]{64}$/);
    expect(hashPassword('s3cret')).toBe(h);
    expect(hashPassword('other')).not.toBe(h);
  });

  it('create/verify unlock token round-trips and rejects forgeries', () => {
    vi.stubEnv('IP_HASH_SALT', 'token-salt');
    const token = createUnlockToken('AbC123XyZ9');
    expect(token).toMatch(/^[0-9a-f]{64}$/);
    expect(verifyUnlockToken('AbC123XyZ9', token)).toBe(true);
    expect(verifyUnlockToken('AbC123XyZ9', '0'.repeat(64))).toBe(false);
    expect(verifyUnlockToken('other-id', token)).toBe(false);
    expect(verifyUnlockToken('AbC123XyZ9', '')).toBe(false);
  });

  it('returns empty token when no secret is configured', () => {
    vi.stubEnv('IP_HASH_SALT', '');
    vi.stubEnv('PASSWORD_TOKEN_SECRET', '');
    expect(createUnlockToken('abc')).toBe('');
    expect(verifyUnlockToken('abc', 'whatever')).toBe(false);
  });
});
