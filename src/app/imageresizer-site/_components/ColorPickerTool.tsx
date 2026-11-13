'use client';

/**
 * Colour picker + palette extractor: click any pixel of the loaded image
 * to read its exact colour (sampled from the decoded pixels, not the
 * screen), and extract the image's dominant palette with one click.
 * Copy buttons put hex values on the clipboard.
 */
import { useMemo, useState } from 'react';
import { browserEnv } from '../_lib/engine/canvas-env';
import { extractPalette, rgbToHex, type PaletteColour } from '../_lib/engine/palette';
import { FileDrop } from './FileDrop';
import { useImageLoader } from './use-image-loader';

function rgbToHsl(r: number, g: number, b: number): string {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  if (max === min) return `hsl(0, 0%, ${Math.round(l * 100)}%)`;
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) * 60;
  else if (max === gn) h = ((bn - rn) / d + 2) * 60;
  else h = ((rn - gn) / d + 4) * 60;
  return `hsl(${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

export default function ColorPickerTool() {
  const { loaded, loading, error, load } = useImageLoader();
  const [picked, setPicked] = useState<{ r: number; g: number; b: number; x: number; y: number } | null>(null);
  const [palette, setPalette] = useState<PaletteColour[] | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const sampleCanvas = useMemo(() => {
    if (!loaded) return null;
    const canvas = browserEnv.createCanvas(loaded.decoded.width, loaded.decoded.height);
    canvas.getContext('2d').drawImage(loaded.decoded.surface, 0, 0);
    return canvas;
  }, [loaded]);

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(text);
      setTimeout(() => setCopied((c) => (c === text ? null : c)), 1500);
    } catch {
      setCopied(null);
    }
  };

  const onPick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!sampleCanvas || !loaded) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.min(loaded.decoded.width - 1, Math.max(0, Math.floor(((e.clientX - rect.left) / rect.width) * loaded.decoded.width)));
    const y = Math.min(loaded.decoded.height - 1, Math.max(0, Math.floor(((e.clientY - rect.top) / rect.height) * loaded.decoded.height)));
    const d = sampleCanvas.getContext('2d').getImageData(x, y, 1, 1).data;
    setPicked({ r: d[0], g: d[1], b: d[2], x, y });
  };

  const extract = () => {
    if (!loaded) return;
    const scale = Math.min(1, 220 / loaded.decoded.width);
    const w = Math.max(1, Math.round(loaded.decoded.width * scale));
    const h = Math.max(1, Math.round(loaded.decoded.height * scale));
    const small = browserEnv.createCanvas(w, h);
    const ctx = small.getContext('2d');
    ctx.drawImage(loaded.decoded.surface, 0, 0, w, h);
    setPalette(extractPalette(ctx.getImageData(0, 0, w, h).data, 6));
  };

  const pickedHex = picked ? rgbToHex(picked.r, picked.g, picked.b) : null;

  return (
    <div className="w-full min-w-0">
      <FileDrop onFiles={load} label="Drop an image to pick colours from" />
      {error && (
        <p role="alert" className="mt-4 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm">
          {error}
        </p>
      )}
      {loading && <p className="mt-4 text-sm text-muted-foreground">Loading image…</p>}
      {loaded && (
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={loaded.previewUrl}
              alt="Click to pick a colour"
              onClick={onPick}
              className="mx-auto block max-h-135 w-auto max-w-full cursor-crosshair rounded-xl border border-border object-contain"
            />
            <p className="mt-2 text-center text-xs text-muted-foreground">Click anywhere on the image to sample that exact pixel.</p>
          </div>
          <div className="min-w-0 space-y-5">
            <div className="rounded-xl border border-border bg-card p-4">
              <h3 className="text-sm font-semibold">Picked colour</h3>
              {picked && pickedHex ? (
                <div className="mt-3">
                  <div className="flex items-center gap-3">
                    <span className="h-12 w-12 rounded-lg border border-border" style={{ background: pickedHex }} />
                    <div className="text-sm">
                      <p className="font-mono font-semibold">{pickedHex}</p>
                      <p className="text-muted-foreground">
                        rgb({picked.r}, {picked.g}, {picked.b})
                      </p>
                      <p className="text-muted-foreground">{rgbToHsl(picked.r, picked.g, picked.b)}</p>
                      <p className="text-xs text-muted-foreground">
                        at pixel ({picked.x}, {picked.y})
                      </p>
                    </div>
                  </div>
                  <button type="button" onClick={() => void copy(pickedHex)} className="mt-3 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-accent">
                    {copied === pickedHex ? 'Copied!' : `Copy ${pickedHex}`}
                  </button>
                </div>
              ) : (
                <p className="mt-2 text-sm text-muted-foreground">No colour picked yet.</p>
              )}
            </div>
            <div className="rounded-xl border border-border bg-card p-4">
              <h3 className="text-sm font-semibold">Dominant palette</h3>
              <button type="button" onClick={extract} className="mt-3 rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800">
                Extract palette
              </button>
              {palette && (
                <ul className="mt-3 space-y-1.5">
                  {palette.map((c) => (
                    <li key={c.hex}>
                      <button
                        type="button"
                        onClick={() => void copy(c.hex)}
                        className="flex w-full items-center gap-3 rounded-lg border border-border px-2.5 py-1.5 text-left text-sm hover:bg-accent"
                        title="Copy hex"
                      >
                        <span className="h-7 w-7 shrink-0 rounded border border-border" style={{ background: c.hex }} />
                        <span className="font-mono font-medium">{c.hex}</span>
                        <span className="ml-auto text-xs text-muted-foreground">
                          {copied === c.hex ? 'Copied!' : `${Math.round(c.share * 100)}% of image`}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <p className="mt-2 text-xs text-muted-foreground">
                Palette colours are averaged from colour buckets in the image, weighted toward
                vivid colours — click any swatch to copy its hex.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
