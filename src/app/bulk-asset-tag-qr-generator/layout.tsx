import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Bulk Asset Tag QR Generator — QR Studio',
  description:
    'Generate asset-tag QR codes with IDs, categories, and locations from pasted rows, with a tag-sheet preview and a ZIP download.',
  alternates: {
    canonical: 'https://freeqrcode.tools/bulk-asset-tag-qr-generator',
  },
  openGraph: {
    title: 'Bulk Asset Tag QR Generator — QR Studio',
    description:
      'Generate asset-tag QR codes with IDs, categories, and locations from pasted rows, with a tag-sheet preview and a ZIP download.',
    url: 'https://freeqrcode.tools/bulk-asset-tag-qr-generator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bulk Asset Tag QR Generator — QR Studio',
    description:
      'Generate asset-tag QR codes with IDs, categories, and locations from pasted rows, with a tag-sheet preview and a ZIP download.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
