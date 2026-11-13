// @vitest-environment node
/**
 * Engine core tests — run against @napi-rs/canvas (real Skia rasterizer +
 * encoders) through the same CanvasEnv seam the browser uses. Fixtures are
 * generated procedurally at test time; assertions read the produced bytes
 * (signatures, header dimensions, real byte sizes).
 */
import { describe, expect, it } from 'vitest';
import { nodeEnv, makePhotoFixture, makeNoiseFixture } from './node-env';
import { sniffFormat, inspectFile, headerDimensions } from '../validate';
import { decodeImage } from '../decode';
import { computeResize, renderResize, pixelsForPrint, printSizeForPixels, a4Pixels } from '../resize';
import { compressToTarget, compressWithSettings } from '../compress';
import { convertImage } from '../convert';
import { ImageToolError } from '../types';

async function fixturePngBlob(width = 800, height = 600): Promise<Blob> {
  return nodeEnv.encode(makePhotoFixture(width, height), 'image/png');
}

describe('validate: signatures + header dimensions on real encoded files', () => {
  it('sniffs PNG/JPEG/WebP from real encoder output', async () => {
    const photo = makePhotoFixture(120, 90);
    const png = new Uint8Array(await (await nodeEnv.encode(photo, 'image/png')).arrayBuffer());
    const jpg = new Uint8Array(await (await nodeEnv.encode(photo, 'image/jpeg', 0.9)).arrayBuffer());
    const webp = new Uint8Array(await (await nodeEnv.encode(photo, 'image/webp', 0.9)).arrayBuffer());
    expect(sniffFormat(png)).toBe('png');
    expect(sniffFormat(jpg)).toBe('jpeg');
    expect(sniffFormat(webp)).toBe('webp');
    expect(headerDimensions(png, 'png')).toEqual({ width: 120, height: 90 });
    expect(headerDimensions(jpg, 'jpeg')).toEqual({ width: 120, height: 90 });
    expect(headerDimensions(webp, 'webp')).toEqual({ width: 120, height: 90 });
  });

  it('flags a signature/extension mismatch honestly', async () => {
    const blob = await fixturePngBlob(40, 30);
    const misnamed = new File([blob], 'holiday.jpg', { type: 'image/jpeg' });
    const inspection = await inspectFile(misnamed);
    expect(inspection.format).toBe('png');
    expect(inspection.signatureMismatch).toBe(true);
  });

  it('rejects empty files', async () => {
    await expect(inspectFile(new File([], 'x.png'))).rejects.toBeInstanceOf(ImageToolError);
  });
});

describe('decode', () => {
  it('decodes a PNG to a materialized surface with correct dimensions', async () => {
    const decoded = await decodeImage(nodeEnv, await fixturePngBlob(320, 240));
    expect(decoded.format).toBe('png');
    expect(decoded.width).toBe(320);
    expect(decoded.height).toBe(240);
    expect(decoded.surface.width).toBe(320);
  });

  it('rejects garbage bytes with an honest unsupported-format error', async () => {
    const junk = new Blob([new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8])], { type: 'image/png' });
    await expect(decodeImage(nodeEnv, junk)).rejects.toMatchObject({ code: 'unsupported-format' });
  });
});

describe('resize geometry', () => {
  it('computes exact, width-only, height-only and percent sizes', () => {
    expect(computeResize(800, 600, { targetWidth: 200, targetHeight: 100 })).toMatchObject({
      outWidth: 200,
      outHeight: 100,
    });
    expect(computeResize(800, 600, { targetWidth: 400 })).toMatchObject({ outWidth: 400, outHeight: 300 });
    expect(computeResize(800, 600, { targetHeight: 150 })).toMatchObject({ outWidth: 200, outHeight: 150 });
    expect(computeResize(800, 600, { percent: 25 })).toMatchObject({ outWidth: 200, outHeight: 150 });
  });

  it('contain letterboxes inside the box; cover crops centrally', () => {
    const contain = computeResize(800, 600, { targetWidth: 100, targetHeight: 100, fit: 'contain' });
    expect(contain.outWidth).toBe(100);
    expect(contain.dw).toBe(100);
    expect(contain.dh).toBe(75);
    expect(contain.dy).toBe(13);
    const cover = computeResize(800, 600, { targetWidth: 100, targetHeight: 100, fit: 'cover' });
    expect(cover.sw).toBe(600);
    expect(cover.sh).toBe(600);
    expect(cover.sx).toBe(100);
  });

  it('renders real pixels at the requested size', async () => {
    const source = makePhotoFixture(400, 300);
    const out = renderResize(nodeEnv, source, { targetWidth: 200, targetHeight: 150 });
    const encoded = await nodeEnv.encode(out, 'image/png');
    const bytes = new Uint8Array(await encoded.arrayBuffer());
    expect(headerDimensions(bytes, 'png')).toEqual({ width: 200, height: 150 });
  });

  it('print maths: A4 at 300 DPI is 2480×3508; inches/cm/mm agree', () => {
    expect(a4Pixels(300)).toEqual({ width: 2480, height: 3508 });
    expect(pixelsForPrint(1, 'in', 300)).toBe(300);
    expect(pixelsForPrint(25.4, 'mm', 300)).toBe(300);
    expect(pixelsForPrint(2.54, 'cm', 300)).toBe(300);
    expect(printSizeForPixels(300, 300, 'in')).toBeCloseTo(1);
    expect(printSizeForPixels(2480, 300, 'mm')).toBeCloseTo(210, 0);
  });
});

describe('convert', () => {
  it('converts PNG → JPEG and PNG → WebP with real signatures', async () => {
    const source = makePhotoFixture(200, 150);
    const jpg = await convertImage(nodeEnv, source, { format: 'jpeg', quality: 0.9 });
    const jpgBytes = new Uint8Array(await jpg.blob.arrayBuffer());
    expect(jpgBytes[0]).toBe(0xff);
    expect(jpgBytes[1]).toBe(0xd8);
    expect(headerDimensions(jpgBytes, 'jpeg')).toEqual({ width: 200, height: 150 });
    const webp = await convertImage(nodeEnv, source, { format: 'webp', quality: 0.9 });
    expect(sniffFormat(new Uint8Array(await webp.blob.arrayBuffer()))).toBe('webp');
  });
});

describe('compress', () => {
  it('compressWithSettings produces a smaller JPEG than the PNG original', async () => {
    const source = makePhotoFixture(600, 450);
    const png = await nodeEnv.encode(source, 'image/png');
    const jpg = await compressWithSettings(nodeEnv, source, { format: 'jpeg', quality: 0.8 });
    expect(jpg.sizeBytes).toBeLessThan(png.size);
    expect(jpg.width).toBe(600);
  });

  it('compressToTarget reaches 100 KB on a compressible photo and says so', async () => {    const decoded = await decodeImage(nodeEnv, await fixturePngBlob(1600, 1200));
    const result = await compressToTarget(nodeEnv, decoded.surface, {
      targetBytes: 100 * 1024,
      format: 'jpeg',
    });
    expect(result.achieved).toBe(true);
    expect(result.sizeBytes).toBeLessThanOrEqual(100 * 1024);
    expect(result.sizeBytes).toBe(result.blob.size);
    expect(result.attempts).toBeGreaterThan(0);
  }, 30000);

  it('compressToTarget honestly reports failure on incompressible noise', async () => {
    // Random noise at the lowest quality, shrunk to the smallest sensible
    // size, still cannot fit in 1 KB — the engine must say so, not claim it.
    const noise = makeNoiseFixture(1600, 1600);
    const result = await compressToTarget(nodeEnv, noise, {
      targetBytes: 1024,
      format: 'jpeg',
    });
    expect(result.achieved).toBe(false);
    expect(result.sizeBytes).toBeGreaterThan(1024);
    expect(result.notes.join(' ')).toContain('could not be reached');
  }, 60000);

  it('compressToTarget for PNG never invents a quality value', async () => {
    const decoded = await decodeImage(nodeEnv, await fixturePngBlob(400, 300));
    const result = await compressToTarget(nodeEnv, decoded.surface, {
      targetBytes: 40 * 1024,
      format: 'png',
    });
    expect(result.quality).toBeNull();
    if (result.achieved) {
      expect(result.sizeBytes).toBeLessThanOrEqual(40 * 1024);
      expect(result.scaledDown).toBe(true);
    }
  });
});
