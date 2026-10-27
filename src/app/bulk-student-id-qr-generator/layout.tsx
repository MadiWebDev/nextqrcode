import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Bulk Student ID QR Generator — QR Studio',
  description:
    'Generate student-ID QR codes from pasted name, ID, and class rows, with an ID-card layout preview and a ZIP download.',
  alternates: {
    canonical: 'https://freeqrcode.tools/bulk-student-id-qr-generator',
  },
  openGraph: {
    title: 'Bulk Student ID QR Generator — QR Studio',
    description:
      'Generate student-ID QR codes from pasted name, ID, and class rows, with an ID-card layout preview and a ZIP download.',
    url: 'https://freeqrcode.tools/bulk-student-id-qr-generator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bulk Student ID QR Generator — QR Studio',
    description:
      'Generate student-ID QR codes from pasted name, ID, and class rows, with an ID-card layout preview and a ZIP download.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
