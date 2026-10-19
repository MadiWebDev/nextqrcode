import type { ContentEntry } from '../schema';
import { SIZE_GUIDES } from '../../data/size-guides';

/**
 * Adapter: src/data/size-guides.ts → ContentEntry[].
 *
 * Maps each SizeGuide to the unified content schema. Internal links combine
 * the sizing tools every guide references with two rotating sibling guides so
 * each page carries ≥5 real site paths. Sizing advice is practical guidance
 * (rules of thumb), not factual claims about standards — hence sources: [].
 */
export function loadSizeGuide(): ContentEntry[] {
  const n = SIZE_GUIDES.length;
  return SIZE_GUIDES.map((g, i): ContentEntry => {
    const siblingA = SIZE_GUIDES[(i + 1) % n].slug;
    const siblingB = SIZE_GUIDES[(i + 2) % n].slug;
    return {
      slug: g.slug,
      title: g.title,
      metaDescription: g.metaDescription,
      h1: `QR Code Size Guide: ${g.useCase}`,
      content: g.content,
      faqs: g.faqs,
      internalLinks: [
        '/qr-size-calculator',
        '/error-correction-simulator',
        '/qr-safety-checker',
        '/bulk-generator',
        `/qr-size-guide/${siblingA}`,
        `/qr-size-guide/${siblingB}`,
      ],
      author: g.author,
      lastReviewed: '2026-10-19',
      sources: [],
      status: 'published',
    };
  });
}
