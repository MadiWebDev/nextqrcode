import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Social Profile QR Code Generator — QR Studio',
  description:
    'Create a QR code that opens your social profile, with a platform picker, handle check and a follow call-to-action card.',
  alternates: {
    canonical: 'https://freeqrcode.tools/social-profile-qr-code-generator',
  },
  openGraph: {
    title: 'Social Profile QR Code Generator — QR Studio',
    description:
      'Create a QR code that opens your social profile, with a platform picker, handle check and a follow call-to-action card.',
    url: 'https://freeqrcode.tools/social-profile-qr-code-generator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Social Profile QR Code Generator — QR Studio',
    description:
      'Create a QR code that opens your social profile, with a platform picker, handle check and a follow call-to-action card.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
