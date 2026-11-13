/**
 * Local preset store (browser localStorage). Presets are CONFIG ONLY —
 * settings objects, never image data — matching the site's privacy model.
 * Everything is namespaced per tool "scope" and versioned; corrupt data is
 * ignored rather than crashing a tool.
 */

const KEY = 'imageresizer:presets:v1';

export interface StoredPreset {
  name: string;
  scope: string;
  data: unknown;
  updatedAt: number;
}

function readAll(): StoredPreset[] {
  try {
    if (typeof window === 'undefined') return [];
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoredPreset[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(presets: StoredPreset[]): void {
  try {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(KEY, JSON.stringify(presets));
  } catch {
    // Storage full/blocked: presets are a convenience, failing silently is
    // better than breaking the tool.
  }
}

export function listPresets(scope: string): StoredPreset[] {
  return readAll()
    .filter((p) => p.scope === scope)
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function savePreset(scope: string, name: string, data: unknown): void {
  const trimmed = name.trim();
  if (!trimmed) return;
  const all = readAll().filter((p) => !(p.scope === scope && p.name === trimmed));
  all.push({ name: trimmed, scope, data, updatedAt: Date.now() });
  writeAll(all);
}

export function deletePreset(scope: string, name: string): void {
  writeAll(readAll().filter((p) => !(p.scope === scope && p.name === name)));
}

/** Serialize one scope's presets for sharing/backup. */
export function exportPresetsJson(scope: string): string {
  return JSON.stringify(
    { app: 'imageresizer.freeqrcode.tools', kind: 'presets', version: 1, scope, presets: listPresets(scope) },
    null,
    2
  );
}

/** Import presets JSON (same scope only). Returns how many were imported. */
export function importPresetsJson(scope: string, json: string): { imported: number; error?: string } {
  try {
    const parsed = JSON.parse(json) as { kind?: string; presets?: StoredPreset[] };
    if (parsed.kind !== 'presets' || !Array.isArray(parsed.presets)) {
      return { imported: 0, error: 'That file is not an Image Resizer presets export.' };
    }
    let imported = 0;
    for (const p of parsed.presets) {
      if (p && typeof p.name === 'string' && 'data' in p) {
        savePreset(scope, p.name, p.data);
        imported += 1;
      }
    }
    return { imported };
  } catch {
    return { imported: 0, error: 'That file could not be read as JSON.' };
  }
}
