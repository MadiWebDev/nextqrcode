import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Logo Safe Area Calculator QR Code Tool — QR Studio',
  description:
    'Work out the largest logo you can safely place over a QR code at your chosen error-correction level, and see the conservative coverage rule behind the number.',
  alternates: {
    canonical: 'https://freeqrcode.tools/qr-logo-safe-area-calculator',
  },
  openGraph: {
    title: 'Logo Safe Area Calculator QR Code Tool — QR Studio',
    description:
      'Work out the largest logo you can safely place over a QR code at your chosen error-correction level, and see the conservative coverage rule behind the number.',
    url: 'https://freeqrcode.tools/qr-logo-safe-area-calculator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Logo Safe Area Calculator QR Code Tool — QR Studio',
    description:
      'Work out the largest logo you can safely place over a QR code at your chosen error-correction level, and see the conservative coverage rule behind the number.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
