import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Price Tag Maker — QR Studio',
  description:
    'Design printable price tags for your shop in minutes. Add products and prices, pick 90x50, 70x40 or 50x30 mm tags, add a QR code and download a full A4 sheet.',
  alternates: { canonical: 'https://freeqrcode.tools/price-tag-maker' },
  openGraph: {
    title: 'Price Tag Maker — QR Studio',
    description:
      'Design printable price tags for your shop in minutes. Add products and prices, pick 90x50, 70x40 or 50x30 mm tags, add a QR code and download a full A4 sheet.',
    url: 'https://freeqrcode.tools/price-tag-maker',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Price Tag Maker — QR Studio',
    description:
      'Design printable price tags for your shop in minutes. Add products and prices, pick 90x50, 70x40 or 50x30 mm tags, add a QR code and download a full A4 sheet.',
  },
  robots: { index: true, follow: true },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
