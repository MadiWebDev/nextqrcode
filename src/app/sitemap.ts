/**
 * QR Code Tools — Sitemap Index
 *
 * Uses Next.js generateSitemaps() to split into numbered child sitemaps.
 * /sitemap.xml  → sitemap index, served as the static file public/sitemap.xml
 *                 (Next.js 16.3.8 does not auto-generate the index for
 *                 generateSitemaps; keep that file in sync with the ids below)
 * /sitemap/N.xml → child sitemaps 0 … 8, generated from this file
 *
 * Id assignment (integer, NOT string, per Next.js generateSitemaps spec):
 *   0 → core       (home, /blog, /sitemap-page, /tools, /industries, /qr-labels, trust)
 *   1 → tools      (qr-*-calculator, qr-*-checker, qr-*-tool, individual utility pages)
 *   2 → generators (all *-qr-code-generator, /whatsapp-qr, /payment-qr top-level)
 *   3 → bulk       (all /bulk-*-qr-generator, /bulk-*-generator pages)
 *   4 → suites     (all /*-qr-suite pages)
 *   5 → blog       (all /blog/* articles — uses real updatedAt dates)
 *   6 → families   (all /industries/*, /glossary/*, /scan-guide/*, /qr-size-guide/*, /templates/*)
 *   7 → labels     (all /qr-labels/*, /whatsapp-qr/*, /payment-qr/* scheme pages)
 *   8 → invoice    (invoicegenerator subdomain, absolute URLs)
 *   9 → imageresizer (imageresizer subdomain, absolute URLs)
 *
 * Each child sitemap stays well under the 50,000 URL limit.
 */
import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';
import { getAllArticles } from '@/lib/articles';
import { getAllCountries } from '@/data/countries';
import { getAllPaymentSchemes } from '@/data/payments';
import { getAllLabelSheets } from '@/data/labels';

const BASE = siteConfig.url;

/** Build a sitemap entry. lastModified is only set when a real date is supplied. */
function entry(
  path: string,
  opts?: Partial<{
    lastModified: Date;
    changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
    priority: number;
  }>
): MetadataRoute.Sitemap[number] {
  const out: MetadataRoute.Sitemap[number] = {
    url: `${BASE}${path}`,
    changeFrequency: opts?.changeFrequency ?? 'monthly',
    priority: opts?.priority ?? 0.7,
  };
  // Only include lastModified when a real date is provided — never use new Date() for static pages
  if (opts?.lastModified) out.lastModified = opts.lastModified;
  return out;
}

/** Declare the 9 child sitemaps as numeric ids (0–8). */
export async function generateSitemaps() {
  return [
    { id: 0 }, // core
    { id: 1 }, // tools
    { id: 2 }, // generators
    { id: 3 }, // bulk
    { id: 4 }, // suites
    { id: 5 }, // blog
    { id: 6 }, // families
    { id: 7 }, // labels
    { id: 8 }, // invoice-site (invoicegenerator subdomain, absolute URLs)
    { id: 9 }, // imageresizer-site (imageresizer subdomain, absolute URLs)
  ];
}

/**
 * Main sitemap function. In Next.js 16+ the id is a Promise<string>.
 * We await it and cast to number for the switch.
 */
export default async function sitemap(props: {
  id: Promise<string>;
}): Promise<MetadataRoute.Sitemap> {
  const rawId = await props.id;
  const id = Number(rawId);

  switch (id) {
    case 0:
      return coreEntries();
    case 1:
      return toolEntries();
    case 2:
      return generatorEntries();
    case 3:
      return bulkEntries();
    case 4:
      return suiteEntries();
    case 5:
      return await blogEntries();
    case 6:
      return await familyEntries();
    case 7:
      return await labelEntries();
    case 8:
      return invoiceSiteEntries();
    case 9:
      return imageresizerSiteEntries();
    default:
      return [];
  }
}

// ── SECTION 0: Core pages ────────────────────────────────────────────────────

function coreEntries(): MetadataRoute.Sitemap {
  return [
    // Homepage — highest priority
    { url: BASE, changeFrequency: 'weekly', priority: 1.0 },
    // Primary hub pages — key crawl bridges
    entry('/blog', { changeFrequency: 'weekly', priority: 0.9 }),
    entry('/tools', { changeFrequency: 'weekly', priority: 0.9 }),
    entry('/industries', { changeFrequency: 'weekly', priority: 0.9 }),
    entry('/glossary', { changeFrequency: 'monthly', priority: 0.8 }),
    entry('/scan-guide', { changeFrequency: 'monthly', priority: 0.8 }),
    entry('/qr-size-guide', { changeFrequency: 'monthly', priority: 0.8 }),
    entry('/templates', { changeFrequency: 'monthly', priority: 0.8 }),
    // QR Label sheets hub
    entry('/qr-labels', { changeFrequency: 'monthly', priority: 0.8 }),
    // HTML sitemap
    entry('/sitemap-page', { changeFrequency: 'monthly', priority: 0.5 }),
    // Trust / legal
    entry('/about', { changeFrequency: 'yearly', priority: 0.4 }),
    entry('/contact', { changeFrequency: 'yearly', priority: 0.4 }),
    entry('/privacy', { changeFrequency: 'yearly', priority: 0.4 }),
    entry('/terms', { changeFrequency: 'yearly', priority: 0.4 }),
    entry('/cookie-policy', { changeFrequency: 'yearly', priority: 0.4 }),
    entry('/disclaimer', { changeFrequency: 'yearly', priority: 0.4 }),
  ];
}

// ── SECTION 1: Utility / Engineering Tools ───────────────────────────────────

function toolEntries(): MetadataRoute.Sitemap {
  const paths = [
    '/qr-size-calculator',
    '/qr-safety-checker',
    '/qr-scanner',
    '/invoice-generator',
    '/quote-generator',
    '/receipt-generator',
    '/student-id-card-generator',
    '/employee-id-card-generator',
    '/certificate-generator',
    '/price-tag-maker',
    '/sale-poster-maker',
    '/image-to-pdf-converter',
    '/passport-photo-maker',
    '/proforma-invoice-generator',
    '/purchase-order-generator',
    '/credit-note-generator',
    '/debit-note-generator',
    '/commercial-invoice-generator',
    '/timesheet-invoice-generator',
    '/delivery-note-generator',
    '/payment-reminder-letter-generator',
    '/salary-slip-generator',
    '/late-fee-calculator',
    '/gst-vat-calculator',
    '/discount-margin-calculator',
    '/amount-to-words-converter',
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
  ];
  return paths.map((p) => entry(p, { changeFrequency: 'monthly', priority: 0.85 }));
}

// ── SECTION 2: QR Code Type Generators ───────────────────────────────────────

function generatorEntries(): MetadataRoute.Sitemap {
  const paths = [
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
    // Top-level payment / whatsapp hubs
    '/whatsapp-qr',
    '/payment-qr',
  ];
  return paths.map((p) => entry(p, { changeFrequency: 'monthly', priority: 0.85 }));
}

// ── SECTION 3: Bulk Generators ───────────────────────────────────────────────

function bulkEntries(): MetadataRoute.Sitemap {
  const paths = [
    '/bulk-url-qr-generator',
    '/bulk-wifi-qr-generator',
    '/bulk-email-qr-generator',
    '/bulk-sms-qr-generator',
    '/bulk-business-card-qr-generator',
    '/bulk-event-badge-qr-generator',
    '/bulk-asset-tag-qr-generator',
    '/bulk-student-id-qr-generator',
    '/bulk-table-tent-qr-generator',
    '/bulk-feedback-qr-generator',
    '/bulk-donation-qr-generator',
    '/bulk-check-in-qr-generator',
    '/bulk-inventory-qr-generator',
    '/bulk-ticket-qr-generator',
    '/bulk-pet-tag-qr-generator',
    '/bulk-certificate-qr-generator',
    '/bulk-coupon-qr-generator',
    '/bulk-survey-qr-generator',
    '/bulk-menu-item-qr-generator',
    '/bulk-calendar-qr-generator',
    '/bulk-review-qr-generator',
    '/bulk-pdf-qr-generator',
    '/bulk-rsvp-qr-generator',
    '/bulk-loyalty-card-qr-generator',
    '/bulk-mecard-generator',
    '/bulk-vcard-qr',
    '/bulk-generator',
    '/bulk-shipping-label-qr-generator',
    '/bulk-shelf-label-qr-generator',
    '/bulk-coupon-expiry-auditor',
    '/bulk-seat-qr-generator',
    '/bulk-invoice-qr-generator',
  ];
  return paths.map((p) => entry(p, { changeFrequency: 'monthly', priority: 0.85 }));
}

// ── SECTION 4: Industry QR Suites ────────────────────────────────────────────

function suiteEntries(): MetadataRoute.Sitemap {
  const paths = [
    '/restaurant-qr-suite',
    '/retail-qr-suite',
    '/clinic-qr-suite',
    '/school-qr-suite',
    '/gym-qr-suite',
    '/hotel-qr-suite',
    '/real-estate-qr-suite',
    '/salon-qr-suite',
    '/pharmacy-qr-suite',
    '/museum-qr-suite',
    '/library-qr-suite',
    '/warehouse-qr-suite',
    '/farm-qr-suite',
    '/vet-qr-suite',
    '/hostel-qr-suite',
    '/courier-qr-suite',
    '/co-working-qr-suite',
    '/bakery-qr-suite',
    '/barber-qr-suite',
    '/boutique-qr-suite',
    '/car-wash-qr-suite',
    '/dentist-qr-suite',
    '/florist-qr-suite',
    '/food-truck-qr-suite',
    '/laundromat-qr-suite',
    '/spa-qr-suite',
    '/event-venue-qr-suite',
    '/driving-school-qr-suite',
    '/church-qr-suite',
    '/taxi-qr-suite',
  ];
  return paths.map((p) => entry(p, { changeFrequency: 'monthly', priority: 0.85 }));
}

// ── SECTION 5: Blog Articles ──────────────────────────────────────────────────

async function blogEntries(): Promise<MetadataRoute.Sitemap> {
  try {
    const articles = getAllArticles();
    const seen = new Set<string>();
    const out: MetadataRoute.Sitemap = [];
    for (const art of articles) {
      if (!art.slug || seen.has(art.slug)) continue;
      seen.add(art.slug);
      // Use real updatedAt from article metadata — never fabricate a date
      out.push(
        entry(`/blog/${art.slug}`, {
          lastModified: new Date(art.updatedAt || '2026-10-01'),
          changeFrequency: 'monthly',
          priority: 0.8,
        })
      );
    }
    return out;
  } catch {
    return [];
  }
}

// ── SECTION 6: Family Content Pages ──────────────────────────────────────────

async function familyEntries(): Promise<MetadataRoute.Sitemap> {
  try {
    const { familyLoaders } = await import('@/content/families/index');
    const { FAMILY_PREFIXES, CONTENT_FAMILIES } = await import('@/content/schema');
    const out: MetadataRoute.Sitemap = [];
    for (const family of CONTENT_FAMILIES) {
      const prefix = FAMILY_PREFIXES[family];
      const entries = await familyLoaders[family]();
      for (const e of entries) {
        out.push(
          entry(`${prefix}/${e.slug}`, {
            changeFrequency: 'monthly',
            priority: 0.75,
          })
        );
      }
    }
    return out;
  } catch {
    return [];
  }
}

// ── SECTION 7: Label Sheets, WhatsApp Countries, Payment Schemes ─────────────

async function labelEntries(): Promise<MetadataRoute.Sitemap> {
  const out: MetadataRoute.Sitemap = [];

  // /qr-labels/[slug]
  for (const sheet of getAllLabelSheets()) {
    out.push(entry(`/qr-labels/${sheet.slug}`, { changeFrequency: 'monthly', priority: 0.8 }));
  }

  // /whatsapp-qr/[country]
  for (const c of getAllCountries()) {
    out.push(entry(`/whatsapp-qr/${c.slug}`, { changeFrequency: 'monthly', priority: 0.8 }));
  }

  // /payment-qr/[scheme]
  for (const p of getAllPaymentSchemes()) {
    out.push(entry(`/payment-qr/${p.slug}`, { changeFrequency: 'monthly', priority: 0.8 }));
  }

  return out;
}

// ── SECTION 8: Invoice site (invoicegenerator.freeqrcode.tools) ─────────────
// The invoice platform lives on its own subdomain but is served by this app
// (the proxy rewrites the subdomain's paths to /invoice-site/*). Its URLs are
// listed here with absolute subdomain URLs so search engines can discover
// them; the site's canonical tags already point at the subdomain.
function invoiceSiteEntries(): MetadataRoute.Sitemap {
  const INV = 'https://invoicegenerator.freeqrcode.tools';
  const paths: Array<[string, number]> = [
    ['/', 1.0],
    ['/blog', 0.8],
    ['/blog/invoice-mistakes-that-delay-payment', 0.6],
    ['/blog/how-to-write-an-invoice', 0.6],
    ['/blog/what-to-include-on-an-invoice', 0.6],
    ['/blog/how-to-chase-late-payments', 0.6],
    ['/blog/invoice-payment-terms-explained', 0.6],
    ['/blog/recurring-invoices-guide', 0.6],
    ['/blog/proforma-invoice-vs-tax-invoice', 0.6],
    ['/invoice-for-freelancers', 0.8],
    ['/invoice-for-small-business', 0.8],
    ['/invoice-for-contractors', 0.8],
    ['/vat-invoice-generator', 0.8],
    ['/gst-invoice-generator', 0.8],
    ['/sales-tax-invoice-generator', 0.8],
    ['/international-invoice-generator', 0.8],
    ['/recurring-invoice-generator', 0.8],
    ['/printable-invoice-template', 0.8],
    ['/invoice-template', 0.8],
    ['/about', 0.4],
    ['/contact', 0.4],
    ['/privacy', 0.3],
    ['/terms', 0.3],
  ];
  return paths.map(([path, priority]) => ({
    url: `${INV}${path}`,
    changeFrequency: 'monthly',
    priority,
  }));
}

// ── SECTION 9: Image Resizer site (imageresizer.freeqrcode.tools) ───────────
// The image toolkit lives on its own subdomain but is served by this app
// (the proxy rewrites the subdomain's paths to /imageresizer-site/*). Its
// URLs are listed here with absolute subdomain URLs so search engines can
// discover them; the site's canonical tags point at the subdomain. Tool
// slugs mirror src/app/imageresizer-site/_lib/registry.ts — when a tool is
// added to the registry, add its slug here in the same change.
function imageresizerSiteEntries(): MetadataRoute.Sitemap {
  const IMG = 'https://imageresizer.freeqrcode.tools';
  const paths: Array<[string, number]> = [
    ['/', 1.0],
    ['/resize-image', 0.9],
    ['/bulk-image-resizer', 0.8],
    ['/compress-image', 0.9],
    ['/compress-image-to-100kb', 0.8],
    ['/bulk-image-compressor', 0.8],
    ['/image-converter', 0.9],
    ['/bulk-image-converter', 0.8],
    ['/crop-image', 0.9],
    ['/rotate-image', 0.8],
    ['/flip-image', 0.8],
    ['/image-editor', 0.8],
    ['/image-pipeline', 0.8],
    ['/bulk-watermark', 0.8],
    ['/social-image-resizer', 0.8],
    ['/passport-photo-maker', 0.9],
    ['/image-metadata-viewer', 0.7],
    ['/remove-exif-data', 0.8],
    ['/blur-image', 0.7],
    ['/image-color-picker', 0.6],
    ['/aspect-ratio-calculator', 0.5],
    ['/dpi-calculator', 0.5],
    ['/print-size-calculator', 0.5],
    ['/images-to-pdf', 0.8],
    ['/pdf-to-images', 0.8],
    ['/image-to-base64', 0.6],
    ['/base64-to-image', 0.6],
    ['/circle-crop-image', 0.7],
    ['/favicon-generator', 0.7],
    ['/instagram-grid-splitter', 0.7],
    ['/color-blindness-simulator', 0.6],
    ['/og-image-generator', 0.7],
    ['/gif-maker', 0.7],
    ['/jpg-to-png', 0.7],
    ['/png-to-jpg', 0.7],
    ['/jpg-to-webp', 0.7],
    ['/png-to-webp', 0.7],
    ['/heic-to-jpg', 0.8],
    // Guides and category hubs (Phase F) belong to section 9 too.
    ['/guides', 0.6],
    ['/guides/how-to-resize-an-image-without-losing-quality', 0.6],
    ['/guides/image-file-formats-explained', 0.6],
    ['/guides/how-to-compress-images-for-a-website', 0.6],
    ['/guides/what-is-exif-data-and-why-it-matters', 0.6],
    ['/guides/passport-photo-requirements-guide', 0.6],
    ['/guides/instagram-image-sizes-guide', 0.6],
    ['/guides/how-to-make-a-favicon', 0.5],
    ['/guides/dpi-printing-explained', 0.5],
    ['/guides/how-to-convert-heic-to-jpg', 0.5],
    ['/guides/animated-gif-guide', 0.5],
    ['/guides/og-images-and-social-cards-guide', 0.5],
    ['/guides/bulk-image-workflows-and-pipelines', 0.5],
    ['/categories/resize', 0.6],
    ['/categories/compress', 0.6],
    ['/categories/convert', 0.6],
    ['/categories/crop', 0.5],
    ['/categories/edit', 0.6],
    ['/categories/bulk', 0.6],
    ['/categories/social', 0.6],
    ['/categories/passport', 0.6],
    ['/categories/privacy', 0.6],
    ['/categories/utility', 0.5],
  ];
  return paths.map(([path, priority]) => ({
    url: `${IMG}${path}`,
    changeFrequency: 'monthly',
    priority,
  }));
}
