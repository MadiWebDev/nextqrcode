import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Bulk URL QR Generator — QR Studio',
  description:
    'Paste up to 500 URLs and generate all their QR codes at once — preview grid, then download the whole batch as a ZIP of PNG files.',
  alternates: {
    canonical: 'https://freeqrcode.tools/bulk-url-qr-generator',
  },
  openGraph: {
    title: 'Bulk URL QR Generator — QR Studio',
    description:
      'Paste up to 500 URLs and generate all their QR codes at once — preview grid, then download the whole batch as a ZIP of PNG files.',
    url: 'https://freeqrcode.tools/bulk-url-qr-generator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bulk URL QR Generator — QR Studio',
    description:
      'Paste up to 500 URLs and generate all their QR codes at once — preview grid, then download the whole batch as a ZIP of PNG files.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
