'use client';

/**
 * PDF → images: renders chosen pages of a PDF to JPG/PNG at a chosen DPI,
 * entirely on-device via pdf.js (loaded only when a PDF is dropped).
 * Pages are rendered onto a white background; pick pages with a range
 * like "1-3,5" or leave blank for all.
 */
import { useState } from 'react';
import type { PDFDocumentProxy } from 'pdfjs-dist';
import { browserEnv } from '../_lib/engine/canvas-env';
import type { CanvasSurface } from '../_lib/engine/canvas-env';
import { parsePageRange, scaleForDpi } from '../_lib/pdf-plan';
import { filesToZip, downloadBlob } from '../_lib/engine/export';
import { formatBytes } from '../_lib/format';

interface RenderedPage {
  page: number;
  blob: Blob;
  url: string;
  width: number;
  height: number;
}

let workerReady = false;

export default function PdfToImagesTool() {
  const [doc, setDoc] = useState<PDFDocumentProxy | null>(null);
  const [fileName, setFileName] = useState('');
  const [range, setRange] = useState('');
  const [dpi, setDpi] = useState(150);
  const [format, setFormat] = useState<'jpeg' | 'png'>('jpeg');
  const [pages, setPages] = useState<RenderedPage[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const openPdf = async (file: File) => {
    setError(null);
    setPages([]);
    setDoc(null);
    try {
      const pdfjs = await import('pdfjs-dist');
      if (!workerReady) {
        pdfjs.GlobalWorkerOptions.workerSrc = new URL(
          'pdfjs-dist/build/pdf.worker.min.mjs',
          import.meta.url
        ).toString();
        workerReady = true;
      }
      const data = await file.arrayBuffer();
      const loaded = await pdfjs.getDocument({ data }).promise;
      setDoc(loaded);
      setFileName(file.name);
    } catch {
      setError('That file could not be opened as a PDF. If it is password-protected, remove the password first — this tool cannot open encrypted PDFs.');
    }
  };

  const render = async () => {
    if (!doc) return;
    setBusy(true);
    setError(null);
    setPages([]);
    try {
      const wanted = parsePageRange(range, doc.numPages);
      if (wanted.length === 0) {
        setError('No pages matched that range — check the page numbers.');
        return;
      }
      const out: RenderedPage[] = [];
      for (const pageNumber of wanted) {
        const page = await doc.getPage(pageNumber);
        const base = page.getViewport({ scale: 1 });
        const scale = scaleForDpi(dpi, base.width, base.height);
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement('canvas');
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas unavailable.');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        await page.render({ canvasContext: ctx, viewport }).promise;
        const blob = await browserEnv.encode(
          canvas as unknown as CanvasSurface,
          format === 'jpeg' ? 'image/jpeg' : 'image/png',
          0.92
        );
        out.push({
          page: pageNumber,
          blob,
          url: URL.createObjectURL(blob),
          width: canvas.width,
          height: canvas.height,
        });
      }
      setPages(out);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Rendering failed.');
    } finally {
      setBusy(false);
    }
  };

  const downloadZip = async () => {
    const zip = await filesToZip(
      pages.map((p) => ({
        name: `page-${String(p.page).padStart(2, '0')}.${format === 'jpeg' ? 'jpg' : 'png'}`,
        blob: p.blob,
      }))
    );
    downloadBlob(zip, 'pdf-pages.zip');
  };

  return (
    <div className="w-full min-w-0">
      <div
        className={`rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
          dragOver ? 'border-blue-700 bg-blue-50' : 'border-border bg-card'
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const file = e.dataTransfer.files?.[0];
          if (file) void openPdf(file);
        }}
      >
        <p className="text-sm font-medium">Drop a PDF here, or</p>
        <label className="mt-3 inline-block cursor-pointer rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800">
          Browse for a PDF
          <input
            type="file"
            accept="application/pdf,.pdf"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void openPdf(file);
              e.target.value = '';
            }}
          />
        </label>
        <p className="mt-2 text-xs text-muted-foreground">
          The PDF is read locally by pdf.js — it is never uploaded.
        </p>
      </div>

      {error && (
        <p role="alert" className="mt-4 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm">{error}</p>
      )}

      {doc && (
        <div className="mt-6 rounded-xl border border-border bg-card p-4 sm:p-5">
          <p className="text-sm">
            <span className="font-medium">{fileName}</span>{' '}
            <span className="text-muted-foreground">· {doc.numPages} page{doc.numPages === 1 ? '' : 's'}</span>
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-4">
            <label className="block sm:col-span-2">
              <span className="text-xs font-medium">Pages (blank = all; e.g. 1-3,5)</span>
              <input type="text" value={range} onChange={(e) => setRange(e.target.value)} placeholder="All pages" className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
            </label>
            <label className="block">
              <span className="text-xs font-medium">Resolution</span>
              <select value={dpi} onChange={(e) => setDpi(Number(e.target.value))} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm">
                <option value={72}>72 DPI (screen)</option>
                <option value={150}>150 DPI (good)</option>
                <option value={200}>200 DPI (sharp)</option>
                <option value={300}>300 DPI (print)</option>
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-medium">Format</span>
              <select value={format} onChange={(e) => setFormat(e.target.value as 'jpeg' | 'png')} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm">
                <option value="jpeg">JPG</option>
                <option value="png">PNG</option>
              </select>
            </label>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" onClick={() => void render()} disabled={busy} className="rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-50">
              {busy ? 'Rendering…' : 'Render pages'}
            </button>
            {pages.length > 1 && (
              <button type="button" onClick={() => void downloadZip()} className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium hover:bg-accent">
                Download all as ZIP
              </button>
            )}
          </div>

          {pages.length > 0 && (
            <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {pages.map((p) => (
                <li key={p.page} className="rounded-lg border border-border p-2.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.url} alt={`Rendered page ${p.page}`} className="block max-h-56 w-full rounded object-contain bg-slate-50" />
                  <p className="mt-2 flex items-center text-xs text-muted-foreground">
                    Page {p.page} · {p.width}×{p.height} · {formatBytes(p.blob.size)}
                    <a href={p.url} download={`page-${String(p.page).padStart(2, '0')}.${format === 'jpeg' ? 'jpg' : 'png'}`} className="ml-auto font-medium text-blue-700 underline">
                      Download
                    </a>
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
