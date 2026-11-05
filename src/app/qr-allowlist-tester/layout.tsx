import type { Metadata } from 'next';
import type { ReactNode } from 'react';

// Unique metadata for this tool page.
// Client-component pages cannot export metadata themselves, so it lives here.
export const metadata: Metadata = {
  title: "QR Allowlist Tester \u2014 Free QR Code Generator | QR Studio",
  description: "Create a free QR Allowlist Tester with QR Studio. Works 100% in your browser, no sign-up, download PNG, SVG or PDF instantly.",
  alternates: { canonical: 'https://freeqrcode.tools/qr-allowlist-tester' },
  openGraph: {
    title: "QR Allowlist Tester \u2014 Free QR Code Generator | QR Studio",
    description: "Create a free QR Allowlist Tester with QR Studio. Works 100% in your browser, no sign-up, download PNG, SVG or PDF instantly.",
    url: 'https://freeqrcode.tools/qr-allowlist-tester',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: "QR Allowlist Tester \u2014 Free QR Code Generator | QR Studio", description: "Create a free QR Allowlist Tester with QR Studio. Works 100% in your browser, no sign-up, download PNG, SVG or PDF instantly." },
  robots: { index: true, follow: true },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
