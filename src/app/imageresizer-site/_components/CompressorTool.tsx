'use client';

import { useEffect, useState } from 'react';
import { browserEnv } from '../_lib/engine/canvas-env';
import { compressWithSettings } from '../_lib/engine/compress';
import { buildOutputName } from '../_lib/engine/naming';
import { EXT_BY_FORMAT, type OutputFormat } from '../_lib/engine/types';
import { formatBytes } from '../_lib/format';
import { FileDrop } from './FileDrop';
import { FormatSelect, ResultPanel, STANDARD_FORMATS } from './ResultPanel';
import { useImageLoader, useResultImage } from './use-image-loader';

type CompressFormat = Exclude<OutputFormat, 'gif'>;

export function CompressorTool() {
  const { loaded, loading, error, load, setError } = useImageLoader();
  const { result, setResult } = useResultImage();
  const [format, setFormat] = useState<CompressFormat>('jpeg');
  const [quality, setQuality] = useState(0.8);
  const [maxDimension, setMaxDimension] = useState('');
  const [avifSupported, setAvifSupported] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    browserEnv.probeEncode('image/avif').then(setAvifSupported).catch(() => setAvifSupported(false));
  }, []);

  const process = async () => {
    if (!loaded) return;
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const cap = parseInt(maxDimension, 10);
      const out = await compressWithSettings(browserEnv, loaded.decoded.surface, {
        format,
        quality,
        maxDimension: Number.isFinite(cap) && cap > 0 ? cap : undefined,
      });
      setResult({
        blob: out.blob,
        filename: buildOutputName(
          '{name}-compressed',
          { originalName: loaded.name, format },
          EXT_BY_FORMAT[format]
        ),
        width: out.width,
        height: out.height,
        note:
          format === 'png'
            ? 'PNG is lossless: size savings came from re-encoding (metadata stripped) and any dimension cap — there is no PNG quality setting.'
            : undefined,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Compression failed.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="w-full min-w-0">
      <FileDrop onFiles={load} label="Drop an image to compress" />
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
              {loaded.decoded.width}×{loaded.decoded.height} · {formatBytes(loaded.sizeBytes)} ·{' '}
              {loaded.decoded.format.toUpperCase()}
            </p>
            <div className="mt-5 space-y-4">
              <FormatSelect
                value={format}
                onChange={(f) => setFormat(f as CompressFormat)}
                formats={[...STANDARD_FORMATS]}
                avifSupported={avifSupported}
              />
              {format !== 'png' && (
                <label className="block">
                  <span className="text-xs font-medium">Quality: {Math.round(quality * 100)}%</span>
                  <input
                    type="range"
                    min={5}
                    max={100}
                    value={Math.round(quality * 100)}
                    onChange={(e) => setQuality(parseInt(e.target.value, 10) / 100)}
                    className="mt-1.5 w-full"
                  />
                  <span className="text-xs text-muted-foreground">Lower quality = smaller file. 75–85% suits most web photos.</span>
                </label>
              )}
              <label className="block">
                <span className="text-xs font-medium">Max dimension (px, optional)</span>
                <input
                  type="number"
                  min={16}
                  placeholder="No cap"
                  value={maxDimension}
                  onChange={(e) => setMaxDimension(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                />
                <span className="text-xs text-muted-foreground">Caps the longest edge — the strongest size lever after format.</span>
              </label>
              <button
                type="button"
                onClick={process}
                disabled={busy}
                className="w-full rounded-lg bg-primary text-primary-foreground px-4 py-3 text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {busy ? 'Compressing…' : 'Compress image'}
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
                The compressed file appears here with its real size versus the original — before you download
                anything.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
