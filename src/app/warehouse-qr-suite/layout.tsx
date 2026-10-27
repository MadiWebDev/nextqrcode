import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Warehouse QR Suite — QR Studio',
  description:
    'Build bin-location, stock-check, pick-list, and asset QR codes. Pick a preset, fill in the details, and download a working code for labels and racking.',
  alternates: {
    canonical: 'https://freeqrcode.tools/warehouse-qr-suite',
  },
  openGraph: {
    title: 'Warehouse QR Suite — QR Studio',
    description:
      'Build bin-location, stock-check, pick-list, and asset QR codes. Pick a preset, fill in the details, and download a working code for labels and racking.',
    url: 'https://freeqrcode.tools/warehouse-qr-suite',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Warehouse QR Suite — QR Studio',
    description:
      'Build bin-location, stock-check, pick-list, and asset QR codes. Pick a preset, fill in the details, and download a working code for labels and racking.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
