import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'SMS QR Code Generator — QR Studio',
  description:
    'Create a QR code that opens a pre-written text message addressed to your number, so customers can reach you without typing anything.',
  alternates: {
    canonical: 'https://freeqrcode.tools/sms-qr-code-generator',
  },
  openGraph: {
    title: 'SMS QR Code Generator — QR Studio',
    description:
      'Create a QR code that opens a pre-written text message addressed to your number, so customers can reach you without typing anything.',
    url: 'https://freeqrcode.tools/sms-qr-code-generator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SMS QR Code Generator — QR Studio',
    description:
      'Create a QR code that opens a pre-written text message addressed to your number, so customers can reach you without typing anything.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
