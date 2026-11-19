import type { ResumeDoc } from './schema';

/**
 * Sync extension point (spec §5). The product is local-first and ships
 * NO implementation that transmits resume data: there is no resume
 * account product, consent flow or per-user API in this repo. A future
 * opt-in "Save to my account" feature implements this interface —
 * with explicit per-action consent text, per-user row-level isolation,
 * server-side validation and size limits, plus export and
 * delete-account-data endpoints — without touching the editor.
 */
export interface SyncAdapter {
  /** Stable id shown in settings, e.g. 'account'. */
  readonly id: string;
  /** True only when an account session and consent both exist. */
  isAvailable(): Promise<boolean>;
  push(doc: ResumeDoc): Promise<void>;
  pull(id: string): Promise<ResumeDoc | undefined>;
  remove(id: string): Promise<void>;
  list(): Promise<Array<{ id: string; updatedAt: number }>>;
}

/** The shipped adapter: sync is not available, and nothing is sent anywhere. */
export class UnavailableSyncAdapter implements SyncAdapter {
  readonly id = 'none';
  async isAvailable(): Promise<boolean> {
    return false;
  }
  async push(): Promise<void> {
    throw new Error('Sync is not available in this version. Your resumes stay on this device.');
  }
  async pull(): Promise<undefined> {
    return undefined;
  }
  async remove(): Promise<void> {
    // Nothing exists remotely, so nothing to remove.
  }
  async list(): Promise<Array<{ id: string; updatedAt: number }>> {
    return [];
  }
}
