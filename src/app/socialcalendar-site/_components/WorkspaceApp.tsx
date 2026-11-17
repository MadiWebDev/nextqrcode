'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { CalendarApp, type CalendarView } from './calendar/CalendarApp';
import { PostEditor, type EditorSeed } from './calendar/PostEditor';
import { LibraryPanel } from './LibraryPanel';
import { ManagePanel } from './ManagePanel';
import PlatformSpecs from './PlatformSpecs';
import IntelligencePanel from './IntelligencePanel';
import HolidaysPanel from './HolidaysPanel';
import RulesPanel from './RulesPanel';
import AnalyticsPanel from './AnalyticsPanel';
import SharePanel from './SharePanel';
import NotificationsPanel, { ReminderEngine } from './NotificationsPanel';
import LocaleProvider, { useLocale } from './LocaleProvider';
import CommandPalette from './CommandPalette';
import Onboarding from './Onboarding';
import { LOCALES, type Locale } from '../_lib/i18n';
import { useStore } from '../_lib/store';
import { PLATFORMS } from '../_lib/platforms';
import {
  buildBackup,
  findDuplicateWorkspaces,
  parseBackup,
  remapBackupIds,
} from '../_lib/backup';
import type { BackupFile, Workspace } from '../_lib/types';

type Tab = 'calendar' | 'manage' | 'library' | 'intelligence' | 'analytics' | 'overview' | 'workspaces' | 'data';

function allTimeZones(): string[] {
  try {
    return Intl.supportedValuesOf('timeZone');
  } catch {
    return ['UTC', 'Asia/Karachi', 'America/New_York', 'Europe/London', 'Australia/Sydney'];
  }
}

function download(filename: string, text: string) {
  const blob = new Blob([text], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function SaveIndicator() {
  const { saveState, lastSavedAt, persistent } = useStore();
  if (!persistent) {
    return (
      <span className="rounded bg-amber-100 px-2 py-1 text-xs font-medium text-amber-900 dark:bg-amber-900/40 dark:text-amber-100">
        Temporary storage — data will be lost when this tab closes
      </span>
    );
  }
  const label =
    saveState === 'saving'
      ? 'Saving…'
      : saveState === 'error'
        ? 'Not saved — changes could not be written'
        : lastSavedAt
          ? `Saved ${new Date(lastSavedAt).toLocaleTimeString()}`
          : 'Saved locally';
  return (
    <span
      className={`rounded px-2 py-1 text-xs font-medium ${
        saveState === 'error'
          ? 'bg-red-100 text-red-900 dark:bg-red-900/40 dark:text-red-100'
          : 'bg-muted text-muted-foreground'
      }`}
      role="status"
    >
      {label}
    </span>
  );
}

function Overview() {
  const { data, activeWorkspace } = useStore();
  const upcoming = useMemo(
    () =>
      data.posts
        .filter((p) => p.scheduledAt && p.scheduledAt >= new Date().toISOString())
        .sort((a, b) => (a.scheduledAt! < b.scheduledAt! ? -1 : 1))
        .slice(0, 8),
    [data.posts],
  );
  const byStatus = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of data.posts) counts.set(p.status, (counts.get(p.status) ?? 0) + 1);
    return [...counts.entries()];
  }, [data.posts]);
  if (!activeWorkspace) return null;
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-border p-4">
          <p className="text-2xl font-bold">{data.posts.length}</p>
          <p className="text-sm text-muted-foreground">Posts in {activeWorkspace.name}</p>
        </div>
        <div className="rounded-lg border border-border p-4">
          <p className="text-2xl font-bold">{data.campaigns.length}</p>
          <p className="text-sm text-muted-foreground">Campaigns</p>
        </div>
        <div className="rounded-lg border border-border p-4">
          <p className="text-2xl font-bold">{data.ideas.length}</p>
          <p className="text-sm text-muted-foreground">Ideas in the bank</p>
        </div>
      </div>
      {byStatus.length > 0 && (
        <div>
          <h3 className="font-semibold">Posts by status</h3>
          <ul className="mt-2 flex flex-wrap gap-2">
            {byStatus.map(([status, n]) => (
              <li key={status} className="rounded-full bg-muted px-3 py-1 text-sm">
                {status}: {n}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div>
        <h3 className="font-semibold">Coming up</h3>
        {upcoming.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">
            Nothing scheduled yet. Import a backup or a CSV plan, or wait for the
            calendar editor — posts you create will appear here.
          </p>
        ) : (
          <ul className="mt-2 divide-y divide-border rounded-lg border border-border">
            {upcoming.map((p) => (
              <li key={p.id} className="flex items-center justify-between px-4 py-2 text-sm">
                <span className="font-medium">{p.title || '(untitled)'}</span>
                <span className="text-muted-foreground">
                  {new Date(p.scheduledAt!).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
      {data.activity.length > 0 && (
        <div>
          <h3 className="font-semibold">Recent activity</h3>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            {[...data.activity]
              .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
              .slice(0, 10)
              .map((a) => (
                <li key={a.id}>
                  {new Date(a.createdAt).toLocaleString()} — {a.action}: {a.detail}
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function WorkspaceManager() {
  const store = useStore();
  const [newName, setNewName] = useState('');
  const zones = useMemo(() => allTimeZones(), []);
  const ws = store.activeWorkspace;
  if (!ws) return null;
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end gap-2">
        <label className="text-sm">
          <span className="mb-1 block font-medium">New workspace</span>
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="e.g. Client A"
            className="rounded-md border border-input bg-background px-3 py-2"
          />
        </label>
        <button
          type="button"
          disabled={!newName.trim()}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
          onClick={async () => {
            await store.createWorkspace(newName.trim(), ws.timezone);
            setNewName('');
          }}
        >
          Create workspace
        </button>
      </div>

      <div className="space-y-4">
        {store.workspaces.map((w) => (
          <article key={w.id} className="rounded-lg border border-border p-4">
            <div className="flex flex-wrap items-center gap-2">
              <input
                value={w.name}
                aria-label={`Name of workspace ${w.name}`}
                onChange={(e) =>
                  void store.updateWorkspace({ ...w, name: e.target.value })
                }
                className="min-w-40 flex-1 rounded-md border border-input bg-background px-3 py-2 font-medium"
              />
              {w.id === ws.id ? (
                <span className="rounded bg-primary/10 px-2 py-1 text-xs font-medium">Active</span>
              ) : (
                <button
                  type="button"
                  className="rounded-md border border-border px-3 py-1.5 text-sm"
                  onClick={() => store.setActiveWorkspace(w.id)}
                >
                  Switch
                </button>
              )}
              <button
                type="button"
                className="rounded-md border border-border px-3 py-1.5 text-sm"
                onClick={() => void store.duplicateWorkspace(w.id)}
              >
                Duplicate
              </button>
              <button
                type="button"
                disabled={store.workspaces.length <= 1}
                className="rounded-md border border-border px-3 py-1.5 text-sm text-red-600 disabled:opacity-40"
                onClick={() => {
                  if (window.confirm(`Delete workspace "${w.name}" and all its data?`)) {
                    void store.deleteWorkspace(w.id);
                  }
                }}
              >
                Delete
              </button>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <label className="text-sm">
                <span className="mb-1 block font-medium">Time zone</span>
                <select
                  value={w.timezone}
                  onChange={(e) => void store.updateWorkspace({ ...w, timezone: e.target.value })}
                  className="w-full rounded-md border border-input bg-background px-2 py-2"
                >
                  {zones.map((z) => (
                    <option key={z} value={z}>
                      {z}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm">
                <span className="mb-1 block font-medium">Week starts on</span>
                <select
                  value={w.weekStart}
                  onChange={(e) =>
                    void store.updateWorkspace({ ...w, weekStart: Number(e.target.value) })
                  }
                  className="w-full rounded-md border border-input bg-background px-2 py-2"
                >
                  {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(
                    (d, i) => (
                      <option key={d} value={i}>
                        {d}
                      </option>
                    ),
                  )}
                </select>
              </label>
              <div className="text-sm">
                <span className="mb-1 block font-medium">Platforms</span>
                <div className="flex max-h-32 flex-wrap gap-1 overflow-auto">
                  {PLATFORMS.map((p) => {
                    const on = w.platformIds.includes(p.id);
                    return (
                      <button
                        key={p.id}
                        type="button"
                        aria-pressed={on}
                        className={`rounded-full border px-2 py-0.5 text-xs ${
                          on ? 'border-primary bg-primary/10 font-medium' : 'border-border text-muted-foreground'
                        }`}
                        onClick={() =>
                          void store.updateWorkspace({
                            ...w,
                            platformIds: on
                              ? w.platformIds.filter((x) => x !== p.id)
                              : [...w.platformIds, p.id],
                          })
                        }
                      >
                        {p.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function DataPanel() {
  const store = useStore();
  const fileRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState<BackupFile | null>(null);
  const [duplicates, setDuplicates] = useState<string[]>([]);
  const [usage, setUsage] = useState<{ usage: number; quota: number } | null>(null);
  const [deleteText, setDeleteText] = useState('');

  const ws = store.activeWorkspace;

  const exportBackup = async (workspaceOnly: boolean) => {
    if (!store.repo) return;
    const backup = await buildBackup(store.repo, workspaceOnly ? ws?.id : undefined);
    download(
      `socialcalendar-backup-${new Date().toISOString().slice(0, 10)}.json`,
      JSON.stringify(backup, null, 2),
    );
    setMessage('Backup downloaded. Keep it somewhere safe — it contains your full calendar.');
  };

  const onFile = async (file: File) => {
    const text = await file.text();
    const parsed = parseBackup(text);
    if (!parsed.ok || !parsed.backup) {
      setMessage(`Restore failed: ${parsed.problems.join(' ')}`);
      setPending(null);
      return;
    }
    const existing = store.workspaces.map((w: Workspace) => w.id);
    const dups = findDuplicateWorkspaces(parsed.backup, existing);
    setPending(parsed.backup);
    setDuplicates(dups);
    setMessage(
      dups.length
        ? 'This backup contains a workspace that already exists here. Restore it as a copy to keep both.'
        : 'Backup is valid. Choose how to restore it.',
    );
  };

  const doRestore = async (mode: 'merge' | 'copy') => {
    if (!store.repo || !pending) return;
    const backup = mode === 'copy' ? remapBackupIds(pending) : pending;
    await store.repo.importAll(backup.data, 'merge');
    setPending(null);
    setMessage('Backup restored.');
    await store.reload();
  };

  return (
    <div className="space-y-6">
      <section>
        <h3 className="font-semibold">Backup &amp; restore</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Your calendar lives only in this browser. Export a backup regularly — it is
          the only copy that exists.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground" onClick={() => void exportBackup(false)}>
            Export full backup (JSON)
          </button>
          <button type="button" className="rounded-md border border-border px-4 py-2 text-sm" onClick={() => void exportBackup(true)}>
            Export this workspace only
          </button>
          <button type="button" className="rounded-md border border-border px-4 py-2 text-sm" onClick={() => fileRef.current?.click()}>
            Restore from backup…
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            aria-label="Choose a backup file to restore"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void onFile(f);
              e.target.value = '';
            }}
          />
        </div>
        {pending && (
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground" onClick={() => void doRestore('merge')}>
              Restore (merge)
            </button>
            {duplicates.length > 0 && (
              <button type="button" className="rounded-md border border-border px-4 py-2 text-sm" onClick={() => void doRestore('copy')}>
                Restore as a copy
              </button>
            )}
            <button type="button" className="rounded-md border border-border px-4 py-2 text-sm" onClick={() => setPending(null)}>
              Cancel
            </button>
          </div>
        )}
        {message && (
          <p className="mt-3 rounded bg-muted px-3 py-2 text-sm" role="status">
            {message}
          </p>
        )}
      </section>

      <section>
        <h3 className="font-semibold">Storage</h3>
        <button
          type="button"
          className="mt-2 rounded-md border border-border px-4 py-2 text-sm"
          onClick={async () => setUsage((await store.repo?.estimateUsage()) ?? null)}
        >
          Check storage usage
        </button>
        {usage && (
          <p className="mt-2 text-sm text-muted-foreground">
            This browser reports {(usage.usage / 1024 / 1024).toFixed(2)} MB used of{' '}
            {(usage.quota / 1024 / 1024 / 1024).toFixed(1)} GB available to this site.
          </p>
        )}
        {!store.persistent && (
          <p className="mt-2 text-sm text-amber-700 dark:text-amber-300">
            IndexedDB is unavailable in this browser session, so data is kept in memory
            only. Export a backup before closing the tab.
          </p>
        )}
      </section>

      <section className="rounded-lg border border-red-300 p-4 dark:border-red-800">
        <h3 className="font-semibold text-red-700 dark:text-red-300">Delete all data</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Permanently deletes every workspace, post and backup stored in this browser.
          This cannot be undone. Type DELETE to confirm.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <input
            value={deleteText}
            onChange={(e) => setDeleteText(e.target.value)}
            placeholder="Type DELETE"
            aria-label="Type DELETE to confirm deleting all data"
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
          <button
            type="button"
            disabled={deleteText !== 'DELETE'}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
            onClick={async () => {
              await store.repo?.clearAll();
              setDeleteText('');
              setMessage('All local data deleted.');
              await store.reload();
            }}
          >
            Delete everything
          </button>
        </div>
      </section>
    </div>
  );
}

export function WorkspaceApp() {
  return (
    <LocaleProvider>
      <WorkspaceShell />
    </LocaleProvider>
  );
}

function WorkspaceShell() {
  const store = useStore();
  const { locale, setLocale, t } = useLocale();
  const [tab, setTab] = useState<Tab>('calendar');
  const [calendarView, setCalendarView] = useState<CalendarView>('month');
  const [editorSeed, setEditorSeed] = useState<EditorSeed | null>(null);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  // Keyboard shortcuts (Phase 8). Never fire while typing in a field,
  // while the editor or palette is open, or with modifier combos other
  // than the palette's own.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((o) => !o);
        return;
      }
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      const editable =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement ||
        Boolean(target?.isContentEditable);
      if (editable || editorSeed || paletteOpen) return;
      const tabs: Tab[] = [
        'calendar',
        'manage',
        'library',
        'intelligence',
        'analytics',
        'overview',
        'workspaces',
        'data',
      ];
      if (e.key >= '1' && e.key <= '8') {
        setTab(tabs[Number(e.key) - 1]);
      } else if (e.key === 'n') {
        setEditorSeed({});
      } else if (e.key === '?') {
        setHelpOpen(true);
      } else if (e.key === 't' && tab === 'calendar') {
        window.dispatchEvent(new CustomEvent('sc-cal-nav', { detail: 'today' }));
      } else if (e.key === 'ArrowLeft' && tab === 'calendar') {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('sc-cal-nav', { detail: -1 }));
      } else if (e.key === 'ArrowRight' && tab === 'calendar') {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('sc-cal-nav', { detail: 1 }));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [editorSeed, paletteOpen, tab]);

  if (!store.ready) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8" aria-busy="true">
        <p className="text-muted-foreground">Loading your workspace…</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <ReminderEngine />
      {!store.persistent && (
        <div className="mb-4 rounded-lg border border-amber-400 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:bg-amber-950 dark:text-amber-100" role="alert">
          <strong>Temporary storage is active.</strong> This browser would not provide
          persistent local storage (private browsing can cause this), so your calendar
          is held in memory only and will be lost when the tab closes. Export a backup
          from the Data tab to keep your work.
        </div>
      )}
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold">Workspace</h1>
        <label className="text-sm">
          <span className="sr-only">Active workspace</span>
          <select
            value={store.activeWorkspace?.id ?? ''}
            onChange={(e) => store.setActiveWorkspace(e.target.value)}
            className="rounded-md border border-input bg-background px-2 py-2"
          >
            {store.workspaces.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </select>
        </label>
        <SaveIndicator />
        <label className="text-sm">
          <span className="sr-only">Interface language</span>
          <select
            value={locale}
            onChange={(e) => setLocale(e.target.value as Locale)}
            className="rounded-md border border-input bg-background px-2 py-2"
          >
            {LOCALES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.label}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          className="rounded-md border border-input px-3 py-2 text-sm hover:bg-accent"
          onClick={() => setPaletteOpen(true)}
          aria-label="Open command palette (Control or Command K)"
        >
          ⌘K
        </button>
        <button
          type="button"
          className="rounded-md border border-input px-3 py-2 text-sm hover:bg-accent"
          onClick={() => setHelpOpen(true)}
          aria-label={t('action.shortcuts')}
        >
          ?
        </button>
        <div className="ml-auto flex gap-1" role="tablist" aria-label="Workspace sections">
          {(
            [
              ['calendar', t('tab.calendar')],
              ['manage', t('tab.manage')],
              ['library', t('tab.library')],
              ['intelligence', t('tab.intelligence')],
              ['analytics', t('tab.analytics')],
              ['overview', t('tab.overview')],
              ['workspaces', t('tab.workspaces')],
              ['data', t('tab.data')],
            ] as [Tab, string][]
          ).map(([key, label]) => (
            <button
              key={key}
              role="tab"
              aria-selected={tab === key}
              type="button"
              onClick={() => setTab(key)}
              className={`rounded-md px-3 py-2 text-sm ${
                tab === key ? 'bg-primary text-primary-foreground' : 'border border-border'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-6">
        <Onboarding openEditor={setEditorSeed} goTab={setTab} />
        {tab === 'calendar' && (
          <CalendarApp view={calendarView} setView={setCalendarView} openEditor={setEditorSeed} />
        )}
        {tab === 'manage' && (
          <div className="space-y-8">
            <ManagePanel />
            <PlatformSpecs />
          </div>
        )}
        {tab === 'library' && <LibraryPanel openEditor={setEditorSeed} />}
        {tab === 'intelligence' && (
          <div className="space-y-8">
            <IntelligencePanel openEditor={setEditorSeed} />
            <HolidaysPanel openEditor={setEditorSeed} />
            <RulesPanel />
          </div>
        )}
        {tab === 'analytics' && <AnalyticsPanel />}
        {tab === 'overview' && (
          <div className="space-y-8">
            <Overview />
            <NotificationsPanel />
          </div>
        )}
        {tab === 'workspaces' && <WorkspaceManager />}
        {tab === 'data' && (
          <div className="space-y-8">
            <DataPanel />
            <SharePanel />
          </div>
        )}
      </div>
      {editorSeed && <PostEditor seed={editorSeed} onClose={() => setEditorSeed(null)} />}
      <CommandPalette
        open={paletteOpen}
        onOpenChange={setPaletteOpen}
        onGoTab={setTab}
        onGoView={(view) => {
          setTab('calendar');
          setCalendarView(view);
        }}
        onNewPost={() => setEditorSeed({})}
        onOpenPost={(post) => setEditorSeed({ post })}
      />
      {helpOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-label={t('action.shortcuts')}
          onClick={() => setHelpOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-t-2xl bg-background p-6 shadow-xl sm:rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">{t('action.shortcuts')}</h2>
              <button type="button" onClick={() => setHelpOpen(false)} aria-label="Close" className="rounded-md border border-border px-2 py-1">
                ✕
              </button>
            </div>
            <dl className="mt-4 space-y-2 text-sm">
              {[
                ['Ctrl/⌘ + K', 'Command palette'],
                ['N', 'New post'],
                ['1 – 8', 'Switch workspace tab'],
                ['← / →', 'Previous / next period (Calendar tab)'],
                ['T', 'Jump to today (Calendar tab)'],
                ['?', 'This help'],
                ['Esc', 'Close dialog'],
              ].map(([keys, what]) => (
                <div key={keys} className="flex justify-between gap-4">
                  <dt>
                    <kbd className="rounded border border-border px-1.5 py-0.5 font-mono text-xs">{keys}</kbd>
                  </dt>
                  <dd className="text-muted-foreground">{what}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-xs text-muted-foreground">
              Shortcuts never fire while you are typing in a field or a dialog is open.
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
