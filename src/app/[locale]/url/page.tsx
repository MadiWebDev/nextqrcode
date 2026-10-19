/**
 * Localized URL tool page (Phase 8).
 *
 * Thin wrapper: pins the request locale, then renders the existing
 * `UrlLandingPage` server component unchanged.
 */
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import UrlLandingPage from '@/app/url-qr-code-generator/page';
import { localizedLanguages } from '@/i18n/metadata';
import { siteConfig } from '@/config/site';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: 'Free URL QR Code Generator — Link Anything with a QR Code',
    description:
      'Turn any website URL into a scannable QR code in seconds. Perfect for marketing materials, business cards, and product packaging. Download in PNG, SVG, or PDF format for free.',
    alternates: {
      canonical: `${siteConfig.url}/${locale}/url`,
      languages: localizedLanguages('/url-qr-code-generator', '/url'),
    },
  };
}

export default async function LocalizedUrlPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <UrlLandingPage />;
}
