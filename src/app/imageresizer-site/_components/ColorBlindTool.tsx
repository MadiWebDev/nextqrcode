'use client';

/**
 * Colour-blindness simulator: shows (and exports) an image as seen with
 * protanopia, deuteranopia, tritanopia, their anomalous variants, or
 * achromatopsia — using the Machado et al. (2009) simulation matrices.
 * A design-check tool: if text is unreadable here, it is unreadable for
 * real users with that vision.
 */
import { useState } from 'react';
import { browserEnv } from '../_lib/engine/canvas-env';
import {
  COLOUR_VISION_LABELS,
  simulateColourVision,
  type ColourVisionType,
} from '../_lib/engine/simulate';
import { encodeCanvasOutput } from '../_lib/encode-output';
import { buildOutputName } from '../_lib/engine/naming';
import { FileDrop } from './FileDrop';
import { ResultPanel } from './ResultPanel';
import { useImageLoader, useResultImage } from './use-image-loader';

const TYPES = Object.keys(COLOUR_VISION_LABELS) as ColourVisionType[];

export default function ColorBlindTool() {
  const { loaded, loading, error, load, setError } = useImageLoader();
  const { result, setResult } = useResultImage();
  const [type, setType] = useState<ColourVisionType>('deuteranopia');
  const [busy, setBusy] = useState(false);

  const render = async (nextType: ColourVisionType) => {
    if (!loaded) return;
    setType(nextType);
    setBusy(true);
    setError(null);
    try {
      const canvas = simulateColourVision(browserEnv, loaded.decoded.surface, nextType);
      const blob = await encodeCanvasOutput(canvas, 'png', 1);
      setResult({
        blob,
        filename: buildOutputName(`{name}-${nextType}`, { originalName: loaded.name, format: 'png' }, 'png'),
        width: canvas.width,
        height: canvas.height,
        note: `Simulated with the Machado et al. (2009) matrix for ${COLOUR_VISION_LABELS[nextType]}.`,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Simulation failed.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="w-full min-w-0">
      <FileDrop
        onFiles={(files) => {
          setResult(null);
          void load(files);
        }}
        label="Drop an image to check how it looks with colour-vision deficiency"
      />
      {error && (
        <p role="alert" className="mt-4 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm">{error}</p>
      )}
      {loading && <p className="mt-4 text-sm text-muted-foreground">Loading image…</p>}
      {loaded && (
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="min-w-0 rounded-xl border border-border bg-card p-4 sm:p-5">
            <h3 className="text-sm font-semibold">Original</h3>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={loaded.previewUrl} alt="Original" className="mt-3 max-h-72 w-auto max-w-full rounded-lg border border-border object-contain" />
            <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Vision type">
              {TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => void render(t)}
                  aria-pressed={type === t}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium ${type === t ? 'bg-blue-700 text-white' : 'bg-accent hover:bg-accent/70'}`}
                >
                  {COLOUR_VISION_LABELS[t]}
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Deuteranopia and protanopia are the most common (red-green) deficiencies, affecting
              roughly 1 in 12 men. If labels or chart lines become indistinguishable here, add
              labels, patterns or brightness differences — never rely on colour alone.
            </p>
          </div>
          <div className="min-w-0 rounded-xl border border-border bg-card p-4 sm:p-5">
            <h3 className="text-sm font-semibold">Simulated view {busy && '…'}</h3>
            {result ? (
              <div className="mt-3">
                <ResultPanel result={result} originalSizeBytes={loaded.sizeBytes} />
              </div>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">Choose a vision type to render the simulation.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
