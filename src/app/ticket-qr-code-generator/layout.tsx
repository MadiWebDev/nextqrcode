import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Ticket QR Code Generator — QR Studio',
  description:
    'Create a printable event ticket with event details, attendee name, seat and a serial number, plus a QR code for check-in.',
  alternates: {
    canonical: 'https://freeqrcode.tools/ticket-qr-code-generator',
  },
  openGraph: {
    title: 'Ticket QR Code Generator — QR Studio',
    description:
      'Create a printable event ticket with event details, attendee name, seat and a serial number, plus a QR code for check-in.',
    url: 'https://freeqrcode.tools/ticket-qr-code-generator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ticket QR Code Generator — QR Studio',
    description:
      'Create a printable event ticket with event details, attendee name, seat and a serial number, plus a QR code for check-in.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
