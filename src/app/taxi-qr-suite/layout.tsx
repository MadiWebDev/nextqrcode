import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Taxi QR Suite — QR Studio',
  description:
    'Build booking, driver-profile, fare-estimate, and receipt QR codes. Pick a preset, fill in the details, and download a working code for cards, window signs, and receipts.',
  alternates: {
    canonical: 'https://freeqrcode.tools/taxi-qr-suite',
  },
  openGraph: {
    title: 'Taxi QR Suite — QR Studio',
    description:
      'Build booking, driver-profile, fare-estimate, and receipt QR codes. Pick a preset, fill in the details, and download a working code for cards, window signs, and receipts.',
    url: 'https://freeqrcode.tools/taxi-qr-suite',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Taxi QR Suite — QR Studio',
    description:
      'Build booking, driver-profile, fare-estimate, and receipt QR codes. Pick a preset, fill in the details, and download a working code for cards, window signs, and receipts.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
