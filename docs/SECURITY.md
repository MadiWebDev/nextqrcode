# Security — Error tracking & analytics

## Error tracking

- `src/lib/observability.ts` exposes `reportError(err, context?)`.
- It forwards to Sentry **only** when `SENTRY_DSN` (server) or
  `NEXT_PUBLIC_SENTRY_DSN` (client) is set; delivery is fire-and-forget
  (beacon / bounded fetch) so tracking failures can never break the app.
- Without a DSN: `console.error` in development, no-op in production.
- Keep error context free of secrets and PII; the Sentry DSN's public key
  lives in env, never in source.

## Analytics

- `trackEvent(name, props?)` is opt-in only: it no-ops unless the visitor
  accepted cookies (`qrs_cookie_consent === 'accepted'` in localStorage).
- No PII: names and props must never contain emails, names, IPs, full URLs,
  or QR payloads. Property values are primitives only.
- Events batch locally and are delivered with `navigator.sendBeacon` to
  `/api/analytics`, which this repo does not ship yet — the route's presence
  is checked once at runtime and events are dropped when it is absent.

---

# Security

This document describes the security architecture of NextQRCode. Every claim
below names the file it is grounded in — if code and doc disagree, the code
wins and the doc must be updated.

## 1. Threat model

The application's attack surface is dominated by **user-controlled QR
destination URLs** (rendered to end users on `/r/[publicId]` redirects and
embedded in millions of SEO landing pages) plus authenticated write APIs
(dashboard QR management, uploads) and a public analytics surface.

| Threat                                              | Mitigation                                                                                                                                                                                                                                          |
| --------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Stored XSS via `javascript:`/`data:` QR payloads    | `isBlockedScheme()` rejects `javascript`, `data`, `vbscript`, `file` schemes, including whitespace/control-char smuggling (`src/lib/security/abuse.ts`)                                                                                             |
| SSRF / internal-network probing via QR destinations | `isPrivateNetworkTarget()` blocks loopback, RFC-1918, link-local, `localhost`, `*.local`, and decimal/octal/hex IP obfuscations (`src/lib/security/abuse.ts`); `/r/[publicId]` re-checks schemes at redirect time (`src/app/r/[publicId]/route.ts`) |
| Phishing/malware landing pages                      | Google Safe Browsing v4 lookup on create/update (`src/lib/security/abuse.ts`, `checkSafeBrowsing`); user report flow (`src/app/api/reports/route.ts`)                                                                                               |
| Malicious SVG uploads (stored XSS via logo SVGs)    | 2 MB cap, MIME allowlist, and regex-based `sanitizeSvg()` stripping scripts, styles, foreignObject/iframe/object, event attributes and `javascript:` URIs (`src/app/api/uploads/route.ts`, `src/lib/cloudinary.ts`)                                 |
| Credential stuffing / brute force on write APIs     | Upstash-backed sliding-window rate limits on auth-adjacent and write routes (`src/lib/security/rate-limit.ts`)                                                                                                                                      |
| IP-based user tracking in scan analytics            | IPs are HMAC-SHA256 hashed with a daily-rotating salt (`hashIp()` in `src/lib/security/abuse.ts`); raw IPs are never persisted                                                                                                                      |
| XSS via inline scripts                              | Per-request CSP nonces via `src/middleware.ts` (see §8)                                                                                                                                                                                             |
| CSRF on session actions                             | Auth.js JWT sessions with `SameSite=Lax` cookies (default); write APIs require the session, not just a cookie, via `getUserId()` (`src/lib/auth.ts`)                                                                                                |

Out of scope (documented limitations): Safe Browsing degrades to
`'unavailable'` without an API key (documented, never silently "clean");
the in-memory rate-limit fallback is per-instance (multi-instance prod
needs Upstash env vars).

## 2. Authentication (Auth.js v5)

Configuration lives in `src/lib/auth.ts`:

- **Providers:** Google OAuth (enabled when `AUTH_GOOGLE_ID`/`AUTH_GOOGLE_SECRET` are set) and email magic link via Nodemailer (enabled when `EMAIL_SERVER` is set). Providers are built dynamically — with no providers configured, sign-in is unavailable rather than broken.
- **Persistence:** `@auth/mongodb-adapter` against the same MongoDB when configured; without MongoDB the auth routes return 503 with a clear message (`isAuthConfigured()`), and guests can still generate static QR codes — no account required for core functionality.
- **Sessions:** JWT strategy (`session: { strategy: 'jwt' }`), `AUTH_SECRET` signs tokens; the `jwt`/`session` callbacks attach `user.id` as `token.uid` so server code resolves the caller with `getUserId()` (`src/lib/auth.ts:67`).
- **Custom pages:** sign-in at `/login`, verification at `/login?verify=1`.
- **Route protection:** mutating API routes (`/api/uploads`, `/api/uploads/sign`, `/api/qrcodes`, `/api/account`) call `getUserId()` and return 401 for anonymous callers (`src/app/api/uploads/route.ts`, `src/app/api/uploads/sign/route.ts`).

## 3. Rate limiting

Implemented in `src/lib/security/rate-limit.ts`:

- **Backend:** Upstash Redis (REST) when `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are set; otherwise a real in-memory fixed-window counter with periodic expiry cleanup and a 10,000-key cap (per-instance — documented limitation for multi-instance deployments).
- **Keying:** `getClientIp()` reads the real client IP from `x-forwarded-for` → `x-real-ip` → `'unknown'`.
- **Applied limits (per minute):** QR creation 30 (`qrcodes:create:{userId}`), QR list 120, unlock-token endpoint 10 per IP, abuse reports 5 per IP, upload signing 60 per user (own per-user sliding window in `src/app/api/uploads/sign/route.ts`). Exceeding returns 429.

## 4. Input validation (Zod)

All write APIs validate request bodies/query with Zod `safeParse` and return
400 with flattened field errors — never throwing raw parse errors to the
client:

- `src/app/api/qrcodes/route.ts` — QR creation payload, destination-URL security checks, Safe Browsing verdict handling.
- `src/app/api/qrcodes/[id]/route.ts` — QR update payload with the same URL checks.
- `src/app/api/qrcodes/[id]/unlock/route.ts` — unlock flow, rate-limited to 10/min per IP.
- `src/app/api/reports/route.ts` — report payload: `publicId` (1–32 chars), `reason` enum (`phishing | malware | spam | other`), optional `details` ≤ 500 chars. `details` is validated but intentionally not persisted (the `Report` model has no details field).
- `src/app/api/uploads/route.ts` and `src/app/api/uploads/sign/route.ts` — `kind` enum (`logo | preview`).

## 5. Upload validation (2 MB, SVG sanitization)

`src/app/api/uploads/route.ts` (`runtime = 'nodejs'`):

1. Requires authentication (401 otherwise).
2. Requires multipart form data (400 otherwise).
3. **Size cap:** `MAX_BYTES = 2 * 1024 * 1024` — rejects larger files with 413.
4. **MIME allowlist:** `image/png`, `image/jpeg`, `image/webp`, `image/svg+xml` — 415 otherwise.
5. Returns 503 when Cloudinary is not configured (never crashes).
6. **SVG sanitization:** SVG content passes through `sanitizeSvg()` in `src/lib/cloudinary.ts`, which strips `<script>`/`<style>` elements, `<iframe>`/`<embed>`/`<object>`/`<foreignObject>`, `on*` event attributes, and neutralizes `javascript:` URIs in href/src attributes to `#`. Shapes, paths, text and presentation attributes are preserved.
7. Uploads are namespaced per user in Cloudinary (`nextqrcode/{userId}/logos`).

The companion `src/app/api/uploads/sign/route.ts` issues signed client-side
upload parameters with its own per-user 60/minute rate limit, scoped to
`nextqrcode/{userId}/{logos|previews}` folders.

## 6. SSRF protection

`src/lib/security/abuse.ts` — used by the QR create/update APIs and the
`/r/[publicId]` redirect route:

- `isBlockedScheme()` blocks `javascript:`, `data:`, `vbscript:`, `file:` (case-insensitive, whitespace/control-char tolerant).
- `isPrivateNetworkTarget()` blocks `localhost`, `127.0.0.0/8`, `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, `169.254.0.0/16`, `::1`, `*.local`, plus decimal/octal/hex IP obfuscations (`2130706433`, `0177.0.0.1`, `0x7f.0.0.1`) interpreted with `inet_aton` semantics.
- `matchesLocalBlocklist()` and `isUrlShortener()` provide additional URL hygiene helpers.

## 7. Safe Browsing

`checkSafeBrowsing()` in `src/lib/security/abuse.ts` performs a real Google
Safe Browsing v4 `threatMatches:find` lookup (5s abort timeout) for threat
types `MALWARE`, `SOCIAL_ENGINEERING`, `UNWANTED_SOFTWARE`,
`POTENTIALLY_HARMFUL_APPLICATION` when `GOOGLE_SAFE_BROWSING_API_KEY` is set.
Verdicts: `'threat' | 'clean' | 'unavailable'`. Without a key (or on API
error/timeout) it returns `'unavailable'` — a documented degraded path, never
a fake "clean". Invoked on QR creation (`src/app/api/qrcodes/route.ts`) and
update (`src/app/api/qrcodes/[id]/route.ts`).

## 8. Abuse / report flow

- Public reporting endpoint: `POST /api/reports` (`src/app/api/reports/route.ts`) — rate-limited (5/min per IP), Zod-validated, **never reveals QR existence**: it returns `{ ok: true }` whether or not the QR exists, and persists nothing when the QR is missing.
- Reports persist as `Report` documents (`src/models/Report.ts`) with `qrId`, `reason`, optional `reporterHash`, and `status` (`open | reviewed | dismissed`, default `open`) for moderation triage.
- The reporter's IP is stored only as a daily-rotating HMAC hash (`hashIp()`), not raw.
- Gated QR destinations can require an unlock token (`createUnlockToken`/`verifyUnlockToken` in `src/lib/security/abuse.ts`, issued by `src/app/api/qrcodes/[id]/unlock/route.ts`), so reported/abuse-flagged destinations can be locked behind verification.
- Scan analytics on `/r/[publicId]` store the IP hash and parsed (device/os/browser) user-agent only (`parseUserAgent()`), never raw IPs or full UA strings.

## 9. CSP nonces

Implemented in `src/middleware.ts` (Phase 9); the static global CSP was
removed from `next.config.ts` `securityHeaders` because two CSP headers are
AND-ed by browsers (a static `'unsafe-inline'` policy would silently
re-allow what the nonce policy blocks).

Per page request the middleware:

1. Generates a cryptographically random 128-bit nonce: `Buffer.from(crypto.randomUUID()).toString('base64')`.
2. Sets `x-nonce` on the forwarded request headers so server components can read it with `(await headers()).get('x-nonce')`.
3. Sets the same `Content-Security-Policy` on the request headers — Next.js parses it during SSR and stamps the nonce onto the framework scripts/styles it renders — and on the response headers so the browser enforces it.

The policy keeps every directive from the previous static CSP (AdSense, analytics, fonts) but replaces `'unsafe-inline'` with `'nonce-{nonce}'` on `script-src` and `style-src`.

**Why `'unsafe-eval'` stays:** the Next.js/React runtime requires it — React
uses `eval` for development server-error stack reconstruction, and some
ad/analytics snippets rely on it. It applies to `script-src` only.

**Known limitations (honest):**

- Nonces only take effect on **dynamically rendered** pages: Next.js attaches nonces during SSR, so static pages receive the CSP header but their build-time inline scripts cannot carry a per-request nonce. Keep dynamic-rendering requirements in mind for pages with critical interactivity.
- AdSense injects inline scripts without our nonce; depending on the ad unit, the strict `script-src` may block some ad behaviour — monitor in production and adjust `script-src` sources (not `'unsafe-inline'`) if revenue is affected.
- The middleware matcher runs on page requests only — it excludes `/api/*`, `/_next/*`, and static assets, which intentionally receive no CSP header.

**Deliberately minimal and safe:** the middleware never rewrites or redirects
any path — it only sets headers. It was written this way because a previous
middleware (Phase 8, next-intl-based) broke routes with rewrites.

## 10. Security headers (non-CSP)

Still emitted globally from `next.config.ts` `securityHeaders` for `/:path*`:

- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(self), microphone=(), geolocation=()`
- `X-Frame-Options: DENY`

## 11. Secrets handling

- All secrets are environment variables documented in `.env.example` (never committed — `.env*` is gitignored, see `.gitignore:45-46`).
- Secret-shaped env vars: `AUTH_SECRET` (Auth.js signing), `MONGODB_URI`, `CLOUDINARY_*`, `UPSTASH_REDIS_REST_URL`/`UPSTASH_REDIS_REST_TOKEN`, `GOOGLE_SAFE_BROWSING_API_KEY`, `IP_HASH_SALT` (scan-analytics IP hashing), `AUTH_GOOGLE_ID`/`AUTH_GOOGLE_SECRET`, `EMAIL_SERVER`, `SENTRY_DSN`.
- Public (`NEXT_PUBLIC_*`) values must never contain secrets; the Sentry client DSN is a public key by design (see "Error tracking & analytics" above).
- Rotate `AUTH_SECRET` and `IP_HASH_SALT` if ever exposed: JWT sessions become forgeable and hashed IPs become linkable.
- Verified exposure rule: credentialed MongoDB URIs and similar must never appear in commits — run `gitleaks` (or equivalent) before pushing.

## 12. Dependency security (`npm audit` process)

- `npm audit` on every dependency change and weekly in CI; fix `high`/`critical` findings the same day, `moderate` within the sprint.
- `package-lock.json` is committed; review the diff on dependency updates (new packages, version jumps, changed maintainers).
- `npm run typecheck` (`tsc --noEmit`) and `npm run lint` (`eslint`) are the pre-commit gates alongside `npm run test:run` (vitest).

## 13. Incident response

- **Abuse reports:** triage `Report` documents (`status: open`) in the database; confirm Safe Browsing verdict via `checkSafeBrowsing()`; lock the QR behind an unlock token or delete it. The report endpoint's existence-agnostic responses mean reporters get no signal during triage.
- **Suspected credential leak:** rotate `AUTH_SECRET`, `MONGODB_URI`, `CLOUDINARY_API_SECRET`, `UPSTASH_REDIS_REST_TOKEN` immediately; historical exposure guidance in §11.
- **XSS / injection report:** reproduce with the CSP in report-only? No — CSP is enforced; use the `x-nonce` request header to test which inline script was blocked (browser console names the violated directive).
- **Contacts:** site owner via the `/contact` page form; hosting provider abuse channel for infrastructure-level incidents. (Fill in the concrete on-call contact before production launch.)
