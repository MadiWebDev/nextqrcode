'use client';

/**
 * Metadata viewer: parses EXIF/IPTC-ish fields and GPS from the actual
 * file bytes (JPEG APP1/TIFF parser + PNG/WebP readers in _lib/engine/exif)
 * and shows them in a table. GPS coordinates are displayed only here, in
 * your browser — nothing is transmitted anywhere.
 */
import { useState } from 'react';
import { parseMetadata, type MetadataReport } from '../_lib/engine/exif';
import { FileDrop } from './FileDrop';

export function MetadataReportView({ report }: { report: MetadataReport | null }) {
  if (!report) {
    return (
      <p className="text-sm text-muted-foreground">
        No embedded metadata was found in this file. (That is the expected result for images
        exported from our tools, screenshots, and most images saved from the web.)
      </p>
    );
  }
  return (
    <div>
      <p className="text-xs text-muted-foreground">
        Source format: {report.source.toUpperCase()} · {report.tagCount} tag
        {report.tagCount === 1 ? '' : 's'} parsed
      </p>
      {report.fields.length > 0 ? (
        <dl className="mt-3 divide-y divide-border text-sm">
          {report.fields.map((field, i) => (
            <div key={`${field.label}-${i}`} className="flex flex-wrap justify-between gap-2 py-1.5">
              <dt className="font-medium">{field.label}</dt>
              <dd className="min-w-0 break-all text-right text-muted-foreground">{field.value}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className="mt-2 text-sm text-muted-foreground">Metadata container present, but no readable fields.</p>
      )}
      {report.gps && (
        <div className="mt-3 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          <strong>GPS location embedded:</strong> {report.gps.latitude.toFixed(6)},{' '}
          {report.gps.longitude.toFixed(6)} — shown only in your browser. Use the EXIF Remover
          before sharing this photo publicly.
        </div>
      )}
    </div>
  );
}

export default function MetadataTool() {
  const [report, setReport] = useState<MetadataReport | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  const handle = async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    setError(null);
    setChecked(false);
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      // Format from magic bytes, not the (untrusted) file name.
      let format = '';
      if (bytes[0] === 0xff && bytes[1] === 0xd8) format = 'jpeg';
      else if (bytes[0] === 0x89 && bytes[1] === 0x50) format = 'png';
      else if (bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50) format = 'webp';
      if (!format) {
        setError('Metadata viewing supports JPG, PNG and WebP files (the formats that carry EXIF-style metadata).');
        setReport(null);
        return;
      }
      setFileName(file.name);
      setReport(parseMetadata(bytes, format));
      setChecked(true);
    } catch {
      setError('That file could not be read.');
    }
  };

  return (
    <div className="w-full min-w-0">
      <FileDrop onFiles={(files) => void handle(files)} label="Drop a JPG, PNG or WebP to inspect its metadata" />
      {error && (
        <p role="alert" className="mt-4 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm">
          {error}
        </p>
      )}
      {checked && (
        <div className="mt-6 rounded-xl border border-border bg-card p-4 sm:p-5">
          <h3 className="text-sm font-semibold">Metadata in {fileName}</h3>
          <div className="mt-2">
            <MetadataReportView report={report} />
          </div>
        </div>
      )}
    </div>
  );
}
