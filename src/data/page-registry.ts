/**
 * QR Code Tools — Master Page Registry
 *
 * Central registry of all pages: existing (batch 0) and planned (batches 1–6).
 * Used by:
 *  - Internal linking engine (ensures no orphan pages)
 *  - Quality gate (checks inbound/outbound link counts)
 *  - Sitemap generator (only 'published' pages indexed)
 *  - Pruning report (impressions90d < threshold → pruning candidate)
 *  - Batch release manager (filters by batchNumber and status)
 */

export type RegistrySection =
  | 'tools'
  | 'generators'
  | 'labels'
  | 'countries'
  | 'payments'
  | 'industries'
  | 'devices'
  | 'sizes'
  | 'templates'
  | 'glossary'
  | 'blog'
  | 'legal'
  | 'home'
  | 'compare'
  | 'howto'
  | 'guides';

export type RegistryPageStatus =
  | 'published'
  | 'draft'
  | 'needs_review'
  | 'reviewer_approved'
  | 'noindex'
  | 'redirected';

export interface RegistryPage {
  id: string;
  slug: string;
  url: string;
  section: RegistrySection;
  primaryKeyword: string;
  title: string;
  status: RegistryPageStatus;
  qualityScore?: number;
  wordCount?: number;
  inboundLinks: string[];  // slugs of pages that link to this page
  outboundLinks: string[]; // slugs this page links to
  author: string;
  publishedAt: string;
  updatedAt: string;
  batchNumber: number;     // 0 = existing pre-system, 1-6 = release batches
  impressions90d?: number; // populated from Search Console API
  pruningCandidate?: boolean;
}

// ── Batch 0: All existing published pages ────────────────────────────────────

const BATCH_0_PAGES: RegistryPage[] = [
  {
    id: 'home',
    slug: '',
    url: '/',
    section: 'home',
    primaryKeyword: 'free qr code generator',
    title: 'Free QR Code Generator & Optical Engineering Suite — QR Code Tools',
    status: 'published',
    qualityScore: 95,
    wordCount: 1200,
    inboundLinks: [],
    outboundLinks: [
      'qr-size-calculator', 'qr-safety-checker', 'printed-qr-tester',
      'error-correction-simulator', 'qr-splitter-scanner', 'animated-qr-transfer',
      'medical-id-qr', 'wifi-sign-generator', 'pakistan-payment-qr',
      'qr-sticker-sheet-printer', 'pet-tag-qr', 'bulk-vcard-qr',
      'utm-builder', 'qr-placement-guide', 'barcode-generator',
    ],
    author: 'QR Code Tools Team',
    publishedAt: '2024-01-01',
    updatedAt: '2026-10-05',
    batchNumber: 0,
  },
  {
    id: 'qr-size-calculator',
    slug: 'qr-size-calculator',
    url: '/qr-size-calculator',
    section: 'tools',
    primaryKeyword: 'qr code size calculator',
    title: 'QR Size & Distance Calculator',
    status: 'published',
    qualityScore: 90,
    outboundLinks: ['printed-qr-tester', 'qr-placement-guide', 'error-correction-simulator'],
    inboundLinks: ['home', 'blog', 'qr-sticker-sheet-printer'],
    author: 'QR Code Tools Team',
    publishedAt: '2024-01-01',
    updatedAt: '2026-10-01',
    batchNumber: 0,
  },
  {
    id: 'qr-safety-checker',
    slug: 'qr-safety-checker',
    url: '/qr-safety-checker',
    section: 'tools',
    primaryKeyword: 'qr code safety checker phishing',
    title: 'QR Safety & Phishing Checker',
    status: 'published',
    qualityScore: 88,
    outboundLinks: ['printed-qr-tester', 'qr-size-calculator', 'blog'],
    inboundLinks: ['home', 'blog'],
    author: 'QR Code Tools Team',
    publishedAt: '2024-01-01',
    updatedAt: '2026-09-15',
    batchNumber: 0,
  },
  {
    id: 'printed-qr-tester',
    slug: 'printed-qr-tester',
    url: '/printed-qr-tester',
    section: 'tools',
    primaryKeyword: 'test printed qr code quality',
    title: 'Printed-QR Quality Tester',
    status: 'published',
    qualityScore: 87,
    outboundLinks: ['qr-size-calculator', 'qr-placement-guide', 'qr-safety-checker'],
    inboundLinks: ['home', 'qr-size-calculator', 'blog'],
    author: 'QR Code Tools Team',
    publishedAt: '2024-01-01',
    updatedAt: '2026-09-01',
    batchNumber: 0,
  },
  {
    id: 'error-correction-simulator',
    slug: 'error-correction-simulator',
    url: '/error-correction-simulator',
    section: 'tools',
    primaryKeyword: 'qr code error correction simulator',
    title: 'Error-Correction Damage Simulator',
    status: 'published',
    qualityScore: 92,
    outboundLinks: ['qr-size-calculator', 'printed-qr-tester', 'blog'],
    inboundLinks: ['home', 'qr-size-calculator'],
    author: 'QR Code Tools Team',
    publishedAt: '2024-01-01',
    updatedAt: '2026-09-01',
    batchNumber: 0,
  },
  {
    id: 'qr-splitter-scanner',
    slug: 'qr-splitter-scanner',
    url: '/qr-splitter-scanner',
    section: 'tools',
    primaryKeyword: 'qr code splitter large data',
    title: 'Large-Data Splitter & Scanner',
    status: 'published',
    qualityScore: 85,
    outboundLinks: ['animated-qr-transfer', 'qr-size-calculator', 'barcode-generator'],
    inboundLinks: ['home', 'bulk-vcard-qr'],
    author: 'QR Code Tools Team',
    publishedAt: '2024-01-01',
    updatedAt: '2026-08-01',
    batchNumber: 0,
  },
  {
    id: 'animated-qr-transfer',
    slug: 'animated-qr-transfer',
    url: '/animated-qr-transfer',
    section: 'tools',
    primaryKeyword: 'animated qr code file transfer offline',
    title: 'Animated-QR Offline File Transfer',
    status: 'published',
    qualityScore: 89,
    outboundLinks: ['qr-splitter-scanner', 'qr-size-calculator', 'qr-safety-checker'],
    inboundLinks: ['home', 'qr-splitter-scanner'],
    author: 'QR Code Tools Team',
    publishedAt: '2024-01-01',
    updatedAt: '2026-08-01',
    batchNumber: 0,
  },
  {
    id: 'medical-id-qr',
    slug: 'medical-id-qr',
    url: '/medical-id-qr',
    section: 'tools',
    primaryKeyword: 'emergency medical id qr code generator',
    title: 'Emergency Medical ID QR Card',
    status: 'published',
    qualityScore: 91,
    outboundLinks: ['pet-tag-qr', 'qr-size-calculator', 'printed-qr-tester'],
    inboundLinks: ['home', 'blog'],
    author: 'QR Code Tools Team',
    publishedAt: '2024-01-01',
    updatedAt: '2026-09-01',
    batchNumber: 0,
  },
  {
    id: 'wifi-sign-generator',
    slug: 'wifi-sign-generator',
    url: '/wifi-sign-generator',
    section: 'tools',
    primaryKeyword: 'wifi qr code sign generator urdu arabic',
    title: 'Printable WiFi Signs (RTL Support)',
    status: 'published',
    qualityScore: 88,
    outboundLinks: ['wifi-qr-code-generator', 'qr-size-calculator', 'qr-placement-guide'],
    inboundLinks: ['home', 'blog', 'wifi-qr-code-generator'],
    author: 'QR Code Tools Team',
    publishedAt: '2024-01-01',
    updatedAt: '2026-09-01',
    batchNumber: 0,
  },
  {
    id: 'pakistan-payment-qr',
    slug: 'pakistan-payment-qr',
    url: '/pakistan-payment-qr',
    section: 'payments',
    primaryKeyword: 'pakistan payment qr code raast jazzcash easypaisa',
    title: 'Regional Payment QR (Pakistan)',
    status: 'published',
    qualityScore: 90,
    outboundLinks: ['regional-payment-qr', 'upi-qr-code-generator', 'qr-size-calculator'],
    inboundLinks: ['home', 'regional-payment-qr'],
    author: 'QR Code Tools Team',
    publishedAt: '2024-01-01',
    updatedAt: '2026-10-01',
    batchNumber: 0,
  },
  {
    id: 'regional-payment-qr',
    slug: 'regional-payment-qr',
    url: '/regional-payment-qr',
    section: 'payments',
    primaryKeyword: 'regional payment qr code generator',
    title: 'Regional Payment QR Hub',
    status: 'published',
    qualityScore: 88,
    outboundLinks: ['pakistan-payment-qr', 'upi-qr-code-generator', 'bitcoin-qr-code-generator'],
    inboundLinks: ['home', 'pakistan-payment-qr', 'blog'],
    author: 'QR Code Tools Team',
    publishedAt: '2024-01-01',
    updatedAt: '2026-10-01',
    batchNumber: 0,
  },
  {
    id: 'qr-sticker-sheet-printer',
    slug: 'qr-sticker-sheet-printer',
    url: '/qr-sticker-sheet-printer',
    section: 'labels',
    primaryKeyword: 'avery sticker sheet qr code printer',
    title: 'Avery Sticker Sheet Layout Printer',
    status: 'published',
    qualityScore: 91,
    outboundLinks: ['qr-size-calculator', 'printed-qr-tester', 'bulk-vcard-qr'],
    inboundLinks: ['home', 'bulk-vcard-qr'],
    author: 'QR Code Tools Team',
    publishedAt: '2024-01-01',
    updatedAt: '2026-10-01',
    batchNumber: 0,
  },
  {
    id: 'pet-tag-qr',
    slug: 'pet-tag-qr',
    url: '/pet-tag-qr',
    section: 'tools',
    primaryKeyword: 'pet tag qr code generator',
    title: 'Pet Tag Lost & Found QR',
    status: 'published',
    qualityScore: 87,
    outboundLinks: ['medical-id-qr', 'qr-size-calculator', 'printed-qr-tester'],
    inboundLinks: ['home', 'medical-id-qr'],
    author: 'QR Code Tools Team',
    publishedAt: '2024-01-01',
    updatedAt: '2026-09-01',
    batchNumber: 0,
  },
  {
    id: 'bulk-vcard-qr',
    slug: 'bulk-vcard-qr',
    url: '/bulk-vcard-qr',
    section: 'tools',
    primaryKeyword: 'bulk vcard qr code from csv',
    title: 'Bulk vCard QR from CSV',
    status: 'published',
    qualityScore: 89,
    outboundLinks: ['vcard-qr-code-generator', 'qr-sticker-sheet-printer', 'utm-builder'],
    inboundLinks: ['home', 'qr-sticker-sheet-printer', 'bulk-vcard-generator'],
    author: 'QR Code Tools Team',
    publishedAt: '2024-01-01',
    updatedAt: '2026-09-01',
    batchNumber: 0,
  },
  {
    id: 'bulk-vcard-generator',
    slug: 'bulk-vcard-generator',
    url: '/bulk-vcard-generator',
    section: 'generators',
    primaryKeyword: 'bulk vcard generator',
    title: 'Bulk vCard Generator',
    status: 'published',
    qualityScore: 85,
    outboundLinks: ['bulk-vcard-qr', 'vcard-qr-code-generator', 'qr-sticker-sheet-printer'],
    inboundLinks: ['home', 'bulk-vcard-qr'],
    author: 'QR Code Tools Team',
    publishedAt: '2024-01-01',
    updatedAt: '2026-09-01',
    batchNumber: 0,
  },
  {
    id: 'utm-builder',
    slug: 'utm-builder',
    url: '/utm-builder',
    section: 'tools',
    primaryKeyword: 'utm builder qr code campaign',
    title: 'UTM Campaign QR Builder',
    status: 'published',
    qualityScore: 88,
    outboundLinks: ['url-qr-code-generator', 'qr-size-calculator', 'barcode-generator'],
    inboundLinks: ['home', 'bulk-vcard-qr'],
    author: 'QR Code Tools Team',
    publishedAt: '2024-01-01',
    updatedAt: '2026-09-01',
    batchNumber: 0,
  },
  {
    id: 'qr-placement-guide',
    slug: 'qr-placement-guide',
    url: '/qr-placement-guide',
    section: 'guides',
    primaryKeyword: 'qr code placement guide material',
    title: 'Material Placement Checklist',
    status: 'published',
    qualityScore: 86,
    outboundLinks: ['qr-size-calculator', 'printed-qr-tester', 'blog'],
    inboundLinks: ['home', 'qr-size-calculator'],
    author: 'QR Code Tools Team',
    publishedAt: '2024-01-01',
    updatedAt: '2026-09-01',
    batchNumber: 0,
  },
  {
    id: 'barcode-generator',
    slug: 'barcode-generator',
    url: '/barcode-generator',
    section: 'generators',
    primaryKeyword: '1d barcode generator ean 13 code 128',
    title: '1D Barcode Generator with Checksum',
    status: 'published',
    qualityScore: 90,
    outboundLinks: ['qr-size-calculator', 'printed-qr-tester', 'blog'],
    inboundLinks: ['home', 'utm-builder'],
    author: 'QR Code Tools Team',
    publishedAt: '2024-01-01',
    updatedAt: '2026-09-01',
    batchNumber: 0,
  },
  // Standard QR Generators
  {
    id: 'url-qr-code-generator',
    slug: 'url-qr-code-generator',
    url: '/url-qr-code-generator',
    section: 'generators',
    primaryKeyword: 'url qr code generator',
    title: 'URL QR Code Generator',
    status: 'published',
    qualityScore: 88,
    outboundLinks: ['qr-size-calculator', 'utm-builder', 'whatsapp-qr-code-generator'],
    inboundLinks: ['home', 'utm-builder'],
    author: 'QR Code Tools Team',
    publishedAt: '2024-01-01',
    updatedAt: '2026-09-01',
    batchNumber: 0,
  },
  {
    id: 'wifi-qr-code-generator',
    slug: 'wifi-qr-code-generator',
    url: '/wifi-qr-code-generator',
    section: 'generators',
    primaryKeyword: 'wifi qr code generator',
    title: 'WiFi QR Code Generator',
    status: 'published',
    qualityScore: 89,
    outboundLinks: ['wifi-sign-generator', 'qr-size-calculator', 'qr-placement-guide'],
    inboundLinks: ['home', 'wifi-sign-generator'],
    author: 'QR Code Tools Team',
    publishedAt: '2024-01-01',
    updatedAt: '2026-09-01',
    batchNumber: 0,
  },
  {
    id: 'vcard-qr-code-generator',
    slug: 'vcard-qr-code-generator',
    url: '/vcard-qr-code-generator',
    section: 'generators',
    primaryKeyword: 'vcard qr code generator',
    title: 'vCard QR Code Generator',
    status: 'published',
    qualityScore: 88,
    outboundLinks: ['bulk-vcard-qr', 'qr-size-calculator', 'bulk-vcard-generator'],
    inboundLinks: ['home', 'bulk-vcard-qr'],
    author: 'QR Code Tools Team',
    publishedAt: '2024-01-01',
    updatedAt: '2026-09-01',
    batchNumber: 0,
  },
  {
    id: 'whatsapp-qr-code-generator',
    slug: 'whatsapp-qr-code-generator',
    url: '/whatsapp-qr-code-generator',
    section: 'generators',
    primaryKeyword: 'whatsapp qr code generator',
    title: 'WhatsApp QR Code Generator',
    status: 'published',
    qualityScore: 90,
    outboundLinks: ['url-qr-code-generator', 'qr-size-calculator', 'whatsapp-qr'],
    inboundLinks: ['home', 'regional-payment-qr'],
    author: 'QR Code Tools Team',
    publishedAt: '2024-01-01',
    updatedAt: '2026-09-01',
    batchNumber: 0,
  },
  {
    id: 'upi-qr-code-generator',
    slug: 'upi-qr-code-generator',
    url: '/upi-qr-code-generator',
    section: 'generators',
    primaryKeyword: 'upi qr code generator india',
    title: 'UPI QR Code Generator',
    status: 'published',
    qualityScore: 89,
    outboundLinks: ['pakistan-payment-qr', 'bitcoin-qr-code-generator', 'qr-size-calculator'],
    inboundLinks: ['home', 'pakistan-payment-qr', 'regional-payment-qr'],
    author: 'QR Code Tools Team',
    publishedAt: '2024-01-01',
    updatedAt: '2026-09-01',
    batchNumber: 0,
  },
  {
    id: 'bitcoin-qr-code-generator',
    slug: 'bitcoin-qr-code-generator',
    url: '/bitcoin-qr-code-generator',
    section: 'generators',
    primaryKeyword: 'bitcoin qr code generator',
    title: 'Bitcoin QR Code Generator',
    status: 'published',
    qualityScore: 87,
    outboundLinks: ['upi-qr-code-generator', 'qr-size-calculator', 'qr-safety-checker'],
    inboundLinks: ['home', 'regional-payment-qr'],
    author: 'QR Code Tools Team',
    publishedAt: '2024-01-01',
    updatedAt: '2026-09-01',
    batchNumber: 0,
  },
  // Blog and Trust Pages
  {
    id: 'blog',
    slug: 'blog',
    url: '/blog',
    section: 'blog',
    primaryKeyword: 'qr code guides and tutorials',
    title: 'Guides & Standards — QR Code Tools Blog',
    status: 'published',
    qualityScore: 88,
    outboundLinks: ['home', 'qr-size-calculator', 'error-correction-simulator'],
    inboundLinks: ['home'],
    author: 'QR Code Tools Team',
    publishedAt: '2024-01-01',
    updatedAt: '2026-10-01',
    batchNumber: 0,
  },
  {
    id: 'sitemap-page',
    slug: 'sitemap-page',
    url: '/sitemap-page',
    section: 'legal',
    primaryKeyword: 'qr code tools sitemap',
    title: 'Site Map — QR Code Tools',
    status: 'published',
    qualityScore: 75,
    outboundLinks: ['home', 'blog', 'qr-size-calculator'],
    inboundLinks: ['home'],
    author: 'QR Code Tools Team',
    publishedAt: '2024-01-01',
    updatedAt: '2026-10-01',
    batchNumber: 0,
  },
  {
    id: 'about',
    slug: 'about',
    url: '/about',
    section: 'legal',
    primaryKeyword: 'about qr code tools',
    title: 'About QR Code Tools',
    status: 'published',
    outboundLinks: ['home', 'contact', 'blog'],
    inboundLinks: ['home'],
    author: 'QR Code Tools Team',
    publishedAt: '2024-01-01',
    updatedAt: '2026-09-01',
    batchNumber: 0,
  },
  {
    id: 'contact',
    slug: 'contact',
    url: '/contact',
    section: 'legal',
    primaryKeyword: 'contact qr code tools',
    title: 'Contact — QR Code Tools',
    status: 'published',
    outboundLinks: ['home', 'about'],
    inboundLinks: ['home', 'about'],
    author: 'QR Code Tools Team',
    publishedAt: '2024-01-01',
    updatedAt: '2026-09-01',
    batchNumber: 0,
  },
  {
    id: 'privacy',
    slug: 'privacy',
    url: '/privacy',
    section: 'legal',
    primaryKeyword: 'qr code tools privacy policy',
    title: 'Privacy Policy — QR Code Tools',
    status: 'published',
    outboundLinks: ['home', 'contact'],
    inboundLinks: ['home'],
    author: 'QR Code Tools Team',
    publishedAt: '2024-01-01',
    updatedAt: '2026-09-01',
    batchNumber: 0,
  },
  {
    id: 'terms',
    slug: 'terms',
    url: '/terms',
    section: 'legal',
    primaryKeyword: 'qr code tools terms of service',
    title: 'Terms of Service — QR Code Tools',
    status: 'published',
    outboundLinks: ['home', 'privacy'],
    inboundLinks: ['home'],
    author: 'QR Code Tools Team',
    publishedAt: '2024-01-01',
    updatedAt: '2026-09-01',
    batchNumber: 0,
  },
];

// ── Batches 1-6: Planned Pages (draft status, 303 total) ─────────────────────
// Abbreviated representative set — full 303 entries populated from data files
// (countries.ts, payments.ts, labels.ts, industries.ts, devices.ts,
//  size-guides.ts, templates-gallery.ts, glossary.ts)
const BATCH_PLANNED_PAGES: RegistryPage[] = [
  // Representative sample — full data populated dynamically from data files
  {
    id: 'labels-avery-5160',
    slug: 'qr-labels/avery-5160',
    url: '/qr-labels/avery-5160',
    section: 'labels',
    primaryKeyword: 'avery 5160 qr code template',
    title: 'Avery 5160 QR Code Sheet Generator',
    status: 'draft',
    outboundLinks: ['qr-size-calculator', 'qr-sticker-sheet-printer', 'qr-labels/avery-5163'],
    inboundLinks: ['qr-sticker-sheet-printer', 'home'],
    author: 'CodexEngr',
    publishedAt: '',
    updatedAt: '',
    batchNumber: 1,
  },
  {
    id: 'countries-brazil',
    slug: 'whatsapp-qr/brazil',
    url: '/whatsapp-qr/brazil',
    section: 'countries',
    primaryKeyword: 'whatsapp qr code brazil +55',
    title: 'WhatsApp QR Code Generator for Brazil (+55)',
    status: 'draft',
    outboundLinks: ['whatsapp-qr-code-generator', 'payment-qr/brazil-pix-emv', 'whatsapp-qr/argentina'],
    inboundLinks: ['whatsapp-qr-code-generator', 'home'],
    author: 'CodexEngr',
    publishedAt: '',
    updatedAt: '',
    batchNumber: 1,
  },
  {
    id: 'payments-india-upi',
    slug: 'payment-qr/india-upi',
    url: '/payment-qr/india-upi',
    section: 'payments',
    primaryKeyword: 'upi qr code generator india',
    title: 'UPI QR Code Generator — India NPCI Spec',
    status: 'draft',
    outboundLinks: ['upi-qr-code-generator', 'regional-payment-qr', 'payment-qr/pakistan-raast'],
    inboundLinks: ['regional-payment-qr', 'upi-qr-code-generator'],
    author: 'CodexEngr',
    publishedAt: '',
    updatedAt: '',
    batchNumber: 1,
  },
];

export const PAGE_REGISTRY: RegistryPage[] = [
  ...BATCH_0_PAGES,
  ...BATCH_PLANNED_PAGES,
];

// ── Helper Functions ──────────────────────────────────────────────────────────

export function getPageBySlug(slug: string): RegistryPage | undefined {
  return PAGE_REGISTRY.find((p) => p.slug === slug);
}

export function getPagesBySection(section: RegistrySection): RegistryPage[] {
  return PAGE_REGISTRY.filter((p) => p.section === section);
}

export function getPagesByBatch(batchNumber: number): RegistryPage[] {
  return PAGE_REGISTRY.filter((p) => p.batchNumber === batchNumber);
}

export function getPagesByStatus(status: RegistryPageStatus): RegistryPage[] {
  return PAGE_REGISTRY.filter((p) => p.status === status);
}

export function getPruningCandidates(minImpressions = 10, days = 90): RegistryPage[] {
  return PAGE_REGISTRY.filter(
    (p) =>
      p.status === 'published' &&
      p.impressions90d !== undefined &&
      p.impressions90d < minImpressions
  );
}

export function getOrphanPages(): RegistryPage[] {
  return PAGE_REGISTRY.filter(
    (p) => p.status === 'published' && p.inboundLinks.length < 2
  );
}

export function getSitemapEligiblePages(): RegistryPage[] {
  return PAGE_REGISTRY.filter(
    (p) => p.status === 'published' || p.status === 'reviewer_approved'
  );
}

export function getRegistryStats() {
  const total = PAGE_REGISTRY.length;
  const byStatus = PAGE_REGISTRY.reduce<Record<string, number>>((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1;
    return acc;
  }, {});
  const bySection = PAGE_REGISTRY.reduce<Record<string, number>>((acc, p) => {
    acc[p.section] = (acc[p.section] || 0) + 1;
    return acc;
  }, {});
  const orphans = getOrphanPages().length;
  return { total, byStatus, bySection, orphans };
}
