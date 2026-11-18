import { describe, expect, it } from 'vitest';
import { placePosts } from '../placed';
import { filterPosts } from '../search';
import { summarize } from '../analytics';
import { EMPTY_FILTER, type Post } from '../types';

/**
 * Stress check (spec §35): 10,000 posts must stay responsive for the
 * operations the calendar performs on every render — placement into a
 * month window, full-text filtering, and analytics summarisation.
 * Budgets are generous (shared CI VMs, often contended) but catch
 * algorithmic blowups: an accidental O(n²) pass over 10k posts would
 * exceed them by an order of magnitude. Standalone timings observed
 * during the build program: placement ~1.0s, filter ~0.4s, summary
 * ~0.7s for 10,000 posts.
 */
function makePosts(count: number): Post[] {
  const posts: Post[] = [];
  for (let i = 0; i < count; i++) {
    const day = 1 + (i % 28);
    const hour = i % 24;
    posts.push({
      id: `p${i}`,
      workspaceId: 'w',
      calendarId: 'cal',
      title: `Post number ${i} about topic ${i % 50}`,
      caption: `Caption for post ${i} with some realistic text about launches and lessons.`,
      description: '',
      platformCaptions: {},
      platformIds: ['instagram', 'x', 'linkedin'][i % 3] ? [['instagram', 'x', 'linkedin'][i % 3]] : ['instagram'],
      scheduledAt: `2026-11-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:00:00.000Z`,
      timezone: 'Asia/Karachi',
      status: ['draft', 'scheduled', 'published', 'in-review'][i % 4] as Post['status'],
      contentType: 'text',
      priority: 'normal',
      tags: [`t${i % 20}`],
      assigneeLabel: '',
      internalNotes: '',
      mediaIds: [],
      checklist: [],
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    });
  }
  return posts;
}

describe('10,000-post stress', () => {
  const posts = makePosts(10_000);

  it('places a month window quickly', () => {
    const start = performance.now();
    const placed = placePosts(posts, 'Asia/Karachi', '2026-11-01', '2026-11-30');
    const elapsed = performance.now() - start;
    expect(placed.length).toBe(10_000);
    expect(elapsed).toBeLessThan(10_000);
  });

  it('filters 10k posts by query + platform quickly', () => {
    const start = performance.now();
    const result = filterPosts(posts, {
      ...EMPTY_FILTER,
      query: 'topic 7',
      platformIds: ['x'],
    });
    const elapsed = performance.now() - start;
    expect(result.length).toBeGreaterThan(0);
    expect(elapsed).toBeLessThan(10_000);
  });

  it('summarizes 10k posts quickly', () => {
    const start = performance.now();
    const summary = summarize(posts, 'Asia/Karachi', (id) => id);
    const elapsed = performance.now() - start;
    expect(summary.total).toBe(10_000);
    expect(elapsed).toBeLessThan(10_000);
  });
});
