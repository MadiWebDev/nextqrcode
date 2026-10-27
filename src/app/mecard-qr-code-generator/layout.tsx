import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'MeCard QR Code Generator — QR Studio',
  description:
    'Create a compact MeCard contact QR code — a smaller alternative to vCard that older phones and simple scanners handle well.',
  alternates: {
    canonical: 'https://freeqrcode.tools/mecard-qr-code-generator',
  },
  openGraph: {
    title: 'MeCard QR Code Generator — QR Studio',
    description:
      'Create a compact MeCard contact QR code — a smaller alternative to vCard that older phones and simple scanners handle well.',
    url: 'https://freeqrcode.tools/mecard-qr-code-generator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MeCard QR Code Generator — QR Studio',
    description:
      'Create a compact MeCard contact QR code — a smaller alternative to vCard that older phones and simple scanners handle well.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
