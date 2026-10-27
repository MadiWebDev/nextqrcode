import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Bulk Inventory QR Generator — QR Studio',
  description:
    'Generate QR labels for inventory SKUs from pasted SKU and name rows, with a label-sheet preview and a ZIP download of every code.',
  alternates: {
    canonical: 'https://freeqrcode.tools/bulk-inventory-qr-generator',
  },
  openGraph: {
    title: 'Bulk Inventory QR Generator — QR Studio',
    description:
      'Generate QR labels for inventory SKUs from pasted SKU and name rows, with a label-sheet preview and a ZIP download of every code.',
    url: 'https://freeqrcode.tools/bulk-inventory-qr-generator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bulk Inventory QR Generator — QR Studio',
    description:
      'Generate QR labels for inventory SKUs from pasted SKU and name rows, with a label-sheet preview and a ZIP download of every code.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
