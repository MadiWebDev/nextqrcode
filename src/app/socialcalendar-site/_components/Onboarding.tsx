'use client';

import { useEffect, useState } from 'react';
import { useStore } from '../_lib/store';
import { PLATFORMS } from '../_lib/platforms';
import { addDays } from '../_lib/dates';
import { todayInZone, wallTimeToUtc } from '../_lib/tz';
import { nowIso, uid, type Campaign, type Pillar, type Post } from '../_lib/types';
import type { EditorSeed } from './calendar/PostEditor';
import type { WorkspaceTab } from './CommandPalette';

const inputCls =
  'w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground';

const STEPS = ['Welcome', 'Workspace', 'Platforms', 'First content', 'Done'];

/**
 * Five-step onboarding (spec §13). Dismissible at any point, shown once
 * per workspace, and the sample content is realistic, clearly tagged
 * `sample`, and removable in one click.
 */
export default function Onboarding({
  openEditor,
  goTab,
}: {
  openEditor: (seed: EditorSeed) => void;
  goTab: (tab: WorkspaceTab) => void;
}) {
  const store = useStore();
  const ws = store.activeWorkspace!;
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);
  const [name, setName] = useState(ws.name);
  const [sampleIds, setSampleIds] = useState<string[]>([]);
  const dismissKey = `sc-onboarding:${ws.id}`;
  const sampleKey = `sc-sample:${ws.id}`;

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        if (!window.localStorage.getItem(dismissKey)) setVisible(true);
        const stored = window.localStorage.getItem(sampleKey);
        if (stored) setSampleIds(JSON.parse(stored) as string[]);
      } catch {
        // ignore
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [dismissKey, sampleKey]);

  if (!visible) return null;

  const dismiss = () => {
    try {
      window.localStorage.setItem(dismissKey, '1');
    } catch {
      // ignore
    }
    setVisible(false);
  };

  const saveWorkspaceBasics = async () => {
    await store.updateWorkspace({ ...ws, name: name.trim() || ws.name, updatedAt: nowIso() });
  };

  const togglePlatform = async (pid: string) => {
    const has = ws.platformIds.includes(pid);
    await store.updateWorkspace({
      ...ws,
      platformIds: has ? ws.platformIds.filter((x) => x !== pid) : [...ws.platformIds, pid],
      updatedAt: nowIso(),
    });
  };

  const loadSample = async () => {
    const calendarId = store.data.calendars[0]?.id ?? '';
    const today = todayInZone(ws.timezone);
    const ids: string[] = [];
    const mk = (patch: Partial<Post>): Post => ({
      id: uid(),
      workspaceId: ws.id,
      calendarId,
      title: '',
      caption: '',
      description: '',
      platformCaptions: {},
      platformIds: ws.platformIds.slice(0, 2),
      scheduledAt: null,
      timezone: ws.timezone,
      status: 'draft',
      contentType: 'image',
      priority: 'normal',
      tags: ['sample'],
      assigneeLabel: '',
      internalNotes: 'Sample content from onboarding — edit or delete freely.',
      mediaIds: [],
      checklist: [],
      createdAt: nowIso(),
      updatedAt: nowIso(),
      ...patch,
    });
    const education: Pillar = {
      id: uid(), workspaceId: ws.id, name: 'Education', color: '#0ea5e9', targetPercent: 40,
      description: 'Teach something useful.',
    };
    const promotion: Pillar = {
      id: uid(), workspaceId: ws.id, name: 'Promotion', color: '#f59e0b', targetPercent: 30,
      description: 'Products, offers and launches.',
    };
    await store.put('pillars', education);
    await store.put('pillars', promotion);
    ids.push(education.id, promotion.id);
    const campaign: Campaign = {
      id: uid(), workspaceId: ws.id, name: 'Sample: Launch Week', description: 'A one-week product launch arc.',
      goal: 'Announce the new product and drive first sales.', startDate: addDays(today, 1), endDate: addDays(today, 7),
      status: 'planned', color: '#0ea5e9', audienceNotes: 'Existing followers + warm leads.',
      utmDefaults: { source: 'social', medium: 'organic', campaign: 'launch-week' },
      createdAt: nowIso(), updatedAt: nowIso(),
    };
    await store.put('campaigns', campaign);
    ids.push(campaign.id);
    const samples: Partial<Post>[] = [
      { title: '3 mistakes to avoid this week', caption: 'Most people get #2 wrong. Here is what to do instead — save this for later.', pillarId: education.id, scheduledAt: wallTimeToUtc(ws.timezone, addDays(today, 1), '09:00').toISOString(), status: 'scheduled', contentType: 'carousel' },
      { title: 'Launch teaser', caption: 'Something new is coming on Friday. Any guesses?', campaignId: campaign.id, scheduledAt: wallTimeToUtc(ws.timezone, addDays(today, 2), '12:00').toISOString(), status: 'scheduled', contentType: 'image' },
      { title: 'How it works (60s demo)', caption: 'A quick walkthrough of the one feature everyone asks about.', pillarId: education.id, scheduledAt: wallTimeToUtc(ws.timezone, addDays(today, 3), '18:00').toISOString(), status: 'scheduled', contentType: 'video' },
      { title: 'Customer story', caption: '"It saved us two hours a week." — a real result from a real customer. Full story on the blog.', scheduledAt: wallTimeToUtc(ws.timezone, addDays(today, 4), '10:00').toISOString(), status: 'draft', contentType: 'image' },
      { title: 'Launch day', caption: 'It is live. Link in bio — launch-week pricing ends Sunday.', campaignId: campaign.id, pillarId: promotion.id, scheduledAt: wallTimeToUtc(ws.timezone, addDays(today, 5), '09:00').toISOString(), status: 'scheduled', contentType: 'image' },
      { title: 'FAQ Friday', caption: 'You asked, we answer: the five questions from this week, in one thread.', pillarId: education.id, scheduledAt: wallTimeToUtc(ws.timezone, addDays(today, 6), '13:00').toISOString(), status: 'draft', contentType: 'text' },
      { title: 'Weekend community question', caption: 'What is one thing you wish more brands would stop doing? Best answers featured Monday.', scheduledAt: wallTimeToUtc(ws.timezone, addDays(today, 7), '11:00').toISOString(), status: 'idea', contentType: 'text' },
      { title: 'Launch recap + thank you', caption: 'Launch week by the numbers — and a thank-you to everyone who shared it.', campaignId: campaign.id, scheduledAt: wallTimeToUtc(ws.timezone, addDays(today, 8), '17:00').toISOString(), status: 'idea', contentType: 'carousel' },
    ];
    for (const s of samples) {
      const post = mk(s);
      await store.savePost(post, 'Sample content');
      ids.push(post.id);
    }
    try {
      window.localStorage.setItem(sampleKey, JSON.stringify(ids));
    } catch {
      // ignore
    }
    setSampleIds(ids);
  };

  const removeSample = async () => {
    for (const id of sampleIds) {
      if (store.data.posts.some((p) => p.id === id)) await store.deletePost(id);
      else if (store.data.pillars.some((p) => p.id === id)) await store.remove('pillars', id);
      else if (store.data.campaigns.some((c) => c.id === id)) await store.remove('campaigns', id);
    }
    try {
      window.localStorage.removeItem(sampleKey);
    } catch {
      // ignore
    }
    setSampleIds([]);
  };

  return (
    <section aria-labelledby="onboarding-h" className="mb-6 rounded-xl border border-primary/40 bg-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Getting started · Step {step + 1} of {STEPS.length}: {STEPS[step]}
          </p>
          <h2 id="onboarding-h" className="mt-1 text-lg font-semibold">
            {step === 0 && 'Welcome to your content calendar'}
            {step === 1 && 'Name your workspace'}
            {step === 2 && 'Pick your platforms'}
            {step === 3 && 'Add your first content'}
            {step === 4 && 'You are set'}
          </h2>
        </div>
        <button type="button" className="rounded-md border border-input px-3 py-1.5 text-sm font-medium hover:bg-accent" onClick={dismiss}>
          Dismiss
        </button>
      </div>

      {step === 0 && (
        <div className="mt-2 space-y-2 text-sm text-muted-foreground">
          <p>
            Plan posts for every platform in one calendar, balance your content pillars, and export
            or share your plan — without an account.
          </p>
          <p>
            <strong className="text-foreground">Private by design:</strong> everything is stored in
            this browser only. There is no server copy, so export a backup from the Data tab
            regularly.
          </p>
        </div>
      )}
      {step === 1 && (
        <label className="mt-2 block max-w-sm text-sm font-medium">
          Workspace name
          <input className={`${inputCls} mt-1`} value={name} onChange={(e) => setName(e.target.value)} onBlur={() => void saveWorkspaceBasics()} />
          <span className="mt-1 block text-xs font-normal text-muted-foreground">
            Timezone is set to {ws.timezone} — change it any time in the Workspaces tab.
          </span>
        </label>
      )}
      {step === 2 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {PLATFORMS.map((p) => {
            const on = ws.platformIds.includes(p.id);
            return (
              <button
                key={p.id}
                type="button"
                aria-pressed={on}
                className={`rounded-full border px-3 py-1.5 text-sm ${on ? 'border-primary bg-primary/10 font-medium' : 'border-border text-muted-foreground'}`}
                onClick={() => void togglePlatform(p.id)}
              >
                {p.name}
              </button>
            );
          })}
        </div>
      )}
      {step === 3 && (
        <div className="mt-2 space-y-3 text-sm">
          <p className="text-muted-foreground">Start however you like — you can change everything later.</p>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground" onClick={() => openEditor({})}>
              Create your first post
            </button>
            <button type="button" className="rounded-md border border-input px-4 py-2 text-sm font-medium hover:bg-accent" onClick={() => void loadSample()}>
              Load realistic sample content
            </button>
            <button type="button" className="rounded-md border border-input px-4 py-2 text-sm font-medium hover:bg-accent" onClick={() => goTab('analytics')}>
              Import a CSV instead
            </button>
          </div>
          {sampleIds.length > 0 && (
            <p className="text-muted-foreground" role="status">
              Sample content loaded (8 posts, 2 pillars, 1 campaign — all tagged “sample”).{' '}
              <button type="button" className="underline" onClick={() => void removeSample()}>
                Remove sample data
              </button>
            </p>
          )}
        </div>
      )}
      {step === 4 && (
        <div className="mt-2 space-y-2 text-sm text-muted-foreground">
          <p>
            Tip: press <kbd className="rounded border border-border px-1">Ctrl/⌘ K</kbd> anywhere for
            the command palette, and <kbd className="rounded border border-border px-1">?</kbd> for
            all keyboard shortcuts.
          </p>
          <p>Your data never leaves this browser unless you export or share it. Happy planning!</p>
        </div>
      )}

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          disabled={step === 0}
          className="rounded-md border border-input px-4 py-2 text-sm font-medium hover:bg-accent disabled:opacity-50"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
        >
          Back
        </button>
        {step < STEPS.length - 1 ? (
          <button type="button" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground" onClick={() => setStep((s) => s + 1)}>
            Next
          </button>
        ) : (
          <button type="button" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground" onClick={dismiss}>
            Start planning
          </button>
        )}
      </div>
    </section>
  );
}
