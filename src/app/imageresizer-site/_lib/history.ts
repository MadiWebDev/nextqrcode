/**
 * Local project history: a short, on-device log of what the tools did
 * (tool name + a text summary like "resized photo.jpg → 800×600"). It stores
 * CONFIG AND TEXT ONLY — never image data, never file contents — and the
 * user can clear it at any time from the History panel. Nothing is sent
 * anywhere; the log lives in this browser's localStorage.
 */

const KEY = 'imageresizer:history:v1';
const MAX_ENTRIES = 50;

export interface HistoryEntry {
  at: number;
  tool: string;
  summary: string;
}

export function recordHistory(tool: string, summary: string): void {
  try {
    if (typeof window === 'undefined') return;
    const entries = listHistory();
    entries.unshift({ at: Date.now(), tool, summary });
    window.localStorage.setItem(KEY, JSON.stringify(entries.slice(0, MAX_ENTRIES)));
  } catch {
    // History is a convenience; never let it break a tool.
  }
}

export function listHistory(): HistoryEntry[] {
  try {
    if (typeof window === 'undefined') return [];
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as HistoryEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function clearHistory(): void {
  try {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}
