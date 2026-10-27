import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'QR Redirect Chain Viewer — QR Studio',
  description:
    'Paste a QR destination URL to inspect it: static analysis of the host, path, and parameters, plus a real browser fetch attempt. Read the caveats — browsers hide intermediate redirect hops, so this tool reports exactly what it can observe and nothing it cannot.',
  alternates: {
    canonical: 'https://freeqrcode.tools/qr-redirect-chain-viewer',
  },
  openGraph: {
    title: 'QR Redirect Chain Viewer — QR Studio',
    description:
      'Paste a QR destination URL to inspect it: static analysis of the host, path, and parameters, plus a real browser fetch attempt. Read the caveats — browsers hide intermediate redirect hops, so this tool reports exactly what it can observe and nothing it cannot.',
    url: 'https://freeqrcode.tools/qr-redirect-chain-viewer',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QR Redirect Chain Viewer — QR Studio',
    description:
      'Paste a QR destination URL to inspect it: static analysis of the host, path, and parameters, plus a real browser fetch attempt. Read the caveats — browsers hide intermediate redirect hops, so this tool reports exactly what it can observe and nothing it cannot.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
