import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Curved Surface QR Calculator — QR Studio',
  description:
    'Estimate the largest QR code that stays scannable on a bottle, can, or other cylinder, from the diameter and a safe wrap-angle limit.',
  alternates: {
    canonical: 'https://freeqrcode.tools/qr-curved-surface-calculator',
  },
  openGraph: {
    title: 'Curved Surface QR Calculator — QR Studio',
    description:
      'Estimate the largest QR code that stays scannable on a bottle, can, or other cylinder, from the diameter and a safe wrap-angle limit.',
    url: 'https://freeqrcode.tools/qr-curved-surface-calculator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Curved Surface QR Calculator — QR Studio',
    description:
      'Estimate the largest QR code that stays scannable on a bottle, can, or other cylinder, from the diameter and a safe wrap-angle limit.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
