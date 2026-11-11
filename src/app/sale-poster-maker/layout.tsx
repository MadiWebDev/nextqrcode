import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Sale Poster Maker — QR Studio',
  description:
    'Make a bold A4 sale poster for your shop window in minutes. Add a headline, discount and dates, pick a colour theme, preview it and download a print-ready PNG.',
  alternates: { canonical: 'https://freeqrcode.tools/sale-poster-maker' },
  openGraph: {
    title: 'Sale Poster Maker — QR Studio',
    description:
      'Make a bold A4 sale poster for your shop window in minutes. Add a headline, discount and dates, pick a colour theme, preview it and download a print-ready PNG.',
    url: 'https://freeqrcode.tools/sale-poster-maker',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sale Poster Maker — QR Studio',
    description:
      'Make a bold A4 sale poster for your shop window in minutes. Add a headline, discount and dates, pick a colour theme, preview it and download a print-ready PNG.',
  },
  robots: { index: true, follow: true },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
