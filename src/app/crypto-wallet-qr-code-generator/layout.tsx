import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Crypto Wallet QR Code Generator — QR Studio',
  description:
    'Create a QR code for a Bitcoin, Ethereum or Litecoin wallet address with an optional amount and label, and check the address format first.',
  alternates: {
    canonical: 'https://freeqrcode.tools/crypto-wallet-qr-code-generator',
  },
  openGraph: {
    title: 'Crypto Wallet QR Code Generator — QR Studio',
    description:
      'Create a QR code for a Bitcoin, Ethereum or Litecoin wallet address with an optional amount and label, and check the address format first.',
    url: 'https://freeqrcode.tools/crypto-wallet-qr-code-generator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Crypto Wallet QR Code Generator — QR Studio',
    description:
      'Create a QR code for a Bitcoin, Ethereum or Litecoin wallet address with an optional amount and label, and check the address format first.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
