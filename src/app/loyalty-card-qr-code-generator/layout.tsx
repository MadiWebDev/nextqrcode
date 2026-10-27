import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Loyalty Card QR Code Generator — QR Studio',
  description:
    'Create a wallet-style loyalty card with a member QR code, stamp progress and the reward that members are working towards.',
  alternates: {
    canonical: 'https://freeqrcode.tools/loyalty-card-qr-code-generator',
  },
  openGraph: {
    title: 'Loyalty Card QR Code Generator — QR Studio',
    description:
      'Create a wallet-style loyalty card with a member QR code, stamp progress and the reward that members are working towards.',
    url: 'https://freeqrcode.tools/loyalty-card-qr-code-generator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Loyalty Card QR Code Generator — QR Studio',
    description:
      'Create a wallet-style loyalty card with a member QR code, stamp progress and the reward that members are working towards.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
