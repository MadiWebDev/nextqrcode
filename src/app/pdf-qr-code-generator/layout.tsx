import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'PDF QR Code Generator — QR Studio',
  description:
    'Create a QR code that opens a hosted PDF — a brochure, menu, manual or report — so readers can view or download it on their phone.',
  alternates: {
    canonical: 'https://freeqrcode.tools/pdf-qr-code-generator',
  },
  openGraph: {
    title: 'PDF QR Code Generator — QR Studio',
    description:
      'Create a QR code that opens a hosted PDF — a brochure, menu, manual or report — so readers can view or download it on their phone.',
    url: 'https://freeqrcode.tools/pdf-qr-code-generator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PDF QR Code Generator — QR Studio',
    description:
      'Create a QR code that opens a hosted PDF — a brochure, menu, manual or report — so readers can view or download it on their phone.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
