import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'QR Code Size & Scan-Distance Calculator',
  description:
    'Calculate the ideal QR code size for any scan distance, with print-ready dimensions in cm and inches.',
  alternates: { canonical: 'https://freeqrcode.tools/qr-size-calculator' },
  openGraph: {
    title: 'QR Code Size & Scan-Distance Calculator',
    description:
      'Calculate the ideal QR code size for any scan distance, with print-ready dimensions in cm and inches.',
    url: 'https://freeqrcode.tools/qr-size-calculator',
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
