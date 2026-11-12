import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Delivery Note / Challan Generator — QR Studio',
  description:
    'Free delivery note and challan generator: create dispatch notes with items, vehicle and driver details, optional prices, signed receipt and PDF.',
  alternates: { canonical: 'https://freeqrcode.tools/delivery-note-generator' },
  openGraph: {
    title: 'Delivery Note / Challan Generator — QR Studio',
    description:
      'Free delivery note and challan generator: create dispatch notes with items, vehicle and driver details, optional prices, signed receipt and PDF.',
    url: 'https://freeqrcode.tools/delivery-note-generator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Delivery Note / Challan Generator — QR Studio',
    description:
      'Free delivery note and challan generator: create dispatch notes with items, vehicle and driver details, optional prices, signed receipt and PDF.',
  },
  robots: { index: true, follow: true },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
