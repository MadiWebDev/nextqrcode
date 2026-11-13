/**
 * Smart output file naming.
 *
 * Tokens: {name} original base name, {w} width, {h} height, {format},
 * {date} YYYY-MM-DD, {index} 1-based position (zero-padded to 3).
 * Output is always sanitized: no path separators, no control characters,
 * no leading dots, bounded length — a downloaded file name must never be
 * able to escape its folder or confuse the OS.
 */

export interface NamingContext {
  originalName: string;
  width?: number;
  height?: number;
  format?: string;
  index?: number;
  date?: Date;
}

export function baseNameOf(fileName: string): string {
  const noExt = fileName.replace(/\.[^.]+$/, '');
  return noExt || 'image';
}

export function sanitizeFileBase(raw: string): string {
  const cleaned = raw
    .replace(/[\\/:*?"<>|]/g, '-')
    .replace(/[\u0000-\u001f\u007f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^\.+/, '')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120);
  return cleaned || 'image';
}

export function buildOutputName(pattern: string, ctx: NamingContext, extension: string): string {
  const date = ctx.date ?? new Date();
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const replaced = pattern
    .replaceAll('{name}', baseNameOf(ctx.originalName))
    .replaceAll('{w}', ctx.width !== undefined ? String(ctx.width) : '')
    .replaceAll('{h}', ctx.height !== undefined ? String(ctx.height) : '')
    .replaceAll('{format}', ctx.format ?? extension)
    .replaceAll('{date}', `${yyyy}-${mm}-${dd}`)
    .replaceAll('{index}', String((ctx.index ?? 0) + 1).padStart(3, '0'));
  const base = sanitizeFileBase(replaced.replace(/\.[^.]*$/, ''));
  return `${base}.${extension.replace(/^\./, '')}`;
}

/** Default pattern used across tools: `photo-1200x800.webp`. */
export const DEFAULT_NAME_PATTERN = '{name}-{w}x{h}';
