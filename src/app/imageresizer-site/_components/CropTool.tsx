'use client';

import { useRef, useState } from 'react';
import { browserEnv } from '../_lib/engine/canvas-env';
import { cropImage, type CropRect } from '../_lib/engine/crop';
import { encodeCanvasOutput } from '../_lib/encode-output';
import { buildOutputName } from '../_lib/engine/naming';
import { EXT_BY_FORMAT, type OutputFormat } from '../_lib/engine/types';
import { formatBytes } from '../_lib/format';
import { FileDrop } from './FileDrop';
import { FormatSelect, ResultPanel, STANDARD_FORMATS } from './ResultPanel';
import { useImageLoader, useResultImage } from './use-image-loader';

interface FracRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

type Handle = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w';

const HANDLES: Array<{ id: Handle; className: string; cursor: string }> = [
  { id: 'nw', className: 'left-0 top-0 -translate-x-1/2 -translate-y-1/2', cursor: 'nwse-resize' },
  { id: 'n', className: 'left-1/2 top-0 -translate-x-1/2 -translate-y-1/2', cursor: 'ns-resize' },
  { id: 'ne', className: 'right-0 top-0 translate-x-1/2 -translate-y-1/2', cursor: 'nesw-resize' },
  { id: 'e', className: 'right-0 top-1/2 translate-x-1/2 -translate-y-1/2', cursor: 'ew-resize' },
  { id: 'se', className: 'right-0 bottom-0 translate-x-1/2 translate-y-1/2', cursor: 'nwse-resize' },
  { id: 's', className: 'left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2', cursor: 'ns-resize' },
  { id: 'sw', className: 'left-0 bottom-0 -translate-x-1/2 translate-y-1/2', cursor: 'nesw-resize' },
  { id: 'w', className: 'left-0 top-1/2 -translate-x-1/2 -translate-y-1/2', cursor: 'ew-resize' },
];

const RATIOS: Array<{ label: string; value: number | null }> = [
  { label: 'Free', value: null },
  { label: '1:1', value: 1 },
  { label: '4:3', value: 4 / 3 },
  { label: '3:2', value: 3 / 2 },
  { label: '16:9', value: 16 / 9 },
  { label: '3:4', value: 3 / 4 },
  { label: '2:3', value: 2 / 3 },
  { label: '9:16', value: 9 / 16 },
];

const MIN_SIZE = 0.02;

function clampRect(r: FracRect): FracRect {
  const w = Math.min(1, Math.max(MIN_SIZE, r.w));
  const h = Math.min(1, Math.max(MIN_SIZE, r.h));
  const x = Math.min(Math.max(0, r.x), 1 - w);
  const y = Math.min(Math.max(0, r.y), 1 - h);
  return { x, y, w, h };
}

export function CropTool() {
  const { loaded, loading, error, load, setError } = useImageLoader();
  const { result, setResult } = useResultImage();
  const [rect, setRect] = useState<FracRect>({ x: 0.1, y: 0.1, w: 0.8, h: 0.8 });
  const [ratio, setRatio] = useState<number | null>(null);
  const [format, setFormat] = useState<OutputFormat>('png');
  const [quality, setQuality] = useState(0.92);
  const [busy, setBusy] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    mode: Handle | 'move' | 'create';
    startX: number;
    startY: number;
    startRect: FracRect;
    boxW: number;
    boxH: number;
  } | null>(null);

  const decoded = loaded?.decoded;
  const srcW = decoded?.width ?? 0;
  const srcH = decoded?.height ?? 0;
  const px = {
    x: Math.round(rect.x * srcW),
    y: Math.round(rect.y * srcH),
    w: Math.max(1, Math.round(rect.w * srcW)),
    h: Math.max(1, Math.round(rect.h * srcH)),
  };

  const applyRatio = (next: FracRect, imageAspect: number): FracRect => {
    if (ratio === null) return next;
    // ratio is width/height in *displayed* terms: convert via image aspect.
    const targetH = next.w / (ratio / imageAspect);
    return { ...next, h: targetH };
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const wrap = wrapRef.current;
    if (!wrap || !decoded) return;
    const box = wrap.getBoundingClientRect();
    const fx = (e.clientX - box.left) / box.width;
    const fy = (e.clientY - box.top) / box.height;
    const handle = (e.target as HTMLElement).dataset.handle as Handle | undefined;
    let mode: Handle | 'move' | 'create';
    if (handle) mode = handle;
    else if (fx >= rect.x && fx <= rect.x + rect.w && fy >= rect.y && fy <= rect.y + rect.h) mode = 'move';
    else mode = 'create';
    dragRef.current = {
      mode,
      startX: fx,
      startY: fy,
      startRect: mode === 'create' ? { x: fx, y: fy, w: MIN_SIZE, h: MIN_SIZE } : rect,
      boxW: box.width,
      boxH: box.height,
    };
    if (mode === 'create') setRect({ x: fx, y: fy, w: MIN_SIZE, h: MIN_SIZE });
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    const wrap = wrapRef.current;
    if (!drag || !wrap || !decoded) return;
    const box = wrap.getBoundingClientRect();
    const fx = (e.clientX - box.left) / box.width;
    const fy = (e.clientY - box.top) / box.height;
    const dx = fx - drag.startX;
    const dy = fy - drag.startY;
    const s = drag.startRect;
    const imageAspect = decoded.width / decoded.height;
    let next: FracRect;

    switch (drag.mode) {
      case 'move':
        next = { ...s, x: s.x + dx, y: s.y + dy };
        break;
      case 'create': {
        const x = Math.min(drag.startX, fx);
        const y = Math.min(drag.startY, fy);
        next = { x, y, w: Math.abs(fx - drag.startX), h: Math.abs(fy - drag.startY) };
        next = applyRatio(next, imageAspect);
        break;
      }
      case 'e':
        next = { ...s, w: s.w + dx };
        next = applyRatio(next, imageAspect);
        break;
      case 's':
        next = { ...s, h: s.h + dy };
        if (ratio !== null) next = { ...next, w: next.h * (ratio / imageAspect) };
        break;
      case 'w': {
        const newX = Math.min(s.x + dx, s.x + s.w - MIN_SIZE);
        next = { ...s, x: newX, w: s.w - (newX - s.x) };
        next = applyRatio(next, imageAspect);
        next = { ...next, x: s.x + s.w - next.w, y: next.y };
        break;
      }
      case 'n': {
        const newY = Math.min(s.y + dy, s.y + s.h - MIN_SIZE);
        next = { ...s, y: newY, h: s.h - (newY - s.y) };
        if (ratio !== null) next = { ...next, w: next.h * (ratio / imageAspect) };
        break;
      }
      case 'se':
        next = { ...s, w: s.w + dx, h: s.h + dy };
        if (ratio !== null) next = applyRatio(next, imageAspect);
        break;
      case 'sw': {
        const newX = Math.min(s.x + dx, s.x + s.w - MIN_SIZE);
        next = { ...s, x: newX, w: s.w - (newX - s.x), h: s.h + dy };
        if (ratio !== null) {
          next = applyRatio(next, imageAspect);
          next = { ...next, x: s.x + s.w - next.w };
        }
        break;
      }
      case 'ne': {
        const newY = Math.min(s.y + dy, s.y + s.h - MIN_SIZE);
        next = { ...s, y: newY, w: s.w + dx, h: s.h - (newY - s.y) };
        if (ratio !== null) {
          next = { ...next, w: next.h * (ratio / imageAspect), y: s.y + s.h - next.h };
        }
        break;
      }
      case 'nw': {
        const newX = Math.min(s.x + dx, s.x + s.w - MIN_SIZE);
        const newY = Math.min(s.y + dy, s.y + s.h - MIN_SIZE);
        next = { x: newX, y: newY, w: s.w - (newX - s.x), h: s.h - (newY - s.y) };
        if (ratio !== null) {
          next = { ...next, h: next.w / (ratio / imageAspect), x: s.x + s.w - next.w, y: s.y + s.h - next.h };
        }
        break;
      }
      default:
        next = s;
    }
    setRect(clampRect(next));
  };

  const onPointerUp = () => {
    dragRef.current = null;
  };

  const setPx = (field: keyof typeof px, value: number) => {
    if (!decoded || !Number.isFinite(value)) return;
    const nextPx = { ...px, [field]: value };
    setRect(
      clampRect({
        x: nextPx.x / srcW,
        y: nextPx.y / srcH,
        w: nextPx.w / srcW,
        h: nextPx.h / srcH,
      })
    );
  };

  const onCropKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 0.05 : 0.01;
    let next: FracRect | null = null;
    if (e.key === 'ArrowLeft') next = { ...rect, x: rect.x - step };
    else if (e.key === 'ArrowRight') next = { ...rect, x: rect.x + step };
    else if (e.key === 'ArrowUp') next = { ...rect, y: rect.y - step };
    else if (e.key === 'ArrowDown') next = { ...rect, y: rect.y + step };
    if (next) {
      e.preventDefault();
      setRect(clampRect(next));
    }
  };

  const process = async () => {
    if (!loaded || !decoded) return;
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const sourceRect: CropRect = {
        x: rect.x * decoded.width,
        y: rect.y * decoded.height,
        width: rect.w * decoded.width,
        height: rect.h * decoded.height,
      };
      const canvas = cropImage(browserEnv, decoded.surface, sourceRect, format === 'jpeg' ? '#ffffff' : undefined);
      const blob = await encodeCanvasOutput(canvas, format, quality);
      setResult({
        blob,
        filename: buildOutputName(
          '{name}-cropped-{w}x{h}',
          { originalName: loaded.name, width: canvas.width, height: canvas.height, format },
          EXT_BY_FORMAT[format]
        ),
        width: canvas.width,
        height: canvas.height,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Cropping failed.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="w-full min-w-0">
      <FileDrop onFiles={load} label="Drop an image to crop" />
      {error && (
        <p role="alert" className="mt-4 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm">
          {error}
        </p>
      )}
      {loading && <p className="mt-4 text-sm text-muted-foreground">Loading image…</p>}

      {loaded && decoded && (
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px] min-w-0">
          <div className="min-w-0 rounded-xl border border-border bg-card p-4 sm:p-5">
            <div
              ref={wrapRef}
              className="relative inline-block max-w-full touch-none select-none"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- local object URL preview */}
              <img
                src={loaded.previewUrl}
                alt="Image being cropped"
                draggable={false}
                className="block max-w-full max-h-[55vh] w-auto h-auto rounded-md"
              />
              <div
                role="application"
                aria-label={`Crop selection: x ${px.x}, y ${px.y}, width ${px.w}, height ${px.h} pixels. Arrow keys move the selection.`}
                tabIndex={0}
                onKeyDown={onCropKeyDown}
                className="absolute border-2 border-primary shadow-[0_0_0_9999px_rgba(0,0,0,0.45)] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                style={{
                  left: `${rect.x * 100}%`,
                  top: `${rect.y * 100}%`,
                  width: `${rect.w * 100}%`,
                  height: `${rect.h * 100}%`,
                }}
              >
                <div className="absolute inset-y-0 left-1/3 w-px bg-white/40" aria-hidden />
                <div className="absolute inset-y-0 left-2/3 w-px bg-white/40" aria-hidden />
                <div className="absolute inset-x-0 top-1/3 h-px bg-white/40" aria-hidden />
                <div className="absolute inset-x-0 top-2/3 h-px bg-white/40" aria-hidden />
                {HANDLES.map((h) => (
                  <span
                    key={h.id}
                    data-handle={h.id}
                    aria-hidden
                    className={`absolute w-[18px] h-[18px] rounded-[4px] bg-white border-2 border-primary shadow ${h.className}`}
                    style={{ cursor: h.cursor }}
                  />
                ))}
              </div>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Drag the frame to move it, pull a handle to resize, or drag anywhere else to draw a new selection.
              Focus the frame and use arrow keys for fine adjustments.
            </p>
          </div>

          <div className="min-w-0 rounded-xl border border-border bg-card p-4 sm:p-5">
            <h3 className="font-semibold text-sm">Crop settings</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Source: {srcW}×{srcH} · {formatBytes(loaded.sizeBytes)}
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {RATIOS.map((r) => (
                <button
                  key={r.label}
                  type="button"
                  aria-pressed={ratio === r.value}
                  onClick={() => {
                    setRatio(r.value);
                    const ratioValue = r.value;
                    if (ratioValue !== null && decoded) {
                      const imageAspect = decoded.width / decoded.height;
                      setRect((cur) => clampRect({ ...cur, h: cur.w / (ratioValue / imageAspect) }));
                    }
                  }}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium border transition-colors ${
                    ratio === r.value ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:border-primary/50'
                  }`}
                >
                  {r.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  setRatio(decoded ? decoded.width / decoded.height : null);
                  if (decoded) setRect({ x: 0, y: 0, w: 1, h: 1 });
                }}
                className="rounded-md px-2.5 py-1 text-xs font-medium border border-border hover:border-primary/50 transition-colors"
              >
                Full image
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              {(
                [
                  ['x', 'X (px)'],
                  ['y', 'Y (px)'],
                  ['w', 'Width (px)'],
                  ['h', 'Height (px)'],
                ] as Array<[keyof typeof px, string]>
              ).map(([field, label]) => (
                <label key={field} className="block">
                  <span className="text-xs font-medium">{label}</span>
                  <input
                    type="number"
                    min={field === 'w' || field === 'h' ? 1 : 0}
                    value={px[field]}
                    onChange={(e) => setPx(field, parseInt(e.target.value, 10))}
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  />
                </label>
              ))}
            </div>

            <div className="mt-4 space-y-4">
              <FormatSelect value={format} onChange={(f) => setFormat(f as OutputFormat)} formats={[...STANDARD_FORMATS, { value: 'gif', label: 'GIF' }]} />
              {(format === 'jpeg' || format === 'webp' || format === 'avif') && (
                <label className="block">
                  <span className="text-xs font-medium">Quality: {Math.round(quality * 100)}%</span>
                  <input
                    type="range"
                    min={10}
                    max={100}
                    value={Math.round(quality * 100)}
                    onChange={(e) => setQuality(parseInt(e.target.value, 10) / 100)}
                    className="mt-1.5 w-full"
                  />
                </label>
              )}
              <button
                type="button"
                onClick={process}
                disabled={busy}
                className="w-full rounded-lg bg-primary text-primary-foreground px-4 py-3 text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {busy ? 'Cropping…' : `Crop to ${px.w}×${px.h}`}
              </button>
            </div>

            {result && (
              <div className="mt-5">
                <ResultPanel result={result} originalSizeBytes={loaded.sizeBytes} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
