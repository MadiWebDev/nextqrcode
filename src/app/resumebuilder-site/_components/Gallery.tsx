'use client';

/**
 * Template gallery (spec §7): filter by profession / category /
 * ATS-safe / photo / columns, live-rendered thumbnails from each
 * template's own fictional sample, and "Use this template" which
 * creates a real resume in the local store and opens the editor.
 */
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { TEMPLATE_META, loadTemplate, type TemplateMeta } from '../_lib/templates/registry';
import type { TemplateDef } from '../_lib/templates/types';
import { getStore } from '../_lib/db';
import { newResumeDoc } from '../_lib/defaults';
import { TemplateView } from './TemplateView';

function Thumb({ meta }: { meta: TemplateMeta }) {
  const [def, setDef] = useState<TemplateDef | null>(null);
  useEffect(() => {
    let cancelled = false;
    void loadTemplate(meta.id).then((d) => {
      if (!cancelled) setDef(d);
    });
    return () => {
      cancelled = true;
    };
  }, [meta.id]);
  if (!def) {
    return <div className="flex h-64 items-center justify-center text-xs text-muted-foreground">Loading preview…</div>;
  }
  const doc = def.sample();
  return (
    <div className="pointer-events-none h-64 overflow-hidden bg-neutral-100" aria-hidden>
      <div style={{ transform: 'scale(0.30)', transformOrigin: 'top left', width: '333%' }}>
        <TemplateView doc={doc} template={def} />
      </div>
    </div>
  );
}

export function Gallery() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [atsOnly, setAtsOnly] = useState(false);
  const [photoOnly, setPhotoOnly] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [defs, setDefs] = useState<Record<string, TemplateDef>>({});

  useEffect(() => {
    let cancelled = false;
    void Promise.all(TEMPLATE_META.map((m) => loadTemplate(m.id))).then((loaded) => {
      if (cancelled) return;
      setDefs(Object.fromEntries(loaded.map((d) => [d.id, d])));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const categories = useMemo(
    () => Array.from(new Set(TEMPLATE_META.map((m) => m.category))).sort(),
    [],
  );

  const filtered = TEMPLATE_META.filter((m) => {
    const def = defs[m.id];
    if (category !== 'all' && m.category !== category) return false;
    if (query && !`${m.name} ${m.profession}`.toLowerCase().includes(query.toLowerCase())) return false;
    if (atsOnly && def && !def.atsSafe) return false;
    if (photoOnly && def && !def.supportsPhoto) return false;
    return true;
  });

  const applyTemplate = async (meta: TemplateMeta) => {
    setBusyId(meta.id);
    try {
      const store = await getStore();
      const doc = newResumeDoc({ templateId: meta.id, title: `${meta.profession} resume` });
      const def = defs[meta.id];
      if (def?.fontPair) doc.theme.fontPair = def.fontPair;
      doc.theme.accent = def?.tokens.accent ?? doc.theme.accent;
      await store.putResume(doc);
      router.push('/app');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-end gap-3">
        <label className="block flex-1 space-y-1" style={{ minWidth: 220 }}>
          <span className="text-sm font-medium">Search by profession</span>
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="e.g. nurse, accountant, driver" />
        </label>
        <label className="block space-y-1">
          <span className="text-sm font-medium">Category</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="min-h-11 rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className="flex min-h-11 items-center gap-2 text-sm">
          <input type="checkbox" checked={atsOnly} onChange={(e) => setAtsOnly(e.target.checked)} className="h-5 w-5" />
          ATS-safe only
        </label>
        <label className="flex min-h-11 items-center gap-2 text-sm">
          <input type="checkbox" checked={photoOnly} onChange={(e) => setPhotoOnly(e.target.checked)} className="h-5 w-5" />
          With photo
        </label>
      </div>
      <p className="mt-3 text-sm text-muted-foreground" role="status">
        {filtered.length} of {TEMPLATE_META.length} templates
      </p>
      <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((meta) => {
          const def = defs[meta.id];
          return (
            <article key={meta.id} className="overflow-hidden rounded-lg border bg-card">
              <Thumb meta={meta} />
              <div className="space-y-2 p-4">
                <h2 className="font-semibold">{meta.name}</h2>
                <p className="text-sm text-muted-foreground">
                  {meta.profession} · {meta.category}
                </p>
                <p className="flex flex-wrap gap-1.5 text-xs">
                  <span className={`rounded-full px-2 py-0.5 ${def?.atsSafe ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-100' : 'bg-violet-100 text-violet-900 dark:bg-violet-900 dark:text-violet-100'}`}>
                    {def?.atsSafe ? 'ATS-safe' : 'Designed'}
                  </span>
                  {def?.supportsPhoto ? (
                    <span className="rounded-full bg-muted px-2 py-0.5">Photo</span>
                  ) : null}
                  <span className="rounded-full bg-muted px-2 py-0.5">
                    {def ? `${def.columns} column${def.columns > 1 ? 's' : ''}` : ''}
                  </span>
                </p>
                {def ? <p className="text-sm text-muted-foreground">{def.why}</p> : null}
                <Button type="button" disabled={busyId === meta.id} onClick={() => void applyTemplate(meta)}>
                  {busyId === meta.id ? 'Opening…' : 'Use this template'}
                </Button>
              </div>
            </article>
          );
        })}
      </div>
      {filtered.length === 0 ? (
        <p className="mt-6 text-muted-foreground">No template matches those filters — try clearing one.</p>
      ) : null}
    </div>
  );
}
