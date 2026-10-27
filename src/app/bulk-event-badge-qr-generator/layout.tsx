import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Bulk Event Badge QR Generator — QR Studio',
  description:
    'Generate event-badge QR codes from pasted attendee rows, with a badge layout preview and a ZIP download of every code.',
  alternates: {
    canonical: 'https://freeqrcode.tools/bulk-event-badge-qr-generator',
  },
  openGraph: {
    title: 'Bulk Event Badge QR Generator — QR Studio',
    description:
      'Generate event-badge QR codes from pasted attendee rows, with a badge layout preview and a ZIP download of every code.',
    url: 'https://freeqrcode.tools/bulk-event-badge-qr-generator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bulk Event Badge QR Generator — QR Studio',
    description:
      'Generate event-badge QR codes from pasted attendee rows, with a badge layout preview and a ZIP download of every code.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
