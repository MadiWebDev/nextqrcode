import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'QR Allowlist Builder — QR Studio',
  description:
    'Build a domain allowlist for your QR codes: add and remove domains, test URLs against the list, and import or export the list as JSON. Everything runs in your browser and nothing is uploaded.',
  alternates: {
    canonical: 'https://freeqrcode.tools/qr-allowlist-builder',
  },
  openGraph: {
    title: 'QR Allowlist Builder — QR Studio',
    description:
      'Build a domain allowlist for your QR codes: add and remove domains, test URLs against the list, and import or export the list as JSON. Everything runs in your browser and nothing is uploaded.',
    url: 'https://freeqrcode.tools/qr-allowlist-builder',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QR Allowlist Builder — QR Studio',
    description:
      'Build a domain allowlist for your QR codes: add and remove domains, test URLs against the list, and import or export the list as JSON. Everything runs in your browser and nothing is uploaded.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
