import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Resume QR Code Generator — QR Studio',
  description:
    'Create a QR code that opens your online resume or portfolio, with a printable header card showing your name, role and contact line.',
  alternates: {
    canonical: 'https://freeqrcode.tools/resume-qr-code-generator',
  },
  openGraph: {
    title: 'Resume QR Code Generator — QR Studio',
    description:
      'Create a QR code that opens your online resume or portfolio, with a printable header card showing your name, role and contact line.',
    url: 'https://freeqrcode.tools/resume-qr-code-generator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Resume QR Code Generator — QR Studio',
    description:
      'Create a QR code that opens your online resume or portfolio, with a printable header card showing your name, role and contact line.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
