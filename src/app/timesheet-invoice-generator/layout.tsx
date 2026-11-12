import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Free Timesheet Invoice Generator for Freelancers — QR Studio',
  description:
    'Free timesheet invoice generator: log dated work entries with hours and rates, group them by project, and turn the timesheet into a professional invoice PDF.',
  alternates: { canonical: 'https://freeqrcode.tools/timesheet-invoice-generator' },
  openGraph: {
    title: 'Free Timesheet Invoice Generator for Freelancers — QR Studio',
    description:
      'Free timesheet invoice generator: log dated work entries with hours and rates, group them by project, and turn the timesheet into a professional invoice PDF.',
    url: 'https://freeqrcode.tools/timesheet-invoice-generator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Timesheet Invoice Generator for Freelancers — QR Studio',
    description:
      'Free timesheet invoice generator: log dated work entries with hours and rates, group them by project, and turn the timesheet into a professional invoice PDF.',
  },
  robots: { index: true, follow: true },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
