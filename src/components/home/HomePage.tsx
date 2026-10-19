/**
 * Shared home page content (Phase 8).
 *
 * Renders the full home page body for both `/` (English, via `src/app/page.tsx`)
 * and `/[locale]` (via `src/app/[locale]/page.tsx`). Copy lives in
 * `src/i18n/messages/*.json` under the `home` namespace; icons, links and
 * layout stay in code.
 */
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { HomeGenerator } from '@/components/HomeGenerator';
import { AdSlot } from '@/components/AdSlot';
import {
  Calculator,
  ShieldCheck,
  Camera,
  Wrench,
  Layers,
  Radio,
  HeartPulse,
  Wifi,
  CreditCard,
  Grid,
  Heart,
  Users,
  TrendingUp,
  Compass,
  Barcode,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Sparkles,
  Zap,
  Lock,
  Globe2,
  FileCheck,
  Tag,
  Smartphone,
  Building2,
  Ruler,
  Library,
  GitCompare,
  HelpCircle,
  type LucideIcon,
} from 'lucide-react';
import { getAllArticles } from '@/lib/articles';
import { getAllCountries } from '@/data/countries';
import { getAllPaymentSchemes } from '@/data/payments';
import { getAllLabelSheets } from '@/data/labels';
import { JsonLd } from '@/lib/seo/jsonld';

interface ToolMeta {
  href: string;
  icon: LucideIcon;
  accent: string;
}

const FEATURED_TOOL_META: ToolMeta[] = [
  {
    href: '/qr-size-calculator',
    icon: Calculator,
    accent: 'from-blue-500/10 to-indigo-500/10 text-blue-600 dark:text-blue-400',
  },
  {
    href: '/qr-safety-checker',
    icon: ShieldCheck,
    accent: 'from-emerald-500/10 to-teal-500/10 text-emerald-600 dark:text-emerald-400',
  },
  {
    href: '/printed-qr-tester',
    icon: Camera,
    accent: 'from-purple-500/10 to-pink-500/10 text-purple-600 dark:text-purple-400',
  },
  {
    href: '/error-correction-simulator',
    icon: Wrench,
    accent: 'from-amber-500/10 to-orange-500/10 text-amber-600 dark:text-amber-400',
  },
  {
    href: '/qr-splitter-scanner',
    icon: Layers,
    accent: 'from-cyan-500/10 to-blue-500/10 text-cyan-600 dark:text-cyan-400',
  },
  {
    href: '/animated-qr-transfer',
    icon: Radio,
    accent: 'from-rose-500/10 to-red-500/10 text-rose-600 dark:text-rose-400',
  },
  {
    href: '/medical-id-qr',
    icon: HeartPulse,
    accent: 'from-red-500/10 to-rose-500/10 text-red-600 dark:text-red-400',
  },
  {
    href: '/wifi-sign-generator',
    icon: Wifi,
    accent: 'from-sky-500/10 to-indigo-500/10 text-sky-600 dark:text-sky-400',
  },
  {
    href: '/pakistan-payment-qr',
    icon: CreditCard,
    accent: 'from-emerald-500/10 to-green-500/10 text-emerald-600 dark:text-emerald-400',
  },
  {
    href: '/qr-sticker-sheet-printer',
    icon: Grid,
    accent: 'from-violet-500/10 to-purple-500/10 text-violet-600 dark:text-violet-400',
  },
  {
    href: '/pet-tag-qr',
    icon: Heart,
    accent: 'from-pink-500/10 to-rose-500/10 text-pink-600 dark:text-pink-400',
  },
  {
    href: '/bulk-vcard-qr',
    icon: Users,
    accent: 'from-blue-500/10 to-sky-500/10 text-blue-600 dark:text-blue-400',
  },
  {
    href: '/utm-builder',
    icon: TrendingUp,
    accent: 'from-amber-500/10 to-yellow-500/10 text-amber-600 dark:text-amber-400',
  },
  {
    href: '/qr-placement-guide',
    icon: Compass,
    accent: 'from-teal-500/10 to-emerald-500/10 text-teal-600 dark:text-teal-400',
  },
  {
    href: '/barcode-generator',
    icon: Barcode,
    accent: 'from-slate-500/10 to-zinc-500/10 text-slate-600 dark:text-slate-400',
  },
];

interface HubMeta {
  href: string;
  icon: LucideIcon;
  accent: string;
  /** Key into `home.hubs.counts`, or null when no live count is shown. */
  countKey: 'labelSheets' | 'countries' | 'paymentSchemes' | null;
}

/** Programmatic content hub cards shown below tools */
const CONTENT_HUB_META: HubMeta[] = [
  {
    href: '/qr-labels',
    icon: Tag,
    accent: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
    countKey: 'labelSheets',
  },
  {
    href: '/whatsapp-qr',
    icon: Globe2,
    accent: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    countKey: 'countries',
  },
  {
    href: '/payment-qr',
    icon: CreditCard,
    accent: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    countKey: 'paymentSchemes',
  },
  {
    href: '/scan-guide',
    icon: Smartphone,
    accent: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
    countKey: null,
  },
  {
    href: '/industries',
    icon: Building2,
    accent: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    countKey: null,
  },
  {
    href: '/qr-size-guide',
    icon: Ruler,
    accent: 'bg-teal-500/10 text-teal-600 dark:text-teal-400',
    countKey: null,
  },
  {
    href: '/glossary',
    icon: Library,
    accent: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
    countKey: null,
  },
  {
    href: '/compare',
    icon: GitCompare,
    accent: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
    countKey: null,
  },
];

const VALUE_PROP_ICONS: { icon: LucideIcon; iconClass: string }[] = [
  {
    icon: Lock,
    iconClass: 'bg-primary/10 text-primary',
  },
  {
    icon: Zap,
    iconClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  },
  {
    icon: FileCheck,
    iconClass: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  },
  {
    icon: Globe2,
    iconClass: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  },
];

interface CopyCard {
  title: string;
  desc: string;
  category?: string;
}

interface FaqItem {
  q: string;
  a: string;
}

export async function HomePageContent() {
  const t = await getTranslations('home');
  const articles = getAllArticles().slice(0, 6);
  const countries = getAllCountries();
  const payments = getAllPaymentSchemes();
  const labels = getAllLabelSheets();

  const valueProps = t.raw('valueProps') as { title: string; desc: string }[];
  const toolCards = t.raw('tools.cards') as CopyCard[];
  const hubCards = t.raw('hubs.cards') as CopyCard[];
  const faqItems = t.raw('faq.items') as FaqItem[];

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'QR Code Tools',
    url: 'https://freeqrcode.tools',
    description: 'Professional browser-based QR code generator and optical engineering platform.',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://freeqrcode.tools/sitemap-page?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'QR Studio',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Web',
    url: 'https://freeqrcode.tools',
    description:
      'Free online QR code generator suite with 40+ code types, optical size calculator, safety checker, and print-ready exports.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: [
      'QR Code Generator (40+ types)',
      'QR Size & Distance Calculator',
      'QR Safety & Phishing Checker',
      'Print-Ready SVG & PDF Export',
      'Label Sheet Grid Layout',
      'WhatsApp Country-Specific QR',
      'Payment QR (UPI, Raast, Pix, SGQR)',
      'Offline Animated File Transfer',
      'Error Correction Damage Simulator',
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <JsonLd data={softwareSchema} />

      {/* Main Interactive Studio Hero */}
      <HomeGenerator />

      {/* Zero-CLS Top Ad Slot */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdSlot id="home-top" format="horizontal-banner" />
      </div>

      {/* Architectural Value Props */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {valueProps.map((prop, i) => {
            const meta = VALUE_PROP_ICONS[i % VALUE_PROP_ICONS.length];
            const Icon = meta.icon;
            return (
              <div
                key={prop.title}
                className="p-5 rounded-2xl border border-border/70 bg-card shadow-2xs"
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${meta.iconClass}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-foreground">{prop.title}</h4>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{prop.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 15 Specialized Optical & QR Engineering Tools */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 border-t border-border/60">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('tools.badge')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              {t('tools.title')}
            </h2>
            <p className="text-muted-foreground text-xs sm:text-sm mt-1 max-w-2xl">
              {t('tools.subtitle')}
            </p>
          </div>
          <Link
            href="/sitemap-page"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline shrink-0"
          >
            <span>{t('tools.exploreSitemap')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED_TOOL_META.map((meta, i) => {
            const copy = toolCards[i];
            const Icon = meta.icon;
            if (!copy) return null;
            return (
              <Link
                key={meta.href}
                href={meta.href}
                className="group border border-border/70 hover:border-primary/50 rounded-2xl p-5 bg-card hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center transition-transform group-hover:scale-105 ${meta.accent}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                      {copy.category}
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors leading-snug">
                    {copy.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{copy.desc}</p>
                </div>
                <div className="pt-4 mt-3 border-t border-border/40 flex items-center gap-1 text-xs font-semibold text-primary">
                  <span>{t('tools.openTool')}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── Mid-Page Compliant Ad Slot ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <AdSlot id="home-mid" format="horizontal-banner" />
      </div>

      {/* ── Programmatic Content Hub Grid ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 border-t border-border/60">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 mb-2">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{t('hubs.badge')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              {t('hubs.title')}
            </h2>
            <p className="text-muted-foreground text-xs sm:text-sm mt-1 max-w-2xl">
              {t('hubs.subtitle')}
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CONTENT_HUB_META.map((meta, i) => {
            const copy = hubCards[i];
            const Icon = meta.icon;
            if (!copy) return null;
            // Resolve live counts from data
            const count =
              meta.href === '/qr-labels'
                ? labels.length
                : meta.href === '/whatsapp-qr'
                  ? countries.length
                  : meta.href === '/payment-qr'
                    ? payments.length
                    : null;
            const countLabel = meta.countKey ? t(`hubs.counts.${meta.countKey}`) : null;

            return (
              <Link
                key={meta.href}
                href={meta.href}
                className="group border border-border/70 hover:border-primary/40 rounded-2xl p-5 bg-card hover:shadow-md transition-all"
              >
                <div
                  className={`w-10 h-10 rounded-xl ${meta.accent} flex items-center justify-center mb-3`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors leading-snug mb-1">
                  {copy.title}
                </h3>
                {count !== null && countLabel && (
                  <p className="text-[10px] font-bold text-primary mb-1">
                    {count} {countLabel}
                  </p>
                )}
                <p className="text-xs text-muted-foreground leading-relaxed">{copy.desc}</p>
                <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-primary">
                  <span>{t('hubs.explore')}</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── Featured Country Quick-Links ── */}
      {countries.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-border/60">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-4">
            <div>
              <h2 className="text-xl font-extrabold tracking-tight text-foreground">
                {t('countries.title')}
              </h2>
              <p className="text-muted-foreground text-xs mt-1">{t('countries.subtitle')}</p>
            </div>
            <Link
              href="/whatsapp-qr"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline shrink-0"
            >
              {t('countries.all', { count: countries.length })} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {countries.map((c) => (
              <Link
                key={c.slug}
                href={`/whatsapp-qr/${c.slug}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/70 bg-card hover:border-primary/50 hover:bg-primary/5 transition-all text-xs font-medium text-foreground"
              >
                <span>{c.isoCode}</span>
                <span className="text-muted-foreground">{c.callingCode}</span>
                <span className="font-semibold">{c.name}</span>
              </Link>
            ))}
            <Link
              href="/whatsapp-qr"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-dashed border-border/70 text-xs text-muted-foreground hover:text-primary hover:border-primary/40 transition-all"
            >
              {t('countries.more', { count: 40 })} <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </section>
      )}

      {/* ── Payment QR Quick-Links ── */}
      {payments.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t border-border/60">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-4">
            <div>
              <h2 className="text-xl font-extrabold tracking-tight text-foreground">
                {t('payments.title')}
              </h2>
              <p className="text-muted-foreground text-xs mt-1">{t('payments.subtitle')}</p>
            </div>
            <Link
              href="/payment-qr"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline shrink-0"
            >
              {t('payments.all', { count: payments.length })} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {payments.map((p) => (
              <Link
                key={p.slug}
                href={`/payment-qr/${p.slug}`}
                className="group border border-border/70 hover:border-primary/40 rounded-xl p-4 bg-card hover:shadow-sm transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-foreground group-hover:text-primary transition-colors leading-tight">
                    {p.name}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                    {p.currency}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  {p.governingBody} · {p.country}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Cornerstone Guides & Research */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-border/60">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{t('guides.badge')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              {t('guides.title')}
            </h2>
            <p className="text-muted-foreground text-xs sm:text-sm mt-1">{t('guides.subtitle')}</p>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline shrink-0"
          >
            <span>{t('guides.viewAll', { count: getAllArticles().length })}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((art) => (
            <article
              key={art.slug}
              className="border border-border/70 rounded-2xl p-5 bg-card hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider block mb-2">
                  {art.category}
                </span>
                <h3 className="font-bold text-base text-foreground leading-snug hover:text-primary transition-colors">
                  <Link href={`/blog/${art.slug}`}>{art.title}</Link>
                </h3>
                <p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
                  {art.description}
                </p>
              </div>
              <div className="pt-4 mt-3 border-t border-border/40 flex items-center justify-between text-xs">
                <span className="text-muted-foreground text-[11px]">{art.readTime}</span>
                <Link
                  href={`/blog/${art.slug}`}
                  className="font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  {t('guides.readGuide')} <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* FAQ Section — addresses common questions for SEO */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-border/60">
        <h2 className="text-xl font-extrabold tracking-tight text-foreground mb-6 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-primary" />
          {t('faq.title')}
        </h2>
        <div className="space-y-4">
          {faqItems.map((item, i) => (
            <details key={i} className="border border-border/60 rounded-xl bg-card">
              <summary className="px-5 py-4 cursor-pointer text-sm font-semibold text-foreground hover:text-primary transition-colors list-none flex items-center justify-between">
                {item.q}
                <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              </summary>
              <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed">
                {item.a}
              </div>
            </details>
          ))}
        </div>
        {/* FAQ Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: faqItems.map((item) => ({
                '@type': 'Question',
                name: item.q,
                acceptedAnswer: { '@type': 'Answer', text: item.a },
              })),
            }),
          }}
        />
      </section>

      {/* AdSlot before footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <AdSlot id="home-bottom" format="horizontal-banner" />
      </div>
    </>
  );
}
