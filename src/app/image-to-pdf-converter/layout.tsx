import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Image to PDF Converter — QR Studio',
  description:
    'Convert JPG, PNG and WebP images to a print-ready PDF in your browser. Choose A4 or Letter, set margins, reorder pages and download — no upload, no sign-up.',
  alternates: { canonical: 'https://freeqrcode.tools/image-to-pdf-converter' },
  openGraph: {
    title: 'Image to PDF Converter — QR Studio',
    description:
      'Convert JPG, PNG and WebP images to a print-ready PDF in your browser. Choose A4 or Letter, set margins, reorder pages and download — no upload, no sign-up.',
    url: 'https://freeqrcode.tools/image-to-pdf-converter',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Image to PDF Converter — QR Studio',
    description:
      'Convert JPG, PNG and WebP images to a print-ready PDF in your browser. Choose A4 or Letter, set margins, reorder pages and download — no upload, no sign-up.',
  },
  robots: { index: true, follow: true },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
