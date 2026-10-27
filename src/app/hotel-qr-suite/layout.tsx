import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Hotel QR Suite — QR Studio',
  description:
    'A hotel toolkit in one place: check-in QR, WiFi QR, room-service QR, and local-guide QR presets, each generating a real working QR code.',
  alternates: {
    canonical: 'https://freeqrcode.tools/hotel-qr-suite',
  },
  openGraph: {
    title: 'Hotel QR Suite — QR Studio',
    description:
      'A hotel toolkit in one place: check-in QR, WiFi QR, room-service QR, and local-guide QR presets, each generating a real working QR code.',
    url: 'https://freeqrcode.tools/hotel-qr-suite',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hotel QR Suite — QR Studio',
    description:
      'A hotel toolkit in one place: check-in QR, WiFi QR, room-service QR, and local-guide QR presets, each generating a real working QR code.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
