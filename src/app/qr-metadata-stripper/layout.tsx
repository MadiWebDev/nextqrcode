import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'QR Metadata Stripper — QR Studio',
  description:
    'Strip EXIF and other container metadata from a QR image before you share it. The image is redrawn through a canvas in your browser and exported as a fresh PNG built from pixels only — nothing is uploaded.',
  alternates: {
    canonical: 'https://freeqrcode.tools/qr-metadata-stripper',
  },
  openGraph: {
    title: 'QR Metadata Stripper — QR Studio',
    description:
      'Strip EXIF and other container metadata from a QR image before you share it. The image is redrawn through a canvas in your browser and exported as a fresh PNG built from pixels only — nothing is uploaded.',
    url: 'https://freeqrcode.tools/qr-metadata-stripper',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QR Metadata Stripper — QR Studio',
    description:
      'Strip EXIF and other container metadata from a QR image before you share it. The image is redrawn through a canvas in your browser and exported as a fresh PNG built from pixels only — nothing is uploaded.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
