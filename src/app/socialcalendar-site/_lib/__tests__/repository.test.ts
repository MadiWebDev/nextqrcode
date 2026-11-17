import { describe, expect, it } from 'vitest';
import { MemoryRepository } from '../repository';
import {
  buildBackup,
  findDuplicateWorkspaces,
  parseBackup,
  remapBackupIds,
} from '../backup';
import { validateBackup } from '../db';
import { uid, type Post, type Workspace } from '../types';

const ws = (id: string): Workspace => ({
  id,
  name: 'WS',
  timezone: 'Asia/Karachi',
  weekStart: 1,
  platformIds: ['instagram'],
  brand: {
    brandName: '',
    primaryColor: '#0ea5e9',
    secondaryColor: '#0369a1',
    accentColor: '#f59e0b',
    fontPreference: 'sans',
    tone: '',
    description: '',
    website: '',
    socialLinks: {},
    hashtagPreferences: [],
    guidelines: '',
  },
  pipeline: ['idea', 'draft', 'in-review', 'approved', 'scheduled', 'published'],
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
});

const post = (id: string, workspaceId: string): Post => ({
  id,
  workspaceId,
  calendarId: 'cal-1',
  title: 'T',
  caption: 'C',
  description: '',
  platformCaptions: {},
  platformIds: ['instagram'],
  scheduledAt: null,
  timezone: 'Asia/Karachi',
  status: 'draft',
  contentType: 'image',
  priority: 'normal',
  tags: [],
  assigneeLabel: '',
  internalNotes: '',
  mediaIds: [],
  checklist: [],
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
});

describe('MemoryRepository', () => {
  it('round-trips rows and scopes by workspace', async () => {
    const repo = new MemoryRepository();
    await repo.put('workspaces', ws('w1'));
    await repo.put('posts', post('p1', 'w1'));
    await repo.put('posts', post('p2', 'w2'));
    expect(await repo.all('posts')).toHaveLength(2);
    expect(await repo.byWorkspace('posts', 'w1')).toHaveLength(1);
    expect((await repo.get<Post>('posts', 'p1'))?.title).toBe('T');
    await repo.remove('posts', 'p1');
    expect(await repo.all('posts')).toHaveLength(1);
    expect(repo.persistent).toBe(false);
  });

  it('clearWorkspace removes only that workspace', async () => {
    const repo = new MemoryRepository();
    await repo.put('workspaces', ws('w1'));
    await repo.put('workspaces', ws('w2'));
    await repo.put('posts', post('p1', 'w1'));
    await repo.put('posts', post('p2', 'w2'));
    await repo.clearWorkspace('w1');
    expect(await repo.all('workspaces')).toHaveLength(1);
    expect(await repo.all('posts')).toHaveLength(1);
  });
});

describe('backup', () => {
  it('builds, validates and parses a backup', async () => {
    const repo = new MemoryRepository();
    await repo.put('workspaces', ws('w1'));
    await repo.put('posts', post('p1', 'w1'));
    const backup = await buildBackup(repo);
    expect(validateBackup(backup)).toEqual([]);
    const parsed = parseBackup(JSON.stringify(backup));
    expect(parsed.ok).toBe(true);
    expect(parsed.backup?.data.posts).toHaveLength(1);
  });

  it('rejects corrupt and foreign files', () => {
    expect(parseBackup('{nope').ok).toBe(false);
    expect(parseBackup('{"app":"other"}').ok).toBe(false);
    expect(validateBackup({ app: 'socialcalendar', schemaVersion: 99, exportedAt: 'x', data: {} }).length).toBeGreaterThan(0);
  });

  it('detects duplicates and remaps ids for restore-as-copy', async () => {
    const repo = new MemoryRepository();
    const wid = uid();
    await repo.put('workspaces', ws(wid));
    await repo.put('posts', post('p1', wid));
    const backup = await buildBackup(repo, wid);
    expect(findDuplicateWorkspaces(backup, [wid])).toEqual([wid]);
    const remapped = remapBackupIds(backup);
    const newWs = (remapped.data.workspaces[0] as Workspace).id;
    expect(newWs).not.toBe(wid);
    expect((remapped.data.posts[0] as Post).workspaceId).toBe(newWs);
    expect(findDuplicateWorkspaces(remapped, [wid])).toEqual([]);
  });

  it('workspace backup excludes other workspaces', async () => {
    const repo = new MemoryRepository();
    await repo.put('workspaces', ws('w1'));
    await repo.put('workspaces', ws('w2'));
    await repo.put('posts', post('p1', 'w1'));
    await repo.put('posts', post('p2', 'w2'));
    const backup = await buildBackup(repo, 'w1');
    expect(backup.data.workspaces).toHaveLength(1);
    expect(backup.data.posts).toHaveLength(1);
  });
});
