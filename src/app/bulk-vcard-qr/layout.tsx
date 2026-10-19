import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Bulk vCard QR Code Generator',
  description:
    'Upload a CSV of contacts and generate a batch of printable vCard QR codes — one per row, ready for scanning.',
  alternates: { canonical: 'https://freeqrcode.tools/bulk-vcard-qr' },
  openGraph: {
    title: 'Bulk vCard QR Code Generator',
    description:
      'Upload a CSV of contacts and generate a batch of printable vCard QR codes — one per row, ready for scanning.',
    url: 'https://freeqrcode.tools/bulk-vcard-qr',
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
