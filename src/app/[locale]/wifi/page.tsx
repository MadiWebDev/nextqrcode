/**
 * Localized WiFi tool page (Phase 8).
 *
 * Thin wrapper: pins the request locale, then renders the existing
 * `WifiQRPage` client component unchanged.
 */
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import WifiQRPage from '@/app/wifi-qr-code-generator/page';
import { localizedLanguages } from '@/i18n/metadata';
import { siteConfig } from '@/config/site';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: 'Free WiFi QR Code Generator — Share Your Network Instantly',
    description:
      'Create a WiFi QR code that connects guests to your network in one scan — no password typing, no errors. Download PNG, SVG, or PDF for free.',
    alternates: {
      canonical: `${siteConfig.url}/${locale}/wifi`,
      languages: localizedLanguages('/wifi-qr-code-generator', '/wifi'),
    },
  };
}

export default async function LocalizedWifiPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <WifiQRPage />;
}
