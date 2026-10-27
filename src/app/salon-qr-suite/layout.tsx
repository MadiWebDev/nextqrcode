import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Salon QR Suite — QR Studio',
  description:
    'A salon toolkit in one place: booking QR, price-list QR, stylist-profile QR, and review QR presets, each generating a real working QR code.',
  alternates: {
    canonical: 'https://freeqrcode.tools/salon-qr-suite',
  },
  openGraph: {
    title: 'Salon QR Suite — QR Studio',
    description:
      'A salon toolkit in one place: booking QR, price-list QR, stylist-profile QR, and review QR presets, each generating a real working QR code.',
    url: 'https://freeqrcode.tools/salon-qr-suite',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Salon QR Suite — QR Studio',
    description:
      'A salon toolkit in one place: booking QR, price-list QR, stylist-profile QR, and review QR presets, each generating a real working QR code.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
