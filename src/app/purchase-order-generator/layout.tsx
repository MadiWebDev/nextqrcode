import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Purchase Order Generator — QR Studio',
  description:
    'Free purchase order generator: create professional POs with SKU items, supplier and ship-to blocks, shipping, tax, terms, PDF download and signature line.',
  alternates: { canonical: 'https://freeqrcode.tools/purchase-order-generator' },
  openGraph: {
    title: 'Purchase Order Generator — QR Studio',
    description:
      'Free purchase order generator: create professional POs with SKU items, supplier and ship-to blocks, shipping, tax, terms, PDF download and signature line.',
    url: 'https://freeqrcode.tools/purchase-order-generator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Purchase Order Generator — QR Studio',
    description:
      'Free purchase order generator: create professional POs with SKU items, supplier and ship-to blocks, shipping, tax, terms, PDF download and signature line.',
  },
  robots: { index: true, follow: true },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
