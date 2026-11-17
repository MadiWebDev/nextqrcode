'use client';

import { useRef, useState } from 'react';
import { useStore } from '../_lib/store';
import { buildBackup, parseBackup } from '../_lib/backup';
import { decryptJson, encryptJson, isEncryptedEnvelope } from '../_lib/crypto';
import {
  buildSharePayload,
  encodeEncryptedSharePayload,
  encodeSharePayload,
  shareUrl,
} from '../_lib/share';
import { downloadText } from '../_lib/exporters';

const inputCls =
  'w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground';

/**
 * Sharing + encrypted backups (spec §18), shown in the Data tab.
 * Plain restore lives in DataPanel above; this panel adds the
 * password-protected variants and read-only share links.
 */
export default function SharePanel() {
  const store = useStore();
  const ws = store.activeWorkspace;
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [stripPrivate, setStripPrivate] = useState(true);
  const [sharePassword, setSharePassword] = useState('');
  const [link, setLink] = useState('');
  const [shareError, setShareError] = useState('');
  const [backupPassword, setBackupPassword] = useState('');
  const [restorePassword, setRestorePassword] = useState('');
  const [message, setMessage] = useState('');
  const restoreRef = useRef<HTMLInputElement>(null);

  const createLink = async (encrypted: boolean) => {
    if (!ws) return;
    setShareError('');
    setLink('');
    const payload = buildSharePayload(
      store.data.posts.filter((p) => p.workspaceId === ws.id),
      ws.name,
      ws.timezone,
      { stripPrivate, fromDate: fromDate || undefined, toDate: toDate || undefined },
    );
    if (payload.posts.length === 0) {
      setShareError('No scheduled posts fall in that range — nothing to share.');
      return;
    }
    try {
      const encoded = encrypted
        ? await encodeEncryptedSharePayload(payload, sharePassword)
        : await encodeSharePayload(payload);
      setLink(shareUrl(encoded, window.location.origin));
    } catch (err) {
      setShareError(
        err instanceof Error
          ? err.message
          : 'Could not create the link. Export a backup file instead.',
      );
    }
  };

  const exportEncryptedBackup = async () => {
    if (!store.repo) return;
    try {
      const backup = await buildBackup(store.repo);
      const envelope = await encryptJson(JSON.stringify(backup), backupPassword);
      downloadText(
        `socialcalendar-backup-encrypted-${new Date().toISOString().slice(0, 10)}.json`,
        JSON.stringify(envelope, null, 2),
        'application/json',
      );
      setMessage(
        'Encrypted backup downloaded. There is no recovery if you forget the password — store it in your password manager.',
      );
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Encryption failed.');
    }
  };

  const onEncryptedRestore = async (file: File) => {
    try {
      const parsed: unknown = JSON.parse(await file.text());
      if (!isEncryptedEnvelope(parsed)) {
        setMessage('That file is not an encrypted Social Media Calendar backup. Use the plain restore above for regular backups.');
        return;
      }
      const json = await decryptJson(parsed, restorePassword);
      const backup = parseBackup(json);
      if (!backup.ok || !backup.backup || !store.repo) {
        setMessage(`Decrypted, but the backup inside is invalid: ${backup.problems.join(' ')}`);
        return;
      }
      await store.repo.importAll(backup.backup.data, 'merge');
      await store.reload();
      setMessage('Encrypted backup restored (merged by id — existing records with the same id were updated).');
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Restore failed.');
    }
  };

  return (
    <div className="space-y-6">
      <section>
        <h3 className="font-semibold">Share a read-only calendar link</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          The link carries the posts inside its #fragment, which browsers never send to a server —
          we never see or store what you share. Anyone with the full link can view it, so treat it
          like the data itself. Links are limited to about 180,000 characters; narrow the range if
          yours is too large.
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <label className="text-sm font-medium">
            From
            <input type="date" className={`${inputCls} mt-1`} value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          </label>
          <label className="text-sm font-medium">
            To
            <input type="date" className={`${inputCls} mt-1`} value={toDate} onChange={(e) => setToDate(e.target.value)} />
          </label>
          <label className="flex items-end gap-2 pb-2 text-sm">
            <input type="checkbox" checked={stripPrivate} onChange={(e) => setStripPrivate(e.target.checked)} />
            Hide internal notes, assignees &amp; checklists
          </label>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground" onClick={() => void createLink(false)}>
            Create share link
          </button>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="password"
              placeholder="Password for encrypted link (8+ chars)"
              className="rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={sharePassword}
              onChange={(e) => setSharePassword(e.target.value)}
            />
          </label>
          <button
            type="button"
            disabled={sharePassword.length < 8}
            className="rounded-md border border-input px-4 py-2 text-sm font-medium hover:bg-accent disabled:opacity-50"
            onClick={() => void createLink(true)}
          >
            Create encrypted link
          </button>
        </div>
        {shareError && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400" role="alert">
            {shareError}
          </p>
        )}
        {link && (
          <div className="mt-3">
            <label className="text-sm font-medium">
              Your link
              <span className="mt-1 flex gap-2">
                <input readOnly className={inputCls} value={link} onFocus={(e) => e.target.select()} />
                <button
                  type="button"
                  className="shrink-0 rounded-md border border-input px-3 py-2 text-sm font-medium hover:bg-accent"
                  onClick={() => void navigator.clipboard.writeText(link)}
                >
                  Copy
                </button>
              </span>
            </label>
          </div>
        )}
      </section>

      <section>
        <h3 className="font-semibold">Encrypted backup (AES-GCM)</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Password-protect a full backup with AES-GCM-256 encryption (PBKDF2 key derivation,
          210,000 rounds) before you store it anywhere. The password never leaves your browser and
          is never stored — there is no reset.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <input
            type="password"
            placeholder="Backup password (8+ chars)"
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={backupPassword}
            onChange={(e) => setBackupPassword(e.target.value)}
          />
          <button
            type="button"
            disabled={backupPassword.length < 8}
            className="rounded-md border border-input px-4 py-2 text-sm font-medium hover:bg-accent disabled:opacity-50"
            onClick={() => void exportEncryptedBackup()}
          >
            Export encrypted backup
          </button>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <input
            type="password"
            placeholder="Password for the file"
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={restorePassword}
            onChange={(e) => setRestorePassword(e.target.value)}
          />
          <button
            type="button"
            disabled={restorePassword.length === 0}
            className="rounded-md border border-input px-4 py-2 text-sm font-medium hover:bg-accent disabled:opacity-50"
            onClick={() => restoreRef.current?.click()}
          >
            Restore encrypted backup…
          </button>
          <input
            ref={restoreRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            aria-label="Choose an encrypted backup file"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void onEncryptedRestore(f);
              e.target.value = '';
            }}
          />
        </div>
        {message && (
          <p className="mt-2 text-sm" role="status">
            {message}
          </p>
        )}
      </section>
    </div>
  );
}
