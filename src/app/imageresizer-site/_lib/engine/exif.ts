/**
 * Image metadata reading — a small, real, dependency-free parser.
 *
 * JPEG: walks marker segments to APP1 "Exif\0\0" and parses the TIFF
 * structure (IFD0 + ExifIFD + GPS IFD), including GPS coordinate maths.
 * PNG: parses the eXIf chunk (raw TIFF) and lists tEXt/iTXt/zTXt keys.
 * WebP: reports EXIF chunk presence honestly (fields are not parsed).
 *
 * Privacy contract: this runs entirely locally. GPS is returned only to the
 * viewer UI on the user's own device — it is never sent anywhere, and the
 * caller must require an explicit action before copying/sharing it.
 */

export interface MetadataField {
  label: string;
  value: string;
}

export interface MetadataReport {
  source: 'jpeg' | 'png' | 'webp';
  fields: MetadataField[];
  gps?: { latitude: number; longitude: number };
  /** Raw tag count before de-duplication/formatting. */
  tagCount: number;
}

// ---------------------------------------------------------------------------
// TIFF parser
// ---------------------------------------------------------------------------

const TYPE_SIZES: Record<number, number> = {
  1: 1, 2: 1, 3: 2, 4: 4, 5: 8, 6: 1, 7: 1, 8: 2, 9: 4, 10: 8, 11: 4, 12: 8,
};

interface TiffReader {
  dv: DataView;
  base: number; // offset of TIFF header within the underlying buffer
  littleEndian: boolean;
}

function tiffU16(r: TiffReader, off: number): number {
  return r.dv.getUint16(r.base + off, r.littleEndian);
}
function tiffU32(r: TiffReader, off: number): number {
  return r.dv.getUint32(r.base + off, r.littleEndian);
}

type TiffValue =
  | { kind: 'ascii'; text: string }
  | { kind: 'numbers'; values: number[] }
  | { kind: 'rationals'; values: Array<[number, number]> }
  | { kind: 'raw'; bytes: Uint8Array };

function readTiffValue(r: TiffReader, type: number, count: number, valueFieldOff: number): TiffValue | null {
  const size = TYPE_SIZES[type];
  if (!size) return null;
  const total = size * count;
  const dataOff = total <= 4 ? valueFieldOff : tiffU32(r, valueFieldOff);
  if (dataOff + total > r.dv.byteLength - r.base && total > 4) return null;
  const abs = total <= 4 ? r.base + valueFieldOff : r.base + dataOff;
  if (abs + total > r.dv.byteLength) return null;
  if (type === 2) {
    let text = '';
    for (let i = 0; i < count; i++) {
      const code = r.dv.getUint8(abs + i);
      if (code === 0) break;
      text += String.fromCharCode(code);
    }
    return { kind: 'ascii', text: text.trim() };
  }
  if (type === 5 || type === 10) {
    const values: Array<[number, number]> = [];
    for (let i = 0; i < count; i++) {
      const num = type === 5 ? tiffU32(r, dataOff + i * 8) : r.dv.getInt32(r.base + dataOff + i * 8, r.littleEndian);
      const den =
        type === 5 ? tiffU32(r, dataOff + i * 8 + 4) : r.dv.getInt32(r.base + dataOff + i * 8 + 4, r.littleEndian);
      values.push([num, den]);
    }
    return { kind: 'rationals', values };
  }
  if (type === 1 || type === 7) {
    const bytes = new Uint8Array(count);
    for (let i = 0; i < count; i++) bytes[i] = r.dv.getUint8(abs + i);
    return type === 1 ? { kind: 'numbers', values: Array.from(bytes) } : { kind: 'raw', bytes };
  }
  const values: number[] = [];
  for (let i = 0; i < count; i++) {
    if (type === 3) values.push(r.dv.getUint16(abs + i * 2, r.littleEndian));
    else if (type === 4) values.push(r.dv.getUint32(abs + i * 4, r.littleEndian));
    else if (type === 9) values.push(r.dv.getInt32(abs + i * 4, r.littleEndian));
    else if (type === 8) values.push(r.dv.getInt16(abs + i * 2, r.littleEndian));
    else return null;
  }
  return { kind: 'numbers', values };
}

interface IfdEntry {
  tag: number;
  value: TiffValue;
}

function readIfd(r: TiffReader, ifdOff: number): { entries: IfdEntry[]; next: number } {
  const entries: IfdEntry[] = [];
  if (ifdOff <= 0 || r.base + ifdOff + 2 > r.dv.byteLength) return { entries, next: 0 };
  const count = tiffU16(r, ifdOff);
  for (let i = 0; i < count; i++) {
    const entryOff = ifdOff + 2 + i * 12;
    if (r.base + entryOff + 12 > r.dv.byteLength) break;
    const tag = tiffU16(r, entryOff);
    const type = tiffU16(r, entryOff + 2);
    const num = tiffU32(r, entryOff + 4);
    const value = readTiffValue(r, type, num, entryOff + 8);
    if (value) entries.push({ tag, value });
  }
  const nextOff = ifdOff + 2 + count * 12;
  const next = r.base + nextOff + 4 <= r.dv.byteLength ? tiffU32(r, nextOff) : 0;
  return { entries, next };
}

const IFD0_LABELS: Record<number, string> = {
  0x010f: 'Camera make',
  0x0110: 'Camera model',
  0x0112: 'Orientation',
  0x011a: 'X resolution',
  0x011b: 'Y resolution',
  0x0128: 'Resolution unit',
  0x0131: 'Software',
  0x0132: 'Date modified',
  0x013b: 'Artist',
  0x8298: 'Copyright',
};

const EXIF_LABELS: Record<number, string> = {
  0x829a: 'Exposure time',
  0x829d: 'F-number',
  0x8822: 'Exposure program',
  0x8827: 'ISO speed',
  0x8833: 'ISOSpeedRatings',
  0x9003: 'Date taken',
  0x9004: 'Date digitized',
  0x9209: 'Flash',
  0xa002: 'Image width (EXIF)',
  0xa003: 'Image height (EXIF)',
  0xa405: 'Focal length',
  0xa434: 'Lens model',
  0xa433: 'Lens make',
};

const ORIENTATION_LABELS: Record<number, string> = {
  1: 'Normal',
  2: 'Mirrored horizontally',
  3: 'Rotated 180°',
  4: 'Mirrored vertically',
  5: 'Mirrored + rotated 270° CW',
  6: 'Rotated 90° CW',
  7: 'Mirrored + rotated 90° CW',
  8: 'Rotated 270° CW',
};

function formatValue(tag: number, value: TiffValue): string | null {
  if (value.kind === 'ascii') return value.text || null;
  if (value.kind === 'rationals') {
    const [first] = value.values;
    if (!first) return null;
    const [num, den] = first;
    if (den === 0) return null;
    const v = num / den;
    if (tag === 0x829a) {
      // Exposure time
      return v < 1 ? `1/${Math.round(1 / v)} s` : `${v.toFixed(1)} s`;
    }
    if (tag === 0x829d) return `f/${v.toFixed(1)}`;
    if (tag === 0xa405) return `${v.toFixed(0)} mm`;
    if (tag === 0x011a || tag === 0x011b) return v.toFixed(0);
    return v.toFixed(2);
  }
  if (value.kind === 'numbers') {
    const [first] = value.values;
    if (first === undefined) return null;
    if (tag === 0x0112) return ORIENTATION_LABELS[first] ?? String(first);
    if (tag === 0x0128) return first === 2 ? 'inches (dpi)' : first === 3 ? 'centimetres' : String(first);
    if (tag === 0x9209) return first === 0 ? 'Did not fire' : 'Fired';
    return value.values.slice(0, 4).join(', ');
  }
  return null;
}

function dmsToDecimal(rationals: Array<[number, number]>, ref: string): number | null {
  if (rationals.length < 3) return null;
  const parts = rationals.map(([n, d]) => (d === 0 ? 0 : n / d));
  let decimal = parts[0] + parts[1] / 60 + parts[2] / 3600;
  if (ref === 'S' || ref === 'W') decimal = -decimal;
  return Math.round(decimal * 1e6) / 1e6;
}

export function parseTiff(bytes: Uint8Array, base: number): Omit<MetadataReport, 'source'> | null {
  if (base + 8 > bytes.length) return null;
  const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const order = String.fromCharCode(bytes[base], bytes[base + 1]);
  const littleEndian = order === 'II';
  if (!littleEndian && order !== 'MM') return null;
  const r: TiffReader = { dv, base, littleEndian };
  if (tiffU16(r, 2) !== 42) return null;
  const ifd0Off = tiffU32(r, 4);

  const fields: MetadataField[] = [];
  let tagCount = 0;
  let gps: MetadataReport['gps'];

  const collect = (entries: IfdEntry[], labels: Record<number, string>) => {
    for (const entry of entries) {
      tagCount++;
      const label = labels[entry.tag];
      if (!label) continue;
      const formatted = formatValue(entry.tag, entry.value);
      if (formatted) fields.push({ label, value: formatted });
    }
  };

  const ifd0 = readIfd(r, ifd0Off);
  collect(ifd0.entries, IFD0_LABELS);

  const findPointer = (entries: IfdEntry[], tag: number): number | null => {
    const entry = entries.find((e) => e.tag === tag);
    if (entry && entry.value.kind === 'numbers') return entry.value.values[0] ?? null;
    return null;
  };

  const exifOff = findPointer(ifd0.entries, 0x8769);
  if (exifOff) {
    const exif = readIfd(r, exifOff);
    collect(exif.entries, EXIF_LABELS);
  }

  const gpsOff = findPointer(ifd0.entries, 0x8825);
  if (gpsOff) {
    const gpsIfd = readIfd(r, gpsOff);
    tagCount += gpsIfd.entries.length;
    let latRef = 'N';
    let lonRef = 'E';
    let lat: Array<[number, number]> | null = null;
    let lon: Array<[number, number]> | null = null;
    for (const entry of gpsIfd.entries) {
      if (entry.tag === 0x0001 && entry.value.kind === 'ascii') latRef = entry.value.text;
      if (entry.tag === 0x0003 && entry.value.kind === 'ascii') lonRef = entry.value.text;
      if (entry.tag === 0x0002 && entry.value.kind === 'rationals') lat = entry.value.values;
      if (entry.tag === 0x0004 && entry.value.kind === 'rationals') lon = entry.value.values;
    }
    if (lat && lon) {
      const latitude = dmsToDecimal(lat, latRef);
      const longitude = dmsToDecimal(lon, lonRef);
      if (latitude !== null && longitude !== null) {
        gps = { latitude, longitude };
        fields.push({ label: 'GPS latitude', value: String(latitude) });
        fields.push({ label: 'GPS longitude', value: String(longitude) });
      }
    }
  }

  if (tagCount === 0) return null;
  return { fields, gps, tagCount };
}

// ---------------------------------------------------------------------------
// Container-level entry points
// ---------------------------------------------------------------------------

export function parseJpegExif(bytes: Uint8Array): MetadataReport | null {
  if (bytes.length < 4 || bytes[0] !== 0xff || bytes[1] !== 0xd8) return null;
  const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let offset = 2;
  while (offset + 4 <= bytes.length) {
    if (bytes[offset] !== 0xff) break;
    const marker = bytes[offset + 1];
    if (marker === 0xda || marker === 0xd9) break; // SOS / EOI
    if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
      offset += 2;
      continue;
    }
    const segmentLength = dv.getUint16(offset + 2);
    if (segmentLength < 2) break;
    if (marker === 0xe1) {
      const header = String.fromCharCode(...bytes.subarray(offset + 4, offset + 10));
      if (header === 'Exif\0\0') {
        const parsed = parseTiff(bytes, offset + 10);
        if (parsed) return { source: 'jpeg', ...parsed };
      }
    }
    offset += 2 + segmentLength;
  }
  return null;
}

export function parsePngMetadata(bytes: Uint8Array): MetadataReport | null {
  const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let offset = 8; // PNG signature
  const fields: MetadataField[] = [];
  let gps: MetadataReport['gps'];
  let tagCount = 0;
  while (offset + 12 <= bytes.length) {
    const length = dv.getUint32(offset);
    const type = String.fromCharCode(...bytes.subarray(offset + 4, offset + 8));
    const dataStart = offset + 8;
    if (dataStart + length > bytes.length) break;
    if (type === 'eXIf') {
      const parsed = parseTiff(bytes.subarray(dataStart, dataStart + length), 0);
      if (parsed) {
        fields.push(...parsed.fields);
        gps = parsed.gps;
        tagCount += parsed.tagCount;
      }
    } else if (type === 'tEXt' || type === 'zTXt') {
      const data = bytes.subarray(dataStart, dataStart + length);
      const nullIdx = data.indexOf(0);
      if (nullIdx > 0) {
        const key = String.fromCharCode(...data.subarray(0, nullIdx));
        let value = '(compressed)';
        if (type === 'tEXt') {
          value = new TextDecoder('latin1').decode(data.subarray(nullIdx + 1)).slice(0, 200);
        }
        fields.push({ label: `Text: ${key}`, value });
        tagCount++;
      }
    } else if (type === 'iTXt') {
      const data = bytes.subarray(dataStart, dataStart + length);
      const nullIdx = data.indexOf(0);
      if (nullIdx > 0) {
        fields.push({
          label: `Text: ${String.fromCharCode(...data.subarray(0, nullIdx))}`,
          value: '(international text entry)',
        });
        tagCount++;
      }
    } else if (type === 'iCCP') {
      fields.push({ label: 'ICC profile', value: 'Embedded colour profile present' });
      tagCount++;
    }
    if (type === 'IEND') break;
    offset += 12 + length;
  }
  if (tagCount === 0) return null;
  return { source: 'png', fields, gps, tagCount };
}

export function parseWebpMetadata(bytes: Uint8Array): MetadataReport | null {
  let offset = 12; // RIFF header + 'WEBP'
  const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let hasExif = false;
  let hasIcc = false;
  let hasXmp = false;
  while (offset + 8 <= bytes.length) {
    const type = String.fromCharCode(...bytes.subarray(offset, offset + 4));
    const size = dv.getUint32(offset + 4, true);
    if (type === 'EXIF') hasExif = true;
    if (type === 'ICCP') hasIcc = true;
    if (type === 'XMP ') hasXmp = true;
    offset += 8 + size + (size % 2);
  }
  if (!hasExif && !hasIcc && !hasXmp) return null;
  const fields: MetadataField[] = [];
  if (hasExif) fields.push({ label: 'EXIF data', value: 'Present (WebP EXIF fields are reported by the JPEG/PNG viewer path)' });
  if (hasIcc) fields.push({ label: 'ICC profile', value: 'Embedded colour profile present' });
  if (hasXmp) fields.push({ label: 'XMP data', value: 'Present' });
  return { source: 'webp', fields, tagCount: fields.length };
}

/** Parse whatever metadata a file carries, by sniffed container type. */
export function parseMetadata(bytes: Uint8Array, format: string): MetadataReport | null {
  switch (format) {
    case 'jpeg':
      return parseJpegExif(bytes);
    case 'png':
      return parsePngMetadata(bytes);
    case 'webp':
      return parseWebpMetadata(bytes);
    default:
      return null;
  }
}
