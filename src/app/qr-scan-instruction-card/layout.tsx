import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'QR Scan Instruction Card — QR Studio',
  description:
    'Generate a printable How to scan instruction card — iPhone and Android steps — in several languages and layouts.',
  alternates: {
    canonical: 'https://freeqrcode.tools/qr-scan-instruction-card',
  },
  openGraph: {
    title: 'QR Scan Instruction Card — QR Studio',
    description:
      'Generate a printable How to scan instruction card — iPhone and Android steps — in several languages and layouts.',
    url: 'https://freeqrcode.tools/qr-scan-instruction-card',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QR Scan Instruction Card — QR Studio',
    description:
      'Generate a printable How to scan instruction card — iPhone and Android steps — in several languages and layouts.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
