import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Proforma Invoice Generator — QR Studio',
  description:
    'Free proforma invoice generator for customs, quotations and advance payments: line items, discount and GST/VAT, validity date, PDF and payment QR.',
  alternates: { canonical: 'https://freeqrcode.tools/proforma-invoice-generator' },
  openGraph: {
    title: 'Proforma Invoice Generator — QR Studio',
    description:
      'Free proforma invoice generator for customs, quotations and advance payments: line items, discount and GST/VAT, validity date, PDF and payment QR.',
    url: 'https://freeqrcode.tools/proforma-invoice-generator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Proforma Invoice Generator — QR Studio',
    description:
      'Free proforma invoice generator for customs, quotations and advance payments: line items, discount and GST/VAT, validity date, PDF and payment QR.',
  },
  robots: { index: true, follow: true },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
