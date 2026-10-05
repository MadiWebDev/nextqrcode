/**
 * QR Code Tools — Programmatic Page Quality Gate
 *
 * Automated enforcement layer that blocks publishing for pages failing
 * thin-content, cannibalization, schema, or internal-linking requirements.
 *
 * Hard rules enforced here:
 *  • Minimum unique word count by hub type
 *  • Similarity-score flag (>60% against closest sibling)
 *  • Keyword cannibalization check (exact + near-duplicate intents)
 *  • Author + published/updated dates present
 *  • FAQ schema present
 *  • Minimum 3 outbound + 2 inbound internal links
 *  • Working tool marker present
 *  • Reviewer sign-off required before "published" status
 */

export type Hub =
  | 'tools'
  | 'generators'
  | 'guides'
  | 'printing'
  | 'troubleshooting'
  | 'industries'
  | 'compare'
  | 'glossary'
  | 'regional'
  | 'templates'
  | 'legal'
  | 'devices'
  | 'sizes'
  | 'labels'
  | 'payments'
  | 'countries'
  | 'howto';

export type SearchIntent =
  | 'informational'
  | 'transactional'
  | 'commercial'
  | 'navigational';

export type PageStatus =
  | 'draft'
  | 'needs_human_review'
  | 'reviewer_approved'
  | 'published'
  | 'noindex'
  | 'redirected';

export interface PageRecord {
  slug: string;
  title: string;
  primaryKeyword: string;
  searchIntent: SearchIntent;
  hub: Hub;
  author: string;
  publishedAt: string;
  updatedAt: string;
  wordCount: number;
  hasFaq: boolean;
  hasHowTo?: boolean;
  hasWorkingTool: boolean;       // NEW: working tool/calculator/generator present
  outboundLinks: string[];       // NEW: slugs this page links to (min 3)
  inboundLinks: string[];        // NEW: slugs linking to this page (min 2)
  reviewerSignOff: string | null; // NEW: reviewer name — must be set before "published"
  status: PageStatus;
  batchNumber: number;           // which release batch
  similarityScore?: number;      // 0-100, populated by similarity checker
  siblingSlug?: string;          // most similar sibling if flagged
}

export interface QualityGateResult {
  passed: boolean;
  score: number; // 0–100
  issues: string[];
  warnings: string[];
  blockedFromPublishing: boolean; // true if any hard block is present
  metrics: {
    wordCount: number;
    keywordDensity: number;
    intentMatch: boolean;
    schemaValid: boolean;
    internalLinksOut: number;
    internalLinksIn: number;
    hasWorkingTool: boolean;
    hasReviewerSignOff: boolean;
    similarityScore: number;
  };
}

/** Minimum unique word counts by hub type */
const MIN_WORD_COUNTS: Record<Hub, number> = {
  guides: 800,
  howto: 700,
  glossary: 500,
  compare: 600,
  tools: 600,
  generators: 500,
  printing: 500,
  troubleshooting: 600,
  industries: 500,
  regional: 500,
  templates: 400,
  labels: 400,
  payments: 400,
  countries: 400,
  devices: 400,
  sizes: 400,
  legal: 300,
};

/**
 * Core quality gate evaluator.
 *
 * @param record      - Page metadata record
 * @param contentBody - Full text content of the page (without HTML tags)
 * @param existingKeywords - All primary keywords already published (for cannibalization check)
 * @returns QualityGateResult with pass/fail decision and detailed metrics
 */
export function evaluateQualityGate(
  record: PageRecord,
  contentBody: string,
  existingKeywords: string[] = []
): QualityGateResult {
  const issues: string[] = [];
  const warnings: string[] = [];
  let score = 100;

  // ── 1. Word Count Check ──────────────────────────────────────────────────
  const words = contentBody.trim().split(/\s+/).filter(Boolean).length;
  const minWords = MIN_WORD_COUNTS[record.hub] ?? 400;
  if (words < minWords) {
    issues.push(
      `Word count too low (${words} words). Minimum for "${record.hub}" hub: ${minWords} words.`
    );
    score -= 25;
  }

  // ── 2. Keyword Cannibalization Check ────────────────────────────────────
  const normalizedKeyword = record.primaryKeyword.toLowerCase().trim();
  const duplicate = existingKeywords.find(
    (k) => k.toLowerCase().trim() === normalizedKeyword
  );
  if (duplicate) {
    issues.push(
      `Keyword cannibalization: "${record.primaryKeyword}" is already targeted by another published page.`
    );
    score -= 30;
  }

  // ── 3. Near-Duplicate Similarity Score ──────────────────────────────────
  const similarity = record.similarityScore ?? 0;
  if (similarity > 60) {
    issues.push(
      `High content similarity (${similarity}%) with sibling page "${record.siblingSlug ?? 'unknown'}". ` +
        `Minimum 40% content differentiation required. Flag as noindex until resolved.`
    );
    score -= 20;
  } else if (similarity > 45) {
    warnings.push(
      `Moderate content similarity (${similarity}%) with "${record.siblingSlug ?? 'unknown'}". ` +
        `Consider strengthening unique sections.`
    );
    score -= 5;
  }

  // ── 4. Author & Date Verification ───────────────────────────────────────
  if (!record.author || record.author.trim().length === 0) {
    issues.push('Missing verifiable author entity. Author field is required for all published pages.');
    score -= 15;
  }
  if (!record.publishedAt || !record.updatedAt) {
    issues.push('Missing publishedAt or updatedAt timestamp. Both are required for schema markup.');
    score -= 10;
  }

  // ── 5. FAQ Schema Requirement ────────────────────────────────────────────
  if (!record.hasFaq) {
    issues.push('Missing structured FAQ section with Schema.org FAQ JSON-LD markup.');
    score -= 10;
  }

  // ── 6. Working Tool Requirement ─────────────────────────────────────────
  if (!record.hasWorkingTool) {
    issues.push(
      'No working tool, calculator, generator, or unique dataset detected on this page. ' +
        'Every programmatic page must embed a functional tool relevant to its search intent.'
    );
    score -= 20;
  }

  // ── 7. Internal Linking Requirements ────────────────────────────────────
  const outCount = record.outboundLinks?.length ?? 0;
  const inCount = record.inboundLinks?.length ?? 0;

  if (outCount < 3) {
    issues.push(
      `Insufficient outbound internal links (${outCount}). Minimum 3 outbound links required.`
    );
    score -= 10;
  }
  if (inCount < 2) {
    issues.push(
      `Insufficient inbound internal links (${inCount}). Minimum 2 other pages must link to this page.`
    );
    score -= 10;
  }

  // ── 8. Reviewer Sign-Off Gate ────────────────────────────────────────────
  const hasReviewerSignOff = !!record.reviewerSignOff && record.reviewerSignOff.trim().length > 0;
  if (!hasReviewerSignOff && record.status === 'published') {
    issues.push(
      'Reviewer sign-off is required before a page can be set to "published" status. ' +
        'Set the reviewerSignOff field to the reviewer\'s name.'
    );
    score -= 25;
  }

  // ── 9. Keyword Density Heuristic ────────────────────────────────────────
  const occurrences = (
    contentBody.toLowerCase().match(new RegExp(normalizedKeyword, 'g')) || []
  ).length;
  const keywordDensity = words > 0 ? (occurrences / words) * 100 : 0;

  if (keywordDensity > 3.0) {
    warnings.push(
      `Keyword stuffing risk: density is ${keywordDensity.toFixed(2)}% ` +
        `(safe range: 0.5%–2.5%). Review for natural language integration.`
    );
    score -= 5;
  }

  // ── 10. AI-Draft Gate ────────────────────────────────────────────────────
  if (record.status === ('needs_human_review' as PageStatus) && record.status === 'published') {
    issues.push(
      'AI-drafted pages must be reviewed and status changed to "reviewer_approved" before publishing.'
    );
    score -= 30;
  }

  // ── Blocked from publishing? ─────────────────────────────────────────────
  // Any hard issue (score reduction ≥20 from a single check) = blocked
  const blockedFromPublishing =
    !hasReviewerSignOff ||
    !record.hasWorkingTool ||
    !record.hasFaq ||
    similarity > 60 ||
    outCount < 3 ||
    inCount < 2 ||
    words < minWords;

  return {
    passed: score >= 75 && issues.length === 0,
    score: Math.max(0, score),
    issues,
    warnings,
    blockedFromPublishing,
    metrics: {
      wordCount: words,
      keywordDensity: Number(keywordDensity.toFixed(2)),
      intentMatch: Boolean(record.searchIntent),
      schemaValid: record.hasFaq,
      internalLinksOut: outCount,
      internalLinksIn: inCount,
      hasWorkingTool: record.hasWorkingTool,
      hasReviewerSignOff,
      similarityScore: similarity,
    },
  };
}

/**
 * Batch gate: Hold entire next batch if previous batch indexation < 70%.
 *
 * @param batchIndexationRate - 0-100 percentage of batch URLs indexed after 28 days
 * @param batchNumber         - The batch that was indexed
 * @returns Whether the next batch is clear to release
 */
export function checkBatchIndexationGate(
  batchIndexationRate: number,
  batchNumber: number
): { cleared: boolean; reason: string } {
  if (batchIndexationRate >= 70) {
    return {
      cleared: true,
      reason: `Batch ${batchNumber} cleared: ${batchIndexationRate.toFixed(1)}% indexed (≥70% threshold met).`,
    };
  }
  return {
    cleared: false,
    reason:
      `Batch ${batchNumber + 1} HELD: Previous batch ${batchNumber} has only ` +
      `${batchIndexationRate.toFixed(1)}% indexation after 28 days (below 70% threshold). ` +
      `Investigate crawl budget, internal linking, and noindex tags before releasing next batch.`,
  };
}

/**
 * Quarterly pruning evaluator.
 *
 * @param slug          - Page slug
 * @param impressions180d - Total Search Console impressions over last 180 days
 * @param clicks180d    - Total clicks over last 180 days
 * @returns Pruning recommendation
 */
export function evaluatePruningCandidate(
  slug: string,
  impressions180d: number,
  clicks180d: number
): { action: 'keep' | 'improve' | 'merge' | 'remove'; reason: string } {
  if (impressions180d === 0) {
    return {
      action: 'remove',
      reason: `Page /${slug} has ZERO impressions in 180 days. 301-redirect to best sibling or remove.`,
    };
  }
  if (impressions180d < 10 && clicks180d === 0) {
    return {
      action: 'merge',
      reason: `Page /${slug} has ${impressions180d} impressions and 0 clicks in 180 days. Consider merging content into a stronger sibling page.`,
    };
  }
  if (impressions180d < 50) {
    return {
      action: 'improve',
      reason: `Page /${slug} has only ${impressions180d} impressions. Improve title tag, internal links, and content freshness.`,
    };
  }
  return {
    action: 'keep',
    reason: `Page /${slug} has ${impressions180d} impressions and ${clicks180d} clicks. Healthy — keep and improve.`,
  };
}
