import type { FilterState, Post } from './types';

/**
 * Search + filtering (spec §13). Matching is diacritic-insensitive and
 * case-insensitive, so "cafe" finds "Café launch".
 */
export function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .trim();
}

export function postMatchesQuery(post: Post, query: string): boolean {
  const q = normalizeText(query);
  if (!q) return true;
  const haystack = normalizeText(
    [
      post.title,
      post.caption,
      post.description,
      post.assigneeLabel,
      post.tags.join(' '),
      post.platformIds.join(' '),
    ].join('\n'),
  );
  return q.split(/\s+/).every((word) => haystack.includes(word));
}

export function filterPosts(
  posts: Post[],
  filter: FilterState,
  mediaAlt?: Map<string, boolean>,
): Post[] {
  return posts.filter((p) => {
    if (!postMatchesQuery(p, filter.query)) return false;
    if (filter.platformIds.length && !p.platformIds.some((id) => filter.platformIds.includes(id)))
      return false;
    if (filter.statuses.length && !filter.statuses.includes(p.status)) return false;
    if (filter.campaignId && p.campaignId !== filter.campaignId) return false;
    if (filter.pillarId && p.pillarId !== filter.pillarId) return false;
    if (filter.contentTypes.length && !filter.contentTypes.includes(p.contentType)) return false;
    if (filter.priorities.length && !filter.priorities.includes(p.priority)) return false;
    if (filter.assignee && normalizeText(p.assigneeLabel) !== normalizeText(filter.assignee))
      return false;
    if (filter.hasAttachments === true && p.mediaIds.length === 0) return false;
    if (filter.hasAttachments === false && p.mediaIds.length > 0) return false;
    if (filter.missingAltText && mediaAlt) {
      if (!p.mediaIds.some((id) => mediaAlt.get(id) === false)) return false;
    }
    if (filter.dateFrom && (!p.scheduledAt || p.scheduledAt.slice(0, 10) < filter.dateFrom))
      return false;
    if (filter.dateTo && (!p.scheduledAt || p.scheduledAt.slice(0, 10) > filter.dateTo))
      return false;
    return true;
  });
}

/** Serialize the shareable subset of a filter to URL search params. */
export function filterToParams(filter: FilterState): URLSearchParams {
  const params = new URLSearchParams();
  if (filter.query) params.set('q', filter.query);
  if (filter.platformIds.length) params.set('platforms', filter.platformIds.join(','));
  if (filter.statuses.length) params.set('statuses', filter.statuses.join(','));
  if (filter.campaignId) params.set('campaign', filter.campaignId);
  if (filter.pillarId) params.set('pillar', filter.pillarId);
  if (filter.contentTypes.length) params.set('types', filter.contentTypes.join(','));
  return params;
}

export function filterFromParams(params: URLSearchParams): FilterState {
  const list = (key: string) =>
    (params.get(key) ?? '').split(',').map((s) => s.trim()).filter(Boolean);
  return {
    query: params.get('q') ?? '',
    platformIds: list('platforms'),
    statuses: list('statuses') as FilterState['statuses'],
    campaignId: params.get('campaign') ?? undefined,
    pillarId: params.get('pillar') ?? undefined,
    contentTypes: list('types') as FilterState['contentTypes'],
    priorities: [],
  };
}
