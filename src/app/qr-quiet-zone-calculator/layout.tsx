import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Quiet Zone Calculator QR Code Tool — QR Studio',
  description:
    'Work out the quiet-zone margin a QR code needs from its version and printed size, in millimetres and inches, including the total footprint with the margin.',
  alternates: {
    canonical: 'https://freeqrcode.tools/qr-quiet-zone-calculator',
  },
  openGraph: {
    title: 'Quiet Zone Calculator QR Code Tool — QR Studio',
    description:
      'Work out the quiet-zone margin a QR code needs from its version and printed size, in millimetres and inches, including the total footprint with the margin.',
    url: 'https://freeqrcode.tools/qr-quiet-zone-calculator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Quiet Zone Calculator QR Code Tool — QR Studio',
    description:
      'Work out the quiet-zone margin a QR code needs from its version and printed size, in millimetres and inches, including the total footprint with the margin.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
