import type { Metadata } from 'next';
import type { ReactNode } from 'react';

// Unique metadata for this tool page.
// Client-component pages cannot export metadata themselves, so it lives here.
export const metadata: Metadata = {
  title: "Webinar Join QR Generator \u2014 Free QR Code Generator | QR Studio",
  description: "Create a free Webinar Join QR Generator with QR Studio. Works 100% in your browser, no sign-up, download PNG, SVG or PDF instantly.",
  alternates: { canonical: 'https://freeqrcode.tools/webinar-join-qr-generator' },
  openGraph: {
    title: "Webinar Join QR Generator \u2014 Free QR Code Generator | QR Studio",
    description: "Create a free Webinar Join QR Generator with QR Studio. Works 100% in your browser, no sign-up, download PNG, SVG or PDF instantly.",
    url: 'https://freeqrcode.tools/webinar-join-qr-generator',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: "Webinar Join QR Generator \u2014 Free QR Code Generator | QR Studio", description: "Create a free Webinar Join QR Generator with QR Studio. Works 100% in your browser, no sign-up, download PNG, SVG or PDF instantly." },
  robots: { index: true, follow: true },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
