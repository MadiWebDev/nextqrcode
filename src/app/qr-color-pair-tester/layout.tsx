import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'QR Color Pair Tester — QR Studio',
  description:
    'Test foreground and background color pairs for scan safety: contrast ratio, verdict, and suggested fixes.',
  alternates: {
    canonical: 'https://freeqrcode.tools/qr-color-pair-tester',
  },
  openGraph: {
    title: 'QR Color Pair Tester — QR Studio',
    description:
      'Test foreground and background color pairs for scan safety: contrast ratio, verdict, and suggested fixes.',
    url: 'https://freeqrcode.tools/qr-color-pair-tester',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QR Color Pair Tester — QR Studio',
    description:
      'Test foreground and background color pairs for scan safety: contrast ratio, verdict, and suggested fixes.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
