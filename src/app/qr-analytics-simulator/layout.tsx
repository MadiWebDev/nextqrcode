import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'QR Analytics Simulator — QR Studio',
  description:
    'Enter your own assumptions — prints, scan rate, conversion — and see projected scans and conversions with every formula shown.',
  alternates: {
    canonical: 'https://freeqrcode.tools/qr-analytics-simulator',
  },
  openGraph: {
    title: 'QR Analytics Simulator — QR Studio',
    description:
      'Enter your own assumptions — prints, scan rate, conversion — and see projected scans and conversions with every formula shown.',
    url: 'https://freeqrcode.tools/qr-analytics-simulator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QR Analytics Simulator — QR Studio',
    description:
      'Enter your own assumptions — prints, scan rate, conversion — and see projected scans and conversions with every formula shown.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
