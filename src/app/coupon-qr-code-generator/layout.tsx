import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Coupon QR Code Generator — QR Studio',
  description:
    'Create a printable coupon with an offer, redemption code, expiry date and terms — complete with a scissor-cut line for flyers and receipts.',
  alternates: {
    canonical: 'https://freeqrcode.tools/coupon-qr-code-generator',
  },
  openGraph: {
    title: 'Coupon QR Code Generator — QR Studio',
    description:
      'Create a printable coupon with an offer, redemption code, expiry date and terms — complete with a scissor-cut line for flyers and receipts.',
    url: 'https://freeqrcode.tools/coupon-qr-code-generator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Coupon QR Code Generator — QR Studio',
    description:
      'Create a printable coupon with an offer, redemption code, expiry date and terms — complete with a scissor-cut line for flyers and receipts.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
