import { addDays, diffDays } from './dates';
import { engagementScore } from './intelligence';
import { toDateStrInZone } from './tz';
import type { PerformanceEntry, Post } from './types';

/** Dashboard computations (spec §16) — real local data only. */

export interface Distribution {
  key: string;
  count: number;
}

function countBy(posts: Post[], keyOf: (p: Post) => string[]): Distribution[] {
  const map = new Map<string, number>();
  for (const p of posts) {
    for (const k of keyOf(p)) map.set(k, (map.get(k) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count);
}

export interface AnalyticsSummary {
  total: number;
  scheduledNext7: number;
  scheduledNext30: number;
  published: number;
  drafts: number;
  inReview: number;
  unscheduled: number;
  byStatus: Distribution[];
  byPlatform: Distribution[];
  byContentType: Distribution[];
  byPillar: Distribution[];
  /** Share of the last 28 days (incl. today) with at least one scheduled/published post. */
  consistencyPct: number;
  /** Longest run of empty days inside the next 30 days. */
  longestUpcomingGap: number;
  /** Posts per week over the last 4 full weeks + current partial week, oldest first. */
  weeklyCadence: { weekStart: string; count: number }[];
}

export function summarize(posts: Post[], timeZone: string, pillarName: (id: string) => string): AnalyticsSummary {
  const today = toDateStrInZone(timeZone, new Date());
  const inDays = (p: Post, from: string, to: string) => {
    if (!p.scheduledAt) return false;
    const d = toDateStrInZone(timeZone, new Date(p.scheduledAt));
    return d >= from && d <= to;
  };
  const scheduledNext7 = posts.filter((p) => inDays(p, today, addDays(today, 7))).length;
  const scheduledNext30 = posts.filter((p) => inDays(p, today, addDays(today, 30))).length;

  const busyDays = new Set(
    posts
      .filter((p) => p.scheduledAt)
      .map((p) => toDateStrInZone(timeZone, new Date(p.scheduledAt!))),
  );
  let busyLast28 = 0;
  for (let i = 0; i < 28; i++) {
    if (busyDays.has(addDays(today, -i))) busyLast28 += 1;
  }
  let longestUpcomingGap = 0;
  let run = 0;
  for (let i = 0; i < 30; i++) {
    if (busyDays.has(addDays(today, i))) run = 0;
    else {
      run += 1;
      longestUpcomingGap = Math.max(longestUpcomingGap, run);
    }
  }

  const weeklyCadence: AnalyticsSummary['weeklyCadence'] = [];
  for (let w = 4; w >= 0; w--) {
    const weekStart = addDays(today, -7 * w - ((new Date().getDay() + 6) % 7));
    const count = posts.filter((p) => {
      if (!p.scheduledAt) return false;
      const d = toDateStrInZone(timeZone, new Date(p.scheduledAt));
      return d >= weekStart && d <= addDays(weekStart, 6);
    }).length;
    weeklyCadence.push({ weekStart, count });
  }

  return {
    total: posts.length,
    scheduledNext7,
    scheduledNext30,
    published: posts.filter((p) => p.status === 'published').length,
    drafts: posts.filter((p) => p.status === 'draft' || p.status === 'idea').length,
    inReview: posts.filter((p) => p.status === 'in-review' || p.status === 'changes-requested').length,
    unscheduled: posts.filter((p) => !p.scheduledAt).length,
    byStatus: countBy(posts, (p) => [p.status]),
    byPlatform: countBy(posts, (p) => p.platformIds),
    byContentType: countBy(posts, (p) => [p.contentType]),
    byPillar: countBy(posts.filter((p) => p.pillarId), (p) => [pillarName(p.pillarId!)]),
    consistencyPct: Math.round((busyLast28 / 28) * 100),
    longestUpcomingGap,
    weeklyCadence,
  };
}

export interface PerformanceSummary {
  entries: number;
  totals: { reach: number; impressions: number; likes: number; comments: number; shares: number; saves: number; clicks: number; conversions: number };
  byPlatform: { platformId: string; entries: number; engagement: number }[];
  topPosts: { postId: string; title: string; engagement: number }[];
}

export function summarizePerformance(posts: Post[], entries: PerformanceEntry[]): PerformanceSummary {
  const totals = { reach: 0, impressions: 0, likes: 0, comments: 0, shares: 0, saves: 0, clicks: 0, conversions: 0 };
  const perPlatform = new Map<string, { entries: number; engagement: number }>();
  const perPost = new Map<string, number>();
  for (const e of entries) {
    const m = e.metrics;
    totals.reach += m.reach ?? 0;
    totals.impressions += m.impressions ?? 0;
    totals.likes += m.likes ?? 0;
    totals.comments += m.comments ?? 0;
    totals.shares += m.shares ?? 0;
    totals.saves += m.saves ?? 0;
    totals.clicks += m.clicks ?? 0;
    totals.conversions += m.conversions ?? 0;
    const score = engagementScore(m);
    const plat = perPlatform.get(e.platformId) ?? { entries: 0, engagement: 0 };
    plat.entries += 1;
    plat.engagement += score;
    perPlatform.set(e.platformId, plat);
    perPost.set(e.postId, (perPost.get(e.postId) ?? 0) + score);
  }
  const titleOf = new Map(posts.map((p) => [p.id, p.title || 'Untitled']));
  return {
    entries: entries.length,
    totals,
    byPlatform: [...perPlatform.entries()]
      .map(([platformId, v]) => ({ platformId, ...v }))
      .sort((a, b) => b.engagement - a.engagement),
    topPosts: [...perPost.entries()]
      .map(([postId, engagement]) => ({ postId, title: titleOf.get(postId) ?? '(deleted post)', engagement }))
      .sort((a, b) => b.engagement - a.engagement)
      .slice(0, 5),
  };
}

export { diffDays };
