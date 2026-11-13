'use client';

/**
 * OG / social card composer: 1200×630 (or X/LinkedIn variants) share cards
 * with a background image or colour, accent bar, wrapped title/subtitle
 * and a brand line — composed on canvas and exported as PNG/JPG.
 */
import { useEffect, useRef, useState } from 'react';
import { browserEnv } from '../_lib/engine/canvas-env';
import { composeOgCard } from '../_lib/engine/ogcard';
import { encodeCanvasOutput } from '../_lib/encode-output';
import { useImageLoader, useResultImage } from './use-image-loader';

const inputCls = 'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm';

const SIZES = [
  { label: 'Open Graph / Facebook / LinkedIn — 1200×630', w: 1200, h: 630 },
  { label: 'X (Twitter) card — 1200×628', w: 1200, h: 628 },
  { label: 'Blog header — 1600×900', w: 1600, h: 900 },
];

export default function OgCardTool() {
  const bg = useImageLoader();
  const { result, setResult } = useResultImage();
  const [title, setTitle] = useState('Your headline goes here');
  const [subtitle, setSubtitle] = useState('A one-line supporting message that earns the click.');
  const [brand, setBrand] = useState('example.com');
  const [backgroundColor, setBackgroundColor] = useState('#101828');
  const [accentColor, setAccentColor] = useState('#f97316');
  const [textColor, setTextColor] = useState('#ffffff');
  const [sizeIdx, setSizeIdx] = useState(0);
  const [format, setFormat] = useState<'png' | 'jpeg'>('png');
  const [error, setError] = useState<string | null>(null);
  const runRef = useRef(0);

  useEffect(() => {
    const runId = ++runRef.current;
    const timer = setTimeout(() => {
      void (async () => {
        try {
          const size = SIZES[sizeIdx];
          const canvas = composeOgCard(browserEnv, {
            width: size.w,
            height: size.h,
            backgroundColor,
            backgroundImage: bg.loaded?.decoded.surface ?? null,
            accentColor,
            title: title || ' ',
            subtitle,
            brand,
            textColor,
          });
          const blob = await encodeCanvasOutput(canvas, format, 0.92);
          if (runRef.current !== runId) return;
          setResult({
            blob,
            filename: `og-card-${size.w}x${size.h}.${format === 'jpeg' ? 'jpg' : 'png'}`,
            width: size.w,
            height: size.h,
          });
        } catch (err) {
          if (runRef.current === runId) {
            setError(err instanceof Error ? err.message : 'Composition failed.');
          }
        }
      })();
    }, 200);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, subtitle, brand, backgroundColor, accentColor, textColor, sizeIdx, format, bg.loaded]);

  return (
    <div className="w-full min-w-0">
      <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <div className="min-w-0 rounded-xl border border-border bg-card p-4 sm:p-5">
          <div className="space-y-3">
            <label className="block">
              <span className="text-xs font-medium">Card size</span>
              <select value={sizeIdx} onChange={(e) => setSizeIdx(Number(e.target.value))} className={inputCls}>
                {SIZES.map((s, i) => (
                  <option key={s.label} value={i}>{s.label}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-medium">Title</span>
              <textarea value={title} onChange={(e) => setTitle(e.target.value)} rows={2} maxLength={110} className={inputCls} />
            </label>
            <label className="block">
              <span className="text-xs font-medium">Subtitle</span>
              <textarea value={subtitle} onChange={(e) => setSubtitle(e.target.value)} rows={2} maxLength={160} className={inputCls} />
            </label>
            <label className="block">
              <span className="text-xs font-medium">Brand line</span>
              <input type="text" value={brand} onChange={(e) => setBrand(e.target.value)} maxLength={48} className={inputCls} />
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  ['Background', backgroundColor, setBackgroundColor],
                  ['Accent', accentColor, setAccentColor],
                  ['Text', textColor, setTextColor],
                ] as const
              ).map(([label, value, set]) => (
                <label key={label} className="block text-center">
                  <input type="color" value={value} onChange={(e) => set(e.target.value)} className="h-9 w-full rounded border border-border" aria-label={`${label} colour`} />
                  <span className="mt-1 block text-xs">{label}</span>
                </label>
              ))}
            </div>
            <div>
              <span className="text-xs font-medium">Background image (optional)</span>
              <label className="mt-1 block cursor-pointer rounded-lg border border-dashed border-border px-3 py-2.5 text-center text-sm hover:bg-accent">
                {bg.loaded ? `Using ${bg.loaded.name}` : 'Choose an image'}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void bg.load([file]);
                    e.target.value = '';
                  }}
                />
              </label>
              {bg.loaded && (
                <button type="button" onClick={() => bg.reset()} className="mt-1.5 text-xs font-medium text-blue-700 underline">
                  Remove background image
                </button>
              )}
              {bg.error && <p className="mt-1 text-xs text-red-700">{bg.error}</p>}
            </div>
            <label className="block">
              <span className="text-xs font-medium">Export format</span>
              <select value={format} onChange={(e) => setFormat(e.target.value as 'png' | 'jpeg')} className={inputCls}>
                <option value="png">PNG</option>
                <option value="jpeg">JPG</option>
              </select>
            </label>
          </div>
        </div>
        <div className="min-w-0 rounded-xl border border-border bg-card p-4 sm:p-5">
          <h3 className="text-sm font-semibold">Preview</h3>
          {error && (
            <p role="alert" className="mt-3 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm">{error}</p>
          )}
          {result ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={result.url} alt="Composed social card preview" className="mt-3 block w-full rounded-lg border border-border" />
              <p className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                <span className="text-muted-foreground">{result.width}×{result.height}px</span>
                <a href={result.url} download={result.filename} className="rounded-lg bg-blue-700 px-4 py-2 font-semibold text-white hover:bg-blue-800">
                  Download {format.toUpperCase()}
                </a>
              </p>
            </>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">Your card preview renders here as you type.</p>
          )}
          <p className="mt-3 text-xs text-muted-foreground">
            Long titles shrink automatically to fit up to three lines; an ellipsis marks real
            truncation. Keep titles under ~60 characters for the cleanest cards.
          </p>
        </div>
      </div>
    </div>
  );
}
