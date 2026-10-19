import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Printable WiFi Sign & Table Tent Maker',
  description:
    'Create printable WiFi signs and table tents with scannable QR codes — supports RTL Urdu and Arabic text.',
  alternates: { canonical: 'https://freeqrcode.tools/wifi-sign-generator' },
  openGraph: {
    title: 'Printable WiFi Sign & Table Tent Maker',
    description:
      'Create printable WiFi signs and table tents with scannable QR codes — supports RTL Urdu and Arabic text.',
    url: 'https://freeqrcode.tools/wifi-sign-generator',
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
