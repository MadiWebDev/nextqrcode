import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'QR Typosquat Checker — QR Studio',
  description:
    'Enter a domain to see the typo variants an attacker could use against it — omissions, swaps, duplications, keyboard neighbours, homoglyph lookalikes, and TLD swaps. The variants are generated algorithmically in your browser; the tool does not check whether any of them are registered.',
  alternates: {
    canonical: 'https://freeqrcode.tools/qr-typosquat-checker',
  },
  openGraph: {
    title: 'QR Typosquat Checker — QR Studio',
    description:
      'Enter a domain to see the typo variants an attacker could use against it — omissions, swaps, duplications, keyboard neighbours, homoglyph lookalikes, and TLD swaps. The variants are generated algorithmically in your browser; the tool does not check whether any of them are registered.',
    url: 'https://freeqrcode.tools/qr-typosquat-checker',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QR Typosquat Checker — QR Studio',
    description:
      'Enter a domain to see the typo variants an attacker could use against it — omissions, swaps, duplications, keyboard neighbours, homoglyph lookalikes, and TLD swaps. The variants are generated algorithmically in your browser; the tool does not check whether any of them are registered.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
