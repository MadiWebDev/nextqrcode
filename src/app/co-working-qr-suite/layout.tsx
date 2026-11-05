import type { Metadata } from 'next';
import type { ReactNode } from 'react';

// Unique metadata for this tool page.
// Client-component pages cannot export metadata themselves, so it lives here.
export const metadata: Metadata = {
  title: "Co Working QR Suite \u2014 Free QR Code Generator | QR Studio",
  description: "Create a free Co Working QR Suite with QR Studio. Works 100% in your browser, no sign-up, download PNG, SVG or PDF instantly. How to Use the Co-Working QR",
  alternates: { canonical: 'https://freeqrcode.tools/co-working-qr-suite' },
  openGraph: {
    title: "Co Working QR Suite \u2014 Free QR Code Generator | QR Studio",
    description: "Create a free Co Working QR Suite with QR Studio. Works 100% in your browser, no sign-up, download PNG, SVG or PDF instantly. How to Use the Co-Working QR",
    url: 'https://freeqrcode.tools/co-working-qr-suite',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: "Co Working QR Suite \u2014 Free QR Code Generator | QR Studio", description: "Create a free Co Working QR Suite with QR Studio. Works 100% in your browser, no sign-up, download PNG, SVG or PDF instantly. How to Use the Co-Working QR" },
  robots: { index: true, follow: true },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
