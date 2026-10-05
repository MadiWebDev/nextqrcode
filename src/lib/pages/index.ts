import type { Article } from '../articles';
import { batch1 } from './Batch1';
import { batch2 } from './Batch2';
import { batch3 } from './Batch3';
import { batch4 } from './Batch4';
import { batch5 } from './Batch5';
import { batch6 } from './Batch6';
import { batch7 } from './Batch7';
import { batch8 } from './Batch8';
import { batch9 } from './Batch9';
import { batch10 } from './Batch10';
import { batch11 } from './Batch11';
import { batch12 } from './Batch12';
import { batch13 } from './Batch13';
import { batch14 } from './Batch14';
import { batch15 } from './Batch15';

export const NEW_ARTICLES: Article[] = [
  ...batch1,
  ...batch2,
  ...batch3,
  ...batch4,
  ...batch5,
  ...batch6,
  ...batch7,
  ...batch8,
  ...batch9,
  ...batch10,
  ...batch11,
  ...batch12,
  ...batch13,
  ...batch14,
  ...batch15,
];

// Build-time guard. Word-count floor is 120 for these seed articles;
// raise it to 600+ as you expand each one.
export function validateArticles(list: Article[], minWords = 120) {
  const slugs = new Set<string>();
  for (const a of list) {
    if (slugs.has(a.slug)) throw new Error(`Duplicate slug: ${a.slug}`);
    slugs.add(a.slug);
    if (a.content.split(/\s+/).length < minWords)
      throw new Error(`Thin content (<${minWords} words): ${a.slug}`);
    if (a.faqs.length < 2) throw new Error(`Needs 2+ FAQs: ${a.slug}`);
  }
}

// In your main articles file:
//   import { NEW_ARTICLES, validateArticles } from './pages/index';
//   export const ARTICLES: Article[] = [...EXISTING_ARTICLES, ...NEW_ARTICLES];
//   validateArticles(ARTICLES);
