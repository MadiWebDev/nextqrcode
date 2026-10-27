import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'QR Batch Cost Calculator — QR Studio',
  description:
    'Budget a whole QR batch campaign — design, print, placement, and tracking — with editable line items, cost per code, and cost per scan at your expected scan volume.',
  alternates: {
    canonical: 'https://freeqrcode.tools/qr-batch-cost-calculator',
  },
  openGraph: {
    title: 'QR Batch Cost Calculator — QR Studio',
    description:
      'Budget a whole QR batch campaign — design, print, placement, and tracking — with editable line items, cost per code, and cost per scan at your expected scan volume.',
    url: 'https://freeqrcode.tools/qr-batch-cost-calculator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QR Batch Cost Calculator — QR Studio',
    description:
      'Budget a whole QR batch campaign — design, print, placement, and tracking — with editable line items, cost per code, and cost per scan at your expected scan volume.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
