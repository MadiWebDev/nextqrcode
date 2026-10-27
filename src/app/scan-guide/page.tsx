import type { Metadata } from 'next';
import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { loadScanGuide } from '@/content/families/scan-guide';
import { BreadcrumbJsonLd, WebPageJsonLd } from '@/lib/seo/jsonld';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { AdSlot } from '@/components/AdSlot';

const HUB_URL = `${siteConfig.url}/scan-guide`;

export const metadata: Metadata = {
  title: 'QR Code Scanning Guides for Every Device',
  description:
    'Step-by-step QR code scanning guides for iPhone, Samsung, Pixel, Xiaomi, and more — plus fixes for low light, glare, damaged codes, and other scan failures.',
  alternates: { canonical: HUB_URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'QR Code Scanning Guides for Every Device',
    description:
      'Step-by-step QR code scanning guides for iPhone, Samsung, Pixel, Xiaomi, and more — plus fixes for low light, glare, damaged codes, and other scan failures.',
    url: HUB_URL,
    type: 'website',
  },
};

function isTroubleshooting(slug: string): boolean {
  return slug.startsWith('fix-') || slug === 'scan-inverted-qr-codes';
}

export default function ScanGuideHubPage() {
  const entries = loadScanGuide();
  const deviceGuides = entries.filter((e) => !isTroubleshooting(e.slug));
  const troubleshooting = entries.filter((e) => isTroubleshooting(e.slug));

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <BreadcrumbJsonLd
        baseUrl={siteConfig.url}
        trail={[{ name: 'Scan Guides', url: '/scan-guide' }]}
      />
      <WebPageJsonLd
        name="QR Code Scanning Guides for Every Device"
        url={HUB_URL}
        description="Step-by-step QR code scanning guides for iPhone, Samsung, Pixel, Xiaomi, and more — plus fixes for low light, glare, damaged codes, and other scan failures."
      />

      <Breadcrumbs items={[{ label: 'Scan Guides', href: '/scan-guide' }]} />
      <AdSlot id="scan-guide-top" format="horizontal-banner" />

      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">QR Code Scanning Guides</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        Every phone and computer scans QR codes a little differently. These guides show exactly
        where the scanner lives on your device, how to use it step by step, and how to fix the most
        common scanning failures — from low light and glare to damaged codes and curved surfaces.
      </p>

      <section className="mt-10" aria-labelledby="device-guides-heading">
        <h2 id="device-guides-heading" className="text-2xl font-semibold">
          Scan QR codes on your device
        </h2>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {deviceGuides.map((entry) => (
            <li key={entry.slug}>
              <Link
                href={`/scan-guide/${entry.slug}`}
                className="block h-full rounded-lg border p-4 transition-colors hover:bg-muted/50"
              >
                <span className="font-medium">{entry.h1}</span>
                <span className="mt-1 block text-sm text-muted-foreground">
                  {entry.metaDescription}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <AdSlot id="scan-guide-in-content" format="in-article" />
      <section className="mt-12" aria-labelledby="troubleshooting-heading">
        <h2 id="troubleshooting-heading" className="text-2xl font-semibold">
          Fix scanning problems
        </h2>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {troubleshooting.map((entry) => (
            <li key={entry.slug}>
              <Link
                href={`/scan-guide/${entry.slug}`}
                className="block h-full rounded-lg border p-4 transition-colors hover:bg-muted/50"
              >
                <span className="font-medium">{entry.h1}</span>
                <span className="mt-1 block text-sm text-muted-foreground">
                  {entry.metaDescription}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <AdSlot id="scan-guide-pre-related" format="horizontal-banner" />
      <section className="mt-12 rounded-lg border p-6" aria-labelledby="tools-heading">
        <h2 id="tools-heading" className="text-xl font-semibold">
          Useful QR tools
        </h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {[
            { href: '/qr-scanner', label: 'Web QR Scanner' },
            { href: '/qr-safety-checker', label: 'QR Safety Checker' },
            { href: '/qr-size-calculator', label: 'QR Size Calculator' },
            { href: '/error-correction-simulator', label: 'Error Correction Simulator' },
            { href: '/printed-qr-tester', label: 'Printed QR Tester' },
            { href: '/url-qr-code-generator', label: 'URL QR Generator' },
          ].map((tool) => (
            <li key={tool.href}>
              <Link
                href={tool.href}
                className="inline-block rounded-full border px-4 py-2 text-sm hover:bg-muted/50"
              >
                {tool.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <AdSlot id="scan-guide-bottom" format="horizontal-banner" />
    </main>
  );
}
