import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'QR Contrast Checker — QR Studio',
  description:
    'Enter a foreground and background colour and get the WCAG contrast ratio plus a plain-language verdict on whether the pair is safe to print as a QR code.',
  alternates: {
    canonical: 'https://freeqrcode.tools/qr-contrast-checker',
  },
  openGraph: {
    title: 'QR Contrast Checker — QR Studio',
    description:
      'Enter a foreground and background colour and get the WCAG contrast ratio plus a plain-language verdict on whether the pair is safe to print as a QR code.',
    url: 'https://freeqrcode.tools/qr-contrast-checker',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QR Contrast Checker — QR Studio',
    description:
      'Enter a foreground and background colour and get the WCAG contrast ratio plus a plain-language verdict on whether the pair is safe to print as a QR code.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
