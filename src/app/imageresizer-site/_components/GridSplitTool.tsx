'use client';

/**
 * Instagram grid splitter: cut one image into a 3×1 / 3×2 / 3×3 (or custom)
 * grid of tiles. Files are numbered in POSTING order — Instagram shows the
 * newest post first, so you post tile 01 (the bottom-right piece) first
 * and the top-left piece last; the finished profile grid then reads as
 * one big image.
 */
import { useState } from 'react';
import { browserEnv } from '../_lib/engine/canvas-env';
import { cropImage } from '../_lib/engine/crop';
import { encodeCanvasOutput } from '../_lib/encode-output';
import { filesToZip, downloadBlob } from '../_lib/engine/export';
import { FileDrop } from './FileDrop';
import { useImageLoader } from './use-image-loader';

interface Tile {
  row: number;
  col: number;
  postOrder: number;
  url: string;
  blob: Blob;
}

export default function GridSplitTool() {
  const { loaded, loading, error, load, setError } = useImageLoader();
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [busy, setBusy] = useState(false);

  const split = async () => {
    if (!loaded) return;
    setBusy(true);
    setError(null);
    setTiles([]);
    try {
      const { width: W, height: H } = loaded.decoded;
      // Centre-crop to the grid's aspect first so tiles are equal.
      const gridAspect = cols / rows;
      const imgAspect = W / H;
      let cropW = W;
      let cropH = H;
      if (imgAspect > gridAspect) cropW = Math.round(H * gridAspect);
      else cropH = Math.round(W / gridAspect);
      const originX = Math.round((W - cropW) / 2);
      const originY = Math.round((H - cropH) / 2);
      const tileW = Math.floor(cropW / cols);
      const tileH = Math.floor(cropH / rows);

      const out: Tile[] = [];
      // Posting order: bottom row first, right to left within each row.
      let order = 0;
      const byPosition = new Map<string, Tile>();
      for (let r = rows - 1; r >= 0; r--) {
        for (let c = cols - 1; c >= 0; c--) {
          order += 1;
          const canvas = cropImage(browserEnv, loaded.decoded.surface, {
            x: originX + c * tileW,
            y: originY + r * tileH,
            width: tileW,
            height: tileH,
          });
          const blob = await encodeCanvasOutput(canvas, 'jpeg', 0.92);
          const tile: Tile = { row: r, col: c, postOrder: order, url: URL.createObjectURL(blob), blob };
          byPosition.set(`${r}-${c}`, tile);
          out.push(tile);
        }
      }
      setTiles(out);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Splitting failed.');
    } finally {
      setBusy(false);
    }
  };

  const downloadZip = async () => {
    const zip = await filesToZip(
      tiles.map((t) => ({
        name: `grid-post-${String(t.postOrder).padStart(2, '0')}.jpg`,
        blob: t.blob,
      }))
    );
    downloadBlob(zip, 'instagram-grid.zip');
  };

  return (
    <div className="w-full min-w-0">
      <FileDrop onFiles={load} label="Drop the image to split into a grid" />
      {error && (
        <p role="alert" className="mt-4 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm">{error}</p>
      )}
      {loading && <p className="mt-4 text-sm text-muted-foreground">Loading image…</p>}
      {loaded && (
        <div className="mt-6 rounded-xl border border-border bg-card p-4 sm:p-5">
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex gap-2" role="group" aria-label="Grid presets">
              {([
                [1, 3, '3×1 banner'],
                [2, 3, '3×2'],
                [3, 3, '3×3'],
              ] as Array<[number, number, string]>).map(([r, c, label]) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => {
                    setRows(r);
                    setCols(c);
                  }}
                  className={`rounded-lg px-3 py-2 text-sm font-medium ${rows === r && cols === c ? 'bg-blue-700 text-white' : 'bg-accent hover:bg-accent/70'}`}
                >
                  {label}
                </button>
              ))}
            </div>
            <label className="block">
              <span className="text-xs font-medium">Rows</span>
              <select value={rows} onChange={(e) => setRows(Number(e.target.value))} className="mt-1 rounded-lg border border-border bg-background px-3 py-2 text-sm">
                {[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-medium">Columns</span>
              <select value={cols} onChange={(e) => setCols(Number(e.target.value))} className="mt-1 rounded-lg border border-border bg-background px-3 py-2 text-sm">
                {[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </label>
            <button type="button" onClick={() => void split()} disabled={busy} className="rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-50">
              {busy ? 'Splitting…' : `Split into ${rows * cols} tiles`}
            </button>
            {tiles.length > 0 && (
              <button type="button" onClick={() => void downloadZip()} className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium hover:bg-accent">
                Download ZIP (numbered in posting order)
              </button>
            )}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            The image is centre-cropped to the shape of the grid first. Post the tiles in number order
            (01 first): Instagram puts the newest post top-left, so posting the bottom-right tile
            first makes the finished grid read correctly.
          </p>

          {tiles.length > 0 && (
            <div
              className="mx-auto mt-5 grid w-full max-w-2xl gap-0.5"
              style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
            >
              {Array.from({ length: rows }, (_, r) =>
                Array.from({ length: cols }, (_, c) => {
                  const tile = tiles.find((t) => t.row === r && t.col === c);
                  if (!tile) return null;
                  return (
                    <div key={`${r}-${c}`} className="relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={tile.url} alt={`Tile row ${r + 1} column ${c + 1}`} className="block aspect-square w-full object-cover" />
                      <span className="absolute top-1 left-1 rounded bg-black/65 px-1.5 py-0.5 text-xs font-bold text-white">
                        Post {tile.postOrder}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
