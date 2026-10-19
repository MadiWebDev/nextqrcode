import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'QR Code Error-Correction Simulator',
  description:
    'Simulate damage, blur, and wear on QR codes to test how different error-correction levels hold up when scanned.',
  alternates: { canonical: 'https://freeqrcode.tools/error-correction-simulator' },
  openGraph: {
    title: 'QR Code Error-Correction Simulator',
    description:
      'Simulate damage, blur, and wear on QR codes to test how different error-correction levels hold up when scanned.',
    url: 'https://freeqrcode.tools/error-correction-simulator',
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
