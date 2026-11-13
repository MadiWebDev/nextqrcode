'use client';

/**
 * Favicon & app-icon generator: one image → the full standard icon set
 * (16/32/48/180/192/512 PNG), a REAL .ico file (PNG entries packed into
 * the documented ICO container by _lib/engine/ico), a ZIP of everything,
 * and the matching HTML snippet.
 */
import { useState } from 'react';
import { browserEnv } from '../_lib/engine/canvas-env';
import { renderResize } from '../_lib/engine/resize';
import { buildIco, FAVICON_SIZES, faviconHtmlSnippet } from '../_lib/engine/ico';
import { filesToZip, downloadBlob } from '../_lib/engine/export';
import { formatBytes } from '../_lib/format';
import { FileDrop } from './FileDrop';
import { useImageLoader } from './use-image-loader';

interface IconFile {
  name: string;
  blob: Blob;
  url: string;
  size: number;
}

const NAME_FOR_SIZE: Record<number, string> = {
  16: 'favicon-16x16.png',
  32: 'favicon-32x32.png',
  48: 'favicon-48x48.png',
  180: 'apple-touch-icon.png',
  192: 'android-chrome-192x192.png',
  512: 'android-chrome-512x512.png',
};

export default function FaviconTool() {
  const { loaded, loading, error, load, setError } = useImageLoader();
  const [icons, setIcons] = useState<IconFile[]>([]);
  const [busy, setBusy] = useState(false);
  const [zipping, setZipping] = useState(false);

  const generate = async () => {
    if (!loaded) return;
    setBusy(true);
    setError(null);
    try {
      // Centre square crop first so non-square logos aren't distorted.
      const out: IconFile[] = [];
      const pngBySize = new Map<number, Uint8Array>();
      for (const size of FAVICON_SIZES) {
        const canvas = renderResize(browserEnv, loaded.decoded.surface, {
          targetWidth: size,
          targetHeight: size,
          fit: 'cover',
        });
        const blob = await browserEnv.encode(canvas, 'image/png');
        pngBySize.set(size, new Uint8Array(await blob.arrayBuffer()));
        out.push({ name: NAME_FOR_SIZE[size], blob, url: URL.createObjectURL(blob), size });
      }
      const icoBytes = buildIco(
        [16, 32, 48].map((size) => ({ size, png: pngBySize.get(size)! }))
      );
      const icoBlob = new Blob([icoBytes.buffer as ArrayBuffer], { type: 'image/x-icon' });
      out.unshift({ name: 'favicon.ico', blob: icoBlob, url: URL.createObjectURL(icoBlob), size: 0 });
      setIcons(out);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Icon generation failed.');
    } finally {
      setBusy(false);
    }
  };

  const downloadZip = async () => {
    setZipping(true);
    try {
      const files = icons.map((i) => ({ name: i.name, blob: i.blob }));
      files.push({
        name: 'favicon-links.html',
        blob: new Blob([faviconHtmlSnippet()], { type: 'text/html' }),
      });
      const zip = await filesToZip(files);
      downloadBlob(zip, 'favicons.zip');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ZIP failed.');
    } finally {
      setZipping(false);
    }
  };

  return (
    <div className="w-full min-w-0">
      <FileDrop onFiles={load} label="Drop a logo or image (square works best)" />
      {error && (
        <p role="alert" className="mt-4 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm">{error}</p>
      )}
      {loading && <p className="mt-4 text-sm text-muted-foreground">Loading image…</p>}
      {loaded && (
        <div className="mt-6 rounded-xl border border-border bg-card p-4 sm:p-5">
          <div className="flex flex-wrap items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={loaded.previewUrl} alt="Source for icons" className="h-16 w-16 rounded-lg border border-border object-cover" />
            <div className="text-sm">
              <p className="font-medium">{loaded.name}</p>
              <p className="text-muted-foreground">
                {loaded.decoded.width}×{loaded.decoded.height} — non-square images are centre-cropped
                to a square for icons.
              </p>
            </div>
            <button type="button" onClick={() => void generate()} disabled={busy} className="ml-auto rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-50">
              {busy ? 'Generating…' : 'Generate icon set'}
            </button>
          </div>

          {icons.length > 0 && (
            <>
              <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                {icons.map((icon) => (
                  <li key={icon.name} className="flex items-center gap-3 rounded-lg border border-border px-3 py-2 text-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={icon.url} alt="" className="h-8 w-8 object-contain" />
                    <span className="min-w-0">
                      <span className="block truncate font-medium">{icon.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {icon.size ? `${icon.size}×${icon.size} · ` : ''}{formatBytes(icon.blob.size)}
                      </span>
                    </span>
                    <a href={icon.url} download={icon.name} className="ml-auto shrink-0 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-accent">
                      Download
                    </a>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button type="button" onClick={() => void downloadZip()} disabled={zipping} className="rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-50">
                  {zipping ? 'Zipping…' : 'Download all as ZIP'}
                </button>
                <span className="text-xs text-muted-foreground">The ZIP includes favicon-links.html with the tags below.</span>
              </div>
              <pre className="mt-4 overflow-x-auto rounded-lg bg-slate-900 p-4 text-xs text-slate-100">{faviconHtmlSnippet()}</pre>
            </>
          )}
        </div>
      )}
    </div>
  );
}
