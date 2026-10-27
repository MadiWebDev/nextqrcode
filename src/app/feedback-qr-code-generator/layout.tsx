import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Feedback QR Code Generator — QR Studio',
  description:
    'Create a QR code that opens a feedback or review form, with a printable card and a rating prompt that tells people what to expect.',
  alternates: {
    canonical: 'https://freeqrcode.tools/feedback-qr-code-generator',
  },
  openGraph: {
    title: 'Feedback QR Code Generator — QR Studio',
    description:
      'Create a QR code that opens a feedback or review form, with a printable card and a rating prompt that tells people what to expect.',
    url: 'https://freeqrcode.tools/feedback-qr-code-generator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Feedback QR Code Generator — QR Studio',
    description:
      'Create a QR code that opens a feedback or review form, with a printable card and a rating prompt that tells people what to expect.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
