import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Certificate Generator — QR Studio',
  description:
    'Make polished certificates of achievement, completion and appreciation with recipient names, dates and signatories. Free in-browser tool, print-ready PNG.',
  alternates: { canonical: 'https://freeqrcode.tools/certificate-generator' },
  openGraph: {
    title: 'Certificate Generator — QR Studio',
    description:
      'Make polished certificates of achievement, completion and appreciation with recipient names, dates and signatories. Free in-browser tool, print-ready PNG.',
    url: 'https://freeqrcode.tools/certificate-generator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Certificate Generator — QR Studio',
    description:
      'Make polished certificates of achievement, completion and appreciation with recipient names, dates and signatories. Free in-browser tool, print-ready PNG.',
  },
  robots: { index: true, follow: true },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
