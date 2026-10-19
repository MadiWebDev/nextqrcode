import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'QR Sticker & Label Sheet Printer',
  description:
    'Lay out QR codes on printable sticker and label sheets — set grid size, margins, and print at scale.',
  alternates: { canonical: 'https://freeqrcode.tools/qr-sticker-sheet-printer' },
  openGraph: {
    title: 'QR Sticker & Label Sheet Printer',
    description:
      'Lay out QR codes on printable sticker and label sheets — set grid size, margins, and print at scale.',
    url: 'https://freeqrcode.tools/qr-sticker-sheet-printer',
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
