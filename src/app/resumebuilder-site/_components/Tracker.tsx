'use client';

/**
 * Job application tracker (spec §9): a five-column board backed by
 * the local store. Cards move with an explicit status control (fully
 * keyboard accessible), and each card can link the resume version
 * used for that application.
 */
import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TRACKER_STATUSES, type ResumeDoc, type TrackerItem, type TrackerStatus } from '../_lib/schema';
import { getStore, type ResumeStore } from '../_lib/db';
import { uid } from '../_lib/defaults';

function stampNew(item: Omit<TrackerItem, 'updatedAt'>): TrackerItem {
  return { ...item, updatedAt: Date.now() };
}

function stampUpdate(item: TrackerItem, partial: Partial<TrackerItem>): TrackerItem {
  return { ...item, ...partial, updatedAt: Date.now() };
}

const STATUS_LABELS: Record<TrackerStatus, string> = {
  saved: 'Saved',
  applied: 'Applied',
  interview: 'Interview',
  offer: 'Offer',
  rejected: 'Rejected',
};

export function Tracker() {
  const [store, setStore] = useState<ResumeStore | null>(null);
  const [items, setItems] = useState<TrackerItem[]>([]);
  const [resumes, setResumes] = useState<ResumeDoc[]>([]);
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [url, setUrl] = useState('');
  const [resumeId, setResumeId] = useState('');

  const refresh = useCallback(async (s: ResumeStore) => {
    setItems((await s.listTrackerItems()).sort((a, b) => b.updatedAt - a.updatedAt));
    setResumes(await s.listResumes());
  }, []);

  useEffect(() => {
    let cancelled = false;
    void getStore().then((s) => {
      if (cancelled) return;
      setStore(s);
      void refresh(s);
    });
    return () => {
      cancelled = true;
    };
  }, [refresh]);

  if (!store) return <p className="mt-8 text-muted-foreground">Opening your tracker…</p>;

  const add = async () => {
    if (!company.trim() || !role.trim()) return;
    const item = stampNew({
      schemaVersion: 1,
      id: uid('job'),
      company: company.trim(),
      role: role.trim(),
      status: 'saved',
      url: url.trim() || undefined,
      notes: '',
      resumeId: resumeId || undefined,
    });
    await store.putTrackerItem(item);
    setCompany('');
    setRole('');
    setUrl('');
    void refresh(store);
  };

  const update = async (item: TrackerItem, partial: Partial<TrackerItem>) => {
    await store.putTrackerItem(stampUpdate(item, partial));
    void refresh(store);
  };

  return (
    <div className="mt-8 space-y-6">
      <form
        className="flex flex-wrap items-end gap-2 rounded-lg border bg-card p-3"
        onSubmit={(e) => {
          e.preventDefault();
          void add();
        }}
      >
        <label className="block flex-1 space-y-1" style={{ minWidth: 160 }}>
          <span className="text-sm font-medium">Company</span>
          <Input value={company} onChange={(e) => setCompany(e.target.value)} required />
        </label>
        <label className="block flex-1 space-y-1" style={{ minWidth: 160 }}>
          <span className="text-sm font-medium">Role</span>
          <Input value={role} onChange={(e) => setRole(e.target.value)} required />
        </label>
        <label className="block flex-1 space-y-1" style={{ minWidth: 160 }}>
          <span className="text-sm font-medium">Posting link (optional)</span>
          <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://…" inputMode="url" />
        </label>
        <label className="block space-y-1">
          <span className="text-sm font-medium">Resume used</span>
          <select
            value={resumeId}
            onChange={(e) => setResumeId(e.target.value)}
            className="min-h-11 rounded-md border border-input bg-background px-2 py-1 text-sm"
          >
            <option value="">Not linked</option>
            {resumes.map((r) => (
              <option key={r.id} value={r.id}>
                {r.meta.title}
              </option>
            ))}
          </select>
        </label>
        <Button type="submit">Add application</Button>
      </form>

      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-5">
        {TRACKER_STATUSES.map((status) => (
          <section key={status} aria-label={STATUS_LABELS[status]} className="rounded-lg bg-muted/50 p-2">
            <h2 className="px-1 py-1 text-sm font-semibold">
              {STATUS_LABELS[status]} ({items.filter((i) => i.status === status).length})
            </h2>
            <div className="space-y-2">
              {items
                .filter((i) => i.status === status)
                .map((item) => (
                  <article key={item.id} className="space-y-2 rounded-md border bg-card p-3 text-sm">
                    <p className="font-semibold">{item.role}</p>
                    <p className="text-muted-foreground">{item.company}</p>
                    {item.url ? (
                      <a href={item.url} target="_blank" rel="noreferrer" className="text-primary underline">
                        Job posting
                      </a>
                    ) : null}
                    {item.resumeId ? (
                      <p className="text-xs text-muted-foreground">
                        Resume: {resumes.find((r) => r.id === item.resumeId)?.meta.title ?? 'deleted resume'}
                      </p>
                    ) : null}
                    <label className="block space-y-1">
                      <span className="text-xs font-medium">Applied date</span>
                      <input
                        type="date"
                        value={item.appliedDate ?? ''}
                        onChange={(e) => void update(item, { appliedDate: e.target.value || undefined })}
                        className="min-h-11 w-full rounded-md border border-input bg-background px-2 py-1 text-sm"
                      />
                    </label>
                    <label className="block space-y-1">
                      <span className="text-xs font-medium">Follow up on</span>
                      <input
                        type="date"
                        value={item.followUpDate ?? ''}
                        onChange={(e) => void update(item, { followUpDate: e.target.value || undefined })}
                        className="min-h-11 w-full rounded-md border border-input bg-background px-2 py-1 text-sm"
                      />
                    </label>
                    <label className="block space-y-1">
                      <span className="text-xs font-medium">Notes</span>
                      <textarea
                        value={item.notes}
                        onChange={(e) => void update(item, { notes: e.target.value })}
                        rows={2}
                        className="w-full rounded-md border border-input bg-background px-2 py-1 text-sm"
                      />
                    </label>
                    <div className="flex items-center gap-2">
                      <label className="sr-only" htmlFor={`status-${item.id}`}>
                        Move {item.role} at {item.company}
                      </label>
                      <select
                        id={`status-${item.id}`}
                        value={item.status}
                        onChange={(e) => void update(item, { status: e.target.value as TrackerStatus })}
                        className="min-h-11 flex-1 rounded-md border border-input bg-background px-2 py-1 text-sm"
                      >
                        {TRACKER_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            Move to {STATUS_LABELS[s]}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        aria-label={`Remove ${item.role} at ${item.company}`}
                        className="min-h-11 rounded-md px-2 text-sm text-destructive"
                        onClick={() => {
                          void store.deleteTrackerItem(item.id).then(() => refresh(store));
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </article>
                ))}
              {items.filter((i) => i.status === status).length === 0 ? (
                <p className="px-1 py-2 text-xs text-muted-foreground">Nothing here yet.</p>
              ) : null}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
