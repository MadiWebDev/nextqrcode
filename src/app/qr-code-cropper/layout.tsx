import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'QR Code Cropper — QR Studio',
  description:
    'Crop a QR image in-browser with a quiet-zone guard that warns if the crop would cut the margin.',
  alternates: {
    canonical: 'https://freeqrcode.tools/qr-code-cropper',
  },
  openGraph: {
    title: 'QR Code Cropper — QR Studio',
    description:
      'Crop a QR image in-browser with a quiet-zone guard that warns if the crop would cut the margin.',
    url: 'https://freeqrcode.tools/qr-code-cropper',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QR Code Cropper — QR Studio',
    description:
      'Crop a QR image in-browser with a quiet-zone guard that warns if the crop would cut the margin.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
