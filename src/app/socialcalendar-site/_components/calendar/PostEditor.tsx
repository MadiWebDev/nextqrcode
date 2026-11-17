'use client';

import { useEffect, useMemo, useState } from 'react';
import { getPlatform } from '../../_lib/platforms';
import { countCaption, validateCaption } from '../../_lib/captions';
import { getKv } from '../../_lib/kv';
import { findBannedWords } from '../../_lib/utm';
import { useStore } from '../../_lib/store';
import { MediaManager } from '../MediaManager';
import { PlatformPreviews } from '../PlatformPreviews';
import { toDateStrInZone, toTimeStrInZone, wallTimeToUtc } from '../../_lib/tz';
import {
  CONTENT_TYPES,
  POST_STATUSES,
  PRIORITIES,
  nowIso,
  uid,
  type ChecklistItemState,
  type Post,
  type RecurrenceRule,
} from '../../_lib/types';

export interface EditorSeed {
  date?: string;
  hour?: number;
  post?: Post;
}

function blankPost(workspaceId: string, calendarId: string, timezone: string): Post {
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
  };
}

export function PostEditor({
  seed,
  onClose,
}: {
  seed: EditorSeed;
  onClose: () => void;
}) {
  const store = useStore();
  const ws = store.activeWorkspace!;
  const [draft, setDraft] = useState<Post>(() => {
    if (seed.post) return { ...seed.post };
    const base = blankPost(ws.id, store.data.calendars[0]?.id ?? '', ws.timezone);
    if (seed.date) {
      const time = `${String(seed.hour ?? 9).padStart(2, '0')}:00`;
      base.scheduledAt = wallTimeToUtc(ws.timezone, seed.date, time).toISOString();
      base.status = 'scheduled';
    }
    return base;
  });
  const [dateStr, setDateStr] = useState<string>(() =>
    draft.scheduledAt ? toDateStrInZone(draft.timezone, new Date(draft.scheduledAt)) : '',
  );
  const [timeStr, setTimeStr] = useState<string>(() =>
    draft.scheduledAt ? toTimeStrInZone(draft.timezone, new Date(draft.scheduledAt)) : '09:00',
  );
  const [tagInput, setTagInput] = useState('');
  const [activeCaptionPlatform, setActiveCaptionPlatform] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const isNew = !seed.post;
  const revisions = useMemo(
    () =>
      store.data.revisions
        .filter((r) => r.postId === draft.id)
        .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)),
    [store.data.revisions, draft.id],
  );
  const comments = useMemo(
    () =>
      store.data.comments
        .filter((c) => c.postId === draft.id)
        .sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1)),
    [store.data.comments, draft.id],
  );
  const [commentBody, setCommentBody] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('');
  const [bannedWords, setBannedWords] = useState<string[]>([]);

  useEffect(() => {
    if (!store.repo) return;
    void getKv<string[]>(store.repo, ws.id, 'banned-words').then((words) =>
      setBannedWords(words ?? []),
    );
  }, [store.repo, ws.id]);

  const bannedHits = useMemo(() => {
    const texts = [draft.caption, ...Object.values(draft.platformCaptions)];
    const hits = new Set<string>();
    for (const t of texts) for (const w of findBannedWords(t, bannedWords)) hits.add(w);
    return [...hits];
  }, [draft.caption, draft.platformCaptions, bannedWords]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const set = <K extends keyof Post>(key: K, value: Post[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const save = async () => {
    if (!draft.title.trim() && !draft.caption.trim()) {
      setError('Give the post a title or a caption before saving.');
      return;
    }
    let scheduledAt: string | null = null;
    if (dateStr) {
      scheduledAt = wallTimeToUtc(draft.timezone, dateStr, timeStr || '09:00').toISOString();
    }
    const post: Post = {
      ...draft,
      scheduledAt,
      status: scheduledAt && draft.status === 'draft' ? 'scheduled' : draft.status,
      updatedAt: nowIso(),
    };
    await store.savePost(post, isNew ? 'Created' : 'Edited');
    await store.logActivity('post', post.id, isNew ? 'create' : 'update', post.title || 'Untitled');
    onClose();
  };

  const captionFor = (platformId: string) =>
    draft.platformCaptions[platformId] ?? draft.caption;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label={isNew ? 'Create post' : 'Edit post'}
    >
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl bg-background p-4 shadow-xl sm:rounded-2xl sm:p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">{isNew ? 'Create post' : 'Edit post'}</h2>
          <button type="button" onClick={onClose} aria-label="Close editor" className="rounded-md border border-border px-2 py-1">
            ✕
          </button>
        </div>

        {draft.recurrence && (
          <p className="mt-2 rounded bg-muted px-3 py-2 text-xs text-muted-foreground">
            This is a recurring series. Editing here updates the series master; every
            occurrence follows. Occurrence-level exceptions are not supported.
          </p>
        )}
        {error && (
          <p role="alert" className="mt-2 rounded bg-red-100 px-3 py-2 text-sm text-red-900 dark:bg-red-900/40 dark:text-red-100">
            {error}
          </p>
        )}

        <div className="mt-4 space-y-4">
          <label className="block text-sm">
            <span className="mb-1 block font-medium">Title</span>
            <input
              value={draft.title}
              onChange={(e) => set('title', e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
              placeholder="What is this post about?"
            />
          </label>

          <div>
            <span className="mb-1 block text-sm font-medium">Caption</span>
            {draft.platformIds.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-1" role="tablist" aria-label="Caption per platform">
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeCaptionPlatform === ''}
                  onClick={() => setActiveCaptionPlatform('')}
                  className={`rounded-full border px-2 py-0.5 text-xs ${activeCaptionPlatform === '' ? 'border-primary bg-primary/10 font-medium' : 'border-border'}`}
                >
                  Master
                </button>
                {draft.platformIds.map((pid) => (
                  <button
                    key={pid}
                    type="button"
                    role="tab"
                    aria-selected={activeCaptionPlatform === pid}
                    onClick={() => setActiveCaptionPlatform(pid)}
                    className={`rounded-full border px-2 py-0.5 text-xs ${activeCaptionPlatform === pid ? 'border-primary bg-primary/10 font-medium' : 'border-border'}`}
                  >
                    {getPlatform(pid)?.name ?? pid}
                    {draft.platformCaptions[pid] ? ' •' : ''}
                  </button>
                ))}
              </div>
            )}
            <textarea
              value={activeCaptionPlatform ? captionFor(activeCaptionPlatform) : draft.caption}
              onChange={(e) => {
                if (!activeCaptionPlatform) set('caption', e.target.value);
                else
                  set('platformCaptions', {
                    ...draft.platformCaptions,
                    [activeCaptionPlatform]: e.target.value,
                  });
              }}
              rows={5}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
              placeholder="Write the caption…"
              aria-label={activeCaptionPlatform ? `Caption for ${getPlatform(activeCaptionPlatform)?.name}` : 'Master caption'}
            />
            {activeCaptionPlatform &&
              (() => {
                const spec = getPlatform(activeCaptionPlatform);
                if (!spec) return null;
                const counts = countCaption(captionFor(activeCaptionPlatform), spec);
                const validation = validateCaption(captionFor(activeCaptionPlatform), spec);
                return (
                  <div className="mt-1 text-xs text-muted-foreground" aria-live="polite">
                    <span className={counts.overLimit ? 'font-semibold text-red-600 dark:text-red-400' : ''}>
                      {counts.weighted} / {spec.charLimit || '—'} characters
                    </span>{' '}
                    · {counts.hashtags} hashtags · {counts.urls} links · {counts.emojis} emoji
                    {validation.warnings.map((w) => (
                      <span key={w} className="block text-amber-600 dark:text-amber-400">{w}</span>
                    ))}
                    {validation.errors.map((w) => (
                      <span key={w} className="block text-red-600 dark:text-red-400">{w}</span>
                    ))}
                    {draft.platformCaptions[activeCaptionPlatform] !== undefined && (
                      <button
                        type="button"
                        className="mt-1 underline"
                        onClick={() => {
                          const next = { ...draft.platformCaptions };
                          delete next[activeCaptionPlatform];
                          set('platformCaptions', next);
                        }}
                      >
                        Remove override — use master caption
                      </button>
                    )}
                  </div>
                );
              })()}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-1 block font-medium">Status</span>
              <select
                value={draft.status}
                onChange={(e) => set('status', e.target.value as Post['status'])}
                className="w-full rounded-md border border-input bg-background px-2 py-2"
              >
                {POST_STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-medium">Content type</span>
              <select
                value={draft.contentType}
                onChange={(e) => set('contentType', e.target.value as Post['contentType'])}
                className="w-full rounded-md border border-input bg-background px-2 py-2"
              >
                {CONTENT_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-medium">Date</span>
              <input
                type="date"
                value={dateStr}
                onChange={(e) => setDateStr(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-2 py-2"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-medium">Time ({draft.timezone})</span>
              <input
                type="time"
                value={timeStr}
                onChange={(e) => setTimeStr(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-2 py-2"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-medium">Campaign</span>
              <select
                value={draft.campaignId ?? ''}
                onChange={(e) => set('campaignId', e.target.value || undefined)}
                className="w-full rounded-md border border-input bg-background px-2 py-2"
              >
                <option value="">None</option>
                {store.data.campaigns.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-medium">Content pillar</span>
              <select
                value={draft.pillarId ?? ''}
                onChange={(e) => set('pillarId', e.target.value || undefined)}
                className="w-full rounded-md border border-input bg-background px-2 py-2"
              >
                <option value="">None</option>
                {store.data.pillars.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-medium">Priority</span>
              <select
                value={draft.priority}
                onChange={(e) => set('priority', e.target.value as Post['priority'])}
                className="w-full rounded-md border border-input bg-background px-2 py-2"
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-medium">Assignee label</span>
              <input
                value={draft.assigneeLabel}
                onChange={(e) => set('assigneeLabel', e.target.value)}
                className="w-full rounded-md border border-input bg-background px-2 py-2"
                placeholder="e.g. Ayesha (local note only)"
              />
            </label>
          </div>

          {bannedHits.length > 0 && (
            <p role="alert" className="rounded bg-amber-100 px-3 py-2 text-sm text-amber-900 dark:bg-amber-900/40 dark:text-amber-100">
              This caption contains word{bannedHits.length > 1 ? 's' : ''} from your banned
              list: {bannedHits.join(', ')}. Review before publishing.
            </p>
          )}

          {store.data.hashtagGroups.length > 0 && (
            <div className="text-sm">
              <span className="mb-1 block font-medium">Insert hashtag group</span>
              <div className="flex flex-wrap gap-1">
                {store.data.hashtagGroups.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    className="rounded-full border border-border px-2.5 py-1 text-xs"
                    onClick={() => {
                      const tags = g.tags.map((t) => `#${t}`).join(' ');
                      const target = activeCaptionPlatform;
                      if (!target) {
                        set('caption', draft.caption ? `${draft.caption}\n${tags}` : tags);
                      } else {
                        set('platformCaptions', {
                          ...draft.platformCaptions,
                          [target]: captionFor(target)
                            ? `${captionFor(target)}\n${tags}`
                            : tags,
                        });
                      }
                    }}
                  >
                    {g.name} ({g.tags.length})
                  </button>
                ))}
              </div>
            </div>
          )}

          <MediaManager mediaIds={draft.mediaIds} onChange={(ids) => set('mediaIds', ids)} />

          <fieldset>
            <legend className="text-sm font-medium">Platforms</legend>
            <div className="mt-1 flex flex-wrap gap-1">
              {ws.platformIds.map((pid) => {
                const on = draft.platformIds.includes(pid);
                return (
                  <button
                    key={pid}
                    type="button"
                    aria-pressed={on}
                    onClick={() =>
                      set(
                        'platformIds',
                        on
                          ? draft.platformIds.filter((x) => x !== pid)
                          : [...draft.platformIds, pid],
                      )
                    }
                    className={`rounded-full border px-2.5 py-1 text-xs ${on ? 'border-primary bg-primary/10 font-medium' : 'border-border text-muted-foreground'}`}
                  >
                    {getPlatform(pid)?.name ?? pid}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="text-sm">
            <span className="mb-1 block font-medium">Tags</span>
            <div className="flex flex-wrap gap-1">
              {draft.tags.map((t) => (
                <button
                  key={t}
                  type="button"
                  className="rounded-full bg-muted px-2 py-0.5 text-xs"
                  onClick={() => set('tags', draft.tags.filter((x) => x !== t))}
                  aria-label={`Remove tag ${t}`}
                >
                  {t} ✕
                </button>
              ))}
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && tagInput.trim()) {
                    e.preventDefault();
                    set('tags', [...draft.tags, tagInput.trim()]);
                    setTagInput('');
                  }
                }}
                placeholder="Add tag + Enter"
                className="rounded-md border border-input bg-background px-2 py-1 text-xs"
              />
            </div>
          </div>

          <fieldset className="text-sm">
            <legend className="font-medium">Repeat</legend>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <select
                value={draft.recurrence?.freq ?? ''}
                onChange={(e) => {
                  const freq = e.target.value as RecurrenceRule['freq'] | '';
                  set(
                    'recurrence',
                    freq ? { freq, interval: draft.recurrence?.interval ?? 1 } : undefined,
                  );
                }}
                className="rounded-md border border-input bg-background px-2 py-2"
                aria-label="Recurrence frequency"
              >
                <option value="">Does not repeat</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
              {draft.recurrence && (
                <>
                  <label>
                    Every{' '}
                    <input
                      type="number"
                      min={1}
                      max={52}
                      value={draft.recurrence.interval}
                      onChange={(e) =>
                        set('recurrence', {
                          ...draft.recurrence!,
                          interval: Math.max(1, Number(e.target.value) || 1),
                        })
                      }
                      className="w-16 rounded-md border border-input bg-background px-2 py-1"
                    />
                  </label>
                  <label>
                    Until{' '}
                    <input
                      type="date"
                      value={draft.recurrence.until ?? ''}
                      onChange={(e) =>
                        set('recurrence', {
                          ...draft.recurrence!,
                          until: e.target.value || undefined,
                        })
                      }
                      className="rounded-md border border-input bg-background px-2 py-1"
                    />
                  </label>
                </>
              )}
            </div>
          </fieldset>

          <ChecklistEditor
            items={draft.checklist}
            onChange={(items) => set('checklist', items)}
          />

          <label className="block text-sm">
            <span className="mb-1 block font-medium">Internal notes (never shared by default)</span>
            <textarea
              value={draft.internalNotes}
              onChange={(e) => set('internalNotes', e.target.value)}
              rows={2}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
            />
          </label>

          <section aria-label="Platform previews">
            <h3 className="mb-2 text-sm font-semibold">Platform previews</h3>
            <PlatformPreviews post={draft} />
          </section>

          {!isNew && (
            <section aria-label="Review and history" className="space-y-3 border-t border-border pt-3">
              <div>
                <h3 className="text-sm font-semibold">Reviewer notes (local workspace only)</h3>
                <ul className="mt-2 space-y-2">
                  {comments.map((c) => (
                    <li key={c.id} className="rounded bg-muted px-3 py-2 text-sm">
                      <span className="font-medium">{c.authorLabel || 'Reviewer'}</span>{' '}
                      <span className="text-xs text-muted-foreground">
                        {c.kind} · {new Date(c.createdAt).toLocaleString()}
                      </span>
                      <p>{c.body}</p>
                    </li>
                  ))}
                  {comments.length === 0 && (
                    <li className="text-sm text-muted-foreground">No comments yet.</li>
                  )}
                </ul>
                <div className="mt-2 flex flex-wrap gap-2">
                  <input
                    value={commentAuthor}
                    onChange={(e) => setCommentAuthor(e.target.value)}
                    placeholder="Your label (e.g. Manager)"
                    aria-label="Reviewer label"
                    className="rounded-md border border-input bg-background px-2 py-1.5 text-sm"
                  />
                  <input
                    value={commentBody}
                    onChange={(e) => setCommentBody(e.target.value)}
                    placeholder="Add a comment…"
                    aria-label="Comment text"
                    className="min-w-52 flex-1 rounded-md border border-input bg-background px-2 py-1.5 text-sm"
                  />
                  <button
                    type="button"
                    disabled={!commentBody.trim()}
                    className="rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-40"
                    onClick={async () => {
                      await store.put('comments', {
                        id: uid(),
                        workspaceId: ws.id,
                        postId: draft.id,
                        authorLabel: commentAuthor,
                        body: commentBody.trim(),
                        kind: 'comment',
                        createdAt: nowIso(),
                      });
                      setCommentBody('');
                    }}
                  >
                    Comment
                  </button>
                  <button
                    type="button"
                    disabled={!commentBody.trim() && draft.status !== 'in-review'}
                    className="rounded-md border border-emerald-500 px-3 py-1.5 text-sm text-emerald-700 disabled:opacity-40 dark:text-emerald-300"
                    onClick={async () => {
                      await store.put('comments', {
                        id: uid(),
                        workspaceId: ws.id,
                        postId: draft.id,
                        authorLabel: commentAuthor,
                        body: commentBody.trim() || 'Approved',
                        kind: 'approval',
                        createdAt: nowIso(),
                      });
                      setCommentBody('');
                      set('status', 'approved');
                    }}
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    disabled={!commentBody.trim()}
                    className="rounded-md border border-red-400 px-3 py-1.5 text-sm text-red-700 disabled:opacity-40 dark:text-red-300"
                    onClick={async () => {
                      await store.put('comments', {
                        id: uid(),
                        workspaceId: ws.id,
                        postId: draft.id,
                        authorLabel: commentAuthor,
                        body: commentBody.trim(),
                        kind: 'change-request',
                        createdAt: nowIso(),
                      });
                      setCommentBody('');
                      set('status', 'changes-requested');
                    }}
                  >
                    Request changes
                  </button>
                </div>
              </div>
              {revisions.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold">Revision history</h3>
                  <ul className="mt-1 space-y-1 text-sm text-muted-foreground">
                    {revisions.slice(0, 8).map((r) => (
                      <li key={r.id} className="flex items-center gap-2">
                        <span>
                          {new Date(r.createdAt).toLocaleString()} — {r.label}: “
                          {r.snapshot.title || 'Untitled'}”
                        </span>
                        <button
                          type="button"
                          className="underline"
                          onClick={() => setDraft({ ...r.snapshot })}
                        >
                          Restore this version
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          )}

          <div className="flex flex-wrap items-center gap-2 border-t border-border pt-4">
            <button
              type="button"
              onClick={() => void save()}
              className="rounded-md bg-primary px-5 py-2.5 font-medium text-primary-foreground"
            >
              {isNew ? 'Create post' : 'Save changes'}
            </button>
            {!isNew && (
              <>
                <button
                  type="button"
                  className="rounded-md border border-border px-4 py-2.5"
                  onClick={async () => {
                    const copy: Post = {
                      ...draft,
                      id: uid(),
                      title: `${draft.title} (copy)`,
                      createdAt: nowIso(),
                      updatedAt: nowIso(),
                    };
                    await store.savePost(copy, 'Duplicated');
                    onClose();
                  }}
                >
                  Duplicate
                </button>
                <button
                  type="button"
                  className="rounded-md border border-red-400 px-4 py-2.5 text-red-700 dark:text-red-300"
                  onClick={async () => {
                    if (window.confirm('Delete this post? You can undo right after.')) {
                      await store.deletePost(draft.id);
                      onClose();
                    }
                  }}
                >
                  Delete
                </button>
              </>
            )}
            <button type="button" onClick={onClose} className="rounded-md border border-border px-4 py-2.5">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChecklistEditor({
  items,
  onChange,
}: {
  items: ChecklistItemState[];
  onChange: (items: ChecklistItemState[]) => void;
}) {
  const store = useStore();
  const [newItem, setNewItem] = useState('');
  return (
    <fieldset className="text-sm">
      <legend className="font-medium">Checklist</legend>
      <ul className="mt-1 space-y-1">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={item.done}
              onChange={(e) =>
                onChange(items.map((it, j) => (j === i ? { ...it, done: e.target.checked } : it)))
              }
              aria-label={item.label}
            />
            <span className={item.done ? 'line-through opacity-60' : ''}>{item.label}</span>
            <button
              type="button"
              aria-label={`Remove checklist item ${item.label}`}
              className="text-muted-foreground hover:text-foreground"
              onClick={() => onChange(items.filter((_, j) => j !== i))}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-2 flex flex-wrap gap-2">
        <input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="New checklist item"
          aria-label="New checklist item"
          className="rounded-md border border-input bg-background px-2 py-1.5 text-sm"
        />
        <button
          type="button"
          disabled={!newItem.trim()}
          className="rounded-md border border-border px-3 py-1.5 disabled:opacity-40"
          onClick={() => {
            onChange([...items, { label: newItem.trim(), done: false }]);
            setNewItem('');
          }}
        >
          Add item
        </button>
        {store.data.checklistTemplates.map((t) => (
          <button
            key={t.id}
            type="button"
            className="rounded-md border border-border px-3 py-1.5"
            onClick={() =>
              onChange([...items, ...t.items.map((label) => ({ label, done: false }))])
            }
          >
            Apply “{t.name}”
          </button>
        ))}
      </div>
    </fieldset>
  );
}
