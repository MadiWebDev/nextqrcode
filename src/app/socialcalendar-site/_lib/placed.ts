import { expandRecurrence } from './recurrence';
import { toDateStrInZone } from './tz';
import type { Post } from './types';

/** A post pinned to one concrete occurrence in the display zone. */
export interface PlacedPost {
  post: Post;
  /** UTC instant ISO of this occurrence. */
  scheduledAt: string;
  /** yyyy-mm-dd in the display zone. */
  localDate: string;
  /** HH:MM in the display zone. */
  localTime: string;
  isRecurrenceOccurrence: boolean;
}

/**
 * Expand posts (including recurrence masters) into placed occurrences
 * whose local date falls inside [fromDate, toDate] in `displayZone`.
 * Unscheduled posts are returned separately by unscheduledPosts().
 */
export function placePosts(
  posts: Post[],
  displayZone: string,
  fromDate: string,
  toDate: string,
): PlacedPost[] {
  const from = new Date(`${fromDate}T00:00:00.000Z`);
  // Expand generously: zone differences shift instants by < 2 days.
  const expandFrom = new Date(from.getTime() - 2 * 86_400_000);
  const expandTo = new Date(`${toDate}T23:59:59.999Z`);
  expandTo.setTime(expandTo.getTime() + 2 * 86_400_000);
  const out: PlacedPost[] = [];
  for (const post of posts) {
    if (!post.scheduledAt) continue;
    for (const occ of expandRecurrence(post, expandFrom, expandTo)) {
      const instant = new Date(occ.scheduledAt);
      const localDate = toDateStrInZone(displayZone, instant);
      if (localDate < fromDate || localDate > toDate) continue;
      const parts = new Intl.DateTimeFormat('en-GB', {
        timeZone: displayZone,
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23',
      }).format(instant);
      out.push({
        post,
        scheduledAt: occ.scheduledAt,
        localDate,
        localTime: parts,
        isRecurrenceOccurrence: Boolean(post.recurrence) && occ.localDate !== toDateStrInZone(post.timezone, new Date(post.scheduledAt)),
      });
    }
  }
  return out.sort((a, b) =>
    a.localDate === b.localDate
      ? a.scheduledAt < b.scheduledAt
        ? -1
        : 1
      : a.localDate < b.localDate
        ? -1
        : 1,
  );
}

export function groupByDate(placed: PlacedPost[]): Map<string, PlacedPost[]> {
  const map = new Map<string, PlacedPost[]>();
  for (const p of placed) {
    const list = map.get(p.localDate) ?? [];
    list.push(p);
    map.set(p.localDate, list);
  }
  return map;
}
