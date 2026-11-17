import { describe, expect, it } from 'vitest';
import {
  computeBestTimes,
  detectGaps,
  evergreenSuggestions,
  pillarBalance,
  repurposeTargets,
} from '../intelligence';
import { proposeSchedule } from '../autoschedule';
import { evaluateRule } from '../rules';
import { extractPlatformIds, parseScheduleText } from '../nl';
import type {
  AutomationRule,
  PerformanceEntry,
  Pillar,
  Post,
  Workspace,
} from '../types';

const pillar = (id: string, target: number): Pillar => ({
  id,
  workspaceId: 'w',
  name: id,
  targetPercent: target,
  color: '#000',
  description: '',
});

const post = (patch: Partial<Post>): Post => ({
  id: Math.random().toString(36).slice(2),
  workspaceId: 'w',
  calendarId: 'cal',
  title: 'T',
  caption: '',
  description: '',
  platformCaptions: {},
  platformIds: ['instagram'],
  scheduledAt: null,
  timezone: 'Asia/Karachi',
  status: 'draft',
  contentType: 'text',
  priority: 'normal',
  tags: [],
  assigneeLabel: '',
  internalNotes: '',
  mediaIds: [],
  checklist: [],
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  ...patch,
});

const workspace: Workspace = {
  id: 'w',
  name: 'W',
  timezone: 'Asia/Karachi',
  weekStart: 1,
  platformIds: ['instagram'],
  brand: {
    brandName: '',
    primaryColor: '#000',
    secondaryColor: '#000',
    accentColor: '#000',
    fontPreference: 'sans',
    tone: '',
    description: '',
    website: '',
    socialLinks: {},
    hashtagPreferences: [],
    guidelines: '',
  },
  pipeline: ['idea', 'draft', 'in-review', 'approved', 'scheduled', 'published'],
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

describe('pillarBalance', () => {
  it('computes actual percentages and deltas', () => {
    const posts = [
      post({ pillarId: 'edu', scheduledAt: '2026-11-20T04:00:00.000Z' }),
      post({ pillarId: 'edu', scheduledAt: '2026-11-21T04:00:00.000Z' }),
      post({ pillarId: 'fun', scheduledAt: '2026-11-22T04:00:00.000Z' }),
      post({ pillarId: 'fun', scheduledAt: '2026-11-23T04:00:00.000Z' }),
    ];
    const b = pillarBalance(posts, [pillar('edu', 60), pillar('fun', 40)]);
    expect(b[0]).toMatchObject({ actual: 50, delta: -10 });
    expect(b[1]).toMatchObject({ actual: 50, delta: 10 });
  });
});

describe('detectGaps', () => {
  it('flags an enabled platform with no upcoming posts', () => {
    const gaps = detectGaps([], workspace, [], [], new Map());
    expect(gaps.some((g) => g.kind === 'platform-empty')).toBe(true);
  });

  it('flags stale approvals', () => {
    const stale = post({ status: 'in-review', updatedAt: '2020-01-01T00:00:00.000Z' });
    const gaps = detectGaps([stale], workspace, [], [], new Map());
    expect(gaps.some((g) => g.kind === 'awaiting-approval')).toBe(true);
  });
});

describe('evergreenSuggestions', () => {
  it('respects interval and reuse cap', () => {
    const old = post({
      status: 'published',
      scheduledAt: '2026-01-01T04:00:00.000Z',
      evergreen: { minIntervalDays: 30, maxReuse: 2, reuseCount: 0, excludedDates: [] },
    });
    expect(evergreenSuggestions([old], 'Asia/Karachi')).toHaveLength(1);
    const capped = post({
      status: 'published',
      scheduledAt: '2026-01-01T04:00:00.000Z',
      evergreen: { minIntervalDays: 30, maxReuse: 2, reuseCount: 2, excludedDates: [] },
    });
    expect(evergreenSuggestions([capped], 'Asia/Karachi')).toHaveLength(0);
  });
});

describe('repurposeTargets', () => {
  it('maps video to shorts/tiktok/reel/text derivatives', () => {
    const targets = repurposeTargets(post({ contentType: 'video' }));
    expect(targets.map((t) => t.platformId)).toContain('tiktok');
    expect(targets.length).toBeGreaterThanOrEqual(3);
  });
});

describe('computeBestTimes', () => {
  it('needs at least 2 samples and picks the best slot', () => {
    const p1 = post({ id: 'p1', scheduledAt: '2026-11-16T04:00:00.000Z' }); // Mon 09:00 PKT
    const p2 = post({ id: 'p2', scheduledAt: '2026-11-23T04:00:00.000Z' });
    const entries: PerformanceEntry[] = [p1, p2].map((p) => ({
      id: `e-${p.id}`,
      workspaceId: 'w',
      postId: p.id,
      platformId: 'instagram',
      date: '2026-11-24',
      metrics: { likes: 10 },
      createdAt: '2026-11-24T00:00:00.000Z',
    }));
    const best = computeBestTimes([p1, p2], entries);
    expect(best).toHaveLength(1);
    expect(best[0]).toMatchObject({ platformId: 'instagram', weekday: 1, hour: 9 });
    expect(computeBestTimes([p1], entries.slice(0, 1))).toHaveLength(0);
  });
});

describe('proposeSchedule', () => {
  it('places posts on preferred days with reasons and respects the quota', () => {
    const drafts = [post({ title: 'A' }), post({ title: 'B' }), post({ title: 'C' })];
    const proposals = proposeSchedule(drafts, [], [], {
      postsPerWeek: 2,
      preferredDays: [1, 3],
      preferredTimes: ['09:00'],
      fromDate: '2026-11-16', // Monday
      weeks: 1,
      maxPerDay: 2,
    });
    expect(proposals).toHaveLength(2);
    for (const p of proposals) {
      expect([1, 3]).toContain(new Date(`${p.date}T12:00:00Z`).getUTCDay());
      expect(p.reasons.length).toBeGreaterThanOrEqual(2);
    }
  });
});

describe('evaluateRule', () => {
  const rule: AutomationRule = {
    id: 'rule1',
    workspaceId: 'w',
    name: 'Mark ready',
    trigger: 'daily-check',
    action: 'mark-ready',
    suggestionOnly: false,
    enabled: true,
    createdAt: '2026-01-01T00:00:00.000Z',
  };

  it('mark-ready patches approved+dated posts only when not suggestion-only', () => {
    const ready = post({ id: 'r1', status: 'approved', scheduledAt: '2026-12-01T04:00:00.000Z' });
    const action = evaluateRule(rule, [ready], workspace, [], [], new Map());
    expect(action.patches).toEqual([{ postId: 'r1', patch: { status: 'scheduled' } }]);
    const suggest = evaluateRule({ ...rule, suggestionOnly: true }, [ready], workspace, [], [], new Map());
    expect(suggest.patches).toHaveLength(0);
    expect(suggest.findings.length).toBe(1);
  });
});

describe('natural language scheduling', () => {
  it('extracts platform aliases', () => {
    expect(extractPlatformIds('post this on IG and fb please')).toEqual(
      expect.arrayContaining(['instagram', 'facebook']),
    );
  });

  it('parses a date in the workspace zone, not the device zone', () => {
    const parsed = parseScheduleText(
      'Schedule for Instagram tomorrow at 6 PM',
      'Asia/Karachi',
      new Date('2026-11-17T00:00:00.000Z'),
    );
    expect(parsed).not.toBeNull();
    expect(parsed!.time).toBe('18:00');
    expect(parsed!.date).toBe('2026-11-18');
    expect(parsed!.instant).toBe('2026-11-18T13:00:00.000Z'); // 18:00 PKT = 13:00 UTC
    expect(parsed!.platformIds).toContain('instagram');
  });

  it('detects weekly recurrence phrasing', () => {
    const parsed = parseScheduleText(
      'Post every Monday at 9 AM',
      'Asia/Karachi',
      new Date('2026-11-17T00:00:00.000Z'),
    );
    expect(parsed?.recurrence?.freq).toBe('weekly');
    expect(parsed?.recurrence?.weekdays).toEqual([1]);
  });

  it('returns null when no date is present', () => {
    expect(parseScheduleText('post something nice', 'Asia/Karachi')).toBeNull();
  });
});
