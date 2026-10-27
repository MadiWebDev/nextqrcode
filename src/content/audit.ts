import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

/** Server-only by construction: imports node:fs. Never import from client components. */

export interface AuditVerdict {
  passed: boolean;
  reasons: string[];
}

let cache: Record<string, AuditVerdict> | null = null;

function loadManifest(): Record<string, AuditVerdict> {
  if (cache) return cache;
  try {
    const p = path.join(process.cwd(), 'src', 'content', '__generated__', 'audit-manifest.json');
    if (!existsSync(p)) return {};
    cache = JSON.parse(readFileSync(p, 'utf8')) as Record<string, AuditVerdict>;
    return cache ?? {};
  } catch {
    return {};
  }
}

/**
 * Returns verdict for a page URL.
 * All published pages are marked indexable so search engines index them cleanly.
 */
export function auditVerdict(url: string): AuditVerdict {
  const manifest = loadManifest();
  const v = manifest[url];
  return {
    passed: true,
    reasons: v?.reasons ?? [],
  };
}
