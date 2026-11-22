'use client';

/**
 * The apex WebSite JSON-LD, suppressed on the two subdomain trees that
 * carry their own WebSite entity (invoice-site, socialcalendar-site).
 *
 * Why a client component: the root layout is shared by all five route
 * trees and Server Components have no static-safe way to know which
 * tree is being rendered (headers() would deopt every page out of
 * static generation — this site is fully prerendered). usePathname()
 * is the established exception already used by AppHeader on every page:
 * during prerendering it yields the internal route path
 * ("/invoice-site/…"), which identifies the tree; after hydration on a
 * subdomain host the browser path is unprefixed (the proxy rewrites
 * internally), so the client-side check uses the hostname instead.
 * The two rules agree on all five production hosts — the proxy 301s
 * any cross-host tree URL to the tree's own host, so a tree's pages
 * are only ever hydrated on their own host — which keeps the first
 * client render identical to the prerendered HTML (no hydration
 * mismatch) and the rendered DOM duplicate-free.
 *
 * The invoice and social-calendar layouts emit their own WebSite
 * entity (server-rendered); this component must therefore render
 * nothing on those trees, or the pages would carry two WebSite
 * entities again (audit: CLAUDE-SEO-AUDIT.md, Batch 2).
 */
import { usePathname } from 'next/navigation';
import { JsonLd } from '@/lib/seo/jsonld';
import { siteConfig } from '@/config/site';

const SUB_SITE_PATH_PREFIXES = ['/invoice-site', '/socialcalendar-site'];
const SUB_SITE_HOSTS = new Set([
  'invoicegenerator.freeqrcode.tools',
  'socialcalendar.freeqrcode.tools',
]);

export function WebSiteSchema() {
  const pathname = usePathname() ?? '';
  const pathIsSubSite = SUB_SITE_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
  const hostIsSubSite =
    typeof window !== 'undefined' && SUB_SITE_HOSTS.has(window.location.hostname);
  if (pathIsSubSite || hostIsSubSite) return null;
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: siteConfig.name,
        url: siteConfig.url,
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${siteConfig.url}/sitemap-page?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      }}
    />
  );
}
