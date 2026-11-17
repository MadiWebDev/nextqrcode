'use client';

import { useEffect, useMemo, useState } from 'react';
import { useStore } from '../_lib/store';
import {
  decodeSharePayload,
  decryptSharePayload,
  isEncryptedShare,
  type SharePayload,
} from '../_lib/share';
import { downloadText, postsToCsv, postsToIcs } from '../_lib/exporters';
import { getPlatform } from '../_lib/platforms';
import { toDateStrInZone } from '../_lib/tz';
import { nowIso, uid, type Post } from '../_lib/types';

const inputCls =
  'w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground';

/**
 * Read-only viewer for fragment share links. The payload never leaves
 * the visitor's browser — the fragment is not sent to any server.
 */
export default function ShareViewer() {
  const store = useStore();
  const [payload, setPayload] = useState<SharePayload | null>(null);
  const [error, setError] = useState('');
  const [needsPassword, setNeedsPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [encoded, setEncoded] = useState('');
  const [copied, setCopied] = useState('');

  useEffect(() => {
    void (async () => {
      const hash = window.location.hash.replace(/^#/, '');
      if (!hash) {
        setError('This link has no calendar data in it. Ask the sender for a complete link.');
        return;
      }
      setEncoded(hash);
      if (isEncryptedShare(hash)) {
        setNeedsPassword(true);
        return;
      }
      try {
        setPayload(await decodeSharePayload(hash));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not read this share link.');
      }
    })();
  }, []);

  const unlock = async () => {
    try {
      const decoded = await decryptSharePayload(encoded, password);
      setPayload(decoded);
      setNeedsPassword(false);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Wrong password.');
    }
  };

  const grouped = useMemo(() => {
    if (!payload) return [];
    const map = new Map<string, Post[]>();
    for (const p of payload.posts) {
      if (!p.scheduledAt) continue;
      const date = toDateStrInZone(payload.timezone, new Date(p.scheduledAt));
      map.set(date, [...(map.get(date) ?? []), p]);
    }
    return [...map.entries()].sort((a, b) => (a[0] < b[0] ? -1 : 1));
  }, [payload]);

  const copyToMine = async () => {
    if (!payload || !store.activeWorkspace) return;
    const ws = store.activeWorkspace;
    let count = 0;
    for (const p of payload.posts) {
      const copy: Post = {
        ...p,
        id: uid(),
        workspaceId: ws.id,
        calendarId: store.data.calendars[0]?.id ?? '',
        status: 'draft',
        internalNotes: `Copied from a shared calendar (${payload.workspaceName}).`,
        createdAt: nowIso(),
        updatedAt: nowIso(),
      };
      await store.savePost(copy, 'Copied from shared calendar');
      count += 1;
    }
    setCopied(
      `Copied ${count} post${count === 1 ? '' : 's'} into your workspace "${ws.name}" as drafts. Open the workspace to review them.`,
    );
  };

  if (needsPassword && !payload) {
    return (
      <main className="mx-auto max-w-md px-4 py-16">
        <h1 className="text-xl font-bold">This shared calendar is encrypted</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter the password the sender gave you. It is checked only in your browser — nothing is
          sent anywhere.
        </p>
        <label className="mt-4 block text-sm font-medium">
          Password
          <input
            type="password"
            className={`${inputCls} mt-1`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') void unlock();
            }}
          />
        </label>
        {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400" role="alert">{error}</p>}
        <button
          type="button"
          className="mt-3 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          onClick={() => void unlock()}
        >
          Unlock calendar
        </button>
      </main>
    );
  }

  if (error && !payload) {
    return (
      <main className="mx-auto max-w-md px-4 py-16">
        <h1 className="text-xl font-bold">We couldn&rsquo;t open this link</h1>
        <p className="mt-2 text-sm text-muted-foreground" role="alert">
          {error}
        </p>
      </main>
    );
  }

  if (!payload) {
    return (
      <main className="mx-auto max-w-md px-4 py-16" aria-busy="true">
        <p className="text-muted-foreground">Reading the shared calendar…</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        Read-only shared calendar
      </p>
      <h1 className="mt-1 text-2xl font-bold">{payload.workspaceName}</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {payload.posts.length} posts · times in {payload.timezone} · shared{' '}
        {new Date(payload.sharedAt).toLocaleDateString()}. This page is not indexed and the data
        lives only in this link — nothing was uploaded.
      </p>
      <div className="mt-4 flex flex-wrap gap-2 print:hidden">
        <button
          type="button"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          onClick={() => void copyToMine()}
        >
          Copy to my calendar
        </button>
        <button
          type="button"
          className="rounded-md border border-input px-4 py-2 text-sm font-medium hover:bg-accent"
          onClick={() => window.print()}
        >
          Print
        </button>
        <button
          type="button"
          className="rounded-md border border-input px-4 py-2 text-sm font-medium hover:bg-accent"
          onClick={() =>
            downloadText('shared-calendar.ics', postsToIcs(payload.posts, payload.workspaceName), 'text/calendar')
          }
        >
          Export ICS
        </button>
        <button
          type="button"
          className="rounded-md border border-input px-4 py-2 text-sm font-medium hover:bg-accent"
          onClick={() =>
            downloadText('shared-calendar.csv', postsToCsv(payload.posts, { campaign: (id) => id, pillar: (id) => id }), 'text/csv')
          }
        >
          Export CSV
        </button>
      </div>
      {copied && (
        <p className="mt-3 text-sm text-emerald-600 dark:text-emerald-400" role="status">
          {copied}
        </p>
      )}
      <div className="mt-6 space-y-6">
        {grouped.map(([date, posts]) => (
          <section key={date} aria-label={date}>
            <h2 className="text-sm font-semibold text-muted-foreground">{date}</h2>
            <ul className="mt-2 space-y-2">
              {posts.map((p) => (
                <li key={p.id} className="rounded-lg border border-border bg-card p-4">
                  <p className="font-medium">{p.title || 'Untitled'}</p>
                  {p.caption && <p className="mt-1 text-sm whitespace-pre-wrap">{p.caption}</p>}
                  <p className="mt-2 text-xs text-muted-foreground">
                    {p.platformIds.map((id) => getPlatform(id)?.name ?? id).join(' · ')} · {p.status} ·{' '}
                    {p.contentType}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        ))}
        {grouped.length === 0 && <p className="text-sm text-muted-foreground">No scheduled posts in this share.</p>}
      </div>
    </main>
  );
}
