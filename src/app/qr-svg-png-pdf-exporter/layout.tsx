import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'QR SVG PNG PDF Exporter — QR Studio',
  description:
    'Paste any text or URL and export the QR code as SVG, PNG at several sizes, or a one-page PDF.',
  alternates: {
    canonical: 'https://freeqrcode.tools/qr-svg-png-pdf-exporter',
  },
  openGraph: {
    title: 'QR SVG PNG PDF Exporter — QR Studio',
    description:
      'Paste any text or URL and export the QR code as SVG, PNG at several sizes, or a one-page PDF.',
    url: 'https://freeqrcode.tools/qr-svg-png-pdf-exporter',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QR SVG PNG PDF Exporter — QR Studio',
    description:
      'Paste any text or URL and export the QR code as SVG, PNG at several sizes, or a one-page PDF.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
