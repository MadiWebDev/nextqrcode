import { SocialCalendarDB, TABLE_NAMES, WORKSPACE_TABLES, type TableName } from './db';

/**
 * Repository abstraction over the local database (spec §6).
 *
 * The UI and store only ever talk to this interface. Two implementations:
 * Dexie (IndexedDB, persistent) and an in-memory fallback used when
 * IndexedDB is unavailable (e.g. some private-browsing modes) — the
 * fallback reports `persistent: false` so the UI can show a persistent
 * warning instead of pretending data is saved.
 */
export interface Repository {
  readonly persistent: boolean;
  ready(): Promise<void>;
  all<T>(table: TableName): Promise<T[]>;
  byWorkspace<T>(table: TableName, workspaceId: string): Promise<T[]>;
  get<T>(table: TableName, key: string | [string, string]): Promise<T | undefined>;
  put<T>(table: TableName, value: T): Promise<void>;
  bulkPut<T>(table: TableName, values: T[]): Promise<void>;
  remove(table: TableName, key: string | [string, string]): Promise<void>;
  clearWorkspace(workspaceId: string): Promise<void>;
  clearAll(): Promise<void>;
  exportAll(): Promise<Record<string, unknown[]>>;
  importAll(data: Record<string, unknown[]>, mode: 'replace' | 'merge'): Promise<void>;
  estimateUsage(): Promise<{ usage: number; quota: number } | null>;
}

class DexieRepository implements Repository {
  readonly persistent = true;
  private db = new SocialCalendarDB();

  async ready(): Promise<void> {
    await this.db.open();
  }

  private table(table: TableName) {
    // Dexie Table typing is per-entity; the repository is intentionally
    // generic, so access goes through a narrow structural cast.
    return this.db.table(table as string) as unknown as {
      toArray(): Promise<unknown[]>;
      where(index: string): {
        equals(value: unknown): { toArray(): Promise<unknown[]>; delete(): Promise<number> };
      };
      get(key: unknown): Promise<unknown>;
      put(value: unknown): Promise<unknown>;
      bulkPut(values: unknown[]): Promise<unknown>;
      delete(key: unknown): Promise<void>;
      clear(): Promise<void>;
    };
  }

  async all<T>(table: TableName): Promise<T[]> {
    return (await this.table(table).toArray()) as T[];
  }

  async byWorkspace<T>(table: TableName, workspaceId: string): Promise<T[]> {
    return (await this.table(table).where('workspaceId').equals(workspaceId).toArray()) as T[];
  }

  async get<T>(table: TableName, key: string | [string, string]): Promise<T | undefined> {
    return (await this.table(table).get(key)) as T | undefined;
  }

  async put<T>(table: TableName, value: T): Promise<void> {
    await this.table(table).put(value);
  }

  async bulkPut<T>(table: TableName, values: T[]): Promise<void> {
    if (values.length) await this.table(table).bulkPut(values);
  }

  async remove(table: TableName, key: string | [string, string]): Promise<void> {
    await this.table(table).delete(key);
  }

  async clearWorkspace(workspaceId: string): Promise<void> {
    await this.db.transaction('rw', this.db.tables, async () => {
      for (const t of WORKSPACE_TABLES) {
        await this.table(t).where('workspaceId').equals(workspaceId).delete();
      }
      await this.table('workspaces').delete(workspaceId);
    });
  }

  async clearAll(): Promise<void> {
    await this.db.transaction('rw', this.db.tables, async () => {
      for (const t of TABLE_NAMES) await this.table(t).clear();
    });
  }

  async exportAll(): Promise<Record<string, unknown[]>> {
    const out: Record<string, unknown[]> = {};
    for (const t of TABLE_NAMES) out[t] = await this.all(t);
    return out;
  }

  async importAll(data: Record<string, unknown[]>, mode: 'replace' | 'merge'): Promise<void> {
    await this.db.transaction('rw', this.db.tables, async () => {
      for (const t of TABLE_NAMES) {
        const rows = data[t];
        if (!Array.isArray(rows)) continue;
        if (mode === 'replace') await this.table(t).clear();
        if (rows.length) await this.table(t).bulkPut(rows);
      }
    });
  }

  async estimateUsage(): Promise<{ usage: number; quota: number } | null> {
    if (typeof navigator !== 'undefined' && navigator.storage?.estimate) {
      const est = await navigator.storage.estimate();
      return { usage: est.usage ?? 0, quota: est.quota ?? 0 };
    }
    return null;
  }
}

/** In-memory fallback — same semantics, zero persistence. */
export class MemoryRepository implements Repository {
  readonly persistent = false;
  private store = new Map<TableName, Map<string, unknown>>();

  constructor() {
    for (const t of TABLE_NAMES) this.store.set(t, new Map());
  }

  async ready(): Promise<void> {
    /* nothing to open */
  }

  private keyOf(table: TableName, value: unknown): string {
    const v = value as Record<string, unknown>;
    if (table === 'notificationSettings') return String(v.workspaceId);
    if (table === 'platformConfigs') return `${v.workspaceId}:${v.platformId}`;
    if (table === 'kv') return String(v.key);
    return String(v.id);
  }

  private keyString(key: string | [string, string]): string {
    return Array.isArray(key) ? key.join(':') : key;
  }

  async all<T>(table: TableName): Promise<T[]> {
    return [...(this.store.get(table)?.values() ?? [])] as T[];
  }

  async byWorkspace<T>(table: TableName, workspaceId: string): Promise<T[]> {
    return (await this.all<T>(table)).filter(
      (row) => (row as { workspaceId?: string }).workspaceId === workspaceId,
    );
  }

  async get<T>(table: TableName, key: string | [string, string]): Promise<T | undefined> {
    return this.store.get(table)?.get(this.keyString(key)) as T | undefined;
  }

  async put<T>(table: TableName, value: T): Promise<void> {
    this.store.get(table)?.set(this.keyOf(table, value), value);
  }

  async bulkPut<T>(table: TableName, values: T[]): Promise<void> {
    for (const v of values) await this.put(table, v);
  }

  async remove(table: TableName, key: string | [string, string]): Promise<void> {
    this.store.get(table)?.delete(this.keyString(key));
  }

  async clearWorkspace(workspaceId: string): Promise<void> {
    for (const t of WORKSPACE_TABLES) {
      const rows = await this.byWorkspace(t, workspaceId);
      for (const row of rows) {
        await this.remove(t, this.keyOf(t, row));
      }
    }
    await this.remove('workspaces', workspaceId);
  }

  async clearAll(): Promise<void> {
    for (const t of TABLE_NAMES) this.store.get(t)?.clear();
  }

  async exportAll(): Promise<Record<string, unknown[]>> {
    const out: Record<string, unknown[]> = {};
    for (const t of TABLE_NAMES) out[t] = await this.all(t);
    return out;
  }

  async importAll(data: Record<string, unknown[]>, mode: 'replace' | 'merge'): Promise<void> {
    for (const t of TABLE_NAMES) {
      const rows = data[t];
      if (!Array.isArray(rows)) continue;
      if (mode === 'replace') this.store.get(t)?.clear();
      await this.bulkPut(t, rows);
    }
  }

  async estimateUsage(): Promise<{ usage: number; quota: number } | null> {
    return null;
  }
}

/**
 * Create the best available repository. IndexedDB is probed with a real
 * open; any failure (private mode, blocked storage) falls back to memory.
 */
export async function createRepository(): Promise<Repository> {
  try {
    const repo = new DexieRepository();
    await repo.ready();
    return repo;
  } catch {
    const repo = new MemoryRepository();
    await repo.ready();
    return repo;
  }
}
