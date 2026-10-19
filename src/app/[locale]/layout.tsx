/**
 * Locale layout (Phase 8).
 *
 * Validates the `[locale]` param, pins the request locale for next-intl,
 * applies `lang` / `dir` (rtl for ar + ur), and emits hreflang alternates for
 * every supported locale plus `x-default`.
 *
 * Note: only the root layout may render `<html>`, so `lang`/`dir` are applied
 * to a `display: contents` wrapper — it affects inheritance without altering
 * layout. (If the root layout is ever i18n-aware, move `lang`/`dir` there.)
 */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { routing, defaultLocale, rtlLocales } from '@/i18n/routing';
import { localizedLanguages } from '@/i18n/metadata';
import { siteConfig } from '@/config/site';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return {
    metadataBase: new URL(siteConfig.url),
    alternates: {
      // Self-referencing canonical for the requested locale variant.
      canonical: locale === defaultLocale ? '/' : `/${locale}`,
      languages: localizedLanguages('/', '/'),
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const dir = (rtlLocales as readonly string[]).includes(locale) ? 'rtl' : 'ltr';

  return (
    <div lang={locale} dir={dir} className="contents">
      {children}
    </div>
  );
}
