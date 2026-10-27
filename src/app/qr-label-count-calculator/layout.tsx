import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'QR Label Count Calculator — QR Studio',
  description:
    'Work out how many QR labels fit on one sheet or roll, how many sheets a run needs, and how much of each sheet is wasted.',
  alternates: {
    canonical: 'https://freeqrcode.tools/qr-label-count-calculator',
  },
  openGraph: {
    title: 'QR Label Count Calculator — QR Studio',
    description:
      'Work out how many QR labels fit on one sheet or roll, how many sheets a run needs, and how much of each sheet is wasted.',
    url: 'https://freeqrcode.tools/qr-label-count-calculator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QR Label Count Calculator — QR Studio',
    description:
      'Work out how many QR labels fit on one sheet or roll, how many sheets a run needs, and how much of each sheet is wasted.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
