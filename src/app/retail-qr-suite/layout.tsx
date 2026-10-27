import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Retail QR Suite — QR Studio',
  description:
    'A retail toolkit in one place: price-tag QR, product-info QR, review QR, and loyalty QR presets, each generating a real working QR code.',
  alternates: {
    canonical: 'https://freeqrcode.tools/retail-qr-suite',
  },
  openGraph: {
    title: 'Retail QR Suite — QR Studio',
    description:
      'A retail toolkit in one place: price-tag QR, product-info QR, review QR, and loyalty QR presets, each generating a real working QR code.',
    url: 'https://freeqrcode.tools/retail-qr-suite',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Retail QR Suite — QR Studio',
    description:
      'A retail toolkit in one place: price-tag QR, product-info QR, review QR, and loyalty QR presets, each generating a real working QR code.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
