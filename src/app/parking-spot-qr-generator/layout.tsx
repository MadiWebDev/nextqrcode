import type { Metadata } from 'next';
import type { ReactNode } from 'react';

// Unique metadata for this tool page.
// Client-component pages cannot export metadata themselves, so it lives here.
export const metadata: Metadata = {
  title: "Parking Spot QR Generator \u2014 Free QR Code Generator | QR Studio",
  description: "Create a free Parking Spot QR Generator with QR Studio. Works 100% in your browser, no sign-up, download PNG, SVG or PDF instantly.",
  alternates: { canonical: 'https://freeqrcode.tools/parking-spot-qr-generator' },
  openGraph: {
    title: "Parking Spot QR Generator \u2014 Free QR Code Generator | QR Studio",
    description: "Create a free Parking Spot QR Generator with QR Studio. Works 100% in your browser, no sign-up, download PNG, SVG or PDF instantly.",
    url: 'https://freeqrcode.tools/parking-spot-qr-generator',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: "Parking Spot QR Generator \u2014 Free QR Code Generator | QR Studio", description: "Create a free Parking Spot QR Generator with QR Studio. Works 100% in your browser, no sign-up, download PNG, SVG or PDF instantly." },
  robots: { index: true, follow: true },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
