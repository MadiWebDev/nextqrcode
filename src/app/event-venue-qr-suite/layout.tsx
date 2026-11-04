import type { Metadata } from 'next';
import type { ReactNode } from 'react';

// Unique metadata for this tool page.
// Client-component pages cannot export metadata themselves, so it lives here.
export const metadata: Metadata = {
  title: "Event Venue QR Suite \u2014 Free QR Code Generator | QR Studio",
  description: "Create a free Event Venue QR Suite with QR Studio. Works 100% in your browser, no sign-up, download PNG, SVG or PDF instantly. How to Use the Event Venue",
  alternates: { canonical: 'https://freeqrcode.tools/event-venue-qr-suite' },
  openGraph: {
    title: "Event Venue QR Suite \u2014 Free QR Code Generator | QR Studio",
    description: "Create a free Event Venue QR Suite with QR Studio. Works 100% in your browser, no sign-up, download PNG, SVG or PDF instantly. How to Use the Event Venue",
    url: 'https://freeqrcode.tools/event-venue-qr-suite',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: "Event Venue QR Suite \u2014 Free QR Code Generator | QR Studio", description: "Create a free Event Venue QR Suite with QR Studio. Works 100% in your browser, no sign-up, download PNG, SVG or PDF instantly. How to Use the Event Venue" },
  robots: { index: true, follow: true },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
