import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'QR Code Placement Guide by Material',
  description:
    'Learn where to place QR codes on different materials and substrates so they scan reliably every time.',
  alternates: { canonical: 'https://freeqrcode.tools/qr-placement-guide' },
  openGraph: {
    title: 'QR Code Placement Guide by Material',
    description:
      'Learn where to place QR codes on different materials and substrates so they scan reliably every time.',
    url: 'https://freeqrcode.tools/qr-placement-guide',
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
