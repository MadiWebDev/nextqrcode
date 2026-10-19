import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Large-Data QR Splitter & Scanner',
  description:
    'Split large data across multiple QR codes and scan them back to reassemble the original content.',
  alternates: { canonical: 'https://freeqrcode.tools/qr-splitter-scanner' },
  openGraph: {
    title: 'Large-Data QR Splitter & Scanner',
    description:
      'Split large data across multiple QR codes and scan them back to reassemble the original content.',
    url: 'https://freeqrcode.tools/qr-splitter-scanner',
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
