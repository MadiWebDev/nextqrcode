import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'App Store QR Code Generator — QR Studio',
  description:
    'Create a QR code that sends scanners straight to your App Store or Google Play listing, with a store badge and install prompt.',
  alternates: {
    canonical: 'https://freeqrcode.tools/app-store-qr-code-generator',
  },
  openGraph: {
    title: 'App Store QR Code Generator — QR Studio',
    description:
      'Create a QR code that sends scanners straight to your App Store or Google Play listing, with a store badge and install prompt.',
    url: 'https://freeqrcode.tools/app-store-qr-code-generator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'App Store QR Code Generator — QR Studio',
    description:
      'Create a QR code that sends scanners straight to your App Store or Google Play listing, with a store badge and install prompt.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
