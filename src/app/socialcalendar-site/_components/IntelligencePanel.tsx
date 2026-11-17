'use client';

import { useMemo, useState } from 'react';
import { useStore } from '../_lib/store';
import {
  computeBestTimes,
  detectGaps,
  evergreenSuggestions,
  pillarBalance,
  repurposeTargets,
  type GapSuggestion,
} from '../_lib/intelligence';
import { proposeSchedule, type ScheduleProposal } from '../_lib/autoschedule';
import { parseScheduleText } from '../_lib/nl';
import { BEST_TIME_GUIDANCE_LABEL, guidanceFor } from '../_data/best-times';
import { getPlatform } from '../_lib/platforms';
import { addDays, weekdayOf } from '../_lib/dates';
import { todayInZone, wallTimeToUtc } from '../_lib/tz';
import { nowIso, uid, type ContentType, type Post, type Series } from '../_lib/types';
import type { EditorSeed } from './calendar/PostEditor';

const inputCls =
  'w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground';
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WEEKDAY_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

type OpenEditor = (seed: EditorSeed) => void;

/** Build a full new-post object the way the editor expects (mirrors its blankPost). */
function draftPost(
  workspaceId: string,
  calendarId: string,
  timezone: string,
  patch: Partial<Post>,
): Post {
  return {
    id: uid(),
    workspaceId,
    calendarId,
    title: '',
    caption: '',
    description: '',
    platformCaptions: {},
    platformIds: [],
    scheduledAt: null,
    timezone,
    status: 'draft',
    contentType: 'image',
    priority: 'normal',
    tags: [],
    assigneeLabel: '',
    internalNotes: '',
    mediaIds: [],
    checklist: [],
    createdAt: nowIso(),
    updatedAt: nowIso(),
    ...patch,
  };
}

export default function IntelligencePanel({ openEditor }: { openEditor: OpenEditor }) {
  const store = useStore();
  const ws = store.activeWorkspace!;
  const wsPosts = useMemo(
    () => store.data.posts.filter((p) => p.workspaceId === ws.id),
    [store.data.posts, ws.id],
  );
  const pillars = store.data.pillars.filter((p) => p.workspaceId === ws.id);
  const campaigns = store.data.campaigns.filter((c) => c.workspaceId === ws.id);
  const mediaAlt = useMemo(
    () => new Map(store.data.media.map((m) => [m.id, Boolean(m.altText.trim())])),
    [store.data.media],
  );
  const gaps = useMemo(
    () => detectGaps(wsPosts, ws, pillars, campaigns, mediaAlt),
    [wsPosts, ws, pillars, campaigns, mediaAlt],
  );
  const today = todayInZone(ws.timezone);
  const balances = useMemo(
    () =>
      pillarBalance(
        wsPosts,
        pillars,
        new Date(`${today}T00:00:00.000Z`).toISOString(),
        new Date(`${addDays(today, 30)}T23:59:59.999Z`).toISOString(),
      ),
    [wsPosts, pillars, today],
  );

  return (
    <div className="space-y-8">
      <NaturalLanguageComposer />
      <section aria-labelledby="gaps-h">
        <h2 id="gaps-h" className="text-lg font-semibold">
          Gaps &amp; suggestions
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Computed from your real calendar data. Suggestions only — nothing here changes your
          calendar until you act on it.
        </p>
        {gaps.length === 0 ? (
          <p className="mt-3 rounded-lg border border-border bg-card p-4 text-sm">
            No gaps detected for the next 14 days. Your plan looks balanced.
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {gaps.map((g, i) => (
              <GapRow
                key={`${g.kind}-${g.postId ?? g.platformId ?? g.date ?? i}`}
                gap={g}
                openEditor={openEditor}
              />
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="pillars-h">
        <h2 id="pillars-h" className="text-lg font-semibold">
          Pillar balance — next 30 days
        </h2>
        {pillars.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">
            Add content pillars in Campaigns &amp; brand to see target-vs-actual balance here.
          </p>
        ) : (
          <div className="mt-3 space-y-3">
            {balances.map((b) => (
              <div key={b.pillarId}>
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{b.name}</span>
                  <span className="text-muted-foreground">
                    {b.actual}% actual · {b.target}% target · {b.count} posts
                  </span>
                </div>
                <div
                  className="mt-1 flex h-2.5 gap-1"
                  role="img"
                  aria-label={`${b.name}: ${b.actual}% actual against ${b.target}% target`}
                >
                  <div className="rounded bg-primary" style={{ width: `${Math.min(100, b.actual)}%` }} />
                  <div className="rounded bg-muted" style={{ width: `${Math.max(0, 100 - b.actual)}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <AutoSchedule />
      <RepurposePlanner openEditor={openEditor} />
      <EvergreenQueue openEditor={openEditor} />
      <SeriesManager />
      <BestTimes />
    </div>
  );
}

function GapRow({ gap, openEditor }: { gap: GapSuggestion; openEditor: OpenEditor }) {
  const store = useStore();
  const ws = store.activeWorkspace!;
  const planIt = () => {
    const date = gap.date ?? todayInZone(ws.timezone);
    openEditor({
      post: draftPost(ws.id, store.data.calendars[0]?.id ?? '', ws.timezone, {
        scheduledAt: wallTimeToUtc(ws.timezone, date, '09:00').toISOString(),
        status: 'scheduled',
        platformIds: gap.platformId ? [gap.platformId] : ws.platformIds,
        pillarId: gap.pillarId,
        campaignId: gap.campaignId,
      }),
    });
  };
  return (
    <li className="flex flex-wrap items-start justify-between gap-3 rounded-lg border border-border bg-card p-4">
      <div className="min-w-0">
        <p className="text-sm font-medium">{gap.message}</p>
        <p className="mt-0.5 text-sm text-muted-foreground">{gap.suggestion}</p>
      </div>
      {(gap.date || gap.platformId || gap.pillarId || gap.campaignId) && (
        <button
          type="button"
          className="shrink-0 rounded-md border border-input px-3 py-1.5 text-sm font-medium hover:bg-accent"
          onClick={planIt}
        >
          Plan it
        </button>
      )}
    </li>
  );
}

function NaturalLanguageComposer() {
  const store = useStore();
  const ws = store.activeWorkspace!;
  const [title, setTitle] = useState('');
  const [phrase, setPhrase] = useState('');
  const [done, setDone] = useState('');
  const parsed = useMemo(
    () => (phrase.trim() ? parseScheduleText(phrase, ws.timezone) : null),
    [phrase, ws.timezone],
  );

  const create = async () => {
    if (!parsed) return;
    const post = draftPost(ws.id, store.data.calendars[0]?.id ?? '', ws.timezone, {
      title: title.trim() || 'Untitled post',
      platformIds: parsed.platformIds.length ? parsed.platformIds : ws.platformIds,
      scheduledAt: parsed.instant,
      status: 'scheduled',
      recurrence: parsed.recurrence,
    });
    await store.savePost(post, 'Created from natural-language scheduling');
    setDone(`Created "${post.title}" — ${parsed.preview}.`);
    setTitle('');
    setPhrase('');
  };

  return (
    <section aria-labelledby="nl-h" className="rounded-xl border border-border bg-card p-5">
      <h2 id="nl-h" className="text-lg font-semibold">
        Plan with words
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Describe when a post should go out — for example “next Tuesday at 6 PM on Instagram” or
        “every Monday at 9 AM”. You always confirm the parsed result before anything is saved.
      </p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <label className="block text-sm font-medium">
          Post title
          <input
            className={`${inputCls} mt-1`}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Product launch teaser"
          />
        </label>
        <label className="block text-sm font-medium">
          When (and where)
          <input
            className={`${inputCls} mt-1`}
            value={phrase}
            onChange={(e) => setPhrase(e.target.value)}
            placeholder="next Tuesday at 6 PM on Instagram"
          />
        </label>
      </div>
      {phrase.trim() && (
        <p className="mt-3 rounded-md bg-muted px-3 py-2 text-sm" role="status">
          {parsed ? (
            <>
              Understood: <strong>{parsed.preview}</strong>. Nothing is saved until you confirm.
            </>
          ) : (
            <>Couldn&rsquo;t find a date or time in that phrase yet — try “tomorrow at 9 AM” or “Friday 18:00”.</>
          )}
        </p>
      )}
      <button
        type="button"
        disabled={!parsed}
        className="mt-3 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
        onClick={() => void create()}
      >
        Confirm &amp; create post
      </button>
      {done && (
        <p className="mt-2 text-sm text-emerald-600 dark:text-emerald-400" role="status">
          {done}
        </p>
      )}
    </section>
  );
}

function AutoSchedule() {
  const store = useStore();
  const ws = store.activeWorkspace!;
  const [postsPerWeek, setPostsPerWeek] = useState(3);
  const [days, setDays] = useState<number[]>([1, 3, 5]);
  const [time, setTime] = useState('09:00');
  const [weeks, setWeeks] = useState(2);
  const [proposals, setProposals] = useState<ScheduleProposal[] | null>(null);
  const [rejected, setRejected] = useState<Set<string>>(new Set());
  const [applied, setApplied] = useState('');

  const unscheduled = store.data.posts.filter(
    (p) =>
      p.workspaceId === ws.id &&
      !p.scheduledAt &&
      p.status !== 'published' &&
      p.status !== 'archived',
  );
  const pillars = store.data.pillars.filter((p) => p.workspaceId === ws.id);

  const generate = () => {
    const existing = store.data.posts.filter((p) => p.workspaceId === ws.id);
    setProposals(
      proposeSchedule(unscheduled, existing, pillars, {
        postsPerWeek,
        preferredDays: days,
        preferredTimes: [time],
        fromDate: addDays(todayInZone(ws.timezone), 1),
        weeks,
        maxPerDay: 2,
      }),
    );
    setRejected(new Set());
    setApplied('');
  };

  const accept = async (proposal: ScheduleProposal) => {
    const post = store.data.posts.find((p) => p.id === proposal.postId);
    if (!post) return;
    await store.savePost(
      {
        ...post,
        scheduledAt: wallTimeToUtc(ws.timezone, proposal.date, proposal.time).toISOString(),
        status: 'scheduled',
        updatedAt: nowIso(),
      },
      'Auto-schedule proposal accepted',
    );
    setProposals((prev) => prev?.filter((p) => p.postId !== proposal.postId) ?? null);
  };

  const acceptAll = async () => {
    const list = (proposals ?? []).filter((p) => !rejected.has(p.postId));
    for (const p of list) await accept(p);
    setApplied(`Scheduled ${list.length} post${list.length === 1 ? '' : 's'}.`);
    setProposals([]);
  };

  return (
    <section aria-labelledby="auto-h" className="rounded-xl border border-border bg-card p-5">
      <h2 id="auto-h" className="text-lg font-semibold">
        Auto-schedule assistant
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Proposes slots for your {unscheduled.length} unscheduled post{unscheduled.length === 1 ? '' : 's'} using
        your preferred days and time. Each proposal explains itself; you accept or reject every
        one. Existing posts are never moved.
      </p>
      <div className="mt-3 flex flex-wrap items-end gap-4">
        <label className="text-sm font-medium">
          Posts / week
          <input
            type="number"
            min={1}
            max={14}
            className={`${inputCls} mt-1 w-24`}
            value={postsPerWeek}
            onChange={(e) => setPostsPerWeek(Number(e.target.value))}
          />
        </label>
        <label className="text-sm font-medium">
          Weeks
          <input
            type="number"
            min={1}
            max={8}
            className={`${inputCls} mt-1 w-20`}
            value={weeks}
            onChange={(e) => setWeeks(Number(e.target.value))}
          />
        </label>
        <label className="text-sm font-medium">
          Time
          <input type="time" className={`${inputCls} mt-1 w-32`} value={time} onChange={(e) => setTime(e.target.value)} />
        </label>
        <fieldset>
          <legend className="text-sm font-medium">Preferred days</legend>
          <div className="mt-1 flex gap-1">
            {WEEKDAYS.map((label, i) => (
              <button
                key={label}
                type="button"
                aria-pressed={days.includes(i)}
                className={`rounded-md border px-2.5 py-1.5 text-xs font-medium ${days.includes(i) ? 'border-primary bg-primary text-primary-foreground' : 'border-input hover:bg-accent'}`}
                onClick={() =>
                  setDays((prev) => (prev.includes(i) ? prev.filter((d) => d !== i) : [...prev, i]))
                }
              >
                {label}
              </button>
            ))}
          </div>
        </fieldset>
        <button
          type="button"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          onClick={generate}
        >
          Generate proposals
        </button>
      </div>
      {proposals && proposals.length === 0 && (
        <p className="mt-3 text-sm text-muted-foreground">
          No proposals — either nothing is unscheduled or the window is full.
        </p>
      )}
      {proposals && proposals.length > 0 && (
        <>
          <ul className="mt-4 space-y-2">
            {proposals.map((p) => {
              const post = store.data.posts.find((x) => x.id === p.postId);
              const isRejected = rejected.has(p.postId);
              return (
                <li key={p.postId} className={`rounded-lg border border-border p-3 ${isRejected ? 'opacity-50' : ''}`}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-medium">
                      {post?.title || 'Untitled'} → {WEEKDAY_FULL[weekdayOf(p.date)]}, {p.date} at {p.time}
                    </p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="rounded-md bg-primary px-3 py-1 text-xs font-medium text-primary-foreground"
                        onClick={() => void accept(p)}
                      >
                        Accept
                      </button>
                      <button
                        type="button"
                        className="rounded-md border border-input px-3 py-1 text-xs font-medium"
                        onClick={() => setRejected((prev) => new Set(prev).add(p.postId))}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                  <ul className="mt-1 list-inside list-disc text-xs text-muted-foreground">
                    {p.reasons.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ul>
          <button
            type="button"
            className="mt-3 rounded-md border border-input px-4 py-2 text-sm font-medium hover:bg-accent"
            onClick={() => void acceptAll()}
          >
            Accept all remaining
          </button>
        </>
      )}
      {applied && (
        <p className="mt-2 text-sm text-emerald-600 dark:text-emerald-400" role="status">
          {applied}
        </p>
      )}
    </section>
  );
}

function RepurposePlanner({ openEditor }: { openEditor: OpenEditor }) {
  const store = useStore();
  const ws = store.activeWorkspace!;
  const [sourceId, setSourceId] = useState('');
  const posts = store.data.posts.filter((p) => p.workspaceId === ws.id);
  const source = posts.find((p) => p.id === sourceId);
  return (
    <section aria-labelledby="repurpose-h" className="rounded-xl border border-border bg-card p-5">
      <h2 id="repurpose-h" className="text-lg font-semibold">
        Repurposing planner
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Turn one post into platform-native derivatives. Each derivative opens in the editor as a
        draft linked back to its source — review and save it there.
      </p>
      <label className="mt-3 block max-w-md text-sm font-medium">
        Source post
        <select className={`${inputCls} mt-1`} value={sourceId} onChange={(e) => setSourceId(e.target.value)}>
          <option value="">Choose a post…</option>
          {posts.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title || 'Untitled'} ({p.contentType})
            </option>
          ))}
        </select>
      </label>
      {source && (
        <ul className="mt-3 space-y-2">
          {repurposeTargets(source).map((t) => (
            <li
              key={`${t.platformId}-${t.contentType}`}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border p-3"
            >
              <p className="text-sm">
                <span className="font-medium">{getPlatform(t.platformId)?.name}</span> · {t.contentType} — {t.note}
              </p>
              <button
                type="button"
                className="rounded-md border border-input px-3 py-1.5 text-sm font-medium hover:bg-accent"
                onClick={() =>
                  openEditor({
                    post: draftPost(ws.id, store.data.calendars[0]?.id ?? '', ws.timezone, {
                      title: `${source.title || 'Untitled'} — ${getPlatform(t.platformId)?.name} version`,
                      caption: source.caption,
                      contentType: t.contentType as ContentType,
                      platformIds: [t.platformId],
                      sourcePostId: source.id,
                      pillarId: source.pillarId,
                      campaignId: source.campaignId,
                    }),
                  })
                }
              >
                Create derivative draft
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function EvergreenQueue({ openEditor }: { openEditor: OpenEditor }) {
  const store = useStore();
  const ws = store.activeWorkspace!;
  const posts = store.data.posts.filter((p) => p.workspaceId === ws.id);
  const candidates = evergreenSuggestions(posts, ws.timezone);
  if (candidates.length === 0) return null;

  const recycle = async (post: Post, suggestedDate: string) => {
    if (!post.evergreen) return;
    // The click is the decision: count this reuse on the original, then
    // open the copy in the editor for final review.
    await store.savePost(
      {
        ...post,
        evergreen: { ...post.evergreen, reuseCount: post.evergreen.reuseCount + 1, lastUsedAt: nowIso() },
        updatedAt: nowIso(),
      },
      'Evergreen reuse counted',
    );
    openEditor({
      post: draftPost(ws.id, store.data.calendars[0]?.id ?? '', ws.timezone, {
        title: post.title ? `${post.title} (recycled)` : post.title,
        caption: post.caption,
        description: post.description,
        platformCaptions: post.platformCaptions,
        platformIds: post.platformIds,
        contentType: post.contentType,
        pillarId: post.pillarId,
        campaignId: post.campaignId,
        mediaIds: post.mediaIds,
        sourcePostId: post.id,
        scheduledAt: wallTimeToUtc(ws.timezone, suggestedDate, '09:00').toISOString(),
        status: 'scheduled',
      }),
    });
  };

  return (
    <section aria-labelledby="evergreen-h" className="rounded-xl border border-border bg-card p-5">
      <h2 id="evergreen-h" className="text-lg font-semibold">
        Evergreen recycling queue
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Suggestions only — recycling never happens automatically.
      </p>
      <ul className="mt-3 space-y-2">
        {candidates.map(({ post, daysSince, suggestedDate }) => (
          <li
            key={post.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border p-3"
          >
            <p className="text-sm">
              <span className="font-medium">{post.title || 'Untitled'}</span> — published {daysSince} days ago,
              reused {post.evergreen?.reuseCount ?? 0} of {post.evergreen?.maxReuse ?? 0} times.
            </p>
            <button
              type="button"
              className="rounded-md border border-input px-3 py-1.5 text-sm font-medium hover:bg-accent"
              onClick={() => void recycle(post, suggestedDate)}
            >
              Recycle on {suggestedDate}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function SeriesManager() {
  const store = useStore();
  const ws = store.activeWorkspace!;
  const [name, setName] = useState('');
  const [frequency, setFrequency] = useState<Series['frequency']>('weekly');
  const [weekday, setWeekday] = useState(1);
  const [platformId, setPlatformId] = useState('');
  const [genTime, setGenTime] = useState('09:00');
  const [message, setMessage] = useState('');
  const series = store.data.series.filter((s) => s.workspaceId === ws.id);

  const create = async () => {
    if (!name.trim()) return;
    await store.put('series', {
      id: uid(),
      workspaceId: ws.id,
      name: name.trim(),
      frequency,
      weekday: frequency === 'monthly' ? undefined : weekday,
      platformId: platformId || undefined,
      color: '#0ea5e9',
      createdAt: nowIso(),
    } satisfies Series);
    setName('');
  };

  const generate = async (s: Series) => {
    const today = todayInZone(ws.timezone);
    const dates: string[] = [];
    if (s.frequency === 'monthly') {
      const [y, m, d] = today.split('-').map(Number);
      for (let i = 1; i <= 4; i++) {
        const mm = m + i;
        const yy = y + Math.floor((mm - 1) / 12);
        const mo = ((mm - 1) % 12) + 1;
        dates.push(`${yy}-${String(mo).padStart(2, '0')}-${String(Math.min(d, 28)).padStart(2, '0')}`);
      }
    } else {
      const step = s.frequency === 'weekly' ? 7 : 14;
      const target = s.weekday ?? 1;
      let cursor = addDays(today, 1);
      while (weekdayOf(cursor) !== target) cursor = addDays(cursor, 1);
      for (let i = 0; i < 4; i++) {
        dates.push(cursor);
        cursor = addDays(cursor, step);
      }
    }
    let seq =
      Math.max(
        0,
        ...store.data.posts.filter((p) => p.seriesId === s.id).map((p) => p.seriesSeq ?? 0),
      ) + 1;
    for (const date of dates) {
      await store.savePost(
        draftPost(ws.id, store.data.calendars[0]?.id ?? '', ws.timezone, {
          title: `${s.name} #${seq}`,
          platformIds: s.platformId ? [s.platformId] : ws.platformIds,
          seriesId: s.id,
          seriesSeq: seq,
          scheduledAt: wallTimeToUtc(ws.timezone, date, genTime).toISOString(),
          status: 'scheduled',
        }),
        `Series "${s.name}" installment generated`,
      );
      seq += 1;
    }
    setMessage(`Created 4 scheduled drafts for "${s.name}". Open each on the calendar to add its content.`);
  };

  return (
    <section aria-labelledby="series-h" className="rounded-xl border border-border bg-card p-5">
      <h2 id="series-h" className="text-lg font-semibold">
        Recurring series
      </h2>
      <div className="mt-3 flex flex-wrap items-end gap-3">
        <label className="text-sm font-medium">
          Series name
          <input className={`${inputCls} mt-1`} value={name} onChange={(e) => setName(e.target.value)} placeholder="Monday Motivation" />
        </label>
        <label className="text-sm font-medium">
          Frequency
          <select className={`${inputCls} mt-1`} value={frequency} onChange={(e) => setFrequency(e.target.value as Series['frequency'])}>
            <option value="weekly">Weekly</option>
            <option value="biweekly">Every 2 weeks</option>
            <option value="monthly">Monthly</option>
          </select>
        </label>
        {frequency !== 'monthly' && (
          <label className="text-sm font-medium">
            Weekday
            <select className={`${inputCls} mt-1`} value={weekday} onChange={(e) => setWeekday(Number(e.target.value))}>
              {WEEKDAY_FULL.map((label, i) => (
                <option key={label} value={i}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        )}
        <label className="text-sm font-medium">
          Platform (optional)
          <select className={`${inputCls} mt-1`} value={platformId} onChange={(e) => setPlatformId(e.target.value)}>
            <option value="">All workspace platforms</option>
            {ws.platformIds.map((pid) => (
              <option key={pid} value={pid}>
                {getPlatform(pid)?.name ?? pid}
              </option>
            ))}
          </select>
        </label>
        <button type="button" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground" onClick={() => void create()}>
          Add series
        </button>
      </div>
      {series.length > 0 && (
        <ul className="mt-4 space-y-2">
          {series.map((s) => (
            <li key={s.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border p-3">
              <p className="text-sm">
                <span className="font-medium">{s.name}</span> · {s.frequency}
                {s.weekday !== undefined ? ` on ${WEEKDAY_FULL[s.weekday]}` : ''} ·{' '}
                {store.data.posts.filter((p) => p.seriesId === s.id).length} posts
              </p>
              <div className="flex items-center gap-2">
                <label className="text-xs text-muted-foreground">
                  at{' '}
                  <input type="time" className="rounded-md border border-input bg-background px-2 py-1 text-xs" value={genTime} onChange={(e) => setGenTime(e.target.value)} />
                </label>
                <button type="button" className="rounded-md border border-input px-3 py-1.5 text-sm font-medium hover:bg-accent" onClick={() => void generate(s)}>
                  Generate next 4
                </button>
                <button
                  type="button"
                  className="rounded-md border border-input px-3 py-1.5 text-sm font-medium text-destructive hover:bg-accent"
                  onClick={() => void store.remove('series', s.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {message && (
        <p className="mt-2 text-sm text-emerald-600 dark:text-emerald-400" role="status">
          {message}
        </p>
      )}
    </section>
  );
}

function BestTimes() {
  const store = useStore();
  const ws = store.activeWorkspace!;
  const computed = useMemo(
    () =>
      computeBestTimes(
        store.data.posts.filter((p) => p.workspaceId === ws.id),
        store.data.performance.filter((e) => e.workspaceId === ws.id),
      ),
    [store.data.posts, store.data.performance, ws.id],
  );
  const mySlots = store.data.bestTimeSlots.filter((s) => s.workspaceId === ws.id);
  const [slotPlatform, setSlotPlatform] = useState(ws.platformIds[0] ?? 'instagram');
  const [slotWeekday, setSlotWeekday] = useState(1);
  const [slotHour, setSlotHour] = useState(9);
  const todayWeekday = new Date().getDay();

  const addSlot = async () => {
    await store.put('bestTimeSlots', {
      id: uid(),
      workspaceId: ws.id,
      platformId: slotPlatform,
      weekday: slotWeekday,
      hour: slotHour,
      source: 'manual',
    });
  };

  return (
    <section aria-labelledby="best-h" className="rounded-xl border border-border bg-card p-5">
      <h2 id="best-h" className="text-lg font-semibold">
        Best times to post
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">{BEST_TIME_GUIDANCE_LABEL}</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {ws.platformIds.map((pid) => {
          const mine = computed.find((c) => c.platformId === pid);
          const manual = mySlots.filter((s) => s.platformId === pid);
          const guide = guidanceFor(pid, todayWeekday) ?? guidanceFor(pid, 1);
          return (
            <div key={pid} className="rounded-lg border border-border p-3">
              <p className="text-sm font-semibold">{getPlatform(pid)?.name}</p>
              {mine ? (
                <p className="mt-1 text-sm">
                  From <strong>your data</strong>: {WEEKDAYS[mine.weekday]} at {String(mine.hour).padStart(2, '0')}:00
                  (avg engagement {mine.avgEngagement}, {mine.samples} posts)
                </p>
              ) : (
                <p className="mt-1 text-sm text-muted-foreground">
                  Log performance for at least 2 posts in the same slot to unlock your personal
                  best time. Guidance for today:{' '}
                  {guide ? guide.hours.map((h) => `${String(h).padStart(2, '0')}:00`).join(', ') : '—'}
                </p>
              )}
              {manual.length > 0 && (
                <ul className="mt-1 text-sm">
                  {manual.map((s) => (
                    <li key={s.id} className="flex items-center justify-between">
                      <span>
                        Your slot: {WEEKDAYS[s.weekday]} {String(s.hour).padStart(2, '0')}:00
                      </span>
                      <button
                        type="button"
                        className="text-xs text-destructive"
                        onClick={() => void store.remove('bestTimeSlots', s.id)}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {guide && <p className="mt-1 text-xs text-muted-foreground">{guide.note}</p>}
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex flex-wrap items-end gap-3">
        <label className="text-sm font-medium">
          Platform
          <select className={`${inputCls} mt-1`} value={slotPlatform} onChange={(e) => setSlotPlatform(e.target.value)}>
            {ws.platformIds.map((pid) => (
              <option key={pid} value={pid}>
                {getPlatform(pid)?.name ?? pid}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-medium">
          Weekday
          <select className={`${inputCls} mt-1`} value={slotWeekday} onChange={(e) => setSlotWeekday(Number(e.target.value))}>
            {WEEKDAY_FULL.map((label, i) => (
              <option key={label} value={i}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-medium">
          Hour
          <input type="number" min={0} max={23} className={`${inputCls} mt-1 w-20`} value={slotHour} onChange={(e) => setSlotHour(Number(e.target.value))} />
        </label>
        <button type="button" className="rounded-md border border-input px-4 py-2 text-sm font-medium hover:bg-accent" onClick={() => void addSlot()}>
          Add my slot
        </button>
      </div>
    </section>
  );
}
