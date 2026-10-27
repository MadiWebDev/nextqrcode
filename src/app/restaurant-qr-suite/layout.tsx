import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Restaurant QR Suite — QR Studio',
  description:
    'A restaurant toolkit in one place: menu QR, table-tent QR, review QR, and order-ahead presets, each generating a real working QR code.',
  alternates: {
    canonical: 'https://freeqrcode.tools/restaurant-qr-suite',
  },
  openGraph: {
    title: 'Restaurant QR Suite — QR Studio',
    description:
      'A restaurant toolkit in one place: menu QR, table-tent QR, review QR, and order-ahead presets, each generating a real working QR code.',
    url: 'https://freeqrcode.tools/restaurant-qr-suite',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Restaurant QR Suite — QR Studio',
    description:
      'A restaurant toolkit in one place: menu QR, table-tent QR, review QR, and order-ahead presets, each generating a real working QR code.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
