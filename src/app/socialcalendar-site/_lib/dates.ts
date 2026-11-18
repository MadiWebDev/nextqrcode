/**
 * Civil-date helpers (yyyy-mm-dd strings, zone-independent arithmetic).
 * Calendar grids are computed on civil dates; instants only appear when
 * a civil date + wall time is placed in a zone (see tz.ts).
 */

export function parseDateStr(dateStr: string): { y: number; m: number; d: number } {
  const [y, m, d] = dateStr.split('-').map(Number);
  return { y, m, d };
}

export function formatDateStr(y: number, m: number, d: number): string {
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

export function addDays(dateStr: string, days: number): string {
  const { y, m, d } = parseDateStr(dateStr);
  const t = new Date(Date.UTC(y, m - 1, d + days));
  return formatDateStr(t.getUTCFullYear(), t.getUTCMonth() + 1, t.getUTCDate());
}

export function diffDays(a: string, b: string): number {
  const pa = parseDateStr(a);
  const pb = parseDateStr(b);
  return Math.round(
    (Date.UTC(pb.y, pb.m - 1, pb.d) - Date.UTC(pa.y, pa.m - 1, pa.d)) / 86_400_000,
  );
}

export function weekdayOf(dateStr: string): number {
  const { y, m, d } = parseDateStr(dateStr);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

export function daysInMonth(y: number, m: number): number {
  return new Date(Date.UTC(y, m, 0)).getUTCDate();
}

/** The 42-cell (6-week) month grid starting on the configured week start. */
export function monthGrid(year: number, month: number, weekStart: number): string[] {
  const first = formatDateStr(year, month, 1);
  const lead = (weekdayOf(first) - weekStart + 7) % 7;
  const start = addDays(first, -lead);
  return Array.from({ length: 42 }, (_, i) => addDays(start, i));
}

/** The 7 dates of the week containing `dateStr`, starting on `weekStart`. */
export function weekDates(dateStr: string, weekStart: number): string[] {
  const lead = (weekdayOf(dateStr) - weekStart + 7) % 7;
  const start = addDays(dateStr, -lead);
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

export function monthLabel(year: number, month: number): string {
  return new Date(Date.UTC(year, month - 1, 1)).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export function shiftMonth(year: number, month: number, delta: number): { y: number; m: number } {
  const total = year * 12 + (month - 1) + delta;
  return { y: Math.floor(total / 12), m: (total % 12) + 1 };
}

/** Inclusive list of dates from `from` to `to` (capped for safety). */
export function dateRange(from: string, to: string, cap = 366): string[] {
  const out: string[] = [];
  let cur = from;
  while (cur <= to && out.length < cap) {
    out.push(cur);
    cur = addDays(cur, 1);
  }
  return out;
}
