import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Pharmacy QR Suite — QR Studio',
  description:
    'A pharmacy toolkit in one place: refill QR, medication-info QR, opening-hours QR, and feedback QR presets, each generating a real working QR code.',
  alternates: {
    canonical: 'https://freeqrcode.tools/pharmacy-qr-suite',
  },
  openGraph: {
    title: 'Pharmacy QR Suite — QR Studio',
    description:
      'A pharmacy toolkit in one place: refill QR, medication-info QR, opening-hours QR, and feedback QR presets, each generating a real working QR code.',
    url: 'https://freeqrcode.tools/pharmacy-qr-suite',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pharmacy QR Suite — QR Studio',
    description:
      'A pharmacy toolkit in one place: refill QR, medication-info QR, opening-hours QR, and feedback QR presets, each generating a real working QR code.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
