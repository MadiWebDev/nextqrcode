import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'QR Checksum Generator — QR Studio',
  description:
    'Generate a real SHA-256 checksum for any QR payload with your browser&apos;s built-in cryptography, so a recipient can verify that a printed code has not been altered. Also verify a payload against a checksum someone sent you.',
  alternates: {
    canonical: 'https://freeqrcode.tools/qr-checksum-generator',
  },
  openGraph: {
    title: 'QR Checksum Generator — QR Studio',
    description:
      'Generate a real SHA-256 checksum for any QR payload with your browser&apos;s built-in cryptography, so a recipient can verify that a printed code has not been altered. Also verify a payload against a checksum someone sent you.',
    url: 'https://freeqrcode.tools/qr-checksum-generator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QR Checksum Generator — QR Studio',
    description:
      'Generate a real SHA-256 checksum for any QR payload with your browser&apos;s built-in cryptography, so a recipient can verify that a printed code has not been altered. Also verify a payload against a checksum someone sent you.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
