import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Bulk Feedback QR Generator — QR Studio',
  description:
    'Generate feedback QR codes per location or branch from pasted rows, with per-branch tracking suffixes and a ZIP download.',
  alternates: {
    canonical: 'https://freeqrcode.tools/bulk-feedback-qr-generator',
  },
  openGraph: {
    title: 'Bulk Feedback QR Generator — QR Studio',
    description:
      'Generate feedback QR codes per location or branch from pasted rows, with per-branch tracking suffixes and a ZIP download.',
    url: 'https://freeqrcode.tools/bulk-feedback-qr-generator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bulk Feedback QR Generator — QR Studio',
    description:
      'Generate feedback QR codes per location or branch from pasted rows, with per-branch tracking suffixes and a ZIP download.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
