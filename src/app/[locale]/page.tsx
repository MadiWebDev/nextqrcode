/**
 * Localized home page (Phase 8).
 *
 * Pins the request locale, then renders the same shared home body as `/`
 * (`src/components/home/HomePage.tsx`). Copy resolves from
 * `src/i18n/messages/<locale>.json`.
 */
import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { HomePageContent } from '@/components/home/HomePage';
import { localizedLanguages } from '@/i18n/metadata';
import { defaultLocale } from '@/i18n/routing';
import { siteConfig } from '@/config/site';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home.meta' });

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: locale === defaultLocale ? siteConfig.url : `${siteConfig.url}/${locale}`,
      languages: localizedLanguages('/', '/'),
    },
  };
}

export default async function LocalizedHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <HomePageContent />;
}
