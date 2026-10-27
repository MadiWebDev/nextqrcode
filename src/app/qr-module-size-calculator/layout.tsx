import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'QR Module Size Calculator — QR Studio',
  description:
    'Work out the size of one QR module in millimetres from the version and print size, and see whether it clears the 0.35 mm safety threshold for reliable scanning.',
  alternates: {
    canonical: 'https://freeqrcode.tools/qr-module-size-calculator',
  },
  openGraph: {
    title: 'QR Module Size Calculator — QR Studio',
    description:
      'Work out the size of one QR module in millimetres from the version and print size, and see whether it clears the 0.35 mm safety threshold for reliable scanning.',
    url: 'https://freeqrcode.tools/qr-module-size-calculator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QR Module Size Calculator — QR Studio',
    description:
      'Work out the size of one QR module in millimetres from the version and print size, and see whether it clears the 0.35 mm safety threshold for reliable scanning.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
