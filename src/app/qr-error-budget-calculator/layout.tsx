import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'QR Error Budget Calculator — QR Studio',
  description:
    'See how much damage each error-correction level tolerates for your code&apos;s version and payload, and how much of that budget a logo or overlay may safely use.',
  alternates: {
    canonical: 'https://freeqrcode.tools/qr-error-budget-calculator',
  },
  openGraph: {
    title: 'QR Error Budget Calculator — QR Studio',
    description:
      'See how much damage each error-correction level tolerates for your code&apos;s version and payload, and how much of that budget a logo or overlay may safely use.',
    url: 'https://freeqrcode.tools/qr-error-budget-calculator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QR Error Budget Calculator — QR Studio',
    description:
      'See how much damage each error-correction level tolerates for your code&apos;s version and payload, and how much of that budget a logo or overlay may safely use.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
