import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'QR API Playground — QR Studio',
  description:
    'Interactive API docs: build a QR-generation request from parameters, copy the fetch snippet, and learn what each parameter does.',
  alternates: {
    canonical: 'https://freeqrcode.tools/qr-api-playground',
  },
  openGraph: {
    title: 'QR API Playground — QR Studio',
    description:
      'Interactive API docs: build a QR-generation request from parameters, copy the fetch snippet, and learn what each parameter does.',
    url: 'https://freeqrcode.tools/qr-api-playground',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QR API Playground — QR Studio',
    description:
      'Interactive API docs: build a QR-generation request from parameters, copy the fetch snippet, and learn what each parameter does.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
