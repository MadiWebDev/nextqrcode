'use client';

import { importFile, type ImportResult } from '../_lib/importers';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  AlertTriangle,
  Camera,
  Copy,
  Download,
  FilePlus2,
  History,
  Lock,
  Trash2,
  Upload,
} from 'lucide-react';
import type { ResumeDoc, Snapshot } from '../_lib/schema';
import { rt } from '../_lib/schema';
import { getStore, type ResumeStore, type StorageHealth } from '../_lib/db';
import { newResumeDoc, uid } from '../_lib/defaults';
import {
  buildBackup,
  decryptBackup,
  encryptBackup,
  importBackup,
  isEncryptedBackup,
  parseBackup,
} from '../_lib/backup';
import { Editor } from './editor/Editor';

function download(filename: string, content: Blob | string) {
  const blob = typeof content === 'string' ? new Blob([content], { type: 'application/json' }) : content;
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

/** Plain-text dump of a document for the snapshot compare view. */
function docToText(doc: ResumeDoc): string {
  const lines: string[] = [doc.basics.name, doc.basics.headline, doc.basics.email, doc.basics.phone, doc.basics.location, ''];
  for (const s of doc.sections) {
    if (!s.visible) continue;
    lines.push(`## ${s.title}`);
    if (s.text) lines.push(rt.plain(s.text));
    for (const e of s.experience ?? []) lines.push(`${e.role} — ${e.organization}`, rt.plain(e.bullets));
    for (const e of s.education ?? []) lines.push(`${e.area} — ${e.institution}`);
    for (const g of s.skillGroups ?? []) lines.push(`${g.name}: ${g.skills.map((x) => x.name).join(', ')}`);
    for (const e of s.entries ?? []) lines.push(e.title, rt.plain(e.bullets));
    lines.push('');
  }
  return lines.join('\n');
}

/** Auto-snapshot on open when the last one is stale (> 30 min) — the
 * debounced version history the spec requires, capped by the store. */
async function maybeAutoSnapshot(store: ResumeStore, doc: ResumeDoc): Promise<void> {
  const snaps = await store.listSnapshots(doc.id);
  const lastAuto = snaps.find((s) => s.kind === 'auto');
  if (!lastAuto || Date.now() - lastAuto.createdAt > 30 * 60 * 1000) {
    await store.putSnapshot({
      id: uid('snap'),
      resumeId: doc.id,
      kind: 'auto',
      createdAt: Date.now(),
      doc,
    });
  }
}

export function Workspace() {
  const [importReview, setImportReview] = useState<ImportResult | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [store, setStore] = useState<ResumeStore | null>(null);
  const [health, setHealth] = useState<StorageHealth | null>(null);
  const [resumes, setResumes] = useState<ResumeDoc[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [historyFor, setHistoryFor] = useState<string | null>(null);
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [compare, setCompare] = useState<[Snapshot, Snapshot] | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [confirmingWipe, setConfirmingWipe] = useState(false);
  const [backupPassword, setBackupPassword] = useState('');
  const [importPassword, setImportPassword] = useState('');
  const [pendingImport, setPendingImport] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const refresh = useCallback(async (s: ResumeStore) => {
    setResumes((await s.listResumes()).sort((a, b) => b.meta.updatedAt - a.meta.updatedAt));
    setHealth(await s.health());
  }, []);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const s = await getStore();
      if (cancelled) return;
      setStore(s);
      await refresh(s);
    })();
    return () => {
      cancelled = true;
    };
  }, [refresh]);

  if (!store) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <p className="text-muted-foreground">Opening your private workspace…</p>
      </main>
    );
  }

  const openDoc = resumes.find((r) => r.id === openId);
  if (openDoc) {
    return (
      <Editor
        key={openDoc.id}
        initialDoc={openDoc}
        store={store}
        onBack={() => {
          setOpenId(null);
          void refresh(store);
        }}
        onDocSaved={() => undefined}
      />
    );
  }

  const createResume = async () => {
    const doc = newResumeDoc();
    await store.putResume(doc);
    await refresh(store);
    setOpenId(doc.id);
  };

  const openResume = async (doc: ResumeDoc) => {
    await maybeAutoSnapshot(store, doc);
    setOpenId(doc.id);
  };

  const showHistory = async (resumeId: string) => {
    setHistoryFor(resumeId);
    setSnapshots(await store.listSnapshots(resumeId));
    setCompare(null);
  };

  const doExportBackup = async (encrypted: boolean) => {
    const backup = await buildBackup(store);
    const text = JSON.stringify(backup, null, 2);
    if (!encrypted) {
      download('resumebuilder-backup.json', text);
      setMessage('Backup downloaded. Keep it somewhere safe — it contains your resumes and photos.');
      return;
    }
    if (backupPassword.length < 8) {
      setMessage('Set a backup password of at least 8 characters first. A forgotten password cannot be recovered — there is no reset.');
      return;
    }
    const enc = await encryptBackup(text, backupPassword);
    download('resumebuilder-backup-encrypted.json', JSON.stringify(enc, null, 2));
    setMessage('Encrypted backup downloaded. If you forget the password, the backup cannot be opened — by design.');
  };

  const doImportFile = async (file: File) => {
    const text = await file.text();
    if (isEncryptedBackup(text)) {
      setPendingImport(text);
      setMessage('This backup is password-protected. Enter its password below, then choose Import again.');
      return;
    }
    const result = await importBackup(store, parseBackup(text));
    await refresh(store);
    setMessage(`Backup imported — ${result.resumes} resume(s) restored.`);
  };

  const doImportEncrypted = async () => {
    if (!pendingImport) return;
    try {
      const plain = await decryptBackup(JSON.parse(pendingImport), importPassword);
      const result = await importBackup(store, parseBackup(plain));
      await refresh(store);
      setPendingImport(null);
      setImportPassword('');
      setMessage(`Backup imported — ${result.resumes} resume(s) restored.`);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Import failed.');
    }
  };

  const wipeAll = async () => {
    await store.wipeAll();
    if (typeof caches !== 'undefined') {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k.startsWith('resume')).map((k) => caches.delete(k)));
    }
    setResumes([]);
    setSnapshots([]);
    setConfirmingWipe(false);
    setMessage('All Resume Builder data on this device has been deleted.');
    await refresh(store);
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold tracking-tight">Your resumes</h1>
        <button
          type="button"
          className="ml-auto inline-flex min-h-11 items-center gap-1.5 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
          onClick={() => void createResume()}
        >
          <FilePlus2 className="h-4 w-4" aria-hidden /> New resume
        </button>
        <label className="inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-md border border-input px-4 text-sm font-medium">
          Import a resume
          <input
            type="file"
            accept=".pdf,.docx,.json,.zip"
            className="sr-only"
            aria-label="Import a resume from PDF, DOCX, JSON or a LinkedIn ZIP"
            onChange={(e) => {
              const file = e.target.files?.[0];
              e.target.value = '';
              if (!file) return;
              setImportError(null);
              void importFile(file)
                .then((result) => setImportReview(result))
                .catch(() =>
                  setImportError('That file could not be read as a resume. Supported files: PDF, DOCX, JSON (JSON Resume) and LinkedIn export ZIPs.'),
                );
            }}
          />
        </label>
      </div>
      {importError ? (
        <p role="alert" className="mt-4 rounded-lg border border-destructive p-3 text-sm text-destructive">
          {importError}
        </p>
      ) : null}
      {importReview ? (
        <div className="mt-4 rounded-lg border border-border bg-card p-4" role="dialog" aria-label="Review imported resume">
          <h2 className="font-semibold">Review your import ({importReview.source})</h2>
          <p className="mt-1 text-sm">
            Name found: <strong>{importReview.doc.basics.name || '—'}</strong>
            {importReview.doc.basics.headline ? <> · {importReview.doc.basics.headline}</> : null}
          </p>
          <ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground">
            {importReview.doc.sections.map((sec) => (
              <li key={sec.id}>
                {sec.title}: {(sec.experience?.length ?? 0) + (sec.education?.length ?? 0)} entries
                {sec.skillGroups?.length ? `, ${sec.skillGroups.reduce((n, g) => n + g.skills.length, 0)} skills` : ''}
                {sec.text?.length ? ', text' : ''}
              </li>
            ))}
          </ul>
          {importReview.warnings.map((w) => (
            <p key={w} className="mt-2 text-sm text-amber-700 dark:text-amber-300">{w}</p>
          ))}
          <p className="mt-2 text-sm text-muted-foreground">
            Saving creates a NEW resume — your existing resumes are never overwritten by an import.
          </p>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              className="min-h-11 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
              onClick={() => {
                void store.putResume(importReview.doc).then(() => {
                  setImportReview(null);
                  setMessage('Imported resume saved — open it to review and polish.');
                  void refresh(store);
                });
              }}
            >
              Save as new resume
            </button>
            <button
              type="button"
              className="min-h-11 rounded-md border border-input px-4 text-sm font-medium"
              onClick={() => setImportReview(null)}
            >
              Discard
            </button>
          </div>
        </div>
      ) : null}

      {health && !health.persistent && (
        <div role="alert" className="mt-4 flex gap-2 rounded-lg border border-amber-500 bg-amber-50 p-3 text-sm text-amber-900 dark:bg-amber-950 dark:text-amber-100">
          <AlertTriangle className="h-5 w-5 shrink-0" aria-hidden />
          <p>
            This browser is blocking local database storage (common in private windows), so resumes
            are being kept in memory only and will disappear when this tab closes. Download a backup
            below before you leave, or use a regular browser window for storage that lasts.
          </p>
        </div>
      )}
      {message && (
        <p role="status" className="mt-4 rounded-lg border border-border bg-muted/50 p-3 text-sm">
          {message}
        </p>
      )}

      {resumes.length === 0 ? (
        <div className="mt-8 rounded-lg border border-dashed border-border p-8 text-center">
          <p className="font-medium">No resumes yet</p>
          <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
            Create your first resume — it is stored only in this browser, and you can download a
            finished PDF or Word file whenever you are ready. No account, ever.
          </p>
          <button
            type="button"
            className="mt-4 inline-flex min-h-11 items-center gap-1.5 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
            onClick={() => void createResume()}
          >
            <FilePlus2 className="h-4 w-4" aria-hidden /> Create a resume
          </button>
        </div>
      ) : (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resumes.map((r) => (
            <li key={r.id} className="rounded-lg border border-border bg-card p-4">
              <p className="truncate font-semibold">{r.meta.title}</p>
              <p className="mt-0.5 truncate text-sm text-muted-foreground">
                {r.basics.name || 'No name yet'}
                {r.basics.headline ? ` · ${r.basics.headline}` : ''}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Last edited {new Date(r.meta.updatedAt).toLocaleString()}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <button type="button" className="min-h-11 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground" onClick={() => void openResume(r)}>
                  Open
                </button>
                <button
                  type="button"
                  aria-label={`Duplicate ${r.meta.title}`}
                  className="flex h-11 w-11 items-center justify-center rounded border border-input"
                  onClick={async () => {
                    const copy: ResumeDoc = {
                      ...JSON.parse(JSON.stringify(r)),
                      id: uid('resume'),
                      meta: { ...r.meta, title: `${r.meta.title} (copy)`, createdAt: Date.now(), updatedAt: Date.now() },
                      photo: { ...r.photo, originalId: undefined, croppedId: undefined, show: false },
                    };
                    await store.putResume(copy);
                    await refresh(store);
                  }}
                >
                  <Copy className="h-4 w-4" aria-hidden />
                </button>
                <button
                  type="button"
                  aria-label={`Version history for ${r.meta.title}`}
                  className="flex h-11 w-11 items-center justify-center rounded border border-input"
                  onClick={() => void showHistory(r.id)}
                >
                  <History className="h-4 w-4" aria-hidden />
                </button>
                <button
                  type="button"
                  aria-label={`Delete ${r.meta.title}`}
                  className="flex h-11 w-11 items-center justify-center rounded border border-input text-destructive"
                  onClick={async () => {
                    await store.deleteResume(r.id);
                    if (historyFor === r.id) setHistoryFor(null);
                    await refresh(store);
                  }}
                >
                  <Trash2 className="h-4 w-4" aria-hidden />
                </button>
              </div>
              {historyFor === r.id && (
                <div className="mt-3 border-t border-dashed border-border pt-3">
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-semibold">Version history</h2>
                    <button
                      type="button"
                      className="ml-auto min-h-11 rounded-md border border-input px-2.5 text-xs font-medium"
                      onClick={async () => {
                        await store.putSnapshot({
                          id: uid('snap'),
                          resumeId: r.id,
                          kind: 'named',
                          name: `Snapshot ${new Date().toLocaleString()}`,
                          createdAt: Date.now(),
                          doc: r,
                        });
                        await showHistory(r.id);
                      }}
                    >
                      Take snapshot
                    </button>
                  </div>
                  {snapshots.length === 0 ? (
                    <p className="mt-1 text-xs text-muted-foreground">No snapshots yet. One is taken automatically when you open the resume after a break.</p>
                  ) : (
                    <ul className="mt-2 space-y-1.5">
                      {snapshots.map((s) => (
                        <li key={s.id} className="flex flex-wrap items-center gap-2 text-xs">
                          <span className="min-w-0 flex-1 truncate">
                            {s.kind === 'named' ? (s.name ?? 'Named snapshot') : 'Auto'} ·{' '}
                            {new Date(s.createdAt).toLocaleString()}
                          </span>
                          <button
                            type="button"
                            className="min-h-9 rounded border border-input px-2 py-1"
                            onClick={async () => {
                              await store.putResume({ ...s.doc, meta: { ...s.doc.meta, updatedAt: Date.now() } });
                              await refresh(store);
                              setMessage('Snapshot restored. The previous version was kept as the latest auto-snapshot if one existed.');
                            }}
                          >
                            Restore
                          </button>
                          <button
                            type="button"
                            className="min-h-9 rounded border border-input px-2 py-1"
                            onClick={() => {
                              if (!compare) setCompare([s, s]);
                              else if (compare[0].id !== s.id) setCompare([compare[0], s]);
                            }}
                          >
                            Compare
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                  {compare && compare[0].id !== compare[1].id && (
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      {[compare[0], compare[1]].map((s) => (
                        <div key={s.id} className="rounded border border-border p-2">
                          <p className="mb-1 text-xs font-semibold">{new Date(s.createdAt).toLocaleString()}</p>
                          <pre className="max-h-64 overflow-auto whitespace-pre-wrap text-[11px]">{docToText(s.doc)}</pre>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      <section aria-labelledby="data-heading" className="mt-10 rounded-lg border border-border p-4">
        <h2 id="data-heading" className="flex items-center gap-2 font-semibold">
          <Camera className="hidden" aria-hidden /> Your data, your device
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Everything is stored in this browser
          {health?.usage !== undefined && health?.quota ? (
            <> — about {Math.max(1, Math.round((health.usage / 1024 / 1024) * 10) / 10)} MB used of {Math.round(health.quota / 1024 / 1024)} MB available</>
          ) : null}
          . Ask the browser to protect this data from automatic cleanup (useful if you keep resumes
          here long-term):
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            className="min-h-11 rounded-md border border-input px-3 text-sm font-medium"
            onClick={async () => {
              const ok = await navigator.storage?.persist?.().catch(() => false);
              setMessage(ok ? 'This browser will now protect your saved resumes from automatic cleanup.' : 'The browser did not grant persistent storage — it decides this itself based on how you use the site. Your data is still saved normally.');
            }}
          >
            Protect my saved data
          </button>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="rounded-md border border-dashed border-border p-3">
            <h3 className="flex items-center gap-1.5 text-sm font-semibold">
              <Download className="h-4 w-4" aria-hidden /> Back up everything
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              One file with all resumes, cover letters, tracker items and photos.
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <button type="button" className="min-h-11 rounded-md border border-input px-3 text-sm font-medium" onClick={() => void doExportBackup(false)}>
                Download backup
              </button>
            </div>
            <label className="mt-3 block space-y-1">
              <span className="flex items-center gap-1.5 text-sm font-medium">
                <Lock className="h-4 w-4" aria-hidden /> Or encrypt it with a password
              </span>
              <input
                type="password"
                value={backupPassword}
                onChange={(e) => setBackupPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="min-h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                autoComplete="new-password"
              />
            </label>
            <p className="mt-1 text-xs text-muted-foreground">
              Encrypted with AES-256-GCM (PBKDF2, 600,000 rounds). If you forget this password the
              backup cannot be opened — there is no recovery.
            </p>
            <button type="button" className="mt-2 min-h-11 rounded-md border border-input px-3 text-sm font-medium" onClick={() => void doExportBackup(true)}>
              Download encrypted backup
            </button>
          </div>
          <div className="rounded-md border border-dashed border-border p-3">
            <h3 className="flex items-center gap-1.5 text-sm font-semibold">
              <Upload className="h-4 w-4" aria-hidden /> Restore a backup
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Restoring writes the backup&apos;s resumes into this browser (same-id resumes are
              overwritten — that is the point of a restore).
            </p>
            <input
              ref={fileRef}
              type="file"
              accept="application/json"
              className="sr-only"
              aria-label="Choose a backup file"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void doImportFile(f);
                e.target.value = '';
              }}
            />
            <button type="button" className="mt-2 min-h-11 rounded-md border border-input px-3 text-sm font-medium" onClick={() => fileRef.current?.click()}>
              Choose backup file
            </button>
            {pendingImport && (
              <div className="mt-3 space-y-2">
                <input
                  type="password"
                  value={importPassword}
                  onChange={(e) => setImportPassword(e.target.value)}
                  placeholder="Backup password"
                  className="min-h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  autoComplete="current-password"
                />
                <button type="button" className="min-h-11 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground" onClick={() => void doImportEncrypted()}>
                  Unlock &amp; import
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="mt-5 border-t border-dashed border-border pt-4">
          <h3 className="text-sm font-semibold text-destructive">Delete all my data</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Removes every resume, snapshot, photo, cover letter and tracker item stored by this site
            in this browser, plus its offline caches. This cannot be undone — download a backup
            first if you might want them back.
          </p>
          {confirmingWipe ? (
            <div className="mt-2 flex flex-wrap gap-2">
              <button type="button" className="min-h-11 rounded-md bg-destructive px-3 text-sm font-medium text-destructive-foreground" onClick={() => void wipeAll()}>
                Yes, delete everything
              </button>
              <button type="button" className="min-h-11 rounded-md border border-input px-3 text-sm font-medium" onClick={() => setConfirmingWipe(false)}>
                Cancel
              </button>
            </div>
          ) : (
            <button type="button" className="mt-2 min-h-11 rounded-md border border-destructive px-3 text-sm font-medium text-destructive" onClick={() => setConfirmingWipe(true)}>
              Delete all my data
            </button>
          )}
        </div>
      </section>
    </main>
  );
}
