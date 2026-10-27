import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Calendar Event QR Code Generator — QR Studio',
  description:
    'Create a QR code that adds an event with title, dates, location and description straight to the scanner&apos;s phone calendar.',
  alternates: {
    canonical: 'https://freeqrcode.tools/calendar-event-qr-code-generator',
  },
  openGraph: {
    title: 'Calendar Event QR Code Generator — QR Studio',
    description:
      'Create a QR code that adds an event with title, dates, location and description straight to the scanner&apos;s phone calendar.',
    url: 'https://freeqrcode.tools/calendar-event-qr-code-generator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Calendar Event QR Code Generator — QR Studio',
    description:
      'Create a QR code that adds an event with title, dates, location and description straight to the scanner&apos;s phone calendar.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
