/**
 * QR Code Tools — Sitemap Index
 *
 * Architecture:
 *  • /sitemap.xml → this file, returns all entries (Next.js single sitemap)
 *  • Sections are logically grouped and change-frequency / priority
 *    tuned per section for optimal crawl budget allocation.
 *  • Comprehensive coverage of all tools, generators, families, blog guides,
 *    and regional payment schemes so all valid site pages are indexed.
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
    '/qr-batch-failure-estimator',
    '/qr-cost-per-scan-calculator',
    '/qr-dynamic-vs-static-roi-calculator',
    '/qr-frame-text-size-calculator',
    '/qr-roll-label-planner',
    '/qr-off-axis-scan-calculator',
    '/qr-glare-risk-checker',
    '/qr-wear-lifetime-estimator',
    '/qr-print-waste-estimator',
    '/qr-campaign-break-even-calculator',
    '/qr-dot-gain-tolerance-checker',
    '/qr-footfall-scan-estimator',
    '/qr-scan-funnel-calculator',
    '/qr-ab-test-significance-calculator',
    '/qr-scan-test-sample-calculator',
    '/qr-utm-audit-checker',
    '/qr-version-estimator',
    '/qr-print-area-calculator',
    '/qr-readability-score-calculator',
    '/qr-code-retirement-planner',
    '/qr-homograph-detector',
    '/qr-payload-linter',
    '/qr-allowlist-tester',
    '/qr-blocklist-tester',
    '/qr-scheme-safety-checker',
    '/qr-expiry-policy-builder',
    '/qr-clone-risk-scorer',
    '/qr-permission-explainer',
    '/qr-image-metadata-auditor',
    '/qr-url-anatomy-checker',
    '/qr-payload-hash-verifier',
    '/qr-batch-duplicate-detector',
    '/qr-tracking-parameter-auditor',
    '/qr-safe-scan-checklist-builder',
    '/qr-incident-report-builder',
    '/qr-brand-impersonation-checker',
    '/qr-destination-change-detector',
    '/bulk-calendar-qr-generator',
    '/bulk-mecard-generator',
    '/bulk-survey-qr-generator',
    '/bulk-menu-item-qr-generator',
    '/bulk-shipping-label-qr-generator',
    '/bulk-shelf-label-qr-generator',
    '/bulk-certificate-qr-generator',
    '/bulk-coupon-expiry-auditor',
    '/bulk-check-in-qr-generator',
    '/bulk-rsvp-qr-generator',
    '/bulk-loyalty-card-qr-generator',
    '/bulk-seat-qr-generator',
    '/bulk-pet-tag-qr-generator',
    '/bulk-invoice-qr-generator',
    '/bulk-review-qr-generator',
    '/bakery-qr-suite',
    '/barber-qr-suite',
    '/boutique-qr-suite',
    '/car-wash-qr-suite',
    '/co-working-qr-suite',
    '/courier-qr-suite',
    '/dentist-qr-suite',
    '/driving-school-qr-suite',
    '/florist-qr-suite',
    '/food-truck-qr-suite',
    '/hostel-qr-suite',
    '/laundromat-qr-suite',
    '/spa-qr-suite',
    '/vet-qr-suite',
    '/event-venue-qr-suite',
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
    '/qr-link-menu-generator',
    '/app-review-link-qr-generator',
    '/vcard-photo-qr-generator',
    '/event-countdown-qr-generator',
    '/gift-card-qr-generator',
    '/membership-card-qr-generator',
    '/parking-spot-qr-generator',
    '/table-order-qr-generator',
    '/room-booking-qr-generator',
    '/shipment-tracking-qr-generator',
    '/invoice-payment-qr-generator',
    '/fundraiser-qr-generator',
    '/course-enrollment-qr-generator',
    '/webinar-join-qr-generator',
    '/pet-adoption-qr-generator',
    '/job-application-qr-generator',
    '/car-listing-qr-generator',
    '/property-tour-qr-generator',
    '/prescription-refill-qr-generator',
    '/geo-qr-code-generator',
    '/whatsapp-order-qr-generator',
    '/live-stream-qr-generator',
    '/google-review-qr-generator',
    '/boarding-pass-qr-generator',
    '/luggage-tag-qr-generator',
    '/plant-care-qr-generator',
    '/recipe-qr-generator',
    '/warranty-qr-generator',
    '/visitor-badge-qr-generator',
    '/seat-finder-qr-generator',
    '/appointment-booking-qr-generator',
    '/quote-request-qr-generator',
    '/kid-safe-qr-card-generator',
  ];
  const generatorEntries = generatorPaths.map((p) =>
    entry(p, { changeFrequency: monthly, priority: 0.85 })
  );

  // ── SECTION: Label / Sticker Sheet Pages ────────────────────────────────
  const labelEntries = getAllLabelSheets().map((sheet) =>
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
 * Return all published blog articles, deduplicated by slug.
 */
async function auditedBlogArticles(): Promise<{ slug: string; updatedAt: string }[]> {
  try {
    const articles = getAllArticles();
    const seen = new Set<string>();
    const unique: { slug: string; updatedAt: string }[] = [];
    for (const art of articles) {
      if (!art.slug || seen.has(art.slug)) continue;
      seen.add(art.slug);
      unique.push({ slug: art.slug, updatedAt: art.updatedAt || '2026-10-01' });
    }
    return unique;
  } catch {
    return [];
  }
}

/**
 * Family content entries (/industries/*, /glossary/*, ...).
 */
async function familyEntries(): Promise<MetadataRoute.Sitemap> {
  try {
    const { familyLoaders } = await import('@/content/families/index');
    const { FAMILY_PREFIXES, CONTENT_FAMILIES } = await import('@/content/schema');
    const out: MetadataRoute.Sitemap = [];
    for (const family of CONTENT_FAMILIES) {
      const prefix = FAMILY_PREFIXES[family];
      const entries = await familyLoaders[family]();
      for (const e of entries) {
        const url = `${prefix}/${e.slug}`;
        out.push(entry(url, { changeFrequency: 'monthly' as const, priority: 0.75 }));
      }
    }
    return out;
  } catch {
    return [];
  }
}

/**
 * /q/[publicId] entries: ONLY public + moderation-passed QRs with a unique title.
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
