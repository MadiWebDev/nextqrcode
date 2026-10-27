import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'QR Print Cost Calculator — QR Studio',
  description:
    'Estimate what a run of printed QR labels or stickers will cost from quantity, size, material, and finish, with a per-unit breakdown you can compare against real supplier quotes.',
  alternates: {
    canonical: 'https://freeqrcode.tools/qr-print-cost-calculator',
  },
  openGraph: {
    title: 'QR Print Cost Calculator — QR Studio',
    description:
      'Estimate what a run of printed QR labels or stickers will cost from quantity, size, material, and finish, with a per-unit breakdown you can compare against real supplier quotes.',
    url: 'https://freeqrcode.tools/qr-print-cost-calculator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QR Print Cost Calculator — QR Studio',
    description:
      'Estimate what a run of printed QR labels or stickers will cost from quantity, size, material, and finish, with a per-unit breakdown you can compare against real supplier quotes.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
