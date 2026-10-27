import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'QR Call to Action Builder — QR Studio',
  description:
    'Write and style a call-to-action line for a QR code — text, arrow, urgency — with a live preview card.',
  alternates: {
    canonical: 'https://freeqrcode.tools/qr-call-to-action-builder',
  },
  openGraph: {
    title: 'QR Call to Action Builder — QR Studio',
    description:
      'Write and style a call-to-action line for a QR code — text, arrow, urgency — with a live preview card.',
    url: 'https://freeqrcode.tools/qr-call-to-action-builder',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QR Call to Action Builder — QR Studio',
    description:
      'Write and style a call-to-action line for a QR code — text, arrow, urgency — with a live preview card.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
