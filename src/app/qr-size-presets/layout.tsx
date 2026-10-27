import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'QR Size Presets — QR Studio',
  description:
    'Pick a use case — business card, flyer, poster, billboard — and get exact QR dimensions in mm, inches, and pixels with a preview box.',
  alternates: {
    canonical: 'https://freeqrcode.tools/qr-size-presets',
  },
  openGraph: {
    title: 'QR Size Presets — QR Studio',
    description:
      'Pick a use case — business card, flyer, poster, billboard — and get exact QR dimensions in mm, inches, and pixels with a preview box.',
    url: 'https://freeqrcode.tools/qr-size-presets',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QR Size Presets — QR Studio',
    description:
      'Pick a use case — business card, flyer, poster, billboard — and get exact QR dimensions in mm, inches, and pixels with a preview box.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
