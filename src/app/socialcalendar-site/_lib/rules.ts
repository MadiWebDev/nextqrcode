import { detectGaps } from './intelligence';
import type {
  AutomationRule,
  Campaign,
  Pillar,
  Post,
  Workspace,
} from './types';

export interface RuleEvaluation {
  ruleId: string;
  outcome: 'ok' | 'error';
  detail: string;
  /** Post patches an ACTION rule wants applied (user runs rules explicitly). */
  patches: { postId: string; patch: Partial<Post> }[];
  /** Human-readable findings (suggestions and action explanations). */
  findings: string[];
}

/**
 * Local automation rule engine (spec §10). Rules are evaluated on
 * demand ("Run rules" / "Test rule") — never in the background — and
 * every evaluation is logged by the caller into ruleRuns.
 *
 * Suggestion rules never produce patches. The single action rule
 * (mark-ready) does exactly one labelled thing: an approved post that
 * already has a date becomes "scheduled".
 */
export function evaluateRule(
  rule: AutomationRule,
  posts: Post[],
  workspace: Workspace,
  pillars: Pillar[],
  campaigns: Campaign[],
  mediaAlt: Map<string, boolean>,
): RuleEvaluation {
  const findings: string[] = [];
  const patches: RuleEvaluation['patches'] = [];
  try {
    switch (rule.action) {
      case 'flag-missing-alt': {
        for (const p of posts) {
          if (p.status === 'published' || p.status === 'archived') continue;
          if (p.mediaIds.some((id) => mediaAlt.get(id) === false)) {
            findings.push(`"${p.title || 'Untitled'}" has an image without alt text.`);
          }
        }
        break;
      }
      case 'gap-alert': {
        const gaps = detectGaps(posts, workspace, pillars, campaigns, mediaAlt).filter(
          (g) => g.kind === 'platform-empty' || g.kind === 'day-empty',
        );
        for (const g of gaps) findings.push(`${g.message} ${g.suggestion}`);
        break;
      }
      case 'remind-approval': {
        const gaps = detectGaps(posts, workspace, pillars, campaigns, mediaAlt).filter(
          (g) => g.kind === 'awaiting-approval',
        );
        for (const g of gaps) findings.push(g.message);
        break;
      }
      case 'suggest-recycle': {
        const gaps = detectGaps(posts, workspace, pillars, campaigns, mediaAlt).filter(
          (g) => g.kind === 'evergreen-eligible',
        );
        for (const g of gaps) findings.push(`${g.message} Suggested date: ${g.date}.`);
        break;
      }
      case 'mark-ready': {
        if (rule.suggestionOnly) {
          for (const p of posts) {
            if (p.status === 'approved' && p.scheduledAt) {
              findings.push(
                `"${p.title || 'Untitled'}" is approved and dated — it could be marked Scheduled.`,
              );
            }
          }
        } else {
          for (const p of posts) {
            if (p.status === 'approved' && p.scheduledAt) {
              patches.push({ postId: p.id, patch: { status: 'scheduled' } });
              findings.push(
                `"${p.title || 'Untitled'}" marked Scheduled (approved + has a date).`,
              );
            }
          }
        }
        break;
      }
    }
    return {
      ruleId: rule.id,
      outcome: 'ok',
      detail: findings.length
        ? `${findings.length} finding${findings.length === 1 ? '' : 's'}`
        : 'No findings — everything this rule watches looks fine.',
      patches,
      findings,
    };
  } catch (err) {
    return {
      ruleId: rule.id,
      outcome: 'error',
      detail: err instanceof Error ? err.message : 'Unknown error while evaluating the rule.',
      patches: [],
      findings: [],
    };
  }
}

export function evaluateAllRules(
  rules: AutomationRule[],
  posts: Post[],
  workspace: Workspace,
  pillars: Pillar[],
  campaigns: Campaign[],
  mediaAlt: Map<string, boolean>,
): RuleEvaluation[] {
  return rules
    .filter((r) => r.enabled)
    .map((r) => evaluateRule(r, posts, workspace, pillars, campaigns, mediaAlt));
}
