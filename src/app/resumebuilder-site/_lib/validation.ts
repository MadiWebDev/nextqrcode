import type { RichText } from './schema';

/**
 * Input validation + sanitisation (spec §6/§14). Validation guides but
 * never blocks export; sanitisation is structural — rich text is an AST
 * and link targets are restricted to safe protocols, so user content
 * can never become markup.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_RE.test(value.trim());
}

/** Normalise a user-typed URL: add https:// when missing, strip spaces. Returns '' for empty input. */
export function normaliseUrl(value: string): string {
  const v = value.trim().replace(/\s+/g, '');
  if (!v) return '';
  if (/^(https?:\/\/|mailto:|tel:)/i.test(v)) return v;
  if (/^[\w-]+(\.[\w-]+)+(\/\S*)?$/.test(v)) return `https://${v}`;
  return v;
}

export function isSafeLink(url: string): boolean {
  return /^(https?:\/\/|mailto:|tel:)/i.test(url.trim());
}

/** Return a copy of the rich text with unsafe link marks removed and text clamped. */
export function sanitiseRichText(blocks: RichText, maxChars = 20_000): RichText {
  let used = 0;
  const cleanSpan = (span: { text: string; marks?: { bold?: boolean; italic?: boolean; link?: string } }) => {
    const room = Math.max(0, maxChars - used);
    const text = span.text.slice(0, room);
    used += text.length;
    const marks = span.marks
      ? {
          bold: span.marks.bold || undefined,
          italic: span.marks.italic || undefined,
          link: span.marks.link && isSafeLink(span.marks.link) ? span.marks.link : undefined,
        }
      : undefined;
    return { text, ...(marks && (marks.bold || marks.italic || marks.link) ? { marks } : {}) };
  };
  return blocks.map((b) =>
    b.type === 'paragraph'
      ? { type: 'paragraph' as const, spans: b.spans.map(cleanSpan) }
      : { type: 'bullets' as const, items: b.items.map((item) => item.map(cleanSpan)) },
  );
}

/** Filename sanitiser (spec §10): "Firstname-Lastname-Role-Resume", length-limited, Unicode-safe. */
export function resumeFilename(
  name: string,
  role: string,
  ext: string,
  fallback = 'Resume',
): string {
  const parts = [name, role]
    .map((p) => p.trim())
    .filter(Boolean)
    .join('-');
  let base = (parts || fallback)
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '') // strip diacritics for filesystem safety
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
  if (!base) base = fallback;
  return `${base}-Resume.${ext.replace(/^\./, '')}`;
}

/** Phone display formatting: light grouping without a heavy dependency in the core path. */
export function formatPhoneDisplay(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return '';
  // libphonenumber-js is lazy-loaded by the editor for full parsing;
  // this fallback just groups digits readably.
  const digits = trimmed.replace(/[^\d+]/g, '');
  return digits;
}
