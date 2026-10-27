import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Email QR Code Generator — QR Studio',
  description:
    'Create a QR code that opens a pre-addressed email with a subject line and body text already filled in, so the scanner only has to press send.',
  alternates: {
    canonical: 'https://freeqrcode.tools/email-qr-code-generator',
  },
  openGraph: {
    title: 'Email QR Code Generator — QR Studio',
    description:
      'Create a QR code that opens a pre-addressed email with a subject line and body text already filled in, so the scanner only has to press send.',
    url: 'https://freeqrcode.tools/email-qr-code-generator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Email QR Code Generator — QR Studio',
    description:
      'Create a QR code that opens a pre-addressed email with a subject line and body text already filled in, so the scanner only has to press send.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
