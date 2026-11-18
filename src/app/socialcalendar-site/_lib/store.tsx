'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { createRepository, type Repository } from './repository';
import { WORKSPACE_TABLES, type TableName } from './db';
import {
  nowIso,
  uid,
  type ActivityEntry,
  type ApprovalComment,
  type AutomationRule,
  type BestTimeSlot,
  type Calendar,
  type Campaign,
  type ChecklistTemplate,
  type HashtagGroup,
  type Idea,
  type MediaItem,
  type NotificationSettings,
  type PerformanceEntry,
  type Pillar,
  type PlatformConfig,
  type Post,
  type PostRevision,
  type Reminder,
  type RuleRun,
  type SavedFilter,
  type Series,
  type Template,
  type Workspace,
} from './types';

export type SaveState = 'idle' | 'saving' | 'saved' | 'error' | 'memory';

export interface WorkspaceData {
  calendars: Calendar[];
  posts: Post[];
  media: MediaItem[];
  campaigns: Campaign[];
  pillars: Pillar[];
  hashtagGroups: HashtagGroup[];
  templates: Template[];
  ideas: Idea[];
  checklistTemplates: ChecklistTemplate[];
  comments: ApprovalComment[];
  activity: ActivityEntry[];
  performance: PerformanceEntry[];
  reminders: Reminder[];
  notificationSettings: NotificationSettings | null;
  platformConfigs: PlatformConfig[];
  savedFilters: SavedFilter[];
  bestTimeSlots: BestTimeSlot[];
  revisions: PostRevision[];
  rules: AutomationRule[];
  ruleRuns: RuleRun[];
  series: Series[];
}

const EMPTY_DATA: WorkspaceData = {
  calendars: [],
  posts: [],
  media: [],
  campaigns: [],
  pillars: [],
  hashtagGroups: [],
  templates: [],
  ideas: [],
  checklistTemplates: [],
  comments: [],
  activity: [],
  performance: [],
  reminders: [],
  notificationSettings: null,
  platformConfigs: [],
  savedFilters: [],
  bestTimeSlots: [],
  revisions: [],
  rules: [],
  ruleRuns: [],
  series: [],
};

/** Workspace-scoped tables mirrored into WorkspaceData (same key names).
 *  `kv` is deliberately not mirrored — small settings are read through
 *  the repository directly by the components that own them. */
const DATA_TABLES = WORKSPACE_TABLES.filter(
  (t) => t !== 'notificationSettings' && t !== 'kv',
);

interface UndoEntry {
  label: string;
  postId: string;
  before: Post | null;
  after: Post | null;
}

export interface StoreValue {
  ready: boolean;
  persistent: boolean;
  saveState: SaveState;
  lastSavedAt: string | null;
  repo: Repository | null;
  workspaces: Workspace[];
  activeWorkspace: Workspace | null;
  data: WorkspaceData;
  setActiveWorkspace(id: string): void;
  createWorkspace(name: string, timezone: string): Promise<Workspace>;
  updateWorkspace(ws: Workspace): Promise<void>;
  duplicateWorkspace(id: string): Promise<void>;
  deleteWorkspace(id: string): Promise<void>;
  put(table: TableName, row: unknown): Promise<void>;
  remove(table: TableName, key: string | [string, string]): Promise<void>;
  savePost(post: Post, label?: string): Promise<void>;
  deletePost(id: string): Promise<void>;
  undo(): Promise<void>;
  redo(): Promise<void>;
  canUndo: boolean;
  canRedo: boolean;
  logActivity(entityType: string, entityId: string, action: string, detail: string): Promise<void>;
  reload(): Promise<void>;
}

const StoreContext = createContext<StoreValue | null>(null);

const ACTIVE_WS_KEY = 'socialcalendar:active-workspace';

/**
 * Multi-tab sync (Phase 7): every mutation broadcasts on a
 * BroadcastChannel; other tabs reload their workspace data (debounced,
 * so a batch import in one tab causes one reload, not hundreds). Each
 * tab ignores its own messages via a per-tab client id.
 */
const SYNC_CHANNEL = 'socialcalendar-sync-v1';
const TAB_ID =
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `tab-${Date.now().toString(36)}`;

function broadcastChange(): void {
  try {
    const channel = new BroadcastChannel(SYNC_CHANNEL);
    channel.postMessage({ sender: TAB_ID, at: Date.now() });
    channel.close();
  } catch {
    // BroadcastChannel unsupported — tabs simply stay independent.
  }
}

export function defaultBrand() {
  return {
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
  };
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [repo, setRepo] = useState<Repository | null>(null);
  const [persistent, setPersistent] = useState(true);
  const [ready, setReady] = useState(false);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [data, setData] = useState<WorkspaceData>(EMPTY_DATA);
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [undoStack, setUndoStack] = useState<UndoEntry[]>([]);
  const [redoStack, setRedoStack] = useState<UndoEntry[]>([]);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeIdRef = useRef<string | null>(null);
  useEffect(() => {
    activeIdRef.current = activeId;
  }, [activeId]);

  const markSaving = useCallback(() => {
    setSaveState((s) => (s === 'memory' ? s : 'saving'));
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => setSaveState((s) => (s === 'saving' ? 'saved' : s)), 500);
  }, []);

  const loadWorkspaceData = useCallback(
    async (r: Repository, workspaceId: string): Promise<WorkspaceData> => {
      const out: WorkspaceData = { ...EMPTY_DATA };
      for (const t of DATA_TABLES) {
        const rows = await r.byWorkspace(t, workspaceId);
        (out as unknown as Record<string, unknown>)[t] = rows;
      }
      const ns = await r.get<NotificationSettings>('notificationSettings', workspaceId);
      out.notificationSettings = ns ?? null;
      return out;
    },
    [],
  );

  const reload = useCallback(async () => {
    if (!repo || !activeIdRef.current) return;
    setData(await loadWorkspaceData(repo, activeIdRef.current));
    setWorkspaces(await repo.all<Workspace>('workspaces'));
  }, [repo, loadWorkspaceData]);

  // Listen for changes made in other tabs of this browser.
  const reloadRef = useRef(reload);
  useEffect(() => {
    reloadRef.current = reload;
  }, [reload]);
  useEffect(() => {
    if (typeof BroadcastChannel === 'undefined') return;
    const channel = new BroadcastChannel(SYNC_CHANNEL);
    let timer: ReturnType<typeof setTimeout> | null = null;
    channel.onmessage = (event: MessageEvent<{ sender?: string }>) => {
      if (event.data?.sender === TAB_ID) return;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => void reloadRef.current(), 300);
    };
    return () => {
      if (timer) clearTimeout(timer);
      channel.close();
    };
  }, []);

  // Initialise: repository, workspaces, active workspace.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const r = await createRepository();
      if (cancelled) return;
      setRepo(r);
      setPersistent(r.persistent);
      if (!r.persistent) setSaveState('memory');
      let all = await r.all<Workspace>('workspaces');
      if (all.length === 0) {
        const tz =
          Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
        const ws: Workspace = {
          id: uid(),
          name: 'My workspace',
          timezone: tz,
          weekStart: 1,
          platformIds: ['instagram', 'facebook', 'tiktok', 'linkedin', 'x'],
          brand: defaultBrand(),
          pipeline: ['idea', 'draft', 'in-review', 'approved', 'scheduled', 'published'],
          createdAt: nowIso(),
          updatedAt: nowIso(),
        };
        await r.put('workspaces', ws);
        await r.put('calendars', {
          id: uid(),
          workspaceId: ws.id,
          name: 'Main calendar',
          color: '#0ea5e9',
          createdAt: nowIso(),
        } satisfies Calendar);
        all = [ws];
      }
      if (cancelled) return;
      setWorkspaces(all);
      const stored =
        typeof localStorage !== 'undefined' ? localStorage.getItem(ACTIVE_WS_KEY) : null;
      const initial = all.find((w) => w.id === stored) ?? all[0];
      setActiveId(initial.id);
      setData(await loadWorkspaceData(r, initial.id));
      setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [loadWorkspaceData]);

  const setActiveWorkspace = useCallback(
    (id: string) => {
      if (!repo) return;
      setActiveId(id);
      try {
        localStorage.setItem(ACTIVE_WS_KEY, id);
      } catch {
        /* storage may be unavailable; selection still applies in-memory */
      }
      void loadWorkspaceData(repo, id).then(setData);
      setUndoStack([]);
      setRedoStack([]);
    },
    [repo, loadWorkspaceData],
  );

  const applyLocal = useCallback((table: TableName, row: unknown, removing = false) => {
    if (table === 'notificationSettings') {
      setData((d) => ({
        ...d,
        notificationSettings: removing ? null : (row as NotificationSettings),
      }));
      return;
    }
    if (!(DATA_TABLES as string[]).includes(table)) return;
    setData((d) => {
      const list = [...((d as unknown as Record<string, unknown[]>)[table] ?? [])];
      const rowId =
        table === 'platformConfigs'
          ? `${(row as PlatformConfig).workspaceId}:${(row as PlatformConfig).platformId}`
          : (row as { id: string }).id;
      const idx = list.findIndex((item) => {
        const itemId =
          table === 'platformConfigs'
            ? `${(item as PlatformConfig).workspaceId}:${(item as PlatformConfig).platformId}`
            : (item as { id: string }).id;
        return itemId === rowId;
      });
      if (removing) {
        if (idx >= 0) list.splice(idx, 1);
      } else if (idx >= 0) {
        list[idx] = row;
      } else {
        list.push(row);
      }
      return { ...d, [table]: list };
    });
  }, []);

  const put = useCallback(
    async (table: TableName, row: unknown) => {
      if (!repo) return;
      markSaving();
      try {
        await repo.put(table, row);
        applyLocal(table, row);
        setLastSavedAt(nowIso());
        broadcastChange();
      } catch {
        setSaveState('error');
        throw new Error('Save failed');
      }
    },
    [repo, markSaving, applyLocal],
  );

  const remove = useCallback(
    async (table: TableName, key: string | [string, string]) => {
      if (!repo) return;
      markSaving();
      try {
        const existing =
          table !== 'notificationSettings' && table !== 'platformConfigs'
            ? data[table as keyof WorkspaceData]
            : undefined;
        await repo.remove(table, key);
        if (Array.isArray(existing)) {
          const row = (existing as { id: string }[]).find((r) => r.id === key);
          if (row) applyLocal(table, row, true);
        } else if (table === 'notificationSettings') {
          applyLocal(table, null, true);
        }
        setLastSavedAt(nowIso());
        broadcastChange();
      } catch {
        setSaveState('error');
        throw new Error('Delete failed');
      }
    },
    [repo, markSaving, applyLocal, data],
  );

  const logActivity = useCallback(
    async (entityType: string, entityId: string, action: string, detail: string) => {
      if (!activeIdRef.current) return;
      const entry: ActivityEntry = {
        id: uid(),
        workspaceId: activeIdRef.current,
        entityType,
        entityId,
        action,
        detail,
        createdAt: nowIso(),
      };
      await put('activity', entry);
    },
    [put],
  );

  const savePost = useCallback(
    async (post: Post, label = 'Edit post') => {
      const before = data.posts.find((p) => p.id === post.id) ?? null;
      if (before) {
        const revision: PostRevision = {
          id: uid(),
          postId: post.id,
          workspaceId: post.workspaceId,
          snapshot: before,
          label,
          createdAt: nowIso(),
        };
        await put('revisions', revision);
      }
      await put('posts', post);
      setUndoStack((s) => [...s.slice(-49), { label, postId: post.id, before, after: post }]);
      setRedoStack([]);
    },
    [data.posts, put],
  );

  const deletePost = useCallback(
    async (id: string) => {
      const before = data.posts.find((p) => p.id === id) ?? null;
      if (!before) return;
      const revision: PostRevision = {
        id: uid(),
        postId: id,
        workspaceId: before.workspaceId,
        snapshot: before,
        label: 'Before delete',
        createdAt: nowIso(),
      };
      await put('revisions', revision);
      await remove('posts', id);
      setUndoStack((s) => [
        ...s.slice(-49),
        { label: 'Delete post', postId: id, before, after: null },
      ]);
      setRedoStack([]);
    },
    [data.posts, put, remove],
  );

  const applyUndoEntry = useCallback(
    async (entry: UndoEntry, direction: 'undo' | 'redo') => {
      const target = direction === 'undo' ? entry.before : entry.after;
      if (target) {
        await put('posts', target);
      } else {
        await remove('posts', entry.postId);
      }
    },
    [put, remove],
  );

  const undo = useCallback(async () => {
    const entry = undoStack[undoStack.length - 1];
    if (!entry) return;
    await applyUndoEntry(entry, 'undo');
    setUndoStack((s) => s.slice(0, -1));
    setRedoStack((s) => [...s, entry]);
  }, [undoStack, applyUndoEntry]);

  const redo = useCallback(async () => {
    const entry = redoStack[redoStack.length - 1];
    if (!entry) return;
    await applyUndoEntry(entry, 'redo');
    setRedoStack((s) => s.slice(0, -1));
    setUndoStack((s) => [...s, entry]);
  }, [redoStack, applyUndoEntry]);

  const createWorkspace = useCallback(
    async (name: string, timezone: string): Promise<Workspace> => {
      if (!repo) throw new Error('Store not ready');
      const ws: Workspace = {
        id: uid(),
        name,
        timezone,
        weekStart: 1,
        platformIds: ['instagram', 'facebook', 'tiktok', 'linkedin', 'x'],
        brand: defaultBrand(),
        pipeline: ['idea', 'draft', 'in-review', 'approved', 'scheduled', 'published'],
        createdAt: nowIso(),
        updatedAt: nowIso(),
      };
      await repo.put('workspaces', ws);
      await repo.put('calendars', {
        id: uid(),
        workspaceId: ws.id,
        name: 'Main calendar',
        color: '#0ea5e9',
        createdAt: nowIso(),
      } satisfies Calendar);
      setWorkspaces(await repo.all<Workspace>('workspaces'));
      setActiveWorkspace(ws.id);
      return ws;
    },
    [repo, setActiveWorkspace],
  );

  const updateWorkspace = useCallback(
    async (ws: Workspace) => {
      if (!repo) return;
      await repo.put('workspaces', { ...ws, updatedAt: nowIso() });
      setWorkspaces(await repo.all<Workspace>('workspaces'));
      markSaving();
      setLastSavedAt(nowIso());
    },
    [repo, markSaving],
  );

  const duplicateWorkspace = useCallback(
    async (id: string) => {
      if (!repo) return;
      const { buildBackup, remapBackupIds } = await import('./backup');
      const backup = remapBackupIds(await buildBackup(repo, id));
      const copy = (backup.data.workspaces[0] ?? null) as Workspace | null;
      if (copy) {
        copy.name = `${copy.name} (copy)`;
        backup.data.workspaces[0] = copy;
      }
      await repo.importAll(backup.data, 'merge');
      setWorkspaces(await repo.all<Workspace>('workspaces'));
      if (copy) setActiveWorkspace(copy.id);
    },
    [repo, setActiveWorkspace],
  );

  const deleteWorkspace = useCallback(
    async (id: string) => {
      if (!repo) return;
      await repo.clearWorkspace(id);
      const remaining = await repo.all<Workspace>('workspaces');
      setWorkspaces(remaining);
      if (activeIdRef.current === id && remaining[0]) {
        setActiveWorkspace(remaining[0].id);
      }
    },
    [repo, setActiveWorkspace],
  );

  const value = useMemo<StoreValue>(() => {
    const activeWorkspace = workspaces.find((w) => w.id === activeId) ?? null;
    return {
      ready,
      persistent,
      saveState,
      lastSavedAt,
      repo,
      workspaces,
      activeWorkspace,
      data,
      setActiveWorkspace,
      createWorkspace,
      updateWorkspace,
      duplicateWorkspace,
      deleteWorkspace,
      put,
      remove,
      savePost,
      deletePost,
      undo,
      redo,
      canUndo: undoStack.length > 0,
      canRedo: redoStack.length > 0,
      logActivity,
      reload,
    };
  }, [
    ready,
    persistent,
    saveState,
    lastSavedAt,
    repo,
    workspaces,
    activeId,
    data,
    setActiveWorkspace,
    createWorkspace,
    updateWorkspace,
    duplicateWorkspace,
    deleteWorkspace,
    put,
    remove,
    savePost,
    deletePost,
    undo,
    redo,
    undoStack,
    redoStack,
    logActivity,
    reload,
  ]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside <StoreProvider>');
  return ctx;
}
