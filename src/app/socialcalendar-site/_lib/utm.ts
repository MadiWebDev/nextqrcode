import type { UtmParams } from './types';

/** Slugify a campaign name the way analytics tools expect: lowercase, hyphenated. */
export function slugifyCampaign(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

export interface UtmResult {
  ok: boolean;
  url?: string;
  errors: string[];
}

/**
 * Build a UTM-tagged URL. Validates the base URL (http/https only),
 * replaces existing utm_* parameters rather than duplicating them, and
 * preserves any other query parameters and the fragment.
 */
export function buildUtmUrl(
  base: string,
  params: UtmParams,
  custom?: Record<string, string>,
): UtmResult {
  const errors: string[] = [];
  let url: URL;
  try {
    url = new URL(base.trim());
  } catch {
    return { ok: false, errors: ['Enter a valid base URL, including https://'] };
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return { ok: false, errors: ['Only http:// and https:// URLs can be tagged.'] };
  }
  if (!params.source.trim()) errors.push('utm_source is required.');
  if (!params.medium.trim()) errors.push('utm_medium is required.');
  if (!params.campaign.trim()) errors.push('utm_campaign is required.');
  if (errors.length) return { ok: false, errors };

  const set = (key: string, value?: string) => {
    url.searchParams.delete(key);
    if (value?.trim()) url.searchParams.set(key, value.trim());
  };
  set('utm_source', params.source);
  set('utm_medium', params.medium);
  set('utm_campaign', slugifyCampaign(params.campaign));
  set('utm_term', params.term);
  set('utm_content', params.content);
  if (custom) {
    for (const [key, value] of Object.entries(custom)) {
      const k = key.trim();
      if (k && value.trim()) url.searchParams.set(k, value.trim());
    }
  }
  return { ok: true, url: url.toString(), errors: [] };
}

/** Parse hashtags out of free text into a clean, de-duplicated list. */
export function parseHashtagInput(text: string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of text.split(/[\s,]+/)) {
    const tag = raw.replace(/^#+/, '').trim();
    if (!tag) continue;
    const key = tag.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(tag);
  }
  return out;
}

/** Find duplicate hashtags across groups (case-insensitive). */
export function findDuplicateTags(
  groups: { name: string; tags: string[] }[],
): { tag: string; groups: string[] }[] {
  const map = new Map<string, { tag: string; groups: Set<string> }>();
  for (const g of groups) {
    for (const t of g.tags) {
      const key = t.toLowerCase();
      const entry = map.get(key) ?? { tag: t, groups: new Set<string>() };
      entry.groups.add(g.name);
      map.set(key, entry);
    }
  }
  return [...map.values()]
    .filter((e) => e.groups.size > 1)
    .map((e) => ({ tag: e.tag, groups: [...e.groups] }));
}

/** Banned-word check for a caption (whole-word, case-insensitive). */
export function findBannedWords(text: string, banned: string[]): string[] {
  const hits: string[] = [];
  for (const word of banned) {
    const w = word.trim();
    if (!w) continue;
    const re = new RegExp(`(^|[^\\p{L}\\p{N}])${w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^\\p{L}\\p{N}]|$)`, 'iu');
    if (re.test(text)) hits.push(w);
  }
  return hits;
}
