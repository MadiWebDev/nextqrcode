'use client';

/**
 * Bulk image compressor: the single-image compressor's two modes (quality,
 * or exact target size) applied to a whole batch through the shared queue.
 * Exact-size results report honestly per file — the output filename carries
 * the achieved size, and files that cannot reach the target are still
 * delivered at the smallest size the algorithm found (never silently
 * labelled as on-target).
 */
import { useState } from 'react';
import { browserEnv } from '../_lib/engine/canvas-env';
import { decodeImage } from '../_lib/engine/decode';
import { compressToTarget, compressWithSettings } from '../_lib/engine/compress';
import { baseNameOf, buildOutputName, sanitizeFileBase } from '../_lib/engine/naming';
import { EXT_BY_FORMAT, type OutputFormat } from '../_lib/engine/types';
import { parseTargetSize } from '../_lib/format';
import { BulkProcessor, type BulkProcessOutcome } from './BulkProcessor';

type Mode = 'quality' | 'exact';
type Fmt = Exclude<OutputFormat, 'gif' | 'avif'>;

export default function BulkCompressTool() {
  const [mode, setMode] = useState<Mode>('quality');
  const [quality, setQuality] = useState(0.8);
  const [targetInput, setTargetInput] = useState('200KB');
  const [format, setFormat] = useState<Fmt>('jpeg');

  const processFile = async (
    file: File,
    ctx: { signal: { cancelled: boolean }; report: (fraction: number) => void }
  ): Promise<BulkProcessOutcome> => {
    const decoded = await decodeImage(browserEnv, file);
    try {
      if (mode === 'exact') {
        const targetBytes = parseTargetSize(targetInput) ?? 200 * 1024;
        const out = await compressToTarget(browserEnv, decoded.surface, {
          targetBytes,
          format,
          signal: ctx.signal,
          onProgress: () => ctx.report(0.5),
        });
        const kb = Math.max(1, Math.round(out.sizeBytes / 1024));
        return {
          blob: out.blob,
          filename: `${sanitizeFileBase(
            `${baseNameOf(file.name)}-${kb}kb${out.achieved ? '' : '-smallest-possible'}`
          )}.${EXT_BY_FORMAT[format]}`,
        };
      }
      const out = await compressWithSettings(browserEnv, decoded.surface, { format, quality });
      return {
        blob: out.blob,
        filename: buildOutputName(
          '{name}-compressed',
          { originalName: file.name, width: out.width, height: out.height, format },
          EXT_BY_FORMAT[format]
        ),
      };
    } finally {
      decoded.release();
    }
  };

  const settings = (
    <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Compression mode">
        {(
          [
            ['quality', 'By quality'],
            ['exact', 'Exact target size'],
          ] as Array<[Mode, string]>
        ).map(([m, label]) => (
          <button
            key={m}
            type="button"
            role="tab"
            aria-selected={mode === m}
            onClick={() => setMode(m)}
            className={`rounded-lg px-3 py-2 text-sm font-medium ${
              mode === m ? 'bg-blue-700 text-white' : 'bg-accent hover:bg-accent/70'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {mode === 'quality' ? (
          <label className="block">
            <span className="text-xs font-medium">Quality · {Math.round(quality * 100)}%</span>
            <input
              type="range"
              min={5}
              max={100}
              value={Math.round(quality * 100)}
              onChange={(e) => setQuality(Number(e.target.value) / 100)}
              className="mt-2 w-full accent-blue-700"
              aria-label="Quality"
            />
          </label>
        ) : (
          <label className="block">
            <span className="text-xs font-medium">Target size per file (e.g. 100KB, 500KB, 1MB)</span>
            <input
              type="text"
              value={targetInput}
              onChange={(e) => setTargetInput(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            />
            <span className="mt-1 block text-xs text-muted-foreground">
              Files that cannot reach the target even at minimum size are named
              -smallest-possible — the report is honest, per file.
            </span>
          </label>
        )}
        <label className="block">
          <span className="text-xs font-medium">Output format</span>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value as Fmt)}
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          >
            <option value="jpeg">JPG (smallest for photos)</option>
            <option value="webp">WebP</option>
            <option value="png">PNG (lossless — size control is limited)</option>
          </select>
        </label>
      </div>
    </div>
  );

  return (
    <BulkProcessor
      settings={settings}
      processFile={processFile}
      zipName="compressed-images.zip"
      dropLabel="Drop images to compress in bulk"
      historyLabel="Bulk Compress"
    />
  );
}
