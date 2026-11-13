'use client';

import { useEffect, useState } from 'react';
import { browserEnv } from '../_lib/engine/canvas-env';
import { convertImage } from '../_lib/engine/convert';
import { buildOutputName } from '../_lib/engine/naming';
import { EXT_BY_FORMAT, type OutputFormat } from '../_lib/engine/types';
import { formatBytes } from '../_lib/format';
import { FileDrop } from './FileDrop';
import { FormatSelect, ResultPanel, STANDARD_FORMATS } from './ResultPanel';
import { useImageLoader, useResultImage } from './use-image-loader';

type ConvertFormat = Exclude<OutputFormat, 'gif'>;

export function ConverterTool({
  defaultFormat = 'webp',
  lockFormat,
}: {
  defaultFormat?: ConvertFormat;
  lockFormat?: ConvertFormat;
}) {
  const { loaded, loading, error, load, setError } = useImageLoader();
  const { result, setResult } = useResultImage();
  const [format, setFormat] = useState<ConvertFormat>(lockFormat ?? defaultFormat);
  const [quality, setQuality] = useState(0.9);
  const [background, setBackground] = useState('#ffffff');
  const [avifSupported, setAvifSupported] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    browserEnv.probeEncode('image/avif').then(setAvifSupported).catch(() => setAvifSupported(false));
  }, []);

  const isAnimatedGif = Boolean(loaded?.decoded.gifFrames && loaded.decoded.gifFrames.length > 1);

  const process = async () => {
    if (!loaded) return;
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const out = await convertImage(browserEnv, loaded.decoded.surface, {
        format,
        quality,
        background,
      });
      setResult({
        blob: out.blob,
        filename: buildOutputName(
          '{name}-converted',
          { originalName: loaded.name, format },
          EXT_BY_FORMAT[format]
        ),
        width: out.width,
        height: out.height,
        note: isAnimatedGif
          ? 'The source GIF is animated — the converted file shows its first frame. To keep the animation, resize it with the Image Resizer and GIF output.'
          : undefined,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Conversion failed.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="w-full min-w-0">
      <FileDrop onFiles={load} label="Drop an image to convert" />
      {error && (
        <p role="alert" className="mt-4 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm">
          {error}
        </p>
      )}
      {loading && <p className="mt-4 text-sm text-muted-foreground">Loading image…</p>}

      {loaded && (
        <div className="mt-6 grid gap-6 lg:grid-cols-2 min-w-0">
          <div className="min-w-0 rounded-xl border border-border bg-card p-4 sm:p-5">
            <h3 className="font-semibold text-sm">Original</h3>
            <p className="mt-1 text-xs text-muted-foreground break-all">{loaded.name}</p>
            {/* eslint-disable-next-line @next/next/no-img-element -- local object URL preview */}
            <img src={loaded.previewUrl} alt="Original preview" className="mt-3 max-h-64 w-auto max-w-full rounded-lg border border-border object-contain" />
            <p className="mt-3 text-sm">
              Detected format: <strong>{loaded.decoded.format.toUpperCase()}</strong> · {loaded.decoded.width}×
              {loaded.decoded.height} · {formatBytes(loaded.sizeBytes)}
            </p>
            {loaded.decoded.notes.map((note) => (
              <p key={note} className="mt-1 text-xs text-muted-foreground">
                {note}
              </p>
            ))}
            <div className="mt-5 space-y-4">
              {!lockFormat && (
                <FormatSelect
                  value={format}
                  onChange={(f) => setFormat(f as ConvertFormat)}
                  formats={[...STANDARD_FORMATS]}
                  avifSupported={avifSupported}
                />
              )}
              {format !== 'png' && (
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
                  <span className="text-xs font-medium">Background (JPG has no transparency)</span>
                  <span className="mt-1 flex items-center gap-2">
                    <input
                      type="color"
                      value={background}
                      onChange={(e) => setBackground(e.target.value)}
                      className="h-9 w-14 rounded border border-border bg-background"
                    />
                    <span className="text-xs text-muted-foreground">{background}</span>
                  </span>
                </label>
              )}
              <button
                type="button"
                onClick={process}
                disabled={busy}
                className="w-full rounded-lg bg-primary text-primary-foreground px-4 py-3 text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {busy ? 'Converting…' : `Convert to ${format.toUpperCase()}`}
              </button>
            </div>
          </div>

          <div className="min-w-0 rounded-xl border border-border bg-card p-4 sm:p-5">
            <h3 className="font-semibold text-sm">Result</h3>
            {result ? (
              <div className="mt-3">
                <ResultPanel result={result} originalSizeBytes={loaded.sizeBytes} />
              </div>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">
                The converted file appears here — check its real format and size before downloading.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
