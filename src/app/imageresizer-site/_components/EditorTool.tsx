'use client';

/**
 * Professional image editor: upload once, then chain operations in a fixed,
 * documented stage order (crop → resize → rotate/flip → background →
 * adjustments → corners → border → watermark). Fully non-destructive — the
 * original is never modified; every preview and export re-renders from it,
 * and undo/redo walk snapshots of the settings object.
 */
import { useEffect, useRef, useState } from 'react';
import { browserEnv } from '../_lib/engine/canvas-env';
import {
  DEFAULT_ADJUSTMENTS,
  type AdjustmentSet,
} from '../_lib/engine/adjustments';
import type { OutputFormat } from '../_lib/engine/types';
import { baseNameOf } from '../_lib/engine/naming';
import {
  DEFAULT_EDITOR_SETTINGS,
  renderEditorPipeline,
  type EditorSettings,
} from '../_lib/editor';
import { encodeCanvasOutput } from '../_lib/encode-output';
import { formatBytes } from '../_lib/format';
import { FileDrop } from './FileDrop';
import CompareSlider from './CompareSlider';
import { FormatSelect, STANDARD_FORMATS } from './ResultPanel';
import { Histogram } from './Histogram';
import type { CanvasSurface } from '../_lib/engine/canvas-env';
import { useImageLoader, useResultImage } from './use-image-loader';

const EXT: Record<string, string> = { jpeg: 'jpg', png: 'png', webp: 'webp', avif: 'avif', gif: 'gif' };
const clone = (s: EditorSettings): EditorSettings => JSON.parse(JSON.stringify(s)) as EditorSettings;

type TabId = 'adjust' | 'transform' | 'size' | 'style' | 'watermark' | 'export';
const TABS: Array<{ id: TabId; label: string }> = [
  { id: 'adjust', label: 'Adjust' },
  { id: 'transform', label: 'Transform' },
  { id: 'size', label: 'Crop & Resize' },
  { id: 'style', label: 'Style' },
  { id: 'watermark', label: 'Watermark' },
  { id: 'export', label: 'Export' },
];

function Slider({
  label,
  min,
  max,
  step = 1,
  value,
  display,
  onBegin,
  onLive,
  onEnd,
}: {
  label: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  display?: string;
  onBegin: () => void;
  onLive: (v: number) => void;
  onEnd: () => void;
}) {
  return (
    <label className="block">
      <span className="flex items-center justify-between text-xs font-medium">
        <span>{label}</span>
        <span className="text-muted-foreground">{display ?? value}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onPointerDown={onBegin}
        onFocus={onBegin}
        onChange={(e) => onLive(Number(e.target.value))}
        onPointerUp={onEnd}
        onBlur={onEnd}
        className="mt-1 w-full accent-blue-700"
        aria-label={label}
      />
    </label>
  );
}

const inputCls =
  'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm';
const btnCls =
  'rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium hover:bg-accent';
const primaryBtnCls =
  'rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-50';

export default function EditorTool() {
  const loader = useImageLoader();
  const logoLoader = useImageLoader();
  const { result, setResult } = useResultImage();
  const [settings, setSettingsState] = useState<EditorSettings>(() => clone(DEFAULT_EDITOR_SETTINGS));
  const [past, setPast] = useState<EditorSettings[]>([]);
  const [future, setFuture] = useState<EditorSettings[]>([]);
  const [tab, setTab] = useState<TabId>('adjust');
  const [format, setFormat] = useState<OutputFormat>('jpeg');
  const [quality, setQuality] = useState(0.9);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [compare, setCompare] = useState(false);
  const [previewCanvas, setPreviewCanvas] = useState<CanvasSurface | null>(null);
  const [qrCanvas, setQrCanvas] = useState<CanvasSurface | null>(null);
  const [lockAspect, setLockAspect] = useState(true);
  const dragSnap = useRef<EditorSettings | null>(null);
  const runCounter = useRef(0);

  const loaded = loader.loaded;
  const origW = loaded?.decoded.width ?? 0;
  const origH = loaded?.decoded.height ?? 0;
  const stageW = Math.max(1, Math.round((settings.crop ? settings.crop.w : 1) * origW));
  const stageH = Math.max(1, Math.round((settings.crop ? settings.crop.h : 1) * origH));

  /* ---- history ---- */
  const applyChange = (next: EditorSettings) => {
    setPast((p) => [...p.slice(-49), settings]);
    setFuture([]);
    setSettingsState(next);
  };
  const beginDrag = () => {
    if (!dragSnap.current) dragSnap.current = settings;
  };
  const endDrag = () => {
    if (dragSnap.current && JSON.stringify(dragSnap.current) !== JSON.stringify(settings)) {
      setPast((p) => [...p.slice(-49), dragSnap.current as EditorSettings]);
      setFuture([]);
    }
    dragSnap.current = null;
  };
  const undo = () => {
    setPast((p) => {
      if (p.length === 0) return p;
      const prev = p[p.length - 1];
      setFuture((f) => [settings, ...f]);
      setSettingsState(prev);
      return p.slice(0, -1);
    });
  };
  const redo = () => {
    setFuture((f) => {
      if (f.length === 0) return f;
      const [next, ...rest] = f;
      setPast((p) => [...p, settings]);
      setSettingsState(next);
      return rest;
    });
  };

  const setAdj = (patch: Partial<AdjustmentSet>, live: boolean) => {
    const next = { ...settings, adjustments: { ...settings.adjustments, ...patch } };
    if (live) setSettingsState(next);
    else applyChange(next);
  };

  /* Generate the QR drawable whenever the overlay text changes. */
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      void (async () => {
        const text = settings.qrOverlay?.text?.trim();
        if (!text) {
          if (!cancelled) setQrCanvas(null);
          return;
        }
        try {
          const QRCode = (await import('qrcode')).default;
          const el = document.createElement('canvas');
          await QRCode.toCanvas(el, text, { width: 480, margin: 1, errorCorrectionLevel: 'M' });
          if (!cancelled) setQrCanvas(el as unknown as CanvasSurface);
        } catch {
          if (!cancelled) setQrCanvas(null);
        }
      })();
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [settings.qrOverlay?.text]);

  /* ---- render pipeline (debounced) ---- */
  // A loaded logo activates the image-watermark stage with default settings
  // until the user customizes them (derived, not stored, so undo stays clean).
  const pipelineSettings: EditorSettings =
    logoLoader.loaded && !settings.imageWatermark
      ? {
          ...settings,
          imageWatermark: { position: 'bottom-right', opacity: 0.8, widthFraction: 0.25 },
        }
      : settings;

  useEffect(() => {
    if (!loaded) return;
    const runId = ++runCounter.current;
    const timer = setTimeout(() => {
      void (async () => {
        setBusy(true);
        try {
          const canvas = renderEditorPipeline(
            browserEnv,
            loaded.decoded.surface,
            pipelineSettings,
            {
              watermarkImage: logoLoader.loaded?.decoded.surface ?? null,
              qrImage: qrCanvas,
            }
          );
          setPreviewCanvas(canvas);
          const blob = await encodeCanvasOutput(canvas, format, quality);
          if (runCounter.current !== runId) return;
          setError(null);
          setResult({
            blob,
            filename: `${baseNameOf(loaded.name)}-edited.${EXT[format]}`,
            width: canvas.width,
            height: canvas.height,
          });
        } catch (err) {
          if (runCounter.current !== runId) return;
          setError(err instanceof Error ? err.message : 'Rendering failed.');
        } finally {
          if (runCounter.current === runId) setBusy(false);
        }
      })();
    }, 160);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, pipelineSettings, format, quality, logoLoader.loaded, qrCanvas]);

  if (!loaded) {
    return (
      <div>
        <FileDrop
          onFiles={(files) => void loader.load(files)}
          multiple={false}
          label="Drop an image to start editing — it never leaves your browser"
        />
        {(loader.error || error) && (
          <p role="alert" className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">
            {loader.error || error}
          </p>
        )}
        {loader.loading && <p className="mt-3 text-sm text-muted-foreground">Opening image…</p>}
      </div>
    );
  }

  const crop = settings.crop ?? { x: 0, y: 0, w: 1, h: 1 };
  const cropEnabled = settings.crop !== null;
  const resize = settings.resize ?? { width: stageW, height: stageH };
  const wm = settings.textWatermark ?? {
    text: '',
    position: 'bottom-right' as const,
    opacity: 0.6,
    sizeFraction: 0.05,
    color: '#ffffff',
  };
  const iwm = settings.imageWatermark ?? {
    position: 'bottom-right' as const,
    opacity: 0.8,
    widthFraction: 0.25,
  };

  const adjSlider = (
    key: keyof AdjustmentSet,
    label: string,
    min: number,
    max: number,
    display?: (v: number) => string
  ) => (
    <Slider
      key={key}
      label={label}
      min={min}
      max={max}
      value={Number(settings.adjustments[key])}
      display={display ? display(Number(settings.adjustments[key])) : undefined}
      onBegin={beginDrag}
      onLive={(v) => setAdj({ [key]: v } as Partial<AdjustmentSet>, true)}
      onEnd={endDrag}
    />
  );

  return (
    <div>
      <div className="grid gap-4 lg:grid-cols-[180px_minmax(0,1fr)] xl:grid-cols-[180px_minmax(0,1fr)_300px]">
        {/* Tool tabs */}
        <nav aria-label="Editor tools" className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              aria-pressed={tab === t.id}
              className={`shrink-0 rounded-lg px-3 py-2 text-left text-sm font-medium ${
                tab === t.id ? 'bg-blue-700 text-white' : 'bg-accent/60 hover:bg-accent'
              }`}
            >
              {t.label}
            </button>
          ))}
          <div className="mt-2 hidden rounded-lg bg-accent/50 p-3 text-xs text-muted-foreground lg:block">
            <p className="font-semibold text-foreground">Stage order</p>
            <p className="mt-1">Crop → Resize → Rotate/Flip → Background → Adjustments → Corners → Border → Watermark. The original file is never modified.</p>
          </div>
        </nav>

        {/* Canvas area */}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="truncate text-sm font-medium">{loaded.name}</span>
            <span className="text-xs text-muted-foreground">
              {origW}×{origH} · {formatBytes(loaded.sizeBytes)}
              {result && (
                <>
                  {' '}→ {result.width}×{result.height} · {formatBytes(result.blob.size)}
                </>
              )}
            </span>
            <span className="ml-auto flex items-center gap-2">
              <label className="flex items-center gap-1.5 text-xs font-medium">
                <input
                  type="checkbox"
                  checked={compare}
                  onChange={(e) => setCompare(e.target.checked)}
                  className="accent-blue-700"
                />
                Compare with original
              </label>
            </span>
          </div>
          <div className="mt-3">
            {compare && result ? (
              <CompareSlider beforeUrl={loaded.previewUrl} afterUrl={result.url} />
            ) : result ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={result.url}
                alt="Edited preview"
                className="mx-auto block max-h-[520px] w-auto max-w-full rounded-xl bg-slate-100 object-contain"
              />
            ) : (
              <div className="flex h-64 items-center justify-center rounded-xl bg-slate-100 text-sm text-muted-foreground">
                {busy ? 'Rendering…' : 'Preview will appear here'}
              </div>
            )}
          </div>
          {busy && <p className="mt-2 text-xs text-muted-foreground">Rendering…</p>}
          {error && (
            <p role="alert" className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">
              {error}
            </p>
          )}
          {/* Bottom bar */}
          <div className="mt-4 flex flex-wrap items-center gap-2 rounded-xl border border-border bg-card p-3">
            <button type="button" className={btnCls} onClick={undo} disabled={past.length === 0}>
              ↩ Undo
            </button>
            <button type="button" className={btnCls} onClick={redo} disabled={future.length === 0}>
              ↪ Redo
            </button>
            <button
              type="button"
              className={btnCls}
              onClick={() => applyChange(clone(DEFAULT_EDITOR_SETTINGS))}
            >
              Reset all
            </button>
            <button
              type="button"
              className={btnCls}
              onClick={() => {
                loader.reset();
                logoLoader.reset();
                setResult(null);
                setPast([]);
                setFuture([]);
                setSettingsState(clone(DEFAULT_EDITOR_SETTINGS));
              }}
            >
              Edit a different image
            </button>
            <span className="ml-auto flex items-center gap-2">
              <span className="hidden text-xs text-muted-foreground sm:inline">
                {past.length} step{past.length === 1 ? '' : 's'} in history
              </span>
              {result ? (
                <a href={result.url} download={result.filename} className={primaryBtnCls}>
                  Download {result.filename.split('.').pop()?.toUpperCase()}
                </a>
              ) : (
                <button type="button" className={primaryBtnCls} disabled>
                  Download
                </button>
              )}
            </span>
          </div>
        </div>

        {/* Settings panel */}
        <div className="rounded-xl border border-border bg-card p-4 lg:col-span-2 xl:col-span-1">
          {tab === 'adjust' && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Adjustments</h3>
              <Histogram canvas={previewCanvas} />
              {adjSlider('levelsBlack', 'Levels · black point', 0, 254)}
              {adjSlider('levelsWhite', 'Levels · white point', 1, 255)}
              <Slider
                label="Levels · gamma"
                min={20}
                max={300}
                value={Math.round(settings.adjustments.levelsGamma * 100)}
                display={settings.adjustments.levelsGamma.toFixed(2)}
                onBegin={beginDrag}
                onLive={(v) => setAdj({ levelsGamma: v / 100 }, true)}
                onEnd={endDrag}
              />
              {adjSlider('exposure', 'Exposure', -100, 100)}
              {adjSlider('brightness', 'Brightness', -100, 100)}
              {adjSlider('contrast', 'Contrast', -100, 100)}
              {adjSlider('saturation', 'Saturation', -100, 100)}
              {adjSlider('hue', 'Hue rotate', -180, 180, (v) => `${v}°`)}
              {adjSlider('grayscale', 'Grayscale', 0, 100, (v) => `${v}%`)}
              {adjSlider('sepia', 'Sepia', 0, 100, (v) => `${v}%`)}
              {adjSlider('blur', 'Blur', 0, 20, (v) => `${v}px`)}
              {adjSlider('sharpen', 'Sharpen', 0, 100)}
              {adjSlider('pixelate', 'Pixelate', 0, 40, (v) => (v <= 1 ? 'off' : `${v}px`))}
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={settings.adjustments.invert}
                  onChange={(e) => setAdj({ invert: e.target.checked }, false)}
                  className="accent-blue-700"
                />
                Invert colours
              </label>
              <button
                type="button"
                className={btnCls}
                onClick={() =>
                  applyChange({ ...settings, adjustments: { ...DEFAULT_ADJUSTMENTS } })
                }
              >
                Reset adjustments
              </button>
            </div>
          )}

          {tab === 'transform' && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Rotate & flip</h3>
              <Slider
                label="Angle"
                min={-180}
                max={180}
                value={settings.angle}
                display={`${settings.angle}°`}
                onBegin={beginDrag}
                onLive={(v) => setSettingsState({ ...settings, angle: v })}
                onEnd={endDrag}
              />
              <div className="flex flex-wrap gap-2">
                {[-90, 90, 180].map((a) => (
                  <button
                    key={a}
                    type="button"
                    className={btnCls}
                    onClick={() =>
                      applyChange({ ...settings, angle: ((settings.angle + a + 180) % 360) - 180 })
                    }
                  >
                    {a > 0 ? `+${a}°` : `${a}°`}
                  </button>
                ))}
                <button type="button" className={btnCls} onClick={() => applyChange({ ...settings, angle: 0 })}>
                  Straighten (0°)
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  aria-pressed={settings.flipH}
                  className={`${btnCls} ${settings.flipH ? 'border-blue-700 bg-blue-50' : ''}`}
                  onClick={() => applyChange({ ...settings, flipH: !settings.flipH })}
                >
                  Flip horizontal
                </button>
                <button
                  type="button"
                  aria-pressed={settings.flipV}
                  className={`${btnCls} ${settings.flipV ? 'border-blue-700 bg-blue-50' : ''}`}
                  onClick={() => applyChange({ ...settings, flipV: !settings.flipV })}
                >
                  Flip vertical
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Arbitrary angles expand the canvas and fill the corners with transparency
                (choose a background colour in Style to fill them instead).
              </p>
              <div className="border-t border-border pt-3">
                <button
                  type="button"
                  className={btnCls}
                  onClick={() =>
                    applyChange({
                      ...settings,
                      resize: { width: stageW * 2, height: stageH * 2 },
                      enhance: true,
                    })
                  }
                >
                  Enhance &amp; upscale 2×
                </button>
                <p className="mt-1 text-xs text-muted-foreground">
                  Multi-step resampling plus an unsharp mask. This is honest resampling-based
                  enhancement — it cannot invent detail that is not in the photo (it is not
                  AI upscaling).
                </p>
              </div>
            </div>
          )}

          {tab === 'size' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold">Crop (percent of original)</h3>
                <label className="mt-2 flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={cropEnabled}
                    onChange={(e) =>
                      applyChange({
                        ...settings,
                        crop: e.target.checked ? { x: 0, y: 0, w: 1, h: 1 } : null,
                      })
                    }
                    className="accent-blue-700"
                  />
                  Enable crop
                </label>
                {cropEnabled && (
                  <>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {(
                        [
                          ['x', 'Left %'],
                          ['y', 'Top %'],
                          ['w', 'Width %'],
                          ['h', 'Height %'],
                        ] as const
                      ).map(([key, label]) => (
                        <label key={key} className="block">
                          <span className="text-xs font-medium">{label}</span>
                          <input
                            type="number"
                            min={0}
                            max={100}
                            step={0.5}
                            value={Math.round(crop[key] * 1000) / 10}
                            onChange={(e) => {
                              const v = Math.min(100, Math.max(0, Number(e.target.value) || 0)) / 100;
                              const next = { ...crop, [key]: v };
                              if (next.x + next.w > 1) next.w = 1 - next.x;
                              if (next.y + next.h > 1) next.h = 1 - next.y;
                              applyChange({ ...settings, crop: next });
                            }}
                            className={inputCls}
                          />
                        </label>
                      ))}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {[
                        ['1:1', 1],
                        ['4:3', 4 / 3],
                        ['3:2', 3 / 2],
                        ['16:9', 16 / 9],
                        ['9:16', 9 / 16],
                      ].map(([label, ratio]) => (
                        <button
                          key={label}
                          type="button"
                          className={btnCls}
                          onClick={() => {
                            const r = Number(ratio);
                            // Largest centred crop with this aspect (in fraction space,
                            // accounting for the source aspect).
                            const srcAspect = origW / origH;
                            let w = 1;
                            let h = (w * srcAspect) / r;
                            if (h > 1) {
                              h = 1;
                              w = (h * r) / srcAspect;
                            }
                            applyChange({
                              ...settings,
                              crop: { x: (1 - w) / 2, y: (1 - h) / 2, w, h },
                            });
                          }}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Cropped area: {stageW}×{stageH}px. For drag-handles cropping, the
                      dedicated Crop tool offers the full interactive canvas.
                    </p>
                  </>
                )}
              </div>
              <div>
                <h3 className="text-sm font-semibold">Resize</h3>
                <label className="mt-2 flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={settings.resize !== null}
                    onChange={(e) =>
                      applyChange({
                        ...settings,
                        resize: e.target.checked ? { width: stageW, height: stageH } : null,
                      })
                    }
                    className="accent-blue-700"
                  />
                  Resize output
                </label>
                {settings.resize && (
                  <>
                    <label className="mt-2 flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={settings.enhance}
                        onChange={(e) => applyChange({ ...settings, enhance: e.target.checked })}
                        className="accent-blue-700"
                      />
                      Enhance while resizing (multi-step resampling + unsharp mask)
                    </label>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <label className="block">
                        <span className="text-xs font-medium">Width px</span>
                        <input
                          type="number"
                          min={1}
                          max={16000}
                          value={resize.width}
                          onChange={(e) => {
                            const w = Math.max(1, Number(e.target.value) || 1);
                            const h = lockAspect
                              ? Math.max(1, Math.round((w * stageH) / stageW))
                              : resize.height;
                            applyChange({ ...settings, resize: { width: w, height: h } });
                          }}
                          className={inputCls}
                        />
                      </label>
                      <label className="block">
                        <span className="text-xs font-medium">Height px</span>
                        <input
                          type="number"
                          min={1}
                          max={16000}
                          value={resize.height}
                          onChange={(e) => {
                            const h = Math.max(1, Number(e.target.value) || 1);
                            const w = lockAspect
                              ? Math.max(1, Math.round((h * stageW) / stageH))
                              : resize.width;
                            applyChange({ ...settings, resize: { width: w, height: h } });
                          }}
                          className={inputCls}
                        />
                      </label>
                    </div>
                    <label className="mt-2 flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={lockAspect}
                        onChange={(e) => setLockAspect(e.target.checked)}
                        className="accent-blue-700"
                      />
                      Keep aspect ratio
                    </label>
                    <div className="mt-2 flex gap-2">
                      {[50, 75, 150, 200].map((pct) => (
                        <button
                          key={pct}
                          type="button"
                          className={btnCls}
                          onClick={() =>
                            applyChange({
                              ...settings,
                              resize: {
                                width: Math.max(1, Math.round((stageW * pct) / 100)),
                                height: Math.max(1, Math.round((stageH * pct) / 100)),
                              },
                            })
                          }
                        >
                          {pct}%
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {tab === 'style' && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Background, corners & border</h3>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={settings.background !== null}
                  onChange={(e) =>
                    applyChange({ ...settings, background: e.target.checked ? '#ffffff' : null })
                  }
                  className="accent-blue-700"
                />
                Fill transparent areas with a background colour
              </label>
              {settings.background && (
                <label className="flex items-center gap-3 text-sm">
                  <input
                    type="color"
                    value={settings.background}
                    onChange={(e) => applyChange({ ...settings, background: e.target.value })}
                    className="h-9 w-14 rounded border border-border"
                    aria-label="Background colour"
                  />
                  <span className="text-xs text-muted-foreground">
                    Fills transparency (e.g. PNG logos, rotation corners). It does not cut out
                    subjects from photos.
                  </span>
                </label>
              )}
              <Slider
                label="Rounded corners"
                min={0}
                max={200}
                value={settings.cornerRadius}
                display={settings.cornerRadius === 0 ? 'off' : `${settings.cornerRadius}px`}
                onBegin={beginDrag}
                onLive={(v) => setSettingsState({ ...settings, cornerRadius: v })}
                onEnd={endDrag}
              />
              <Slider
                label="Border width"
                min={0}
                max={60}
                value={settings.borderWidth}
                display={settings.borderWidth === 0 ? 'off' : `${settings.borderWidth}px`}
                onBegin={beginDrag}
                onLive={(v) => setSettingsState({ ...settings, borderWidth: v })}
                onEnd={endDrag}
              />
              {settings.borderWidth > 0 && (
                <label className="flex items-center gap-3 text-sm">
                  <input
                    type="color"
                    value={settings.borderColor}
                    onChange={(e) => applyChange({ ...settings, borderColor: e.target.value })}
                    className="h-9 w-14 rounded border border-border"
                    aria-label="Border colour"
                  />
                  <span className="text-xs">Border colour</span>
                </label>
              )}
              <p className="text-xs text-muted-foreground">
                Rounded corners and transparency need PNG or WebP output — JPG has no
                transparency, so corners would turn black there.
              </p>
            </div>
          )}

          {tab === 'watermark' && (
            <div className="space-y-4">
              <div className="space-y-3">
                <h3 className="text-sm font-semibold">Text watermark</h3>
                <input
                  type="text"
                  value={wm.text}
                  maxLength={60}
                  placeholder="© Your name or brand"
                  onChange={(e) =>
                    applyChange({
                      ...settings,
                      textWatermark: e.target.value ? { ...wm, text: e.target.value } : null,
                    })
                  }
                  className={inputCls}
                  aria-label="Watermark text"
                />
                {settings.textWatermark && (
                  <>
                    <label className="block">
                      <span className="text-xs font-medium">Position</span>
                      <select
                        value={wm.position}
                        onChange={(e) =>
                          applyChange({
                            ...settings,
                            textWatermark: {
                              ...wm,
                              position: e.target.value as typeof wm.position,
                            },
                          })
                        }
                        className={inputCls}
                      >
                        <option value="bottom-right">Bottom right</option>
                        <option value="bottom-left">Bottom left</option>
                        <option value="top-right">Top right</option>
                        <option value="top-left">Top left</option>
                        <option value="center">Centre</option>
                        <option value="tile">Tiled (repeated)</option>
                      </select>
                    </label>
                    <Slider
                      label="Opacity"
                      min={5}
                      max={100}
                      value={Math.round(wm.opacity * 100)}
                      display={`${Math.round(wm.opacity * 100)}%`}
                      onBegin={beginDrag}
                      onLive={(v) =>
                        setSettingsState({
                          ...settings,
                          textWatermark: { ...wm, opacity: v / 100 },
                        })
                      }
                      onEnd={endDrag}
                    />
                    <Slider
                      label="Size"
                      min={2}
                      max={15}
                      value={Math.round(wm.sizeFraction * 100)}
                      display={`${Math.round(wm.sizeFraction * 100)}% of width`}
                      onBegin={beginDrag}
                      onLive={(v) =>
                        setSettingsState({
                          ...settings,
                          textWatermark: { ...wm, sizeFraction: v / 100 },
                        })
                      }
                      onEnd={endDrag}
                    />
                    <label className="flex items-center gap-3 text-sm">
                      <input
                        type="color"
                        value={wm.color}
                        onChange={(e) =>
                          applyChange({ ...settings, textWatermark: { ...wm, color: e.target.value } })
                        }
                        className="h-9 w-14 rounded border border-border"
                        aria-label="Watermark colour"
                      />
                      <span className="text-xs">Text colour</span>
                    </label>
                  </>
                )}
              </div>
              <div className="space-y-3 border-t border-border pt-4">
                <h3 className="text-sm font-semibold">Logo watermark</h3>
                {!logoLoader.loaded ? (
                  <FileDrop
                    onFiles={(files) => void logoLoader.load(files)}
                    multiple={false}
                    label="Drop a logo image (PNG with transparency works best)"
                  />
                ) : (
                  <>
                    <p className="text-xs text-muted-foreground">
                      Logo: {logoLoader.loaded.name} ({logoLoader.loaded.decoded.width}×
                      {logoLoader.loaded.decoded.height})
                    </p>
                    <label className="block">
                      <span className="text-xs font-medium">Position</span>
                      <select
                        value={iwm.position}
                        onChange={(e) =>
                          applyChange({
                            ...settings,
                            imageWatermark: {
                              ...iwm,
                              position: e.target.value as typeof iwm.position,
                            },
                          })
                        }
                        className={inputCls}
                      >
                        <option value="bottom-right">Bottom right</option>
                        <option value="bottom-left">Bottom left</option>
                        <option value="top-right">Top right</option>
                        <option value="top-left">Top left</option>
                        <option value="center">Centre</option>
                      </select>
                    </label>
                    <Slider
                      label="Opacity"
                      min={5}
                      max={100}
                      value={Math.round(iwm.opacity * 100)}
                      display={`${Math.round(iwm.opacity * 100)}%`}
                      onBegin={beginDrag}
                      onLive={(v) =>
                        setSettingsState({
                          ...settings,
                          imageWatermark: { ...iwm, opacity: v / 100 },
                        })
                      }
                      onEnd={endDrag}
                    />
                    <Slider
                      label="Width"
                      min={5}
                      max={60}
                      value={Math.round(iwm.widthFraction * 100)}
                      display={`${Math.round(iwm.widthFraction * 100)}% of image width`}
                      onBegin={beginDrag}
                      onLive={(v) =>
                        setSettingsState({
                          ...settings,
                          imageWatermark: { ...iwm, widthFraction: v / 100 },
                        })
                      }
                      onEnd={endDrag}
                    />
                    <button
                      type="button"
                      className={btnCls}
                      onClick={() => {
                        logoLoader.reset();
                        applyChange({ ...settings, imageWatermark: null });
                      }}
                    >
                      Remove logo
                    </button>
                  </>
                )}
                {logoLoader.error && (
                  <p role="alert" className="text-sm text-red-700">
                    {logoLoader.error}
                  </p>
                )}
              </div>
              <div className="space-y-3 border-t border-border pt-4">
                <h3 className="text-sm font-semibold">QR code overlay</h3>
                <p className="text-xs text-muted-foreground">
                  Stamp a scannable QR code (link, text, Wi-Fi details…) onto the image. It is
                  drawn on a solid white backing with a quiet zone so scanners can read it.
                </p>
                <input
                  type="text"
                  value={settings.qrOverlay?.text ?? ''}
                  maxLength={300}
                  placeholder="https://your-link.example or any text"
                  onChange={(e) =>
                    applyChange({
                      ...settings,
                      qrOverlay: e.target.value
                        ? {
                            text: e.target.value,
                            position: settings.qrOverlay?.position ?? 'bottom-right',
                            opacity: settings.qrOverlay?.opacity ?? 1,
                            widthFraction: settings.qrOverlay?.widthFraction ?? 0.22,
                          }
                        : null,
                    })
                  }
                  className={inputCls}
                  aria-label="QR code content"
                />
                {settings.qrOverlay && (
                  <>
                    <label className="block">
                      <span className="text-xs font-medium">Position</span>
                      <select
                        value={settings.qrOverlay.position}
                        onChange={(e) =>
                          applyChange({
                            ...settings,
                            qrOverlay: {
                              ...settings.qrOverlay!,
                              position: e.target.value as NonNullable<EditorSettings['qrOverlay']>['position'],
                            },
                          })
                        }
                        className={inputCls}
                      >
                        <option value="bottom-right">Bottom right</option>
                        <option value="bottom-left">Bottom left</option>
                        <option value="top-right">Top right</option>
                        <option value="top-left">Top left</option>
                        <option value="center">Centre</option>
                      </select>
                    </label>
                    <Slider
                      label="Size"
                      min={8}
                      max={50}
                      value={Math.round(settings.qrOverlay.widthFraction * 100)}
                      display={`${Math.round(settings.qrOverlay.widthFraction * 100)}% of width`}
                      onBegin={beginDrag}
                      onLive={(v) =>
                        setSettingsState({
                          ...settings,
                          qrOverlay: { ...settings.qrOverlay!, widthFraction: v / 100 },
                        })
                      }
                      onEnd={endDrag}
                    />
                    <Slider
                      label="Code opacity"
                      min={40}
                      max={100}
                      value={Math.round(settings.qrOverlay.opacity * 100)}
                      display={`${Math.round(settings.qrOverlay.opacity * 100)}%`}
                      onBegin={beginDrag}
                      onLive={(v) =>
                        setSettingsState({
                          ...settings,
                          qrOverlay: { ...settings.qrOverlay!, opacity: v / 100 },
                        })
                      }
                      onEnd={endDrag}
                    />
                    {!qrCanvas && (
                      <p className="text-xs text-amber-700">
                        That content could not be turned into a QR code (too long?) — the
                        overlay is skipped.
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {tab === 'export' && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Export</h3>
              <FormatSelect
                value={format}
                onChange={(f) => setFormat(f as OutputFormat)}
                formats={[...STANDARD_FORMATS, { value: 'gif', label: 'GIF (single frame)' }]}
              />
              {format !== 'png' && format !== 'gif' && (
                <Slider
                  label="Quality"
                  min={10}
                  max={100}
                  value={Math.round(quality * 100)}
                  display={`${Math.round(quality * 100)}%`}
                  onBegin={() => undefined}
                  onLive={(v) => setQuality(v / 100)}
                  onEnd={() => undefined}
                />
              )}
              {result && (
                <dl className="space-y-1 rounded-lg bg-accent/50 p-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">File</dt>
                    <dd className="font-medium">{result.filename}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Dimensions</dt>
                    <dd className="font-medium">
                      {result.width}×{result.height}px
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Size</dt>
                    <dd className="font-medium">
                      {formatBytes(result.blob.size)} ({formatBytes(loaded.sizeBytes)} original)
                    </dd>
                  </div>
                </dl>
              )}
              {result ? (
                <a href={result.url} download={result.filename} className={`${primaryBtnCls} block text-center`}>
                  Download edited image
                </a>
              ) : (
                <button type="button" className={`${primaryBtnCls} w-full`} disabled>
                  Rendering…
                </button>
              )}
              <p className="text-xs text-muted-foreground">
                Exporting re-encodes the image, which removes EXIF and other metadata. Your
                original file is never changed.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
