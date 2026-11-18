import { describe, expect, it } from 'vitest';
import {
  filterFromParams,
  filterPosts,
  filterToParams,
  normalizeText,
  postMatchesQuery,
} from '../search';
import { EMPTY_FILTER, type Post } from '../types';

const post = (patch: Partial<Post>): Post => ({
  id: 'p1',
  workspaceId: 'w',
  calendarId: 'cal',
  title: 'Café launch',
  caption: 'Résumé tips inside',
  description: '',
  platformCaptions: {},
  platformIds: ['instagram'],
  scheduledAt: '2026-12-01T05:30:00.000Z',
  timezone: 'Asia/Karachi',
  status: 'scheduled',
  contentType: 'text',
  priority: 'normal',
  tags: ['launch'],
  assigneeLabel: '',
  internalNotes: '',
  mediaIds: [],
  checklist: [],
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  ...patch,
});

describe('normalizeText', () => {
  it('strips diacritics and case', () => {
    expect(normalizeText('Café RÉSUMÉ')).toBe('cafe resume');
  });
});

describe('postMatchesQuery', () => {
  it('matches without accents and requires every word', () => {
    expect(postMatchesQuery(post({}), 'cafe launch')).toBe(true);
    expect(postMatchesQuery(post({}), 'resume')).toBe(true);
    expect(postMatchesQuery(post({}), 'cafe missing')).toBe(false);
    expect(postMatchesQuery(post({}), '')).toBe(true);
  });
});

describe('filterPosts', () => {
  it('applies platform, status, pillar and date filters together', () => {
    const posts = [
      post({ id: 'a' }),
      post({ id: 'b', platformIds: ['x'], status: 'draft' }),
      post({ id: 'c', pillarId: 'p1', scheduledAt: '2027-01-05T00:00:00.000Z' }),
    ];
    expect(filterPosts(posts, EMPTY_FILTER)).toHaveLength(3);
    expect(filterPosts(posts, { ...EMPTY_FILTER, platformIds: ['x'] }).map((p) => p.id)).toEqual(['b']);
    expect(filterPosts(posts, { ...EMPTY_FILTER, statuses: ['draft'] }).map((p) => p.id)).toEqual(['b']);
    expect(filterPosts(posts, { ...EMPTY_FILTER, pillarId: 'p1' }).map((p) => p.id)).toEqual(['c']);
    expect(
      filterPosts(posts, { ...EMPTY_FILTER, dateFrom: '2026-12-15' }).map((p) => p.id),
    ).toEqual(['c']);
  });

  it('missing-alt filter uses the media map', () => {
    const withMedia = post({ id: 'm', mediaIds: ['img1'] });
    const alt = new Map([['img1', false]]);
    expect(filterPosts([withMedia], { ...EMPTY_FILTER, missingAltText: true }, alt)).toHaveLength(1);
    expect(
      filterPosts([withMedia], { ...EMPTY_FILTER, missingAltText: true }, new Map([['img1', true]])),
    ).toHaveLength(0);
  });
});

describe('URL params round-trip', () => {
  it('serializes and restores the shareable subset', () => {
    const filter = {
      ...EMPTY_FILTER,
      query: 'launch',
      platformIds: ['instagram', 'x'],
      statuses: ['scheduled' as const],
      pillarId: 'p1',
    };
    const restored = filterFromParams(filterToParams(filter));
    expect(restored.query).toBe('launch');
    expect(restored.platformIds).toEqual(['instagram', 'x']);
    expect(restored.statuses).toEqual(['scheduled']);
    expect(restored.pillarId).toBe('p1');
  });
});
