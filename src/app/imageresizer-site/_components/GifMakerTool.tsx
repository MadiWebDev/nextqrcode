'use client';

/**
 * GIF maker: turn a sequence of images into an animated GIF with a
 * per-frame delay and loop control (gifenc encoder, loaded on demand).
 * Frames are cover-resized to a common size based on the first frame's
 * aspect, so mixed inputs produce a clean animation.
 */
import { useState } from 'react';
import { browserEnv } from '../_lib/engine/canvas-env';
import { decodeImage } from '../_lib/engine/decode';
import { renderResize } from '../_lib/engine/resize';
import { encodeGif } from '../_lib/engine/gif';
import { downloadBlob } from '../_lib/engine/export';
import { formatBytes } from '../_lib/format';
import { FileDrop } from './FileDrop';

interface FrameItem {
  id: number;
  file: File;
  thumbUrl: string;
}

let nextId = 1;

export default function GifMakerTool() {
  const [frames, setFrames] = useState<FrameItem[]>([]);
  const [delayMs, setDelayMs] = useState(500);
  const [repeat, setRepeat] = useState(0);
  const [width, setWidth] = useState(0); // 0 = first frame's width
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ url: string; size: number; w: number; h: number } | null>(null);

  const addFiles = (files: File[]) => {
    setFrames((prev) => [
      ...prev,
      ...files.map((file) => ({ id: nextId++, file, thumbUrl: URL.createObjectURL(file) })),
    ]);
  };

  const move = (index: number, dir: -1 | 1) =>
    setFrames((prev) => {
      const target = index + dir;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });

  const create = async () => {
    if (frames.length < 2) {
      setError('Add at least two images — a GIF needs frames to animate.');
      return;
    }
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const decodedFrames = [];
      let targetW = 0;
      let targetH = 0;
      for (const item of frames) {
        const decoded = await decodeImage(browserEnv, item.file);
        try {
          if (targetW === 0) {
            targetW = width > 0 ? width : decoded.width;
            targetH = Math.max(1, Math.round((targetW * decoded.height) / decoded.width));
          }
          const canvas = renderResize(browserEnv, decoded.surface, {
            targetWidth: targetW,
            targetHeight: targetH,
            fit: 'cover',
          });
          const pixels = canvas.getContext('2d').getImageData(0, 0, targetW, targetH);
          decodedFrames.push({ pixels: pixels.data, delayMs });
        } finally {
          decoded.release();
        }
      }
      const blob = await encodeGif(decodedFrames, targetW, targetH, { repeat });
      setResult({ url: URL.createObjectURL(blob), size: blob.size, w: targetW, h: targetH });
      downloadBlob(blob, 'animation.gif');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'GIF creation failed.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="w-full min-w-0">
      <FileDrop onFiles={addFiles} multiple label="Drop images to turn into an animated GIF" />
      {error && (
        <p role="alert" className="mt-4 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm">{error}</p>
      )}
      {frames.length > 0 && (
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          <ol className="min-w-0 space-y-2">
            {frames.map((frame, i) => (
              <li key={frame.id} className="flex items-center gap-3 rounded-xl border border-border bg-card p-2.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={frame.thumbUrl} alt="" className="h-12 w-12 rounded-lg object-cover" />
                <span className="min-w-0 flex-1 truncate text-sm">
                  Frame {i + 1} · <span className="text-muted-foreground">{frame.file.name}</span>
                </span>
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="rounded border border-border px-2 py-1 text-xs hover:bg-accent disabled:opacity-40" aria-label="Move earlier">↑</button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === frames.length - 1} className="rounded border border-border px-2 py-1 text-xs hover:bg-accent disabled:opacity-40" aria-label="Move later">↓</button>
                <button
                  type="button"
                  onClick={() => {
                    URL.revokeObjectURL(frame.thumbUrl);
                    setFrames((prev) => prev.filter((f) => f.id !== frame.id));
                  }}
                  className="rounded border border-border px-2 py-1 text-xs hover:bg-accent"
                  aria-label="Remove frame"
                >
                  ✕
                </button>
              </li>
            ))}
          </ol>
          <div className="min-w-0 rounded-xl border border-border bg-card p-4 sm:p-5">
            <label className="block">
              <span className="text-xs font-medium">Frame delay · {delayMs}ms</span>
              <input type="range" min={50} max={2000} step={10} value={delayMs} onChange={(e) => setDelayMs(Number(e.target.value))} className="mt-1 w-full accent-blue-700" aria-label="Frame delay in milliseconds" />
              <span className="text-xs text-muted-foreground">1000ms = 1 second per frame. 100–200ms feels like smooth motion.</span>
            </label>
            <label className="mt-4 block">
              <span className="text-xs font-medium">Loop</span>
              <select value={repeat} onChange={(e) => setRepeat(Number(e.target.value))} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm">
                <option value={0}>Forever</option>
                <option value={1}>Once</option>
                <option value={3}>3 times</option>
                <option value={5}>5 times</option>
              </select>
            </label>
            <label className="mt-4 block">
              <span className="text-xs font-medium">Width</span>
              <select value={width} onChange={(e) => setWidth(Number(e.target.value))} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm">
                <option value={0}>Original (first frame)</option>
                <option value={800}>800px</option>
                <option value={500}>500px</option>
                <option value={320}>320px (small file)</option>
              </select>
            </label>
            <button type="button" onClick={() => void create()} disabled={busy || frames.length < 2} className="mt-5 w-full rounded-lg bg-blue-700 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-50">
              {busy ? 'Encoding GIF…' : `Create GIF (${frames.length} frames)`}
            </button>
            {result && (
              <div className="mt-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={result.url} alt="Your animated GIF" className="block w-full rounded-lg border border-border" />
                <p className="mt-2 text-sm text-muted-foreground">
                  {result.w}×{result.h} · {formatBytes(result.size)} — the download has already
                  started; use the preview above to check the motion.
                </p>
              </div>
            )}
            <p className="mt-3 text-xs text-muted-foreground">
              GIFs hold at most 256 colours per frame — photos may band slightly. For smooth
              photographic motion, a short WebP or MP4 is usually smaller; GIF wins on universal
              support.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
