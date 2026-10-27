import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'QR Batch Validator — QR Studio',
  description:
    'Validate many QR destination URLs at once — format, scheme, length, whitespace, and duplicate detection — with a pass/warn/fail table you can filter and export as CSV. Up to 500 lines, all checked offline in your browser.',
  alternates: {
    canonical: 'https://freeqrcode.tools/qr-batch-validator',
  },
  openGraph: {
    title: 'QR Batch Validator — QR Studio',
    description:
      'Validate many QR destination URLs at once — format, scheme, length, whitespace, and duplicate detection — with a pass/warn/fail table you can filter and export as CSV. Up to 500 lines, all checked offline in your browser.',
    url: 'https://freeqrcode.tools/qr-batch-validator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QR Batch Validator — QR Studio',
    description:
      'Validate many QR destination URLs at once — format, scheme, length, whitespace, and duplicate detection — with a pass/warn/fail table you can filter and export as CSV. Up to 500 lines, all checked offline in your browser.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
