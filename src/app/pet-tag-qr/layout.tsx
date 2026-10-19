import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Pet Tag & Lost-and-Found QR Generator',
  description:
    "Make a lost-and-found QR tag for your pet's collar — anyone who scans it can reach you without an app.",
  alternates: { canonical: 'https://freeqrcode.tools/pet-tag-qr' },
  openGraph: {
    title: 'Pet Tag & Lost-and-Found QR Generator',
    description:
      "Make a lost-and-found QR tag for your pet's collar — anyone who scans it can reach you without an app.",
    url: 'https://freeqrcode.tools/pet-tag-qr',
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
