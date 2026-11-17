'use client';

import { useState } from 'react';
import { PLATFORMS } from '../_lib/platforms';
import { useStore } from '../_lib/store';
import { nowIso, uid, type Campaign, type Pillar } from '../_lib/types';

type Section = 'campaigns' | 'pillars' | 'brand';

const inputCls = 'w-full rounded-md border border-input bg-background px-2 py-2';
const labelCls = 'block text-sm';
const spanCls = 'mb-1 block font-medium';

function Campaigns() {
  const store = useStore();
  const ws = store.activeWorkspace!;
  const [form, setForm] = useState<Partial<Campaign>>({ status: 'planned', color: '#0ea5e9' });
  const editing = form.id ? store.data.campaigns.find((c) => c.id === form.id) : undefined;

  const save = async () => {
    if (!form.name?.trim() || !form.startDate || !form.endDate) return;
    const campaign: Campaign = {
      id: form.id ?? uid(),
      workspaceId: ws.id,
      name: form.name.trim(),
      description: form.description ?? '',
      goal: form.goal ?? '',
      startDate: form.startDate,
      endDate: form.endDate,
      status: form.status ?? 'planned',
      color: form.color ?? '#0ea5e9',
      budget: form.budget,
      budgetCurrency: form.budgetCurrency ?? 'USD',
      audienceNotes: form.audienceNotes ?? '',
      utmDefaults: form.utmDefaults ?? { source: '', medium: '', campaign: '' },
      createdAt: editing?.createdAt ?? nowIso(),
      updatedAt: nowIso(),
    };
    await store.put('campaigns', campaign);
    await store.logActivity('campaign', campaign.id, editing ? 'update' : 'create', campaign.name);
    setForm({ status: 'planned', color: '#0ea5e9' });
  };

  return (
    <div className="space-y-4">
      <ul className="space-y-2">
        {store.data.campaigns.map((c) => {
          const posts = store.data.posts.filter((p) => p.campaignId === c.id);
          const published = posts.filter((p) => p.status === 'published').length;
          return (
            <li key={c.id} className="rounded-lg border border-border p-3">
              <div className="flex flex-wrap items-center gap-2">
                <span aria-hidden className="h-3 w-3 rounded-full" style={{ backgroundColor: c.color }} />
                <span className="font-semibold">{c.name}</span>
                <span className="rounded bg-muted px-2 py-0.5 text-xs">{c.status}</span>
                <span className="text-xs text-muted-foreground">
                  {c.startDate} → {c.endDate}
                </span>
                <span className="ml-auto flex gap-1">
                  <button type="button" className="rounded border border-border px-2 py-1 text-xs" onClick={() => setForm(c)}>
                    Edit
                  </button>
                  <button
                    type="button"
                    className="rounded border border-red-300 px-2 py-1 text-xs text-red-600"
                    onClick={() => {
                      if (window.confirm(`Delete campaign "${c.name}"? Posts keep existing but lose the campaign link.`)) {
                        void store.remove('campaigns', c.id);
                      }
                    }}
                  >
                    Delete
                  </button>
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{c.description}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Progress: {published}/{posts.length} posts published
                {c.goal ? ` · Goal: ${c.goal}` : ''}
                {typeof c.budget === 'number' ? ` · Budget: ${c.budgetCurrency} ${c.budget}` : ''}
              </p>
              {posts.length > 0 && (
                <div className="mt-2 h-2 overflow-hidden rounded bg-muted" role="img" aria-label={`${published} of ${posts.length} campaign posts published`}>
                  <div className="h-full bg-emerald-500" style={{ width: `${Math.round((published / posts.length) * 100)}%` }} />
                </div>
              )}
            </li>
          );
        })}
        {store.data.campaigns.length === 0 && (
          <li className="text-sm text-muted-foreground">No campaigns yet — create your first below.</li>
        )}
      </ul>

      <form
        className="grid gap-3 rounded-lg border border-border p-4 sm:grid-cols-2"
        onSubmit={(e) => {
          e.preventDefault();
          void save();
        }}
      >
        <h3 className="font-semibold sm:col-span-2">{editing ? `Edit campaign` : 'New campaign'}</h3>
        <label className={labelCls}>
          <span className={spanCls}>Name *</span>
          <input required value={form.name ?? ''} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} />
        </label>
        <label className={labelCls}>
          <span className={spanCls}>Goal</span>
          <input value={form.goal ?? ''} onChange={(e) => setForm({ ...form, goal: e.target.value })} className={inputCls} placeholder="e.g. 500 new followers" />
        </label>
        <label className={labelCls}>
          <span className={spanCls}>Start date *</span>
          <input required type="date" value={form.startDate ?? ''} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className={inputCls} />
        </label>
        <label className={labelCls}>
          <span className={spanCls}>End date *</span>
          <input required type="date" value={form.endDate ?? ''} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className={inputCls} />
        </label>
        <label className={labelCls}>
          <span className={spanCls}>Status</span>
          <select value={form.status ?? 'planned'} onChange={(e) => setForm({ ...form, status: e.target.value as Campaign['status'] })} className={inputCls}>
            {['planned', 'active', 'paused', 'completed'].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>
        <label className={labelCls}>
          <span className={spanCls}>Color</span>
          <input type="color" value={form.color ?? '#0ea5e9'} onChange={(e) => setForm({ ...form, color: e.target.value })} className="h-10 w-full rounded-md border border-input bg-background" />
        </label>
        <label className={labelCls}>
          <span className={spanCls}>Budget (optional)</span>
          <input type="number" min={0} value={form.budget ?? ''} onChange={(e) => setForm({ ...form, budget: e.target.value ? Number(e.target.value) : undefined })} className={inputCls} />
        </label>
        <label className={labelCls}>
          <span className={spanCls}>Currency</span>
          <input value={form.budgetCurrency ?? 'USD'} onChange={(e) => setForm({ ...form, budgetCurrency: e.target.value })} className={inputCls} />
        </label>
        <label className={`${labelCls} sm:col-span-2`}>
          <span className={spanCls}>Description</span>
          <textarea value={form.description ?? ''} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className={inputCls} />
        </label>
        <label className={`${labelCls} sm:col-span-2`}>
          <span className={spanCls}>Target audience notes</span>
          <textarea value={form.audienceNotes ?? ''} onChange={(e) => setForm({ ...form, audienceNotes: e.target.value })} rows={2} className={inputCls} />
        </label>
        <div className="flex gap-2 sm:col-span-2">
          <button type="submit" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
            {editing ? 'Save campaign' : 'Create campaign'}
          </button>
          {editing && (
            <button type="button" className="rounded-md border border-border px-4 py-2 text-sm" onClick={() => setForm({ status: 'planned', color: '#0ea5e9' })}>
              Cancel edit
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

function Pillars() {
  const store = useStore();
  const ws = store.activeWorkspace!;
  const [name, setName] = useState('');
  const [target, setTarget] = useState(20);
  const totalTarget = store.data.pillars.reduce((s, p) => s + p.targetPercent, 0);
  const scheduled = store.data.posts.filter((p) => p.scheduledAt);
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Content pillars keep your mix balanced. Targets currently add up to {totalTarget}%
        {totalTarget !== 100 ? ' — aim for 100% across pillars.' : '.'}
      </p>
      <ul className="space-y-2">
        {store.data.pillars.map((p: Pillar) => {
          const count = scheduled.filter((post) => post.pillarId === p.id).length;
          const actual = scheduled.length ? Math.round((count / scheduled.length) * 100) : 0;
          return (
            <li key={p.id} className="flex flex-wrap items-center gap-3 rounded-lg border border-border p-3">
              <span aria-hidden className="h-3 w-3 rounded-full" style={{ backgroundColor: p.color }} />
              <span className="font-medium">{p.name}</span>
              <span className="text-sm text-muted-foreground">
                Target {p.targetPercent}% · Actual {actual}% ({count} posts)
              </span>
              <span className="ml-auto flex items-center gap-2">
                <input
                  type="color"
                  value={p.color}
                  aria-label={`Color for ${p.name}`}
                  onChange={(e) => void store.put('pillars', { ...p, color: e.target.value })}
                  className="h-8 w-10 rounded border border-input bg-background"
                />
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={p.targetPercent}
                  aria-label={`Target percent for ${p.name}`}
                  onChange={(e) => void store.put('pillars', { ...p, targetPercent: Number(e.target.value) || 0 })}
                  className="w-16 rounded-md border border-input bg-background px-2 py-1 text-sm"
                />
                <button
                  type="button"
                  className="rounded border border-red-300 px-2 py-1 text-xs text-red-600"
                  onClick={() => void store.remove('pillars', p.id)}
                >
                  Delete
                </button>
              </span>
            </li>
          );
        })}
        {store.data.pillars.length === 0 && (
          <li className="text-sm text-muted-foreground">
            No pillars yet. Common starting set: Educational, Promotional, Entertainment,
            Community, Behind the Scenes, Testimonials.
          </li>
        )}
      </ul>
      <form
        className="flex flex-wrap items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (!name.trim()) return;
          void store.put('pillars', {
            id: uid(),
            workspaceId: ws.id,
            name: name.trim(),
            color: '#0ea5e9',
            targetPercent: target,
            description: '',
          } satisfies Pillar);
          setName('');
        }}
      >
        <label className={labelCls}>
          <span className={spanCls}>New pillar</span>
          <input value={name} onChange={(e) => setName(e.target.value)} className={inputCls} placeholder="e.g. Educational" />
        </label>
        <label className={labelCls}>
          <span className={spanCls}>Target %</span>
          <input type="number" min={0} max={100} value={target} onChange={(e) => setTarget(Number(e.target.value) || 0)} className="w-20 rounded-md border border-input bg-background px-2 py-2" />
        </label>
        <button type="submit" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          Add pillar
        </button>
      </form>
    </div>
  );
}

function BrandKit() {
  const store = useStore();
  const ws = store.activeWorkspace!;
  const brand = ws.brand;
  const set = (patch: Partial<typeof brand>) =>
    void store.updateWorkspace({ ...ws, brand: { ...brand, ...patch } });
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <label className={labelCls}>
        <span className={spanCls}>Brand name</span>
        <input value={brand.brandName} onChange={(e) => set({ brandName: e.target.value })} className={inputCls} />
      </label>
      <label className={labelCls}>
        <span className={spanCls}>Website</span>
        <input value={brand.website} onChange={(e) => set({ website: e.target.value })} className={inputCls} placeholder="https://…" />
      </label>
      <label className={labelCls}>
        <span className={spanCls}>Logo (stored locally)</span>
        <input
          type="file"
          accept="image/*"
          className={inputCls}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            if (file.size > 512 * 1024) {
              window.alert('Logo is larger than 512 KB — please use a smaller image.');
              return;
            }
            const reader = new FileReader();
            reader.onload = () => set({ logoDataUrl: String(reader.result) });
            reader.readAsDataURL(file);
          }}
        />
        {brand.logoDataUrl && (
          <span className="mt-2 flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element -- local data URL */}
            <img src={brand.logoDataUrl} alt="Brand logo" className="h-10 w-10 rounded object-contain" />
            <button type="button" className="text-xs underline" onClick={() => set({ logoDataUrl: undefined })}>
              Remove logo
            </button>
          </span>
        )}
      </label>
      <label className={labelCls}>
        <span className={spanCls}>Typography preference</span>
        <input value={brand.fontPreference} onChange={(e) => set({ fontPreference: e.target.value })} className={inputCls} placeholder="e.g. Clean sans-serif, bold headlines" />
      </label>
      {(['primaryColor', 'secondaryColor', 'accentColor'] as const).map((key) => (
        <label key={key} className={labelCls}>
          <span className={spanCls}>{key.replace('Color', ' color')}</span>
          <input type="color" value={brand[key]} onChange={(e) => set({ [key]: e.target.value })} className="h-10 w-full rounded-md border border-input bg-background" />
        </label>
      ))}
      <label className={labelCls}>
        <span className={spanCls}>Brand tone</span>
        <input value={brand.tone} onChange={(e) => set({ tone: e.target.value })} className={inputCls} placeholder="e.g. Friendly, expert, never salesy" />
      </label>
      <label className={`${labelCls} sm:col-span-2`}>
        <span className={spanCls}>Brand description</span>
        <textarea value={brand.description} onChange={(e) => set({ description: e.target.value })} rows={2} className={inputCls} />
      </label>
      <label className={`${labelCls} sm:col-span-2`}>
        <span className={spanCls}>Content guidelines</span>
        <textarea value={brand.guidelines} onChange={(e) => set({ guidelines: e.target.value })} rows={3} className={inputCls} placeholder="Rules every post should follow…" />
      </label>
      <label className={`${labelCls} sm:col-span-2`}>
        <span className={spanCls}>Preferred hashtags (comma separated)</span>
        <input
          value={brand.hashtagPreferences.join(', ')}
          onChange={(e) =>
            set({ hashtagPreferences: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })
          }
          className={inputCls}
        />
      </label>
      <fieldset className="sm:col-span-2">
        <legend className="mb-1 text-sm font-medium">Social links</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {PLATFORMS.slice(0, 10).map((p) => (
            <label key={p.id} className="flex items-center gap-2 text-sm">
              <span className="w-24 shrink-0">{p.name}</span>
              <input
                value={brand.socialLinks[p.id] ?? ''}
                onChange={(e) =>
                  set({ socialLinks: { ...brand.socialLinks, [p.id]: e.target.value } })
                }
                placeholder="https://…"
                className={inputCls}
              />
            </label>
          ))}
        </div>
      </fieldset>
      <p className="text-xs text-muted-foreground sm:col-span-2">
        The brand kit is applied to PDF reports and calendar exports.
      </p>
    </div>
  );
}

export function ManagePanel() {
  const [section, setSection] = useState<Section>('campaigns');
  return (
    <div>
      <div className="mb-4 flex gap-1" role="tablist" aria-label="Manage sections">
        {(
          [
            ['campaigns', 'Campaigns'],
            ['pillars', 'Content pillars'],
            ['brand', 'Brand kit'],
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
      {section === 'campaigns' && <Campaigns />}
      {section === 'pillars' && <Pillars />}
      {section === 'brand' && <BrandKit />}
    </div>
  );
}
