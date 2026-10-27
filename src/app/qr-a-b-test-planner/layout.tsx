import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'QR A/B Test Planner — QR Studio',
  description:
    'Plan a QR A/B test: variants, sample sizes, success metric, and a printable test plan with decision rules.',
  alternates: {
    canonical: 'https://freeqrcode.tools/qr-a-b-test-planner',
  },
  openGraph: {
    title: 'QR A/B Test Planner — QR Studio',
    description:
      'Plan a QR A/B test: variants, sample sizes, success metric, and a printable test plan with decision rules.',
    url: 'https://freeqrcode.tools/qr-a-b-test-planner',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QR A/B Test Planner — QR Studio',
    description:
      'Plan a QR A/B test: variants, sample sizes, success metric, and a printable test plan with decision rules.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
