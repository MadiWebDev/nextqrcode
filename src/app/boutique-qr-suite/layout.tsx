import type { Metadata } from 'next';
import type { ReactNode } from 'react';

// Unique metadata for this tool page.
// Client-component pages cannot export metadata themselves, so it lives here.
export const metadata: Metadata = {
  title: "Boutique QR Suite \u2014 Free QR Code Generator | QR Studio",
  description: "Create a free Boutique QR Suite with QR Studio. Works 100% in your browser, no sign-up, download PNG, SVG or PDF instantly. How to Use the Boutique QR",
  alternates: { canonical: 'https://freeqrcode.tools/boutique-qr-suite' },
  openGraph: {
    title: "Boutique QR Suite \u2014 Free QR Code Generator | QR Studio",
    description: "Create a free Boutique QR Suite with QR Studio. Works 100% in your browser, no sign-up, download PNG, SVG or PDF instantly. How to Use the Boutique QR",
    url: 'https://freeqrcode.tools/boutique-qr-suite',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: "Boutique QR Suite \u2014 Free QR Code Generator | QR Studio", description: "Create a free Boutique QR Suite with QR Studio. Works 100% in your browser, no sign-up, download PNG, SVG or PDF instantly. How to Use the Boutique QR" },
  robots: { index: true, follow: true },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
