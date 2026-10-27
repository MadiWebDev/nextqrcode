import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Billboard QR Size Calculator — QR Studio',
  description:
    'Work out how large a QR code must be on a billboard or large sign so people can actually scan it from the real viewing distance, including an adjustment for moving viewers.',
  alternates: {
    canonical: 'https://freeqrcode.tools/qr-billboard-size-calculator',
  },
  openGraph: {
    title: 'Billboard QR Size Calculator — QR Studio',
    description:
      'Work out how large a QR code must be on a billboard or large sign so people can actually scan it from the real viewing distance, including an adjustment for moving viewers.',
    url: 'https://freeqrcode.tools/qr-billboard-size-calculator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Billboard QR Size Calculator — QR Studio',
    description:
      'Work out how large a QR code must be on a billboard or large sign so people can actually scan it from the real viewing distance, including an adjustment for moving viewers.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
