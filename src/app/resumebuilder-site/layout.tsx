import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { ResumeHeader } from './_components/ResumeHeader';
import { ResumeFooter } from './_components/ResumeFooter';

const TITLE = 'Free Resume Builder — CV Maker with No Sign-Up, No Watermark';
const DESCRIPTION =
  'Build a professional resume or CV for free: 45+ profession-specific templates, real PDF and DOCX downloads, profile photo, QR code and an explainable ATS check. Everything runs in your browser — your data never leaves your device.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: 'https://resumebuilder.freeqrcode.tools/' },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: 'https://resumebuilder.freeqrcode.tools/',
    type: 'website',
    siteName: 'Resume Builder',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [{ url: '/resumebuilder-logo.svg', type: 'image/svg+xml' }],
    shortcut: '/resumebuilder-logo.svg',
  },
};

/**
 * The Resume Builder site's own chrome. The main site's AppHeader /
 * AppFooter are hidden on these pages by the :has() rule in
 * src/app/globals.css (external stylesheet on purpose — see the CSP
 * lesson documented there).
 */
export default function ResumeBuilderLayout({ children }: { children: ReactNode }) {
  return (
    <div className="resumebuilder-site-root flex min-h-screen flex-col">
      <ResumeHeader />
      <div className="flex-1">{children}</div>
      <ResumeFooter />
    </div>
  );
}
