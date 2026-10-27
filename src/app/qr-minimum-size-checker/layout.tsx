import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'QR Minimum Size Checker — QR Studio',
  description:
    'Check whether a planned QR size is safe for its scan distance, device class, and lighting — with the required size and the margin you have.',
  alternates: {
    canonical: 'https://freeqrcode.tools/qr-minimum-size-checker',
  },
  openGraph: {
    title: 'QR Minimum Size Checker — QR Studio',
    description:
      'Check whether a planned QR size is safe for its scan distance, device class, and lighting — with the required size and the margin you have.',
    url: 'https://freeqrcode.tools/qr-minimum-size-checker',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QR Minimum Size Checker — QR Studio',
    description:
      'Check whether a planned QR size is safe for its scan distance, device class, and lighting — with the required size and the margin you have.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
