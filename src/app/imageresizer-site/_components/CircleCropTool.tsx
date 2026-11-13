'use client';

/**
 * Circle crop: square-crop a photo with zoom/position controls and cut it
 * to a true circle with transparent corners (PNG/WebP out). Used for
 * avatars, profile pictures and round stickers everywhere — and honest
 * about formats: JPG cannot do transparency, so it is not offered.
 */
import { useMemo, useState } from 'react';
import { browserEnv } from '../_lib/engine/canvas-env';
import { cropImage } from '../_lib/engine/crop';
import { renderResize } from '../_lib/engine/resize';
import { roundCorners } from '../_lib/engine/effects';
import { encodeCanvasOutput } from '../_lib/encode-output';
import { buildOutputName } from '../_lib/engine/naming';
import { FileDrop } from './FileDrop';
import { ResultPanel } from './ResultPanel';
import { useImageLoader, useResultImage } from './use-image-loader';

export default function CircleCropTool() {
  const { loaded, loading, error, load, setError } = useImageLoader();
  const { result, setResult } = useResultImage();
  const [scale, setScale] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [size, setSize] = useState(800);
  const [busy, setBusy] = useState(false);

  const rect = useMemo(() => {
    if (!loaded) return null;
    const { width: sw, height: sh } = loaded.decoded;
    const side = Math.min(sw, sh) / scale;
    const slackX = sw - side;
    const slackY = sh - side;
    return {
      x: (slackX / 2) * (1 + offsetX / 50),
      y: (slackY / 2) * (1 + offsetY / 50),
      width: side,
      height: side,
    };
  }, [loaded, scale, offsetX, offsetY]);

  const process = async () => {
    if (!loaded || !rect) return;
    setBusy(true);
    setError(null);
    try {
      const cropped = cropImage(browserEnv, loaded.decoded.surface, rect);
      const sized = renderResize(browserEnv, cropped, { targetWidth: size, targetHeight: size });
      const circled = roundCorners(browserEnv, sized, size / 2);
      const blob = await encodeCanvasOutput(circled, 'png', 1);
      setResult({
        blob,
        filename: buildOutputName('{name}-circle', { originalName: loaded.name, width: size, height: size, format: 'png' }, 'png'),
        width: size,
        height: size,
        note: 'PNG with transparent corners — the circle is real transparency, not a white background.',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Circle crop failed.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="w-full min-w-0">
      <FileDrop onFiles={load} label="Drop an image to crop into a circle" />
      {error && (
        <p role="alert" className="mt-4 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm">{error}</p>
      )}
      {loading && <p className="mt-4 text-sm text-muted-foreground">Loading image…</p>}
      {loaded && (
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="min-w-0 rounded-xl border border-border bg-card p-4 sm:p-5">
            <div className="relative mx-auto aspect-square w-full max-w-80 overflow-hidden rounded-full border-2 border-dashed border-blue-700/60">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={loaded.previewUrl}
                alt="Circle crop positioning preview"
                className="absolute inset-0 h-full w-full object-cover"
                style={{ transform: `scale(${scale}) translate(${-offsetX / 4}%, ${-offsetY / 4}%)` }}
              />
            </div>
            <p className="mt-2 text-center text-xs text-muted-foreground">Guide preview — the export below is rendered exactly.</p>
            <div className="mt-4 space-y-3">
              <label className="block">
                <span className="text-xs font-medium">Zoom · {scale.toFixed(2)}×</span>
                <input type="range" min={100} max={300} value={Math.round(scale * 100)} onChange={(e) => setScale(Number(e.target.value) / 100)} className="mt-1 w-full accent-blue-700" />
              </label>
              <label className="block">
                <span className="text-xs font-medium">Move left / right</span>
                <input type="range" min={-50} max={50} value={offsetX} onChange={(e) => setOffsetX(Number(e.target.value))} className="mt-1 w-full accent-blue-700" />
              </label>
              <label className="block">
                <span className="text-xs font-medium">Move up / down</span>
                <input type="range" min={-50} max={50} value={offsetY} onChange={(e) => setOffsetY(Number(e.target.value))} className="mt-1 w-full accent-blue-700" />
              </label>
              <label className="block">
                <span className="text-xs font-medium">Output size (px)</span>
                <select value={size} onChange={(e) => setSize(Number(e.target.value))} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm">
                  {[256, 512, 800, 1024, 2048].map((s) => (
                    <option key={s} value={s}>{s}×{s}</option>
                  ))}
                </select>
              </label>
              <button type="button" onClick={() => void process()} disabled={busy} className="w-full rounded-lg bg-blue-700 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-50">
                {busy ? 'Working…' : 'Create circle image (PNG)'}
              </button>
            </div>
          </div>
          <div className="min-w-0 rounded-xl border border-border bg-card p-4 sm:p-5">
            <h3 className="text-sm font-semibold">Result</h3>
            {result ? (
              <div className="mt-3">
                <div className="rounded-xl bg-[repeating-conic-gradient(#e5e7eb_0%_25%,#ffffff_0%_50%)] bg-[length:16px_16px] p-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={result.url} alt="Circular cropped result on a transparency checkerboard" className="mx-auto block max-h-64 w-auto max-w-full" />
                </div>
                <div className="mt-3">
                  <ResultPanel result={result} originalSizeBytes={loaded.sizeBytes} />
                </div>
              </div>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">The circular image appears here on a checkerboard so you can see the transparency is real.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
