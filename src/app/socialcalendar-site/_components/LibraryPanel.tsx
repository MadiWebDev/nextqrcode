'use client';

import { useEffect, useMemo, useState } from 'react';
import { INDUSTRIES, LIBRARY_IDEAS } from '../_data/ideas';
import { BUILTIN_TEMPLATES, applyTemplate, extractPlaceholders } from '../_data/templates';
import { getKv, setKv } from '../_lib/kv';
import { getPlatform } from '../_lib/platforms';
import { useStore } from '../_lib/store';
import {
  buildUtmUrl,
  findDuplicateTags,
  parseHashtagInput,
  slugifyCampaign,
} from '../_lib/utm';
import {
  nowIso,
  uid,
  type ChecklistTemplate,
  type HashtagGroup,
  type Idea,
  type Template,
} from '../_lib/types';
import type { EditorSeed } from './calendar/PostEditor';

type Section = 'templates' | 'ideas' | 'hashtags' | 'utm' | 'checklists';

const inputCls = 'w-full rounded-md border border-input bg-background px-2 py-2';
const labelCls = 'block text-sm';
const spanCls = 'mb-1 block font-medium';

function Templates({ openEditor }: { openEditor: (seed: EditorSeed) => void }) {
  const store = useStore();
  const ws = store.activeWorkspace!;
  const [values, setValues] = useState<Record<string, string>>({});
  const [activeId, setActiveId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Template>>({ contentType: 'image' });

  const all: Template[] = useMemo(
    () => [
      ...BUILTIN_TEMPLATES.map((t) => ({
        id: t.id,
        workspaceId: null,
        name: t.name,
        category: t.category,
        caption: t.caption,
        contentType: t.contentType,
        placeholders: extractPlaceholders(t.caption),
        notes: t.notes,
      })),
      ...store.data.templates,
    ],
    [store.data.templates],
  );
  const active = all.find((t) => t.id === activeId) ?? null;

  const applyAndOpen = async (t: Template) => {
    const caption = applyTemplate(t.caption, {
      brand: ws.brand.brandName || 'your brand',
      website: ws.brand.website || '',
      ...values,
    });
    openEditor({
      post: {
        id: uid(),
        workspaceId: ws.id,
        calendarId: store.data.calendars[0]?.id ?? '',
        title: t.name,
        caption,
        description: '',
        platformCaptions: {},
        platformIds: [],
        scheduledAt: null,
        timezone: ws.timezone,
        status: 'draft',
        contentType: t.contentType,
        priority: 'normal',
        tags: [],
        assigneeLabel: '',
        internalNotes: '',
        mediaIds: [],
        checklist: [],
        createdAt: nowIso(),
        updatedAt: nowIso(),
      },
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {all.map((t) => (
          <article key={t.id} className="rounded-lg border border-border p-3">
            <p className="font-medium">{t.name}</p>
            <p className="text-xs text-muted-foreground">
              {t.category} · {t.contentType} · {t.workspaceId ? 'Custom' : 'Built-in'}
            </p>
            <p className="mt-1 line-clamp-3 text-sm text-muted-foreground">{t.caption}</p>
            <div className="mt-2 flex flex-wrap gap-1">
              <button type="button" className="rounded bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground" onClick={() => setActiveId(t.id)}>
                Use template
              </button>
              {t.workspaceId === null && (
                <button
                  type="button"
                  className="rounded border border-border px-2.5 py-1 text-xs"
                  onClick={() =>
                    void store.put('templates', {
                      ...t,
                      id: uid(),
                      workspaceId: ws.id,
                      name: `${t.name} (copy)`,
                    })
                  }
                >
                  Duplicate to custom
                </button>
              )}
              {t.workspaceId !== null && (
                <>
                  <button type="button" className="rounded border border-border px-2.5 py-1 text-xs" onClick={() => setForm(t)}>
                    Edit
                  </button>
                  <button type="button" className="rounded border border-red-300 px-2.5 py-1 text-xs text-red-600" onClick={() => void store.remove('templates', t.id)}>
                    Delete
                  </button>
                </>
              )}
            </div>
          </article>
        ))}
      </div>

      {active && (
        <div className="rounded-lg border border-primary/40 p-4">
          <h3 className="font-semibold">Use “{active.name}”</h3>
          {active.placeholders.length > 0 ? (
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {active.placeholders.map((ph) => (
                <label key={ph} className={labelCls}>
                  <span className={spanCls}>{`{{${ph}}}`}</span>
                  <input
                    value={values[ph] ?? ''}
                    onChange={(e) => setValues({ ...values, [ph]: e.target.value })}
                    className={inputCls}
                  />
                </label>
              ))}
            </div>
          ) : (
            <p className="mt-1 text-sm text-muted-foreground">This template has no placeholders.</p>
          )}
          <div className="mt-3 flex gap-2">
            <button type="button" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground" onClick={() => void applyAndOpen(active)}>
              Create draft post from template
            </button>
            <button type="button" className="rounded-md border border-border px-4 py-2 text-sm" onClick={() => setActiveId(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <form
        className="grid gap-3 rounded-lg border border-border p-4 sm:grid-cols-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (!form.name?.trim() || !form.caption?.trim()) return;
          const t: Template = {
            id: form.id ?? uid(),
            workspaceId: ws.id,
            name: form.name.trim(),
            category: form.category?.trim() || 'Custom',
            caption: form.caption,
            contentType: form.contentType ?? 'image',
            placeholders: extractPlaceholders(form.caption),
            notes: form.notes ?? '',
          };
          void store.put('templates', t);
          setForm({ contentType: 'image' });
        }}
      >
        <h3 className="font-semibold sm:col-span-2">{form.id ? 'Edit custom template' : 'New custom template'}</h3>
        <label className={labelCls}>
          <span className={spanCls}>Name</span>
          <input value={form.name ?? ''} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} />
        </label>
        <label className={labelCls}>
          <span className={spanCls}>Category</span>
          <input value={form.category ?? ''} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputCls} />
        </label>
        <label className={`${labelCls} sm:col-span-2`}>
          <span className={spanCls}>Caption (use {'{{placeholders}}'} for fill-ins)</span>
          <textarea value={form.caption ?? ''} onChange={(e) => setForm({ ...form, caption: e.target.value })} rows={4} className={inputCls} />
        </label>
        <div className="sm:col-span-2">
          <button type="submit" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
            {form.id ? 'Save template' : 'Create template'}
          </button>
        </div>
      </form>
    </div>
  );
}

function Ideas({ openEditor }: { openEditor: (seed: EditorSeed) => void }) {
  const store = useStore();
  const ws = store.activeWorkspace!;
  const [industry, setIndustry] = useState(INDUSTRIES[0]);
  const [custom, setCustom] = useState({ title: '', description: '' });
  const library = LIBRARY_IDEAS.filter((i) => i.industry === industry);

  const planIdea = (idea: Pick<Idea, 'title' | 'description' | 'platformId' | 'hashtags' | 'hook' | 'cta'>) => {
    openEditor({
      post: {
        id: uid(),
        workspaceId: ws.id,
        calendarId: store.data.calendars[0]?.id ?? '',
        title: idea.title,
        caption: [idea.hook, idea.description, idea.cta, idea.hashtags?.map((h) => `#${h}`).join(' ')]
          .filter(Boolean)
          .join('\n\n'),
        description: idea.description,
        platformCaptions: {},
        platformIds: idea.platformId ? [idea.platformId] : [],
        scheduledAt: null,
        timezone: ws.timezone,
        status: 'idea',
        contentType: 'image',
        priority: 'normal',
        tags: [],
        assigneeLabel: '',
        internalNotes: '',
        mediaIds: [],
        checklist: [],
        createdAt: nowIso(),
        updatedAt: nowIso(),
      },
    });
  };

  return (
    <div className="space-y-5">
      <div>
        <label className={labelCls}>
          <span className={spanCls}>Idea library — industry</span>
          <select value={industry} onChange={(e) => setIndustry(e.target.value)} className="rounded-md border border-input bg-background px-2 py-2">
            {INDUSTRIES.map((i) => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
        </label>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {library.map((idea) => (
            <article key={idea.id} className="rounded-lg border border-border p-3">
              <p className="font-medium">{idea.title}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {getPlatform(idea.platformId)?.name ?? idea.platformId} · {idea.pillar} · {idea.format} · {idea.difficulty}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{idea.description}</p>
              <p className="mt-1 text-sm">
                <span className="font-medium">Hook:</span> {idea.hook}
              </p>
              <div className="mt-2 flex gap-1">
                <button
                  type="button"
                  className="rounded border border-border px-2.5 py-1 text-xs"
                  onClick={() =>
                    void store.put('ideas', {
                      id: uid(),
                      workspaceId: ws.id,
                      title: idea.title,
                      description: idea.description,
                      platformId: idea.platformId,
                      format: idea.format,
                      hook: idea.hook,
                      cta: idea.cta,
                      hashtags: idea.hashtags,
                      difficulty: idea.difficulty,
                      libraryIdeaId: idea.id,
                      createdAt: nowIso(),
                    } satisfies Idea)
                  }
                >
                  Save to idea bank
                </button>
                <button type="button" className="rounded bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground" onClick={() => planIdea(idea)}>
                  Plan it
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold">Idea bank ({store.data.ideas.length})</h3>
        <ul className="mt-2 divide-y divide-border rounded-lg border border-border">
          {store.data.ideas.map((idea) => (
            <li key={idea.id} className="flex items-center gap-2 px-3 py-2 text-sm">
              <span className="flex-1 truncate font-medium">{idea.title}</span>
              <button type="button" className="rounded bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground" onClick={() => planIdea(idea)}>
                Plan it
              </button>
              <button type="button" className="rounded border border-red-300 px-2.5 py-1 text-xs text-red-600" onClick={() => void store.remove('ideas', idea.id)}>
                Delete
              </button>
            </li>
          ))}
          {store.data.ideas.length === 0 && (
            <li className="px-3 py-2 text-sm text-muted-foreground">Empty — save ideas from the library or add your own below.</li>
          )}
        </ul>
        <form
          className="mt-3 flex flex-wrap items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (!custom.title.trim()) return;
            void store.put('ideas', {
              id: uid(),
              workspaceId: ws.id,
              title: custom.title.trim(),
              description: custom.description,
              hashtags: [],
              difficulty: 'easy',
              createdAt: nowIso(),
            } satisfies Idea);
            setCustom({ title: '', description: '' });
          }}
        >
          <label className={labelCls}>
            <span className={spanCls}>Your idea</span>
            <input value={custom.title} onChange={(e) => setCustom({ ...custom, title: e.target.value })} className={inputCls} placeholder="Title" />
          </label>
          <label className={labelCls}>
            <span className={spanCls}>Notes</span>
            <input value={custom.description} onChange={(e) => setCustom({ ...custom, description: e.target.value })} className={inputCls} placeholder="Optional details" />
          </label>
          <button type="submit" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
            Add idea
          </button>
        </form>
      </div>
    </div>
  );
}

function Hashtags() {
  const store = useStore();
  const ws = store.activeWorkspace!;
  const [form, setForm] = useState({ name: '', category: '', tags: '' });
  const [bannedText, setBannedText] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    if (!store.repo) return;
    void getKv<string[]>(store.repo, ws.id, 'banned-words').then((words) =>
      setBannedText((words ?? []).join(', ')),
    );
  }, [store.repo, ws.id]);

  const duplicates = useMemo(
    () => findDuplicateTags(store.data.hashtagGroups),
    [store.data.hashtagGroups],
  );

  return (
    <div className="space-y-5">
      {duplicates.length > 0 && (
        <p className="rounded bg-amber-100 px-3 py-2 text-sm text-amber-900 dark:bg-amber-900/40 dark:text-amber-100" role="status">
          Duplicate hashtags across groups: {duplicates.map((d) => `#${d.tag} (${d.groups.join(', ')})`).join(' · ')}
        </p>
      )}
      <div className="grid gap-2 sm:grid-cols-2">
        {store.data.hashtagGroups.map((g: HashtagGroup) => (
          <article key={g.id} className="rounded-lg border border-border p-3">
            <p className="font-medium">
              {g.name} <span className="text-xs text-muted-foreground">{g.category}</span>
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{g.tags.map((t) => `#${t}`).join(' ')}</p>
            <div className="mt-2 flex gap-1">
              <button
                type="button"
                className="rounded border border-border px-2.5 py-1 text-xs"
                onClick={async () => {
                  await navigator.clipboard.writeText(g.tags.map((t) => `#${t}`).join(' '));
                  setCopied(g.id);
                }}
              >
                {copied === g.id ? 'Copied!' : 'Copy hashtags'}
              </button>
              <button type="button" className="rounded border border-red-300 px-2.5 py-1 text-xs text-red-600" onClick={() => void store.remove('hashtagGroups', g.id)}>
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
      <form
        className="grid gap-3 rounded-lg border border-border p-4 sm:grid-cols-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (!form.name.trim()) return;
          void store.put('hashtagGroups', {
            id: uid(),
            workspaceId: ws.id,
            name: form.name.trim(),
            category: form.category.trim() || 'General',
            tags: parseHashtagInput(form.tags),
          } satisfies HashtagGroup);
          setForm({ name: '', category: '', tags: '' });
        }}
      >
        <h3 className="font-semibold sm:col-span-2">New hashtag group</h3>
        <label className={labelCls}>
          <span className={spanCls}>Name</span>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} />
        </label>
        <label className={labelCls}>
          <span className={spanCls}>Category</span>
          <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputCls} placeholder="e.g. Food, Travel, Brand" />
        </label>
        <label className={`${labelCls} sm:col-span-2`}>
          <span className={spanCls}>Hashtags (comma or space separated)</span>
          <textarea value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} rows={2} className={inputCls} />
        </label>
        <div className="sm:col-span-2">
          <button type="submit" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
            Save group
          </button>
        </div>
      </form>
      <div className="rounded-lg border border-border p-4">
        <h3 className="font-semibold">Banned words</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Captions containing these words are flagged in the post editor.
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          <input
            value={bannedText}
            onChange={(e) => setBannedText(e.target.value)}
            className="min-w-64 flex-1 rounded-md border border-input bg-background px-2 py-2 text-sm"
            placeholder="spam, guaranteed-income, …"
            aria-label="Banned words, comma separated"
          />
          <button
            type="button"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            onClick={async () => {
              if (!store.repo) return;
              await setKv(store.repo, ws.id, 'banned-words', parseHashtagInput(bannedText.replace(/#/g, '')));
            }}
          >
            Save banned words
          </button>
        </div>
      </div>
    </div>
  );
}

interface UtmPreset {
  name: string;
  base: string;
  source: string;
  medium: string;
  campaign: string;
}

function UtmTool() {
  const store = useStore();
  const ws = store.activeWorkspace!;
  const [base, setBase] = useState(ws.brand.website || 'https://');
  const [source, setSource] = useState('instagram');
  const [medium, setMedium] = useState('social');
  const [campaign, setCampaign] = useState('');
  const [term, setTerm] = useState('');
  const [content, setContent] = useState('');
  const [custom, setCustom] = useState<{ key: string; value: string }[]>([]);
  const [presets, setPresets] = useState<UtmPreset[]>([]);
  const [presetName, setPresetName] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!store.repo) return;
    void getKv<UtmPreset[]>(store.repo, ws.id, 'utm-presets').then((p) => setPresets(p ?? []));
  }, [store.repo, ws.id]);

  const customRecord = Object.fromEntries(custom.filter((c) => c.key.trim()).map((c) => [c.key, c.value]));
  const result = buildUtmUrl(base, { source, medium, campaign, term, content }, customRecord);

  const savePresets = async (next: UtmPreset[]) => {
    setPresets(next);
    if (store.repo) await setKv(store.repo, ws.id, 'utm-presets', next);
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className={labelCls}>
          <span className={spanCls}>Base URL</span>
          <input value={base} onChange={(e) => setBase(e.target.value)} className={inputCls} />
        </label>
        <label className={labelCls}>
          <span className={spanCls}>Campaign (auto-slugified)</span>
          <input value={campaign} onChange={(e) => setCampaign(e.target.value)} className={inputCls} placeholder="Spring Sale 2027" />
          {campaign && <span className="text-xs text-muted-foreground">→ {slugifyCampaign(campaign)}</span>}
        </label>
        <label className={labelCls}>
          <span className={spanCls}>Source (utm_source)</span>
          <input value={source} onChange={(e) => setSource(e.target.value)} className={inputCls} />
        </label>
        <label className={labelCls}>
          <span className={spanCls}>Medium (utm_medium)</span>
          <input value={medium} onChange={(e) => setMedium(e.target.value)} className={inputCls} />
        </label>
        <label className={labelCls}>
          <span className={spanCls}>Term (utm_term, optional)</span>
          <input value={term} onChange={(e) => setTerm(e.target.value)} className={inputCls} />
        </label>
        <label className={labelCls}>
          <span className={spanCls}>Content (utm_content, optional)</span>
          <input value={content} onChange={(e) => setContent(e.target.value)} className={inputCls} />
        </label>
      </div>
      <div>
        <span className="mb-1 block text-sm font-medium">Custom parameters</span>
        {custom.map((c, i) => (
          <div key={i} className="mb-1 flex gap-2">
            <input value={c.key} onChange={(e) => setCustom(custom.map((x, j) => (j === i ? { ...x, key: e.target.value } : x)))} placeholder="key" className="w-36 rounded-md border border-input bg-background px-2 py-1.5 text-sm" aria-label="Custom parameter key" />
            <input value={c.value} onChange={(e) => setCustom(custom.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)))} placeholder="value" className="flex-1 rounded-md border border-input bg-background px-2 py-1.5 text-sm" aria-label="Custom parameter value" />
            <button type="button" className="rounded border border-border px-2 text-sm" onClick={() => setCustom(custom.filter((_, j) => j !== i))}>✕</button>
          </div>
        ))}
        <button type="button" className="text-sm underline" onClick={() => setCustom([...custom, { key: '', value: '' }])}>
          + Add parameter
        </button>
      </div>
      <div className="rounded-lg border border-border p-4">
        <h3 className="font-semibold">Tracking link</h3>
        {result.ok ? (
          <>
            <p className="mt-1 break-all rounded bg-muted px-2 py-1.5 font-mono text-xs">{result.url}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                type="button"
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                onClick={async () => {
                  await navigator.clipboard.writeText(result.url!);
                  setCopied(true);
                }}
              >
                {copied ? 'Copied!' : 'Copy tracking link'}
              </button>
              <a
                href="https://freeqrcode.tools/"
                target="_blank"
                rel="noreferrer"
                className="rounded-md border border-border px-4 py-2 text-sm"
              >
                Turn it into a QR code →
              </a>
            </div>
          </>
        ) : (
          <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">{result.errors.join(' ')}</p>
        )}
      </div>
      <div className="rounded-lg border border-border p-4">
        <h3 className="font-semibold">Presets</h3>
        <ul className="mt-2 space-y-1">
          {presets.map((p) => (
            <li key={p.name} className="flex items-center gap-2 text-sm">
              <span className="flex-1 font-medium">{p.name}</span>
              <button
                type="button"
                className="rounded border border-border px-2 py-1 text-xs"
                onClick={() => {
                  setBase(p.base);
                  setSource(p.source);
                  setMedium(p.medium);
                  setCampaign(p.campaign);
                }}
              >
                Apply
              </button>
              <button type="button" className="rounded border border-red-300 px-2 py-1 text-xs text-red-600" onClick={() => void savePresets(presets.filter((x) => x.name !== p.name))}>
                Delete
              </button>
            </li>
          ))}
          {presets.length === 0 && <li className="text-sm text-muted-foreground">No presets saved yet.</li>}
        </ul>
        <div className="mt-2 flex gap-2">
          <input value={presetName} onChange={(e) => setPresetName(e.target.value)} placeholder="Preset name" aria-label="Preset name" className="rounded-md border border-input bg-background px-2 py-1.5 text-sm" />
          <button
            type="button"
            disabled={!presetName.trim()}
            className="rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-40"
            onClick={() => void savePresets([...presets, { name: presetName.trim(), base, source, medium, campaign }])}
          >
            Save current as preset
          </button>
        </div>
      </div>
    </div>
  );
}

function Checklists() {
  const store = useStore();
  const ws = store.activeWorkspace!;
  const [name, setName] = useState('');
  const [itemsText, setItemsText] = useState('');
  return (
    <div className="space-y-4">
      <ul className="space-y-2">
        {store.data.checklistTemplates.map((t: ChecklistTemplate) => (
          <li key={t.id} className="rounded-lg border border-border p-3">
            <div className="flex items-center gap-2">
              <span className="font-medium">{t.name}</span>
              <button type="button" className="ml-auto rounded border border-red-300 px-2 py-1 text-xs text-red-600" onClick={() => void store.remove('checklistTemplates', t.id)}>
                Delete
              </button>
            </div>
            <ul className="mt-1 list-disc pl-5 text-sm text-muted-foreground">
              {t.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </li>
        ))}
        {store.data.checklistTemplates.length === 0 && (
          <li className="text-sm text-muted-foreground">
            No checklist templates yet. Example: “Caption proofread · Image optimized · Alt
            text added · Hashtags checked · Link verified · Approval completed”.
          </li>
        )}
      </ul>
      <form
        className="grid gap-3 rounded-lg border border-border p-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (!name.trim()) return;
          void store.put('checklistTemplates', {
            id: uid(),
            workspaceId: ws.id,
            name: name.trim(),
            items: itemsText.split('\n').map((s) => s.trim()).filter(Boolean),
          } satisfies ChecklistTemplate);
          setName('');
          setItemsText('');
        }}
      >
        <h3 className="font-semibold">New checklist template</h3>
        <label className={labelCls}>
          <span className={spanCls}>Name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
        </label>
        <label className={labelCls}>
          <span className={spanCls}>Items (one per line)</span>
          <textarea value={itemsText} onChange={(e) => setItemsText(e.target.value)} rows={5} className={inputCls} />
        </label>
        <div>
          <button type="submit" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
            Save checklist template
          </button>
        </div>
      </form>
    </div>
  );
}

export function LibraryPanel({ openEditor }: { openEditor: (seed: EditorSeed) => void }) {
  const [section, setSection] = useState<Section>('templates');
  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-1" role="tablist" aria-label="Library sections">
        {(
          [
            ['templates', 'Templates'],
            ['ideas', 'Ideas'],
            ['hashtags', 'Hashtags'],
            ['utm', 'UTM builder'],
            ['checklists', 'Checklists'],
          ] as [Section, string][]
        ).map(([key, label]) => (
          <button
            key={key}
            role="tab"
            aria-selected={section === key}
            type="button"
            onClick={() => setSection(key)}
            className={`rounded-md px-3 py-1.5 text-sm ${section === key ? 'bg-primary text-primary-foreground' : 'border border-border'}`}
          >
            {label}
          </button>
        ))}
      </div>
      {section === 'templates' && <Templates openEditor={openEditor} />}
      {section === 'ideas' && <Ideas openEditor={openEditor} />}
      {section === 'hashtags' && <Hashtags />}
      {section === 'utm' && <UtmTool />}
      {section === 'checklists' && <Checklists />}
    </div>
  );
}
