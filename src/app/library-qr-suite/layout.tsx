import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Library QR Suite — QR Studio',
  description:
    'Build catalogue, event, membership, and book-label QR codes. Pick a preset, fill in the details, and download a working code for shelves, posters, and books.',
  alternates: {
    canonical: 'https://freeqrcode.tools/library-qr-suite',
  },
  openGraph: {
    title: 'Library QR Suite — QR Studio',
    description:
      'Build catalogue, event, membership, and book-label QR codes. Pick a preset, fill in the details, and download a working code for shelves, posters, and books.',
    url: 'https://freeqrcode.tools/library-qr-suite',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Library QR Suite — QR Studio',
    description:
      'Build catalogue, event, membership, and book-label QR codes. Pick a preset, fill in the details, and download a working code for shelves, posters, and books.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
