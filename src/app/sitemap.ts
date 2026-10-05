/**
 * QR Studio — Sitemap Index
 *
 * Architecture:
 *  • /sitemap.xml → this file, returns all entries (Next.js single sitemap)
 *  • Sections are logically grouped and change-frequency / priority
 *    tuned per section for optimal crawl budget allocation.
 *  • Max 5,000 URLs per sitemap file (Next.js handles splitting automatically
 *    via the `generateSitemaps()` API when needed).
 *  • noindex pages and draft pages are EXCLUDED from sitemap.
 *  • hreflang only added for truly translated pages (not keyword variations).
 */
import type { MetadataRoute } from 'next';
import { getAllArticles } from '@/lib/articles';
import { getAllCountries } from '@/data/countries';
import { getAllPaymentSchemes } from '@/data/payments';
import { getAllLabelSheets } from '@/data/labels';

const BASE = 'https://qrstudio.app';

/** Helper: build a sitemap entry */
function entry(
  path: string,
  opts?: Partial<{
    lastModified: Date;
    changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
    priority: number;
  }>
): MetadataRoute.Sitemap[number] {
  return {
    url: `${BASE}${path}`,
    lastModified: opts?.lastModified ?? new Date(),
    changeFrequency: opts?.changeFrequency ?? 'monthly',
    priority: opts?.priority ?? 0.7,
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const weekly = 'weekly' as const;
  const monthly = 'monthly' as const;

  // ── SECTION: Core / Home ────────────────────────────────────────────────
  const coreEntries: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, changeFrequency: weekly, priority: 1.0 },
    entry('/sitemap-page', { priority: 0.5 }),
    entry('/blog', { changeFrequency: weekly, priority: 0.9 }),
  ];

  // ── SECTION: Premium Tools ───────────────────────────────────────────────
  const toolPaths = [
    '/qr-size-calculator',
    '/qr-safety-checker',
    '/printed-qr-tester',
    '/error-correction-simulator',
    '/qr-splitter-scanner',
    '/animated-qr-transfer',
    '/medical-id-qr',
    '/wifi-sign-generator',
    '/pakistan-payment-qr',
    '/regional-payment-qr',
    '/qr-sticker-sheet-printer',
    '/pet-tag-qr',
    '/bulk-vcard-qr',
    '/bulk-vcard-generator',
    '/utm-builder',
    '/qr-placement-guide',
    '/barcode-generator',
  ];
  const toolEntries = toolPaths.map((p) =>
    entry(p, { changeFrequency: weekly, priority: 0.9 })
  );

  // ── SECTION: Standard QR Type Generators ────────────────────────────────
  const generatorPaths = [
    '/url-qr-code-generator',
    '/wifi-qr-code-generator',
    '/vcard-qr-code-generator',
    '/whatsapp-qr-code-generator',
    '/upi-qr-code-generator',
    '/bitcoin-qr-code-generator',
  ];
  const generatorEntries = generatorPaths.map((p) =>
    entry(p, { changeFrequency: monthly, priority: 0.85 })
  );

  // ── SECTION: Label / Sticker Sheet Pages ────────────────────────────────
  const labelEntries = getAllLabelSheets()
    .filter(() => true) // all approved
    .map((sheet) =>
      entry(`/qr-labels/${sheet.slug}`, {
        changeFrequency: monthly,
        priority: 0.8,
      })
    );

  // ── SECTION: WhatsApp Country Pages ─────────────────────────────────────
  const countryEntries = getAllCountries().map((c) =>
    entry(`/whatsapp-qr/${c.slug}`, {
      changeFrequency: monthly,
      priority: 0.8,
    })
  );

  // ── SECTION: Payment QR Scheme Pages ────────────────────────────────────
  const paymentEntries = getAllPaymentSchemes().map((p) =>
    entry(`/payment-qr/${p.slug}`, {
      changeFrequency: monthly,
      priority: 0.8,
    })
  );

  // ── SECTION: Blog / Technical Guides ────────────────────────────────────
  const articleEntries = getAllArticles().map((art) =>
    entry(`/blog/${art.slug}`, {
      lastModified: new Date(art.updatedAt),
      changeFrequency: monthly,
      priority: 0.8,
    })
  );

  // ── SECTION: Trust / Legal ───────────────────────────────────────────────
  const trustPaths = [
    '/about',
    '/contact',
    '/privacy',
    '/terms',
    '/cookie-policy',
    '/disclaimer',
  ];
  const trustEntries = trustPaths.map((p) =>
    entry(p, { changeFrequency: 'yearly' as const, priority: 0.4 })
  );

  // ── FUTURE SECTIONS (placeholder — will populate as data files are added) ──
  // Industry × Use-Case:  /industries/[slug]
  // Device Guides:        /scan-guide/[slug]
  // Size Guides:          /qr-size-guide/[slug]
  // Glossary:             /glossary/[slug]
  // Template Gallery:     /templates/[slug]
  // Comparison Pages:     /compare/[slug]
  // How-To Guides:        /how-to/[slug]
  //
  // These are intentionally NOT added until the pages pass the quality gate
  // and status === 'published'. The programmatic route generators at each
  // segment will export their own generateStaticParams() and the sitemap
  // will import their data loaders once implemented.

  return [
    ...coreEntries,
    ...toolEntries,
    ...generatorEntries,
    ...labelEntries,
    ...countryEntries,
    ...paymentEntries,
    ...articleEntries,
    ...trustEntries,
  ];
}
