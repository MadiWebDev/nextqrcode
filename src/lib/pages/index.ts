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
import { batch36 } from './Batch36';
import { batch37 } from './Batch37';
import { batch38 } from './Batch38';
import { batch39 } from './Batch39';
import { batch40 } from './Batch40';
import { batch41 } from './Batch41';
import { batch42 } from './Batch42';
import { batch43 } from './Batch43';
import { batch44 } from './Batch44';
import { batch45 } from './Batch45';
import { batch46 } from './Batch46';
import { batch47 } from './Batch47';
import { batch48 } from './Batch48';
import { batch49 } from './Batch49';
import { batch50 } from './Batch50';
import { batch51 } from './Batch51';
import { batch52 } from './Batch52';
import { batch53 } from './Batch53';
import { batch54 } from './Batch54';
import { batch55 } from './Batch55';
import { batch56 } from './Batch56';
import { batch57 } from './Batch57';
import { batch58 } from './Batch58';
import { batch59 } from './Batch59';
import { batch60 } from './Batch60';
import { batch61 } from './Batch61';
import { batch62 } from './Batch62';
import { batch63 } from './Batch63';
import { batch64 } from './Batch64';
import { batch65 } from './Batch65';
import { batch66 } from './Batch66';
import { batch67 } from './Batch67';
import { batch68 } from './Batch68';
import { batch69 } from './Batch69';

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
  ...batch36,
  ...batch37,
  ...batch38,
  ...batch39,
  ...batch40,
  ...batch41,
  ...batch42,
  ...batch43,
  ...batch44,
  ...batch45,
  ...batch46,
  ...batch47,
  ...batch48,
  ...batch49,
  ...batch50,
  ...batch51,
  ...batch52,
  ...batch53,
  ...batch54,
  ...batch55,
  ...batch56,
  ...batch57,
  ...batch58,
  ...batch59,
  ...batch60,
  ...batch61,
  ...batch62,
  ...batch63,
  ...batch64,
  ...batch65,
  ...batch66,
  ...batch67,
  ...batch68,
  ...batch69,
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
