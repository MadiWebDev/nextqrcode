import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'GST / VAT Calculator — QR Studio',
  description:
    'Free GST / VAT calculator: add or remove tax from any amount, use preset rates and country quick-picks, and see net, tax and gross totals instantly online.',
  alternates: { canonical: 'https://freeqrcode.tools/gst-vat-calculator' },
  openGraph: {
    title: 'GST / VAT Calculator — QR Studio',
    description:
      'Free GST / VAT calculator: add or remove tax from any amount, use preset rates and country quick-picks, and see net, tax and gross totals instantly online.',
    url: 'https://freeqrcode.tools/gst-vat-calculator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GST / VAT Calculator — QR Studio',
    description:
      'Free GST / VAT calculator: add or remove tax from any amount, use preset rates and country quick-picks, and see net, tax and gross totals instantly online.',
  },
  robots: { index: true, follow: true },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
