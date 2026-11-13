/**
 * Pure planning helpers for the PDF → images tool: page-range parsing and
 * render-scale maths. Kept dependency-free so the fiddly parts are unit
 * tested without loading pdf.js.
 */

/** Parse "1-3,5,8-10" (1-based, inclusive) against a page count. */
export function parsePageRange(spec: string, totalPages: number): number[] {
  const trimmed = spec.trim();
  if (!trimmed || totalPages <= 0) {
    return Array.from({ length: Math.max(0, totalPages) }, (_, i) => i + 1);
  }
  const pages = new Set<number>();
  for (const part of trimmed.split(',')) {
    const piece = part.trim();
    if (!piece) continue;
    const range = piece.match(/^(\d+)\s*-\s*(\d+)$/);
    if (range) {
      const start = Math.min(totalPages, Math.max(1, parseInt(range[1], 10)));
      const end = Math.min(totalPages, parseInt(range[2], 10));
      for (let p = start; p <= end; p++) pages.add(p);
    } else if (/^\d+$/.test(piece)) {
      const p = parseInt(piece, 10);
      if (p >= 1 && p <= totalPages) pages.add(p);
    }
  }
  return [...pages].sort((a, b) => a - b);
}

/**
 * pdf.js renders at 72 DPI at scale 1. To hit a target print DPI, scale =
 * dpi / 72. Clamp so a huge page at 300 DPI can't allocate an absurd canvas.
 */
export function scaleForDpi(dpi: number, pageWidthPt: number, pageHeightPt: number): number {
  const scale = dpi / 72;
  const maxEdge = 4200;
  const longest = Math.max(pageWidthPt, pageHeightPt) * scale;
  if (longest > maxEdge) return scale * (maxEdge / longest);
  return scale;
}
