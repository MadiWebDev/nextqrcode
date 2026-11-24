/**
 * articles-full.ts — eager full-corpus accessors.
 *
 * WARNING: importing this module pulls all 170 content batches
 * (~10 MB) into the importer's bundle. It exists ONLY for offline
 * tooling (scripts/content-audit.ts, scripts/analyze-batches.ts) that
 * genuinely needs every article's full text. Never import it from a
 * page, route handler, layout or component — that is exactly the eager
 * import that blew the Cloudflare Worker startup CPU budget
 * (error 10021). Routes use articles.ts (metadata + per-batch lazy
 * loading) instead.
 */
import type { Article } from './articles';
import { ARTICLES, applyMetaOverrides } from './articles-seed';
import { NEW_ARTICLES } from './pages/index';

const ALL_ARTICLES: Article[] = [...ARTICLES, ...NEW_ARTICLES].map(applyMetaOverrides);

export function getArticleBySlug(slug: string): Article | undefined {
  return ALL_ARTICLES.find((a) => a.slug === slug);
}

export function getAllArticles(): Article[] {
  return ALL_ARTICLES;
}
