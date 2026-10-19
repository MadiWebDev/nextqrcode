import { z } from 'zod';

/**
 * Typed content system — Zod schemas for every programmatic content family.
 *
 * Every entry must satisfy the per-page minima (§7.4):
 * - 3–6 FAQs, each unique within the page (no duplicated questions)
 * - ≥5 contextual internal links (real site paths, not placeholders)
 * - byline (author) + lastReviewed (ISO date)
 * - sources: required when the content makes factual claims about standards,
 *   laws, payments or statistics; each source is a real, verifiable URL
 * - content: ≥400 words of unique prose (markdown)
 *
 * The audit script (scripts/content-audit.ts) enforces these at build time;
 * failing pages are noindexed + excluded from the sitemap (see D5.2).
 */

export const FaqSchema = z.object({
  question: z.string().min(10).max(200),
  answer: z.string().min(40).max(1200),
});

export const SourceSchema = z.object({
  label: z.string().min(3).max(120),
  /** Real, verifiable URL — no example.com placeholders. */
  url: z.string().url().startsWith('https://'),
});

export const ContentEntrySchema = z.object({
  slug: z
    .string()
    .min(3)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'slug must be kebab-case'),
  title: z.string().min(20).max(120),
  metaDescription: z.string().min(70).max(160),
  h1: z.string().min(10).max(120),
  /** Markdown prose, ≥400 words, unique to this page. */
  content: z.string().refine((s) => s.split(/\s+/).filter(Boolean).length >= 400, {
    message: 'content must be ≥400 words',
  }),
  faqs: z.array(FaqSchema).min(3).max(6),
  /** ≥5 contextual internal links as site paths (e.g. "/url-qr-code-generator"). */
  internalLinks: z.array(z.string().regex(/^\//, 'internal links must be site paths')).min(5),
  author: z.string().min(3).max(80),
  /** ISO date of last human review. */
  lastReviewed: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'lastReviewed must be YYYY-MM-DD'),
  sources: z.array(SourceSchema).max(10).default([]),
  status: z.enum(['draft', 'published']).default('draft'),
});

export type ContentEntry = z.infer<typeof ContentEntrySchema>;
export type Faq = z.infer<typeof FaqSchema>;

/** Content families with programmatic [slug] routes. */
export const CONTENT_FAMILIES = [
  'industries',
  'glossary',
  'scan-guide',
  'size-guide',
  'templates',
] as const;
export type ContentFamily = (typeof CONTENT_FAMILIES)[number];

/** Canonical URL prefix per family. */
export const FAMILY_PREFIXES: Record<ContentFamily, string> = {
  industries: '/industries',
  glossary: '/glossary',
  'scan-guide': '/scan-guide',
  'size-guide': '/qr-size-guide',
  templates: '/templates',
};
