'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { Download, Pause, Play, RotateCcw, Trash2, X } from 'lucide-react';
import { ProcessingQueue, type QueueItem } from '../_lib/engine/queue';
import { downloadBlob, filesToZip } from '../_lib/engine/export';
import { formatBytes } from '../_lib/format';
import { recordHistory } from '../_lib/history';
import { FileDrop } from './FileDrop';

export interface BulkProcessOutcome {
  blob: Blob;
  filename: string;
}

export interface BulkProcessorProps {
  /** Tool-specific settings controls, rendered above the queue. */
  settings: ReactNode;
  /** Process one file. Must honour ctx.signal.cancelled cooperatively. */
  processFile: (
    file: File,
    ctx: { signal: { cancelled: boolean }; report: (fraction: number) => void }
  ) => Promise<BulkProcessOutcome>;
  zipName: string;
  dropLabel?: string;
  /** When set, finished files + ZIP downloads are logged to the on-device history. */
  historyLabel?: string;
}

interface TrackedFile {
  file: File;
  thumbUrl: string;
}

const STATUS_LABEL: Record<QueueItem<BulkProcessOutcome>['status'], string> = {
  queued: 'Queued',
  processing: 'Processing…',
  done: 'Done',
  error: 'Failed',
  cancelled: 'Cancelled',
};

const STATUS_CLASS: Record<QueueItem<BulkProcessOutcome>['status'], string> = {
  queued: 'bg-muted text-muted-foreground',
  processing: 'bg-primary/10 text-primary',
  done: 'bg-emerald-600/10 text-emerald-700 dark:text-emerald-400',
  error: 'bg-destructive/10 text-destructive',
  cancelled: 'bg-muted text-muted-foreground',
};

/**
 * The shared batch workspace: multi-file drop, controlled-concurrency queue
 * (pause / resume / cancel / retry), per-file progress and errors, single
 * downloads and a ZIP of everything that succeeded.
 */
export function BulkProcessor({ settings, processFile, zipName, dropLabel, historyLabel }: BulkProcessorProps) {
  const [queue] = useState(() => new ProcessingQueue<BulkProcessOutcome>(2));

  const processRef = useRef(processFile);
  useEffect(() => {
    processRef.current = processFile;
  }, [processFile]);
  const historyLabelRef = useRef(historyLabel);
  useEffect(() => {
    historyLabelRef.current = historyLabel;
  }, [historyLabel]);

  const [items, setItems] = useState<QueueItem<BulkProcessOutcome>[]>([]);
  const [paused, setPaused] = useState(false);
  const [zipping, setZipping] = useState(false);
  const [zipError, setZipError] = useState<string | null>(null);
  const [tracked, setTracked] = useState(() => new Map<string, TrackedFile>());
  const trackedRef = useRef(tracked);
  useEffect(() => {
    trackedRef.current = tracked;
  }, [tracked]);

  useEffect(() => {
    const unsubscribe = queue.subscribe(() => setItems(queue.snapshot()));
    return unsubscribe;
  }, [queue]);

  // Release every thumbnail object URL when the tool unmounts.
  useEffect(() => {
    return () => {
      for (const entry of trackedRef.current.values()) URL.revokeObjectURL(entry.thumbUrl);
    };
  }, []);

  const addFiles = useCallback(
    (files: File[]) => {
      const additions = new Map<string, TrackedFile>();
      for (const file of files) {
        const id = queue.add(file.name, async (ctx) => {
          const outcome = await processRef.current(file, {
            signal: ctx.signal,
            report: ctx.reportProgress,
          });
          if (historyLabelRef.current) {
            recordHistory(
              historyLabelRef.current,
              `${file.name} → ${outcome.filename} (${formatBytes(outcome.blob.size)})`
            );
          }
          return outcome;
        });
        additions.set(id, { file, thumbUrl: URL.createObjectURL(file) });
      }
      setTracked((prev) => new Map([...prev, ...additions]));
      setItems(queue.snapshot());
    },
    [queue]
  );

  const removeItem = (id: string) => {
    setTracked((prev) => {
      const entry = prev.get(id);
      if (entry) URL.revokeObjectURL(entry.thumbUrl);
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
    queue.remove(id);
  };

  const clearFinished = () => {
    setTracked((prev) => {
      const next = new Map(prev);
      for (const item of items) {
        if (item.status === 'done' || item.status === 'error' || item.status === 'cancelled') {
          const entry = next.get(item.id);
          if (entry) URL.revokeObjectURL(entry.thumbUrl);
          next.delete(item.id);
        }
      }
      return next;
    });
    queue.clearFinished();
  };

  const downloadAll = async () => {
    const done = items.filter((i) => i.status === 'done' && i.result);
    if (done.length === 0) return;
    setZipping(true);
    setZipError(null);
    try {
      const blob = await filesToZip(done.map((i) => ({ name: i.result!.filename, blob: i.result!.blob })));
      downloadBlob(blob, zipName);
      if (historyLabelRef.current) {
        recordHistory(historyLabelRef.current, `${done.length} file(s) downloaded as ${zipName}`);
      }
    } catch (err) {
      setZipError(err instanceof Error ? err.message : 'ZIP creation failed.');
    } finally {
      setZipping(false);
    }
  };

  const counts = {
    queued: items.filter((i) => i.status === 'queued').length,
    processing: items.filter((i) => i.status === 'processing').length,
    done: items.filter((i) => i.status === 'done').length,
    error: items.filter((i) => i.status === 'error').length,
    cancelled: items.filter((i) => i.status === 'cancelled').length,
  };
  const doneItems = items.filter((i) => i.status === 'done' && i.result);

  return (
    <div className="w-full min-w-0">
      <FileDrop onFiles={addFiles} multiple label={dropLabel ?? 'Drop images here, or click to browse'} />
      <div className="mt-5">{settings}</div>

      {items.length > 0 && (
        <div className="mt-6">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-medium mr-auto">
              {items.length} file{items.length === 1 ? '' : 's'} · {counts.done} done
              {counts.error > 0 && <span className="text-destructive"> · {counts.error} failed</span>}
              {counts.processing > 0 && <span className="text-muted-foreground"> · {counts.processing} processing</span>}
              {counts.queued > 0 && <span className="text-muted-foreground"> · {counts.queued} queued</span>}
            </p>
            <button
              type="button"
              onClick={() => {
                if (paused) queue.resume();
                else queue.pause();
                setPaused(!paused);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:border-primary/60 transition-colors"
            >
              {paused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
              {paused ? 'Resume' : 'Pause'}
            </button>
            <button
              type="button"
              onClick={() => queue.cancelAll()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:border-destructive/60 transition-colors"
            >
              <X className="w-3.5 h-3.5" /> Cancel all
            </button>
            <button
              type="button"
              onClick={clearFinished}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:border-primary/60 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear finished
            </button>
            <button
              type="button"
              onClick={downloadAll}
              disabled={doneItems.length === 0 || zipping}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary text-primary-foreground px-3 py-1.5 text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              {zipping ? 'Building ZIP…' : `Download all (${doneItems.length}) as ZIP`}
            </button>
          </div>
          {zipError && (
            <p role="alert" className="mt-2 text-sm text-destructive">
              {zipError}
            </p>
          )}

          <ul className="mt-4 divide-y divide-border rounded-xl border border-border bg-card">
            {items.map((item) => {
              const trackedFile = tracked.get(item.id);
              return (
                <li key={item.id} className="flex items-center gap-3 px-3 py-2.5 min-w-0">
                  {trackedFile && (
                    // eslint-disable-next-line @next/next/no-img-element -- local object URL thumbnail
                    <img src={trackedFile.thumbUrl} alt="" className="w-11 h-11 rounded-md object-cover border border-border shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {trackedFile ? formatBytes(trackedFile.file.size) : ''}
                      {item.result && <> → {formatBytes(item.result.blob.size)}</>}
                      {item.error && <span className="text-destructive"> · {item.error}</span>}
                    </p>
                    {item.status === 'processing' && (
                      <div className="mt-1.5 h-1.5 rounded bg-muted overflow-hidden">
                        <div className="h-full bg-primary transition-all" style={{ width: `${Math.round(item.progress * 100)}%` }} />
                      </div>
                    )}
                  </div>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${STATUS_CLASS[item.status]}`}>
                    {STATUS_LABEL[item.status]}
                  </span>
                  {item.status === 'done' && item.result && (
                    <button
                      type="button"
                      onClick={() => downloadBlob(item.result!.blob, item.result!.filename)}
                      aria-label={`Download ${item.result.filename}`}
                      className="shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-lg border border-border hover:border-primary/60 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  )}
                  {(item.status === 'error' || item.status === 'cancelled') && (
                    <button
                      type="button"
                      onClick={() => queue.retry(item.id)}
                      aria-label={`Retry ${item.label}`}
                      className="shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-lg border border-border hover:border-primary/60 transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    aria-label={`Remove ${item.label}`}
                    className="shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-lg border border-border hover:border-destructive/60 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
