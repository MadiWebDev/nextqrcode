import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'QR Tamper Evidence Planner — QR Studio',
  description:
    'Answer placement, surface, and risk questions to generate a tamper-evidence spec: seal type, inspection cadence, mounting guidance, and escalation steps. Copy the spec into your own printing or facilities brief.',
  alternates: {
    canonical: 'https://freeqrcode.tools/qr-tamper-evidence-planner',
  },
  openGraph: {
    title: 'QR Tamper Evidence Planner — QR Studio',
    description:
      'Answer placement, surface, and risk questions to generate a tamper-evidence spec: seal type, inspection cadence, mounting guidance, and escalation steps. Copy the spec into your own printing or facilities brief.',
    url: 'https://freeqrcode.tools/qr-tamper-evidence-planner',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QR Tamper Evidence Planner — QR Studio',
    description:
      'Answer placement, surface, and risk questions to generate a tamper-evidence spec: seal type, inspection cadence, mounting guidance, and escalation steps. Copy the spec into your own printing or facilities brief.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
