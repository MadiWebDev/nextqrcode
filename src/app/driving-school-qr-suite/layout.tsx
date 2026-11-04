import type { Metadata } from 'next';
import type { ReactNode } from 'react';

// Unique metadata for this tool page.
// Client-component pages cannot export metadata themselves, so it lives here.
export const metadata: Metadata = {
  title: "Driving School QR Suite \u2014 Free QR Code Generator | QR Studio",
  description: "Create a free Driving School QR Suite with QR Studio. Works 100% in your browser, no sign-up, download PNG, SVG or PDF instantly. How to Use the Driving",
  alternates: { canonical: 'https://freeqrcode.tools/driving-school-qr-suite' },
  openGraph: {
    title: "Driving School QR Suite \u2014 Free QR Code Generator | QR Studio",
    description: "Create a free Driving School QR Suite with QR Studio. Works 100% in your browser, no sign-up, download PNG, SVG or PDF instantly. How to Use the Driving",
    url: 'https://freeqrcode.tools/driving-school-qr-suite',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: "Driving School QR Suite \u2014 Free QR Code Generator | QR Studio", description: "Create a free Driving School QR Suite with QR Studio. Works 100% in your browser, no sign-up, download PNG, SVG or PDF instantly. How to Use the Driving" },
  robots: { index: true, follow: true },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
