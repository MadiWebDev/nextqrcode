import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'QR Consent Note Builder — QR Studio',
  description:
    'Build a short consent and privacy note to place beside a data-collecting QR code. Answer the purpose, data, and retention questions, and the tool drafts a plain-language note you can print next to the code.',
  alternates: {
    canonical: 'https://freeqrcode.tools/qr-consent-note-builder',
  },
  openGraph: {
    title: 'QR Consent Note Builder — QR Studio',
    description:
      'Build a short consent and privacy note to place beside a data-collecting QR code. Answer the purpose, data, and retention questions, and the tool drafts a plain-language note you can print next to the code.',
    url: 'https://freeqrcode.tools/qr-consent-note-builder',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QR Consent Note Builder — QR Studio',
    description:
      'Build a short consent and privacy note to place beside a data-collecting QR code. Answer the purpose, data, and retention questions, and the tool drafts a plain-language note you can print next to the code.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
