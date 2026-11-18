import { addDays, diffDays } from './dates';
import { toDateStrInZone } from './tz';
import type { Campaign, PerformanceEntry, Pillar, Post, Workspace } from './types';

/** Content-intelligence computations (spec §9) — all from real local data. */

export interface PillarBalance {
  pillarId: string;
  name: string;
  target: number;
  actual: number;
  count: number;
  /** actual − target, in percentage points. */
  delta: number;
}

export function pillarBalance(
  posts: Post[],
  pillars: Pillar[],
  fromIso?: string,
  toIso?: string,
): PillarBalance[] {
  const inWindow = posts.filter((p) => {
    if (!p.scheduledAt) return false;
    if (fromIso && p.scheduledAt < fromIso) return false;
    if (toIso && p.scheduledAt > toIso) return false;
    return true;
  });
  const total = inWindow.length;
  return pillars.map((pillar) => {
    const count = inWindow.filter((p) => p.pillarId === pillar.id).length;
    const actual = total ? Math.round((count / total) * 100) : 0;
    return {
      pillarId: pillar.id,
      name: pillar.name,
      target: pillar.targetPercent,
      actual,
      count,
      delta: actual - pillar.targetPercent,
    };
  });
}

export type GapKind =
  | 'platform-empty'
  | 'day-empty'
  | 'pillar-missing'
  | 'pillar-over'
  | 'campaign-incomplete'
  | 'awaiting-approval'
  | 'missing-alt'
  | 'evergreen-eligible';

export interface GapSuggestion {
  kind: GapKind;
  message: string;
  suggestion: string;
  date?: string;
  platformId?: string;
  pillarId?: string;
  campaignId?: string;
  postId?: string;
}

export function detectGaps(
  posts: Post[],
  workspace: Workspace,
  pillars: Pillar[],
  campaigns: Campaign[],
  mediaAlt: Map<string, boolean>,
  horizonDays = 14,
): GapSuggestion[] {
  const out: GapSuggestion[] = [];
  const today = toDateStrInZone(workspace.timezone, new Date());
  const horizon = addDays(today, horizonDays);
  const upcoming = posts.filter((p) => {
    if (!p.scheduledAt) return false;
    const d = toDateStrInZone(workspace.timezone, new Date(p.scheduledAt));
    return d >= today && d <= horizon;
  });

  // Platforms with nothing coming up.
  for (const pid of workspace.platformIds) {
    if (!upcoming.some((p) => p.platformIds.includes(pid))) {
      out.push({
        kind: 'platform-empty',
        platformId: pid,
        message: `No upcoming posts for this platform in the next ${horizonDays} days.`,
        suggestion: 'Plan at least one post — open the calendar and quick-create on the next free day.',
      });
    }
  }

  // Empty days.
  const busyDays = new Set(
    upcoming.map((p) => toDateStrInZone(workspace.timezone, new Date(p.scheduledAt!))),
  );
  const emptyDays: string[] = [];
  for (let d = today; d <= horizon; d = addDays(d, 1)) {
    if (!busyDays.has(d)) emptyDays.push(d);
  }
  if (emptyDays.length >= 3) {
    out.push({
      kind: 'day-empty',
      date: emptyDays[0],
      message: `${emptyDays.length} of the next ${horizonDays} days have nothing scheduled (${emptyDays.slice(0, 3).join(', ')}…).`,
      suggestion: `Fill ${emptyDays[0]} first — consistency beats bursts for most platforms.`,
    });
  }

  // Pillar balance over the window.
  const fromIso = new Date(`${today}T00:00:00.000Z`).toISOString();
  const toIso = new Date(`${horizon}T23:59:59.999Z`).toISOString();
  for (const b of pillarBalance(posts, pillars, fromIso, toIso)) {
    if (b.target > 0 && b.count === 0) {
      out.push({
        kind: 'pillar-missing',
        pillarId: b.pillarId,
        message: `No "${b.name}" posts are planned, against a ${b.target}% target.`,
        suggestion: `Add a ${b.name} post this week — check the idea library for a starting point.`,
      });
    } else if (b.delta >= 15) {
      out.push({
        kind: 'pillar-over',
        pillarId: b.pillarId,
        message: `"${b.name}" is over-represented: ${b.actual}% actual vs ${b.target}% target.`,
        suggestion: 'Swap one planned post to an under-represented pillar to rebalance the mix.',
      });
    }
  }

  // Campaigns that are running but thin.
  for (const c of campaigns) {
    if (c.status !== 'active' && c.status !== 'planned') continue;
    if (c.endDate < today) continue;
    const campaignPosts = posts.filter((p) => p.campaignId === c.id);
    if (campaignPosts.length < 3) {
      out.push({
        kind: 'campaign-incomplete',
        campaignId: c.id,
        message: `Campaign "${c.name}" has only ${campaignPosts.length} post${campaignPosts.length === 1 ? '' : 's'} linked.`,
        suggestion: 'Link or create at least 3 posts so the campaign has a beginning, middle and end.',
      });
    }
  }

  // Stale approvals.
  const now = Date.now();
  for (const p of posts) {
    if (p.status !== 'in-review') continue;
    const ageDays = Math.floor((now - new Date(p.updatedAt).getTime()) / 86_400_000);
    if (ageDays >= 2) {
      out.push({
        kind: 'awaiting-approval',
        postId: p.id,
        message: `"${p.title || 'Untitled'}" has waited ${ageDays} days in review.`,
        suggestion: 'Nudge the reviewer or approve it from the post editor.',
      });
    }
  }

  // Missing alt text.
  for (const p of posts) {
    if (p.status === 'published' || p.status === 'archived') continue;
    const missing = p.mediaIds.some((id) => mediaAlt.get(id) === false);
    if (missing) {
      out.push({
        kind: 'missing-alt',
        postId: p.id,
        message: `"${p.title || 'Untitled'}" has an image without alt text.`,
        suggestion: 'Add alt text in the media section of the post editor.',
      });
    }
  }

  // Evergreen recycling candidates.
  for (const s of evergreenSuggestions(posts, workspace.timezone)) {
    out.push({
      kind: 'evergreen-eligible',
      postId: s.post.id,
      date: s.suggestedDate,
      message: `"${s.post.title || 'Untitled'}" was published ${s.daysSince} days ago and is eligible to recycle.`,
      suggestion: `Suggested repost date: ${s.suggestedDate}. Recycling is a suggestion — nothing is duplicated automatically.`,
    });
  }

  return out;
}

export interface EvergreenCandidate {
  post: Post;
  daysSince: number;
  suggestedDate: string;
}

export function evergreenSuggestions(
  posts: Post[],
  timezone: string,
): EvergreenCandidate[] {
  const today = toDateStrInZone(timezone, new Date());
  const out: EvergreenCandidate[] = [];
  for (const p of posts) {
    if (!p.evergreen || !p.scheduledAt) continue;
    if (p.status !== 'published') continue;
    const publishedDate = toDateStrInZone(timezone, new Date(p.scheduledAt));
    const daysSince = diffDays(publishedDate, today);
    if (daysSince < p.evergreen.minIntervalDays) continue;
    if (p.evergreen.reuseCount >= p.evergreen.maxReuse) continue;
    let suggested = addDays(today, 1);
    while (p.evergreen.excludedDates.includes(suggested)) {
      suggested = addDays(suggested, 1);
    }
    out.push({ post: p, daysSince, suggestedDate: suggested });
  }
  return out;
}

/** Platform/format combinations for repurposing one post (spec §9). */
export interface RepurposeTarget {
  platformId: string;
  contentType: string;
  note: string;
}

const REPURPOSE_MAP: Record<string, RepurposeTarget[]> = {
  video: [
    { platformId: 'youtube-shorts', contentType: 'short', note: 'Cut the strongest 30 seconds as a Short.' },
    { platformId: 'tiktok', contentType: 'video', note: 'Reframe vertical with captions burned in.' },
    { platformId: 'instagram', contentType: 'reel', note: 'Same cut, new hook in the first 2 seconds.' },
    { platformId: 'linkedin', contentType: 'text', note: 'Turn the transcript\u2019s key point into a text post.' },
  ],
  image: [
    { platformId: 'pinterest', contentType: 'image', note: 'Export a tall 2:3 version for Pinterest.' },
    { platformId: 'facebook', contentType: 'image', note: 'Reuse with a community question in the caption.' },
    { platformId: 'threads', contentType: 'text', note: 'Post the takeaway as text with the image attached.' },
  ],
  carousel: [
    { platformId: 'linkedin', contentType: 'carousel', note: 'Export slides as a document carousel.' },
    { platformId: 'tiktok', contentType: 'video', note: 'Narrate the slides as a slideshow video.' },
    { platformId: 'instagram', contentType: 'story', note: 'Tease slide 1 as a Story linking to the post.' },
  ],
  text: [
    { platformId: 'x', contentType: 'text', note: 'Split into a short thread, one idea per post.' },
    { platformId: 'linkedin', contentType: 'text', note: 'Expand with a personal example.' },
    { platformId: 'instagram', contentType: 'image', note: 'Design the key line as a quote graphic.' },
  ],
};

export function repurposeTargets(post: Post): RepurposeTarget[] {
  return REPURPOSE_MAP[post.contentType] ?? REPURPOSE_MAP.text;
}

/** Engagement score for one performance entry (documented, simple sum). */
export function engagementScore(m: PerformanceEntry['metrics']): number {
  return (
    (m.likes ?? 0) +
    (m.comments ?? 0) * 2 +
    (m.shares ?? 0) * 3 +
    (m.saves ?? 0) * 3 +
    (m.clicks ?? 0) * 2 +
    (m.conversions ?? 0) * 10
  );
}

export interface ComputedBestTime {
  platformId: string;
  weekday: number;
  hour: number;
  avgEngagement: number;
  samples: number;
}

/**
 * Personalized best times from the user's OWN logged performance
 * (spec §17): average engagement per (platform, weekday, hour) with at
 * least 2 samples. Returns the best slot per platform.
 */
export function computeBestTimes(
  posts: Post[],
  entries: PerformanceEntry[],
): ComputedBestTime[] {
  const postById = new Map(posts.map((p) => [p.id, p]));
  const buckets = new Map<string, { total: number; samples: number }>();
  for (const e of entries) {
    const post = postById.get(e.postId);
    if (!post?.scheduledAt) continue;
    const when = new Date(post.scheduledAt);
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: post.timezone,
      weekday: 'short',
      hour: '2-digit',
      hourCycle: 'h23',
    }).formatToParts(when);
    const weekdayName = parts.find((p) => p.type === 'weekday')?.value ?? '';
    const weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(weekdayName);
    const hour = Number(parts.find((p) => p.type === 'hour')?.value ?? 0) % 24;
    const key = `${e.platformId}|${weekday}|${hour}`;
    const bucket = buckets.get(key) ?? { total: 0, samples: 0 };
    bucket.total += engagementScore(e.metrics);
    bucket.samples += 1;
    buckets.set(key, bucket);
  }
  const best = new Map<string, ComputedBestTime>();
  for (const [key, bucket] of buckets) {
    if (bucket.samples < 2) continue;
    const [platformId, weekday, hour] = key.split('|');
    const candidate: ComputedBestTime = {
      platformId,
      weekday: Number(weekday),
      hour: Number(hour),
      avgEngagement: Math.round((bucket.total / bucket.samples) * 10) / 10,
      samples: bucket.samples,
    };
    const current = best.get(platformId);
    if (!current || candidate.avgEngagement > current.avgEngagement) {
      best.set(platformId, candidate);
    }
  }
  return [...best.values()];
}
