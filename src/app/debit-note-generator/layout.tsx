import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Free Debit Note Generator — QR Studio',
  description:
    'Free debit note generator: create debit notes against original invoices for price corrections, extra charges and short-billed tax, with live preview and PDF download.',
  alternates: { canonical: 'https://freeqrcode.tools/debit-note-generator' },
  openGraph: {
    title: 'Free Debit Note Generator — QR Studio',
    description:
      'Free debit note generator: create debit notes against original invoices for price corrections, extra charges and short-billed tax, with live preview and PDF download.',
    url: 'https://freeqrcode.tools/debit-note-generator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Debit Note Generator — QR Studio',
    description:
      'Free debit note generator: create debit notes against original invoices for price corrections, extra charges and short-billed tax, with live preview and PDF download.',
  },
  robots: { index: true, follow: true },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
