import type { Metadata } from 'next';
import type { ReactNode } from 'react';

// Unique metadata for this tool page.
// Client-component pages cannot export metadata themselves, so it lives here.
export const metadata: Metadata = {
  title: "Car Wash QR Suite \u2014 Free QR Code Generator | QR Studio",
  description: "Create a free Car Wash QR Suite with QR Studio. Works 100% in your browser, no sign-up, download PNG, SVG or PDF instantly. How to Use the Car Wash QR",
  alternates: { canonical: 'https://freeqrcode.tools/car-wash-qr-suite' },
  openGraph: {
    title: "Car Wash QR Suite \u2014 Free QR Code Generator | QR Studio",
    description: "Create a free Car Wash QR Suite with QR Studio. Works 100% in your browser, no sign-up, download PNG, SVG or PDF instantly. How to Use the Car Wash QR",
    url: 'https://freeqrcode.tools/car-wash-qr-suite',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: "Car Wash QR Suite \u2014 Free QR Code Generator | QR Studio", description: "Create a free Car Wash QR Suite with QR Studio. Works 100% in your browser, no sign-up, download PNG, SVG or PDF instantly. How to Use the Car Wash QR" },
  robots: { index: true, follow: true },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
