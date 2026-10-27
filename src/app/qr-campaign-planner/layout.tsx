import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'QR Campaign Planner — QR Studio',
  description:
    'Plan a QR campaign: goals, placements, quantities, timeline, and QA steps; exports a printable campaign brief.',
  alternates: {
    canonical: 'https://freeqrcode.tools/qr-campaign-planner',
  },
  openGraph: {
    title: 'QR Campaign Planner — QR Studio',
    description:
      'Plan a QR campaign: goals, placements, quantities, timeline, and QA steps; exports a printable campaign brief.',
    url: 'https://freeqrcode.tools/qr-campaign-planner',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QR Campaign Planner — QR Studio',
    description:
      'Plan a QR campaign: goals, placements, quantities, timeline, and QA steps; exports a printable campaign brief.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
