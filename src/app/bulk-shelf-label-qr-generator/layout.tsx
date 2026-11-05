import type { Metadata } from 'next';
import type { ReactNode } from 'react';

// Unique metadata for this tool page.
// Client-component pages cannot export metadata themselves, so it lives here.
export const metadata: Metadata = {
  title: "Bulk Shelf Label QR Generator \u2014 Free QR Code Generator | QR Studio",
  description: "Create a free Bulk Shelf Label QR Generator with QR Studio. Works 100% in your browser, no sign-up, download PNG, SVG or PDF instantly.",
  alternates: { canonical: 'https://freeqrcode.tools/bulk-shelf-label-qr-generator' },
  openGraph: {
    title: "Bulk Shelf Label QR Generator \u2014 Free QR Code Generator | QR Studio",
    description: "Create a free Bulk Shelf Label QR Generator with QR Studio. Works 100% in your browser, no sign-up, download PNG, SVG or PDF instantly.",
    url: 'https://freeqrcode.tools/bulk-shelf-label-qr-generator',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: "Bulk Shelf Label QR Generator \u2014 Free QR Code Generator | QR Studio", description: "Create a free Bulk Shelf Label QR Generator with QR Studio. Works 100% in your browser, no sign-up, download PNG, SVG or PDF instantly." },
  robots: { index: true, follow: true },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
