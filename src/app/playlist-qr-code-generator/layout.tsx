import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Playlist QR Code Generator — QR Studio',
  description:
    'Create a QR code that opens a Spotify, Apple Music or YouTube playlist, styled as a cover card with a listen call to action.',
  alternates: {
    canonical: 'https://freeqrcode.tools/playlist-qr-code-generator',
  },
  openGraph: {
    title: 'Playlist QR Code Generator — QR Studio',
    description:
      'Create a QR code that opens a Spotify, Apple Music or YouTube playlist, styled as a cover card with a listen call to action.',
    url: 'https://freeqrcode.tools/playlist-qr-code-generator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Playlist QR Code Generator — QR Studio',
    description:
      'Create a QR code that opens a Spotify, Apple Music or YouTube playlist, styled as a cover card with a listen call to action.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
