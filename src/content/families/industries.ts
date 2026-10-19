import type { ContentEntry } from '../schema';
import { INDUSTRY_USE_CASES, type IndustryUseCasePage } from '../../data/industries';

/**
 * Adapter: src/data/industries.ts → ContentEntry[].
 *
 * Derives the unified content fields from the industry × use-case data:
 * - h1 from the entry's h1
 * - internalLinks: ≥5 real site paths — a relevant generator, two tools,
 *   a content hub, and two sibling industry pages
 * - lastReviewed from the entry's updatedAt
 * - sources: only verified URLs, attached when the entry references the
 *   corresponding standard (ISO/IEC 18004, GS1, HL7 FHIR)
 * - status 'published'
 */

/** Primary generator most relevant to each use-case page. */
const PRIMARY_GENERATOR: Record<string, string> = {
  'retail-product-authentication': '/url-qr-code-generator',
  'retail-inventory-asset-tagging': '/bulk-generator',
  'retail-loyalty-program': '/url-qr-code-generator',
  'retail-in-store-coupon-campaigns': '/url-qr-code-generator',
  'restaurant-digital-menu': '/url-qr-code-generator',
  'restaurant-table-ordering-payment': '/payment-qr',
  'restaurant-takeout-order-tracking': '/url-qr-code-generator',
  'restaurant-review-feedback': '/url-qr-code-generator',
  'healthcare-patient-wristband-id': '/medical-id-qr',
  'healthcare-equipment-maintenance-log': '/bulk-generator',
  'healthcare-appointment-check-in': '/url-qr-code-generator',
  'healthcare-medication-information': '/url-qr-code-generator',
  'education-classroom-learning-materials': '/url-qr-code-generator',
  'education-student-attendance-tracking': '/url-qr-code-generator',
  'education-campus-wayfinding-tours': '/url-qr-code-generator',
  'education-library-resource-access': '/url-qr-code-generator',
  'logistics-shipment-tracking': '/bulk-generator',
  'logistics-warehouse-bin-labeling': '/bulk-generator',
  'logistics-proof-of-delivery': '/url-qr-code-generator',
  'logistics-fleet-vehicle-inspection': '/url-qr-code-generator',
  'real-estate-listing-flyers': '/url-qr-code-generator',
  'real-estate-open-house-sign-in': '/url-qr-code-generator',
  'real-estate-virtual-tour-access': '/url-qr-code-generator',
  'real-estate-rental-applications': '/url-qr-code-generator',
  'events-ticket-entry-validation': '/url-qr-code-generator',
  'events-attendee-badge-networking': '/vcard-qr-code-generator',
  'events-session-feedback-surveys': '/url-qr-code-generator',
  'events-schedule-agenda-access': '/url-qr-code-generator',
  'hospitality-hotel-express-check-in': '/url-qr-code-generator',
  'hospitality-in-room-dining-menus': '/url-qr-code-generator',
  'hospitality-wifi-concierge-access': '/wifi-qr-code-generator',
  'hospitality-spa-activity-booking': '/url-qr-code-generator',
  'manufacturing-work-instructions': '/url-qr-code-generator',
  'manufacturing-equipment-maintenance-logs': '/bulk-generator',
  'manufacturing-parts-inventory-tracking': '/bulk-generator',
  'manufacturing-quality-inspection-records': '/url-qr-code-generator',
  'fitness-gym-member-check-in': '/url-qr-code-generator',
  'fitness-class-schedule-booking': '/url-qr-code-generator',
  'fitness-workout-plan-access': '/url-qr-code-generator',
  'fitness-personal-trainer-booking': '/vcard-qr-code-generator',
};

/** Two supporting tools per industry — all are real static routes. */
const INDUSTRY_TOOLS: Record<string, [string, string]> = {
  Retail: ['/qr-size-calculator', '/printed-qr-tester'],
  Restaurants: ['/qr-size-calculator', '/qr-safety-checker'],
  Healthcare: ['/qr-size-calculator', '/printed-qr-tester'],
  Education: ['/qr-size-calculator', '/qr-placement-guide'],
  Logistics: ['/qr-size-calculator', '/printed-qr-tester'],
  'Real Estate': ['/qr-size-calculator', '/utm-builder'],
  Events: ['/qr-scanner', '/utm-builder'],
  Hospitality: ['/qr-size-calculator', '/qr-placement-guide'],
  Manufacturing: ['/printed-qr-tester', '/qr-size-calculator'],
  Fitness: ['/qr-size-calculator', '/utm-builder'],
};

const ISO_SOURCE = {
  label: 'ISO/IEC 18004:2015 — QR Code barcode symbology specification',
  url: 'https://www.iso.org/standard/62021.html',
};

const GS1_SOURCE = {
  label: 'GS1 — Barcode standards for supply chains',
  url: 'https://www.gs1.org/standards/barcodes',
};

const FHIR_SOURCE = {
  label: 'HL7 FHIR — Health care data exchange standard',
  url: 'https://www.hl7.org/fhir/',
};

/** Attach a verified source only when the entry references that standard. */
function sourcesFor(entry: IndustryUseCasePage): ContentEntry['sources'] {
  const sources: ContentEntry['sources'] = [];
  if (/ISO\/IEC 18004|Error Correction Level/.test(entry.content)) sources.push(ISO_SOURCE);
  if (/GS1/.test(entry.content)) sources.push(GS1_SOURCE);
  if (/FHIR/.test(entry.content)) sources.push(FHIR_SOURCE);
  return sources;
}

/** Sibling slugs within the same industry (for contextual internal links). */
function siblingSlugs(entry: IndustryUseCasePage): string[] {
  const peers = INDUSTRY_USE_CASES.filter(
    (p) => p.industry === entry.industry && p.slug !== entry.slug
  ).map((p) => p.slug);
  return peers.slice(0, 2);
}

function internalLinksFor(entry: IndustryUseCasePage, index: number): string[] {
  const generator = PRIMARY_GENERATOR[entry.slug] ?? '/url-qr-code-generator';
  const tools = INDUSTRY_TOOLS[entry.industry] ?? ['/qr-size-calculator', '/qr-scanner'];
  const hub = index % 2 === 0 ? '/blog' : '/glossary';
  const siblings = siblingSlugs(entry).map((s) => `/industries/${s}`);
  // Deduplicate while preserving order; every target is a real site path.
  return Array.from(new Set([generator, ...tools, hub, ...siblings]));
}

export function loadIndustries(): ContentEntry[] {
  return INDUSTRY_USE_CASES.map((entry, index) => ({
    slug: entry.slug,
    title: entry.title,
    metaDescription: entry.metaDescription,
    h1: entry.h1,
    content: entry.content,
    faqs: entry.faqs.map((f) => ({ question: f.question, answer: f.answer })),
    internalLinks: internalLinksFor(entry, index),
    author: entry.author,
    lastReviewed: entry.updatedAt,
    sources: sourcesFor(entry),
    status: 'published' as const,
  }));
}
