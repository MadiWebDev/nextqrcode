import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'QR Scan Log — QR Studio',
  description:
    'Log your own QR scans locally in your browser: date, payload, location note, and your verdict. Filter the log, export it as CSV, and keep a record of the codes you have trusted — and the ones you did not.',
  alternates: {
    canonical: 'https://freeqrcode.tools/qr-scan-log',
  },
  openGraph: {
    title: 'QR Scan Log — QR Studio',
    description:
      'Log your own QR scans locally in your browser: date, payload, location note, and your verdict. Filter the log, export it as CSV, and keep a record of the codes you have trusted — and the ones you did not.',
    url: 'https://freeqrcode.tools/qr-scan-log',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QR Scan Log — QR Studio',
    description:
      'Log your own QR scans locally in your browser: date, payload, location note, and your verdict. Filter the log, export it as CSV, and keep a record of the codes you have trusted — and the ones you did not.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
