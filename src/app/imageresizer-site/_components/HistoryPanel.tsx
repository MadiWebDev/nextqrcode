'use client';

/**
 * On-device activity history (text summaries only — see _lib/history) with
 * a one-click clear. This is the visible proof of the privacy model: the
 * panel shows exactly what is stored, and it is never image data.
 */
import { useState } from 'react';
import { clearHistory, listHistory, type HistoryEntry } from '../_lib/history';

export function HistoryPanel() {
  const [entries, setEntries] = useState<HistoryEntry[]>(() => listHistory());

  return (
    <section aria-label="Recent activity on this device" className="rounded-xl border border-border bg-card p-4 sm:p-5">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-base font-semibold">Recent activity on this device</h2>
        <span className="ml-auto flex gap-2">
          <button
            type="button"
            onClick={() => setEntries(listHistory())}
            className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium hover:bg-accent"
          >
            Refresh
          </button>
          <button
            type="button"
            onClick={() => {
              clearHistory();
              setEntries([]);
            }}
            disabled={entries.length === 0}
            className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium hover:bg-accent disabled:opacity-50"
          >
            Clear history
          </button>
        </span>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        Stored only in this browser as text summaries (tool + result size). No images, no file
        contents, and nothing is sent to a server.
      </p>
      {entries.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">
          Nothing yet — finished jobs from the bulk tools and pipelines will appear here.
        </p>
      ) : (
        <ul className="mt-3 divide-y divide-border text-sm">
          {entries.slice(0, 15).map((entry, i) => (
            <li key={`${entry.at}-${i}`} className="flex flex-wrap gap-x-3 py-1.5">
              <span className="font-medium">{entry.tool}</span>
              <span className="min-w-0 flex-1 truncate text-muted-foreground">{entry.summary}</span>
              <time className="text-xs text-muted-foreground">
                {new Date(entry.at).toLocaleString()}
              </time>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
