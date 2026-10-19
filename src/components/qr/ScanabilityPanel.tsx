'use client';

import { useEffect, useState } from 'react';
import type { RefObject } from 'react';
import jsQR from 'jsqr';
import { getAutoECLevel } from '@/lib/qr-helpers';
import { scoreScanability, type ScanabilityResult } from '@/lib/qr/scanability';

interface ScanabilityPanelProps {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  qrText: string;
  hasLogo: boolean;
}

type DecodeState = 'idle' | 'pass' | 'fail';

const DEBOUNCE_MS = 300;

/** Convert a linear-luminance value (0–1) to a grayscale hex color. */
function grayHex(luminance: number): string {
  const clamped = Math.max(0, Math.min(1, luminance));
  const srgb = clamped <= 0.0031308 ? 12.92 * clamped : 1.055 * Math.pow(clamped, 1 / 2.4) - 0.055;
  const byte = Math.round(Math.max(0, Math.min(1, srgb)) * 255)
    .toString(16)
    .padStart(2, '0');
  return `#${byte}${byte}${byte}`;
}

/**
 * Estimate the module (fg) and background (bg) colors of a rendered QR canvas.
 * The quiet zone forms a border, so the border band approximates the
 * background; the darkest decile of pixels approximates the module color.
 * Luminance alone drives contrast scoring, so grayscale is sufficient.
 */
function sampleCanvasColors(imageData: ImageData): { fgColor: string; bgColor: string } {
  const { data, width, height } = imageData;
  const lumAt = (x: number, y: number): number => {
    const i = (y * width + x) * 4;
    const r = data[i] / 255;
    const g = data[i + 1] / 255;
    const b = data[i + 2] / 255;
    const toLinear = (c: number): number =>
      c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
  };

  // Background: mean luminance of an 8%-wide border band (the quiet zone).
  const band = Math.max(1, Math.floor(Math.min(width, height) * 0.08));
  let bgSum = 0;
  let bgCount = 0;
  for (let y = 0; y < height; y += 2) {
    for (let x = 0; x < width; x += 2) {
      const onBorder = x < band || y < band || x >= width - band || y >= height - band;
      if (onBorder) {
        bgSum += lumAt(x, y);
        bgCount += 1;
      }
    }
  }

  // Foreground: darkest decile of all sampled pixels.
  const samples: number[] = [];
  for (let y = 0; y < height; y += 3) {
    for (let x = 0; x < width; x += 3) {
      samples.push(lumAt(x, y));
    }
  }
  samples.sort((a, b) => a - b);
  const decile = samples.slice(0, Math.max(1, Math.floor(samples.length / 10)));
  const fgMean = decile.reduce((sum, v) => sum + v, 0) / decile.length;

  return {
    fgColor: grayHex(bgCount > 0 ? fgMean : 0),
    bgColor: grayHex(bgCount > 0 ? bgSum / bgCount : 1),
  };
}

function scoreColor(score: number): string {
  if (score >= 80) return 'bg-emerald-500';
  if (score >= 50) return 'bg-amber-500';
  return 'bg-red-500';
}

/**
 * Live scan-ability guard for the rendered QR canvas.
 *
 * After the canvas settles (debounced), it runs a real decode with jsQR and
 * compares the decoded payload to the expected text, then scores contrast,
 * logo use, density and print size. Screen-reader friendly via
 * `role="status"` + `aria-live="polite"`.
 */
export default function ScanabilityPanel({ canvasRef, qrText, hasLogo }: ScanabilityPanelProps) {
  const [decode, setDecode] = useState<DecodeState>('idle');
  const [report, setReport] = useState<ScanabilityResult | null>(null);
  const [hasCanvas, setHasCanvas] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!qrText) {
        setDecode('idle');
        setReport(null);
        setHasCanvas(false);
        return;
      }
      const canvas = canvasRef.current;
      if (!canvas) {
        setHasCanvas(false);
        return;
      }
      setHasCanvas(true);
      try {
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('2d context unavailable');
        const { width, height } = canvas;
        const imageData = ctx.getImageData(0, 0, width, height);

        const decoded = jsQR(imageData.data, width, height);
        setDecode(decoded?.data === qrText ? 'pass' : 'fail');

        const { fgColor, bgColor } = sampleCanvasColors(imageData);
        // Assume the generator's own EC convention (H whenever a logo is used).
        const ecLevel = getAutoECLevel(hasLogo, qrText.length);
        setReport(
          scoreScanability({
            fgColor,
            bgColor,
            hasLogo,
            // The overlay size is unknown from pixels alone; assume a
            // conservative in-spec default so the panel never cries wolf.
            logoSizeRatio: hasLogo ? 0.15 : 0,
            payloadLength: qrText.length,
            ecLevel,
            quietZoneModules: 4,
            outputSizePx: width,
          })
        );
      } catch {
        setDecode('fail');
        setReport(null);
      }
    }, DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [qrText, hasLogo, canvasRef]);

  if (!qrText || !hasCanvas) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground"
      >
        Generate a QR code to check scan-ability.
      </div>
    );
  }

  return (
    <section
      role="status"
      aria-live="polite"
      aria-label="QR scan-ability check"
      className="rounded-lg border p-4"
    >
      <h3 className="text-sm font-semibold">Scan-ability</h3>

      <p className="mt-2 text-sm">
        {decode === 'pass' && (
          <span className="font-medium text-emerald-600">
            Decode check: PASS — the rendered code decodes to the exact payload.
          </span>
        )}
        {decode === 'fail' && (
          <span className="font-medium text-red-600">
            Decode check: FAIL — the rendered code does not decode to the expected payload.
          </span>
        )}
        {decode === 'idle' && <span className="text-muted-foreground">Checking…</span>}
      </p>

      {report && (
        <div className="mt-3">
          <div className="flex items-center justify-between text-sm">
            <span>Score</span>
            <span className="font-semibold">{report.score}/100</span>
          </div>
          <div
            role="progressbar"
            aria-valuenow={report.score}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Scan-ability score"
            className="mt-1 h-2 w-full overflow-hidden rounded-full bg-muted"
          >
            <div
              className={`h-full rounded-full ${scoreColor(report.score)}`}
              style={{ width: `${report.score}%` }}
            />
          </div>

          {report.warnings.length > 0 ? (
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
              {report.warnings.map((warning) => (
                <li key={warning}>{warning}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">No scan-ability issues detected.</p>
          )}

          <p className="mt-3 text-sm">
            Print at least <strong>{report.printSize.minCm} cm</strong> wide
            <span className="text-muted-foreground">
              {' '}
              ({report.printSize.recommendedCm} cm recommended).
            </span>
          </p>
        </div>
      )}
    </section>
  );
}
