import type { Metadata } from 'next';
import { HomePageContent } from '@/components/home/HomePage';
import { AdSlot } from '@/components/AdSlot';

export const metadata: Metadata = {
  title: 'Free QR Code Generator & Optical Engineering Suite — QR Code Tools',
  description:
    'Generate beautiful, professional QR codes & barcodes 100% in your browser. 40+ types, instant vector SVG/PDF download, distance calculator, safety inspector, and offline file transfer. Zero tracking.',
  alternates: { canonical: 'https://freeqrcode.tools' },
  openGraph: {
    title: 'Free QR Code Generator & Optical Engineering Suite — QR Code Tools',
    description:
      'High-precision client-side QR tools suite: 40+ symbologies, print sizing calculator, anti-quishing safety checker, and air-gapped data transfer. No sign-up.',
    url: 'https://freeqrcode.tools',
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
      {/* Bottom slot. ID is home-bottom-2 (not home-bottom) to stay unique
          against the pre-existing home-bottom slot inside HomePageContent. */}
      <AdSlot id="home-bottom-2" format="horizontal-banner" />
    </>
  );
}
