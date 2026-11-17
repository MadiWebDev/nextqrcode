import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { SocialFooter } from './_components/SocialFooter';
import { SocialHeader } from './_components/SocialHeader';

const TITLE = 'Social Media Calendar — Free, Private Content Planner';
const DESCRIPTION =
  'Plan your social media content with a free, privacy-first calendar. Multi-platform planning, campaigns, approvals, analytics and exports — all stored locally in your browser. No sign-up.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: 'https://socialcalendar.freeqrcode.tools/' },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: 'https://socialcalendar.freeqrcode.tools/',
    type: 'website',
    siteName: 'Social Media Calendar',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [{ url: '/socialcalendar-logo.svg', type: 'image/svg+xml' }],
    shortcut: '/socialcalendar-logo.svg',
  },
};

/**
 * The Social Calendar site's own chrome. The main site's AppHeader /
 * AppFooter are hidden on these pages by the :has() rule in
 * src/app/globals.css (external stylesheet on purpose — see the CSP
 * lesson documented there).
 */
export default function SocialCalendarLayout({ children }: { children: ReactNode }) {
  return (
    <div className="socialcalendar-site-root flex min-h-screen flex-col">
      <SocialHeader />
      <div className="flex-1">{children}</div>
      <SocialFooter />
    </div>
  );
}
