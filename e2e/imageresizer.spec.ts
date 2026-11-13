import { test, expect, request as pwRequest } from '@playwright/test';
import { createCanvas } from '@napi-rs/canvas';
import JSZip from 'jszip';
import { readFile } from 'node:fs/promises';

/**
 * Image Resizer browser QA — the Phase H gate.
 *
 * Exists for the same reason as invoice-workspace.spec.ts: unit tests and
 * curl cannot prove the tools work in a real browser (hydration, canvas
 * encode, downloads). Every assertion here is on REAL output bytes:
 * downloaded files are parsed for dimensions, format signatures and size.
 */

function photoBuffer(width: number, height: number, format: 'png' | 'jpeg'): Buffer {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  const grad = ctx.createLinearGradient(0, 0, width, height);
  grad.addColorStop(0, '#3b82f6');
  grad.addColorStop(0.5, '#10b981');
  grad.addColorStop(1, '#f59e0b');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.beginPath();
  ctx.arc(width * 0.3, height * 0.4, Math.min(width, height) * 0.18, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(width * 0.55, height * 0.55, width * 0.3, height * 0.25);
  return format === 'png' ? canvas.toBuffer('image/png') : canvas.toBuffer('image/jpeg', 92);
}

/** JPEG with a hand-built EXIF APP1 (Make/Model) spliced after the SOI. */
function exifJpegBuffer(): Buffer {
  const base = photoBuffer(320, 240, 'jpeg');
  // TIFF: little-endian, IFD0 with Make (0x010F) + Model (0x0110) ASCII.
  const make = 'TestCam\0';
  const model = 'TC-1000\0';
  const tiff = Buffer.alloc(8 + 2 + 2 * 12 + 4 + make.length + model.length);
  tiff.write('II', 0);
  tiff.writeUInt16LE(42, 2);
  tiff.writeUInt32LE(8, 4);
  tiff.writeUInt16LE(2, 8); // two entries
  const dataStart = 8 + 2 + 24 + 4;
  // Make entry
  tiff.writeUInt16LE(0x010f, 10);
  tiff.writeUInt16LE(2, 12); // ASCII
  tiff.writeUInt32LE(make.length, 14);
  tiff.writeUInt32LE(dataStart, 18);
  // Model entry
  tiff.writeUInt16LE(0x0110, 22);
  tiff.writeUInt16LE(2, 24);
  tiff.writeUInt32LE(model.length, 26);
  tiff.writeUInt32LE(dataStart + make.length, 30);
  tiff.writeUInt32LE(0, 34); // next IFD
  tiff.write(make, dataStart);
  tiff.write(model, dataStart + make.length);
  const app1 = Buffer.concat([Buffer.from('Exif\0\0', 'latin1'), tiff]);
  const segment = Buffer.alloc(4);
  segment.writeUInt16BE(0xffe1, 0);
  segment.writeUInt16BE(app1.length + 2, 2);
  return Buffer.concat([base.subarray(0, 2), segment, app1, base.subarray(2)]);
}

function pngDimensions(buf: Buffer): { width: number; height: number } {
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

async function downloadBytes(page: import('@playwright/test').Page, namePart: string): Promise<Buffer> {
  const [download] = await Promise.all([
    page.waitForEvent('download', { timeout: 30_000 }),
    page.getByRole('link', { name: new RegExp(`Download.*${namePart}`) }).first().click(),
  ]);
  const path = await download.path();
  if (!path) throw new Error('download produced no file');
  return readFile(path);
}

async function setFile(page: import('@playwright/test').Page, name: string, mimeType: string, buffer: Buffer) {
  await page.locator('input[type="file"]').first().setInputFiles({ name, mimeType, buffer });
}

test.describe('imageresizer tools (live browser)', () => {
  test('resize produces a PNG with the exact requested dimensions', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto('/imageresizer-site/resize-image');
    await setFile(page, 'photo.png', 'image/png', photoBuffer(900, 600, 'png'));
    const widthInput = page.locator('label', { hasText: 'Width (px)' }).locator('input').first();
    await expect(widthInput).toHaveValue('900');
    await widthInput.fill('450');
    await page.getByRole('button', { name: /Resize to 450/ }).click();
    const bytes = await downloadBytes(page, 'photo');
    expect(bytes.subarray(1, 4).toString('latin1')).toBe('PNG');
    expect(pngDimensions(bytes)).toEqual({ width: 450, height: 300 });
    expect(errors).toEqual([]);
  });

  test('compress-to-100KB lands at or under the target', async ({ page }) => {
    await page.goto('/imageresizer-site/compress-image-to-100kb');
    await setFile(page, 'shot.jpg', 'image/jpeg', photoBuffer(1600, 1200, 'jpeg'));
    await page.getByRole('button', { name: /Compress to/ }).first().click();
    await expect(page.getByText(/Target met:/).first()).toBeVisible({
      timeout: 60_000,
    });
    const bytes = await downloadBytes(page, 'shot');
    expect(bytes.length).toBeLessThanOrEqual(100 * 1024);
  });

  test('PNG to WebP conversion returns real WebP bytes', async ({ page }) => {
    await page.goto('/imageresizer-site/png-to-webp');
    await setFile(page, 'art.png', 'image/png', photoBuffer(640, 400, 'png'));
    await page.getByRole('button', { name: /Convert to WEBP/i }).click();
    const bytes = await downloadBytes(page, 'art');
    expect(bytes.subarray(0, 4).toString('latin1')).toBe('RIFF');
    expect(bytes.subarray(8, 12).toString('latin1')).toBe('WEBP');
  });

  test('bulk resizer processes two files and the ZIP contains both outputs', async ({ page }) => {
    await page.goto('/imageresizer-site/bulk-image-resizer');
    await page.locator('input[type="file"]').first().setInputFiles([
      { name: 'one.png', mimeType: 'image/png', buffer: photoBuffer(800, 500, 'png') },
      { name: 'two.png', mimeType: 'image/png', buffer: photoBuffer(700, 700, 'png') },
    ]);
    await expect(page.getByText('Done').first()).toBeVisible({ timeout: 30_000 });
    const [download] = await Promise.all([
      page.waitForEvent('download', { timeout: 30_000 }),
      page.getByRole('button', { name: /Download all \(2\) as ZIP/ }).click(),
    ]);
    const path = await download.path();
    if (!path) throw new Error('no zip downloaded');
    const zip = await JSZip.loadAsync(await readFile(path));
    const names = Object.keys(zip.files).filter((n) => !zip.files[n].dir);
    expect(names.length).toBe(2);
  });

  test('EXIF remover shows metadata and the stripped output has no EXIF', async ({ page }) => {
    await page.goto('/imageresizer-site/remove-exif-data');
    await setFile(page, 'cam.jpg', 'image/jpeg', exifJpegBuffer());
    await expect(page.getByText('TestCam').first()).toBeVisible({ timeout: 15_000 });
    await page.getByRole('button', { name: /Strip metadata/ }).first().click();
    await expect(page.getByText(/No embedded metadata was found in this file/i).first()).toBeVisible({ timeout: 15_000 });
    const bytes = await downloadBytes(page, 'cam');
    expect(bytes.includes(Buffer.from('Exif\0\0', 'latin1'))).toBe(false);
  });
});

test.describe('imageresizer responsive + console sweep', () => {
  const ROUTES = [
    '/imageresizer-site',
    '/imageresizer-site/resize-image',
    '/imageresizer-site/image-editor',
    '/imageresizer-site/passport-photo-maker',
    '/imageresizer-site/guides',
  ];
  for (const width of [320, 360, 390, 768, 1024, 1440]) {
    test(`no horizontal overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      for (const route of ROUTES) {
        await page.goto(route);
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth
        );
        expect(overflow, `${route} @ ${width}px`).toBeLessThanOrEqual(0);
      }
    });
  }

  test('no page errors or CSP console errors on key pages', async ({ page }) => {
    const bad: string[] = [];
    page.on('pageerror', (e) => bad.push(`pageerror: ${e.message}`));
    page.on('console', (msg) => {
      if (msg.type() === 'error' && /Content Security Policy|Refused to/i.test(msg.text())) {
        bad.push(`console: ${msg.text()}`);
      }
    });
    for (const route of ROUTES) await page.goto(route);
    expect(bad).toEqual([]);
  });
});

test.describe('imageresizer host routing (Host header)', () => {
  test('subdomain serves the site, logos and sitemap section 9', async ({ baseURL }) => {
    const ctx = await pwRequest.newContext({
      baseURL,
      extraHTTPHeaders: { Host: 'imageresizer.freeqrcode.tools' },
    });
    const home = await ctx.get('/');
    expect(home.status()).toBe(200);
    expect(await home.text()).toContain('imageresizer-site-root');
    const logo = await ctx.get('/imageresizer-logo.svg');
    expect(logo.status()).toBe(200);
    expect(logo.headers()['content-type']).toContain('image/svg+xml');
    const sitemap = await ctx.get('/sitemap/9.xml');
    expect(sitemap.status()).toBe(200);
    expect(await sitemap.text()).toContain('https://imageresizer.freeqrcode.tools/passport-photo-maker');
    await ctx.dispose();
  });

  test('invoice logo still serves on the invoice host (static-asset guard)', async ({ baseURL }) => {
    const ctx = await pwRequest.newContext({
      baseURL,
      extraHTTPHeaders: { Host: 'invoicegenerator.freeqrcode.tools' },
    });
    const logo = await ctx.get('/invoice-logo.svg');
    expect(logo.status()).toBe(200);
    expect(logo.headers()['content-type']).toContain('image/svg+xml');
    await ctx.dispose();
  });
});
