import { describe, it, expect, beforeEach } from 'vitest';
import { webcrypto } from 'node:crypto';
import { MemoryStore } from '../db';
import { newResumeDoc } from '../defaults';
import { uid } from '../defaults';
import {
  buildBackup,
  parseBackup,
  importBackup,
  encryptBackup,
  decryptBackup,
  isEncryptedBackup,
  PBKDF2_ITERATIONS,
} from '../backup';
import { createDebouncedSaver, isConflict } from '../autosave';
import type { Snapshot } from '../schema';

if (!globalThis.crypto?.subtle) {
  Object.defineProperty(globalThis, 'crypto', { value: webcrypto });
}

describe('memory store', () => {
  let store: MemoryStore;
  beforeEach(() => {
    store = new MemoryStore();
  });

  it('stores and lists resumes, and reports non-persistent health', async () => {
    const doc = newResumeDoc({ title: 'One' });
    await store.putResume(doc);
    const list = await store.listResumes();
    expect(list).toHaveLength(1);
    expect(list[0].meta.title).toBe('One');
    const health = await store.health();
    expect(health.persistent).toBe(false);
  });

  it('caps auto-snapshots at the retention limit but keeps named ones', async () => {
    const doc = newResumeDoc();
    await store.putResume(doc);
    for (let i = 0; i < 25; i++) {
      const snap: Snapshot = {
        id: uid('snap'),
        resumeId: doc.id,
        kind: 'auto',
        createdAt: 1000 + i,
        doc,
      };
      await store.putSnapshot(snap);
    }
    await store.putSnapshot({
      id: uid('snap'),
      resumeId: doc.id,
      kind: 'named',
      name: 'Before rewrite',
      createdAt: 5000,
      doc,
    });
    const snaps = await store.listSnapshots(doc.id);
    expect(snaps.filter((s) => s.kind === 'auto')).toHaveLength(20);
    expect(snaps.filter((s) => s.kind === 'named')).toHaveLength(1);
  });

  it('deleteResume cascades to snapshots and photos', async () => {
    const doc = newResumeDoc();
    await store.putResume(doc);
    await store.putPhoto({
      id: 'ph1',
      resumeId: doc.id,
      kind: 'original',
      blob: new Blob(['x'], { type: 'image/png' }),
      mime: 'image/png',
      createdAt: 1,
    });
    await store.deleteResume(doc.id);
    expect(await store.getResume(doc.id)).toBeUndefined();
    expect(await store.getPhoto('ph1')).toBeUndefined();
  });
});

describe('backup', () => {
  it('builds and re-imports a JSON backup including photos', async () => {
    const store = new MemoryStore();
    const doc = newResumeDoc({ title: 'Backup me' });
    doc.photo.originalId = 'ph-orig';
    doc.photo.croppedId = 'ph-crop';
    doc.photo.show = true;
    await store.putResume(doc);
    await store.putPhoto({
      id: 'ph-orig',
      resumeId: doc.id,
      kind: 'original',
      blob: new Blob(['original-bytes'], { type: 'image/jpeg' }),
      mime: 'image/jpeg',
      createdAt: 1,
    });
    await store.putPhoto({
      id: 'ph-crop',
      resumeId: doc.id,
      kind: 'cropped',
      blob: new Blob(['cropped-bytes'], { type: 'image/webp' }),
      mime: 'image/webp',
      createdAt: 2,
    });
    const backup = await buildBackup(store);
    expect(backup.photos).toHaveLength(2);
    const text = JSON.stringify(backup);
    const parsed = parseBackup(text);
    const store2 = new MemoryStore();
    const result = await importBackup(store2, parsed);
    expect(result.resumes).toBe(1);
    const restored = await store2.getPhoto('ph-crop');
    expect(restored?.mime).toBe('image/webp');
    expect(await restored?.blob.text()).toBe('cropped-bytes');
  });

  it('rejects a non-backup file with a plain message', () => {
    expect(() => parseBackup('{"hello":true}')).toThrow(/not a Resume Builder backup/);
    expect(() => parseBackup('not json')).toThrow(/not valid JSON/);
  });

  it('encrypts and decrypts a backup round-trip (AES-GCM, PBKDF2 600k)', async () => {
    const plain = JSON.stringify({ format: 'resumebuilder-backup', resumes: [] });
    const encrypted = await encryptBackup(plain, 'correct horse battery');
    expect(encrypted.kdf.iterations).toBe(PBKDF2_ITERATIONS);
    expect(encrypted.kdf.iterations).toBeGreaterThanOrEqual(600_000);
    expect(isEncryptedBackup(JSON.stringify(encrypted))).toBe(true);
    const back = await decryptBackup(encrypted, 'correct horse battery');
    expect(back).toBe(plain);
  });

  it('fails authentication with the friendly message on a wrong password', async () => {
    const encrypted = await encryptBackup('secret', 'right password');
    await expect(decryptBackup(encrypted, 'wrong password')).rejects.toThrow(
      /did not unlock this backup/,
    );
  });

  it('refuses a too-short password', async () => {
    await expect(encryptBackup('x', 'short')).rejects.toThrow(/at least 8 characters/);
  });
});

describe('autosave helpers', () => {
  it('debounces rapid schedules into one save of the last value', async () => {
    const saved: number[] = [];
    const saver = createDebouncedSaver<number>(async (v) => {
      saved.push(v);
    }, 10);
    saver.schedule(1);
    saver.schedule(2);
    saver.schedule(3);
    await saver.flush();
    expect(saved).toEqual([3]);
  });

  it('detects a multi-tab conflict only for a newer copy from another tab', () => {
    const local = { id: 'r1', updatedAt: 100 };
    expect(
      isConflict(local, { type: 'resume-saved', resumeId: 'r1', updatedAt: 200, tabId: 'other' }, 'me'),
    ).toBe(true);
    expect(
      isConflict(local, { type: 'resume-saved', resumeId: 'r1', updatedAt: 200, tabId: 'me' }, 'me'),
    ).toBe(false);
    expect(
      isConflict(local, { type: 'resume-saved', resumeId: 'r1', updatedAt: 50, tabId: 'other' }, 'me'),
    ).toBe(false);
    expect(
      isConflict(local, { type: 'resume-saved', resumeId: 'r2', updatedAt: 200, tabId: 'other' }, 'me'),
    ).toBe(false);
  });
});
