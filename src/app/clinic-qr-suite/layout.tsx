import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Clinic QR Suite — QR Studio',
  description:
    'A clinic toolkit in one place: intake-form QR, appointment QR, aftercare QR, and feedback QR presets, each generating a real working QR code.',
  alternates: {
    canonical: 'https://freeqrcode.tools/clinic-qr-suite',
  },
  openGraph: {
    title: 'Clinic QR Suite — QR Studio',
    description:
      'A clinic toolkit in one place: intake-form QR, appointment QR, aftercare QR, and feedback QR presets, each generating a real working QR code.',
    url: 'https://freeqrcode.tools/clinic-qr-suite',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Clinic QR Suite — QR Studio',
    description:
      'A clinic toolkit in one place: intake-form QR, appointment QR, aftercare QR, and feedback QR presets, each generating a real working QR code.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
