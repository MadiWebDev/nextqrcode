import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'QR Embed Code Builder — QR Studio',
  description:
    'Build copy-paste HTML or iframe embed code for a QR image, with size, alt text, and link options.',
  alternates: {
    canonical: 'https://freeqrcode.tools/qr-embed-code-builder',
  },
  openGraph: {
    title: 'QR Embed Code Builder — QR Studio',
    description:
      'Build copy-paste HTML or iframe embed code for a QR image, with size, alt text, and link options.',
    url: 'https://freeqrcode.tools/qr-embed-code-builder',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QR Embed Code Builder — QR Studio',
    description:
      'Build copy-paste HTML or iframe embed code for a QR image, with size, alt text, and link options.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
