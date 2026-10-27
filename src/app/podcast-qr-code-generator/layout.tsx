import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Podcast QR Code Generator — QR Studio',
  description:
    'Create a QR code that opens a podcast episode, with show notes, a listen call to action and a subscribe hint for new listeners.',
  alternates: {
    canonical: 'https://freeqrcode.tools/podcast-qr-code-generator',
  },
  openGraph: {
    title: 'Podcast QR Code Generator — QR Studio',
    description:
      'Create a QR code that opens a podcast episode, with show notes, a listen call to action and a subscribe hint for new listeners.',
    url: 'https://freeqrcode.tools/podcast-qr-code-generator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Podcast QR Code Generator — QR Studio',
    description:
      'Create a QR code that opens a podcast episode, with show notes, a listen call to action and a subscribe hint for new listeners.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
