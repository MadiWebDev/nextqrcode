'use client';

/**
 * Social media image resizer: pick a platform + placement, and the image is
 * produced at exactly that published size — cover-cropped (fills the frame)
 * or contained on a background colour. Sizes reviewed 2026-11-13 against
 * platform documentation (see _lib/social-presets).
 */
import { useState } from 'react';
import { browserEnv } from '../_lib/engine/canvas-env';
import { renderResize } from '../_lib/engine/resize';
import { encodeCanvasOutput } from '../_lib/encode-output';
import { buildOutputName } from '../_lib/engine/naming';
import { EXT_BY_FORMAT, type OutputFormat } from '../_lib/engine/types';
import { SOCIAL_PLATFORMS, SOCIAL_PRESETS_REVIEWED_AT } from '../_lib/social-presets';
import { FileDrop } from './FileDrop';
import { ResultPanel } from './ResultPanel';
import { useImageLoader, useResultImage } from './use-image-loader';

export default function SocialTool() {
  const { loaded, loading, error, load, setError } = useImageLoader();
  const { result, setResult } = useResultImage();
  const [platformId, setPlatformId] = useState('instagram');
  const [presetIdx, setPresetIdx] = useState(1);
  const [fit, setFit] = useState<'cover' | 'contain'>('cover');
  const [background, setBackground] = useState('#ffffff');
  const [format, setFormat] = useState<OutputFormat>('jpeg');
  const [busy, setBusy] = useState(false);

  const platform = SOCIAL_PLATFORMS.find((p) => p.id === platformId) ?? SOCIAL_PLATFORMS[0];
  const preset = platform.presets[Math.min(presetIdx, platform.presets.length - 1)];

  const process = async () => {
    if (!loaded) return;
    setBusy(true);
    setError(null);
    try {
      const canvas = renderResize(browserEnv, loaded.decoded.surface, {
        targetWidth: preset.width,
        targetHeight: preset.height,
        fit,
        background,
      });
      const blob = await encodeCanvasOutput(canvas, format, 0.92);
      setResult({
        blob,
        filename: buildOutputName(
          `{name}-${platform.id}`,
          { originalName: loaded.name, width: preset.width, height: preset.height, format },
          EXT_BY_FORMAT[format]
        ),
        width: preset.width,
        height: preset.height,
        note:
          fit === 'cover'
            ? `Cover-cropped to exactly ${preset.width}×${preset.height} for ${platform.label} ${preset.label}.`
            : `Fitted inside ${preset.width}×${preset.height} on ${background} for ${platform.label} ${preset.label}.`,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Resize failed.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="w-full min-w-0">
      <FileDrop onFiles={load} label="Drop an image to size for social media" />
      {error && (
        <p role="alert" className="mt-4 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm">
          {error}
        </p>
      )}
      {loading && <p className="mt-4 text-sm text-muted-foreground">Loading image…</p>}

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="min-w-0 rounded-xl border border-border bg-card p-4 sm:p-5">
          <label className="block">
            <span className="text-xs font-medium">Platform</span>
            <select
              value={platformId}
              onChange={(e) => {
                setPlatformId(e.target.value);
                setPresetIdx(0);
              }}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            >
              {SOCIAL_PLATFORMS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </label>
          <fieldset className="mt-4">
            <legend className="text-xs font-medium">Placement / size</legend>
            <div className="mt-2 space-y-1.5">
              {platform.presets.map((p, i) => (
                <label
                  key={p.label}
                  className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
                    i === presetIdx ? 'border-blue-700 bg-blue-50' : 'border-border'
                  }`}
                >
                  <input
                    type="radio"
                    name="social-preset"
                    checked={i === presetIdx}
                    onChange={() => setPresetIdx(i)}
                    className="accent-blue-700"
                  />
                  <span className="font-medium">{p.label}</span>
                  <span className="ml-auto text-muted-foreground">
                    {p.width}×{p.height}
                  </span>
                  {p.note && <span className="hidden w-full text-xs text-muted-foreground sm:block">{p.note}</span>}
                </label>
              ))}
            </div>
          </fieldset>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs font-medium">Fit</span>
              <select
                value={fit}
                onChange={(e) => setFit(e.target.value as 'cover' | 'contain')}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              >
                <option value="cover">Cover — fill frame (crops edges)</option>
                <option value="contain">Contain — whole image + background</option>
              </select>
            </label>
            {fit === 'contain' && (
              <label className="flex items-end gap-2">
                <input
                  type="color"
                  value={background}
                  onChange={(e) => setBackground(e.target.value)}
                  className="h-9 w-14 rounded border border-border"
                  aria-label="Background colour"
                />
                <span className="text-xs">Background</span>
              </label>
            )}
            <label className="block">
              <span className="text-xs font-medium">Format</span>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as OutputFormat)}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              >
                <option value="jpeg">JPG</option>
                <option value="png">PNG</option>
                <option value="webp">WebP</option>
              </select>
            </label>
          </div>
          <button
            type="button"
            onClick={() => void process()}
            disabled={!loaded || busy}
            className="mt-5 w-full rounded-lg bg-blue-700 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-50"
          >
            {busy ? 'Working…' : `Create ${preset.width}×${preset.height} image`}
          </button>
          <p className="mt-3 text-xs text-muted-foreground">
            Sizes are the published recommendations of each platform, reviewed {SOCIAL_PRESETS_REVIEWED_AT}.
            Platforms occasionally change them — the numbers here are a reliable starting point, not
            a guarantee.
          </p>
        </div>
        <div className="min-w-0 rounded-xl border border-border bg-card p-4 sm:p-5">
          <h3 className="text-sm font-semibold">Result</h3>
          {loaded && (
            <p className="mt-1 text-xs text-muted-foreground break-all">
              {loaded.name} · {loaded.decoded.width}×{loaded.decoded.height}
            </p>
          )}
          {result ? (
            <div className="mt-3">
              <ResultPanel result={result} originalSizeBytes={loaded?.sizeBytes} />
            </div>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">
              Your platform-ready image appears here at the exact pixel size.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
