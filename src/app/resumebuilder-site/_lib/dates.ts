import type { ResumeDate } from './schema';

/** Date helpers: formatting per the resume's chosen format, plus the
 * gap/overlap analysis shared by validation and the ATS check. */

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function formatResumeDate(
  d: ResumeDate | undefined,
  format: string,
  current = false,
): string {
  if (current) return 'Present';
  if (!d) return '';
  switch (format) {
    case 'yyyy':
      return String(d.y);
    case 'mm-yyyy':
      return d.m ? `${String(d.m).padStart(2, '0')}/${d.y}` : String(d.y);
    case 'mmm-yyyy':
    case 'mmm-yyyy-range':
    default:
      return d.m ? `${MONTHS[d.m - 1]} ${d.y}` : String(d.y);
  }
}

export function formatDateRange(
  start: ResumeDate | undefined,
  end: ResumeDate | undefined,
  current: boolean | undefined,
  format: string,
): string {
  const s = formatResumeDate(start, format);
  const e = formatResumeDate(end, format, !!current);
  if (!s && !e) return '';
  if (!s) return e;
  if (!e) return s;
  return `${s} – ${e}`;
}

/** Absolute month index for comparisons; year-only dates use January (start) or December (end). */
export function monthIndex(d: ResumeDate, edge: 'start' | 'end'): number {
  const m = d.m ?? (edge === 'start' ? 1 : 12);
  return d.y * 12 + (m - 1);
}

export interface DatedEntry {
  id: string;
  label: string;
  start?: ResumeDate;
  end?: ResumeDate;
  current?: boolean;
}

export interface GapFinding {
  type: 'gap' | 'overlap';
  between: [string, string];
  months: number;
}

/**
 * Detect employment gaps (> 3 months) and overlaps between dated
 * entries. Entries are compared in chronological order; a current role
 * ends "now" (the provided `now` month index).
 */
export function analyseTimeline(entries: DatedEntry[], now: number): GapFinding[] {
  const dated = entries
    .filter((e) => e.start)
    .map((e) => ({
      e,
      start: monthIndex(e.start!, 'start'),
      end: e.current ? now : e.end ? monthIndex(e.end, 'end') : monthIndex(e.start!, 'end'),
    }))
    .sort((a, b) => a.start - b.start);
  const findings: GapFinding[] = [];
  for (let i = 1; i < dated.length; i++) {
    const prev = dated[i - 1];
    const cur = dated[i];
    const diff = cur.start - prev.end - 1; // whole months strictly between
    if (diff > 3) {
      findings.push({ type: 'gap', between: [prev.e.label, cur.e.label], months: diff });
    } else if (diff < 0) {
      findings.push({ type: 'overlap', between: [prev.e.label, cur.e.label], months: -diff });
    }
  }
  return findings;
}

/** Total months covered by dated entries (union, overlaps counted once). */
export function totalExperienceMonths(entries: DatedEntry[], now: number): number {
  const spans = entries
    .filter((e) => e.start)
    .map((e) => ({
      start: monthIndex(e.start!, 'start'),
      end: e.current ? now : e.end ? monthIndex(e.end, 'end') : monthIndex(e.start!, 'end'),
    }))
    .sort((a, b) => a.start - b.start);
  let total = 0;
  let cur: { start: number; end: number } | undefined;
  for (const s of spans) {
    if (!cur) {
      cur = { ...s };
    } else if (s.start <= cur.end + 1) {
      cur.end = Math.max(cur.end, s.end);
    } else {
      total += cur.end - cur.start + 1;
      cur = { ...s };
    }
  }
  if (cur) total += cur.end - cur.start + 1;
  return total;
}
