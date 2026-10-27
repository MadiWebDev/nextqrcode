import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'School QR Suite — QR Studio',
  description:
    'A school toolkit in one place: newsletter QR, homework QR, event QR, and permission-slip QR presets, each generating a real working QR code.',
  alternates: {
    canonical: 'https://freeqrcode.tools/school-qr-suite',
  },
  openGraph: {
    title: 'School QR Suite — QR Studio',
    description:
      'A school toolkit in one place: newsletter QR, homework QR, event QR, and permission-slip QR presets, each generating a real working QR code.',
    url: 'https://freeqrcode.tools/school-qr-suite',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'School QR Suite — QR Studio',
    description:
      'A school toolkit in one place: newsletter QR, homework QR, event QR, and permission-slip QR presets, each generating a real working QR code.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
