'use client';

import { useEffect, useRef, useState } from 'react';
import { FlipHorizontal2, FlipVertical2, RotateCcw, RotateCw } from 'lucide-react';
import { browserEnv } from '../_lib/engine/canvas-env';
import { flipImage, rotateImage } from '../_lib/engine/crop';
import { encodeCanvasOutput } from '../_lib/encode-output';
import { buildOutputName } from '../_lib/engine/naming';
import { EXT_BY_FORMAT, type OutputFormat } from '../_lib/engine/types';
import { formatBytes } from '../_lib/format';
import { FileDrop } from './FileDrop';
import { FormatSelect, ResultPanel, STANDARD_FORMATS } from './ResultPanel';
import { useImageLoader, useResultImage } from './use-image-loader';

/**
 * Rotate + flip tool. One component powers both routes (/rotate-image
 * emphasises turns + free angle, /flip-image emphasises mirroring) — the
 * operations are one pipeline: rotate, then flip, rendered live so the
 * preview is always the true export.
 */
export function RotateFlipTool({ variant }: { variant: 'rotate' | 'flip' }) {
  const { loaded, loading, error, load, setError } = useImageLoader();
  const { result, setResult } = useResultImage();
  const [angle, setAngle] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [format, setFormat] = useState<OutputFormat>('png');
  const [quality, setQuality] = useState(0.92);
  const [background, setBackground] = useState('#ffffff');
  const [busy, setBusy] = useState(false);
  const runRef = useRef(0);

  // Live-render whenever the transform or inputs change.
  useEffect(() => {
    if (!loaded) return;
    const run = ++runRef.current;
    const timer = setTimeout(async () => {
      setBusy(true);
      try {
        let canvas = rotateImage(browserEnv, loaded.decoded.surface, angle, format === 'jpeg' ? background : undefined);
        if (flipH || flipV) canvas = flipImage(browserEnv, canvas, flipH, flipV);
        const blob = await encodeCanvasOutput(canvas, format, quality);
        if (run !== runRef.current) return;
        setResult({
          blob,
          filename: buildOutputName(
            '{name}-edited',
            { originalName: loaded.name, format },
            EXT_BY_FORMAT[format]
          ),
          width: canvas.width,
          height: canvas.height,
        });
      } catch (err) {
        if (run === runRef.current) setError(err instanceof Error ? err.message : 'Transform failed.');
      } finally {
        if (run === runRef.current) setBusy(false);
      }
    }, 120);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, angle, flipH, flipV, format, quality, background]);

  const turn = (delta: number) => setAngle((a) => (((a + delta) % 360) + 360) % 360);

  return (
    <div className="w-full min-w-0">
      <FileDrop onFiles={load} label={variant === 'rotate' ? 'Drop an image to rotate' : 'Drop an image to flip'} />
      {error && (
        <p role="alert" className="mt-4 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm">
          {error}
        </p>
      )}
      {loading && <p className="mt-4 text-sm text-muted-foreground">Loading image…</p>}

      {loaded && (
        <div className="mt-6 grid gap-6 lg:grid-cols-2 min-w-0">
          <div className="min-w-0 rounded-xl border border-border bg-card p-4 sm:p-5">
            <h3 className="font-semibold text-sm">Controls</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              {loaded.decoded.width}×{loaded.decoded.height} · {formatBytes(loaded.sizeBytes)} ·{' '}
              {loaded.decoded.format.toUpperCase()}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" onClick={() => turn(-90)} className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium hover:border-primary/60 transition-colors">
                <RotateCcw className="w-4 h-4" /> 90° left
              </button>
              <button type="button" onClick={() => turn(90)} className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium hover:border-primary/60 transition-colors">
                <RotateCw className="w-4 h-4" /> 90° right
              </button>
              <button type="button" onClick={() => turn(180)} className="rounded-lg border border-border px-3 py-2 text-sm font-medium hover:border-primary/60 transition-colors">
                180°
              </button>
            </div>

            <label className="mt-4 block">
              <span className="text-xs font-medium">Angle: {angle}° (fine-tune a tilted photo)</span>
              <input
                type="range"
                min={-45}
                max={45}
                value={angle > 180 ? angle - 360 : angle}
                onChange={(e) => setAngle(parseInt(e.target.value, 10))}
                className="mt-1.5 w-full"
              />
            </label>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                aria-pressed={flipH}
                onClick={() => setFlipH((v) => !v)}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                  flipH ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:border-primary/60'
                }`}
              >
                <FlipHorizontal2 className="w-4 h-4" /> Flip horizontal
              </button>
              <button
                type="button"
                aria-pressed={flipV}
                onClick={() => setFlipV((v) => !v)}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                  flipV ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:border-primary/60'
                }`}
              >
                <FlipVertical2 className="w-4 h-4" /> Flip vertical
              </button>
              <button
                type="button"
                onClick={() => {
                  setAngle(0);
                  setFlipH(false);
                  setFlipV(false);
                }}
                className="rounded-lg border border-border px-3 py-2 text-sm font-medium hover:border-primary/60 transition-colors"
              >
                Reset
              </button>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
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
              {format === 'jpeg' && (
                <label className="block">
                  <span className="text-xs font-medium">Corner background</span>
                  <span className="mt-1 flex items-center gap-2">
                    <input type="color" value={background} onChange={(e) => setBackground(e.target.value)} className="h-9 w-14 rounded border border-border bg-background" />
                    <span className="text-xs text-muted-foreground">{background}</span>
                  </span>
                </label>
              )}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Quarter turns are pixel-exact. Angled rotations grow the canvas so nothing is clipped.
              {busy && ' Rendering…'}
            </p>
          </div>

          <div className="min-w-0 rounded-xl border border-border bg-card p-4 sm:p-5">
            <h3 className="font-semibold text-sm">Preview &amp; download</h3>
            {result ? (
              <div className="mt-3">
                <ResultPanel result={result} originalSizeBytes={loaded.sizeBytes} />
              </div>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">The transformed image renders here automatically.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
