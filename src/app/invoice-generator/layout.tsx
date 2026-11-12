import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Free Invoice Generator — QR Studio',
  description:
    'Free invoice generator: build professional invoices with line items, discounts, GST or VAT, six currencies, live preview, PDF download and optional payment QR.',
  alternates: { canonical: 'https://freeqrcode.tools/invoice-generator' },
  openGraph: {
    title: 'Free Invoice Generator — QR Studio',
    description:
      'Free invoice generator: build professional invoices with line items, discounts, GST or VAT, six currencies, live preview, PDF download and optional payment QR.',
    url: 'https://freeqrcode.tools/invoice-generator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Invoice Generator — QR Studio',
    description:
      'Free invoice generator: build professional invoices with line items, discounts, GST or VAT, six currencies, live preview, PDF download and optional payment QR.',
  },
  robots: { index: true, follow: true },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
