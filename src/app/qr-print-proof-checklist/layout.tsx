import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'QR Print Proof Checklist — QR Studio',
  description:
    'Work through the pre-press checks — size, contrast, quiet zone, test scans, finishing — then complete the sign-off sheet and print it. Items marked as blockers must all pass before the job is approved.',
  alternates: {
    canonical: 'https://freeqrcode.tools/qr-print-proof-checklist',
  },
  openGraph: {
    title: 'QR Print Proof Checklist — QR Studio',
    description:
      'Work through the pre-press checks — size, contrast, quiet zone, test scans, finishing — then complete the sign-off sheet and print it. Items marked as blockers must all pass before the job is approved.',
    url: 'https://freeqrcode.tools/qr-print-proof-checklist',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QR Print Proof Checklist — QR Studio',
    description:
      'Work through the pre-press checks — size, contrast, quiet zone, test scans, finishing — then complete the sign-off sheet and print it. Items marked as blockers must all pass before the job is approved.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
