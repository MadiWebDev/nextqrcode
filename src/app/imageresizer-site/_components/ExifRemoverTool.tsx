'use client';

/**
 * EXIF / metadata remover: re-encodes the image through canvas (which
 * writes no metadata) and then PROVES it by parsing the produced file
 * again and showing the before/after reports side by side.
 */
import { useState } from 'react';
import { browserEnv } from '../_lib/engine/canvas-env';
import { parseMetadata, type MetadataReport } from '../_lib/engine/exif';
import { encodeCanvasOutput } from '../_lib/encode-output';
import { buildOutputName } from '../_lib/engine/naming';
import { EXT_BY_FORMAT, type OutputFormat } from '../_lib/engine/types';
import { formatBytes } from '../_lib/format';
import { FileDrop } from './FileDrop';
import { ResultPanel } from './ResultPanel';
import { MetadataReportView } from './MetadataTool';
import { useImageLoader, useResultImage } from './use-image-loader';

export default function ExifRemoverTool() {
  const { loaded, loading, error, load, setError } = useImageLoader();
  const { result, setResult } = useResultImage();
  const [before, setBefore] = useState<MetadataReport | null>(null);
  const [after, setAfter] = useState<MetadataReport | null>(null);
  const [verified, setVerified] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleLoad = async (files: File[]) => {
    setBefore(null);
    setAfter(null);
    setVerified(false);
    setResult(null);
    await load(files);
    const file = files[0];
    if (file) {
      try {
        const bytes = new Uint8Array(await file.arrayBuffer());
        let format = '';
        if (bytes[0] === 0xff && bytes[1] === 0xd8) format = 'jpeg';
        else if (bytes[0] === 0x89 && bytes[1] === 0x50) format = 'png';
        else if (bytes[8] === 0x57) format = 'webp';
        if (format) setBefore(parseMetadata(bytes, format));
      } catch {
        // The decode error path in the loader reports unreadable files.
      }
    }
  };

  const strip = async () => {
    if (!loaded) return;
    setBusy(true);
    setError(null);
    try {
      const format: OutputFormat =
        loaded.decoded.format === 'png' ? 'png' : loaded.decoded.format === 'webp' ? 'webp' : 'jpeg';
      const canvas = browserEnv.createCanvas(loaded.decoded.width, loaded.decoded.height);
      canvas.getContext('2d').drawImage(loaded.decoded.surface, 0, 0);
      const blob = await encodeCanvasOutput(canvas, format, 0.95);
      // Verify: parse the actual output bytes.
      const outBytes = new Uint8Array(await blob.arrayBuffer());
      const outReport = parseMetadata(outBytes, format === 'jpeg' ? 'jpeg' : format);
      setAfter(outReport);
      setVerified(true);
      setResult({
        blob,
        filename: buildOutputName(
          '{name}-clean',
          { originalName: loaded.name, format },
          EXT_BY_FORMAT[format]
        ),
        width: loaded.decoded.width,
        height: loaded.decoded.height,
        note: 'Metadata stripped by re-encoding. The verification report below is parsed from the actual output file.',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Stripping failed.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="w-full min-w-0">
      <FileDrop onFiles={(files) => void handleLoad(files)} label="Drop an image to strip its metadata" />
      {error && (
        <p role="alert" className="mt-4 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm">
          {error}
        </p>
      )}
      {loading && <p className="mt-4 text-sm text-muted-foreground">Loading image…</p>}
      {loaded && (
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="min-w-0 rounded-xl border border-border bg-card p-4 sm:p-5">
            <h3 className="text-sm font-semibold">Before — metadata in {loaded.name}</h3>
            <p className="mt-1 text-xs text-muted-foreground">{formatBytes(loaded.sizeBytes)} · re-encoding keeps the same format ({loaded.decoded.format.toUpperCase()})</p>
            <div className="mt-3">
              <MetadataReportView report={before} />
            </div>
            <button
              type="button"
              onClick={() => void strip()}
              disabled={busy}
              className="mt-5 w-full rounded-lg bg-blue-700 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-50"
            >
              {busy ? 'Stripping…' : 'Strip metadata & verify'}
            </button>
          </div>
          <div className="min-w-0 rounded-xl border border-border bg-card p-4 sm:p-5">
            <h3 className="text-sm font-semibold">After — verification from the output file</h3>
            {verified ? (
              <>
                <div className="mt-3">
                  <MetadataReportView report={after} />
                </div>
                {result && (
                  <div className="mt-4">
                    <ResultPanel result={result} originalSizeBytes={loaded.sizeBytes} />
                  </div>
                )}
              </>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">
                After stripping, the produced file is parsed again and its (empty) metadata
                report is shown here — proof, not promises.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
