import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Church QR Suite — QR Studio',
  description:
    'A church toolkit in one place: service-sheet QR, donation QR, event QR, and prayer-request QR presets, each generating a real working QR code.',
  alternates: {
    canonical: 'https://freeqrcode.tools/church-qr-suite',
  },
  openGraph: {
    title: 'Church QR Suite — QR Studio',
    description:
      'A church toolkit in one place: service-sheet QR, donation QR, event QR, and prayer-request QR presets, each generating a real working QR code.',
    url: 'https://freeqrcode.tools/church-qr-suite',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Church QR Suite — QR Studio',
    description:
      'A church toolkit in one place: service-sheet QR, donation QR, event QR, and prayer-request QR presets, each generating a real working QR code.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
