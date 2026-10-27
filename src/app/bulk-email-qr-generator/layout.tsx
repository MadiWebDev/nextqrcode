import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Bulk Email QR Generator — QR Studio',
  description:
    'Generate many email QR codes at once from pasted address, subject, and body rows — validated, previewed, and downloaded as a ZIP of PNG files.',
  alternates: {
    canonical: 'https://freeqrcode.tools/bulk-email-qr-generator',
  },
  openGraph: {
    title: 'Bulk Email QR Generator — QR Studio',
    description:
      'Generate many email QR codes at once from pasted address, subject, and body rows — validated, previewed, and downloaded as a ZIP of PNG files.',
    url: 'https://freeqrcode.tools/bulk-email-qr-generator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bulk Email QR Generator — QR Studio',
    description:
      'Generate many email QR codes at once from pasted address, subject, and body rows — validated, previewed, and downloaded as a ZIP of PNG files.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
