import { SCHEMA_VERSION, TABLE_NAMES, validateBackup } from './db';
import type { Repository } from './repository';
import { uid, type BackupFile } from './types';

/** Build a backup envelope from the repository (whole DB or one workspace). */
export async function buildBackup(
  repo: Repository,
  workspaceId?: string,
): Promise<BackupFile> {
  const all = await repo.exportAll();
  if (!workspaceId) {
    return {
      app: 'socialcalendar',
      schemaVersion: SCHEMA_VERSION,
      exportedAt: new Date().toISOString(),
      data: all,
    };
  }
  const data: Record<string, unknown[]> = {};
  for (const t of TABLE_NAMES) {
    const rows = all[t] ?? [];
    if (t === 'workspaces') {
      data[t] = rows.filter((r) => (r as { id: string }).id === workspaceId);
    } else if (t === 'profiles') {
      data[t] = [];
    } else {
      data[t] = rows.filter(
        (r) => (r as { workspaceId?: string }).workspaceId === workspaceId,
      );
    }
  }
  return {
    app: 'socialcalendar',
    schemaVersion: SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    workspaceId,
    data,
  };
}

export interface ParsedBackup {
  ok: boolean;
  problems: string[];
  backup?: BackupFile;
}

/** Parse + validate untrusted backup text. Never throws. */
export function parseBackup(text: string): ParsedBackup {
  let value: unknown;
  try {
    value = JSON.parse(text);
  } catch {
    return { ok: false, problems: ['The file is not valid JSON.'] };
  }
  const problems = validateBackup(value);
  if (problems.length) return { ok: false, problems };
  return { ok: true, problems: [], backup: value as BackupFile };
}

/** Workspace ids contained in a backup. */
export function backupWorkspaceIds(backup: BackupFile): string[] {
  const rows = (backup.data.workspaces ?? []) as { id: string }[];
  return rows.map((r) => r.id);
}

/**
 * Duplicate detection (spec §6): a workspace backup whose workspace id
 * already exists locally would collide on restore. When detected, the
 * caller offers "restore as a copy", implemented by remapBackupIds.
 */
export function findDuplicateWorkspaces(
  backup: BackupFile,
  existingWorkspaceIds: string[],
): string[] {
  const existing = new Set(existingWorkspaceIds);
  return backupWorkspaceIds(backup).filter((id) => existing.has(id));
}

function remapValue(value: unknown, idMap: Map<string, string>): unknown {
  if (typeof value === 'string') return idMap.get(value) ?? value;
  if (Array.isArray(value)) return value.map((v) => remapValue(v, idMap));
  if (typeof value === 'object' && value !== null) {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = remapValue(v, idMap);
    }
    return out;
  }
  return value;
}

/**
 * Return a copy of the backup with every entity id replaced by a fresh
 * one (references included), so it can be restored alongside the
 * original workspace without collisions.
 */
export function remapBackupIds(backup: BackupFile): BackupFile {
  const idMap = new Map<string, string>();
  for (const t of TABLE_NAMES) {
    for (const row of backup.data[t] ?? []) {
      const id = (row as { id?: string }).id;
      if (typeof id === 'string' && !idMap.has(id)) idMap.set(id, uid());
    }
  }
  // notificationSettings rows are keyed by workspaceId, which is itself a
  // workspace id already present in the map via the workspaces table.
  const data: Record<string, unknown[]> = {};
  for (const t of TABLE_NAMES) {
    data[t] = (backup.data[t] ?? []).map((row) => remapValue(row, idMap));
  }
  return {
    ...backup,
    workspaceId: backup.workspaceId ? (idMap.get(backup.workspaceId) ?? backup.workspaceId) : undefined,
    data,
  };
}
