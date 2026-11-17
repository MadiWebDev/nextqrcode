import type { Metadata } from 'next';
import { HomePageContent } from '@/components/home/HomePage';
import { localizedLanguages } from '@/i18n/metadata';
import { siteConfig } from '@/config/site';
import { AdSlot } from '@/components/AdSlot';
import { AdInContent } from '@/components/ads/AdInContent';

export const metadata: Metadata = {
  title: 'Free QR Code Generator — No Sign-Up, PNG, SVG & PDF',
  description:
    'Generate free QR codes for URLs, WiFi, WhatsApp, vCards, payments and more — with custom colors and logos. Download PNG, SVG or PDF. No sign-up.',
  alternates: {
    canonical: siteConfig.url,
    languages: localizedLanguages('/', '/'),
  },
  openGraph: {
    title: 'Free QR Code Generator — No Sign-Up, PNG, SVG & PDF',
    description:
      'Generate free QR codes for URLs, WiFi, WhatsApp, vCards, payments and more — with custom colors and logos. Download PNG, SVG or PDF. No sign-up.',
    url: siteConfig.url,
    type: 'website',
  },
};

/**
 * Root `/` stays English (next-intl `localePrefix: 'as-needed'` keeps the
 * default locale unprefixed). Shared body lives in
 * `src/components/home/HomePage.tsx` so `/[locale]` renders the same content.
 */
export default function HomePage() {
  return (
    <>
      <HomePageContent />
      {/* Google AdSense in-content slot — below the main tool area */}
      <AdInContent eligible={true} />
      {/* Bottom slot. ID is home-bottom-2 (not home-bottom) to stay unique
          against the pre-existing home-bottom slot inside HomePageContent. */}
      <AdSlot id="home-bottom-2" format="horizontal-banner" />
    </>
  );
}
