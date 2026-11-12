import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Payment Reminder Letter Generator — QR Studio',
  description:
    'Free payment reminder letter generator: create friendly, firm or final-notice letters with overdue days, late fees and payment details, then download PDF.',
  alternates: {
    canonical: 'https://freeqrcode.tools/payment-reminder-letter-generator',
  },
  openGraph: {
    title: 'Payment Reminder Letter Generator — QR Studio',
    description:
      'Free payment reminder letter generator: create friendly, firm or final-notice letters with overdue days, late fees and payment details, then download PDF.',
    url: 'https://freeqrcode.tools/payment-reminder-letter-generator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Payment Reminder Letter Generator — QR Studio',
    description:
      'Free payment reminder letter generator: create friendly, firm or final-notice letters with overdue days, late fees and payment details, then download PDF.',
  },
  robots: { index: true, follow: true },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
