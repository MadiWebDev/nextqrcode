import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'QR Offline Verifier — QR Studio',
  description:
    'Verify a QR payload without any network request: format checks, length, encoding, a real QR symbol build that reports the version and module count, and a scannability self-test checklist. Everything runs in your browser.',
  alternates: {
    canonical: 'https://freeqrcode.tools/qr-offline-verifier',
  },
  openGraph: {
    title: 'QR Offline Verifier — QR Studio',
    description:
      'Verify a QR payload without any network request: format checks, length, encoding, a real QR symbol build that reports the version and module count, and a scannability self-test checklist. Everything runs in your browser.',
    url: 'https://freeqrcode.tools/qr-offline-verifier',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QR Offline Verifier — QR Studio',
    description:
      'Verify a QR payload without any network request: format checks, length, encoding, a real QR symbol build that reports the version and module count, and a scannability self-test checklist. Everything runs in your browser.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
