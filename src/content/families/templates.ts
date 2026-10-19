import type { ContentEntry } from '../schema';
import { TEMPLATE_GALLERY, type TemplateGalleryEntry } from '@/data/templates-gallery';

/**
 * Adapter: src/data/templates-gallery.ts → ContentEntry[].
 *
 * Each gallery template becomes a published /templates/[slug] page.
 * internalLinks always include the relevant generator pages,
 * /qr-safety-checker, and two sibling template pages.
 */

const GENERATOR_LINKS = [
  '/url-qr-code-generator',
  '/wifi-qr-code-generator',
  '/vcard-qr-code-generator',
] as const;

function pickGenerators(t: TemplateGalleryEntry): string[] {
  const hay = `${t.primaryUseCase} ${t.targetIndustry} ${t.name}`.toLowerCase();
  const picks: string[] = [];
  if (/business card|resume|vcard|contact|portfolio|wedding|rsvp|invitation/.test(hay)) {
    picks.push('/vcard-qr-code-generator');
  }
  if (/wifi|caf[eé]|restaurant|hotel|menu|table/.test(hay)) {
    picks.push('/wifi-qr-code-generator');
  }
  // Every template gets the URL generator; fill up to 3 unique links.
  picks.push('/url-qr-code-generator');
  for (const g of GENERATOR_LINKS) {
    if (picks.length >= 3) break;
    if (!picks.includes(g)) picks.push(g);
  }
  return picks;
}

function siblingSlugs(index: number): string[] {
  const n = TEMPLATE_GALLERY.length;
  return [TEMPLATE_GALLERY[(index + 1) % n].slug, TEMPLATE_GALLERY[(index + 2) % n].slug];
}

function toContent(t: TemplateGalleryEntry): string {
  const best = t.bestFor.map((b) => `- ${b}`).join('\n');
  const avoid = t.avoidFor.map((a) => `- ${a}`).join('\n');
  return `${t.useCaseAdvice.trim()}\n\nBest for:\n${best}\n\nAvoid for:\n${avoid}`;
}

/** Adapter: src/data/templates-gallery.ts → ContentEntry[]. */
export function loadTemplates(): ContentEntry[] {
  return TEMPLATE_GALLERY.map((t, i): ContentEntry => {
    const internalLinks = [
      ...pickGenerators(t),
      '/qr-safety-checker',
      ...siblingSlugs(i).map((s) => `/templates/${s}`),
    ];
    return {
      slug: t.slug,
      title: t.title,
      metaDescription: t.metaDescription,
      h1: `${t.name} QR Code Template`,
      content: toContent(t),
      faqs: t.faqs.map((f) => ({ question: f.question, answer: f.answer })),
      internalLinks,
      author: t.author,
      lastReviewed: '2026-10-19',
      sources: [],
      status: 'published',
    };
  });
}
