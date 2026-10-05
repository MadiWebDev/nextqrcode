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
import { batch16 } from './Batch16';
import { batch17 } from './Batch17';
import { batch18 } from './Batch18';
import { batch19 } from './Batch19';
import { batch20 } from './Batch20';
import { batch21 } from './Batch21';
import { batch22 } from './Batch22';
import { batch23 } from './Batch23';
import { batch24 } from './Batch24';
import { batch25 } from './Batch25';
import { batch26 } from './Batch26';
import { batch27 } from './Batch27';
import { batch28 } from './Batch28';
import { batch29 } from './Batch29';
import { batch30 } from './Batch30';
import { batch31 } from './Batch31';
import { batch32 } from './Batch32';
import { batch33 } from './Batch33';
import { batch34 } from './Batch34';
import { batch35 } from './Batch35';

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
  ...batch16,
  ...batch17,
  ...batch18,
  ...batch19,
  ...batch20,
  ...batch21,
  ...batch22,
  ...batch23,
  ...batch24,
  ...batch25,
  ...batch26,
  ...batch27,
  ...batch28,
  ...batch29,
  ...batch30,
  ...batch31,
  ...batch32,
  ...batch33,
  ...batch34,
  ...batch35,
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
