import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'QR Code Rotator — QR Studio',
  description:
    'Rotate a QR image by 90, 180, or 270 degrees, or any arbitrary angle, in-browser and download the result.',
  alternates: {
    canonical: 'https://freeqrcode.tools/qr-code-rotator',
  },
  openGraph: {
    title: 'QR Code Rotator — QR Studio',
    description:
      'Rotate a QR image by 90, 180, or 270 degrees, or any arbitrary angle, in-browser and download the result.',
    url: 'https://freeqrcode.tools/qr-code-rotator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QR Code Rotator — QR Studio',
    description:
      'Rotate a QR image by 90, 180, or 270 degrees, or any arbitrary angle, in-browser and download the result.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
