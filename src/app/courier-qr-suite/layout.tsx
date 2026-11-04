import type { Metadata } from 'next';
import type { ReactNode } from 'react';

// Unique metadata for this tool page.
// Client-component pages cannot export metadata themselves, so it lives here.
export const metadata: Metadata = {
  title: "Courier QR Suite \u2014 Free QR Code Generator | QR Studio",
  description: "Create a free Courier QR Suite with QR Studio. Works 100% in your browser, no sign-up, download PNG, SVG or PDF instantly. How to Use the Courier QR Suite.",
  alternates: { canonical: 'https://freeqrcode.tools/courier-qr-suite' },
  openGraph: {
    title: "Courier QR Suite \u2014 Free QR Code Generator | QR Studio",
    description: "Create a free Courier QR Suite with QR Studio. Works 100% in your browser, no sign-up, download PNG, SVG or PDF instantly. How to Use the Courier QR Suite.",
    url: 'https://freeqrcode.tools/courier-qr-suite',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: "Courier QR Suite \u2014 Free QR Code Generator | QR Studio", description: "Create a free Courier QR Suite with QR Studio. Works 100% in your browser, no sign-up, download PNG, SVG or PDF instantly. How to Use the Courier QR Suite." },
  robots: { index: true, follow: true },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
