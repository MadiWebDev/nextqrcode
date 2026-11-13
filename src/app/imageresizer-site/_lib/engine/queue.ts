/**
 * Processing queue with controlled concurrency, pause/resume, per-item
 * cancel and retry. Framework-agnostic: the UI subscribes to snapshots.
 *
 * Concurrency defaults to 2 — image encode/decode is heavy, and running
 * many large jobs at once exhausts memory on low-end devices (master
 * prompt Phase 4F: "Do not process hundreds of huge files simultaneously").
 */

export type QueueItemStatus = 'queued' | 'processing' | 'done' | 'error' | 'cancelled';

export interface QueueItem<T> {
  id: string;
  label: string;
  status: QueueItemStatus;
  progress: number; // 0–1, as reported by the job
  result?: T;
  error?: string;
}

export interface QueueJobContext {
  signal: { cancelled: boolean };
  reportProgress: (fraction: number) => void;
}

export type QueueJob<T> = (ctx: QueueJobContext) => Promise<T>;

interface InternalItem<T> extends QueueItem<T> {
  job: QueueJob<T>;
  signal: { cancelled: boolean };
}

export class ProcessingQueue<T> {
  private items: InternalItem<T>[] = [];
  private running = 0;
  private paused = false;
  private nextId = 1;
  private listeners = new Set<() => void>();
  readonly concurrency: number;

  constructor(concurrency = 2) {
    this.concurrency = Math.max(1, Math.min(4, Math.floor(concurrency) || 1));
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private emit(): void {
    for (const listener of this.listeners) listener();
  }

  snapshot(): QueueItem<T>[] {
    return this.items.map(({ id, label, status, progress, result, error }) => ({
      id, label, status, progress, result, error,
    }));
  }

  add(label: string, job: QueueJob<T>): string {
    const id = `q${this.nextId++}`;
    this.items.push({
      id, label, status: 'queued', progress: 0,
      job, signal: { cancelled: false },
    });
    this.emit();
    this.pump();
    return id;
  }

  pause(): void {
    this.paused = true;
    this.emit();
  }

  resume(): void {
    this.paused = false;
    this.emit();
    this.pump();
  }

  get isPaused(): boolean {
    return this.paused;
  }

  cancel(id: string): void {
    const item = this.items.find((i) => i.id === id);
    if (!item) return;
    if (item.status === 'queued') {
      item.status = 'cancelled';
    } else if (item.status === 'processing') {
      item.signal.cancelled = true;
    }
    this.emit();
  }

  cancelAll(): void {
    for (const item of this.items) {
      if (item.status === 'queued') item.status = 'cancelled';
      if (item.status === 'processing') item.signal.cancelled = true;
    }
    this.emit();
  }

  retry(id: string): void {
    const item = this.items.find((i) => i.id === id);
    if (!item || (item.status !== 'error' && item.status !== 'cancelled')) return;
    item.status = 'queued';
    item.progress = 0;
    item.error = undefined;
    item.result = undefined;
    item.signal = { cancelled: false };
    this.emit();
    this.pump();
  }

  remove(id: string): void {
    const item = this.items.find((i) => i.id === id);
    if (item && item.status === 'processing') item.signal.cancelled = true;
    this.items = this.items.filter((i) => i.id !== id);
    this.emit();
  }

  clearFinished(): void {
    this.items = this.items.filter(
      (i) => i.status === 'queued' || i.status === 'processing'
    );
    this.emit();
  }

  get counts(): Record<QueueItemStatus, number> {
    const out: Record<QueueItemStatus, number> = {
      queued: 0, processing: 0, done: 0, error: 0, cancelled: 0,
    };
    for (const item of this.items) out[item.status]++;
    return out;
  }

  private pump(): void {
    if (this.paused) return;
    while (this.running < this.concurrency) {
      const next = this.items.find((i) => i.status === 'queued');
      if (!next) return;
      void this.runItem(next);
    }
  }

  private async runItem(item: InternalItem<T>): Promise<void> {
    item.status = 'processing';
    this.running++;
    this.emit();
    try {
      const result = await item.job({
        signal: item.signal,
        reportProgress: (fraction) => {
          item.progress = Math.min(1, Math.max(0, fraction));
          this.emit();
        },
      });
      if (item.signal.cancelled) {
        item.status = 'cancelled';
      } else {
        item.result = result;
        item.progress = 1;
        item.status = 'done';
      }
    } catch (err) {
      if (item.signal.cancelled) {
        item.status = 'cancelled';
      } else {
        item.status = 'error';
        item.error = err instanceof Error ? err.message : 'Processing failed.';
      }
    } finally {
      this.running--;
      this.emit();
      this.pump();
    }
  }
}
