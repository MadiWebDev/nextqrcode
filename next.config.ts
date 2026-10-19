import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

/**
 * Security headers applied to every route.
 *
 * Content-Security-Policy is NOT here on purpose: it is owned per-request by
 * `src/middleware.ts`, which generates a fresh cryptographically random nonce
 * for every page request and emits a nonce-based CSP
 * (`'nonce-{nonce}'` on `script-src`/`style-src`, no `'unsafe-inline'`).
 * Keeping a static global CSP in `headers()` alongside the middleware would
 * either duplicate the header (two CSP headers are AND-ed by browsers, so the
 * static `'unsafe-inline'` policy would silently re-allow what the nonce
 * policy blocks) or override it — hence it was removed here (Phase 9).
 *
 * API routes and static assets intentionally receive no CSP: middleware does
 * not run for them by design (`config.matcher` excludes `/api/*`, `/_next/*`
 * and static files), and a CSP on JSON/API responses or hashed static
 * bundles adds no protection while risking breakage.
 *
 * `'unsafe-eval'` remains in the middleware's `script-src` only — the Next.js
 * runtime requires it (React uses `eval` for dev-mode server error stack
 * reconstruction, and ad/analytics snippets may rely on it). Documented in
 * `src/middleware.ts` and `docs/SECURITY.md`.
 */
const securityHeaders = [
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(self), microphone=(), geolocation=()',
  },
  { key: 'X-Frame-Options', value: 'DENY' },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
  /**
   * Legacy / convenience redirects. Each entry is justified in-repo:
   * - /home: no such route exists; direct-navigation typo guard for the home page.
   */
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

export default createNextIntlPlugin('./src/i18n/request.ts')(nextConfig);
