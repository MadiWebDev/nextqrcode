import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Museum QR Suite — QR Studio',
  description:
    'Build exhibit, audio-guide, ticket, and donation QR codes for galleries. Pick a preset, fill in the details, and download a working code for print or display.',
  alternates: {
    canonical: 'https://freeqrcode.tools/museum-qr-suite',
  },
  openGraph: {
    title: 'Museum QR Suite — QR Studio',
    description:
      'Build exhibit, audio-guide, ticket, and donation QR codes for galleries. Pick a preset, fill in the details, and download a working code for print or display.',
    url: 'https://freeqrcode.tools/museum-qr-suite',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Museum QR Suite — QR Studio',
    description:
      'Build exhibit, audio-guide, ticket, and donation QR codes for galleries. Pick a preset, fill in the details, and download a working code for print or display.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
