'use client';

/**
 * Bulk image converter: every dropped image converted to one target format
 * through the shared queue. Animated GIFs keep their animation when the
 * target is GIF; converting an animation to a still format uses the first
 * frame (each file's row says so via the "-first-frame" filename suffix).
 */
import { useState } from 'react';
import { browserEnv } from '../_lib/engine/canvas-env';
import { decodeImage } from '../_lib/engine/decode';
import { encodeGif } from '../_lib/engine/gif';
import { buildOutputName } from '../_lib/engine/naming';
import { EXT_BY_FORMAT, type OutputFormat } from '../_lib/engine/types';
import { encodeCanvasOutput } from '../_lib/encode-output';
import { BulkProcessor, type BulkProcessOutcome } from './BulkProcessor';
import { FormatSelect, STANDARD_FORMATS } from './ResultPanel';

export default function BulkConvertTool() {
  const [format, setFormat] = useState<OutputFormat>('webp');
  const [quality, setQuality] = useState(0.9);

  const processFile = async (file: File): Promise<BulkProcessOutcome> => {
    const decoded = await decodeImage(browserEnv, file);
    try {
      const animated = decoded.format === 'gif' && (decoded.gifFrames?.length ?? 0) > 1;
      let blob: Blob;
      let suffix = '-converted';
      if (format === 'gif' && animated && decoded.gifFrames) {
        blob = await encodeGif(
          decoded.gifFrames.map((f) => ({ pixels: f.pixels, delayMs: f.delayMs })),
          decoded.width,
          decoded.height
        );
      } else {
        if (animated) suffix = '-first-frame';
        blob = await encodeCanvasOutput(decoded.surface, format, quality);
      }
      return {
        blob,
        filename: buildOutputName(
          `{name}${suffix}`,
          { originalName: file.name, width: decoded.width, height: decoded.height, format },
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
        <FormatSelect
          value={format}
          onChange={(f) => setFormat(f as OutputFormat)}
          formats={[...STANDARD_FORMATS, { value: 'gif', label: 'GIF' }]}
        />
        {format !== 'png' && format !== 'gif' && (
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
      <p className="mt-3 text-xs text-muted-foreground">
        HEIC, TIFF, SVG and BMP inputs are supported. Animated GIFs stay animated only when
        converting to GIF; other formats use the first frame and the file name says so.
        Re-encoding also removes EXIF metadata from every file.
      </p>
    </div>
  );

  return (
    <BulkProcessor
      settings={settings}
      processFile={processFile}
      zipName="converted-images.zip"
      dropLabel="Drop images to convert in bulk"
      historyLabel="Bulk Convert"
    />
  );
}
