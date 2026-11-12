import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Discount & Margin Calculator — QR Studio',
  description:
    'Free discount and margin calculator: work out stacked discounts, final price, gross margin, markup and the selling price you need for any target margin.',
  alternates: { canonical: 'https://freeqrcode.tools/discount-margin-calculator' },
  openGraph: {
    title: 'Discount & Margin Calculator — QR Studio',
    description:
      'Free discount and margin calculator: work out stacked discounts, final price, gross margin, markup and the selling price you need for any target margin.',
    url: 'https://freeqrcode.tools/discount-margin-calculator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Discount & Margin Calculator — QR Studio',
    description:
      'Free discount and margin calculator: work out stacked discounts, final price, gross margin, markup and the selling price you need for any target margin.',
  },
  robots: { index: true, follow: true },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
