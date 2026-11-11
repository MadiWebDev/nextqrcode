import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Student ID Card Generator — QR Studio',
  description:
    'Design and print custom student ID cards with photo, school logo, pupil details and an optional QR code. Free, private and in your browser — no sign-up needed.',
  alternates: { canonical: 'https://freeqrcode.tools/student-id-card-generator' },
  openGraph: {
    title: 'Student ID Card Generator — QR Studio',
    description:
      'Design and print custom student ID cards with photo, school logo, pupil details and an optional QR code. Free, private and in your browser — no sign-up needed.',
    url: 'https://freeqrcode.tools/student-id-card-generator',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Student ID Card Generator — QR Studio',
    description:
      'Design and print custom student ID cards with photo, school logo, pupil details and an optional QR code. Free, private and in your browser — no sign-up needed.',
  },
  robots: { index: true, follow: true },
};

export default function ToolLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
