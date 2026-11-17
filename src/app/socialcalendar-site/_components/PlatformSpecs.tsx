'use client';

import { useState } from 'react';
import { useStore } from '../_lib/store';
import { PLATFORMS, PLATFORM_SPECS_REVIEWED } from '../_lib/platforms';
import type { PlatformConfig } from '../_lib/types';

const inputCls =
  'w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground';

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

function aspectLabel(width: number, height: number): string {
  const g = gcd(width, height) || 1;
  return `${width / g}:${height / g}`;
}

/**
 * Platform specifications viewer + per-workspace limit overrides
 * (spec §8). Registry values are guidance compiled on the review date
 * shown; a custom limit set here is what the post editor's counters
 * actually enforce for this workspace.
 */
export default function PlatformSpecs() {
  const store = useStore();
  const ws = store.activeWorkspace!;
  const [openId, setOpenId] = useState<string>('');
  const configs = store.data.platformConfigs.filter((c) => c.workspaceId === ws.id);

  const configFor = (platformId: string): PlatformConfig | undefined =>
    configs.find((c) => c.platformId === platformId);

  const saveConfig = async (platformId: string, patch: Partial<PlatformConfig>) => {
    const existing = configFor(platformId);
    await store.put('platformConfigs', {
      workspaceId: ws.id,
      platformId,
      customCharLimit: existing?.customCharLimit,
      notes: existing?.notes,
      ...patch,
    } satisfies PlatformConfig);
  };

  return (
    <section aria-labelledby="specs-h" className="rounded-xl border border-border bg-card p-5">
      <h2 id="specs-h" className="text-lg font-semibold">
        Platform specifications
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Guidance compiled from public platform documentation — specifications last reviewed{' '}
        {PLATFORM_SPECS_REVIEWED}. Platforms change their limits without notice, so treat these
        as planning guidance, not guarantees. If your account has a different limit (for example
        a premium tier), set a custom limit here and the editor counters will use yours.
      </p>
      <ul className="mt-4 divide-y divide-border">
        {PLATFORMS.map((spec) => {
          const config = configFor(spec.id);
          const open = openId === spec.id;
          return (
            <li key={spec.id} className="py-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <button
                  type="button"
                  className="flex items-center gap-2 text-left"
                  aria-expanded={open}
                  onClick={() => setOpenId(open ? '' : spec.id)}
                >
                  <span
                    className="inline-block h-3 w-3 rounded-full"
                    style={{ backgroundColor: spec.color }}
                    aria-hidden="true"
                  />
                  <span className="text-sm font-semibold">{spec.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {spec.charLimit > 0
                      ? `${config?.customCharLimit ?? spec.charLimit} characters${config?.customCharLimit !== undefined ? ' (custom)' : ''}`
                      : 'Visual-first — no caption limit'}
                    {' · '}
                    up to {spec.maxHashtagsGuidance} hashtags (guidance)
                  </span>
                </button>
                <span className="text-xs text-muted-foreground">{open ? 'Hide details' : 'Show details'}</span>
              </div>
              {open && (
                <div className="mt-3 space-y-3 text-sm">
                  <p className="text-muted-foreground">{spec.notes}</p>
                  <p>
                    <span className="font-medium">Hashtags:</span> {spec.hashtagGuidance}
                  </p>
                  {spec.imageSpecs.length > 0 && (
                    <div>
                      <p className="font-medium">Images</p>
                      <ul className="mt-1 list-inside list-disc text-muted-foreground">
                        {spec.imageSpecs.map((s) => (
                          <li key={s.label}>
                            {s.label}: {s.width}×{s.height}px ({aspectLabel(s.width, s.height)})
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {spec.videoSpecs.length > 0 && (
                    <div>
                      <p className="font-medium">Video</p>
                      <ul className="mt-1 list-inside list-disc text-muted-foreground">
                        {spec.videoSpecs.map((s) => (
                          <li key={s.label}>
                            {s.label}: {s.width}×{s.height}px ({aspectLabel(s.width, s.height)}), up to{' '}
                            {s.maxDurationSec}s
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="flex flex-wrap items-end gap-3">
                    <label className="text-sm font-medium">
                      My character limit (optional)
                      <input
                        type="number"
                        min={0}
                        placeholder={String(spec.charLimit)}
                        className={`${inputCls} mt-1 w-40`}
                        value={config?.customCharLimit ?? ''}
                        onChange={(e) =>
                          void saveConfig(spec.id, {
                            customCharLimit: e.target.value === '' ? undefined : Number(e.target.value),
                          })
                        }
                      />
                    </label>
                    <label className="min-w-52 flex-1 text-sm font-medium">
                      My notes
                      <input
                        className={`${inputCls} mt-1`}
                        placeholder="e.g. Premium account — longer posts allowed"
                        value={config?.notes ?? ''}
                        onChange={(e) => void saveConfig(spec.id, { notes: e.target.value })}
                      />
                    </label>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
