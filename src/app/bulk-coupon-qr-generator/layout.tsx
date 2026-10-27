import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Bulk Coupon QR Generator — QR Studio',
  description:
    'Generate many unique coupon QR codes at once from offer and code rows — printable coupon cards, plus a ZIP of PNG files for the whole batch.',
  alternates: {
    canonical: 'https://freeqrcode.tools/bulk-coupon-qr-generator',
  },
  openGraph: {
    title: 'Bulk Coupon QR Generator — QR Studio',
    description:
      'Generate many unique coupon QR codes at once from offer and code rows — printable coupon cards, plus a ZIP of PNG files for the whole batch.',
    url: 'https://freeqrcode.tools/bulk-coupon-qr-generator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bulk Coupon QR Generator — QR Studio',
    description:
      'Generate many unique coupon QR codes at once from offer and code rows — printable coupon cards, plus a ZIP of PNG files for the whole batch.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
