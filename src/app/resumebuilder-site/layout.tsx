import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import {
  IBM_Plex_Sans,
  Lora,
  Noto_Naskh_Arabic,
  Noto_Nastaliq_Urdu,
  Playfair_Display,
  Source_Serif_4,
  Work_Sans,
} from 'next/font/google';
import { ResumeHeader } from './_components/ResumeHeader';
import { ResumeFooter } from './_components/ResumeFooter';

// Self-hosted resume fonts (spec §7): loaded once for this site only,
// referenced by the font pairs in _lib/fonts.ts. Arabic-script pairs
// are first-class: Nastaliq for Urdu, Naskh for Arabic.
const sourceSerif = Source_Serif_4({ subsets: ['latin'], weight: ['400', '600', '700'], display: 'swap' });
const playfair = Playfair_Display({ subsets: ['latin'], weight: ['500', '700'], display: 'swap' });
const lora = Lora({ subsets: ['latin'], weight: ['400', '600', '700'], display: 'swap' });
const workSans = Work_Sans({ subsets: ['latin'], weight: ['400', '500', '600'], display: 'swap' });
const plexSans = IBM_Plex_Sans({ subsets: ['latin'], weight: ['400', '500', '600'], display: 'swap' });
const naskh = Noto_Naskh_Arabic({ subsets: ['arabic'], weight: ['400', '600', '700'], display: 'swap' });
const nastaliq = Noto_Nastaliq_Urdu({ subsets: ['arabic'], weight: ['400', '600', '700'], display: 'swap' });

const RESUME_FONT_CLASSES = [
  sourceSerif.className,
  playfair.className,
  lora.className,
  workSans.className,
  plexSans.className,
  naskh.className,
  nastaliq.className,
].join(' ');

const TITLE = 'Free Resume Builder — CV Maker with No Sign-Up, No Watermark';
const DESCRIPTION =
  'Build a professional resume or CV for free: 47 profession-specific templates, real PDF and DOCX downloads, profile photo, QR code and an explainable ATS check. Everything runs in your browser — your data never leaves your device.';

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
    <div className={`resumebuilder-site-root flex min-h-screen flex-col ${RESUME_FONT_CLASSES}`}>
      <ResumeHeader />
      <div className="flex-1">{children}</div>
      <ResumeFooter />
    </div>
  );
}
