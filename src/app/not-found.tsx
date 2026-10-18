import type { Metadata } from 'next';
import Link from 'next/link';
import { siteConfig, footerNav } from '@/config/site';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: `Page not found | ${siteConfig.name}`,
  description:
    'The page you were looking for does not exist. Find QR generators, tools and guides.',
  robots: { index: false, follow: true },
};

/** Helpful 404 — search-friendly links instead of a dead end. */
export default function NotFound() {
  const popular = footerNav[1].links.slice(0, 6);
  return (
    <div className="page-wrap">
      <div className="max-w-xl mx-auto text-center space-y-6 py-16">
        <p className="font-display text-7xl text-brand" aria-hidden="true">
          404
        </p>
        <h1 className="page-h1">This page doesn&apos;t exist</h1>
        <p className="page-prose">
          The link may be mistyped, or the page may have moved. Here are popular destinations:
        </p>
        <ul className="grid grid-cols-2 gap-2 text-left">
          {popular.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="block rounded-lg border border-border px-4 py-3 text-sm font-medium hover:border-brand hover:text-brand transition-colors"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex gap-3 justify-center">
          <Button asChild>
            <Link href="/">Back to home</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/sitemap-page">View sitemap</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
