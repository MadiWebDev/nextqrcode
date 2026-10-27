import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'QR Phishing Pattern Trainer — QR Studio',
  description:
    'Ten realistic QR scenarios. Judge each one safe or unsafe, then read the explanation. Your score is tracked as you go — the goal is the pattern recognition, not the number.',
  alternates: {
    canonical: 'https://freeqrcode.tools/qr-phishing-pattern-trainer',
  },
  openGraph: {
    title: 'QR Phishing Pattern Trainer — QR Studio',
    description:
      'Ten realistic QR scenarios. Judge each one safe or unsafe, then read the explanation. Your score is tracked as you go — the goal is the pattern recognition, not the number.',
    url: 'https://freeqrcode.tools/qr-phishing-pattern-trainer',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QR Phishing Pattern Trainer — QR Studio',
    description:
      'Ten realistic QR scenarios. Judge each one safe or unsafe, then read the explanation. Your score is tracked as you go — the goal is the pattern recognition, not the number.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
