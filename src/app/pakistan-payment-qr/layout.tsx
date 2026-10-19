import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Regional Payment QR Generator',
  description:
    'Generate scannable payment QR codes for Raast, JazzCash, Easypaisa, and UPI — amount and reference included.',
  alternates: { canonical: 'https://freeqrcode.tools/pakistan-payment-qr' },
  openGraph: {
    title: 'Regional Payment QR Generator',
    description:
      'Generate scannable payment QR codes for Raast, JazzCash, Easypaisa, and UPI — amount and reference included.',
    url: 'https://freeqrcode.tools/pakistan-payment-qr',
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
