import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllSizeGuides } from '@/data/size-guides';
import { siteConfig } from '@/config/site';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { BreadcrumbJsonLd, WebPageJsonLd } from '@/lib/seo/jsonld';
import { Ruler, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: `QR Code Size Guide: Print Sizes for Every Use Case | ${siteConfig.name}`,
  description:
    'How big should a QR code be? Size guides for 26 real-world uses — business cards, packaging, billboards, menus, TV screens and more — with print specs and placement tips.',
  alternates: { canonical: `${siteConfig.url}/qr-size-guide` },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'QR Code Size Guide: Print Sizes for Every Use Case',
    description:
      'How big should a QR code be? Size guides for 26 real-world uses — business cards, packaging, billboards, menus, TV screens and more.',
    type: 'website',
    url: `${siteConfig.url}/qr-size-guide`,
  },
};

export default function SizeGuideHubPage() {
  const guides = getAllSizeGuides();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <BreadcrumbJsonLd
        baseUrl={siteConfig.url}
        trail={[
          { name: 'Home', url: '/' },
          { name: 'QR Size Guides', url: '/qr-size-guide' },
        ]}
      />
      <WebPageJsonLd
        name="QR Code Size Guide: Print Sizes for Every Use Case"
        url={`${siteConfig.url}/qr-size-guide`}
        description="How big should a QR code be? Size guides for 26 real-world uses with print specs and placement tips."
      />

      <Breadcrumbs items={[{ label: 'QR Size Guides', href: '/qr-size-guide' }]} />

      <header className="mb-10 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <Ruler className="w-3.5 h-3.5" />
          <span>Print & Display Sizing</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          QR Code Size Guides
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          How big should a QR code be? It depends on scan distance, lighting, and substrate. These{' '}
          {guides.length} practical guides give you a recommended size, print specifications, and
          placement tips for every common use case — from business cards to billboards. Sizes are
          practical rules of thumb (based on the 10:1 distance-to-size ratio), not guarantees.
        </p>
      </header>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {guides.map((guide) => (
          <article
            key={guide.slug}
            className="flex flex-col justify-between border border-border/70 rounded-2xl p-6 bg-card hover:shadow-lg transition-all hover:border-primary/40 group"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                <span className="px-2 py-0.5 rounded-md bg-muted font-medium text-foreground/80">
                  {guide.useCase}
                </span>
                <span className="font-mono">
                  {guide.recommendedSizeMm}×{guide.recommendedSizeMm}mm
                </span>
              </div>
              <h2 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors leading-snug mb-3">
                <Link href={`/qr-size-guide/${guide.slug}`}>{guide.title}</Link>
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-4">
                {guide.metaDescription}
              </p>
            </div>
            <div className="pt-4 border-t border-border/50">
              <Link
                href={`/qr-size-guide/${guide.slug}`}
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary group-hover:translate-x-0.5 transition-transform"
              >
                <span>Read Guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </article>
        ))}
      </div>

      <section className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-bold text-base sm:text-lg text-foreground">
              Need an exact number for your project?
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Enter your scan distance, substrate, and lighting to get a tailored size
              recommendation from the calculator.
            </p>
          </div>
          <Link
            href="/qr-size-calculator"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs sm:text-sm font-semibold hover:opacity-95 transition-opacity shrink-0"
          >
            <span>Open Size Calculator</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
