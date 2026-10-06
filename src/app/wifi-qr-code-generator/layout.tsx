import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free WiFi QR Code Generator — Share Your Network Instantly',
  description:
    'Create a WiFi QR code that connects guests to your network in one scan — no password typing, no errors. Download PNG, SVG, or PDF for free.',
  alternates: { canonical: 'https://freeqrcode.tools/wifi-qr-code-generator' },
};

export default function WifiQRLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
