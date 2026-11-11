import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Passport Photo Maker — QR Studio',
  description:
    'Create correct passport photos online for free. Upload your photo, choose US, UK, EU, Canada, China or Pakistan sizes, crop by dragging, and print a 4x6 sheet.',
  alternates: { canonical: 'https://freeqrcode.tools/passport-photo-maker' },
  openGraph: {
    title: 'Passport Photo Maker — QR Studio',
    description:
      'Create correct passport photos online for free. Upload your photo, choose US, UK, EU, Canada, China or Pakistan sizes, crop by dragging, and print a 4x6 sheet.',
    url: 'https://freeqrcode.tools/passport-photo-maker',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Passport Photo Maker — QR Studio',
    description:
      'Create correct passport photos online for free. Upload your photo, choose US, UK, EU, Canada, China or Pakistan sizes, crop by dragging, and print a 4x6 sheet.',
  },
  robots: { index: true, follow: true },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
