'use client';

import type { ReactNode } from 'react';
import { Plus, Trash2, Copy, ArrowUp, ArrowDown } from 'lucide-react';
import type {
  AwardEntry,
  CertificationEntry,
  EducationEntry,
  ExperienceEntry,
  GenericEntry,
  LanguageEntry,
  ProjectEntry,
  PublicationEntry,
  ReferenceEntry,
  Section,
} from '../../_lib/schema';
import { uid } from '../../_lib/defaults';
import { TextField, TextAreaField, DateField, BulletListField, RichTextField, TagsField } from './fields';

/** Generic entry-list wrapper: add / duplicate / delete / move controls. */
function EntryList<T extends { id: string }>(props: {
  items: T[];
  onChange: (items: T[]) => void;
  newItem: () => T;
  addLabel: string;
  renderItem: (item: T, update: (patch: Partial<T>) => void) => ReactNode;
  itemLabel: (item: T, index: number) => string;
}) {
  const { items, onChange } = props;
  const move = (idx: number, dir: -1 | 1) => {
    const j = idx + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[idx], next[j]] = [next[j], next[idx]];
    onChange(next);
  };
  return (
    <div className="space-y-3">
      {items.map((item, idx) => (
        <div key={item.id} className="rounded-md border border-border p-3">
          <div className="mb-2 flex items-center gap-1">
            <span className="mr-auto truncate text-sm font-medium">{props.itemLabel(item, idx)}</span>
            <button type="button" aria-label="Move entry up" className="flex h-9 w-9 items-center justify-center rounded border border-input disabled:opacity-40" disabled={idx === 0} onClick={() => move(idx, -1)}>
              <ArrowUp className="h-4 w-4" aria-hidden />
            </button>
            <button type="button" aria-label="Move entry down" className="flex h-9 w-9 items-center justify-center rounded border border-input disabled:opacity-40" disabled={idx === items.length - 1} onClick={() => move(idx, 1)}>
              <ArrowDown className="h-4 w-4" aria-hidden />
            </button>
            <button
              type="button"
              aria-label="Duplicate entry"
              className="flex h-9 w-9 items-center justify-center rounded border border-input"
              onClick={() => onChange([...items.slice(0, idx + 1), { ...item, id: uid('entry') }, ...items.slice(idx + 1)])}
            >
              <Copy className="h-4 w-4" aria-hidden />
            </button>
            <button
              type="button"
              aria-label="Delete entry"
              className="flex h-9 w-9 items-center justify-center rounded border border-input text-destructive"
              onClick={() => onChange(items.filter((_, i) => i !== idx))}
            >
              <Trash2 className="h-4 w-4" aria-hidden />
            </button>
          </div>
          {props.renderItem(item, (patch) =>
            onChange(items.map((it, i) => (i === idx ? { ...it, ...patch } : it))),
          )}
        </div>
      ))}
      <button
        type="button"
        className="inline-flex min-h-11 items-center gap-1.5 rounded-md border border-input px-3 text-sm font-medium"
        onClick={() => onChange([...items, props.newItem()])}
      >
        <Plus className="h-4 w-4" aria-hidden /> {props.addLabel}
      </button>
    </div>
  );
}

function ExtrasFields(props: {
  extras?: Record<string, string>;
  onChange: (extras: Record<string, string>) => void;
  hints: Array<{ key: string; label: string; hint: string }>;
}) {
  if (props.hints.length === 0) return null;
  return (
    <div className="space-y-3 border-t border-dashed border-border pt-3">
      {props.hints.map((h) => (
        <TextField
          key={h.key}
          label={h.label}
          hint={h.hint}
          value={props.extras?.[h.key] ?? ''}
          onChange={(v) => props.onChange({ ...(props.extras ?? {}), [h.key]: v })}
        />
      ))}
    </div>
  );
}

export interface PackHint {
  key: string;
  label: string;
  hint: string;
}

/** Renders the editor for one section's payload. */
export function SectionEditor(props: {
  section: Section;
  onChange: (section: Section) => void;
  packHints: PackHint[];
}) {
  const { section, onChange } = props;
  const set = (patch: Partial<Section>) => onChange({ ...section, ...patch });
  const hintsFor = (kind: string) => props.packHints.filter(() => kind === section.kind);

  switch (section.kind) {
    case 'summary':
    case 'declaration':
      return (
        <RichTextField
          label={section.kind === 'summary' ? 'Summary text' : 'Declaration text'}
          value={section.text ?? []}
          onChange={(text) => set({ text })}
          hint={
            section.kind === 'summary'
              ? 'Two to four sentences: role, years of experience, strongest evidence, target.'
              : 'A short statement that the information above is true, with place and date if your region customarily includes one.'
          }
          maxLength={1200}
        />
      );
    case 'experience':
      return (
        <EntryList<ExperienceEntry>
          items={section.experience ?? []}
          onChange={(experience) => set({ experience })}
          addLabel="Add a role"
          itemLabel={(e, i) => e.role || e.organization || `Role ${i + 1}`}
          newItem={() => ({ id: uid('exp'), role: '', organization: '', bullets: [] })}
          renderItem={(e, update) => (
            <div className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <TextField label="Job title" value={e.role} onChange={(v) => update({ role: v })} />
                <TextField label="Employer" value={e.organization} onChange={(v) => update({ organization: v })} />
              </div>
              <TextField label="Location" value={e.location ?? ''} onChange={(v) => update({ location: v })} />
              <div className="grid gap-3 sm:grid-cols-2">
                <DateField label="Start" value={e.start} onChange={(v) => update({ start: v })} />
                <DateField
                  label="End"
                  value={e.end}
                  onChange={(v) => update({ end: v })}
                  current={e.current}
                  onCurrentChange={(v) => update({ current: v })}
                  allowCurrent
                />
              </div>
              <BulletListField
                label="What you did and what changed because of it"
                value={e.bullets}
                onChange={(bullets) => update({ bullets })}
                hint="Start with a strong verb and include a number where you honestly can."
              />
              <ExtrasFields extras={e.extras} onChange={(extras) => update({ extras })} hints={hintsFor('experience')} />
            </div>
          )}
        />
      );
    case 'education':
      return (
        <EntryList<EducationEntry>
          items={section.education ?? []}
          onChange={(education) => set({ education })}
          addLabel="Add education"
          itemLabel={(e, i) => e.area || e.institution || `Education ${i + 1}`}
          newItem={() => ({ id: uid('edu'), institution: '', area: '', bullets: [] })}
          renderItem={(e, update) => (
            <div className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <TextField label="Institution" value={e.institution} onChange={(v) => update({ institution: v })} />
                <TextField label="Field of study" value={e.area} onChange={(v) => update({ area: v })} />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <TextField label="Qualification (e.g. BSc, Diploma)" value={e.studyType ?? ''} onChange={(v) => update({ studyType: v })} />
                <TextField label="Result / grade" value={e.score ?? ''} onChange={(v) => update({ score: v })} />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <DateField label="Start" value={e.start} onChange={(v) => update({ start: v })} />
                <DateField label="End" value={e.end} onChange={(v) => update({ end: v })} current={e.current} onCurrentChange={(v) => update({ current: v })} allowCurrent />
              </div>
              <BulletListField label="Relevant coursework, honours, activities" value={e.bullets} onChange={(bullets) => update({ bullets })} />
            </div>
          )}
        />
      );
    case 'skills':
      return (
        <div className="space-y-4">
          {(section.skillGroups ?? []).map((group, gi) => (
            <div key={group.id} className="rounded-md border border-border p-3">
              <div className="mb-2 flex items-center gap-2">
                <input
                  aria-label="Skill group name"
                  value={group.name}
                  placeholder="Group name (e.g. Languages, Tools)"
                  onChange={(e) =>
                    set({
                      skillGroups: (section.skillGroups ?? []).map((g, i) =>
                        i === gi ? { ...g, name: e.target.value } : g,
                      ),
                    })
                  }
                  className="min-h-11 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium"
                />
                <button
                  type="button"
                  aria-label="Delete skill group"
                  className="flex h-11 w-11 items-center justify-center rounded border border-input text-destructive"
                  onClick={() => set({ skillGroups: (section.skillGroups ?? []).filter((_, i) => i !== gi) })}
                >
                  <Trash2 className="h-4 w-4" aria-hidden />
                </button>
              </div>
              <TagsField
                label="Skills"
                value={group.skills.map((s) => s.name)}
                onChange={(names) =>
                  set({
                    skillGroups: (section.skillGroups ?? []).map((g, i) =>
                      i === gi
                        ? {
                            ...g,
                            skills: names.map((name) => {
                              const existing = g.skills.find((s) => s.name === name);
                              return existing ?? { id: uid('skill'), name };
                            }),
                          }
                        : g,
                    ),
                  })
                }
              />
              {group.skills.length > 0 && (
                <div className="mt-3 space-y-1.5">
                  <p className="text-xs text-muted-foreground">
                    Optional levels (shown only by templates that use them, always with a text label):
                  </p>
                  {group.skills.map((skill) => (
                    <label key={skill.id} className="flex items-center gap-2 text-sm">
                      <span className="w-40 truncate">{skill.name}</span>
                      <select
                        aria-label={`Level for ${skill.name}`}
                        value={skill.level ?? ''}
                        onChange={(e) =>
                          set({
                            skillGroups: (section.skillGroups ?? []).map((g, i) =>
                              i === gi
                                ? {
                                    ...g,
                                    skills: g.skills.map((s) =>
                                      s.id === skill.id
                                        ? { ...s, level: e.target.value ? Number(e.target.value) : undefined }
                                        : s,
                                    ),
                                  }
                                : g,
                            ),
                          })
                        }
                        className="min-h-11 rounded-md border border-input bg-background px-2 py-1.5 text-sm"
                      >
                        <option value="">No level</option>
                        {[1, 2, 3, 4, 5].map((n) => (
                          <option key={n} value={n}>
                            {n} / 5
                          </option>
                        ))}
                      </select>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
          <button
            type="button"
            className="inline-flex min-h-11 items-center gap-1.5 rounded-md border border-input px-3 text-sm font-medium"
            onClick={() =>
              set({ skillGroups: [...(section.skillGroups ?? []), { id: uid('group'), name: '', skills: [] }] })
            }
          >
            <Plus className="h-4 w-4" aria-hidden /> Add skill group
          </button>
        </div>
      );
    case 'projects':
      return (
        <EntryList<ProjectEntry>
          items={section.projects ?? []}
          onChange={(projects) => set({ projects })}
          addLabel="Add a project"
          itemLabel={(p, i) => p.name || `Project ${i + 1}`}
          newItem={() => ({ id: uid('proj'), name: '', description: [], stack: [] })}
          renderItem={(p, update) => (
            <div className="space-y-3">
              <TextField label="Project name" value={p.name} onChange={(v) => update({ name: v })} />
              <TextField label="Link (optional)" value={p.url ?? ''} onChange={(v) => update({ url: v })} />
              <TagsField label="Tools / stack used" value={p.stack} onChange={(stack) => update({ stack })} />
              <RichTextField label="What it was and what it achieved" value={p.description} onChange={(description) => update({ description })} />
              <ExtrasFields extras={p.extras} onChange={(extras) => update({ extras })} hints={hintsFor('projects')} />
            </div>
          )}
        />
      );
    case 'certifications':
      return (
        <EntryList<CertificationEntry>
          items={section.certifications ?? []}
          onChange={(certifications) => set({ certifications })}
          addLabel="Add a certification or licence"
          itemLabel={(c, i) => c.name || `Certification ${i + 1}`}
          newItem={() => ({ id: uid('cert'), name: '', issuer: '' })}
          renderItem={(c, update) => (
            <div className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <TextField label="Name" value={c.name} onChange={(v) => update({ name: v })} />
                <TextField label="Issuing body" value={c.issuer} onChange={(v) => update({ issuer: v })} />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <TextField label="Credential / licence number" value={c.credentialId ?? ''} onChange={(v) => update({ credentialId: v })} hint="Only your own verifiable number." />
                <TextField label="Verification link" value={c.url ?? ''} onChange={(v) => update({ url: v })} />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <DateField label="Issued" value={c.date} onChange={(v) => update({ date: v })} />
                <DateField label="Expires" value={c.expiry} onChange={(v) => update({ expiry: v })} />
              </div>
            </div>
          )}
        />
      );
    case 'awards':
      return (
        <EntryList<AwardEntry>
          items={section.awards ?? []}
          onChange={(awards) => set({ awards })}
          addLabel="Add an award"
          itemLabel={(a, i) => a.title || `Award ${i + 1}`}
          newItem={() => ({ id: uid('award'), title: '' })}
          renderItem={(a, update) => (
            <div className="space-y-3">
              <TextField label="Award" value={a.title} onChange={(v) => update({ title: v })} />
              <TextField label="Awarded by" value={a.awarder ?? ''} onChange={(v) => update({ awarder: v })} />
              <DateField label="Date" value={a.date} onChange={(v) => update({ date: v })} />
              <TextAreaField label="Why it was awarded" value={a.summary ?? ''} onChange={(v) => update({ summary: v })} rows={2} />
            </div>
          )}
        />
      );
    case 'languages':
      return (
        <EntryList<LanguageEntry>
          items={section.languages ?? []}
          onChange={(languages) => set({ languages })}
          addLabel="Add a language"
          itemLabel={(l, i) => l.language || `Language ${i + 1}`}
          newItem={() => ({ id: uid('lang'), language: '' })}
          renderItem={(l, update) => (
            <div className="grid gap-3 sm:grid-cols-2">
              <TextField label="Language" value={l.language} onChange={(v) => update({ language: v })} />
              <TextField label="Fluency (e.g. Native, Fluent, B2)" value={l.fluency ?? ''} onChange={(v) => update({ fluency: v })} />
            </div>
          )}
        />
      );
    case 'publications':
      return (
        <EntryList<PublicationEntry>
          items={section.publications ?? []}
          onChange={(publications) => set({ publications })}
          addLabel="Add a publication"
          itemLabel={(p, i) => p.title || `Publication ${i + 1}`}
          newItem={() => ({ id: uid('pub'), title: '' })}
          renderItem={(p, update) => (
            <div className="space-y-3">
              <TextField label="Title" value={p.title} onChange={(v) => update({ title: v })} />
              <div className="grid gap-3 sm:grid-cols-2">
                <TextField label="Publisher / journal" value={p.publisher ?? ''} onChange={(v) => update({ publisher: v })} />
                <TextField label="Link" value={p.url ?? ''} onChange={(v) => update({ url: v })} />
              </div>
              <DateField label="Date" value={p.date} onChange={(v) => update({ date: v })} />
            </div>
          )}
        />
      );
    case 'references':
      return (
        <div className="space-y-3">
          <label className="flex min-h-11 items-center gap-2 text-sm">
            <input
              type="radio"
              name={`refmode-${section.id}`}
              checked={section.referencesMode !== 'list'}
              onChange={() => set({ referencesMode: 'on-request' })}
              className="h-4 w-4"
            />
            Show “References available on request”
          </label>
          <label className="flex min-h-11 items-center gap-2 text-sm">
            <input
              type="radio"
              name={`refmode-${section.id}`}
              checked={section.referencesMode === 'list'}
              onChange={() => set({ referencesMode: 'list' })}
              className="h-4 w-4"
            />
            List referees (only with their permission)
          </label>
          {section.referencesMode === 'list' && (
            <EntryList<ReferenceEntry>
              items={section.references ?? []}
              onChange={(references) => set({ references })}
              addLabel="Add a referee"
              itemLabel={(r, i) => r.name || `Referee ${i + 1}`}
              newItem={() => ({ id: uid('ref'), name: '' })}
              renderItem={(r, update) => (
                <div className="space-y-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <TextField label="Name" value={r.name} onChange={(v) => update({ name: v })} />
                    <TextField label="Role / relationship" value={r.role ?? ''} onChange={(v) => update({ role: v })} />
                  </div>
                  <TextField label="Contact (email or phone, with permission)" value={r.contact ?? ''} onChange={(v) => update({ contact: v })} />
                </div>
              )}
            />
          )}
        </div>
      );
    case 'interests':
      return <TagsField label="Interests" value={section.tags ?? []} onChange={(tags) => set({ tags })} />;
    case 'custom': {
      const type = section.customType ?? 'text';
      return (
        <div className="space-y-3">
          <label className="block space-y-1">
            <span className="text-sm font-medium">Section type</span>
            <select
              value={type}
              onChange={(e) => set({ customType: e.target.value as Section['customType'] })}
              className="min-h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="text">Text</option>
              <option value="list">List of entries</option>
              <option value="timeline">Timeline of entries</option>
              <option value="table">Table</option>
              <option value="tags">Tags</option>
            </select>
          </label>
          {type === 'text' && (
            <RichTextField label="Content" value={section.text ?? []} onChange={(text) => set({ text })} />
          )}
          {type === 'tags' && (
            <TagsField label="Tags" value={section.tags ?? []} onChange={(tags) => set({ tags })} />
          )}
          {(type === 'list' || type === 'timeline') && (
            <EntryList<GenericEntry>
              items={section.entries ?? []}
              onChange={(entries) => set({ entries })}
              addLabel="Add an entry"
              itemLabel={(e, i) => e.title || `Entry ${i + 1}`}
              newItem={() => ({ id: uid('entry'), title: '', bullets: [] })}
              renderItem={(e, update) => (
                <div className="space-y-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <TextField label="Title" value={e.title} onChange={(v) => update({ title: v })} />
                    <TextField label="Organisation / place" value={e.organization ?? ''} onChange={(v) => update({ organization: v })} />
                  </div>
                  {type === 'timeline' && (
                    <div className="grid gap-3 sm:grid-cols-2">
                      <DateField label="Start" value={e.start} onChange={(v) => update({ start: v })} />
                      <DateField label="End" value={e.end} onChange={(v) => update({ end: v })} current={e.current} onCurrentChange={(v) => update({ current: v })} allowCurrent />
                    </div>
                  )}
                  <BulletListField label="Details" value={e.bullets} onChange={(bullets) => update({ bullets })} />
                </div>
              )}
            />
          )}
          {type === 'table' && (
            <TableEditor rows={section.table ?? [['', '']]} onChange={(table) => set({ table })} />
          )}
        </div>
      );
    }
    default:
      // research, volunteering, courses, memberships — generic entries
      return (
        <EntryList<GenericEntry>
          items={section.entries ?? []}
          onChange={(entries) => set({ entries })}
          addLabel="Add an entry"
          itemLabel={(e, i) => e.title || `Entry ${i + 1}`}
          newItem={() => ({ id: uid('entry'), title: '', bullets: [] })}
          renderItem={(e, update) => (
            <div className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <TextField label="Title" value={e.title} onChange={(v) => update({ title: v })} />
                <TextField label="Organisation" value={e.organization ?? ''} onChange={(v) => update({ organization: v })} />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <DateField label="Start" value={e.start} onChange={(v) => update({ start: v })} />
                <DateField label="End" value={e.end} onChange={(v) => update({ end: v })} current={e.current} onCurrentChange={(v) => update({ current: v })} allowCurrent />
              </div>
              <BulletListField label="Details" value={e.bullets} onChange={(bullets) => update({ bullets })} />
            </div>
          )}
        />
      );
  }
}

function TableEditor(props: { rows: string[][]; onChange: (rows: string[][]) => void }) {
  const cols = Math.max(2, ...props.rows.map((r) => r.length));
  return (
    <div className="space-y-2 overflow-x-auto">
      {props.rows.map((row, ri) => (
        <div key={ri} className="flex gap-2">
          {Array.from({ length: cols }).map((_, ci) => (
            <input
              key={ci}
              aria-label={`Row ${ri + 1} column ${ci + 1}`}
              value={row[ci] ?? ''}
              onChange={(e) =>
                props.onChange(
                  props.rows.map((r, i) =>
                    i === ri ? Array.from({ length: cols }).map((_, j) => (j === ci ? e.target.value : r[j] ?? '')) : r,
                  ),
                )
              }
              className="min-h-11 min-w-28 flex-1 rounded-md border border-input bg-background px-2 py-1.5 text-sm"
            />
          ))}
          <button
            type="button"
            aria-label={`Delete row ${ri + 1}`}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded border border-input text-destructive"
            onClick={() => props.onChange(props.rows.filter((_, i) => i !== ri))}
          >
            <Trash2 className="h-4 w-4" aria-hidden />
          </button>
        </div>
      ))}
      <button
        type="button"
        className="inline-flex min-h-11 items-center gap-1.5 rounded-md border border-input px-3 text-sm font-medium"
        onClick={() => props.onChange([...props.rows, Array(cols).fill('')])}
      >
        <Plus className="h-4 w-4" aria-hidden /> Add row
      </button>
    </div>
  );
}
