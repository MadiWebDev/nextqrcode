import { NextRequest, NextResponse } from 'next/server';

/**
 * Next.js 16 Proxy convention (formerly middleware.ts).
 *
 * Safe, minimal header injection:
 * - Generates CSP nonces with standard Web Crypto API.
 * - Supports 'unsafe-inline' so static prerendered pages do not have their
 *   scripts blocked during crawling or browser rendering.
 * - Exports `proxy` (Next.js 16 convention) and `middleware` (for backwards compatibility).
 */
export function proxy(request: NextRequest) {
  let nonce: string;
  try {
    // 128-bit random nonce encoded as base64 using standard Web Crypto
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    nonce = btoa(String.fromCharCode(...bytes));
  } catch {
    nonce = btoa(crypto.randomUUID());
  }

  const contentSecurityPolicy = [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline' 'nonce-${nonce}' 'unsafe-eval' https://pagead2.googlesyndication.com https://www.googletagmanager.com https://analytics.ahrefs.com`,
    `style-src 'self' 'unsafe-inline' 'nonce-${nonce}' https://fonts.googleapis.com`,
    "img-src 'self' data: blob: https:",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://pagead2.googlesyndication.com https://www.google-analytics.com",
    'frame-src https://googleads.g.doubleclick.net',
    "object-src 'none'",
    "base-uri 'self'",
  ].join('; ');

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', contentSecurityPolicy);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  response.headers.set('Content-Security-Policy', contentSecurityPolicy);

  return response;
}

// Backwards compatibility for any runtime looking for `middleware` export
export const middleware = proxy;

export const config = {
  matcher: [
    {
      source:
        '/((?!api|_next|ads\\.txt|robots\\.txt|sitemap\\.xml|favicon\\.ico|manifest\\.webmanifest).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};
