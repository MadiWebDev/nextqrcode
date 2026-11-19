/**
 * QR codes for resumes (spec §9): vCard / URL / WhatsApp / email
 * payloads, generation with the `qrcode` library, contrast and
 * quiet-zone validation, and a jsQR scan self-test that decodes the
 * generated image in the browser and compares it to the payload —
 * the code is only shown as "verified" when the scan round-trips.
 */
import QRCode from 'qrcode';
import type { ResumeDoc } from './schema';

function escapeVCard(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,');
}

/** Fold lines at 75 octets per RFC 2425 (continuation = CRLF + space). */
function foldLine(line: string): string {
  const bytes = new TextEncoder().encode(line);
  if (bytes.length <= 75) return line;
  const parts: string[] = [];
  let current = '';
  let currentBytes = 0;
  for (const ch of line) {
    const len = new TextEncoder().encode(ch).length;
    if (currentBytes + len > 74) {
      parts.push(current);
      current = ` ${ch}`;
      currentBytes = 1 + len;
    } else {
      current += ch;
      currentBytes += len;
    }
  }
  if (current) parts.push(current);
  return parts.join('\r\n');
}

export function buildVCard(doc: ResumeDoc): string {
  const fields = new Set(doc.qr.vcardFields);
  const lines: string[] = ['BEGIN:VCARD', 'VERSION:3.0'];
  const name = doc.basics.name.trim();
  if (fields.has('name') && name) {
    const parts = name.split(/\s+/);
    const family = parts.length > 1 ? parts[parts.length - 1] : '';
    const given = parts.length > 1 ? parts.slice(0, -1).join(' ') : name;
    lines.push(`N:${escapeVCard(family)};${escapeVCard(given)};;;`);
    lines.push(`FN:${escapeVCard(name)}`);
  }
  if (fields.has('title') && doc.basics.headline) lines.push(`TITLE:${escapeVCard(doc.basics.headline)}`);
  if (fields.has('email') && doc.basics.email) lines.push(`EMAIL;TYPE=INTERNET:${escapeVCard(doc.basics.email)}`);
  if (fields.has('phone') && doc.basics.phone) lines.push(`TEL;TYPE=CELL:${escapeVCard(doc.basics.phone)}`);
  if (fields.has('location') && doc.basics.location) lines.push(`ADR:;;${escapeVCard(doc.basics.location)};;;;`);
  if (fields.has('website') && doc.basics.website) lines.push(`URL:${escapeVCard(doc.basics.website)}`);
  for (const link of doc.basics.links) {
    lines.push(`URL:${escapeVCard(link.url)}`);
  }
  lines.push('END:VCARD');
  return lines.map(foldLine).join('\r\n');
}

export function buildQrPayload(doc: ResumeDoc): string {
  switch (doc.qr.target) {
    case 'vcard':
      return buildVCard(doc);
    case 'whatsapp': {
      const digits = doc.basics.phone.replace(/[^\d]/g, '');
      return digits ? `https://wa.me/${digits}` : '';
    }
    case 'email':
      return doc.basics.email ? `mailto:${doc.basics.email}` : '';
    case 'url':
    default:
      return doc.qr.url?.trim() || doc.basics.website || '';
  }
}

function luminance(hex: string): number {
  const m = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => {
    const v = parseInt(m.slice(i, i + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(fg: string, bg: string): number {
  const [l1, l2] = [luminance(fg), luminance(bg)].sort((a, b) => b - a);
  return (l1 + 0.05) / (l2 + 0.05);
}

export interface QrResult {
  dataUrl: string;
  payload: string;
  warnings: string[];
}

/**
 * Generate the QR image. Dark modules on a light background with a
 * 4-module quiet zone; the accent colour is only used when it keeps
 * a scanner-safe contrast ratio against white, otherwise black is
 * used and the substitution is reported (never silently).
 */
export async function generateQr(doc: ResumeDoc, sizePx = 480): Promise<QrResult> {
  const payload = buildQrPayload(doc);
  const warnings: string[] = [];
  if (!payload) {
    return { dataUrl: '', payload, warnings: ['Add the contact detail this QR should carry first.'] };
  }
  let fg = '#000000';
  const accent = doc.theme.accent;
  if (accent && contrastRatio(accent, '#ffffff') >= 4.5) {
    fg = accent;
  } else if (accent && accent.toLowerCase() !== '#000000') {
    warnings.push('Your accent colour is too light for scanners, so the QR code uses black.');
  }
  const dataUrl = await QRCode.toDataURL(payload, {
    errorCorrectionLevel: 'M',
    margin: 4, // quiet zone in modules
    width: sizePx,
    color: { dark: fg, light: '#ffffff' },
  });
  if (payload.length > 700) {
    warnings.push('This QR carries a lot of data, so its pattern is dense — test-scan it before printing.');
  }
  return { dataUrl, payload, warnings };
}

/** Decode a generated QR image with jsQR and compare to the payload. */
export async function selfTestQr(dataUrl: string, expectedPayload: string): Promise<boolean> {
  const { default: jsQR } = await import('jsqr');
  const img = new Image();
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error('qr-image-load-failed'));
    img.src = dataUrl;
  });
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) return false;
  ctx.drawImage(img, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const result = jsQR(imageData.data, imageData.width, imageData.height);
  return result?.data === expectedPayload;
}
