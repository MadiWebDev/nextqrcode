export interface PageRecord {
  slug: string;
  title: string;
  primaryKeyword: string;
  searchIntent: 'informational' | 'transactional' | 'commercial' | 'navigational';
  hub: 'tools' | 'generators' | 'guides' | 'printing' | 'troubleshooting' | 'industries' | 'compare' | 'glossary' | 'regional' | 'templates' | 'legal';
  author: string;
  publishedAt: string;
  updatedAt: string;
  wordCount: number;
  hasFaq: boolean;
  hasHowTo?: boolean;
  status: 'draft' | 'needs_human_review' | 'published';
}

export interface QualityGateResult {
  passed: boolean;
  score: number; // 0 - 100
  issues: string[];
  metrics: {
    wordCount: number;
    keywordDensity: number;
    intentMatch: boolean;
    schemaValid: boolean;
  };
}

/**
 * Quality Gate Evaluator
 * Verifies that a page meets strict Google AdSense, helpfulness, and anti-thin-content requirements.
 */
export function evaluateQualityGate(
  record: PageRecord,
  contentBody: string,
  existingKeywords: string[] = []
): QualityGateResult {
  const issues: string[] = [];
  let score = 100;

  // 1. Word Count Check
  const words = contentBody.trim().split(/\s+/).filter(Boolean).length;
  const minWords = record.hub === 'guides' ? 800 : record.hub === 'tools' ? 600 : 500;
  if (words < minWords) {
    issues.push(`Word count too low (${words} words). Minimum required for ${record.hub} is ${minWords}.`);
    score -= 25;
  }

  // 2. Keyword Cannibalization Check
  const normalizedKeyword = record.primaryKeyword.toLowerCase().trim();
  const duplicate = existingKeywords.find(
    (k) => k.toLowerCase().trim() === normalizedKeyword
  );
  if (duplicate) {
    issues.push(`Keyword cannibalization warning: "${record.primaryKeyword}" is already targeted by another page.`);
    score -= 30;
  }

  // 3. Author & Dates Verification
  if (!record.author || record.author.trim().length === 0) {
    issues.push('Missing verifiable author entity.');
    score -= 15;
  }
  if (!record.publishedAt || !record.updatedAt) {
    issues.push('Missing publishedAt or updatedAt timestamp.');
    score -= 10;
  }

  // 4. FAQ Schema Verification
  if (!record.hasFaq) {
    issues.push('Missing structured FAQ section with Schema.org JSON-LD.');
    score -= 10;
  }

  // 5. Keyword Density Calculation
  const occurrences = (contentBody.toLowerCase().match(new RegExp(normalizedKeyword, 'g')) || []).length;
  const keywordDensity = words > 0 ? (occurrences / words) * 100 : 0;
  if (keywordDensity > 3.0) {
    issues.push(`Keyword stuffing detected: density is ${keywordDensity.toFixed(2)}% (safe range: 0.5% - 2.5%).`);
    score -= 15;
  }

  return {
    passed: score >= 75 && issues.length === 0,
    score: Math.max(0, score),
    issues,
    metrics: {
      wordCount: words,
      keywordDensity: Number(keywordDensity.toFixed(2)),
      intentMatch: Boolean(record.searchIntent),
      schemaValid: record.hasFaq,
    },
  };
}
