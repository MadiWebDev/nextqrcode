import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Zoom Meeting QR Code Generator — QR Studio',
  description:
    'Create a QR code that joins a Zoom meeting from a meeting link or an ID plus passcode, with clear join instructions for guests.',
  alternates: {
    canonical: 'https://freeqrcode.tools/zoom-meeting-qr-code-generator',
  },
  openGraph: {
    title: 'Zoom Meeting QR Code Generator — QR Studio',
    description:
      'Create a QR code that joins a Zoom meeting from a meeting link or an ID plus passcode, with clear join instructions for guests.',
    url: 'https://freeqrcode.tools/zoom-meeting-qr-code-generator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zoom Meeting QR Code Generator — QR Studio',
    description:
      'Create a QR code that joins a Zoom meeting from a meeting link or an ID plus passcode, with clear join instructions for guests.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
