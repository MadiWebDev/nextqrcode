import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Salary Slip Generator — QR Studio',
  description:
    'Free salary slip generator: create professional payslips with earnings, allowances, deductions and net pay in words, six currencies and instant PDF download.',
  alternates: { canonical: 'https://freeqrcode.tools/salary-slip-generator' },
  openGraph: {
    title: 'Salary Slip Generator — QR Studio',
    description:
      'Free salary slip generator: create professional payslips with earnings, allowances, deductions and net pay in words, six currencies and instant PDF download.',
    url: 'https://freeqrcode.tools/salary-slip-generator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Salary Slip Generator — QR Studio',
    description:
      'Free salary slip generator: create professional payslips with earnings, allowances, deductions and net pay in words, six currencies and instant PDF download.',
  },
  robots: { index: true, follow: true },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
