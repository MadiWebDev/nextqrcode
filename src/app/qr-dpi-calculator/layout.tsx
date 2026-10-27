import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'QR DPI Calculator — QR Studio',
  description:
    'Work out the pixel dimensions a QR code needs at your target print size and DPI, and get export guidance so the printed code stays sharp instead of soft and blobby.',
  alternates: {
    canonical: 'https://freeqrcode.tools/qr-dpi-calculator',
  },
  openGraph: {
    title: 'QR DPI Calculator — QR Studio',
    description:
      'Work out the pixel dimensions a QR code needs at your target print size and DPI, and get export guidance so the printed code stays sharp instead of soft and blobby.',
    url: 'https://freeqrcode.tools/qr-dpi-calculator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QR DPI Calculator — QR Studio',
    description:
      'Work out the pixel dimensions a QR code needs at your target print size and DPI, and get export guidance so the printed code stays sharp instead of soft and blobby.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
