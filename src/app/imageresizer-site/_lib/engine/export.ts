/**
 * Export helpers: single-file download and ZIP packaging.
 *
 * Object URLs are revoked after the click lands (never retained
 * indefinitely); ZIPs use STORE compression because JPEG/PNG/WebP payloads
 * are already compressed — DEFLATE would burn CPU for ~0 gain.
 */
import JSZip from 'jszip';
import { ImageToolError } from './types';

export function downloadBlob(blob: Blob, filename: string): void {
  if (typeof document === 'undefined') {
    throw new ImageToolError('no-dom', 'Downloads are only available in the browser.');
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

export interface ZipEntry {
  name: string;
  blob: Blob;
}

/** De-duplicate entry names inside a ZIP (photo.jpg, photo-2.jpg, ...). */
export function dedupeZipNames(entries: ZipEntry[]): ZipEntry[] {
  const seen = new Map<string, number>();
  return entries.map((entry) => {
    const count = seen.get(entry.name) ?? 0;
    seen.set(entry.name, count + 1);
    if (count === 0) return entry;
    const dot = entry.name.lastIndexOf('.');
    const renamed =
      dot > 0 ? `${entry.name.slice(0, dot)}-${count + 1}${entry.name.slice(dot)}` : `${entry.name}-${count + 1}`;
    return { ...entry, name: renamed };
  });
}

export async function filesToZip(
  entries: ZipEntry[],
  onProgress?: (percent: number) => void
): Promise<Blob> {
  if (entries.length === 0) {
    throw new ImageToolError('zip-empty', 'There are no processed files to download yet.');
  }
  const zip = new JSZip();
  for (const entry of dedupeZipNames(entries)) {
    zip.file(entry.name, entry.blob);
  }
  return zip.generateAsync(
    { type: 'blob', compression: 'STORE', streamFiles: true },
    (meta) => onProgress?.(Math.round(meta.percent))
  );
}
