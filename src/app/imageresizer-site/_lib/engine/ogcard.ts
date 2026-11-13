/**
 * Open Graph / social card composer (1200×630 by default): a background
 * (solid colour, or an image cover-fitted under a dark overlay), an accent
 * bar, a wrapped title and subtitle, and a brand line. Text is measured
 * with the real canvas metrics and wrapped honestly — overflow shrinks the
 * title font before it is allowed to clip.
 */
import type { CanvasEnv, CanvasSurface, Drawable } from './canvas-env';

export interface OgCardOptions {
  width?: number;
  height?: number;
  backgroundColor: string;
  backgroundImage?: Drawable | null;
  /** 0..0.85 dark overlay over a background image, for text contrast. */
  overlayOpacity?: number;
  accentColor: string;
  title: string;
  subtitle?: string;
  brand?: string;
  textColor: string;
}

function wrapLines(
  measure: (text: string) => number,
  text: string,
  maxWidth: number,
  maxLines: number
): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const trial = current ? `${current} ${word}` : word;
    if (measure(trial) <= maxWidth || !current) {
      current = trial;
    } else {
      lines.push(current);
      current = word;
      if (lines.length === maxLines) break;
    }
  }
  if (current && lines.length < maxLines) lines.push(current);
  if (lines.length === maxLines && words.join(' ') !== lines.join(' ')) {
    // Mark truncation honestly with an ellipsis on the last line.
    lines[maxLines - 1] = `${lines[maxLines - 1].replace(/\s*\S*$/, '')}…`;
  }
  return lines;
}

export function composeOgCard(env: CanvasEnv, options: OgCardOptions): CanvasSurface {
  const width = options.width ?? 1200;
  const height = options.height ?? 630;
  const canvas = env.createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = options.backgroundColor;
  ctx.fillRect(0, 0, width, height);
  if (options.backgroundImage) {
    const img = options.backgroundImage;
    const scale = Math.max(width / img.width, height / img.height);
    const dw = img.width * scale;
    const dh = img.height * scale;
    ctx.drawImage(img, (width - dw) / 2, (height - dh) / 2, dw, dh);
    const overlay = options.overlayOpacity ?? 0.55;
    if (overlay > 0) {
      ctx.globalAlpha = Math.min(0.85, overlay);
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);
      ctx.globalAlpha = 1;
    }
  }

  // Accent bar (top)
  ctx.fillStyle = options.accentColor;
  ctx.fillRect(0, 0, width, Math.round(height * 0.018));

  const margin = Math.round(width * 0.07);
  const maxTextWidth = width - margin * 2;
  ctx.fillStyle = options.textColor;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';

  // Title: shrink to fit up to 3 lines.
  let titleSize = Math.round(height * 0.115);
  let titleLines: string[] = [];
  for (; titleSize >= 24; titleSize -= 4) {
    ctx.font = `700 ${titleSize}px system-ui, sans-serif`;
    titleLines = wrapLines((t) => ctx.measureText(t).width, options.title, maxTextWidth, 3);
    const widest = Math.max(...titleLines.map((l) => ctx.measureText(l).width));
    if (widest <= maxTextWidth) break;
  }
  const lineHeight = Math.round(titleSize * 1.18);
  const subtitleSize = Math.round(height * 0.048);
  const brandSize = Math.round(height * 0.038);
  const subtitleLines = options.subtitle
    ? (() => {
        ctx.font = `400 ${subtitleSize}px system-ui, sans-serif`;
        return wrapLines((t) => ctx.measureText(t).width, options.subtitle, maxTextWidth, 2);
      })()
    : [];
  const totalTextHeight =
    titleLines.length * lineHeight +
    (subtitleLines.length ? Math.round(height * 0.045) + subtitleLines.length * Math.round(subtitleSize * 1.3) : 0);
  let y = Math.max(margin, (height - totalTextHeight) / 2 - (options.brand ? brandSize : 0));

  ctx.font = `700 ${titleSize}px system-ui, sans-serif`;
  ctx.fillStyle = options.textColor;
  for (const line of titleLines) {
    ctx.fillText(line, margin, y);
    y += lineHeight;
  }
  if (subtitleLines.length) {
    y += Math.round(height * 0.045);
    ctx.font = `400 ${subtitleSize}px system-ui, sans-serif`;
    ctx.globalAlpha = 0.88;
    for (const line of subtitleLines) {
      ctx.fillText(line, margin, y);
      y += Math.round(subtitleSize * 1.3);
    }
    ctx.globalAlpha = 1;
  }
  if (options.brand) {
    ctx.font = `600 ${brandSize}px system-ui, sans-serif`;
    ctx.fillStyle = options.accentColor;
    ctx.textBaseline = 'bottom';
    ctx.fillText(options.brand, margin, height - Math.round(height * 0.055));
    ctx.textBaseline = 'top';
  }
  return canvas;
}
