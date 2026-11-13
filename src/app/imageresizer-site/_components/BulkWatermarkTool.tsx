'use client';

/**
 * Bulk watermark: the same text watermark applied to every image in the
 * batch, through the shared queue. One settings block, consistent branding
 * across a whole shoot.
 */
import { useState } from 'react';
import { browserEnv } from '../_lib/engine/canvas-env';
import { decodeImage } from '../_lib/engine/decode';
import { drawTextWatermark, type WatermarkPosition } from '../_lib/engine/effects';
import { buildOutputName } from '../_lib/engine/naming';
import { EXT_BY_FORMAT, type OutputFormat } from '../_lib/engine/types';
import { encodeCanvasOutput } from '../_lib/encode-output';
import { BulkProcessor, type BulkProcessOutcome } from './BulkProcessor';

export default function BulkWatermarkTool() {
  const [text, setText] = useState('© My Brand');
  const [position, setPosition] = useState<WatermarkPosition>('bottom-right');
  const [opacity, setOpacity] = useState(0.6);
  const [size, setSize] = useState(0.05);
  const [color, setColor] = useState('#ffffff');
  const [format, setFormat] = useState<OutputFormat>('jpeg');
  const [quality, setQuality] = useState(0.9);

  const processFile = async (file: File): Promise<BulkProcessOutcome> => {
    const decoded = await decodeImage(browserEnv, file);
    try {
      const canvas = drawTextWatermark(browserEnv, decoded.surface, {
        text,
        position,
        opacity,
        sizeFraction: size,
        color,
      });
      const blob = await encodeCanvasOutput(canvas, format, quality);
      return {
        blob,
        filename: buildOutputName(
          '{name}-watermarked',
          { originalName: file.name, width: canvas.width, height: canvas.height, format },
          EXT_BY_FORMAT[format]
        ),
      };
    } finally {
      decoded.release();
    }
  };

  const settings = (
    <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="text-xs font-medium">Watermark text</span>
          <input
            type="text"
            value={text}
            maxLength={60}
            onChange={(e) => setText(e.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            placeholder="© Your name or brand"
          />
        </label>
        <label className="block">
          <span className="text-xs font-medium">Position</span>
          <select
            value={position}
            onChange={(e) => setPosition(e.target.value as WatermarkPosition)}
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          >
            <option value="bottom-right">Bottom right</option>
            <option value="bottom-left">Bottom left</option>
            <option value="top-right">Top right</option>
            <option value="top-left">Top left</option>
            <option value="center">Centre</option>
            <option value="tile">Tiled (repeated)</option>
          </select>
        </label>
        <label className="block">
          <span className="text-xs font-medium">Output format</span>
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
        <label className="block">
          <span className="text-xs font-medium">Opacity · {Math.round(opacity * 100)}%</span>
          <input
            type="range"
            min={5}
            max={100}
            value={Math.round(opacity * 100)}
            onChange={(e) => setOpacity(Number(e.target.value) / 100)}
            className="mt-2 w-full accent-blue-700"
            aria-label="Opacity"
          />
        </label>
        <label className="block">
          <span className="text-xs font-medium">Size · {Math.round(size * 100)}% of width</span>
          <input
            type="range"
            min={2}
            max={15}
            value={Math.round(size * 100)}
            onChange={(e) => setSize(Number(e.target.value) / 100)}
            className="mt-2 w-full accent-blue-700"
            aria-label="Watermark size"
          />
        </label>
        <label className="flex items-center gap-3">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="h-9 w-14 rounded border border-border"
            aria-label="Watermark colour"
          />
          <span className="text-xs font-medium">Text colour</span>
        </label>
        {format !== 'png' && (
          <label className="block">
            <span className="text-xs font-medium">Quality · {Math.round(quality * 100)}%</span>
            <input
              type="range"
              min={10}
              max={100}
              value={Math.round(quality * 100)}
              onChange={(e) => setQuality(Number(e.target.value) / 100)}
              className="mt-2 w-full accent-blue-700"
              aria-label="Quality"
            />
          </label>
        )}
      </div>
      {!text.trim() && (
        <p className="mt-3 text-sm text-amber-700">Enter watermark text — with empty text, files are only re-encoded.</p>
      )}
    </div>
  );

  return (
    <BulkProcessor
      settings={settings}
      processFile={processFile}
      zipName="watermarked-images.zip"
      dropLabel="Drop images to watermark in bulk"
      historyLabel="Bulk Watermark"
    />
  );
}
