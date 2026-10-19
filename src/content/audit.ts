import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

/** Server-only by construction: imports node:fs. Never import from client components. */

/**
 * Reads the build-time audit manifest (scripts/content-audit.ts) to decide
 * per-page indexability. Failing pages → noindex + sitemap exclusion.
 *
 * If the manifest is missing (audit hasn't run — e.g. plain `next dev`
 * without prebuild), pages default to indexable so local development is
 * unaffected; the prebuild step guarantees the manifest exists for
 * production builds.
 */
export interface AuditVerdict {
  passed: boolean;
  reasons: string[];
}

let cache: Record<string, AuditVerdict> | null = null;

function loadManifest(): Record<string, AuditVerdict> {
  if (cache) return cache;
  try {
    const p = join(process.cwd(), 'src', 'content', '__generated__', 'audit-manifest.json');
    if (!existsSync(p)) return {};
    cache = JSON.parse(readFileSync(p, 'utf8')) as Record<string, AuditVerdict>;
    return cache ?? {};
  } catch {
    return {};
  }
}

/** Verdict for a page URL like "/glossary/finder-pattern". */
export function auditVerdict(url: string): AuditVerdict {
  const manifest = loadManifest();
  return manifest[url] ?? { passed: true, reasons: [] };
}
