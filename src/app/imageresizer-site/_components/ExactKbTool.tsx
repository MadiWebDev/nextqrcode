'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, AlertTriangle } from 'lucide-react';
import { browserEnv } from '../_lib/engine/canvas-env';
import { compressToTarget, type TargetCompressResult } from '../_lib/engine/compress';
import { buildOutputName } from '../_lib/engine/naming';
import { EXT_BY_FORMAT, type OutputFormat } from '../_lib/engine/types';
import { formatBytes, parseTargetSize } from '../_lib/format';
import { FileDrop } from './FileDrop';
import { FormatSelect, ResultPanel, STANDARD_FORMATS } from './ResultPanel';
import { useImageLoader, useResultImage } from './use-image-loader';

type TargetFormat = Exclude<OutputFormat, 'gif'>;

const PRESETS = ['20 KB', '50 KB', '100 KB', '200 KB', '500 KB', '1 MB'];

export function ExactKbTool({ defaultTarget = '100 KB' }: { defaultTarget?: string }) {
  const { loaded, loading, error, load, setError } = useImageLoader();
  const { result, setResult } = useResultImage();
  const [targetInput, setTargetInput] = useState(defaultTarget);
  const [format, setFormat] = useState<TargetFormat>('jpeg');
  const [avifSupported, setAvifSupported] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
  const [outcome, setOutcome] = useState<TargetCompressResult | null>(null);

  useEffect(() => {
    browserEnv.probeEncode('image/avif').then(setAvifSupported).catch(() => setAvifSupported(false));
  }, []);

  const process = async () => {
    if (!loaded) return;
    const targetBytes = parseTargetSize(targetInput);
    if (targetBytes === null) {
      setError('Enter a target like "100 KB", "200 KB" or "1 MB".');
      return;
    }
    if (targetBytes < 1024) {
      setError('The smallest workable target is 1 KB — below that, no readable image fits.');
      return;
    }
    setBusy(true);
    setError(null);
    setResult(null);
    setOutcome(null);
    setProgress('Searching for the best quality that fits…');
    try {
      const out = await compressToTarget(browserEnv, loaded.decoded.surface, {
        targetBytes,
        format,
        onProgress: (info) => {
          setProgress(
            `Attempt ${info.attempt}: ${formatBytes(info.sizeBytes)} at ${Math.round(info.scale * 100)}% size` +
              (info.quality !== null ? `, quality ${Math.round(info.quality * 100)}%` : '')
          );
        },
      });
      setOutcome(out);
      const targetSlug = targetInput.replace(/\s+/g, '').toLowerCase().replace(/[^a-z0-9.]/g, '');
      setResult({
        blob: out.blob,
        filename: buildOutputName(
          `{name}-under-${targetSlug}`,
          { originalName: loaded.name, format },
          EXT_BY_FORMAT[format]
        ),
        width: out.width,
        height: out.height,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Compression failed.');
    } finally {
      setBusy(false);
      setProgress(null);
    }
  };

  return (
    <div className="w-full min-w-0">
      <FileDrop onFiles={load} label="Drop an image to compress to an exact size" />
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
              <div>
                <span className="text-xs font-medium">Maximum file size</span>
                <div className="mt-1.5 flex flex-wrap gap-2">
                  {PRESETS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setTargetInput(preset)}
                      aria-pressed={targetInput === preset}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium border transition-colors ${
                        targetInput === preset
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={targetInput}
                  onChange={(e) => setTargetInput(e.target.value)}
                  aria-label="Target size, e.g. 100 KB"
                  placeholder="e.g. 100 KB"
                  className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                />
              </div>
              <FormatSelect
                value={format}
                onChange={(f) => setFormat(f as TargetFormat)}
                formats={[...STANDARD_FORMATS]}
                avifSupported={avifSupported}
              />
              <p className="text-xs text-muted-foreground leading-relaxed">
                The tool first searches quality; if that alone can’t reach the target it also reduces dimensions —
                and it always reports honestly whether the target was met.
              </p>
              <button
                type="button"
                onClick={process}
                disabled={busy}
                className="w-full rounded-lg bg-primary text-primary-foreground px-4 py-3 text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {busy ? 'Working…' : `Compress to ${targetInput || 'target'}`}
              </button>
              {progress && <p className="text-xs text-muted-foreground">{progress}</p>}
            </div>
          </div>

          <div className="min-w-0 rounded-xl border border-border bg-card p-4 sm:p-5">
            <h3 className="font-semibold text-sm">Result</h3>
            {result && outcome ? (
              <div className="mt-3">
                <div
                  className={`flex items-start gap-2 rounded-lg px-3 py-2.5 text-sm ${
                    outcome.achieved
                      ? 'bg-emerald-600/10 text-emerald-800 dark:text-emerald-300'
                      : 'bg-amber-500/10 text-amber-800 dark:text-amber-300'
                  }`}
                  role="status"
                >
                  {outcome.achieved ? (
                    <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" aria-hidden />
                  ) : (
                    <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden />
                  )}
                  <span>
                    {outcome.achieved
                      ? `Target met: ${formatBytes(outcome.sizeBytes)} ≤ ${formatBytes(outcome.targetBytes)}${outcome.quality !== null ? ` at ${Math.round(outcome.quality * 100)}% quality` : ''}${outcome.scaledDown ? `, scaled to ${outcome.width}×${outcome.height}` : ''}.`
                      : `Target not reached: the smallest possible result is ${formatBytes(outcome.sizeBytes)} (target ${formatBytes(outcome.targetBytes)}).`}
                  </span>
                </div>
                {outcome.notes.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {outcome.notes.map((note) => (
                      <li key={note.slice(0, 40)} className="text-xs text-muted-foreground leading-relaxed">
                        {note}
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-3">
                  <ResultPanel result={result} originalSizeBytes={loaded.sizeBytes} />
                </div>
              </div>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">
                Set the limit your form or portal demands and press Compress — the verdict (met, or honestly not
                met) appears here.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
