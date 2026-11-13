// @vitest-environment node
/**
 * GIF round-trip (gifenc fixture → engine decode with compositing → engine
 * encode → decode again), SVG sanitizer, processing queue semantics,
 * smart naming and ZIP export.
 */
import { describe, expect, it } from 'vitest';
import { GIFEncoder, quantize, applyPalette } from 'gifenc';
import JSZip from 'jszip';
import { decodeGif, encodeGif, type GifFrame } from '../gif';
import { sanitizeSvgText, intrinsicSvgSize } from '../svg';
import { ProcessingQueue } from '../queue';
import { buildOutputName, sanitizeFileBase } from '../naming';
import { filesToZip, dedupeZipNames } from '../export';
import { ImageToolError } from '../types';

function solidFrame(r: number, g: number, b: number, w: number, h: number): Uint8ClampedArray {
  const px = new Uint8ClampedArray(w * h * 4);
  for (let i = 0; i < px.length; i += 4) {
    px[i] = r;
    px[i + 1] = g;
    px[i + 2] = b;
    px[i + 3] = 255;
  }
  return px;
}

function makeAnimatedGif(): Uint8Array {
  const w = 40;
  const h = 30;
  const enc = GIFEncoder();
  const colours: Array<[number, number, number]> = [
    [255, 0, 0],
    [0, 200, 0],
    [0, 0, 255],
  ];
  const delays = [100, 200, 300];
  colours.forEach(([r, g, b], i) => {
    const rgba = solidFrame(r, g, b, w, h);
    const palette = quantize(rgba, 256);
    const index = applyPalette(rgba, palette);
    enc.writeFrame(index, w, h, { palette, first: i === 0, delay: delays[i], repeat: 0 });
  });
  enc.finish();
  return enc.bytes();
}

describe('gif decode/encode round-trip', () => {
  it('decodes all frames with dimensions, delays and composited colours', async () => {
    const bytes = makeAnimatedGif();
    const decoded = await decodeGif(bytes.buffer as ArrayBuffer);
    expect(decoded.width).toBe(40);
    expect(decoded.height).toBe(30);
    expect(decoded.animated).toBe(true);
    expect(decoded.frames).toHaveLength(3);
    expect(decoded.frames.map((f) => f.delayMs)).toEqual([100, 200, 300]);
    expect(Array.from(decoded.frames[0].pixels.slice(0, 4))).toEqual([255, 0, 0, 255]);
    expect(decoded.frames[2].pixels[2]).toBe(255); // blue channel of first pixel
  });

  it('re-encodes frames into a valid animated GIF', async () => {
    const decoded = await decodeGif(makeAnimatedGif().buffer as ArrayBuffer);
    const blob = await encodeGif(decoded.frames, decoded.width, decoded.height);
    expect(blob.type).toBe('image/gif');
    const again = await decodeGif(await blob.arrayBuffer());
    expect(again.frames).toHaveLength(3);
    expect(again.width).toBe(40);
  });

  it('rejects non-GIF bytes', async () => {
    await expect(decodeGif(new Uint8Array([1, 2, 3]).buffer)).rejects.toBeInstanceOf(ImageToolError);
  });

  it('encodes a single frame as a static GIF', async () => {
    const frame: GifFrame = { pixels: solidFrame(10, 20, 30, 8, 8), delayMs: 100 };
    const blob = await encodeGif([frame], 8, 8);
    const decoded = await decodeGif(await blob.arrayBuffer());
    expect(decoded.animated).toBe(false);
    expect(decoded.frames).toHaveLength(1);
  });
});

describe('svg sanitizer', () => {
  it('strips scripts, handlers, external refs and style URLs but keeps artwork', () => {
    const dirty = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="80" onload="alert(1)">
      <script>alert('x')</script>
      <rect width="100" height="80" fill="#00f"/>
      <image href="https://evil.example/x.png" width="10" height="10"/>
      <a href="javascript:alert(2)"><text>hi</text></a>
      <foreignObject><body>boom</body></foreignObject>
    </svg>`;
    const clean = sanitizeSvgText(dirty);
    expect(clean).not.toContain('<script');
    expect(clean).not.toContain('onload');
    expect(clean).not.toContain('evil.example');
    expect(clean).not.toContain('javascript:');
    expect(clean).not.toContain('foreignObject');
    expect(clean).toContain('<rect');
    expect(intrinsicSvgSize(clean)).toEqual({ width: 100, height: 80, assumed: false });
  });

  it('rejects entity-declaring SVGs and non-SVG content', () => {
    expect(() =>
      sanitizeSvgText('<!DOCTYPE svg [<!ENTITY x "y">]><svg xmlns="http://www.w3.org/2000/svg"/>')
    ).toThrow(ImageToolError);
    expect(() => sanitizeSvgText('<html><body>no</body></html>')).toThrow(ImageToolError);
  });

  it('derives size from viewBox when width/height are absent', () => {
    expect(intrinsicSvgSize('<svg viewBox="0 0 640 480"></svg>')).toEqual({
      width: 640,
      height: 480,
      assumed: false,
    });
  });
});

describe('processing queue', () => {
  const tick = (ms: number) => new Promise((r) => setTimeout(r, ms));
  async function untilDone(queue: ProcessingQueue<unknown>, timeoutMs = 3000): Promise<void> {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      const c = queue.counts;
      if (c.queued === 0 && c.processing === 0) return;
      await tick(10);
    }
    throw new Error('queue did not drain');
  }

  it('respects the concurrency limit and completes every job', async () => {
    const queue = new ProcessingQueue<number>(2);
    let active = 0;
    let maxActive = 0;
    for (let i = 0; i < 5; i++) {
      queue.add(`job ${i}`, async () => {
        active++;
        maxActive = Math.max(maxActive, active);
        await tick(25);
        active--;
        return i;
      });
    }
    await untilDone(queue);
    expect(maxActive).toBe(2);
    expect(queue.counts.done).toBe(5);
  });

  it('marks failures as error and retry re-runs them', async () => {
    const queue = new ProcessingQueue<string>(1);
    let attempts = 0;
    const id = queue.add('flaky', async () => {
      attempts++;
      if (attempts === 1) throw new Error('boom');
      return 'ok';
    });
    await untilDone(queue);
    expect(queue.snapshot().find((i) => i.id === id)?.status).toBe('error');
    queue.retry(id);
    await untilDone(queue);
    const item = queue.snapshot().find((i) => i.id === id);
    expect(item?.status).toBe('done');
    expect(item?.result).toBe('ok');
  });

  it('cancels queued items and honours pause/resume', async () => {
    const queue = new ProcessingQueue<number>(1);
    queue.pause();
    const id = queue.add('held', async () => 1);
    await tick(40);
    expect(queue.snapshot()[0].status).toBe('queued');
    queue.cancel(id);
    expect(queue.snapshot()[0].status).toBe('cancelled');
    queue.resume();
    const id2 = queue.add('runs', async () => 2);
    await untilDone(queue);
    expect(queue.snapshot().find((i) => i.id === id2)?.status).toBe('done');
  });
});

describe('naming + zip export', () => {
  it('builds token names and sanitizes dangerous characters', () => {
    expect(
      buildOutputName('{name}-{w}x{h}', { originalName: 'my photo.png', width: 1200, height: 800 }, 'webp')
    ).toBe('my-photo-1200x800.webp');
    expect(sanitizeFileBase('../../etc/passwd')).not.toContain('/');
    expect(sanitizeFileBase('a/b\\c:d')).toBe('a-b-c-d');
    expect(buildOutputName('{name}-{index}', { originalName: 'x.jpg', index: 4 }, 'png')).toBe('x-005.png');
  });

  it('deduplicates ZIP entry names', () => {
    const entries = [
      { name: 'a.jpg', blob: new Blob(['1']) },
      { name: 'a.jpg', blob: new Blob(['2']) },
      { name: 'a.jpg', blob: new Blob(['3']) },
    ];
    expect(dedupeZipNames(entries).map((e2) => e2.name)).toEqual(['a.jpg', 'a-2.jpg', 'a-3.jpg']);
  });

  it('produces a real ZIP containing the entries', async () => {
    const zipBlob = await filesToZip([
      { name: 'one.txt', blob: new Blob(['hello']) },
      { name: 'two.txt', blob: new Blob(['world']) },
    ]);
    const zip = await JSZip.loadAsync(await zipBlob.arrayBuffer());
    expect(Object.keys(zip.files).sort()).toEqual(['one.txt', 'two.txt']);
    expect(await zip.file('one.txt')!.async('string')).toBe('hello');
  });
});
