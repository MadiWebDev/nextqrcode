import type { Repository } from './repository';
import type { KvEntry } from './db';

/** Small per-workspace settings stored in the kv table (schema v2). */
export async function getKv<T>(
  repo: Repository,
  workspaceId: string,
  name: string,
): Promise<T | undefined> {
  const row = await repo.get<KvEntry>('kv', `${workspaceId}:${name}`);
  return row?.value as T | undefined;
}

export async function setKv(
  repo: Repository,
  workspaceId: string,
  name: string,
  value: unknown,
): Promise<void> {
  await repo.put<KvEntry>('kv', {
    key: `${workspaceId}:${name}`,
    workspaceId,
    value,
  });
}
