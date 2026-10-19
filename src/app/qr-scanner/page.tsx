import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import { BreadcrumbJsonLd } from '@/lib/seo/jsonld';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { ScannerClient } from './ScannerClient';

export const metadata: Metadata = {
  title: 'QR Code Scanner — Read QR Codes with Camera or Image',
  description:
    'Free online QR code scanner. Scan QR codes with your camera or upload an image. URL safety check included — shortener, HTTP and lookalike-domain warnings. 100% private, in-browser decoding.',
  alternates: { canonical: `${siteConfig.url}/qr-scanner` },
  openGraph: {
    title: 'QR Code Scanner — Read QR Codes with Camera or Image',
    description:
      'Scan QR codes with your camera or upload an image. Built-in URL safety check. Everything runs in your browser.',
    url: `${siteConfig.url}/qr-scanner`,
  },
};

export default function QrScannerPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <BreadcrumbJsonLd
        trail={[
          { name: 'Home', url: '/' },
          { name: 'Tools', url: '/#tools' },
          { name: 'QR Scanner', url: '/qr-scanner' },
        ]}
        baseUrl={siteConfig.url}
      />
      <Breadcrumbs items={[{ label: 'QR Scanner', href: '/qr-scanner' }]} />
      <header className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">QR Code Scanner</h1>
        <p className="text-muted-foreground max-w-2xl">
          Read any QR code with your camera or by uploading an image. If the code contains a link,
          you&apos;ll see a safety analysis of the destination before you decide to open it —
          nothing is ever opened automatically.
        </p>
      </header>
      <ScannerClient />
    </div>
  );
}
