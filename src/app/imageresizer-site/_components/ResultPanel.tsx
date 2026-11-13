'use client';

import { Download } from 'lucide-react';
import { formatBytes, formatPercentChange } from '../_lib/format';
import type { ResultImage } from './use-image-loader';

/** Standard result display: preview, real dimensions, real sizes, download. */
export function ResultPanel({
  result,
  originalSizeBytes,
}: {
  result: ResultImage;
  originalSizeBytes?: number;
}) {
  return (
    <div>
      {/* eslint-disable-next-line @next/next/no-img-element -- local object URL preview */}
      <img
        src={result.url}
        alt="Processed result preview"
        className="max-h-72 w-auto max-w-full rounded-lg border border-border object-contain"
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
          <dd className="font-semibold mt-0.5">{formatBytes(result.blob.size)}</dd>
        </div>
        <div className="rounded-lg bg-muted/60 px-2 py-2">
          <dt className="text-muted-foreground">{originalSizeBytes ? 'Change' : 'Format'}</dt>
          <dd className="font-semibold mt-0.5">
            {originalSizeBytes
              ? formatPercentChange(originalSizeBytes, result.blob.size)
              : result.filename.split('.').pop()?.toUpperCase()}
          </dd>
        </div>
      </dl>
      {result.note && <p className="mt-2 text-xs text-muted-foreground">{result.note}</p>}
      <a
        href={result.url}
        download={result.filename}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground px-4 py-3 text-sm font-semibold hover:opacity-90 transition-opacity"
      >
        <Download className="w-4 h-4" />
        Download {result.filename}
      </a>
    </div>
  );
}

/** Shared labelled select for output format across single-image tools. */
export function FormatSelect({
  value,
  onChange,
  formats,
  avifSupported,
}: {
  value: string;
  onChange: (format: string) => void;
  formats: Array<{ value: string; label: string }>;
  avifSupported?: boolean | null;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium">Output format</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
      >
        {formats.map((f) => (
          <option key={f.value} value={f.value} disabled={f.value === 'avif' && avifSupported === false}>
            {f.label}
            {f.value === 'avif' && avifSupported === false ? ' (not in this browser)' : ''}
          </option>
        ))}
      </select>
    </label>
  );
}

export const STANDARD_FORMATS = [
  { value: 'jpeg', label: 'JPG' },
  { value: 'png', label: 'PNG' },
  { value: 'webp', label: 'WebP' },
  { value: 'avif', label: 'AVIF' },
] as const;
