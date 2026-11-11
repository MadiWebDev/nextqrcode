import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Employee ID Card Generator — QR Studio',
  description:
    'Create professional employee ID cards with photo, company logo, designation, department and an optional QR code. Free in-browser maker with print-ready PNG.',
  alternates: { canonical: 'https://freeqrcode.tools/employee-id-card-generator' },
  openGraph: {
    title: 'Employee ID Card Generator — QR Studio',
    description:
      'Create professional employee ID cards with photo, company logo, designation, department and an optional QR code. Free in-browser maker with print-ready PNG.',
    url: 'https://freeqrcode.tools/employee-id-card-generator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Employee ID Card Generator — QR Studio',
    description:
      'Create professional employee ID cards with photo, company logo, designation, department and an optional QR code. Free in-browser maker with print-ready PNG.',
  },
  robots: { index: true, follow: true },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
