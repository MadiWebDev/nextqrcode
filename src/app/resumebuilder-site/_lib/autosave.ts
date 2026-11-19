/**
 * Autosave + multi-tab coordination (spec §5).
 *
 * - Saves are debounced; the UI shows Saving… / Saved locally at HH:MM /
 *   an error state with a one-click backup download.
 * - Multi-tab: every store write broadcasts the resume id + updatedAt on
 *   a BroadcastChannel. A tab holding an older copy that receives a
 *   newer timestamp for the resume it is editing raises a conflict —
 *   the user chooses merge/keep-both; nothing is silently overwritten.
 */

export type SaveStatus =
  | { state: 'idle' }
  | { state: 'saving' }
  | { state: 'saved'; at: number }
  | { state: 'error'; message: string };

export function createDebouncedSaver<T>(
  save: (value: T) => Promise<void>,
  delayMs = 600,
): {
  schedule: (value: T) => void;
  flush: () => Promise<void>;
  onStatus: (cb: (s: SaveStatus) => void) => void;
} {
  let timer: ReturnType<typeof setTimeout> | undefined;
  let pending: T | undefined;
  let hasPending = false;
  let statusCb: ((s: SaveStatus) => void) | undefined;

  const run = async () => {
    if (!hasPending) return;
    const value = pending as T;
    hasPending = false;
    pending = undefined;
    statusCb?.({ state: 'saving' });
    try {
      await save(value);
      statusCb?.({ state: 'saved', at: Date.now() });
    } catch (err) {
      statusCb?.({
        state: 'error',
        message: err instanceof Error ? err.message : 'Saving failed.',
      });
      // Keep the value pending so a later flush can retry.
      pending = value;
      hasPending = true;
    }
  };

  return {
    schedule(value: T) {
      pending = value;
      hasPending = true;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => void run(), delayMs);
    },
    async flush() {
      if (timer) clearTimeout(timer);
      await run();
    },
    onStatus(cb) {
      statusCb = cb;
    },
  };
}

export interface TabMessage {
  type: 'resume-saved';
  resumeId: string;
  updatedAt: number;
  tabId: string;
}

/** Decide whether an incoming tab message conflicts with the local copy. */
export function isConflict(
  local: { id: string; updatedAt: number } | undefined,
  msg: TabMessage,
  ownTabId: string,
): boolean {
  if (!local || msg.tabId === ownTabId) return false;
  return msg.resumeId === local.id && msg.updatedAt > local.updatedAt;
}

export function openTabChannel(tabId: string): {
  post: (resumeId: string, updatedAt: number) => void;
  onMessage: (cb: (msg: TabMessage) => void) => () => void;
  close: () => void;
} {
  if (typeof BroadcastChannel === 'undefined') {
    return { post: () => undefined, onMessage: () => () => undefined, close: () => undefined };
  }
  const channel = new BroadcastChannel('resumebuilder-sync');
  return {
    post(resumeId, updatedAt) {
      const msg: TabMessage = { type: 'resume-saved', resumeId, updatedAt, tabId };
      channel.postMessage(msg);
    },
    onMessage(cb) {
      const handler = (ev: MessageEvent<TabMessage>) => {
        if (ev.data?.type === 'resume-saved') cb(ev.data);
      };
      channel.addEventListener('message', handler);
      return () => channel.removeEventListener('message', handler);
    },
    close() {
      channel.close();
    },
  };
}
