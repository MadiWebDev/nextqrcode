import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'QR to PDF Converter — QR Studio',
  description:
    'Convert a QR image or text into a printable one-page PDF with title, instructions, and quiet-zone-safe margins.',
  alternates: {
    canonical: 'https://freeqrcode.tools/qr-to-pdf-converter',
  },
  openGraph: {
    title: 'QR to PDF Converter — QR Studio',
    description:
      'Convert a QR image or text into a printable one-page PDF with title, instructions, and quiet-zone-safe margins.',
    url: 'https://freeqrcode.tools/qr-to-pdf-converter',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QR to PDF Converter — QR Studio',
    description:
      'Convert a QR image or text into a printable one-page PDF with title, instructions, and quiet-zone-safe margins.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
