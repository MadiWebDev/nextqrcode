import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'QR Frame Designer — QR Studio',
  description:
    'Design a frame and call-to-action around a QR code — shape, text, and colors — with a live preview and PNG export.',
  alternates: {
    canonical: 'https://freeqrcode.tools/qr-frame-designer',
  },
  openGraph: {
    title: 'QR Frame Designer — QR Studio',
    description:
      'Design a frame and call-to-action around a QR code — shape, text, and colors — with a live preview and PNG export.',
    url: 'https://freeqrcode.tools/qr-frame-designer',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QR Frame Designer — QR Studio',
    description:
      'Design a frame and call-to-action around a QR code — shape, text, and colors — with a live preview and PNG export.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
