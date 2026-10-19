/**
 * Ad + indexing eligibility for public QR pages (/q/[publicId]).
 *
 * Policy (mirrors the AdSense rules in docs/ADSENSE.md, Phase 7):
 * - A /q/ page may be indexed ONLY when the QR is public, passed moderation,
 *   and has a unique, owner-written title.
 * - Ads may appear ONLY on indexable pages that are also "substantive":
 *   a real title plus either a description or meaningful usage (10+ scans).
 * - Everything else stays noindex and ad-free. /r/* short links, the dashboard,
 *   login, error pages and thin pages never carry ads (enforced by placement,
 *   not just this helper).
 */
export interface QrEligibilityInput {
  visibility: string;
  moderationStatus: string;
  title?: string | null;
  description?: string | null;
  scanCount?: number | null;
}

export interface QrEligibility {
  /** May appear in sitemap + carry index,follow. */
  indexable: boolean;
  /** May render AdSlot units. Implies indexable. */
  adsEligible: boolean;
  reasons: string[];
}

const DEFAULT_TITLES = new Set(['untitled', 'my qr code', 'qr code', 'new qr code']);

export function qrPageEligibility(input: QrEligibilityInput): QrEligibility {
  const reasons: string[] = [];
  const title = (input.title ?? '').trim();
  const hasUniqueTitle = title.length >= 8 && !DEFAULT_TITLES.has(title.toLowerCase());

  let indexable = true;
  if (input.visibility !== 'public') {
    indexable = false;
    reasons.push('visibility is not public');
  }
  if (input.moderationStatus !== 'passed') {
    indexable = false;
    reasons.push(`moderation status is ${input.moderationStatus}`);
  }
  if (!hasUniqueTitle) {
    indexable = false;
    reasons.push('missing a unique owner-written title');
  }

  let adsEligible = indexable;
  if (indexable) {
    const substantive =
      (input.description ?? '').trim().length >= 40 || (input.scanCount ?? 0) >= 10;
    if (!substantive) {
      adsEligible = false;
      reasons.push('not substantive enough for ads (needs a description or 10+ scans)');
    }
  }

  return { indexable, adsEligible, reasons };
}
