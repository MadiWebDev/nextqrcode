import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Bulk Ticket QR Generator — QR Studio',
  description:
    'Generate many ticket QR codes with unique serials from pasted attendee rows, preview printable ticket layouts, and download everything as a ZIP.',
  alternates: {
    canonical: 'https://freeqrcode.tools/bulk-ticket-qr-generator',
  },
  openGraph: {
    title: 'Bulk Ticket QR Generator — QR Studio',
    description:
      'Generate many ticket QR codes with unique serials from pasted attendee rows, preview printable ticket layouts, and download everything as a ZIP.',
    url: 'https://freeqrcode.tools/bulk-ticket-qr-generator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bulk Ticket QR Generator — QR Studio',
    description:
      'Generate many ticket QR codes with unique serials from pasted attendee rows, preview printable ticket layouts, and download everything as a ZIP.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
