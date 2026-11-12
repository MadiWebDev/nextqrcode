import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Late Fee Calculator — QR Studio',
  description:
    'Free late fee calculator: work out overdue charges by percent per month, percent per year or flat fee, with grace days, pro-rata maths and a full breakdown.',
  alternates: { canonical: 'https://freeqrcode.tools/late-fee-calculator' },
  openGraph: {
    title: 'Late Fee Calculator — QR Studio',
    description:
      'Free late fee calculator: work out overdue charges by percent per month, percent per year or flat fee, with grace days, pro-rata maths and a full breakdown.',
    url: 'https://freeqrcode.tools/late-fee-calculator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Late Fee Calculator — QR Studio',
    description:
      'Free late fee calculator: work out overdue charges by percent per month, percent per year or flat fee, with grace days, pro-rata maths and a full breakdown.',
  },
  robots: { index: true, follow: true },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
