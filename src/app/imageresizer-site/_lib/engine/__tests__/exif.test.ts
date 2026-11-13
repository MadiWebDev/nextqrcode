// @vitest-environment node
/**
 * EXIF parser tests: a real TIFF structure is built byte-by-byte (IFD0 +
 * ExifIFD + GPS IFD with rational DMS coordinates) and wrapped in a JPEG
 * APP1 segment; the parser must recover the camera fields and the GPS
 * decimal coordinates. PNG text-chunk parsing uses a real chunk layout.
 */
import { describe, expect, it } from 'vitest';
import { parseJpegExif, parsePngMetadata } from '../exif';

// --- little-endian TIFF value encoders --------------------------------------
const ascii = (s: string) => new Uint8Array([...s.split('').map((c) => c.charCodeAt(0)), 0]);
function shorts(...ns: number[]): Uint8Array {
  const b = new Uint8Array(ns.length * 2);
  const dv = new DataView(b.buffer);
  ns.forEach((n, i) => dv.setUint16(i * 2, n, true));
  return b;
}
function longs(...ns: number[]): Uint8Array {
  const b = new Uint8Array(ns.length * 4);
  const dv = new DataView(b.buffer);
  ns.forEach((n, i) => dv.setUint32(i * 4, n, true));
  return b;
}
function rationals(...pairs: Array<[number, number]>): Uint8Array {
  const b = new Uint8Array(pairs.length * 8);
  const dv = new DataView(b.buffer);
  pairs.forEach(([n, d], i) => {
    dv.setUint32(i * 8, n, true);
    dv.setUint32(i * 8 + 4, d, true);
  });
  return b;
}

const TYPE_SIZE: Record<number, number> = { 1: 1, 2: 1, 3: 2, 4: 4, 5: 8, 7: 1, 9: 4, 10: 8 };
interface Entry {
  tag: number;
  type: number;
  data: Uint8Array;
}

function buildExifJpeg(): Uint8Array {
  const ifd0Count = 6;
  const exifCount = 5;
  const gpsCount = 4;
  const ifd0Off = 8;
  const exifOff = ifd0Off + 2 + ifd0Count * 12 + 4;
  const gpsOff = exifOff + 2 + exifCount * 12 + 4;
  const dataStart = gpsOff + 2 + gpsCount * 12 + 4;

  const extData: Uint8Array[] = [];
  let cursor = dataStart;
  const place = (entry: Entry): number => {
    if (entry.data.length <= 4) return -1;
    const off = cursor;
    extData.push(entry.data);
    cursor += entry.data.length;
    if (cursor % 2) {
      extData.push(new Uint8Array([0]));
      cursor++;
    }
    return off;
  };

  const ifd0: Entry[] = [
    { tag: 0x010f, type: 2, data: ascii('Canon') },
    { tag: 0x0110, type: 2, data: ascii('TestCam X1') },
    { tag: 0x0112, type: 3, data: shorts(6) },
    { tag: 0x011a, type: 5, data: rationals([72, 1]) },
    { tag: 0x8769, type: 4, data: longs(exifOff) },
    { tag: 0x8825, type: 4, data: longs(gpsOff) },
  ];
  const exif: Entry[] = [
    { tag: 0x829a, type: 5, data: rationals([1, 125]) },
    { tag: 0x829d, type: 5, data: rationals([28, 10]) },
    { tag: 0x8827, type: 3, data: shorts(200) },
    { tag: 0x9003, type: 2, data: ascii('2026:11:01 10:30:00') },
    { tag: 0xa405, type: 5, data: rationals([24, 1]) },
  ];
  const gps: Entry[] = [
    { tag: 0x0001, type: 2, data: ascii('N') },
    { tag: 0x0002, type: 5, data: rationals([33, 1], [35, 1], [24, 1]) },
    { tag: 0x0003, type: 2, data: ascii('E') },
    { tag: 0x0004, type: 5, data: rationals([73, 1], [6, 1], [36, 1]) },
  ];
  [...ifd0, ...exif, ...gps].forEach(place);

  const total = cursor;
  const tiff = new Uint8Array(total);
  const dv = new DataView(tiff.buffer);
  tiff[0] = 0x49; // II
  tiff[1] = 0x49;
  dv.setUint16(2, 42, true);
  dv.setUint32(4, ifd0Off, true);

  let extCursor = dataStart;
  const writeIfd = (entries: Entry[], off: number) => {
    dv.setUint16(off, entries.length, true);
    entries
      .slice()
      .sort((a, b) => a.tag - b.tag)
      .forEach((entry, i) => {
        const at = off + 2 + i * 12;
        dv.setUint16(at, entry.tag, true);
        dv.setUint16(at + 2, entry.type, true);
        dv.setUint32(at + 4, entry.data.length / TYPE_SIZE[entry.type], true);
        if (entry.data.length <= 4) {
          tiff.set(entry.data, at + 8);
        } else {
          dv.setUint32(at + 8, extCursor, true);
          tiff.set(entry.data, extCursor);
          extCursor += entry.data.length;
          if (extCursor % 2) extCursor++;
        }
      });
    dv.setUint32(off + 2 + entries.length * 12, 0, true);
  };
  writeIfd(ifd0, ifd0Off);
  writeIfd(exif, exifOff);
  writeIfd(gps, gpsOff);

  // Wrap: SOI + APP1("Exif\0\0" + TIFF) + EOI
  const app1Length = 2 + 6 + tiff.length;
  const jpeg = new Uint8Array(2 + 2 + app1Length + 2);
  jpeg[0] = 0xff;
  jpeg[1] = 0xd8;
  jpeg[2] = 0xff;
  jpeg[3] = 0xe1;
  new DataView(jpeg.buffer).setUint16(4, app1Length);
  jpeg.set([0x45, 0x78, 0x69, 0x66, 0, 0], 6);
  jpeg.set(tiff, 12);
  jpeg[jpeg.length - 2] = 0xff;
  jpeg[jpeg.length - 1] = 0xd9;
  return jpeg;
}

describe('parseJpegExif', () => {
  const report = parseJpegExif(buildExifJpeg());

  it('finds the EXIF report', () => {
    expect(report).not.toBeNull();
    expect(report!.source).toBe('jpeg');
    expect(report!.tagCount).toBeGreaterThanOrEqual(13);
  });

  it('reads camera + exposure fields with formatted values', () => {
    const byLabel = new Map(report!.fields.map((f) => [f.label, f.value]));
    expect(byLabel.get('Camera make')).toBe('Canon');
    expect(byLabel.get('Camera model')).toBe('TestCam X1');
    expect(byLabel.get('Exposure time')).toBe('1/125 s');
    expect(byLabel.get('F-number')).toBe('f/2.8');
    expect(byLabel.get('ISO speed')).toBe('200');
    expect(byLabel.get('Focal length')).toBe('24 mm');
    expect(byLabel.get('Date taken')).toBe('2026:11:01 10:30:00');
    expect(byLabel.get('Orientation')).toBe('Rotated 90° CW');
  });

  it('converts GPS DMS rationals to decimal degrees', () => {
    expect(report!.gps).toBeDefined();
    expect(report!.gps!.latitude).toBeCloseTo(33.59, 4);
    expect(report!.gps!.longitude).toBeCloseTo(73.11, 4);
  });

  it('returns null for a JPEG without EXIF and for non-JPEGs', () => {
    expect(parseJpegExif(new Uint8Array([0xff, 0xd8, 0xff, 0xd9]))).toBeNull();
    expect(parseJpegExif(new Uint8Array([0x89, 0x50, 0x4e, 0x47]))).toBeNull();
  });
});

describe('parsePngMetadata', () => {
  function chunk(type: string, data: Uint8Array): Uint8Array {
    const out = new Uint8Array(12 + data.length);
    const dv = new DataView(out.buffer);
    dv.setUint32(0, data.length);
    for (let i = 0; i < 4; i++) out[4 + i] = type.charCodeAt(i);
    out.set(data, 8);
    return out;
  }

  it('lists tEXt entries', () => {
    const signature = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    const textData = new Uint8Array([
      ...'Author'.split('').map((c) => c.charCodeAt(0)),
      0,
      ...'Test Person'.split('').map((c) => c.charCodeAt(0)),
    ]);
    const png = new Uint8Array([
      ...signature,
      ...chunk('tEXt', textData),
      ...chunk('IEND', new Uint8Array()),
    ]);
    const report = parsePngMetadata(png);
    expect(report).not.toBeNull();
    expect(report!.fields).toContainEqual({ label: 'Text: Author', value: 'Test Person' });
  });

  it('returns null when the PNG carries no metadata chunks', () => {
    const signature = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    const png = new Uint8Array([...signature, ...chunk('IEND', new Uint8Array())]);
    expect(parsePngMetadata(png)).toBeNull();
  });
});
