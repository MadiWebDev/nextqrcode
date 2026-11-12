import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Free Commercial Invoice Generator for Export & Customs — QR Studio',
  description:
    'Free commercial invoice generator for exporters: HS codes, country of origin, weights, Incoterms, freight and insurance, customs declaration, live preview and PDF download.',
  alternates: { canonical: 'https://freeqrcode.tools/commercial-invoice-generator' },
  openGraph: {
    title: 'Free Commercial Invoice Generator for Export & Customs — QR Studio',
    description:
      'Free commercial invoice generator for exporters: HS codes, country of origin, weights, Incoterms, freight and insurance, customs declaration, live preview and PDF download.',
    url: 'https://freeqrcode.tools/commercial-invoice-generator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Commercial Invoice Generator for Export & Customs — QR Studio',
    description:
      'Free commercial invoice generator for exporters: HS codes, country of origin, weights, Incoterms, freight and insurance, customs declaration, live preview and PDF download.',
  },
  robots: { index: true, follow: true },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
