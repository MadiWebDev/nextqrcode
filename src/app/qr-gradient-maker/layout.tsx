import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'QR Gradient Maker — QR Studio',
  description:
    'Design a QR code with a two-color gradient, checked against contrast guardrails, and export it as PNG or SVG.',
  alternates: {
    canonical: 'https://freeqrcode.tools/qr-gradient-maker',
  },
  openGraph: {
    title: 'QR Gradient Maker — QR Studio',
    description:
      'Design a QR code with a two-color gradient, checked against contrast guardrails, and export it as PNG or SVG.',
    url: 'https://freeqrcode.tools/qr-gradient-maker',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QR Gradient Maker — QR Studio',
    description:
      'Design a QR code with a two-color gradient, checked against contrast guardrails, and export it as PNG or SVG.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
