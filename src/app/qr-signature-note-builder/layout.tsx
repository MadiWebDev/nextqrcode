import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'QR Signature Note Builder — QR Studio',
  description:
    'Build a signed-URL verification note: the exact payload, its real SHA-256 checksum computed in your browser, the issuer, and step-by-step instructions a recipient can follow to check the code. Send the note through a channel separate from the code.',
  alternates: {
    canonical: 'https://freeqrcode.tools/qr-signature-note-builder',
  },
  openGraph: {
    title: 'QR Signature Note Builder — QR Studio',
    description:
      'Build a signed-URL verification note: the exact payload, its real SHA-256 checksum computed in your browser, the issuer, and step-by-step instructions a recipient can follow to check the code. Send the note through a channel separate from the code.',
    url: 'https://freeqrcode.tools/qr-signature-note-builder',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QR Signature Note Builder — QR Studio',
    description:
      'Build a signed-URL verification note: the exact payload, its real SHA-256 checksum computed in your browser, the issuer, and step-by-step instructions a recipient can follow to check the code. Send the note through a channel separate from the code.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
