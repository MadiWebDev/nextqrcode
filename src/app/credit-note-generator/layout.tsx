import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Free Credit Note Generator — QR Studio',
  description:
    'Free credit note generator: create credit notes against original invoices with reason, items, GST/VAT adjustment, live preview and PDF download.',
  alternates: { canonical: 'https://freeqrcode.tools/credit-note-generator' },
  openGraph: {
    title: 'Free Credit Note Generator — QR Studio',
    description:
      'Free credit note generator: create credit notes against original invoices with reason, items, GST/VAT adjustment, live preview and PDF download.',
    url: 'https://freeqrcode.tools/credit-note-generator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Credit Note Generator — QR Studio',
    description:
      'Free credit note generator: create credit notes against original invoices with reason, items, GST/VAT adjustment, live preview and PDF download.',
  },
  robots: { index: true, follow: true },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
