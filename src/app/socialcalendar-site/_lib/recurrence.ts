import { addDays, daysInMonth, diffDays, formatDateStr, parseDateStr, weekdayOf } from './dates';
import { toDateStrInZone, utcToZonedParts, zonedTimeToUtc } from './tz';
import type { Post } from './types';

export interface Occurrence {
  /** UTC instant ISO string. */
  scheduledAt: string;
  /** yyyy-mm-dd of the occurrence in the post's zone. */
  localDate: string;
}

/**
 * Expand a recurring post into concrete occurrences inside [from, to]
 * (instants). Expansion happens on civil dates in the post's own zone —
 * the wall time is re-solved per occurrence, so a 9:00 post stays at
 * 9:00 local across DST changes (spec §23).
 */
export function expandRecurrence(
  post: Pick<Post, 'scheduledAt' | 'timezone' | 'recurrence'>,
  from: Date,
  to: Date,
  limit = 500,
): Occurrence[] {
  if (!post.scheduledAt) return [];
  const master = new Date(post.scheduledAt);
  const masterParts = utcToZonedParts(post.timezone, master);
  const masterDate = formatDateStr(masterParts.year, masterParts.month, masterParts.day);
  const rule = post.recurrence;
  if (!rule) {
    return master >= from && master <= to
      ? [{ scheduledAt: master.toISOString(), localDate: masterDate }]
      : [];
  }

  const out: Occurrence[] = [];
  const seen = new Set<string>();
  let produced = 0;

  const push = (localDate: string) => {
    if (rule.until && localDate > rule.until) return false;
    if (rule.count && produced >= rule.count) return false;
    if (seen.has(localDate)) return true;
    seen.add(localDate);
    produced += 1;
    const instant = zonedTimeToUtc(
      post.timezone,
      ...(() => {
        const { y, m, d } = parseDateStr(localDate);
        return [y, m, d, masterParts.hour, masterParts.minute, masterParts.second] as const;
      })(),
    );
    if (instant >= from && instant <= to) {
      out.push({ scheduledAt: instant.toISOString(), localDate });
    }
    return true;
  };

  const hardEnd = rule.until ?? toDateStrInZone(post.timezone, to);
  const masterWeekday = weekdayOf(masterDate);

  if (rule.freq === 'daily') {
    let cur = masterDate;
    let guard = 0;
    while (cur <= hardEnd && guard < limit * Math.max(1, rule.interval) + 31) {
      guard += 1;
      if (!push(cur)) break;
      cur = addDays(cur, rule.interval);
      if (out.length >= limit) break;
    }
  } else if (rule.freq === 'weekly') {
    const weekdays = (rule.weekdays?.length ? rule.weekdays : [masterWeekday]).slice().sort();
    // Walk week by week from the master's week.
    let weekStart = addDays(masterDate, -masterWeekday);
    let guard = 0;
    while (weekStart <= hardEnd && guard < 600) {
      guard += 1;
      for (const wd of weekdays) {
        const date = addDays(weekStart, wd);
        if (date < masterDate) continue;
        if (!push(date)) return out.slice(0, limit);
        if (out.length >= limit) return out;
      }
      weekStart = addDays(weekStart, 7 * rule.interval);
    }
  } else {
    // monthly: same day-of-month, clamped to the month's length.
    let { y, m } = parseDateStr(masterDate);
    const dayWanted = parseDateStr(masterDate).d;
    let guard = 0;
    while (guard < 600) {
      guard += 1;
      const date = formatDateStr(y, m, Math.min(dayWanted, daysInMonth(y, m)));
      if (date > hardEnd) break;
      if (!push(date)) break;
      if (out.length >= limit) break;
      const next = m + rule.interval;
      y += Math.floor((next - 1) / 12);
      m = ((next - 1) % 12) + 1;
    }
  }
  return out.slice(0, limit);
}

/** All posts (recurring expanded) landing on a local date in a zone. */
export function occurrencesOn(
  posts: Pick<Post, 'scheduledAt' | 'timezone' | 'recurrence' | 'id'>[],
  localDate: string,
  displayZone: string,
): { postId: string; scheduledAt: string }[] {
  const dayStart = zonedTimeToUtc(displayZone, ...(() => {
    const { y, m, d } = parseDateStr(localDate);
    return [y, m, d] as const;
  })());
  const dayEnd = new Date(dayStart.getTime() + 86_400_000 - 1);
  const out: { postId: string; scheduledAt: string }[] = [];
  for (const p of posts) {
    for (const occ of expandRecurrence(p, dayStart, dayEnd, 10)) {
      out.push({ postId: p.id, scheduledAt: occ.scheduledAt });
    }
  }
  return out.sort((a, b) => (a.scheduledAt < b.scheduledAt ? -1 : 1));
}

export { diffDays };
