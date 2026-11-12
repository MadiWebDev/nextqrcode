import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Amount to Words Converter — QR Studio',
  description:
    'Free amount to words converter: spell any amount in words for cheques, invoices and contracts in million or lakh-crore style, with six currencies built in.',
  alternates: { canonical: 'https://freeqrcode.tools/amount-to-words-converter' },
  openGraph: {
    title: 'Amount to Words Converter — QR Studio',
    description:
      'Free amount to words converter: spell any amount in words for cheques, invoices and contracts in million or lakh-crore style, with six currencies built in.',
    url: 'https://freeqrcode.tools/amount-to-words-converter',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Amount to Words Converter — QR Studio',
    description:
      'Free amount to words converter: spell any amount in words for cheques, invoices and contracts in million or lakh-crore style, with six currencies built in.',
  },
  robots: { index: true, follow: true },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
