import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Survey QR Code Generator — QR Studio',
  description:
    'Create a QR code for a survey or form, with a UTM builder that tags responses by source so you know which poster or counter generated them.',
  alternates: {
    canonical: 'https://freeqrcode.tools/survey-qr-code-generator',
  },
  openGraph: {
    title: 'Survey QR Code Generator — QR Studio',
    description:
      'Create a QR code for a survey or form, with a UTM builder that tags responses by source so you know which poster or counter generated them.',
    url: 'https://freeqrcode.tools/survey-qr-code-generator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Survey QR Code Generator — QR Studio',
    description:
      'Create a QR code for a survey or form, with a UTM builder that tags responses by source so you know which poster or counter generated them.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
