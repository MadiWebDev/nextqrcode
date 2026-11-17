import { NextRequest, NextResponse } from 'next/server';
import { isRemoved } from '@/lib/seo/indexing-policy';

/**
 * Body served with the Step 5 removal 410s: a small real page (not a
 * bare status) so a human who follows an old link lands somewhere
 * honest. Kept in the proxy because removed paths must answer 410
 * before routing, and several of them are generated routes whose page
 * files still exist in the tree.
 */
const GONE_BODY = `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><title>Page removed | QR Studio</title><meta name="robots" content="noindex"></head>
<body><main><h1>This page has been removed</h1><p>This page was withdrawn during a content-quality review and is no longer published. Current guides and tools are on the <a href="https://freeqrcode.tools/">QR Studio home page</a>.</p></main></body>
</html>`;

/**
 * Next.js 16 Proxy convention (formerly middleware.ts).
 *
 * Header injection + subdomain routing.
 *
 * CSP note — why there is deliberately NO nonce in this policy:
 * every page on this site is statically prerendered (SSG). Next.js can only
 * stamp a nonce onto its inline scripts during dynamic rendering (see the
 * framework's CSP guide: "To use a nonce, your page must be dynamically
 * rendered... Static pages are generated at build time, so no nonce can be
 * injected"). The prerendered HTML therefore ships inline scripts — most
 * importantly the React flight-data scripts (`self.__next_f.push(...)`) —
 * with NO nonce attribute, and under CSP3 a nonce in script-src makes the
 * browser IGNORE 'unsafe-inline', so those inline scripts are refused and
 * hydration never runs: the whole site renders but is completely inert
 * (this killed the invoice workspace's dropdowns, totals, save and PDF
 * buttons, and earlier blocked an inline <style> the same way). A nonce
 * that can never be applied protects nothing; the policy below keeps
 * 'unsafe-inline' effective for the framework's own inline bootstrap while
 * external script origins stay restricted to 'self' + the named ad and
 * analytics hosts.
 *
 * Exports `proxy` (Next.js 16 convention) and `middleware` (for backwards compatibility).
 */
/**
 * Subdomain site: invoicegenerator.freeqrcode.tools serves the standalone
 * invoice generator app (route /invoice-site) as its own site. The host is
 * centralised here so renaming the subdomain is a one-line change.
 */
const INVOICE_SITE_HOST = 'invoicegenerator.freeqrcode.tools';

/**
 * Image Resizer site: imageresizer.freeqrcode.tools serves the standalone
 * image toolkit (route /imageresizer-site) as its own site, same pattern.
 */
const IMAGE_RESIZER_SITE_HOST = 'imageresizer.freeqrcode.tools';

/**
 * Invoice-family tool pages that also live on the subdomain under their own
 * paths (e.g. invoicegenerator.freeqrcode.tools/quote-generator). On the
 * invoice host these are served as-is instead of being prefixed with
 * /invoice-site, so the whole invoice tool family shows on the subdomain.
 */
const INVOICE_TOOL_PATHS = new Set(['/invoice-generator', '/quote-generator', '/receipt-generator']);

export function proxy(request: NextRequest) {
  const contentSecurityPolicy = [
    "default-src 'self'",
    // AdSense needs doubleclick + *.googlesyndication.com, not just pagead2.
    // Adsterra (bauval.org) is included so existing AdSlot banners are not
    // CSP-blocked; set NEXT_PUBLIC_ADSTERRA_ENABLED=false to pause Adsterra
    // during an AdSense review (see src/components/ads/AdSlot.tsx).
    // No 'nonce-…' here on purpose — see the CSP note at the top of this file.
    `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://pagead2.googlesyndication.com https://*.googlesyndication.com https://googleads.g.doubleclick.net https://bauval.org https://www.googletagmanager.com https://analytics.ahrefs.com`,
    `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
    "img-src 'self' data: blob: https: https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://pagead2.googlesyndication.com https://www.google-analytics.com",
    'frame-src https://googleads.g.doubleclick.net https://*.googlesyndication.com https://bauval.org',
    "object-src 'none'",
    "base-uri 'self'",
  ].join('; ');

  const requestHeaders = new Headers(request.headers);

  // Subdomain routing: the invoice site host rewrites to /invoice-site/*,
  // except the invoice-family tool paths, which are served under their own
  // paths on the subdomain too.
  const host = (request.headers.get('host') ?? request.nextUrl.hostname)
    .split(':')[0]
    .toLowerCase();

  // Canonical host (Step 5): www permanently redirects to the apex with
  // a 308. Search engines were served a temporary 307 for www → apex
  // (seo-agent E-014), and no www redirect existed anywhere in this
  // repo before this change — if production still answers 307 after
  // this deploys, the redirect is produced by the hosting platform's
  // domain settings, which application code cannot override (E-053).
  if (host === 'www.freeqrcode.tools') {
    const url = request.nextUrl.clone();
    url.protocol = 'https:';
    url.hostname = 'freeqrcode.tools';
    url.port = '';
    return NextResponse.redirect(url, 308);
  }

  // Static-asset guard: files served from /public (logos, icons, images)
  // must NOT be rewritten into the site route trees. Without this, a request
  // for /invoice-logo.svg on the invoice host was rewritten to
  // /invoice-site/invoice-logo.svg and 404'd — the live invoice header logo
  // and favicon were broken by exactly this (a band-aid copy at
  // public/invoice-site/invoice-logo.svg also exists and keeps working).
  // Page routes on these hosts never carry a file extension, so exempting
  // extensioned paths changes nothing for pages. robots.txt, sitemap.xml
  // and favicon.ico never reach this function at all (see the matcher).
  const isStaticAsset = /\.[a-z0-9]+$/i.test(request.nextUrl.pathname);
  if (
    host === IMAGE_RESIZER_SITE_HOST &&
    !isStaticAsset &&
    !request.nextUrl.pathname.startsWith('/imageresizer-site')
  ) {
    const url = request.nextUrl.clone();
    url.pathname = '/imageresizer-site' + (url.pathname === '/' ? '' : url.pathname);
    const rewriteResponse = NextResponse.rewrite(url, {
      request: { headers: requestHeaders },
    });
    rewriteResponse.headers.set('Content-Security-Policy', contentSecurityPolicy);
    return rewriteResponse;
  }
  if (
    host === INVOICE_SITE_HOST &&
    !isStaticAsset &&
    !request.nextUrl.pathname.startsWith('/invoice-site') &&
    !INVOICE_TOOL_PATHS.has(request.nextUrl.pathname)
  ) {
    const url = request.nextUrl.clone();
    url.pathname = '/invoice-site' + (url.pathname === '/' ? '' : url.pathname);
    const rewriteResponse = NextResponse.rewrite(url, {
      request: { headers: requestHeaders },
    });
    rewriteResponse.headers.set('Content-Security-Policy', contentSecurityPolicy);
    return rewriteResponse;
  }

  // Step 5, removal activation — DO NOT MERGE before the fresh-export
  // re-verification of the 87 (see seo-agent/STATE.md): paths the
  // indexing policy classifies REMOVE answer a real 410 Gone. This
  // point is reached only by apex-site requests — the two subdomain
  // hosts returned rewrites above and www was redirected — and the
  // policy lookup is an exact-path Set check, so it stays cheap. The
  // invoice tool paths that fall through on the invoice host are not
  // in the REMOVE set, so the subdomain sites are unaffected.
  if (isRemoved(request.nextUrl.pathname)) {
    const gone = new NextResponse(GONE_BODY, {
      status: 410,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
    gone.headers.set('Content-Security-Policy', contentSecurityPolicy);
    return gone;
  }

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

