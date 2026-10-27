import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Bulk WiFi QR Generator — QR Studio',
  description:
    'Generate WiFi QR codes for many networks at once — hotel rooms, offices, branches — from pasted SSID rows, then download the batch as a ZIP of PNG files.',
  alternates: {
    canonical: 'https://freeqrcode.tools/bulk-wifi-qr-generator',
  },
  openGraph: {
    title: 'Bulk WiFi QR Generator — QR Studio',
    description:
      'Generate WiFi QR codes for many networks at once — hotel rooms, offices, branches — from pasted SSID rows, then download the batch as a ZIP of PNG files.',
    url: 'https://freeqrcode.tools/bulk-wifi-qr-generator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bulk WiFi QR Generator — QR Studio',
    description:
      'Generate WiFi QR codes for many networks at once — hotel rooms, offices, branches — from pasted SSID rows, then download the batch as a ZIP of PNG files.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
