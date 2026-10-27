import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Bulk PDF QR Generator — QR Studio',
  description:
    'Generate QR codes for many PDF URLs from pasted rows, with URL validation, a preview grid, and a ZIP download of every code.',
  alternates: {
    canonical: 'https://freeqrcode.tools/bulk-pdf-qr-generator',
  },
  openGraph: {
    title: 'Bulk PDF QR Generator — QR Studio',
    description:
      'Generate QR codes for many PDF URLs from pasted rows, with URL validation, a preview grid, and a ZIP download of every code.',
    url: 'https://freeqrcode.tools/bulk-pdf-qr-generator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bulk PDF QR Generator — QR Studio',
    description:
      'Generate QR codes for many PDF URLs from pasted rows, with URL validation, a preview grid, and a ZIP download of every code.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
