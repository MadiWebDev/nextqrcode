import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'QR Print Sheet Planner — QR Studio',
  description:
    'Plan an A4 or Letter sheet: code size, margins, rows and columns, cut guides; renders a printable sheet layout.',
  alternates: {
    canonical: 'https://freeqrcode.tools/qr-print-sheet-planner',
  },
  openGraph: {
    title: 'QR Print Sheet Planner — QR Studio',
    description:
      'Plan an A4 or Letter sheet: code size, margins, rows and columns, cut guides; renders a printable sheet layout.',
    url: 'https://freeqrcode.tools/qr-print-sheet-planner',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QR Print Sheet Planner — QR Studio',
    description:
      'Plan an A4 or Letter sheet: code size, margins, rows and columns, cut guides; renders a printable sheet layout.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
