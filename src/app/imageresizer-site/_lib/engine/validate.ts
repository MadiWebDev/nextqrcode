/**
 * File validation: magic-byte signature sniffing (never trust the extension
 * or the declared MIME type alone), size guards, and header dimension reads
 * for the formats whose headers expose them cheaply.
 */
import {
  FORMAT_BY_MIME,
  ImageToolError,
  MAX_INPUT_BYTES,
  type FileInspection,
  type RasterFormat,
} from './types';

const SIG = {
  jpeg: [0xff, 0xd8, 0xff],
  png: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a],
  gif: [0x47, 0x49, 0x46, 0x38], // GIF8
  bmp: [0x42, 0x4d], // BM
  ico: [0x00, 0x00, 0x01, 0x00],
  tiffLE: [0x49, 0x49, 0x2a, 0x00],
  tiffBE: [0x4d, 0x4d, 0x00, 0x2a],
};

function startsWith(bytes: Uint8Array, sig: number[], offset = 0): boolean {
  if (bytes.length < offset + sig.length) return false;
  return sig.every((b, i) => bytes[offset + i] === b);
}

function ascii(bytes: Uint8Array, start: number, length: number): string {
  let out = '';
  for (let i = start; i < start + length && i < bytes.length; i++) {
    out += String.fromCharCode(bytes[i]);
  }
  return out;
}

/** Sniff the real format from the file's leading bytes. */
export function sniffFormat(bytes: Uint8Array): RasterFormat {
  if (startsWith(bytes, SIG.png)) return 'png';
  if (startsWith(bytes, SIG.jpeg)) return 'jpeg';
  if (startsWith(bytes, SIG.gif)) return 'gif';
  if (startsWith(bytes, SIG.bmp)) return 'bmp';
  if (startsWith(bytes, SIG.ico)) return 'ico';
  if (startsWith(bytes, SIG.tiffLE) || startsWith(bytes, SIG.tiffBE)) return 'tiff';
  // RIFF containers: WEBP or WEBP-adjacent
  if (ascii(bytes, 0, 4) === 'RIFF' && ascii(bytes, 8, 4) === 'WEBP') return 'webp';
  // ISO-BMFF (AVIF / HEIC): 'ftyp' box at offset 4, brand at offset 8
  if (ascii(bytes, 4, 4) === 'ftyp') {
    const brand = ascii(bytes, 8, 4);
    if (brand === 'avif' || brand === 'avis') return 'avif';
    if (['heic', 'heix', 'hevc', 'heim', 'heis', 'hevm', 'mif1', 'mif2', 'msf1'].includes(brand)) {
      return 'heic';
    }
  }
  // SVG is text: allow BOM + leading whitespace / XML prolog before <svg.
  const head = ascii(bytes, 0, Math.min(bytes.length, 1024))
    .replace(/^﻿/, '')
    .trimStart()
    .toLowerCase();
  if (head.startsWith('<svg') || (head.startsWith('<?xml') && head.includes('<svg'))) {
    return 'svg';
  }
  return 'unknown';
}

const EXT_TO_FORMAT: Record<string, RasterFormat> = {
  jpg: 'jpeg',
  jpeg: 'jpeg',
  png: 'png',
  webp: 'webp',
  avif: 'avif',
  gif: 'gif',
  bmp: 'bmp',
  tif: 'tiff',
  tiff: 'tiff',
  heic: 'heic',
  heif: 'heic',
  svg: 'svg',
  ico: 'ico',
};

export function formatFromName(name: string): RasterFormat {
  const ext = name.split('.').pop()?.toLowerCase() ?? '';
  return EXT_TO_FORMAT[ext] ?? 'unknown';
}

/**
 * Inspect a file before decode: reads the signature from the first bytes and
 * cross-checks it against the extension/MIME. Throws ImageToolError for
 * empty/oversized inputs; unknown signatures are reported, not thrown, so
 * the caller can decide (decode will fail honestly if it truly can't).
 */
export async function inspectFile(file: Blob & { name?: string }): Promise<FileInspection> {
  if (file.size === 0) {
    throw new ImageToolError('empty-file', 'This file is empty (0 bytes).');
  }
  if (file.size > MAX_INPUT_BYTES) {
    throw new ImageToolError(
      'file-too-large',
      `This file is ${(file.size / 1024 / 1024).toFixed(1)} MB. The limit is ${MAX_INPUT_BYTES / 1024 / 1024} MB — larger files would exhaust browser memory on many devices.`
    );
  }
  const head = new Uint8Array(await file.slice(0, 4096).arrayBuffer());
  const format = sniffFormat(head);
  const nameFormat = file.name ? formatFromName(file.name) : 'unknown';
  const mimeFormat = FORMAT_BY_MIME[file.type] ?? 'unknown';
  const signatureMismatch =
    format !== 'unknown' &&
    ((nameFormat !== 'unknown' && nameFormat !== format) ||
      (mimeFormat !== 'unknown' && mimeFormat !== format));
  return { format, signatureMismatch, declaredMime: file.type, sizeBytes: file.size };
}

/**
 * Read pixel dimensions from container headers where that is cheap and
 * reliable (used for fail-fast memory guards and instant UI feedback).
 * Returns null when the format doesn't expose them simply.
 */
export function headerDimensions(
  bytes: Uint8Array,
  format: RasterFormat
): { width: number; height: number } | null {
  const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  try {
    switch (format) {
      case 'png':
        if (bytes.length >= 24) return { width: dv.getUint32(16), height: dv.getUint32(20) };
        return null;
      case 'gif':
        if (bytes.length >= 10) return { width: dv.getUint16(6, true), height: dv.getUint16(8, true) };
        return null;
      case 'bmp':
        if (bytes.length >= 26) {
          return {
            width: Math.abs(dv.getInt32(18, true)),
            height: Math.abs(dv.getInt32(22, true)),
          };
        }
        return null;
      case 'webp': {
        const kind = ascii(bytes, 12, 4);
        if (kind === 'VP8 ' && bytes.length >= 30) {
          return {
            width: dv.getUint16(26, true) & 0x3fff,
            height: dv.getUint16(28, true) & 0x3fff,
          };
        }
        if (kind === 'VP8L' && bytes.length >= 25) {
          const bits = dv.getUint32(21, true);
          return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
        }
        if (kind === 'VP8X' && bytes.length >= 30) {
          return {
            width: (dv.getUint32(24, true) & 0xffffff) + 1,
            height: (dv.getUint32(27, true) & 0xffffff) + 1,
          };
        }
        return null;
      }
      case 'jpeg': {
        // Walk markers to SOF0/SOF2.
        let offset = 2;
        while (offset + 9 < bytes.length) {
          if (bytes[offset] !== 0xff) return null;
          const marker = bytes[offset + 1];
          if (marker === 0xc0 || marker === 0xc2) {
            return { width: dv.getUint16(offset + 7), height: dv.getUint16(offset + 5) };
          }
          const len = dv.getUint16(offset + 2);
          if (len < 2) return null;
          offset += 2 + len;
        }
        return null;
      }
      default:
        return null;
    }
  } catch {
    return null;
  }
}
