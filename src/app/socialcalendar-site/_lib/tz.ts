/**
 * Time-zone engine (spec §23) built on the platform Intl/ICU tz database.
 *
 * Core rule: a post's intended wall-clock time in its IANA zone is sacred.
 * Conversions go civil-date + wall-time → instant via an offset solved
 * from Intl data, never via manual offset tables, so DST transitions
 * (including Australia/Lord_Howe's 30-minute shift) are handled by ICU.
 *
 * Gap behaviour: a wall time that does not exist (spring-forward gap)
 * resolves to the first valid instant after the gap. Fold behaviour: an
 * ambiguous wall time (fall-back) resolves to its first occurrence.
 * Both are deterministic and covered by tests.
 */

const dtfCache = new Map<string, Intl.DateTimeFormat>();

function dtf(timeZone: string): Intl.DateTimeFormat {
  let f = dtfCache.get(timeZone);
  if (!f) {
    f = new Intl.DateTimeFormat('en-US', {
      timeZone,
      hourCycle: 'h23',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    dtfCache.set(timeZone, f);
  }
  return f;
}

export interface ZonedParts {
  year: number;
  month: number; // 1–12
  day: number;
  hour: number;
  minute: number;
  second: number;
  /** 0 = Sunday … 6 = Saturday, for the zoned calendar date. */
  weekday: number;
}

export function utcToZonedParts(timeZone: string, date: Date): ZonedParts {
  const parts = dtf(timeZone).formatToParts(date);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0);
  const year = get('year');
  const month = get('month');
  const day = get('day');
  return {
    year,
    month,
    day,
    hour: get('hour') % 24,
    minute: get('minute'),
    second: get('second'),
    weekday: new Date(Date.UTC(year, month - 1, day)).getUTCDay(),
  };
}

/** Offset of `timeZone` at `date`, in ms (wall-as-UTC minus instant). */
export function getTimezoneOffsetMs(timeZone: string, date: Date): number {
  const p = utcToZonedParts(timeZone, date);
  const asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
  return asUtc - Math.floor(date.getTime() / 1000) * 1000;
}

/** Convert a wall-clock time in `timeZone` to the corresponding UTC instant. */
export function zonedTimeToUtc(
  timeZone: string,
  year: number,
  month: number,
  day: number,
  hour = 0,
  minute = 0,
  second = 0,
): Date {
  const target = Date.UTC(year, month - 1, day, hour, minute, second);
  let guess = target;
  for (let i = 0; i < 4; i++) {
    const offset = getTimezoneOffsetMs(timeZone, new Date(guess));
    const next = target - offset;
    if (next === guess) break;
    guess = next;
  }
  // Gap correction: if the solved instant's wall time is earlier than the
  // requested wall time, the requested time fell in a DST gap — move to
  // the first valid instant after the gap (end of the gap = wall time
  // shifted forward by the gap size, which the iteration approximates by
  // re-solving from the post-gap side).
  const solved = utcToZonedParts(timeZone, new Date(guess));
  const solvedWall = Date.UTC(
    solved.year,
    solved.month - 1,
    solved.day,
    solved.hour,
    solved.minute,
    solved.second,
  );
  if (solvedWall < target) {
    guess += target - solvedWall;
  }
  return new Date(guess);
}

/** yyyy-mm-dd for an instant as seen in `timeZone`. */
export function toDateStrInZone(timeZone: string, date: Date): string {
  const p = utcToZonedParts(timeZone, date);
  return `${p.year}-${String(p.month).padStart(2, '0')}-${String(p.day).padStart(2, '0')}`;
}

/** Today's yyyy-mm-dd in `timeZone`. */
export function todayInZone(timeZone: string): string {
  return toDateStrInZone(timeZone, new Date());
}

/** "HH:MM" wall time of an instant in `timeZone`. */
export function toTimeStrInZone(timeZone: string, date: Date): string {
  const p = utcToZonedParts(timeZone, date);
  return `${String(p.hour).padStart(2, '0')}:${String(p.minute).padStart(2, '0')}`;
}

/** Parse a yyyy-mm-dd + HH:MM wall time in a zone into a UTC instant. */
export function wallTimeToUtc(timeZone: string, dateStr: string, timeStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  const [h, mi] = timeStr.split(':').map(Number);
  return zonedTimeToUtc(timeZone, y, m, d, h || 0, mi || 0);
}

export function isValidTimeZone(timeZone: string): boolean {
  try {
    Intl.DateTimeFormat('en-US', { timeZone });
    return true;
  } catch {
    return false;
  }
}
