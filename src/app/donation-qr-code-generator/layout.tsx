import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Donation QR Code Generator — QR Studio',
  description:
    'Create a QR code that opens a donation page, with suggested amounts, a cause description and a printable appeal card.',
  alternates: {
    canonical: 'https://freeqrcode.tools/donation-qr-code-generator',
  },
  openGraph: {
    title: 'Donation QR Code Generator — QR Studio',
    description:
      'Create a QR code that opens a donation page, with suggested amounts, a cause description and a printable appeal card.',
    url: 'https://freeqrcode.tools/donation-qr-code-generator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Donation QR Code Generator — QR Studio',
    description:
      'Create a QR code that opens a donation page, with suggested amounts, a cause description and a printable appeal card.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
