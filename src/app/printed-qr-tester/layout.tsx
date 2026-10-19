import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Printed QR Code Quality Tester',
  description:
    'Test printed QR codes for print quality, contrast, and scannability before you run a full batch.',
  alternates: { canonical: 'https://freeqrcode.tools/printed-qr-tester' },
  openGraph: {
    title: 'Printed QR Code Quality Tester',
    description:
      'Test printed QR codes for print quality, contrast, and scannability before you run a full batch.',
    url: 'https://freeqrcode.tools/printed-qr-tester',
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
