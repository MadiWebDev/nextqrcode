/**
 * Localized vCard tool page (Phase 8).
 *
 * Thin wrapper: pins the request locale, then renders the existing
 * `VcardLandingPage` server component unchanged.
 */
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import VcardLandingPage from '@/app/vcard-qr-code-generator/page';
import { localizedLanguages } from '@/i18n/metadata';
import { siteConfig } from '@/config/site';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: 'Free vCard QR Code Generator — Digital Business Card',
    description:
      "Create a vCard QR code that saves your full contact details directly into the scanner's address book. Replace paper business cards with a stylish, sustainable digital alternative.",
    alternates: {
      canonical: `${siteConfig.url}/${locale}/vcard`,
      languages: localizedLanguages('/vcard-qr-code-generator', '/vcard'),
    },
  };
}

export default async function LocalizedVcardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <VcardLandingPage />;
}
