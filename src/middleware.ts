import { NextRequest, NextResponse } from 'next/server';

/**
 * Headers-only middleware (Phase 9 — CSP nonces).
 *
 * This middleware is intentionally MINIMAL and SAFE:
 * - It NEVER rewrites, redirects, or short-circuits any path.
 * - It runs on page requests only (see `config.matcher`), and its only job
 *   is to generate a fresh per-request CSP nonce, expose it to server
 *   components via the `x-nonce` request header, and emit the nonce-based
 *   Content-Security-Policy on both the request (so Next.js SSR can attach
 *   the nonce to the inline scripts/styles it renders) and the response
 *   (so the browser enforces the policy).
 *
 * Directive lineage: every source here comes from the transitional CSP that
 * used to live in `next.config.ts` `securityHeaders`; only 'unsafe-inline'
 * was dropped from `script-src`/`style-src` in favour of the per-request
 * `'nonce-{nonce}'`. Everything else (AdSense, analytics, fonts) is kept so
 * third-party integrations keep working.
 *
 * Why 'unsafe-eval' stays: Next.js / React compile and evaluate code at
 * runtime in development (React uses `eval` for server-error stack
 * reconstruction), and some third-party ad/analytics snippets still rely on
 * it. Removing it entirely breaks the Next.js runtime, so it remains a
 * documented, narrowly-scoped exception on `script-src` only.
 *
 * Server components can read the nonce with:
 *   import { headers } from 'next/headers';
 *   const nonce = (await headers()).get('x-nonce');
 *
 * Note: nonces only take effect on dynamically rendered pages (Next.js
 * attaches nonces during SSR). Static pages still receive the CSP header,
 * but their pre-generated inline scripts cannot carry a per-request nonce —
 * see docs/SECURITY.md ("CSP nonces" section) for the implications.
 */
export function middleware(request: NextRequest) {
  // 128-bit nonce, base64-encoded. crypto.randomUUID() is the Web Crypto
  // API available in the middleware runtime; Buffer is provided by Next.
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');

  const contentSecurityPolicy = [
    "default-src 'self'",
    // 'unsafe-eval' is required by the Next.js/React runtime (see comment above).
    `script-src 'self' 'nonce-${nonce}' 'unsafe-eval' https://pagead2.googlesyndication.com https://www.googletagmanager.com https://analytics.ahrefs.com`,
    `style-src 'self' 'nonce-${nonce}' https://fonts.googleapis.com`,
    "img-src 'self' data: blob: https:",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://pagead2.googlesyndication.com https://www.google-analytics.com",
    'frame-src https://googleads.g.doubleclick.net',
    "object-src 'none'",
    "base-uri 'self'",
  ].join('; ');

  // Forward the nonce + CSP to the origin request: Next.js parses the
  // Content-Security-Policy request header during SSR and stamps the nonce
  // onto the framework scripts/styles it renders.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', contentSecurityPolicy);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  // And enforce the same policy in the browser via the response header.
  response.headers.set('Content-Security-Policy', contentSecurityPolicy);

  return response;
}

/**
 * Page requests only — never API routes, never Next.js internals, never
 * static assets. The matcher deliberately has no rewrite/redirect behaviour
 * to depend on, so even an unexpected match is harmless (headers only).
 */
export const config = {
  matcher: [
    {
      source:
        '/((?!api|_next|ads\\.txt|robots\\.txt|sitemap\\.xml|favicon\\.ico|manifest\\.webmanifest).*)',
      // Skip router prefetches: they are RSC payloads, not documents.
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};
