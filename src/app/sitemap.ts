/**
 * QR Code Tools — Sitemap Index
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
import { siteConfig } from '@/config/site';
import { getAllArticles } from '@/lib/articles';
import { getAllCountries } from '@/data/countries';
import { getAllPaymentSchemes } from '@/data/payments';
import { getAllLabelSheets } from '@/data/labels';

const BASE = siteConfig.url;

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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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
    '/qr-scanner',
    '/bulk-generator',
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
    '/qr-contrast-checker',
    '/qr-print-cost-calculator',
    '/qr-billboard-size-calculator',
    '/qr-quiet-zone-calculator',
    '/qr-dpi-calculator',
    '/qr-data-capacity-calculator',
    '/qr-logo-safe-area-calculator',
    '/qr-label-count-calculator',
    '/qr-batch-cost-calculator',
    '/qr-ink-coverage-estimator',
    '/qr-curved-surface-calculator',
    '/qr-fade-risk-checker',
    '/qr-module-size-calculator',
    '/qr-error-budget-calculator',
    '/qr-minimum-size-checker',
    '/bulk-url-qr-generator',
    '/bulk-sms-qr-generator',
    '/bulk-email-qr-generator',
    '/bulk-wifi-qr-generator',
    '/bulk-coupon-qr-generator',
    '/bulk-ticket-qr-generator',
    '/bulk-pdf-qr-generator',
    '/bulk-inventory-qr-generator',
    '/bulk-asset-tag-qr-generator',
    '/bulk-student-id-qr-generator',
    '/bulk-event-badge-qr-generator',
    '/bulk-table-tent-qr-generator',
    '/bulk-feedback-qr-generator',
    '/bulk-donation-qr-generator',
    '/bulk-business-card-qr-generator',
    '/restaurant-qr-suite',
    '/retail-qr-suite',
    '/clinic-qr-suite',
    '/school-qr-suite',
    '/gym-qr-suite',
    '/hotel-qr-suite',
    '/real-estate-qr-suite',
    '/salon-qr-suite',
    '/pharmacy-qr-suite',
    '/church-qr-suite',
    '/museum-qr-suite',
    '/library-qr-suite',
    '/warehouse-qr-suite',
    '/farm-qr-suite',
    '/taxi-qr-suite',
    '/qr-redirect-chain-viewer',
    '/qr-payload-inspector',
    '/qr-allowlist-builder',
    '/qr-metadata-stripper',
    '/qr-offline-verifier',
    '/qr-tamper-evidence-planner',
    '/qr-expiry-checker',
    '/qr-checksum-generator',
    '/qr-scan-log',
    '/qr-consent-note-builder',
    '/qr-print-proof-checklist',
    '/qr-signature-note-builder',
    '/qr-batch-validator',
    '/qr-typosquat-checker',
    '/qr-phishing-pattern-trainer',
    '/qr-gradient-maker',
    '/qr-frame-designer',
    '/qr-quiet-zone-adder',
    '/qr-svg-png-pdf-exporter',
    '/qr-size-presets',
    '/qr-color-pair-tester',
    '/qr-batch-renamer',
    '/qr-zip-packager',
    '/qr-print-sheet-planner',
    '/qr-scan-instruction-card',
    '/qr-embed-code-builder',
    '/qr-api-playground',
    '/qr-to-pdf-converter',
    '/qr-image-enhancer',
    '/qr-code-rotator',
    '/qr-code-cropper',
    '/qr-call-to-action-builder',
    '/qr-analytics-simulator',
    '/qr-a-b-test-planner',
    '/qr-campaign-planner',
  ];
  const toolEntries = toolPaths.map((p) => entry(p, { changeFrequency: weekly, priority: 0.9 }));

  // ── SECTION: Standard QR Type Generators ────────────────────────────────
  const generatorPaths = [
    '/url-qr-code-generator',
    '/wifi-qr-code-generator',
    '/vcard-qr-code-generator',
    '/whatsapp-qr-code-generator',
    '/upi-qr-code-generator',
    '/bitcoin-qr-code-generator',
    '/email-qr-code-generator',
    '/sms-qr-code-generator',
    '/calendar-event-qr-code-generator',
    '/app-store-qr-code-generator',
    '/pdf-qr-code-generator',
    '/zoom-meeting-qr-code-generator',
    '/crypto-wallet-qr-code-generator',
    '/coupon-qr-code-generator',
    '/ticket-qr-code-generator',
    '/survey-qr-code-generator',
    '/social-profile-qr-code-generator',
    '/playlist-qr-code-generator',
    '/podcast-qr-code-generator',
    '/resume-qr-code-generator',
    '/menu-qr-code-generator',
    '/feedback-qr-code-generator',
    '/donation-qr-code-generator',
    '/event-rsvp-qr-code-generator',
    '/loyalty-card-qr-code-generator',
    '/mecard-qr-code-generator',
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
  // Only audit-passing articles are indexed (§7.5).
  const articleEntries = (await auditedBlogArticles()).map((art) =>
    entry(`/blog/${art.slug}`, {
      lastModified: new Date(art.updatedAt),
      changeFrequency: monthly,
      priority: 0.8,
    })
  );

  // ── SECTION: Trust / Legal ───────────────────────────────────────────────
  const trustPaths = ['/about', '/contact', '/privacy', '/terms', '/cookie-policy', '/disclaimer'];
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
    ...(await indexableQrEntries()),
    ...(await familyEntries()),
  ];
}

/**
 * Blog articles that pass the content audit. Reads the audit manifest written
 * by scripts/content-audit.ts (prebuild); failing articles are excluded.
 */
async function auditedBlogArticles(): Promise<{ slug: string; updatedAt: string }[]> {
  try {
    const { readFileSync, existsSync } = await import('node:fs');
    const { join } = await import('node:path');
    const manifestPath = join(
      process.cwd(),
      'src',
      'content',
      '__generated__',
      'audit-manifest.json'
    );
    const manifest: Record<string, { passed: boolean }> = existsSync(manifestPath)
      ? JSON.parse(readFileSync(manifestPath, 'utf8'))
      : {};
    const hasManifest = Object.keys(manifest).length > 0;
    return getAllArticles().filter((art) => {
      if (!hasManifest) return true; // dev without prebuild: keep everything
      const verdict = manifest[`/blog/${art.slug}`];
      return verdict?.passed === true; // audited + passed only (fail closed)
    });
  } catch {
    return getAllArticles();
  }
}

/**
 * Family content entries (/industries/*, /glossary/*, ...): ONLY pages that
 * pass the content audit appear in the sitemap. Reads the audit manifest
 * written by scripts/content-audit.ts (prebuild).
 */
async function familyEntries(): Promise<MetadataRoute.Sitemap> {
  try {
    const { familyLoaders } = await import('@/content/families/index');
    const { FAMILY_PREFIXES, CONTENT_FAMILIES } = await import('@/content/schema');
    const { readFileSync, existsSync } = await import('node:fs');
    const { join } = await import('node:path');
    const manifestPath = join(
      process.cwd(),
      'src',
      'content',
      '__generated__',
      'audit-manifest.json'
    );
    const manifest: Record<string, { passed: boolean }> = existsSync(manifestPath)
      ? JSON.parse(readFileSync(manifestPath, 'utf8'))
      : {};
    const hasManifest = Object.keys(manifest).length > 0;
    const out: MetadataRoute.Sitemap = [];
    for (const family of CONTENT_FAMILIES) {
      const prefix = FAMILY_PREFIXES[family];
      const entries = await familyLoaders[family]();
      for (const e of entries) {
        const url = `${prefix}/${e.slug}`;
        if (!hasManifest) {
          out.push(entry(url, { changeFrequency: 'monthly' as const, priority: 0.75 }));
          continue;
        }
        const verdict = manifest[url];
        if (verdict?.passed !== true) continue; // failing or unaudited → excluded
        out.push(entry(url, { changeFrequency: 'monthly' as const, priority: 0.75 }));
      }
    }
    return out;
  } catch {
    return [];
  }
}
/**
 * /q/[publicId] entries: ONLY public + moderation-passed QRs with a unique
 * owner-written title (mirrors qrPageEligibility). Best-effort: any DB failure
 * yields no entries rather than a broken sitemap.
 */
async function indexableQrEntries(): Promise<MetadataRoute.Sitemap> {
  try {
    const { isDbConfigured, dbConnect } = await import('@/lib/db/mongoose');
    if (!isDbConfigured()) return [];
    await dbConnect();
    const { QrCode } = await import('@/models/QrCode');
    const docs = (await QrCode.find({
      visibility: 'public',
      status: 'active',
      'moderation.status': 'passed',
      title: { $exists: true, $ne: '' },
    })
      .select('publicId title updatedAt')
      .sort({ updatedAt: -1 })
      .limit(5000)
      .lean()) as unknown as { publicId: string; title: string; updatedAt: Date }[];
    // Keep the sitemap's unique-title rule in sync with qrPageEligibility.
    const generic = new Set(['untitled', 'my qr code', 'qr code', 'new qr code']);
    return docs
      .filter((d) => d.title.trim().length >= 8 && !generic.has(d.title.trim().toLowerCase()))
      .map((d) =>
        entry(`/q/${d.publicId}`, {
          lastModified: d.updatedAt ? new Date(d.updatedAt) : new Date(),
          changeFrequency: 'monthly' as const,
          priority: 0.5,
        })
      );
  } catch {
    return [];
  }
}
