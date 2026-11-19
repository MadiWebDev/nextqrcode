import Dexie, { type Table } from 'dexie';
import type { CoverLetter, ResumeDoc, Snapshot, TrackerItem } from './schema';
import { migrateToCurrent } from './migrations';

/**
 * Local store (spec §5): IndexedDB via Dexie holding resumes, version
 * snapshots, photo Blobs, cover letters, tracker items and settings.
 * The repository interface has two implementations — Dexie (persistent)
 * and in-memory (fallback when IndexedDB is blocked, e.g. some private
 * modes) — and the UI always shows which one is active, because data in
 * the fallback disappears when the tab closes.
 */

export interface PhotoRecord {
  id: string;
  resumeId: string;
  kind: 'original' | 'cropped';
  blob: Blob;
  mime: string;
  createdAt: number;
}

export interface StorageHealth {
  /** True when data is in IndexedDB (survives reloads). */
  persistent: boolean;
  /** Estimated usage/quota from navigator.storage, when available. */
  usage?: number;
  quota?: number;
  error?: string;
}

export interface ResumeStore {
  readonly persistent: boolean;
  listResumes(): Promise<ResumeDoc[]>;
  getResume(id: string): Promise<ResumeDoc | undefined>;
  putResume(doc: ResumeDoc): Promise<void>;
  deleteResume(id: string): Promise<void>;
  listSnapshots(resumeId: string): Promise<Snapshot[]>;
  putSnapshot(snap: Snapshot): Promise<void>;
  deleteSnapshot(id: string): Promise<void>;
  putPhoto(rec: PhotoRecord): Promise<void>;
  getPhoto(id: string): Promise<PhotoRecord | undefined>;
  deletePhotosForResume(resumeId: string): Promise<void>;
  listCoverLetters(): Promise<CoverLetter[]>;
  putCoverLetter(letter: CoverLetter): Promise<void>;
  deleteCoverLetter(id: string): Promise<void>;
  listTrackerItems(): Promise<TrackerItem[]>;
  putTrackerItem(item: TrackerItem): Promise<void>;
  deleteTrackerItem(id: string): Promise<void>;
  getSetting<T>(key: string): Promise<T | undefined>;
  putSetting(key: string, value: unknown): Promise<void>;
  wipeAll(): Promise<void>;
  health(): Promise<StorageHealth>;
}

/** Retention: auto-snapshots are capped; named snapshots are kept. */
export const MAX_AUTO_SNAPSHOTS = 20;

async function pruneAutoSnapshots(
  list: () => Promise<Snapshot[]>,
  remove: (id: string) => Promise<void>,
  resumeId: string,
): Promise<void> {
  const snaps = (await list()).filter((s) => s.resumeId === resumeId && s.kind === 'auto');
  snaps.sort((a, b) => b.createdAt - a.createdAt);
  for (const extra of snaps.slice(MAX_AUTO_SNAPSHOTS)) {
    await remove(extra.id);
  }
}

// ── Dexie implementation ─────────────────────────────────────────────────────

class ResumeDatabase extends Dexie {
  resumes!: Table<ResumeDoc, string>;
  snapshots!: Table<Snapshot, string>;
  photos!: Table<PhotoRecord, string>;
  coverLetters!: Table<CoverLetter, string>;
  trackerItems!: Table<TrackerItem, string>;
  settings!: Table<{ key: string; value: unknown }, string>;

  constructor() {
    super('resumebuilder');
    this.version(1).stores({
      resumes: 'id, meta.updatedAt',
      snapshots: 'id, resumeId, createdAt',
      photos: 'id, resumeId',
      coverLetters: 'id, resumeId, updatedAt',
      trackerItems: 'id, status, updatedAt',
      settings: 'key',
    });
  }
}

class DexieStore implements ResumeStore {
  readonly persistent = true;
  private db = new ResumeDatabase();

  async listResumes(): Promise<ResumeDoc[]> {
    const rows = await this.db.resumes.toArray();
    return rows.map((r) => migrateToCurrent(r));
  }
  async getResume(id: string): Promise<ResumeDoc | undefined> {
    const row = await this.db.resumes.get(id);
    return row ? migrateToCurrent(row) : undefined;
  }
  async putResume(doc: ResumeDoc): Promise<void> {
    await this.db.resumes.put(doc);
  }
  async deleteResume(id: string): Promise<void> {
    await this.db.transaction('rw', this.db.resumes, this.db.snapshots, this.db.photos, async () => {
      await this.db.resumes.delete(id);
      await this.db.snapshots.where('resumeId').equals(id).delete();
      await this.db.photos.where('resumeId').equals(id).delete();
    });
  }
  async listSnapshots(resumeId: string): Promise<Snapshot[]> {
    const rows = await this.db.snapshots.where('resumeId').equals(resumeId).toArray();
    return rows.sort((a, b) => b.createdAt - a.createdAt);
  }
  async putSnapshot(snap: Snapshot): Promise<void> {
    await this.db.snapshots.put(snap);
    if (snap.kind === 'auto') {
      await pruneAutoSnapshots(
        () => this.listSnapshots(snap.resumeId),
        (id) => this.deleteSnapshot(id),
        snap.resumeId,
      );
    }
  }
  async deleteSnapshot(id: string): Promise<void> {
    await this.db.snapshots.delete(id);
  }
  async putPhoto(rec: PhotoRecord): Promise<void> {
    await this.db.photos.put(rec);
  }
  async getPhoto(id: string): Promise<PhotoRecord | undefined> {
    return this.db.photos.get(id);
  }
  async deletePhotosForResume(resumeId: string): Promise<void> {
    await this.db.photos.where('resumeId').equals(resumeId).delete();
  }
  async listCoverLetters(): Promise<CoverLetter[]> {
    return this.db.coverLetters.toArray();
  }
  async putCoverLetter(letter: CoverLetter): Promise<void> {
    await this.db.coverLetters.put(letter);
  }
  async deleteCoverLetter(id: string): Promise<void> {
    await this.db.coverLetters.delete(id);
  }
  async listTrackerItems(): Promise<TrackerItem[]> {
    return this.db.trackerItems.toArray();
  }
  async putTrackerItem(item: TrackerItem): Promise<void> {
    await this.db.trackerItems.put(item);
  }
  async deleteTrackerItem(id: string): Promise<void> {
    await this.db.trackerItems.delete(id);
  }
  async getSetting<T>(key: string): Promise<T | undefined> {
    const row = await this.db.settings.get(key);
    return row?.value as T | undefined;
  }
  async putSetting(key: string, value: unknown): Promise<void> {
    await this.db.settings.put({ key, value });
  }
  async wipeAll(): Promise<void> {
    await this.db.delete();
    this.db = new ResumeDatabase();
  }
  async health(): Promise<StorageHealth> {
    try {
      await this.db.resumes.count();
      const est = await navigator.storage?.estimate?.().catch(() => undefined);
      return { persistent: true, usage: est?.usage, quota: est?.quota };
    } catch (err) {
      return { persistent: false, error: err instanceof Error ? err.message : 'IndexedDB unavailable' };
    }
  }
}

// ── In-memory fallback ───────────────────────────────────────────────────────

export class MemoryStore implements ResumeStore {
  readonly persistent = false;
  private resumes = new Map<string, ResumeDoc>();
  private snapshots = new Map<string, Snapshot>();
  private photos = new Map<string, PhotoRecord>();
  private letters = new Map<string, CoverLetter>();
  private items = new Map<string, TrackerItem>();
  private settings = new Map<string, unknown>();

  async listResumes() {
    return [...this.resumes.values()].map((r) => migrateToCurrent(r));
  }
  async getResume(id: string) {
    const r = this.resumes.get(id);
    return r ? migrateToCurrent(r) : undefined;
  }
  async putResume(doc: ResumeDoc) {
    this.resumes.set(doc.id, doc);
  }
  async deleteResume(id: string) {
    this.resumes.delete(id);
    for (const [k, s] of this.snapshots) if (s.resumeId === id) this.snapshots.delete(k);
    for (const [k, p] of this.photos) if (p.resumeId === id) this.photos.delete(k);
  }
  async listSnapshots(resumeId: string) {
    return [...this.snapshots.values()]
      .filter((s) => s.resumeId === resumeId)
      .sort((a, b) => b.createdAt - a.createdAt);
  }
  async putSnapshot(snap: Snapshot) {
    this.snapshots.set(snap.id, snap);
    if (snap.kind === 'auto') {
      await pruneAutoSnapshots(
        () => this.listSnapshots(snap.resumeId),
        async (id) => this.deleteSnapshot(id),
        snap.resumeId,
      );
    }
  }
  async deleteSnapshot(id: string) {
    this.snapshots.delete(id);
  }
  async putPhoto(rec: PhotoRecord) {
    this.photos.set(rec.id, rec);
  }
  async getPhoto(id: string) {
    return this.photos.get(id);
  }
  async deletePhotosForResume(resumeId: string) {
    for (const [k, p] of this.photos) if (p.resumeId === resumeId) this.photos.delete(k);
  }
  async listCoverLetters() {
    return [...this.letters.values()];
  }
  async putCoverLetter(letter: CoverLetter) {
    this.letters.set(letter.id, letter);
  }
  async deleteCoverLetter(id: string) {
    this.letters.delete(id);
  }
  async listTrackerItems() {
    return [...this.items.values()];
  }
  async putTrackerItem(item: TrackerItem) {
    this.items.set(item.id, item);
  }
  async deleteTrackerItem(id: string) {
    this.items.delete(id);
  }
  async getSetting<T>(key: string) {
    return this.settings.get(key) as T | undefined;
  }
  async putSetting(key: string, value: unknown) {
    this.settings.set(key, value);
  }
  async wipeAll() {
    this.resumes.clear();
    this.snapshots.clear();
    this.photos.clear();
    this.letters.clear();
    this.items.clear();
    this.settings.clear();
  }
  async health(): Promise<StorageHealth> {
    return { persistent: false, error: 'IndexedDB is unavailable, so data is kept in memory only for this tab.' };
  }
}

// ── Selection ────────────────────────────────────────────────────────────────

let cached: ResumeStore | undefined;

/** Pick Dexie when IndexedDB exists and opens; otherwise the memory fallback. */
export async function getStore(): Promise<ResumeStore> {
  if (cached) return cached;
  if (typeof indexedDB !== 'undefined') {
    const store = new DexieStore();
    const health = await store.health();
    if (health.persistent) {
      cached = store;
      return cached;
    }
  }
  cached = new MemoryStore();
  return cached;
}

/** Test hook / delete-all path: forget the cached store instance. */
export function resetStoreCache(): void {
  cached = undefined;
}
