import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Bulk Business Card QR Generator — QR Studio',
  description:
    'Generate contact QR codes for a whole team from pasted name, title, and phone rows, with a card layout preview and a ZIP download.',
  alternates: {
    canonical: 'https://freeqrcode.tools/bulk-business-card-qr-generator',
  },
  openGraph: {
    title: 'Bulk Business Card QR Generator — QR Studio',
    description:
      'Generate contact QR codes for a whole team from pasted name, title, and phone rows, with a card layout preview and a ZIP download.',
    url: 'https://freeqrcode.tools/bulk-business-card-qr-generator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bulk Business Card QR Generator — QR Studio',
    description:
      'Generate contact QR codes for a whole team from pasted name, title, and phone rows, with a card layout preview and a ZIP download.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
