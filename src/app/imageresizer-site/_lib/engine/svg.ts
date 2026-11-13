/**
 * SVG handling: string-level hardening before rasterization, plus intrinsic
 * size extraction.
 *
 * Defence in depth: SVGs are only ever rasterized through an <img> element
 * (SVG-as-image runs in the spec's "secure static mode" — no script, no
 * external loads), and on top of that this sanitizer strips active content
 * and external references so the markup is also safe if it is ever inlined.
 * DOCTYPE entity declarations are rejected outright (entity-expansion
 * attacks); an SVG that needs custom entities is not a plausible user image.
 */
import { ImageToolError } from './types';

const MAX_SVG_BYTES = 2 * 1024 * 1024;

export function sanitizeSvgText(input: string): string {
  if (input.length > MAX_SVG_BYTES) {
    throw new ImageToolError('svg-too-large', 'This SVG is larger than 2 MB and cannot be processed safely.');
  }
  if (/<!doctype[^>]*\[/i.test(input) || /<!entity/i.test(input)) {
    throw new ImageToolError(
      'svg-entities',
      'This SVG declares custom XML entities, which are not supported for safety reasons.'
    );
  }
  let out = input;
  // Remove DOCTYPE entirely (no entities survive the check above).
  out = out.replace(/<!doctype[^>]*>/gi, '');
  // XML stylesheet processing instructions can pull external resources.
  out = out.replace(/<\?xml-stylesheet[^?]*\?>/gi, '');
  // Active / embedding elements.
  out = out.replace(/<\s*(script|foreignObject|iframe|object|embed|link|meta|base|audio|video)\b[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, '');
  out = out.replace(/<\s*(script|foreignObject|iframe|object|embed|link|meta|base|audio|video)\b[^>]*\/?>/gi, '');
  // <style> blocks can reference external URLs — drop them.
  out = out.replace(/<style\b[^>]*>[\s\S]*?<\/style\s*>/gi, '');
  // Event-handler attributes (onload, onclick, ...).
  out = out.replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '');
  // javascript: URLs anywhere.
  out = out.replace(/(href|xlink:href)\s*=\s*("\s*javascript:[^"]*"|'\s*javascript:[^']*')/gi, '$1="#"');
  // External references: href values that are not fragments or data:image.
  out = out.replace(
    /(href|xlink:href)\s*=\s*("([^"]*)"|'([^']*)')/gi,
    (match, attr: string, _q: string, dq?: string, sq?: string) => {
      const value = (dq ?? sq ?? '').trim();
      if (value.startsWith('#') || value.toLowerCase().startsWith('data:image/')) return match;
      return `${attr}="#"`;
    }
  );
  // style attributes with url() or expression() content.
  out = out.replace(/\sstyle\s*=\s*("[^"]*(url\s*\(|expression\s*\()[^"]*"|'[^']*(url\s*\(|expression\s*\()[^']*')/gi, '');
  if (!/<svg\b/i.test(out)) {
    throw new ImageToolError('svg-invalid', 'This file does not contain a valid <svg> document.');
  }
  return out;
}

function parseLength(value: string | undefined): number | null {
  if (!value) return null;
  const m = /^([\d.]+)\s*(px|pt|pc|mm|cm|in|%)?$/.exec(value.trim());
  if (!m) return null;
  const n = parseFloat(m[1]);
  if (!Number.isFinite(n) || n <= 0) return null;
  switch (m[2]) {
    case 'pt':
      return (n * 96) / 72;
    case 'pc':
      return n * 16;
    case 'mm':
      return (n * 96) / 25.4;
    case 'cm':
      return (n * 96) / 2.54;
    case 'in':
      return n * 96;
    case '%':
      return null; // relative — fall back to viewBox
    default:
      return n;
  }
}

function svgTagAttrs(svgText: string): Record<string, string> {
  const tag = /<svg\b([^>]*)>/i.exec(svgText)?.[1] ?? '';
  const attrs: Record<string, string> = {};
  const re = /([a-zA-Z:-]+)\s*=\s*("([^"]*)"|'([^']*)')/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(tag)) !== null) {
    attrs[m[1].toLowerCase()] = m[3] ?? m[4] ?? '';
  }
  return attrs;
}

/**
 * The SVG's intrinsic pixel size: explicit width/height first, then the
 * viewBox, then a documented 1024×1024 fallback (flagged via `assumed`).
 */
export function intrinsicSvgSize(svgText: string): { width: number; height: number; assumed: boolean } {
  const attrs = svgTagAttrs(svgText);
  const w = parseLength(attrs['width']);
  const h = parseLength(attrs['height']);
  if (w && h) return { width: Math.round(w), height: Math.round(h), assumed: false };
  const viewBox = attrs['viewbox']?.trim().split(/[\s,]+/).map(Number);
  if (viewBox && viewBox.length === 4 && viewBox.every((n) => Number.isFinite(n)) && viewBox[2] > 0 && viewBox[3] > 0) {
    if (w && !h) return { width: Math.round(w), height: Math.round((w * viewBox[3]) / viewBox[2]), assumed: false };
    if (h && !w) return { width: Math.round((h * viewBox[2]) / viewBox[3]), height: Math.round(h), assumed: false };
    return { width: Math.round(viewBox[2]), height: Math.round(viewBox[3]), assumed: false };
  }
  if (w && h === null) return { width: Math.round(w), height: Math.round(w), assumed: true };
  return { width: 1024, height: 1024, assumed: true };
}
