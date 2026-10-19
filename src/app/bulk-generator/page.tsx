import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import { BreadcrumbJsonLd } from '@/lib/seo/jsonld';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { BulkClient } from './BulkClient';
import { AdSlot } from '@/components/AdSlot';

export const metadata: Metadata = {
  title: 'Bulk QR Code Generator — CSV to ZIP',
  description:
    'Generate up to 500 QR codes at once from a list of payloads. Paste text or CSV with payload,filename columns, choose PNG or SVG, and download everything as a ZIP. 100% in-browser — your data never leaves your device.',
  alternates: { canonical: `${siteConfig.url}/bulk-generator` },
  openGraph: {
    title: 'Bulk QR Code Generator — CSV to ZIP',
    description:
      'Generate up to 500 QR codes at once, download them as a ZIP. Runs entirely in your browser.',
    url: `${siteConfig.url}/bulk-generator`,
  },
};

export default function BulkGeneratorPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <BreadcrumbJsonLd
        trail={[
          { name: 'Home', url: '/' },
          { name: 'Tools', url: '/#tools' },
          { name: 'Bulk QR Generator', url: '/bulk-generator' },
        ]}
        baseUrl={siteConfig.url}
      />
      <Breadcrumbs items={[{ label: 'Bulk QR Generator', href: '/bulk-generator' }]} />
      <header className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Bulk QR Code Generator</h1>
        <p className="text-muted-foreground max-w-2xl">
          Turn a list of URLs, text, or WiFi credentials into QR codes in one shot. Paste your rows,
          pick PNG or SVG with your error-correction level, and download a ready-to-use{' '}
          <code className="text-foreground">qr-bulk.zip</code>. Everything runs locally in your
          browser.
        </p>
      </header>
      <BulkClient />
      <AdSlot id="bulk-generator-after-tool" format="horizontal-banner" />
    </div>
  );
}
