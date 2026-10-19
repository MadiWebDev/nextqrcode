import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Animated-QR Offline File & Text Transfer',
  description:
    'Split files and text into animated QR frames and scan them back offline — no cables, network, or sign-up required.',
  alternates: { canonical: 'https://freeqrcode.tools/animated-qr-transfer' },
  openGraph: {
    title: 'Animated-QR Offline File & Text Transfer',
    description:
      'Split files and text into animated QR frames and scan them back offline — no cables, network, or sign-up required.',
    url: 'https://freeqrcode.tools/animated-qr-transfer',
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
