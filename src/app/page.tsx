import type { Metadata } from 'next';
import { HomeGenerator } from '@/components/HomeGenerator';

export const metadata: Metadata = {
  title: 'Free QR Code Generator — QR Studio',
  description: 'Create beautiful, custom QR codes for free. 40+ types including WiFi, vCard, UPI, Bitcoin, WhatsApp and more. Custom colors, logo upload. Download PNG, SVG, PDF instantly. No sign-up needed.',
  alternates: { canonical: 'https://qrstudio.app' },
  openGraph: {
    title: 'Free QR Code Generator — QR Studio',
    description: 'Create beautiful, custom QR codes for free. 40+ types, custom colors, logo upload. No sign-up needed.',
    url: 'https://qrstudio.app',
  },
};

export default function HomePage() {
  return <HomeGenerator />;
}
