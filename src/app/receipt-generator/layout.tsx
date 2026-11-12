import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Receipt Generator — QR Studio',
  description:
    'Create free printable receipts with items, tax, cash change and an 80mm thermal layout. Download a clean PDF receipt for shops, cafes and salons in seconds.',
  alternates: { canonical: 'https://freeqrcode.tools/receipt-generator' },
  openGraph: {
    title: 'Receipt Generator — QR Studio',
    description:
      'Create free printable receipts with items, tax, cash change and an 80mm thermal layout. Download a clean PDF receipt for shops, cafes and salons in seconds.',
    url: 'https://freeqrcode.tools/receipt-generator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Receipt Generator — QR Studio',
    description:
      'Create free printable receipts with items, tax, cash change and an 80mm thermal layout. Download a clean PDF receipt for shops, cafes and salons in seconds.',
  },
  robots: { index: true, follow: true },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
