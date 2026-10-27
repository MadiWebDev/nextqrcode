import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'QR Batch Renamer — QR Studio',
  description:
    'Rename many downloaded QR files by pattern — prefix plus counter plus label — entirely in-browser, then download the ZIP.',
  alternates: {
    canonical: 'https://freeqrcode.tools/qr-batch-renamer',
  },
  openGraph: {
    title: 'QR Batch Renamer — QR Studio',
    description:
      'Rename many downloaded QR files by pattern — prefix plus counter plus label — entirely in-browser, then download the ZIP.',
    url: 'https://freeqrcode.tools/qr-batch-renamer',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QR Batch Renamer — QR Studio',
    description:
      'Rename many downloaded QR files by pattern — prefix plus counter plus label — entirely in-browser, then download the ZIP.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
