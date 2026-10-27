import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Event RSVP QR Code Generator — QR Studio',
  description:
    'Create a QR code that opens an RSVP form, with an event details card and a clear reply deadline.',
  alternates: {
    canonical: 'https://freeqrcode.tools/event-rsvp-qr-code-generator',
  },
  openGraph: {
    title: 'Event RSVP QR Code Generator — QR Studio',
    description:
      'Create a QR code that opens an RSVP form, with an event details card and a clear reply deadline.',
    url: 'https://freeqrcode.tools/event-rsvp-qr-code-generator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Event RSVP QR Code Generator — QR Studio',
    description:
      'Create a QR code that opens an RSVP form, with an event details card and a clear reply deadline.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
