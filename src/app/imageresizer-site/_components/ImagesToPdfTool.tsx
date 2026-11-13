'use client';

/**
 * Images → PDF: combine multiple images into one PDF with page size
 * (A4 / Letter / fit-to-image), orientation and margin controls, and
 * drag-free reorder buttons. Built on jsPDF; images are placed as JPEG
 * (or PNG when they carry transparency and PNG output is chosen).
 */
import { useState } from 'react';
import { browserEnv } from '../_lib/engine/canvas-env';
import { decodeImage } from '../_lib/engine/decode';
import { downloadBlob } from '../_lib/engine/export';
import { formatBytes } from '../_lib/format';
import { FileDrop } from './FileDrop';

interface Item {
  id: number;
  file: File;
  name: string;
  size: number;
  thumbUrl: string;
}

let nextId = 1;

const PAGE_SIZES = {
  a4: { w: 210, h: 297, label: 'A4' },
  letter: { w: 215.9, h: 279.4, label: 'US Letter' },
  fit: null,
} as const;

export default function ImagesToPdfTool() {
  const [items, setItems] = useState<Item[]>([]);
  const [pageSize, setPageSize] = useState<keyof typeof PAGE_SIZES>('a4');
  const [marginMm, setMarginMm] = useState(10);
  const [quality, setQuality] = useState(0.9);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [doneInfo, setDoneInfo] = useState<string | null>(null);

  const addFiles = (files: File[]) => {
    setItems((prev) => [
      ...prev,
      ...files.map((file) => ({
        id: nextId++,
        file,
        name: file.name,
        size: file.size,
        thumbUrl: URL.createObjectURL(file),
      })),
    ]);
  };

  const move = (index: number, dir: -1 | 1) =>
    setItems((prev) => {
      const target = index + dir;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });

  const build = async () => {
    if (items.length === 0) return;
    setBusy(true);
    setError(null);
    setDoneInfo(null);
    try {
      const { jsPDF } = await import('jspdf');
      let doc: InstanceType<typeof jsPDF> | null = null;
      for (let i = 0; i < items.length; i++) {
        const decoded = await decodeImage(browserEnv, items[i].file);
        try {
          // Encode as JPEG on white (PDFs have no transparency in this flow).
          const flat = browserEnv.createCanvas(decoded.width, decoded.height);
          const fctx = flat.getContext('2d');
          fctx.fillStyle = '#ffffff';
          fctx.fillRect(0, 0, flat.width, flat.height);
          fctx.drawImage(decoded.surface, 0, 0);
          const blob = await browserEnv.encode(flat, 'image/jpeg', quality);
          const dataUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => reject(new Error('read failed'));
            reader.readAsDataURL(blob);
          });

          let pageW: number;
          let pageH: number;
          if (pageSize === 'fit') {
            // Page = image at 150 DPI (a sane print density), in mm.
            pageW = (decoded.width / 150) * 25.4;
            pageH = (decoded.height / 150) * 25.4;
          } else {
            const size = PAGE_SIZES[pageSize]!;
            const landscape = decoded.width > decoded.height && size.h > size.w;
            pageW = landscape ? size.h : size.w;
            pageH = landscape ? size.w : size.h;
          }
          const orientation = pageW > pageH ? 'landscape' : 'portrait';
          if (!doc) {
            doc = new jsPDF({ unit: 'mm', format: [pageW, pageH], orientation });
          } else {
            doc.addPage([pageW, pageH], orientation);
          }
          const availW = Math.max(10, pageW - marginMm * 2);
          const availH = Math.max(10, pageH - marginMm * 2);
          const scale = Math.min(availW / decoded.width, availH / decoded.height);
          const drawW = decoded.width * scale;
          const drawH = decoded.height * scale;
          doc.addImage(dataUrl, 'JPEG', (pageW - drawW) / 2, (pageH - drawH) / 2, drawW, drawH);
        } finally {
          decoded.release();
        }
      }
      if (!doc) throw new Error('No images could be added.');
      const pdfBlob = doc.output('blob');
      downloadBlob(pdfBlob, 'images.pdf');
      setDoneInfo(`Created images.pdf — ${items.length} page${items.length === 1 ? '' : 's'}, ${formatBytes(pdfBlob.size)}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'PDF creation failed.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="w-full min-w-0">
      <FileDrop onFiles={addFiles} multiple label="Drop images to combine into a PDF" />
      {error && (
        <p role="alert" className="mt-4 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm">
          {error}
        </p>
      )}
      {items.length > 0 && (
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          <ol className="min-w-0 space-y-2">
            {items.map((item, i) => (
              <li key={item.id} className="flex items-center gap-3 rounded-xl border border-border bg-card p-2.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.thumbUrl} alt="" className="h-12 w-12 rounded-lg object-cover" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{item.name}</span>
                  <span className="text-xs text-muted-foreground">Page {i + 1} · {formatBytes(item.size)}</span>
                </span>
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="rounded border border-border px-2 py-1 text-xs hover:bg-accent disabled:opacity-40" aria-label="Move earlier">↑</button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1} className="rounded border border-border px-2 py-1 text-xs hover:bg-accent disabled:opacity-40" aria-label="Move later">↓</button>
                <button
                  type="button"
                  onClick={() => {
                    URL.revokeObjectURL(item.thumbUrl);
                    setItems((prev) => prev.filter((x) => x.id !== item.id));
                  }}
                  className="rounded border border-border px-2 py-1 text-xs hover:bg-accent"
                  aria-label="Remove"
                >
                  ✕
                </button>
              </li>
            ))}
          </ol>
          <div className="min-w-0 rounded-xl border border-border bg-card p-4 sm:p-5">
            <label className="block">
              <span className="text-xs font-medium">Page size</span>
              <select value={pageSize} onChange={(e) => setPageSize(e.target.value as keyof typeof PAGE_SIZES)} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm">
                <option value="a4">A4</option>
                <option value="letter">US Letter</option>
                <option value="fit">Fit page to each image (150 DPI)</option>
              </select>
            </label>
            <label className="mt-3 block">
              <span className="text-xs font-medium">Margin · {marginMm}mm</span>
              <input type="range" min={0} max={25} value={marginMm} onChange={(e) => setMarginMm(Number(e.target.value))} className="mt-1 w-full accent-blue-700" aria-label="Margin in millimetres" />
            </label>
            <label className="mt-3 block">
              <span className="text-xs font-medium">Image quality · {Math.round(quality * 100)}%</span>
              <input type="range" min={40} max={100} value={Math.round(quality * 100)} onChange={(e) => setQuality(Number(e.target.value) / 100)} className="mt-1 w-full accent-blue-700" aria-label="JPEG quality" />
            </label>
            <button type="button" onClick={() => void build()} disabled={busy} className="mt-5 w-full rounded-lg bg-blue-700 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-50">
              {busy ? 'Building PDF…' : `Create PDF (${items.length} page${items.length === 1 ? '' : 's'})`}
            </button>
            {doneInfo && <p className="mt-3 text-sm text-emerald-700">{doneInfo}</p>}
            <p className="mt-3 text-xs text-muted-foreground">
              Images are placed on a white background (PDF pages here are opaque) and re-encoded
              as JPEG — which also strips their metadata.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
