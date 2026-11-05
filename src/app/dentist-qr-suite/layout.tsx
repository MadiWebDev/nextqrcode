import type { Metadata } from 'next';
import type { ReactNode } from 'react';

// Unique metadata for this tool page.
// Client-component pages cannot export metadata themselves, so it lives here.
export const metadata: Metadata = {
  title: "Dentist QR Suite \u2014 Free QR Code Generator | QR Studio",
  description: "Create a free Dentist QR Suite with QR Studio. Works 100% in your browser, no sign-up, download PNG, SVG or PDF instantly. How to Use the Dentist QR Suite.",
  alternates: { canonical: 'https://freeqrcode.tools/dentist-qr-suite' },
  openGraph: {
    title: "Dentist QR Suite \u2014 Free QR Code Generator | QR Studio",
    description: "Create a free Dentist QR Suite with QR Studio. Works 100% in your browser, no sign-up, download PNG, SVG or PDF instantly. How to Use the Dentist QR Suite.",
    url: 'https://freeqrcode.tools/dentist-qr-suite',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: "Dentist QR Suite \u2014 Free QR Code Generator | QR Studio", description: "Create a free Dentist QR Suite with QR Studio. Works 100% in your browser, no sign-up, download PNG, SVG or PDF instantly. How to Use the Dentist QR Suite." },
  robots: { index: true, follow: true },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
