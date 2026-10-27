import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'QR Expiry Checker — QR Studio',
  description:
    'Check whether a QR destination is expired, redirected, or unreachable. Enter the destination URL and, if the campaign had one, its expiry date. The tool compares the date and attempts a real browser fetch — and reports the outcome honestly, including when the browser cannot tell.',
  alternates: {
    canonical: 'https://freeqrcode.tools/qr-expiry-checker',
  },
  openGraph: {
    title: 'QR Expiry Checker — QR Studio',
    description:
      'Check whether a QR destination is expired, redirected, or unreachable. Enter the destination URL and, if the campaign had one, its expiry date. The tool compares the date and attempts a real browser fetch — and reports the outcome honestly, including when the browser cannot tell.',
    url: 'https://freeqrcode.tools/qr-expiry-checker',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QR Expiry Checker — QR Studio',
    description:
      'Check whether a QR destination is expired, redirected, or unreachable. Enter the destination URL and, if the campaign had one, its expiry date. The tool compares the date and attempts a real browser fetch — and reports the outcome honestly, including when the browser cannot tell.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
