import { addDays, weekdayOf } from './dates';
import { pillarBalance } from './intelligence';
import type { Pillar, Post } from './types';

export interface SchedulePreferences {
  /** Posts per week to place. */
  postsPerWeek: number;
  /** Preferred weekdays (0 = Sunday). */
  preferredDays: number[];
  /** Preferred "HH:MM" times in the workspace zone. */
  preferredTimes: string[];
  /** Window start (yyyy-mm-dd, workspace zone). */
  fromDate: string;
  /** How many weeks to plan. */
  weeks: number;
  /** Max posts per day (existing + proposed). */
  maxPerDay: number;
}

export interface ScheduleProposal {
  postId: string;
  date: string;
  time: string;
  reasons: string[];
}

/**
 * Auto-scheduling assistant (spec §10). Proposes placements for
 * unscheduled posts; every proposal carries its reasoning and nothing is
 * applied until the user accepts it. Existing posts are never moved.
 */
export function proposeSchedule(
  unscheduled: Post[],
  existing: Post[],
  pillars: Pillar[],
  prefs: SchedulePreferences,
): ScheduleProposal[] {
  const proposals: ScheduleProposal[] = [];
  const queue = [...unscheduled];
  if (queue.length === 0) return proposals;

  // Existing load per local date (dates are compared as ISO instants by
  // day bucket in the workspace — callers pass posts already filtered to
  // the workspace; day keys come from scheduledAt's UTC date adjusted by
  // the caller through placed dates, so here we bucket by the date the
  // post's instant falls on in UTC as an approximation of load).
  const loadByDate = new Map<string, number>();
  const noteLoad = (date: string) => loadByDate.set(date, (loadByDate.get(date) ?? 0) + 1);
  for (const p of existing) {
    if (p.scheduledAt) noteLoad(p.scheduledAt.slice(0, 10));
  }

  const totalDays = prefs.weeks * 7;
  const quota = Math.min(queue.length, prefs.postsPerWeek * prefs.weeks);
  let placedCount = 0;

  // Pillar deficits guide ordering: posts whose pillar is most under
  // target get scheduled first.
  const balances = pillarBalance(existing, pillars);
  const deficit = new Map(balances.map((b) => [b.pillarId, b.delta]));
  queue.sort((a, b) => {
    const da = a.pillarId ? (deficit.get(a.pillarId) ?? 0) : 0;
    const db = b.pillarId ? (deficit.get(b.pillarId) ?? 0) : 0;
    return da - db;
  });

  const pillarName = new Map(pillars.map((p) => [p.id, p.name]));

  for (let dayOffset = 0; dayOffset < totalDays && placedCount < quota; dayOffset++) {
    const date = addDays(prefs.fromDate, dayOffset);
    const weekday = weekdayOf(date);
    const preferred = prefs.preferredDays.includes(weekday);
    // Non-preferred days are only used in the second pass.
    if (!preferred && dayOffset < totalDays) {
      // First pass skips non-preferred days; leftovers handled after loop.
      continue;
    }
    while ((loadByDate.get(date) ?? 0) < prefs.maxPerDay && placedCount < quota) {
      const post = queue.shift();
      if (!post) break;
      const time = prefs.preferredTimes[placedCount % prefs.preferredTimes.length] ?? '09:00';
      const reasons: string[] = [
        preferred
          ? `${date} is one of your preferred posting days.`
          : `${date} keeps your weekly spacing consistent.`,
        `Placed at ${time}, one of your preferred times.`,
      ];
      if (post.pillarId && (deficit.get(post.pillarId) ?? 0) < 0) {
        reasons.push(
          `"${pillarName.get(post.pillarId)}" content is under its target, so this post goes early.`,
        );
      }
      if ((loadByDate.get(date) ?? 0) === 0) {
        reasons.push('This day had nothing scheduled yet.');
      }
      proposals.push({ postId: post.id, date, time, reasons });
      noteLoad(date);
      placedCount += 1;
    }
  }

  // Second pass: fill remaining quota on any day with capacity.
  for (let dayOffset = 0; dayOffset < totalDays && placedCount < quota; dayOffset++) {
    const date = addDays(prefs.fromDate, dayOffset);
    while ((loadByDate.get(date) ?? 0) < prefs.maxPerDay && placedCount < quota) {
      const post = queue.shift();
      if (!post) break;
      const time = prefs.preferredTimes[placedCount % prefs.preferredTimes.length] ?? '09:00';
      proposals.push({
        postId: post.id,
        date,
        time,
        reasons: [
          'All preferred days were full, so this keeps the weekly target without overloading a day.',
          `Placed at ${time}, one of your preferred times.`,
        ],
      });
      noteLoad(date);
      placedCount += 1;
    }
  }

  return proposals;
}
