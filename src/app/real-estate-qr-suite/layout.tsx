import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Real Estate QR Suite — QR Studio',
  description:
    'A real-estate toolkit in one place: listing QR, viewing-booking QR, agent-card QR, and brochure QR presets, each generating a real working QR code.',
  alternates: {
    canonical: 'https://freeqrcode.tools/real-estate-qr-suite',
  },
  openGraph: {
    title: 'Real Estate QR Suite — QR Studio',
    description:
      'A real-estate toolkit in one place: listing QR, viewing-booking QR, agent-card QR, and brochure QR presets, each generating a real working QR code.',
    url: 'https://freeqrcode.tools/real-estate-qr-suite',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Real Estate QR Suite — QR Studio',
    description:
      'A real-estate toolkit in one place: listing QR, viewing-booking QR, agent-card QR, and brochure QR presets, each generating a real working QR code.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
