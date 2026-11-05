import type { Metadata } from 'next';
import type { ReactNode } from 'react';

// Unique metadata for this tool page.
// Client-component pages cannot export metadata themselves, so it lives here.
export const metadata: Metadata = {
  title: "QR Link Menu Generator \u2014 Free QR Code Generator | QR Studio",
  description: "Create a free QR Link Menu Generator with QR Studio. Works 100% in your browser, no sign-up, download PNG, SVG or PDF instantly.",
  alternates: { canonical: 'https://freeqrcode.tools/qr-link-menu-generator' },
  openGraph: {
    title: "QR Link Menu Generator \u2014 Free QR Code Generator | QR Studio",
    description: "Create a free QR Link Menu Generator with QR Studio. Works 100% in your browser, no sign-up, download PNG, SVG or PDF instantly.",
    url: 'https://freeqrcode.tools/qr-link-menu-generator',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: "QR Link Menu Generator \u2014 Free QR Code Generator | QR Studio", description: "Create a free QR Link Menu Generator with QR Studio. Works 100% in your browser, no sign-up, download PNG, SVG or PDF instantly." },
  robots: { index: true, follow: true },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
