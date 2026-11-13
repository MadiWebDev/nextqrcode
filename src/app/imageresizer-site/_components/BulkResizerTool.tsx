'use client';

import { useState } from 'react';
import { browserEnv } from '../_lib/engine/canvas-env';
import { decodeImage } from '../_lib/engine/decode';
import { renderResize, type ResizeSpec } from '../_lib/engine/resize';
import { encodeGif } from '../_lib/engine/gif';
import { encodeCanvasOutput } from '../_lib/encode-output';
import { buildOutputName } from '../_lib/engine/naming';
import { EXT_BY_FORMAT, type OutputFormat } from '../_lib/engine/types';
import { BulkProcessor, type BulkProcessOutcome } from './BulkProcessor';
import { FormatSelect, STANDARD_FORMATS } from './ResultPanel';
import { PresetBar } from './PresetBar';

type Mode = 'exact' | 'percent' | 'max';

export function BulkResizerTool() {
  const [mode, setMode] = useState<Mode>('percent');
  const [percent, setPercent] = useState(50);
  const [width, setWidth] = useState(1200);
  const [height, setHeight] = useState(1200);
  const [maxDimension, setMaxDimension] = useState(1920);
  const [format, setFormat] = useState<OutputFormat>('jpeg');
  const [quality, setQuality] = useState(0.85);

  const processFile = async (file: File): Promise<BulkProcessOutcome> => {
    const decoded = await decodeImage(browserEnv, file);
    try {
      let spec: ResizeSpec;
      if (mode === 'percent') {
        spec = { percent };
      } else if (mode === 'max') {
        const scale = Math.min(1, maxDimension / Math.max(decoded.width, decoded.height));
        spec = {
          targetWidth: Math.max(1, Math.round(decoded.width * scale)),
          targetHeight: Math.max(1, Math.round(decoded.height * scale)),
        };
      } else {
        spec = { targetWidth: width, targetHeight: height, fit: 'contain' };
      }

      let blob: Blob;
      let outW: number;
      let outH: number;
      if (format === 'gif' && decoded.gifFrames && decoded.gifFrames.length > 1) {
        // Preserve the animation: resize every frame.
        const resizedFrames = decoded.gifFrames.map((frame) => {
          const frameCanvas = browserEnv.canvasFromPixels(frame.pixels, decoded.width, decoded.height);
          const resized = renderResize(browserEnv, frameCanvas, spec);
          const pixels = resized.getContext('2d').getImageData(0, 0, resized.width, resized.height);
          return { pixels: pixels.data, delayMs: frame.delayMs, width: resized.width, height: resized.height };
        });
        outW = resizedFrames[0].width;
        outH = resizedFrames[0].height;
        blob = await encodeGif(resizedFrames, outW, outH);
      } else {
        const canvas = renderResize(browserEnv, decoded.surface, {
          ...spec,
          background: format === 'jpeg' ? '#ffffff' : spec.background,
        });
        outW = canvas.width;
        outH = canvas.height;
        blob = await encodeCanvasOutput(canvas, format, quality);
      }
      return {
        blob,
        filename: buildOutputName(
          '{name}-{w}x{h}',
          { originalName: file.name, width: outW, height: outH, format },
          EXT_BY_FORMAT[format]
        ),
      };
    } finally {
      decoded.release();
    }
  };

  const settings = (
    <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Resize mode">
        {(
          [
            ['percent', 'Percentage'],
            ['exact', 'Fit within box'],
            ['max', 'Max dimension'],
          ] as Array<[Mode, string]>
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={mode === value}
            onClick={() => setMode(value)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium border transition-colors ${
              mode === value ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:border-primary/50'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-3 items-end">
        {mode === 'percent' && (
          <label className="block">
            <span className="text-xs font-medium">Scale: {percent}%</span>
            <input
              type="range"
              min={5}
              max={200}
              value={percent}
              onChange={(e) => setPercent(parseInt(e.target.value, 10))}
              className="mt-2 w-full"
            />
          </label>
        )}
        {mode === 'exact' && (
          <>
            <label className="block">
              <span className="text-xs font-medium">Max width (px)</span>
              <input
                type="number"
                min={1}
                value={width}
                onChange={(e) => setWidth(parseInt(e.target.value, 10) || 1)}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium">Max height (px)</span>
              <input
                type="number"
                min={1}
                value={height}
                onChange={(e) => setHeight(parseInt(e.target.value, 10) || 1)}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              />
            </label>
            <p className="text-xs text-muted-foreground">
              Each image keeps its proportions and is fitted inside this box — nothing is distorted.
            </p>
          </>
        )}
        {mode === 'max' && (
          <label className="block">
            <span className="text-xs font-medium">Longest edge (px)</span>
            <input
              type="number"
              min={16}
              value={maxDimension}
              onChange={(e) => setMaxDimension(parseInt(e.target.value, 10) || 16)}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            />
          </label>
        )}
        <FormatSelect value={format} onChange={(f) => setFormat(f as OutputFormat)} formats={[...STANDARD_FORMATS, { value: 'gif', label: 'GIF' }]} />
        {format !== 'png' && format !== 'gif' && (
          <label className="block">
            <span className="text-xs font-medium">Quality: {Math.round(quality * 100)}%</span>
            <input
              type="range"
              min={10}
              max={100}
              value={Math.round(quality * 100)}
              onChange={(e) => setQuality(parseInt(e.target.value, 10) / 100)}
              className="mt-2 w-full"
            />
          </label>
        )}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Settings apply to files as they are processed. Animated GIFs keep their animation when GIF output is chosen.
      </p>
    </div>
  );

  const settingsWithPresets = (
    <div className="space-y-4">
      {settings}
      <PresetBar
        scope="bulk-resizer"
        getCurrent={() => ({ mode, percent, width, height, maxDimension, format, quality })}
        onLoad={(data) => {
          const d = data as Partial<{
            mode: Mode;
            percent: number;
            width: number;
            height: number;
            maxDimension: number;
            format: OutputFormat;
            quality: number;
          }>;
          if (d.mode) setMode(d.mode);
          if (typeof d.percent === 'number') setPercent(d.percent);
          if (typeof d.width === 'number') setWidth(d.width);
          if (typeof d.height === 'number') setHeight(d.height);
          if (typeof d.maxDimension === 'number') setMaxDimension(d.maxDimension);
          if (d.format) setFormat(d.format);
          if (typeof d.quality === 'number') setQuality(d.quality);
        }}
      />
    </div>
  );

  return (
    <BulkProcessor
      settings={settingsWithPresets}
      processFile={processFile}
      zipName="resized-images.zip"
      dropLabel="Drop images to resize in bulk"
      historyLabel="Bulk Resize"
    />
  );
}
