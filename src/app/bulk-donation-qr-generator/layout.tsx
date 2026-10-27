import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Bulk Donation QR Generator — QR Studio',
  description:
    'Generate donation QR codes per campaign or cause from pasted rows, with printable appeal cards and a ZIP download.',
  alternates: {
    canonical: 'https://freeqrcode.tools/bulk-donation-qr-generator',
  },
  openGraph: {
    title: 'Bulk Donation QR Generator — QR Studio',
    description:
      'Generate donation QR codes per campaign or cause from pasted rows, with printable appeal cards and a ZIP download.',
    url: 'https://freeqrcode.tools/bulk-donation-qr-generator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bulk Donation QR Generator — QR Studio',
    description:
      'Generate donation QR codes per campaign or cause from pasted rows, with printable appeal cards and a ZIP download.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
