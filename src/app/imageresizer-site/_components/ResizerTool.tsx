'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Download, Link2, Unlink } from 'lucide-react';
import { browserEnv } from '../_lib/engine/canvas-env';
import { decodeImage, type DecodedImage } from '../_lib/engine/decode';
import { renderResize, type FitMode, type ResizeSpec } from '../_lib/engine/resize';
import { encodeGif } from '../_lib/engine/gif';
import { buildOutputName } from '../_lib/engine/naming';
import { EXT_BY_FORMAT, MIME_BY_FORMAT, type OutputFormat } from '../_lib/engine/types';
import { formatBytes, formatPercentChange } from '../_lib/format';
import { FileDrop } from './FileDrop';

interface LoadedFile {
  name: string;
  sizeBytes: number;
  decoded: DecodedImage;
  previewUrl: string;
}

interface ResultState {
  url: string;
  filename: string;
  sizeBytes: number;
  width: number;
  height: number;
  animated: boolean;
}

const ENCODE_FORMATS: Array<{ value: OutputFormat; label: string }> = [
  { value: 'jpeg', label: 'JPG' },
  { value: 'png', label: 'PNG' },
  { value: 'webp', label: 'WebP' },
  { value: 'avif', label: 'AVIF' },
  { value: 'gif', label: 'GIF' },
];

export function ResizerTool() {
  const [loaded, setLoaded] = useState<LoadedFile | null>(null);
  const [widthInput, setWidthInput] = useState('');
  const [heightInput, setHeightInput] = useState('');
  const [lockAspect, setLockAspect] = useState(true);
  const [fit, setFit] = useState<FitMode>('stretch');
  const [format, setFormat] = useState<OutputFormat>('jpeg');
  const [quality, setQuality] = useState(0.9);
  const [keepAnimation, setKeepAnimation] = useState(true);
  const [avifSupported, setAvifSupported] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ResultState | null>(null);
  const resultUrlRef = useRef<string | null>(null);

  useEffect(() => {
    browserEnv.probeEncode('image/avif').then(setAvifSupported).catch(() => setAvifSupported(false));
  }, []);

  useEffect(() => {
    return () => {
      if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
    };
  }, []);

  const clearResult = useCallback(() => {
    if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
    resultUrlRef.current = null;
    setResult(null);
  }, []);

  const handleFiles = useCallback(
    async (files: File[]) => {
      const file = files[0];
      if (!file) return;
      setBusy(true);
      setError(null);
      clearResult();
      try {
        const decoded = await decodeImage(browserEnv, file);
        setLoaded((prev) => {
          if (prev) URL.revokeObjectURL(prev.previewUrl);
          return {
            name: file.name,
            sizeBytes: file.size,
            decoded,
            previewUrl: URL.createObjectURL(file),
          };
        });
        setWidthInput(String(decoded.width));
        setHeightInput(String(decoded.height));
        setKeepAnimation(true);
        // Sensible default output: keep the source format when it's a
        // normal encode target, else PNG (lossless, universal).
        setFormat(
          decoded.format === 'jpeg' || decoded.format === 'png' || decoded.format === 'webp'
            ? decoded.format
            : decoded.format === 'gif'
              ? 'gif'
              : 'png'
        );
      } catch (err) {
        setLoaded(null);
        setError(err instanceof Error ? err.message : 'That file could not be opened.');
      } finally {
        setBusy(false);
      }
    },
    [clearResult]
  );

  const onWidthChange = (value: string) => {
    setWidthInput(value);
    if (lockAspect && loaded) {
      const w = parseInt(value, 10);
      if (Number.isFinite(w) && w > 0) {
        setHeightInput(String(Math.max(1, Math.round((loaded.decoded.height * w) / loaded.decoded.width))));
      }
    }
  };

  const onHeightChange = (value: string) => {
    setHeightInput(value);
    if (lockAspect && loaded) {
      const h = parseInt(value, 10);
      if (Number.isFinite(h) && h > 0) {
        setWidthInput(String(Math.max(1, Math.round((loaded.decoded.width * h) / loaded.decoded.height))));
      }
    }
  };

  const process = async () => {
    if (!loaded) return;
    setBusy(true);
    setError(null);
    clearResult();
    try {
      const { decoded } = loaded;
      const targetWidth = parseInt(widthInput, 10);
      const targetHeight = parseInt(heightInput, 10);
      if (!Number.isFinite(targetWidth) || !Number.isFinite(targetHeight) || targetWidth < 1 || targetHeight < 1) {
        throw new Error('Enter a width and height of at least 1 pixel.');
      }
      const spec: ResizeSpec = {
        targetWidth,
        targetHeight,
        fit,
        background: format === 'jpeg' ? '#ffffff' : undefined,
      };

      const animatedGif =
        keepAnimation && decoded.gifFrames && decoded.gifFrames.length > 1 && format === 'gif';

      let blob: Blob;
      let outW = targetWidth;
      let outH = targetHeight;
      if (animatedGif && decoded.gifFrames) {
        const frames = decoded.gifFrames.map((frame) => {
          const frameCanvas = browserEnv.canvasFromPixels(frame.pixels, decoded.width, decoded.height);
          const resized = renderResize(browserEnv, frameCanvas, spec);
          const ctx = resized.getContext('2d');
          const pixels = ctx.getImageData(0, 0, resized.width, resized.height);
          return { pixels: pixels.data, delayMs: frame.delayMs };
        });
        blob = await encodeGif(frames, targetWidth, targetHeight);
      } else {
        const canvas = renderResize(browserEnv, decoded.surface, spec);
        outW = canvas.width;
        outH = canvas.height;
        if (format === 'gif') {
          const ctx = canvas.getContext('2d');
          const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
          blob = await encodeGif([{ pixels: pixels.data, delayMs: 100 }], canvas.width, canvas.height);
        } else {
          const mime = MIME_BY_FORMAT[format];
          if (!(await browserEnv.probeEncode(mime))) {
            throw new Error(
              format === 'avif'
                ? 'This browser cannot create AVIF files (AVIF encoding currently works in Chrome). Choose WebP or JPG instead.'
                : `This browser cannot create ${format.toUpperCase()} files. Choose another format.`
            );
          }
          blob = await browserEnv.encode(canvas, mime, format === 'png' ? undefined : quality);
        }
      }

      const url = URL.createObjectURL(blob);
      resultUrlRef.current = url;
      setResult({
        url,
        filename: buildOutputName(
          '{name}-{w}x{h}',
          { originalName: loaded.name, width: outW, height: outH, format },
          EXT_BY_FORMAT[format]
        ),
        sizeBytes: blob.size,
        width: outW,
        height: outH,
        animated: Boolean(animatedGif),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Resizing failed.');
    } finally {
      setBusy(false);
    }
  };

  const decoded = loaded?.decoded;
  const isAnimatedGif = Boolean(decoded?.gifFrames && decoded.gifFrames.length > 1);

  return (
    <div className="w-full min-w-0">
      <FileDrop onFiles={handleFiles} label="Drop an image to resize" />

      {error && (
        <p role="alert" className="mt-4 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm">
          {error}
        </p>
      )}
      {busy && <p className="mt-4 text-sm text-muted-foreground">Working…</p>}

      {loaded && decoded && (
        <div className="mt-6 grid gap-6 lg:grid-cols-2 min-w-0">
          <div className="min-w-0 rounded-xl border border-border bg-card p-4 sm:p-5">
            <h3 className="font-semibold text-sm">Original</h3>
            <p className="mt-1 text-xs text-muted-foreground break-all">{loaded.name}</p>
            {/* eslint-disable-next-line @next/next/no-img-element -- local object URL preview */}
            <img
              src={loaded.previewUrl}
              alt="Original image preview"
              className="mt-3 max-h-64 w-auto max-w-full rounded-lg border border-border object-contain"
            />
            <dl className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="rounded-lg bg-muted/60 px-2 py-2">
                <dt className="text-muted-foreground">Size</dt>
                <dd className="font-semibold mt-0.5">
                  {decoded.width}×{decoded.height}
                </dd>
              </div>
              <div className="rounded-lg bg-muted/60 px-2 py-2">
                <dt className="text-muted-foreground">File</dt>
                <dd className="font-semibold mt-0.5">{formatBytes(loaded.sizeBytes)}</dd>
              </div>
              <div className="rounded-lg bg-muted/60 px-2 py-2">
                <dt className="text-muted-foreground">Format</dt>
                <dd className="font-semibold mt-0.5">{decoded.format.toUpperCase()}</dd>
              </div>
            </dl>
            {decoded.notes.map((note) => (
              <p key={note} className="mt-2 text-xs text-muted-foreground">
                {note}
              </p>
            ))}

            <div className="mt-5 space-y-4">
              <div className="flex items-end gap-2">
                <label className="flex-1 min-w-0">
                  <span className="text-xs font-medium">Width (px)</span>
                  <input
                    type="number"
                    min={1}
                    inputMode="numeric"
                    value={widthInput}
                    onChange={(e) => onWidthChange(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => setLockAspect((v) => !v)}
                  aria-pressed={lockAspect}
                  title={lockAspect ? 'Aspect ratio locked' : 'Aspect ratio unlocked'}
                  className={`inline-flex items-center justify-center w-10 h-10 rounded-lg border transition-colors ${
                    lockAspect ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground'
                  }`}
                >
                  {lockAspect ? <Link2 className="w-4 h-4" /> : <Unlink className="w-4 h-4" />}
                </button>
                <label className="flex-1 min-w-0">
                  <span className="text-xs font-medium">Height (px)</span>
                  <input
                    type="number"
                    min={1}
                    inputMode="numeric"
                    value={heightInput}
                    onChange={(e) => onHeightChange(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  />
                </label>
              </div>

              <div className="flex flex-wrap gap-2">
                {[25, 50, 75, 100].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => {
                      const w = Math.max(1, Math.round((decoded.width * pct) / 100));
                      setWidthInput(String(w));
                      setHeightInput(String(Math.max(1, Math.round((decoded.height * pct) / 100))));
                    }}
                    className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:border-primary/60 transition-colors"
                  >
                    {pct}%
                  </button>
                ))}
                <select
                  value={fit}
                  onChange={(e) => setFit(e.target.value as FitMode)}
                  aria-label="Fit mode"
                  className="rounded-lg border border-border bg-background px-2 py-1.5 text-xs"
                >
                  <option value="stretch">Stretch to size</option>
                  <option value="contain">Fit inside (letterbox)</option>
                  <option value="cover">Fill &amp; crop</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <label>
                  <span className="text-xs font-medium">Output format</span>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value as OutputFormat)}
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  >
                    {ENCODE_FORMATS.map((f) => (
                      <option key={f.value} value={f.value} disabled={f.value === 'avif' && avifSupported === false}>
                        {f.label}
                        {f.value === 'avif' && avifSupported === false ? ' (not in this browser)' : ''}
                      </option>
                    ))}
                  </select>
                </label>
                {format !== 'png' && format !== 'gif' && (
                  <label>
                    <span className="text-xs font-medium">Quality: {Math.round(quality * 100)}%</span>
                    <input
                      type="range"
                      min={10}
                      max={100}
                      value={Math.round(quality * 100)}
                      onChange={(e) => setQuality(parseInt(e.target.value, 10) / 100)}
                      className="mt-2 w-full"
                    />
                  </label>
                )}
              </div>

              {format === 'avif' && avifSupported === false && (
                <p className="text-xs text-muted-foreground">
                  AVIF creation currently works in Chrome-based browsers. WebP gives similar savings everywhere.
                </p>
              )}
              {isAnimatedGif && (
                <label className="flex items-start gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={keepAnimation}
                    onChange={(e) => setKeepAnimation(e.target.checked)}
                    className="mt-0.5"
                  />
                  <span>
                    Keep animation ({decoded.gifFrames!.length} frames)
                    <span className="block text-xs text-muted-foreground">
                      {format !== 'gif'
                        ? `Only applies to GIF output — ${format.toUpperCase()} output is a static image of the first frame.`
                        : 'Uncheck to export a static GIF of the first frame.'}
                    </span>
                  </span>
                </label>
              )}

              <button
                type="button"
                onClick={process}
                disabled={busy}
                className="w-full rounded-lg bg-primary text-primary-foreground px-4 py-3 text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {busy ? 'Resizing…' : `Resize to ${widthInput || '?'}×${heightInput || '?'} px`}
              </button>
            </div>
          </div>

          <div className="min-w-0 rounded-xl border border-border bg-card p-4 sm:p-5">
            <h3 className="font-semibold text-sm">Result</h3>
            {result ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element -- local object URL preview */}
                <img
                  src={result.url}
                  alt="Resized image preview"
                  className="mt-3 max-h-64 w-auto max-w-full rounded-lg border border-border object-contain"
                />
                <dl className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="rounded-lg bg-muted/60 px-2 py-2">
                    <dt className="text-muted-foreground">Size</dt>
                    <dd className="font-semibold mt-0.5">
                      {result.width}×{result.height}
                    </dd>
                  </div>
                  <div className="rounded-lg bg-muted/60 px-2 py-2">
                    <dt className="text-muted-foreground">File</dt>
                    <dd className="font-semibold mt-0.5">{formatBytes(result.sizeBytes)}</dd>
                  </div>
                  <div className="rounded-lg bg-muted/60 px-2 py-2">
                    <dt className="text-muted-foreground">Change</dt>
                    <dd className="font-semibold mt-0.5">
                      {formatPercentChange(loaded.sizeBytes, result.sizeBytes)}
                    </dd>
                  </div>
                </dl>
                {result.animated && (
                  <p className="mt-2 text-xs text-muted-foreground">Animation preserved — all frames were resized.</p>
                )}
                <a
                  href={result.url}
                  download={result.filename}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground px-4 py-3 text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  <Download className="w-4 h-4" />
                  Download {result.filename}
                </a>
              </>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">
                Set your target size and press Resize — the result appears here with its real dimensions and file
                size before you download.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
