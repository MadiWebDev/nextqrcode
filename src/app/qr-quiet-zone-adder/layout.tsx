import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'QR Quiet Zone Adder — QR Studio',
  description:
    'Add a correct quiet zone — white or transparent — around an uploaded QR image, and export the padded image.',
  alternates: {
    canonical: 'https://freeqrcode.tools/qr-quiet-zone-adder',
  },
  openGraph: {
    title: 'QR Quiet Zone Adder — QR Studio',
    description:
      'Add a correct quiet zone — white or transparent — around an uploaded QR image, and export the padded image.',
    url: 'https://freeqrcode.tools/qr-quiet-zone-adder',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QR Quiet Zone Adder — QR Studio',
    description:
      'Add a correct quiet zone — white or transparent — around an uploaded QR image, and export the padded image.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
