import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'QR Code UTM Builder & Campaign Planner',
  description:
    'Build UTM-tagged URLs for QR campaigns, plan tracking parameters, and generate scannable codes for each link.',
  alternates: { canonical: 'https://freeqrcode.tools/utm-builder' },
  openGraph: {
    title: 'QR Code UTM Builder & Campaign Planner',
    description:
      'Build UTM-tagged URLs for QR campaigns, plan tracking parameters, and generate scannable codes for each link.',
    url: 'https://freeqrcode.tools/utm-builder',
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
