import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'QR ZIP Packager — QR Studio',
  description:
    'Package uploaded QR images into a ZIP with a manifest CSV (filename, payload, notes) for handoff to print.',
  alternates: {
    canonical: 'https://freeqrcode.tools/qr-zip-packager',
  },
  openGraph: {
    title: 'QR ZIP Packager — QR Studio',
    description:
      'Package uploaded QR images into a ZIP with a manifest CSV (filename, payload, notes) for handoff to print.',
    url: 'https://freeqrcode.tools/qr-zip-packager',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QR ZIP Packager — QR Studio',
    description:
      'Package uploaded QR images into a ZIP with a manifest CSV (filename, payload, notes) for handoff to print.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
