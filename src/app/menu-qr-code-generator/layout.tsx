import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Menu QR Code Generator — QR Studio',
  description:
    'Create a QR code that opens a digital menu, with a printable table-tent card, dietary note and opening-hours line.',
  alternates: {
    canonical: 'https://freeqrcode.tools/menu-qr-code-generator',
  },
  openGraph: {
    title: 'Menu QR Code Generator — QR Studio',
    description:
      'Create a QR code that opens a digital menu, with a printable table-tent card, dietary note and opening-hours line.',
    url: 'https://freeqrcode.tools/menu-qr-code-generator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Menu QR Code Generator — QR Studio',
    description:
      'Create a QR code that opens a digital menu, with a printable table-tent card, dietary note and opening-hours line.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
