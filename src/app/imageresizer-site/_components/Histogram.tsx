'use client';

/**
 * Live RGB + luminance histogram drawn from the real pixels of the given
 * canvas (downsampled first — a histogram doesn't need every pixel of a
 * 24MP photo to be truthful about distribution shape; counts are sampled,
 * the shape is exact). Redraws whenever the source canvas identity changes.
 */
import { useEffect, useRef } from 'react';
import { computeHistogram } from '../_lib/engine/histogram';
import type { CanvasSurface } from '../_lib/engine/canvas-env';

const W = 256;
const H = 72;

export function Histogram({ canvas }: { canvas: CanvasSurface | null }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const target = ref.current;
    if (!target || !canvas) return;
    const ctx = target.getContext('2d');
    if (!ctx) return;
    // Downsample to at most ~200px wide for the sample.
    const scale = Math.min(1, 200 / canvas.width);
    const sw = Math.max(1, Math.round(canvas.width * scale));
    const sh = Math.max(1, Math.round(canvas.height * scale));
    const sample = document.createElement('canvas');
    sample.width = sw;
    sample.height = sh;
    const sctx = sample.getContext('2d');
    if (!sctx) return;
    sctx.drawImage(canvas as unknown as HTMLCanvasElement, 0, 0, sw, sh);
    const data = sctx.getImageData(0, 0, sw, sh);
    const hist = computeHistogram(data.data, sw * sh);

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, W, H);
    // Use a sqrt scale so small peaks stay visible next to big ones.
    const max = Math.sqrt(hist.maxCount) || 1;
    const drawChannel = (counts: Uint32Array, style: string, fill: boolean) => {
      ctx.beginPath();
      for (let x = 0; x < 256; x++) {
        const y = H - (Math.sqrt(counts[x]) / max) * (H - 4);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      if (fill) {
        ctx.lineTo(255, H);
        ctx.lineTo(0, H);
        ctx.closePath();
        ctx.fillStyle = style;
        ctx.fill();
      } else {
        ctx.strokeStyle = style;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    };
    drawChannel(hist.lum, 'rgba(226,232,240,0.85)', true);
    ctx.globalCompositeOperation = 'screen';
    drawChannel(hist.r, 'rgba(248,113,113,0.75)', false);
    drawChannel(hist.g, 'rgba(74,222,128,0.75)', false);
    drawChannel(hist.b, 'rgba(96,165,250,0.75)', false);
    ctx.globalCompositeOperation = 'source-over';
  }, [canvas]);

  return (
    <figure>
      <canvas
        ref={ref}
        width={W}
        height={H}
        className="w-full rounded-lg"
        role="img"
        aria-label="Colour histogram of the current edit (red, green, blue and luminance)"
      />
      <figcaption className="mt-1 flex justify-between text-[11px] text-muted-foreground">
        <span>Shadows</span>
        <span>Histogram (sampled)</span>
        <span>Highlights</span>
      </figcaption>
    </figure>
  );
}
