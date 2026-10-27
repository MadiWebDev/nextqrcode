import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'QR Image Enhancer — QR Studio',
  description:
    'Enhance a blurry or low-contrast QR photo in-browser — contrast, sharpen, threshold — to make it scannable again.',
  alternates: {
    canonical: 'https://freeqrcode.tools/qr-image-enhancer',
  },
  openGraph: {
    title: 'QR Image Enhancer — QR Studio',
    description:
      'Enhance a blurry or low-contrast QR photo in-browser — contrast, sharpen, threshold — to make it scannable again.',
    url: 'https://freeqrcode.tools/qr-image-enhancer',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QR Image Enhancer — QR Studio',
    description:
      'Enhance a blurry or low-contrast QR photo in-browser — contrast, sharpen, threshold — to make it scannable again.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
