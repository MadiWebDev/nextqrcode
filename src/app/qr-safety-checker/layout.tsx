import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'QR Code Safety & Anti-Quishing Checker',
  description:
    'Inspect any QR code for phishing, hidden redirects, and quishing tricks before you scan it with your phone.',
  alternates: { canonical: 'https://freeqrcode.tools/qr-safety-checker' },
  openGraph: {
    title: 'QR Code Safety & Anti-Quishing Checker',
    description:
      'Inspect any QR code for phishing, hidden redirects, and quishing tricks before you scan it with your phone.',
    url: 'https://freeqrcode.tools/qr-safety-checker',
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
