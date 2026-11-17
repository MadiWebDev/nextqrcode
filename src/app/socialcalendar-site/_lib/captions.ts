/**
 * Caption metrics engine (spec §8).
 *
 * Pure functions over a caption string and a PlatformSpec: extraction
 * (URLs, hashtags, mentions, emojis), plain and platform-weighted
 * character counts, validation, and a trim suggestion. Nothing here
 * mutates the user's caption — trimSuggestion returns a suggestion
 * string only.
 */

import type { PlatformSpec } from './platforms';

/** http/https URLs; trailing sentence punctuation is not part of the URL. */
const URL_RE = /https?:\/\/[^\s<>"']+/g;
const TRAILING_PUNCT_RE = /[.,;:!?)\]}'"]+$/;

export function extractUrls(text: string): string[] {
  const found = text.match(URL_RE) ?? [];
  return found
    .map((u) => u.replace(TRAILING_PUNCT_RE, ''))
    .filter((u) => u.length > 'https://'.length);
}

/** Hashtag bodies (without '#'); URLs are stripped first so a URL fragment is not a hashtag. */
export function extractHashtags(text: string): string[] {
  const withoutUrls = text.replace(URL_RE, ' ');
  const tags: string[] = [];
  for (const m of withoutUrls.matchAll(/#([\p{L}\p{N}_]+)/gu)) {
    tags.push(m[1]);
  }
  return tags;
}

/** Mention handles (without '@'); URLs are stripped first so URL userinfo is not a mention. */
export function extractMentions(text: string): string[] {
  const withoutUrls = text.replace(URL_RE, ' ');
  const mentions: string[] = [];
  for (const m of withoutUrls.matchAll(/(?:^|[^\p{L}\p{N}_])@([\p{L}\p{N}_.]+)/gmu)) {
    const handle = m[1].replace(/\.+$/, '');
    if (handle) mentions.push(handle);
  }
  return mentions;
}

/**
 * One emoji cluster: a pictograph (plus optional variation selector)
 * followed by any number of ZWJ-joined pictographs, so a ZWJ sequence
 * such as the family emoji 👨‍👩‍👧‍👦 is a single match.
 *
 * Approximation (documented): skin-tone modifiers, flags (regional
 * indicators) and keycap sequences are not counted exactly — a modified
 * emoji may count its modifier separately or a flag may not count at
 * all. This is a planning estimate, not a platform-exact counter.
 */
const EMOJI_CLUSTER_RE =
  /\p{Extended_Pictographic}\uFE0F?(?:\u200D\p{Extended_Pictographic}\uFE0F?)*/gu;

function emojiClusters(text: string): string[] {
  return text.match(EMOJI_CLUSTER_RE) ?? [];
}

export function countEmojis(text: string): number {
  return emojiClusters(text).length;
}

export interface CaptionCounts {
  /** Code points in the raw text ([...text].length). */
  chars: number;
  /** Platform-weighted length: URLs and emojis cost what the platform charges for them. */
  weighted: number;
  urls: number;
  emojis: number;
  hashtags: number;
  mentions: number;
  remaining: number;
  overLimit: boolean;
}

export function countCaption(text: string, spec: PlatformSpec): CaptionCounts {
  const chars = [...text].length;
  const urls = extractUrls(text);

  // Weighted length: price each URL at the platform's fixed cost (or its
  // real code-point length), and price the rest per code point except
  // that each emoji cluster costs spec.emojiWeight instead of the code
  // points it occupies.
  const urlCost = urls.reduce(
    (sum, u) => sum + (spec.urlCountsAs ?? [...u].length),
    0,
  );
  const rest = urls.reduce((acc, u) => acc.replace(u, ''), text);
  const clusters = emojiClusters(rest);
  const clusterCodePoints = clusters.reduce((sum, c) => sum + [...c].length, 0);
  const weighted =
    [...rest].length - clusterCodePoints + clusters.length * spec.emojiWeight + urlCost;

  const emojis = countEmojis(text);
  const hashtags = extractHashtags(text).length;
  const mentions = extractMentions(text).length;

  // Visual-first platforms (charLimit 0, e.g. Snapchat / WhatsApp Status)
  // have no caption field to exceed: never over limit, nothing "remaining".
  if (spec.charLimit === 0) {
    return {
      chars,
      weighted,
      urls: urls.length,
      emojis,
      hashtags,
      mentions,
      remaining: 0,
      overLimit: false,
    };
  }

  return {
    chars,
    weighted,
    urls: urls.length,
    emojis,
    hashtags,
    mentions,
    remaining: spec.charLimit - weighted,
    overLimit: weighted > spec.charLimit,
  };
}

/** Trailing run of hashtags at the very end of the caption, e.g. " #sale #new". */
const TRAILING_HASHTAGS_RE = /(?:\s+#[^\s#]+)+\s*$/u;

function fits(text: string, spec: PlatformSpec): boolean {
  return countCaption(text, spec).weighted <= spec.charLimit;
}

/**
 * A shortened suggestion that fits the platform limit. The start of the
 * caption is preserved and the cut lands on the last sentence or word
 * boundary that fits; a trailing hashtag block is kept when it fits
 * alongside the cut body. Returns the text unchanged when it already
 * fits (including visual-first platforms with no caption limit).
 */
export function trimSuggestion(text: string, spec: PlatformSpec): string {
  if (spec.charLimit === 0 || fits(text, spec)) return text;

  const trailing = text.match(TRAILING_HASHTAGS_RE);
  const hashtagBlock = trailing ? trailing[0].trim() : '';
  const body = trailing ? text.slice(0, trailing.index ?? 0).trimEnd() : text;

  // Keep the hashtag block only if it leaves room for some body text.
  const suffix =
    hashtagBlock && fits(hashtagBlock, spec) && countCaption(hashtagBlock, spec).weighted < spec.charLimit
      ? ` ${hashtagBlock}`
      : '';

  const withSuffix = (cut: string): string => `${cut}${suffix}`;

  // Candidate cut points, longest first: end of each sentence, then each
  // word boundary (space). The first candidate whose result fits wins.
  const boundaries = new Set<number>();
  for (const m of body.matchAll(/[.!?…]+(?=\s|$)/g)) {
    boundaries.add((m.index ?? 0) + m[0].length);
  }
  for (let i = 0; i < body.length; i++) {
    if (body[i] === ' ' || body[i] === '\n') boundaries.add(i);
  }
  const ordered = [...boundaries].sort((a, b) => b - a);
  for (const at of ordered) {
    const cut = body.slice(0, at).trimEnd();
    if (cut && fits(withSuffix(cut), spec)) return withSuffix(cut);
  }

  // Fallback: even the first word is too long — hard-cut code point by
  // code point to the longest prefix that fits (no boundary available).
  const codePoints = [...body];
  let cut = '';
  for (const cp of codePoints) {
    if (!fits(withSuffix(cut + cp), spec)) break;
    cut += cp;
  }
  return withSuffix(cut.trimEnd());
}

export function validateCaption(
  text: string,
  spec: PlatformSpec,
): { ok: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  const counts = countCaption(text, spec);

  if (spec.charLimit > 0 && counts.overLimit) {
    errors.push(
      `Caption is ${counts.weighted} weighted characters, over the ${spec.name} guidance limit of ${spec.charLimit}.`,
    );
  }
  if (counts.hashtags > spec.maxHashtagsGuidance) {
    warnings.push(
      `${counts.hashtags} hashtags exceeds the ${spec.name} guidance of at most ${spec.maxHashtagsGuidance}.`,
    );
  }
  if (spec.charLimit > 0 && text.trim() === '') {
    warnings.push(`Caption is empty; ${spec.name} posts normally need caption text.`);
  }

  return { ok: errors.length === 0, errors, warnings };
}
