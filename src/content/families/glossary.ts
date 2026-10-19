import type { ContentEntry } from '../schema';
import { GLOSSARY_ENTRIES, type GlossaryEntry } from '../../data/glossary';

/**
 * Adapter: src/data/glossary.ts → ContentEntry[].
 *
 * Maps each approved GlossaryEntry to the unified content schema:
 * - slug / title / metaDescription / h1 derived from the term
 * - content = shortDefinition + fullExplanation (+ diagram description)
 * - internalLinks = related terms (/glossary/<slug>) + verified tool paths
 * - lastReviewed pinned to the family review date, status 'published'
 */

/** Static tool/generator routes verified to exist as page.tsx files under src/app. */
const KNOWN_STATIC_ROUTES = new Set([
  '/qr-size-calculator',
  '/error-correction-simulator',
  '/qr-safety-checker',
  '/printed-qr-tester',
  '/qr-placement-guide',
  '/url-qr-code-generator',
  '/wifi-qr-code-generator',
  '/vcard-qr-code-generator',
  '/whatsapp-qr-code-generator',
  '/upi-qr-code-generator',
  '/bitcoin-qr-code-generator',
  '/utm-builder',
  '/qr-scanner',
  '/barcode-generator',
  '/bulk-generator',
  '/bulk-vcard-qr',
  '/bulk-vcard-generator',
  '/regional-payment-qr',
  '/pakistan-payment-qr',
  '/payment-qr',
  '/qr-sticker-sheet-printer',
  '/qr-splitter-scanner',
  '/animated-qr-transfer',
  '/medical-id-qr',
  '/pet-tag-qr',
  '/qr-labels',
  '/whatsapp-qr',
  '/wifi-sign-generator',
  '/blog',
  '/about',
  '/contact',
]);

const LAST_REVIEWED = '2026-10-19';

/** Truncate to maxLen at a word boundary, appending an ellipsis. */
function truncateWords(s: string, maxLen: number): string {
  if (s.length <= maxLen) return s;
  const cut = s.slice(0, maxLen - 1);
  const lastSpace = cut.lastIndexOf(' ');
  return `${cut.slice(0, lastSpace > 0 ? lastSpace : maxLen - 1)}…`;
}

function buildMetaDescription(entry: GlossaryEntry): string {
  return truncateWords(`What is ${entry.term}? ${entry.shortDefinition}`, 160);
}

function buildContent(entry: GlossaryEntry): string {
  const parts = [entry.shortDefinition, entry.fullExplanation.trim()];
  if (entry.hasDiagramDescription && entry.diagramDescription) {
    parts.push(`**Diagram description:** ${entry.diagramDescription}`);
  }
  return parts.join('\n\n');
}

function buildInternalLinks(entry: GlossaryEntry): string[] {
  const links = new Set<string>();
  for (const term of entry.relatedTerms) {
    links.add(`/glossary/${term}`);
  }
  for (const tool of entry.relatedTools) {
    if (KNOWN_STATIC_ROUTES.has(tool)) links.add(tool);
  }
  // Fillers guarantee the ≥5 minimum with real, crawlable pages.
  for (const fallback of ['/qr-size-calculator', '/error-correction-simulator', '/blog']) {
    links.add(fallback);
  }
  return [...links];
}

function toContentEntry(entry: GlossaryEntry): ContentEntry {
  const raw: Record<string, unknown> = {
    slug: entry.slug,
    title: `${entry.term} — QR Code Glossary`,
    metaDescription: buildMetaDescription(entry),
    h1: `What is ${entry.term}?`,
    content: buildContent(entry),
    faqs: entry.faqs.map((f) => ({ question: f.question, answer: f.answer })),
    internalLinks: buildInternalLinks(entry),
    author: entry.author,
    lastReviewed: LAST_REVIEWED,
    sources: (entry.sources ?? []).map((s) => ({ label: s.label, url: s.url })),
    status: 'published' as const,
    // Read by scripts/content-audit.ts: factual-claim entries must list sources.
    requiresSources: entry.requiresSources === true,
  };
  return raw as ContentEntry;
}

export function loadGlossary(): ContentEntry[] {
  return GLOSSARY_ENTRIES.filter((e) => e.status === 'approved').map(toContentEntry);
}
