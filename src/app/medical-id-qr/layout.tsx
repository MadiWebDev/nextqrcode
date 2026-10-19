import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Emergency Medical ID QR Generator',
  description:
    'Create an emergency medical ID QR code and printable wallet card with your key health details for first responders.',
  alternates: { canonical: 'https://freeqrcode.tools/medical-id-qr' },
  openGraph: {
    title: 'Emergency Medical ID QR Generator',
    description:
      'Create an emergency medical ID QR code and printable wallet card with your key health details for first responders.',
    url: 'https://freeqrcode.tools/medical-id-qr',
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
