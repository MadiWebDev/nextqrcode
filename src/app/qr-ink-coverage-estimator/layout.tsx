import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'QR Ink Coverage Estimator — QR Studio',
  description:
    'Estimate what share of the printed area a QR code covers in ink, from module density, code size, and colour — useful for toner budgeting and substrate choice.',
  alternates: {
    canonical: 'https://freeqrcode.tools/qr-ink-coverage-estimator',
  },
  openGraph: {
    title: 'QR Ink Coverage Estimator — QR Studio',
    description:
      'Estimate what share of the printed area a QR code covers in ink, from module density, code size, and colour — useful for toner budgeting and substrate choice.',
    url: 'https://freeqrcode.tools/qr-ink-coverage-estimator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QR Ink Coverage Estimator — QR Studio',
    description:
      'Estimate what share of the printed area a QR code covers in ink, from module density, code size, and colour — useful for toner budgeting and substrate choice.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
