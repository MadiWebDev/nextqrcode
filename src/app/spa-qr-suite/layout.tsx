import type { Metadata } from 'next';
import type { ReactNode } from 'react';

// Unique metadata for this tool page.
// Client-component pages cannot export metadata themselves, so it lives here.
export const metadata: Metadata = {
  title: "Spa QR Suite \u2014 Free QR Code Generator | QR Studio",
  description: "Create a free Spa QR Suite with QR Studio. Works 100% in your browser, no sign-up, download PNG, SVG or PDF instantly. How to Use the Spa QR Suite.",
  alternates: { canonical: 'https://freeqrcode.tools/spa-qr-suite' },
  openGraph: {
    title: "Spa QR Suite \u2014 Free QR Code Generator | QR Studio",
    description: "Create a free Spa QR Suite with QR Studio. Works 100% in your browser, no sign-up, download PNG, SVG or PDF instantly. How to Use the Spa QR Suite.",
    url: 'https://freeqrcode.tools/spa-qr-suite',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: "Spa QR Suite \u2014 Free QR Code Generator | QR Studio", description: "Create a free Spa QR Suite with QR Studio. Works 100% in your browser, no sign-up, download PNG, SVG or PDF instantly. How to Use the Spa QR Suite." },
  robots: { index: true, follow: true },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
