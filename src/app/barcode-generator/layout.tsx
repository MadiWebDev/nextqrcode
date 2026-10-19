import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Barcode Generator with Checksum Validation',
  description:
    'Generate EAN, UPC, Code 128, and ISBN barcodes with automatic checksum validation, then print or download them.',
  alternates: { canonical: 'https://freeqrcode.tools/barcode-generator' },
  openGraph: {
    title: 'Barcode Generator with Checksum Validation',
    description:
      'Generate EAN, UPC, Code 128, and ISBN barcodes with automatic checksum validation, then print or download them.',
    url: 'https://freeqrcode.tools/barcode-generator',
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
