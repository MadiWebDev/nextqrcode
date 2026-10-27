import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'QR Data Capacity Calculator — QR Studio',
  description:
    'Paste a payload and see the smallest QR version that fits it at each error-correction level, plus reference capacities so you can judge how close to the limit you are.',
  alternates: {
    canonical: 'https://freeqrcode.tools/qr-data-capacity-calculator',
  },
  openGraph: {
    title: 'QR Data Capacity Calculator — QR Studio',
    description:
      'Paste a payload and see the smallest QR version that fits it at each error-correction level, plus reference capacities so you can judge how close to the limit you are.',
    url: 'https://freeqrcode.tools/qr-data-capacity-calculator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QR Data Capacity Calculator — QR Studio',
    description:
      'Paste a payload and see the smallest QR version that fits it at each error-correction level, plus reference capacities so you can judge how close to the limit you are.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
