import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Bulk Table Tent QR Generator — QR Studio',
  description:
    'Generate table-tent QR codes for many tables or rooms from pasted rows, with a tent-card layout preview and a ZIP download.',
  alternates: {
    canonical: 'https://freeqrcode.tools/bulk-table-tent-qr-generator',
  },
  openGraph: {
    title: 'Bulk Table Tent QR Generator — QR Studio',
    description:
      'Generate table-tent QR codes for many tables or rooms from pasted rows, with a tent-card layout preview and a ZIP download.',
    url: 'https://freeqrcode.tools/bulk-table-tent-qr-generator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bulk Table Tent QR Generator — QR Studio',
    description:
      'Generate table-tent QR codes for many tables or rooms from pasted rows, with a tent-card layout preview and a ZIP download.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
