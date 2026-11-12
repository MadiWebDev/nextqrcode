import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Quote Generator — QR Studio',
  description:
    'Create professional quotations and estimates free in your browser. Add line items, discounts and tax, set a validity date and download a polished PDF quote.',
  alternates: { canonical: 'https://freeqrcode.tools/quote-generator' },
  openGraph: {
    title: 'Quote Generator — QR Studio',
    description:
      'Create professional quotations and estimates free in your browser. Add line items, discounts and tax, set a validity date and download a polished PDF quote.',
    url: 'https://freeqrcode.tools/quote-generator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Quote Generator — QR Studio',
    description:
      'Create professional quotations and estimates free in your browser. Add line items, discounts and tax, set a validity date and download a polished PDF quote.',
  },
  robots: { index: true, follow: true },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
