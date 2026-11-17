import { monthGrid } from './dates';
import { toDateStrInZone, toTimeStrInZone } from './tz';
import type { BrandKit, Post } from './types';

/**
 * Exporters (spec §16). Everything is generated locally in the browser;
 * nothing is uploaded anywhere.
 */

/** Neutralize spreadsheet formula injection for a single cell value. */
export function neutralizeFormula(value: string): string {
  if (/^[=+\-@\t\r]/.test(value)) return `'${value}`;
  return value;
}

export function csvEscape(value: string): string {
  const safe = neutralizeFormula(value);
  return /[",\n\r]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
}

export const POST_CSV_HEADERS = [
  'id',
  'title',
  'caption',
  'platforms',
  'status',
  'contentType',
  'date',
  'time',
  'timezone',
  'campaign',
  'pillar',
  'tags',
] as const;

export function postsToCsv(
  posts: Post[],
  nameOf: { campaign: (id: string) => string; pillar: (id: string) => string },
): string {
  const lines = [POST_CSV_HEADERS.join(',')];
  for (const p of posts) {
    const date = p.scheduledAt ? toDateStrInZone(p.timezone, new Date(p.scheduledAt)) : '';
    const time = p.scheduledAt ? toTimeStrInZone(p.timezone, new Date(p.scheduledAt)) : '';
    const row = [
      p.id,
      p.title,
      p.caption,
      p.platformIds.join(';'),
      p.status,
      p.contentType,
      date,
      time,
      p.timezone,
      p.campaignId ? nameOf.campaign(p.campaignId) : '',
      p.pillarId ? nameOf.pillar(p.pillarId) : '',
      p.tags.join(';'),
    ];
    lines.push(row.map((c) => csvEscape(String(c))).join(','));
  }
  return lines.join('\r\n');
}

function icsEscape(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

function icsUtc(iso: string): string {
  return new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

/** iCalendar feed of scheduled posts (importable into Google/Apple/Outlook calendars). */
export function postsToIcs(posts: Post[], calendarName: string): string {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//freeqrcode.tools//Social Media Calendar//EN',
    `X-WR-CALNAME:${icsEscape(calendarName)}`,
  ];
  const stamp = icsUtc(new Date().toISOString());
  for (const p of posts) {
    if (!p.scheduledAt) continue;
    lines.push(
      'BEGIN:VEVENT',
      `UID:${p.id}@socialcalendar.freeqrcode.tools`,
      `DTSTAMP:${stamp}`,
      `DTSTART:${icsUtc(p.scheduledAt)}`,
      `SUMMARY:${icsEscape(p.title || 'Untitled post')}`,
      `DESCRIPTION:${icsEscape(
        [p.caption, p.platformIds.length ? `Platforms: ${p.platformIds.join(', ')}` : '', `Status: ${p.status}`]
          .filter(Boolean)
          .join('\n'),
      )}`,
      'END:VEVENT',
    );
  }
  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

function xmlEscape(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Minimal valid XLSX (Office Open XML) built with JSZip — one sheet of
 * inline-string cells. Opens in Excel, LibreOffice and Google Sheets.
 */
export async function postsToXlsxBlob(
  posts: Post[],
  nameOf: { campaign: (id: string) => string; pillar: (id: string) => string },
): Promise<Blob> {
  const JSZip = (await import('jszip')).default;
  const csv = postsToCsv(posts, nameOf);
  const rows = csv.split('\r\n').map((line) => parseCsvLine(line));
  const sheetRows = rows
    .map((cells, r) => {
      const cs = cells
        .map((c, i) => {
          const ref = `${String.fromCharCode(65 + i)}${r + 1}`;
          return `<c r="${ref}" t="inlineStr"><is><t>${xmlEscape(c)}</t></is></c>`;
        })
        .join('');
      return `<row r="${r + 1}">${cs}</row>`;
    })
    .join('');
  const zip = new JSZip();
  zip.file(
    '[Content_Types].xml',
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>`,
  );
  zip.file(
    '_rels/.rels',
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`,
  );
  zip.file(
    'xl/workbook.xml',
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Posts" sheetId="1" r:id="rId1"/></sheets></workbook>`,
  );
  zip.file(
    'xl/_rels/workbook.xml.rels',
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/></Relationships>`,
  );
  zip.file(
    'xl/worksheets/sheet1.xml',
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>${sheetRows}</sheetData></worksheet>`,
  );
  return zip.generateAsync({
    type: 'blob',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
}

/** Parse one CSV line (handles quoted cells). Used to feed the XLSX builder. */
export function parseCsvLine(line: string): string[] {
  const cells: string[] = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          cur += '"';
          i++;
        } else inQuotes = false;
      } else cur += ch;
    } else if (ch === '"') inQuotes = true;
    else if (ch === ',') {
      cells.push(cur);
      cur = '';
    } else cur += ch;
  }
  cells.push(cur);
  return cells;
}

/** Standalone SVG month sheet (brand colours applied) — also rasterized to PNG by the UI. */
export function monthSheetSvg(
  year: number,
  month: number,
  weekStart: number,
  posts: Post[],
  brand: BrandKit,
  timeZone: string,
): string {
  const cells = monthGrid(year, month, weekStart);
  const byDate = new Map<string, Post[]>();
  for (const p of posts) {
    if (!p.scheduledAt) continue;
    const d = toDateStrInZone(timeZone, new Date(p.scheduledAt));
    byDate.set(d, [...(byDate.get(d) ?? []), p]);
  }
  const W = 1120;
  const H = 880;
  const cellW = W / 7;
  const cellH = (H - 90) / 6;
  const primary = /^#[0-9a-fA-F]{6}$/.test(brand.primaryColor) ? brand.primaryColor : '#0ea5e9';
  const parts: string[] = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`,
    `<rect width="${W}" height="${H}" fill="#ffffff"/>`,
    `<rect width="${W}" height="64" fill="${primary}"/>`,
    `<text x="24" y="40" font-family="sans-serif" font-size="24" fill="#ffffff" font-weight="bold">${xmlEscape(brand.brandName || 'Social Media Calendar')} — ${year}-${String(month).padStart(2, '0')}</text>`,
  ];
  cells.forEach((dateStr, i) => {
    const col = i % 7;
    const row = Math.floor(i / 7);
    const x = col * cellW;
    const y = 90 + row * cellH;
    const inMonth = Number(dateStr.slice(5, 7)) === month;
    parts.push(
      `<rect x="${x}" y="${y}" width="${cellW}" height="${cellH}" fill="${inMonth ? '#ffffff' : '#f4f4f5'}" stroke="#d4d4d8"/>`,
      `<text x="${x + 8}" y="${y + 20}" font-family="sans-serif" font-size="13" fill="#3f3f46">${dateStr.slice(8)}</text>`,
    );
    (byDate.get(dateStr) ?? []).slice(0, 3).forEach((p, j) => {
      const title = (p.title || 'Untitled').slice(0, 24);
      parts.push(
        `<text x="${x + 8}" y="${y + 42 + j * 16}" font-family="sans-serif" font-size="11" fill="#18181b">• ${xmlEscape(title)}</text>`,
      );
    });
  });
  parts.push('</svg>');
  return parts.join('');
}

export function downloadBlob(filename: string, blob: Blob): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

export function downloadText(filename: string, text: string, mime = 'text/plain'): void {
  downloadBlob(filename, new Blob([text], { type: `${mime};charset=utf-8` }));
}
