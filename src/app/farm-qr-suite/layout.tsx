import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Farm QR Suite — QR Studio',
  description:
    'Build produce-traceability, farm-shop, market-stall, and CSA sign-up QR codes. Pick a preset, fill in the details, and download a working code for packaging, stalls, and signs.',
  alternates: {
    canonical: 'https://freeqrcode.tools/farm-qr-suite',
  },
  openGraph: {
    title: 'Farm QR Suite — QR Studio',
    description:
      'Build produce-traceability, farm-shop, market-stall, and CSA sign-up QR codes. Pick a preset, fill in the details, and download a working code for packaging, stalls, and signs.',
    url: 'https://freeqrcode.tools/farm-qr-suite',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Farm QR Suite — QR Studio',
    description:
      'Build produce-traceability, farm-shop, market-stall, and CSA sign-up QR codes. Pick a preset, fill in the details, and download a working code for packaging, stalls, and signs.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
