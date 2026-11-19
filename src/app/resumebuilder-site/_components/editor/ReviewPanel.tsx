'use client';

/**
 * Review panel (spec §9): writing analysis, job-description matcher
 * and the ATS health check in one place. Every result explains the
 * rule behind it; nothing here phones home — the job description is
 * analysed in this tab and forgotten on reload.
 */
import { useMemo, useState } from 'react';
import type { ResumeDoc } from '../../_lib/schema';
import { rt } from '../../_lib/schema';
import { uid } from '../../_lib/defaults';
import type { TemplateDef } from '../../_lib/templates/types';
import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';
import {
  ACTION_VERBS,
  BULLET_LIBRARY,
  analyseWriting,
  atsHealthCheck,
  matchJobDescription,
  type JdMatchResult,
} from '../../_lib/review';

type Tab = 'writing' | 'match' | 'ats';

export function ReviewPanel({
  doc,
  template,
  patch,
}: {
  doc: ResumeDoc;
  template: TemplateDef | null;
  patch: (fn: (d: ResumeDoc) => ResumeDoc) => void;
}) {
  const [tab, setTab] = useState<Tab>('writing');
  const [jd, setJd] = useState('');
  const [match, setMatch] = useState<JdMatchResult | null>(null);
  const [libraryKey, setLibraryKey] = useState('generic');

  const issues = useMemo(() => analyseWriting(doc), [doc]);
  const checks = useMemo(() => (template ? atsHealthCheck(doc, template) : []), [doc, template]);

  const addSkill = (term: string) => {
    patch((d) => ({
      ...d,
      sections: d.sections.map((s) => {
        if (s.kind !== 'skills') return s;
        const existing = s.skillGroups ?? [];
        const groups = existing.length > 0 ? existing : [{ id: uid('grp'), name: 'Skills', skills: [] }];
        return {
          ...s,
          skillGroups: groups.map((g, i) =>
            i === 0 ? { ...g, skills: [...g.skills, { id: uid('sk'), name: term }] } : g,
          ),
        };
      }),
    }));
  };

  const addStarterBullet = (text: string) => {
    patch((d) => {
      const idx = d.sections.findIndex((s) => s.kind === 'experience' && (s.experience?.length ?? 0) > 0);
      if (idx === -1) return d;
      const section = d.sections[idx];
      const experience = (section.experience ?? []).map((e, i) =>
        i === 0 ? { ...e, bullets: [...e.bullets, rt.bullets([text])] } : e,
      );
      const sections = d.sections.map((s, i) => (i === idx ? { ...s, experience } : s));
      return { ...d, sections };
    });
  };

  return (
    <div className="space-y-3 rounded-lg border border-border bg-card p-3">
      <h2 className="text-sm font-semibold">Review &amp; job match</h2>
      <div className="flex gap-1" role="tablist" aria-label="Review tools">
        {(
          [
            ['writing', `Writing${issues.length ? ` (${issues.length})` : ''}`],
            ['match', 'Job match'],
            ['ats', 'ATS health'],
          ] as Array<[Tab, string]>
        ).map(([id, label]) => (
          <button
            key={id}
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={`min-h-11 rounded-md px-3 text-sm font-medium ${tab === id ? 'bg-primary text-primary-foreground' : 'border border-input'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'writing' ? (
        <div className="space-y-3">
          {issues.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No writing issues found by the current checks — strong verbs, consistent tense, no
              duplicates. (The checks are listed under ATS health if you want to see what runs.)
            </p>
          ) : (
            <ul className="space-y-2">
              {issues.slice(0, 30).map((issue, i) => (
                <li key={i} className="rounded-md bg-muted/60 p-2 text-sm">
                  <p className="font-medium">
                    {issue.entryTitle} <span className="font-normal text-muted-foreground">· {issue.sectionTitle}</span>
                  </p>
                  <p className="italic text-muted-foreground">&ldquo;{issue.bullet.slice(0, 140)}{issue.bullet.length > 140 ? '…' : ''}&rdquo;</p>
                  <p>{issue.message}</p>
                </li>
              ))}
            </ul>
          )}
          <div>
            <p className="text-sm font-medium">Strong verbs to start bullets with</p>
            <p className="mt-1 text-sm text-muted-foreground">{ACTION_VERBS.join(' · ')}</p>
          </div>
          <div className="space-y-2">
            <label className="block space-y-1">
              <span className="text-sm font-medium">Bullet starters by profession</span>
              <select
                value={libraryKey}
                onChange={(e) => setLibraryKey(e.target.value)}
                className="min-h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {Object.keys(BULLET_LIBRARY).map((k) => (
                  <option key={k} value={k}>
                    {k[0].toUpperCase() + k.slice(1)}
                  </option>
                ))}
              </select>
            </label>
            <ul className="space-y-1">
              {BULLET_LIBRARY[libraryKey].map((starter) => (
                <li key={starter} className="flex items-start justify-between gap-2 rounded-md bg-muted/60 p-2 text-sm">
                  <span>{starter}</span>
                  <button
                    type="button"
                    className="shrink-0 rounded border border-input px-2 py-1 text-xs font-medium"
                    onClick={() => addStarterBullet(starter)}
                    title="Add to your first experience entry, then rewrite it in your own words"
                  >
                    Add &amp; rewrite
                  </button>
                </li>
              ))}
            </ul>
            <p className="text-xs text-muted-foreground">
              Starters are patterns, not finished bullets — replace every [bracket] with your own
              real numbers and words.
            </p>
          </div>
        </div>
      ) : null}

      {tab === 'match' ? (
        <div className="space-y-3">
          <label className="block space-y-1">
            <span className="text-sm font-medium">Paste the job description</span>
            <textarea
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              rows={7}
              placeholder="Paste the full job posting here. It is analysed in this tab only — never uploaded or stored."
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </label>
          <button
            type="button"
            className="min-h-11 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground disabled:opacity-50"
            disabled={jd.trim().length < 40}
            onClick={() => setMatch(matchJobDescription(doc, jd))}
          >
            Analyse match
          </button>
          {match ? (
            <div className="space-y-2" aria-live="polite">
              <p className="text-sm">
                Keyword coverage: <strong>{match.coverage}%</strong> of the recognisable terms in
                this posting appear in your resume.
              </p>
              <p className="text-xs text-muted-foreground">{match.note}</p>
              {match.matched.length ? (
                <p className="text-sm">
                  <span className="font-medium">Already in your resume:</span>{' '}
                  {match.matched.map((m) => m.term).join(', ')}
                </p>
              ) : null}
              {match.missing.length ? (
                <div>
                  <p className="text-sm font-medium">In the posting but not your resume:</p>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {match.missing.map((m) => (
                      <span key={m.term} className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-xs">
                        {m.term} ×{m.jdCount}
                        <button
                          type="button"
                          className="font-semibold underline"
                          onClick={() => addSkill(m.term)}
                          title="Add to your skills section — only if it is true of you"
                        >
                          + add
                        </button>
                      </span>
                    ))}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Add a term only where it honestly describes your experience — a human will ask
                    about it.
                  </p>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}

      {tab === 'ats' ? (
        <div className="space-y-3">
          <p className="rounded-md bg-amber-50 p-2 text-xs text-amber-900 dark:bg-amber-950 dark:text-amber-100">
            This is a checklist-based estimate, not a real employer&apos;s ATS. Every employer&apos;s
            system differs and none publish their rules; what follows are the widely documented
            parsing basics, checked against your actual resume, with the reason for each result.
          </p>
          <ul className="space-y-2">
            {checks.map((c) => (
              <li key={c.id} className="rounded-md bg-muted/60 p-2 text-sm">
                <p className="flex items-center gap-1.5 font-medium">
                  {c.status === 'pass' ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden />
                  ) : c.status === 'warn' ? (
                    <AlertTriangle className="h-4 w-4 text-amber-600" aria-hidden />
                  ) : (
                    <XCircle className="h-4 w-4 text-destructive" aria-hidden />
                  )}
                  {c.title}
                  <span className="sr-only">({c.status})</span>
                </p>
                <p className="text-muted-foreground">{c.detail}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
