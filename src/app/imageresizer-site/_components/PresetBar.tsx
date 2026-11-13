'use client';

/**
 * Save / load / delete / export / import bar for named presets of one tool
 * scope. Presets are settings-only JSON kept in this browser (see _lib/presets).
 */
import { useRef, useState } from 'react';
import {
  deletePreset,
  exportPresetsJson,
  importPresetsJson,
  listPresets,
  savePreset,
  type StoredPreset,
} from '../_lib/presets';

const btnCls =
  'rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium hover:bg-accent disabled:opacity-50';

export function PresetBar({
  scope,
  getCurrent,
  onLoad,
}: {
  scope: string;
  getCurrent: () => unknown;
  onLoad: (data: unknown) => void;
}) {
  const [presets, setPresets] = useState<StoredPreset[]>(() => listPresets(scope));
  const [name, setName] = useState('');
  const [selected, setSelected] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const importRef = useRef<HTMLInputElement>(null);

  const refresh = () => setPresets(listPresets(scope));

  const handleSave = () => {
    if (!name.trim()) {
      setMessage('Give the preset a name first.');
      return;
    }
    savePreset(scope, name, getCurrent());
    setMessage(`Saved preset "${name.trim()}".`);
    setName('');
    refresh();
  };

  const handleLoad = () => {
    const preset = presets.find((p) => p.name === selected);
    if (!preset) {
      setMessage('Choose a preset to load.');
      return;
    }
    onLoad(preset.data);
    setMessage(`Loaded preset "${preset.name}".`);
  };

  const handleDelete = () => {
    if (!selected) return;
    deletePreset(scope, selected);
    setMessage(`Deleted preset "${selected}".`);
    setSelected('');
    refresh();
  };

  const handleExport = () => {
    const blob = new Blob([exportPresetsJson(scope)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `imageresizer-presets-${scope}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  };

  const handleImport = async (file: File | undefined) => {
    if (!file) return;
    const text = await file.text();
    const outcome = importPresetsJson(scope, text);
    setMessage(
      outcome.error ?? `Imported ${outcome.imported} preset${outcome.imported === 1 ? '' : 's'}.`
    );
    refresh();
  };

  return (
    <div className="rounded-xl border border-dashed border-border p-3">
      <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        My presets (saved in this browser only)
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Preset name"
          maxLength={48}
          className="min-w-36 flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-sm"
          aria-label="Preset name"
        />
        <button type="button" className={btnCls} onClick={handleSave}>
          Save current
        </button>
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="rounded-lg border border-border bg-background px-2 py-1.5 text-sm"
          aria-label="Saved presets"
        >
          <option value="">Saved presets…</option>
          {presets.map((p) => (
            <option key={p.name} value={p.name}>
              {p.name}
            </option>
          ))}
        </select>
        <button type="button" className={btnCls} onClick={handleLoad} disabled={!selected}>
          Load
        </button>
        <button type="button" className={btnCls} onClick={handleDelete} disabled={!selected}>
          Delete
        </button>
        <button type="button" className={btnCls} onClick={handleExport} disabled={presets.length === 0}>
          Export JSON
        </button>
        <button type="button" className={btnCls} onClick={() => importRef.current?.click()}>
          Import JSON
        </button>
        <input
          ref={importRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={(e) => {
            void handleImport(e.target.files?.[0]);
            e.target.value = '';
          }}
        />
      </div>
      {message && <p className="mt-2 text-xs text-muted-foreground">{message}</p>}
    </div>
  );
}
