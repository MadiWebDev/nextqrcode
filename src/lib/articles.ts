/**
 * articles.ts — blog article access layer.
 *
 * STARTUP-CPU DESIGN (2026-11-24, Cloudflare Workers error 10021 fix):
 * this module must NEVER import the full article corpus eagerly. The
 * corpus is ~1,000 articles across 170 generated batch modules
 * (src/lib/pages/Batch*.ts, ~10 MB of content). Previously this module
 * imported all of them via ./pages/index, so every consumer — the
 * sitemap route, the blog index, the homepage, the HTML sitemap page —
 * dragged two ~10 MB copies of the entire corpus (RSC + SSR layers)
 * into the server bundle, ≈20 MB of the ≈62 MB Worker script whose
 * startup validation failed on Cloudflare.
 *
 * Now:
 *  - Metadata consumers use ARTICLE_META (articles-meta.generated.ts):
 *    every article's metadata WITHOUT content/faqs/howTo.
 *  - Full text is loaded per article: getArticleBySlugAsync() resolves
 *    the article's batch through pages/loaders.generated.ts (one small
 *    dynamic-import chunk per batch) or the seed module.
 *  - The eager full-corpus accessors live in articles-full.ts, which is
 *    imported ONLY by offline scripts (content audit), never by a route.
 *
 * Regenerate the two *.generated.ts files after adding/editing batches:
 *   npx tsx scripts/generate-article-meta.ts
 */
import { ARTICLES, applyMetaOverrides } from './articles-seed';
import { ARTICLE_META, ARTICLE_BATCH_BY_SLUG } from './articles-meta.generated';
import { BATCH_LOADERS } from './pages/loaders.generated';

export interface Article {
  slug: string;
  title: string;
  /** Optional SERP snippet overrides (SEO program). When set, generateMetadata
   * uses these instead of `title`/`description` so the visible H1 and body
   * keep the editorial title. See META_OVERRIDES in this file. */
  metaTitle?: string;
  metaDescription?: string;
  primaryKeyword: string;
  description: string;
  author: string;
  publishedAt: string;
  updatedAt: string;
  readTime: string;
  category: 'Fundamentals' | 'Printing & Sizing' | 'Security & Scanning' | 'Business & Regional';
  content: string; // Markdown or rich HTML-compatible structured content
  faqs: { question: string; answer: string }[];
  howTo?: {
    name: string;
    description: string;
    steps: { name: string; text: string }[];
  };
}

/**
 * An article's metadata: every Article field except the heavy body
 * payload (content, faqs, howTo). Sufficient for cards, listings,
 * sitemaps and page metadata — everything except rendering the article
 * body itself.
 */
export type ArticleMeta = Omit<Article, 'content' | 'faqs' | 'howTo'>;

const META_BY_SLUG = new Map<string, ArticleMeta>(ARTICLE_META.map((m) => [m.slug, m]));

/** Metadata for every article, in corpus order (seeds first, then batches). */
export function getAllArticleMeta(): ArticleMeta[] {
  return ARTICLE_META;
}

/** Metadata for one article, or undefined when the slug is unknown. */
export function getArticleMetaBySlug(slug: string): ArticleMeta | undefined {
  return META_BY_SLUG.get(slug);
}

/**
 * Full article (including content/faqs/howTo) for one slug, loading only
 * the single content batch that contains it. Seed articles resolve from
 * articles-seed.ts without any dynamic import. Returns undefined for
 * unknown slugs. First occurrence wins for duplicate slugs, matching the
 * historical getArticleBySlug() semantics.
 */
export async function getArticleBySlugAsync(slug: string): Promise<Article | undefined> {
  const seed = ARTICLES.find((a) => a.slug === slug);
  if (seed) return applyMetaOverrides(seed);

  const batchNo = ARTICLE_BATCH_BY_SLUG[slug];
  if (batchNo === undefined) return undefined;
  const loader = BATCH_LOADERS[batchNo];
  if (!loader) return undefined;
  const batch = await loader();
  const found = batch.find((a) => a.slug === slug);
  return found ? applyMetaOverrides(found) : undefined;
}
