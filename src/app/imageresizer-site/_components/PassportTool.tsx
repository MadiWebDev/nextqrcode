'use client';

/**
 * Passport / visa / ID photo maker: pick a country preset (official size,
 * background guidance, source + verification date shown), position the
 * portrait with scale/offset controls against a guide overlay, export the
 * exact-size photo and/or a printable sheet (A4 or 4×6") with cut guides.
 *
 * Honesty rules baked in: no face recognition or biometric claims — the
 * overlay is an approximate positioning guide; background colour only
 * fills transparency (it cannot repaint a real backdrop); a compliance
 * disclaimer shows with every preset because acceptance is the issuing
 * authority's decision.
 */
import { useMemo, useState } from 'react';
import { browserEnv } from '../_lib/engine/canvas-env';
import { cropImage } from '../_lib/engine/crop';
import { renderResize } from '../_lib/engine/resize';
import { setBackground } from '../_lib/engine/effects';
import { encodeCanvasOutput } from '../_lib/encode-output';
import { PASSPORT_PRESETS, passportPixels } from '../_lib/passport-presets';
import { FileDrop } from './FileDrop';
import { useImageLoader } from './use-image-loader';

async function canvasToDataUrl(canvas: import('../_lib/engine/canvas-env').CanvasSurface): Promise<string> {
  const blob = await browserEnv.encode(canvas, 'image/jpeg', 0.95);
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Could not read the rendered photo.'));
    reader.readAsDataURL(blob);
  });
}

export default function PassportTool() {
  const { loaded, loading, error, load, setError } = useImageLoader();
  const [presetId, setPresetId] = useState('us');
  const [scale, setScale] = useState(1);
  const [offsetX, setOffsetX] = useState(0); // -50..50 (% of slack)
  const [offsetY, setOffsetY] = useState(0);
  const [paper, setPaper] = useState<'a4' | '4x6'>('4x6');
  const [busy, setBusy] = useState(false);
  const [sheetInfo, setSheetInfo] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<{ url: string; filename: string } | null>(null);

  const preset = PASSPORT_PRESETS.find((p) => p.id === presetId) ?? PASSPORT_PRESETS[0];
  const target = useMemo(() => passportPixels(preset, 300), [preset]);

  /**
   * Compute the cover-fit source rect for the target aspect under the
   * user's scale/offset: scale 1 = smallest cover; larger scale zooms in.
   */
  const sourceRect = useMemo(() => {
    if (!loaded) return null;
    const { width: sw, height: sh } = loaded.decoded;
    const targetAspect = target.width / target.height;
    let cropW = sw;
    let cropH = sw / targetAspect;
    if (cropH > sh) {
      cropH = sh;
      cropW = sh * targetAspect;
    }
    cropW /= scale;
    cropH /= scale;
    const slackX = sw - cropW;
    const slackY = sh - cropH;
    return {
      x: (slackX / 2) * (1 + offsetX / 50),
      y: (slackY / 2) * (1 + offsetY / 50),
      width: cropW,
      height: cropH,
    };
  }, [loaded, target, scale, offsetX, offsetY]);

  const renderPhoto = () => {
    if (!loaded || !sourceRect) return null;
    const cropped = cropImage(browserEnv, loaded.decoded.surface, sourceRect);
    const sized = renderResize(browserEnv, cropped, {
      targetWidth: target.width,
      targetHeight: target.height,
    });
    // Background fill helps only transparent sources (logos/scans); honest
    // no-op for normal opaque photos.
    return setBackground(browserEnv, sized, preset.backgroundHex);
  };

  const downloadSingle = async () => {
    const canvas = renderPhoto();
    if (!canvas) return;
    setBusy(true);
    try {
      const blob = await encodeCanvasOutput(canvas, 'jpeg', 0.95);
      const url = URL.createObjectURL(blob);
      setDownloadUrl({ url, filename: `passport-photo-${preset.id}-${target.width}x${target.height}.jpg` });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export failed.');
    } finally {
      setBusy(false);
    }
  };

  const makeSheet = async () => {
    const canvas = renderPhoto();
    if (!canvas) return;
    setBusy(true);
    setSheetInfo(null);
    try {
      const dataUrl = await canvasToDataUrl(canvas);
      const { jsPDF } = await import('jspdf');
      const photoWmm = preset.widthMm;
      const photoHmm = preset.heightMm;
      const sheet = paper === 'a4' ? { w: 210, h: 297, label: 'A4' } : { w: 101.6, h: 152.4, label: '4×6 inch' };
      const gap = 3;
      const margin = 6;
      const cols = Math.max(1, Math.floor((sheet.w - margin * 2 + gap) / (photoWmm + gap)));
      const rows = Math.max(1, Math.floor((sheet.h - margin * 2 + gap) / (photoHmm + gap)));
      const count = cols * rows;
      const doc = new jsPDF({ unit: 'mm', format: [sheet.w, sheet.h], orientation: sheet.w > sheet.h ? 'landscape' : 'portrait' });
      const startX = (sheet.w - (cols * photoWmm + (cols - 1) * gap)) / 2;
      const startY = (sheet.h - (rows * photoHmm + (rows - 1) * gap)) / 2;
      doc.setDrawColor(170);
      doc.setLineWidth(0.2);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = startX + c * (photoWmm + gap);
          const y = startY + r * (photoHmm + gap);
          doc.addImage(dataUrl, 'JPEG', x, y, photoWmm, photoHmm);
          doc.rect(x, y, photoWmm, photoHmm); // cut guide
        }
      }
      const blob = doc.output('blob');
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `passport-sheet-${preset.id}-${paper}.pdf`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
      setSheetInfo(`${count} photos (${cols}×${rows}) on one ${sheet.label} sheet, with cut guides.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Print sheet failed.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="w-full min-w-0">
      <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        <strong>Please read:</strong> this tool sizes and crops to the published specification —
        it cannot guarantee acceptance. Lighting, expression, head size and background rules are
        judged by the issuing authority. Always check the final photo against the official
        guidance linked for your preset before submitting.
      </div>

      <div className="mt-5">
        <FileDrop onFiles={load} label="Drop a portrait photo (head and shoulders work best)" />
      </div>
      {error && (
        <p role="alert" className="mt-4 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm">
          {error}
        </p>
      )}
      {loading && <p className="mt-4 text-sm text-muted-foreground">Loading photo…</p>}

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="min-w-0 rounded-xl border border-border bg-card p-4 sm:p-5">
          <label className="block">
            <span className="text-xs font-medium">Country / document</span>
            <select
              value={presetId}
              onChange={(e) => setPresetId(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            >
              {PASSPORT_PRESETS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.country} — {p.document}
                </option>
              ))}
            </select>
          </label>
          <dl className="mt-4 space-y-1.5 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Print size</dt>
              <dd className="font-medium">
                {preset.widthMm}×{preset.heightMm} mm
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Pixels at 300 DPI</dt>
              <dd className="font-medium">
                {target.width}×{target.height}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Background guidance</dt>
              <dd className="font-medium">{preset.background}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Source</dt>
              <dd className="text-right">
                <a href={preset.sourceUrl} target="_blank" rel="noreferrer" className="text-blue-700 underline">
                  {preset.source}
                </a>
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Verified</dt>
              <dd className="font-medium">{preset.verifiedAt}</dd>
            </div>
          </dl>

          {loaded && (
            <div className="mt-5 space-y-3">
              <label className="block">
                <span className="text-xs font-medium">Zoom · {scale.toFixed(2)}×</span>
                <input type="range" min={100} max={300} value={Math.round(scale * 100)} onChange={(e) => setScale(Number(e.target.value) / 100)} className="mt-1 w-full accent-blue-700" />
              </label>
              <label className="block">
                <span className="text-xs font-medium">Move left / right</span>
                <input type="range" min={-50} max={50} value={offsetX} onChange={(e) => setOffsetX(Number(e.target.value))} className="mt-1 w-full accent-blue-700" />
              </label>
              <label className="block">
                <span className="text-xs font-medium">Move up / down</span>
                <input type="range" min={-50} max={50} value={offsetY} onChange={(e) => setOffsetY(Number(e.target.value))} className="mt-1 w-full accent-blue-700" />
              </label>
              <p className="text-xs text-muted-foreground">
                Position the head inside the oval guide: crown near the top line, chin near the
                bottom line, eyes around the middle. The guide is approximate — the template
                of the issuing authority prevails.
              </p>
            </div>
          )}
        </div>

        <div className="min-w-0 rounded-xl border border-border bg-card p-4 sm:p-5">
          <h3 className="text-sm font-semibold">Preview & export</h3>
          {loaded ? (
            <>
              <div
                className="relative mx-auto mt-3 w-full max-w-72 overflow-hidden rounded-lg border border-border"
                style={{ aspectRatio: `${target.width} / ${target.height}` }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={loaded.previewUrl}
                  alt="Positioning preview"
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{
                    transform: `scale(${scale * 1.0}) translate(${-offsetX / 4}%, ${-offsetY / 4}%)`,
                    transformOrigin: 'center',
                  }}
                />
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
                  <ellipse cx="50" cy="46" rx="26" ry="34" fill="none" stroke="rgba(29,78,216,0.9)" strokeWidth="1.2" />
                  <line x1="8" y1="14" x2="92" y2="14" stroke="rgba(29,78,216,0.6)" strokeWidth="0.8" strokeDasharray="3 2" />
                  <line x1="8" y1="76" x2="92" y2="76" stroke="rgba(29,78,216,0.6)" strokeWidth="0.8" strokeDasharray="3 2" />
                  <line x1="50" y1="4" x2="50" y2="96" stroke="rgba(29,78,216,0.35)" strokeWidth="0.6" strokeDasharray="2 2" />
                </svg>
              </div>
              <p className="mt-2 text-center text-xs text-muted-foreground">
                Guide preview (the export uses the exact crop maths, not this CSS preview).
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button type="button" onClick={() => void downloadSingle()} disabled={busy} className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-50">
                  Render exact-size photo
                </button>
                <label className="flex items-center gap-2 text-sm">
                  <select value={paper} onChange={(e) => setPaper(e.target.value as 'a4' | '4x6')} className="rounded-lg border border-border bg-background px-2 py-2 text-sm" aria-label="Print sheet paper">
                    <option value="4x6">4×6 inch sheet</option>
                    <option value="a4">A4 sheet</option>
                  </select>
                </label>
                <button type="button" onClick={() => void makeSheet()} disabled={busy} className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-accent disabled:opacity-50">
                  Make print sheet (PDF)
                </button>
              </div>
              {downloadUrl && (
                <div className="mt-3">
                  <p className="text-sm">
                    <a href={downloadUrl.url} download={downloadUrl.filename} className="font-medium text-blue-700 underline">
                      Download {downloadUrl.filename}
                    </a>{' '}
                    — {target.width}×{target.height}px at 300 DPI. This is the exact export:
                  </p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={downloadUrl.url}
                    alt="Rendered passport photo at exact size"
                    className="mx-auto mt-2 w-full max-w-72 rounded-lg border border-border"
                  />
                </div>
              )}
              {sheetInfo && <p className="mt-2 text-sm text-muted-foreground">{sheetInfo}</p>}
            </>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">
              Drop a photo to position it against the guide and export.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
