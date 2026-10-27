import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'QR Fade Risk Checker — QR Studio',
  description:
    'Score how likely an outdoor QR code is to fade to unreadable, from sun exposure, material, laminate, and placement — with mitigations matched to your answers.',
  alternates: {
    canonical: 'https://freeqrcode.tools/qr-fade-risk-checker',
  },
  openGraph: {
    title: 'QR Fade Risk Checker — QR Studio',
    description:
      'Score how likely an outdoor QR code is to fade to unreadable, from sun exposure, material, laminate, and placement — with mitigations matched to your answers.',
    url: 'https://freeqrcode.tools/qr-fade-risk-checker',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QR Fade Risk Checker — QR Studio',
    description:
      'Score how likely an outdoor QR code is to fade to unreadable, from sun exposure, material, laminate, and placement — with mitigations matched to your answers.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
