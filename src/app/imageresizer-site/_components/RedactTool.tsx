'use client';

/**
 * Blur / pixelate / redact regions: draw rectangles over the parts of an
 * image that must not be shared (faces, plates, addresses, screens), pick
 * a treatment per region, and export. Drag on empty space to draw a
 * region; drag inside a region to move it.
 */
import { useRef, useState } from 'react';
import { browserEnv } from '../_lib/engine/canvas-env';
import { applyRedactions, type RedactMode, type RedactRegion } from '../_lib/engine/redact';
import { encodeCanvasOutput } from '../_lib/encode-output';
import { buildOutputName } from '../_lib/engine/naming';
import { EXT_BY_FORMAT, type OutputFormat } from '../_lib/engine/types';
import { FileDrop } from './FileDrop';
import { ResultPanel } from './ResultPanel';
import { useImageLoader, useResultImage } from './use-image-loader';

interface DragState {
  kind: 'create' | 'move';
  index?: number;
  startX: number;
  startY: number;
  orig?: RedactRegion;
}

const MODE_FILL: Record<RedactMode, string> = {
  blur: 'rgba(59,130,246,0.35)',
  pixelate: 'rgba(234,179,8,0.4)',
  solid: 'rgba(0,0,0,0.75)',
};

export default function RedactTool() {
  const { loaded, loading, error, load, setError } = useImageLoader();
  const { result, setResult } = useResultImage();
  const [regions, setRegions] = useState<RedactRegion[]>([]);
  const [defaultMode, setDefaultMode] = useState<RedactMode>('blur');
  const [format, setFormat] = useState<OutputFormat>('jpeg');
  const [busy, setBusy] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState | null>(null);
  const [dragPreview, setDragPreview] = useState<RedactRegion | null>(null);

  const toFraction = (e: React.PointerEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width)),
      y: Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height)),
    };
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (!loaded) return;
    const p = toFraction(e);
    // Topmost region under the pointer → move it; otherwise draw a new one.
    const hitIndex = [...regions].reverse().findIndex((r) => p.x >= r.x && p.x <= r.x + r.w && p.y >= r.y && p.y <= r.y + r.h);
    if (hitIndex >= 0) {
      const index = regions.length - 1 - hitIndex;
      dragRef.current = { kind: 'move', index, startX: p.x, startY: p.y, orig: regions[index] };
    } else {
      dragRef.current = { kind: 'create', startX: p.x, startY: p.y };
      setDragPreview({ x: p.x, y: p.y, w: 0, h: 0, mode: defaultMode, strength: defaultMode === 'pixelate' ? 14 : 12 });
    }
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const drag = dragRef.current;
    if (!drag) return;
    const p = toFraction(e);
    if (drag.kind === 'create') {
      setDragPreview({
        x: Math.min(drag.startX, p.x),
        y: Math.min(drag.startY, p.y),
        w: Math.abs(p.x - drag.startX),
        h: Math.abs(p.y - drag.startY),
        mode: defaultMode,
        strength: defaultMode === 'pixelate' ? 14 : 12,
      });
    } else if (drag.kind === 'move' && drag.orig && drag.index !== undefined) {
      const dx = p.x - drag.startX;
      const dy = p.y - drag.startY;
      const moved: RedactRegion = {
        ...drag.orig,
        x: Math.min(1 - drag.orig.w, Math.max(0, drag.orig.x + dx)),
        y: Math.min(1 - drag.orig.h, Math.max(0, drag.orig.y + dy)),
      };
      setRegions((rs) => rs.map((r, i) => (i === drag.index ? moved : r)));
    }
  };

  const onPointerUp = () => {
    if (dragRef.current?.kind === 'create' && dragPreview && dragPreview.w > 0.01 && dragPreview.h > 0.01) {
      setRegions((rs) => [...rs, dragPreview]);
    }
    dragRef.current = null;
    setDragPreview(null);
  };

  const process = async () => {
    if (!loaded) return;
    setBusy(true);
    setError(null);
    try {
      const canvas = applyRedactions(browserEnv, loaded.decoded.surface, regions);
      const blob = await encodeCanvasOutput(canvas, format, 0.95);
      setResult({
        blob,
        filename: buildOutputName(
          '{name}-redacted',
          { originalName: loaded.name, width: canvas.width, height: canvas.height, format },
          EXT_BY_FORMAT[format]
        ),
        width: canvas.width,
        height: canvas.height,
        note: `${regions.length} region${regions.length === 1 ? '' : 's'} treated. Redaction is baked into the pixels — check the whole image before sharing.`,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Redaction failed.');
    } finally {
      setBusy(false);
    }
  };

  const shown = dragPreview ? [...regions, dragPreview] : regions;

  return (
    <div className="w-full min-w-0">
      <FileDrop
        onFiles={(files) => {
          setRegions([]);
          setResult(null);
          void load(files);
        }}
        label="Drop an image to blur or hide sensitive parts"
      />
      {error && (
        <p role="alert" className="mt-4 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm">
          {error}
        </p>
      )}
      {loading && <p className="mt-4 text-sm text-muted-foreground">Loading image…</p>}
      {loaded && (
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0">
            <div
              ref={containerRef}
              className="relative mx-auto w-full max-w-3xl touch-none select-none overflow-hidden rounded-xl bg-slate-100"
              style={{ aspectRatio: `${loaded.decoded.width} / ${loaded.decoded.height}` }}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              role="application"
              aria-label="Redaction canvas: drag to draw a region, drag inside a region to move it"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={loaded.previewUrl} alt="Image being redacted" className="absolute inset-0 h-full w-full object-contain" draggable={false} />
              {shown.map((r, i) => (
                <div
                  key={i}
                  className="pointer-events-none absolute border-2 border-white/90"
                  style={{
                    left: `${r.x * 100}%`,
                    top: `${r.y * 100}%`,
                    width: `${r.w * 100}%`,
                    height: `${r.h * 100}%`,
                    background: MODE_FILL[r.mode],
                  }}
                >
                  <span className="absolute top-0 left-0 bg-black/60 px-1 text-[10px] font-semibold text-white">
                    {i + 1} · {r.mode}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-2 text-center text-xs text-muted-foreground">
              Drag on empty space to draw a region. Drag inside a region to move it.
            </p>
          </div>
          <div className="min-w-0 rounded-xl border border-border bg-card p-4 sm:p-5">
            <label className="block">
              <span className="text-xs font-medium">New region treatment</span>
              <select value={defaultMode} onChange={(e) => setDefaultMode(e.target.value as RedactMode)} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm">
                <option value="blur">Blur</option>
                <option value="pixelate">Pixelate</option>
                <option value="solid">Solid black</option>
              </select>
            </label>
            <ul className="mt-4 space-y-2">
              {regions.map((r, i) => (
                <li key={i} className="rounded-lg border border-border p-2.5 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Region {i + 1}</span>
                    <select
                      value={r.mode}
                      onChange={(e) => setRegions((rs) => rs.map((x, j) => (j === i ? { ...x, mode: e.target.value as RedactMode } : x)))}
                      className="ml-auto rounded border border-border bg-background px-1.5 py-1 text-xs"
                      aria-label={`Treatment for region ${i + 1}`}
                    >
                      <option value="blur">Blur</option>
                      <option value="pixelate">Pixelate</option>
                      <option value="solid">Solid</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => setRegions((rs) => rs.filter((_, j) => j !== i))}
                      className="rounded border border-border px-1.5 py-1 text-xs hover:bg-accent"
                      aria-label={`Delete region ${i + 1}`}
                    >
                      ✕
                    </button>
                  </div>
                  {r.mode !== 'solid' && (
                    <label className="mt-2 block">
                      <span className="text-xs text-muted-foreground">Strength · {r.strength}px</span>
                      <input
                        type="range"
                        min={4}
                        max={40}
                        value={r.strength}
                        onChange={(e) => setRegions((rs) => rs.map((x, j) => (j === i ? { ...x, strength: Number(e.target.value) } : x)))}
                        className="w-full accent-blue-700"
                        aria-label={`Strength for region ${i + 1}`}
                      />
                    </label>
                  )}
                </li>
              ))}
              {regions.length === 0 && <li className="text-sm text-muted-foreground">No regions yet — draw one on the image.</li>}
            </ul>
            <label className="mt-4 block">
              <span className="text-xs font-medium">Output format</span>
              <select value={format} onChange={(e) => setFormat(e.target.value as OutputFormat)} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm">
                <option value="jpeg">JPG</option>
                <option value="png">PNG</option>
                <option value="webp">WebP</option>
              </select>
            </label>
            <button
              type="button"
              onClick={() => void process()}
              disabled={busy || regions.length === 0}
              className="mt-4 w-full rounded-lg bg-blue-700 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-50"
            >
              {busy ? 'Working…' : 'Apply redaction'}
            </button>
            {result && (
              <div className="mt-4">
                <ResultPanel result={result} originalSizeBytes={loaded.sizeBytes} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
