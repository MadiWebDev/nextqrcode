'use client';

import { useState } from 'react';
import { useStore } from '../_lib/store';
import { evaluateAllRules, evaluateRule, type RuleEvaluation } from '../_lib/rules';
import { nowIso, uid, type AutomationRule, type RuleRun } from '../_lib/types';

const inputCls =
  'w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground';

const ACTION_LABELS: Record<AutomationRule['action'], string> = {
  'flag-missing-alt': 'Flag posts whose images are missing alt text (suggestion)',
  'suggest-recycle': 'Suggest evergreen posts that are ready to recycle (suggestion)',
  'gap-alert': 'Alert about empty platforms and empty days (suggestion)',
  'remind-approval': 'Remind about posts waiting in review for 2+ days (suggestion)',
  'mark-ready': 'Mark approved + dated posts as Scheduled (action)',
};

export default function RulesPanel() {
  const store = useStore();
  const ws = store.activeWorkspace!;
  const [name, setName] = useState('');
  const [action, setAction] = useState<AutomationRule['action']>('flag-missing-alt');
  const [suggestionOnly, setSuggestionOnly] = useState(true);
  const [results, setResults] = useState<RuleEvaluation[]>([]);
  const [running, setRunning] = useState(false);
  const rules = store.data.rules.filter((r) => r.workspaceId === ws.id);
  const runs = store.data.ruleRuns
    .filter((r) => r.workspaceId === ws.id)
    .slice()
    .sort((a, b) => (a.ranAt < b.ranAt ? 1 : -1))
    .slice(0, 10);

  const mediaAlt = new Map(store.data.media.map((m) => [m.id, Boolean(m.altText.trim())]));
  const posts = store.data.posts.filter((p) => p.workspaceId === ws.id);
  const pillars = store.data.pillars.filter((p) => p.workspaceId === ws.id);
  const campaigns = store.data.campaigns.filter((c) => c.workspaceId === ws.id);

  const applyEvaluation = async (evaluation: RuleEvaluation) => {
    for (const { postId, patch } of evaluation.patches) {
      const post = store.data.posts.find((p) => p.id === postId);
      if (post) {
        await store.savePost({ ...post, ...patch, updatedAt: nowIso() }, 'Automation rule action');
      }
    }
    const rule = rules.find((r) => r.id === evaluation.ruleId);
    const run: RuleRun = {
      id: uid(),
      ruleId: evaluation.ruleId,
      workspaceId: ws.id,
      ranAt: nowIso(),
      outcome: evaluation.outcome,
      detail: `${rule?.name ?? 'Rule'}: ${evaluation.detail}${evaluation.patches.length ? ` Applied ${evaluation.patches.length} change(s).` : ''}`,
    };
    await store.put('ruleRuns', run);
  };

  const runAll = async () => {
    setRunning(true);
    const evaluations = evaluateAllRules(rules, posts, ws, pillars, campaigns, mediaAlt);
    for (const ev of evaluations) await applyEvaluation(ev);
    setResults(evaluations);
    setRunning(false);
  };

  const testRule = async (rule: AutomationRule) => {
    // Test = evaluate as suggestion-only so nothing mutates.
    const evaluation = evaluateRule(
      { ...rule, suggestionOnly: true },
      posts,
      ws,
      pillars,
      campaigns,
      mediaAlt,
    );
    setResults([evaluation]);
    await store.put('ruleRuns', {
      id: uid(),
      ruleId: rule.id,
      workspaceId: ws.id,
      ranAt: nowIso(),
      outcome: evaluation.outcome,
      detail: `TEST ${rule.name}: ${evaluation.detail} (no changes applied)`,
    } satisfies RuleRun);
  };

  const create = async () => {
    if (!name.trim()) return;
    await store.put('rules', {
      id: uid(),
      workspaceId: ws.id,
      name: name.trim(),
      trigger: 'daily-check',
      action,
      suggestionOnly: action === 'mark-ready' ? suggestionOnly : true,
      enabled: true,
      createdAt: nowIso(),
    } satisfies AutomationRule);
    setName('');
  };

  return (
    <section aria-labelledby="rules-h" className="rounded-xl border border-border bg-card p-5">
      <h2 id="rules-h" className="text-lg font-semibold">
        Automation rules
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Rules run only when you click Run — never in the background. Suggestion rules only report;
        the single action rule (mark-ready) does exactly one labelled thing, and every run is
        logged below.
      </p>
      <div className="mt-3 flex flex-wrap items-end gap-3">
        <label className="text-sm font-medium">
          Rule name
          <input className={`${inputCls} mt-1`} value={name} onChange={(e) => setName(e.target.value)} placeholder="Weekly alt-text check" />
        </label>
        <label className="text-sm font-medium">
          What it does
          <select className={`${inputCls} mt-1`} value={action} onChange={(e) => setAction(e.target.value as AutomationRule['action'])}>
            {Object.entries(ACTION_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        {action === 'mark-ready' && (
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={suggestionOnly} onChange={(e) => setSuggestionOnly(e.target.checked)} />
            Suggestion only (don&rsquo;t change posts)
          </label>
        )}
        <button type="button" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground" onClick={() => void create()}>
          Add rule
        </button>
        <button
          type="button"
          disabled={running || rules.filter((r) => r.enabled).length === 0}
          className="rounded-md border border-input px-4 py-2 text-sm font-medium hover:bg-accent disabled:opacity-50"
          onClick={() => void runAll()}
        >
          {running ? 'Running…' : 'Run all enabled rules'}
        </button>
      </div>

      {rules.length > 0 && (
        <ul className="mt-4 space-y-2">
          {rules.map((r) => (
            <li key={r.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border p-3">
              <div>
                <p className="text-sm font-medium">
                  {r.name}{' '}
                  <span className="text-xs font-normal text-muted-foreground">
                    {r.suggestionOnly ? '· suggestion' : '· action'} {r.enabled ? '' : '· disabled'}
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">{ACTION_LABELS[r.action]}</p>
              </div>
              <div className="flex gap-2">
                <button type="button" className="rounded-md border border-input px-3 py-1.5 text-xs font-medium hover:bg-accent" onClick={() => void testRule(r)}>
                  Test (no changes)
                </button>
                <button
                  type="button"
                  className="rounded-md border border-input px-3 py-1.5 text-xs font-medium hover:bg-accent"
                  onClick={() =>
                    void store.put('rules', { ...r, enabled: !r.enabled } satisfies AutomationRule)
                  }
                >
                  {r.enabled ? 'Disable' : 'Enable'}
                </button>
                <button
                  type="button"
                  className="rounded-md border border-input px-3 py-1.5 text-xs font-medium text-destructive hover:bg-accent"
                  onClick={() => void store.remove('rules', r.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {results.length > 0 && (
        <div className="mt-4 rounded-lg bg-muted p-4" role="status">
          <h3 className="text-sm font-semibold">Latest run results</h3>
          {results.map((ev) => (
            <div key={ev.ruleId} className="mt-2">
              <p className="text-sm">{ev.detail}</p>
              {ev.findings.length > 0 && (
                <ul className="mt-1 list-inside list-disc text-sm text-muted-foreground">
                  {ev.findings.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {runs.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-semibold">Run history</h3>
          <ul className="mt-1 space-y-1 text-sm text-muted-foreground">
            {runs.map((r) => (
              <li key={r.id}>
                {new Date(r.ranAt).toLocaleString()} — {r.detail} ({r.outcome})
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
