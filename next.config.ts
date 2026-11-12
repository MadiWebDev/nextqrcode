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

/**
 * CDN cache headers for public content routes.
 *
 * These sections are statically generated, carry no authenticated or
 * per-user content, and change only when new content is published — so a
 * CDN may serve them from cache for a day and serve stale copies for a week
 * while revalidating in the background. That cuts TTFB for visitors and for
 * Googlebot, which was postponing crawls on this site. Sitemap and robots
 * get a shorter one-hour cache so newly published pages are discovered
 * promptly.
 */
const CONTENT_CACHE = 'public, s-maxage=86400, stale-while-revalidate=604800';
const DISCOVERY_CACHE = 'public, s-maxage=3600, stale-while-revalidate=86400';

const contentCacheRoutes = [
  '/blog/:path*',
  '/industries/:path*',
  '/glossary/:path*',
  '/scan-guide/:path*',
  '/qr-size-guide/:path*',
  '/templates/:path*',
  '/tools',
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
      ...contentCacheRoutes.map((source) => ({
        source,
        headers: [{ key: 'Cache-Control', value: CONTENT_CACHE }],
      })),
      {
        source: '/sitemap.xml',
        headers: [{ key: 'Cache-Control', value: DISCOVERY_CACHE }],
      },
      {
        source: '/robots.txt',
        headers: [{ key: 'Cache-Control', value: DISCOVERY_CACHE }],
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

