import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Gym QR Suite — QR Studio',
  description:
    'A gym toolkit in one place: membership QR, class-booking QR, trainer-profile QR, and feedback QR presets, each generating a real working QR code.',
  alternates: {
    canonical: 'https://freeqrcode.tools/gym-qr-suite',
  },
  openGraph: {
    title: 'Gym QR Suite — QR Studio',
    description:
      'A gym toolkit in one place: membership QR, class-booking QR, trainer-profile QR, and feedback QR presets, each generating a real working QR code.',
    url: 'https://freeqrcode.tools/gym-qr-suite',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gym QR Suite — QR Studio',
    description:
      'A gym toolkit in one place: membership QR, class-booking QR, trainer-profile QR, and feedback QR presets, each generating a real working QR code.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
