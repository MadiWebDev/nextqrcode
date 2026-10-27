import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'QR Payload Inspector — QR Studio',
  description:
    'Upload a QR image and this tool decodes it in your browser with jsQR, then classifies the payload and lists every field it contains — so you see what a code would do before any app acts on it. Nothing is uploaded; decoding happens on your device.',
  alternates: {
    canonical: 'https://freeqrcode.tools/qr-payload-inspector',
  },
  openGraph: {
    title: 'QR Payload Inspector — QR Studio',
    description:
      'Upload a QR image and this tool decodes it in your browser with jsQR, then classifies the payload and lists every field it contains — so you see what a code would do before any app acts on it. Nothing is uploaded; decoding happens on your device.',
    url: 'https://freeqrcode.tools/qr-payload-inspector',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QR Payload Inspector — QR Studio',
    description:
      'Upload a QR image and this tool decodes it in your browser with jsQR, then classifies the payload and lists every field it contains — so you see what a code would do before any app acts on it. Nothing is uploaded; decoding happens on your device.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
