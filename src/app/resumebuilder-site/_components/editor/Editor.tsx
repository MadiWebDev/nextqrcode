'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  ArrowLeft,
  Eye,
  EyeOff,
  GripVertical,
  Plus,
  Redo2,
  Trash2,
  Undo2,
  Wand2,
  X,
  Keyboard,
} from 'lucide-react';
import type { ResumeDoc, Section, SectionKind } from '../../_lib/schema';
import { SECTION_KINDS, SENSITIVE_KEYS } from '../../_lib/schema';
import { makeSection, uid } from '../../_lib/defaults';
import { REGIONS } from '../../_lib/regions';
import { PROFESSION_PACKS, getPack } from '../../_lib/packs';
import { isValidEmail } from '../../_lib/validation';
import type { ResumeStore } from '../../_lib/db';
import { createDebouncedSaver, openTabChannel, isConflict, type SaveStatus } from '../../_lib/autosave';
import { TextField } from './fields';
import { SectionEditor } from './SectionEditor';
import { ResumePreview } from './Preview';
import { TemplateView } from '../TemplateView';
import { loadTemplate, TEMPLATE_META } from '../../_lib/templates/registry';
import type { TemplateDef } from '../../_lib/templates/types';
import { PhotoStudio } from './PhotoStudio';

const SENSITIVE_LABELS: Record<string, { label: string; note: string }> = {
  dateOfBirth: {
    label: 'Date of birth',
    note: 'Age is a protected characteristic in many countries. Include it only when an employer explicitly asks.',
  },
  nationality: {
    label: 'Nationality',
    note: 'Relevant where work eligibility matters; it can also invite discrimination. Include deliberately.',
  },
  maritalStatus: {
    label: 'Marital status',
    note: 'Rarely relevant to ability to do a job. Most modern employers neither need nor want it.',
  },
  visaStatus: {
    label: 'Visa / work status',
    note: 'Useful where employers must verify the right to work; state the status, not document numbers.',
  },
  drivingLicence: {
    label: 'Driving licence',
    note: 'Relevant for driving and field roles. State the category, never the licence number.',
  },
  parentName: {
    label: "Parent's name",
    note: 'Customary on some South Asian CV formats; unnecessary in most other regions.',
  },
};

const WIZARD_STEPS = [
  'Target role',
  'Contact',
  'Summary',
  'Experience',
  'Education',
  'Skills',
  'Extras',
  'Design',
] as const;

function SortableSection(props: {
  section: Section;
  children: React.ReactNode;
  onToggleVisible: () => void;
  onRename: (title: string) => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: props.section.id,
  });
  const [renaming, setRenaming] = useState(false);
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className="rounded-lg border border-border bg-card"
    >
      <div className="flex items-center gap-1 border-b border-border px-2 py-1.5">
        <button
          type="button"
          aria-label={`Drag to reorder ${props.section.title}. Use the move buttons in the section menu for keyboard reordering.`}
          className="flex h-11 w-9 cursor-grab items-center justify-center rounded text-muted-foreground"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-5 w-5" aria-hidden />
        </button>
        {renaming ? (
          <input
            aria-label="Section title"
            defaultValue={props.section.title}
            autoFocus
            onBlur={(e) => {
              props.onRename(e.target.value.trim() || props.section.title);
              setRenaming(false);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
            }}
            className="min-h-11 flex-1 rounded-md border border-input bg-background px-2 py-1 text-sm font-semibold"
          />
        ) : (
          <button
            type="button"
            className="min-h-11 flex-1 rounded px-1 text-left text-sm font-semibold"
            onClick={() => setRenaming(true)}
            title="Rename section"
          >
            {props.section.title}
            {!props.section.visible ? <span className="ml-2 text-xs font-normal text-muted-foreground">(hidden)</span> : null}
          </button>
        )}
        <button
          type="button"
          aria-label={props.section.visible ? `Hide ${props.section.title}` : `Show ${props.section.title}`}
          className="flex h-11 w-11 items-center justify-center rounded border border-input"
          onClick={props.onToggleVisible}
        >
          {props.section.visible ? <Eye className="h-4 w-4" aria-hidden /> : <EyeOff className="h-4 w-4" aria-hidden />}
        </button>
        <button
          type="button"
          aria-label={`Delete ${props.section.title}`}
          className="flex h-11 w-11 items-center justify-center rounded border border-input text-destructive"
          onClick={props.onDelete}
        >
          <Trash2 className="h-4 w-4" aria-hidden />
        </button>
      </div>
      <div className="p-3">{props.children}</div>
    </div>
  );
}

export function Editor(props: {
  initialDoc: ResumeDoc;
  store: ResumeStore;
  onBack: () => void;
  onDocSaved: (doc: ResumeDoc) => void;
}) {
  const { store } = props;
  const [doc, setDoc] = useState<ResumeDoc>(props.initialDoc);
  const [past, setPast] = useState<ResumeDoc[]>([]);
  const [future, setFuture] = useState<ResumeDoc[]>([]);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>({ state: 'idle' });
  const [mobileTab, setMobileTab] = useState<'edit' | 'preview'>('edit');
  const [wizardStep, setWizardStep] = useState<number | null>(null);
  const [conflict, setConflict] = useState<ResumeDoc | null>(null);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(undefined);
  const [template, setTemplate] = useState<TemplateDef | null>(null);

  useEffect(() => {
    let cancelled = false;
    void loadTemplate(doc.meta.templateId).then((def) => {
      if (!cancelled) setTemplate(def);
    });
    return () => {
      cancelled = true;
    };
  }, [doc.meta.templateId]);
  const [tabId] = useState(() => uid('tab'));
  const docRef = useRef(doc);
  useEffect(() => {
    docRef.current = doc;
  }, [doc]);

  // ── persistence: debounced saver + tab channel + auto-snapshot ──
  const saver = useMemo(
    () =>
      createDebouncedSaver<ResumeDoc>(async (d) => {
        await store.putResume(d);
        props.onDocSaved(d);
      }, 700),
    [store, props],
  );
  useEffect(() => {
    saver.onStatus(setSaveStatus);
  }, [saver]);

  useEffect(() => {
    const channel = openTabChannel(tabId);
    const off = channel.onMessage(async (msg) => {
      if (isConflict({ id: docRef.current.id, updatedAt: docRef.current.meta.updatedAt }, msg, tabId)) {
        const fresh = await store.getResume(msg.resumeId);
        if (fresh) setConflict(fresh);
      }
    });
    return () => {
      off();
      channel.close();
    };
  }, [store, tabId]);

  // Restore persisted undo history (survives reloads).
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const saved = await store.getSetting<{ past: ResumeDoc[] }>(`history:${props.initialDoc.id}`);
      if (!cancelled && saved?.past?.length) setPast(saved.past.slice(-50));
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store]);

  // Load the photo object URL for the preview.
  useEffect(() => {
    let url: string | undefined;
    let cancelled = false;
    void (async () => {
      const id = doc.photo.croppedId ?? doc.photo.originalId;
      if (!id) {
        setPhotoUrl(undefined);
        return;
      }
      const rec = await store.getPhoto(id);
      if (rec && !cancelled) {
        url = URL.createObjectURL(rec.blob);
        setPhotoUrl(url);
      }
    })();
    return () => {
      cancelled = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, [store, doc.photo.croppedId, doc.photo.originalId]);

  const update = useCallback(
    (next: ResumeDoc, recordHistory = true) => {
      const stamped = { ...next, meta: { ...next.meta, updatedAt: Date.now() } };
      if (recordHistory) {
        setPast((p) => {
          const np = [...p.slice(-99), docRef.current];
          void store.putSetting(`history:${stamped.id}`, { past: np.slice(-50) });
          return np;
        });
        setFuture([]);
      }
      setDoc(stamped);
      saver.schedule(stamped);
    },
    [saver, store],
  );

  const undo = useCallback(() => {
    setPast((p) => {
      if (p.length === 0) return p;
      const prev = p[p.length - 1];
      setFuture((f) => [docRef.current, ...f].slice(0, 100));
      setDoc(prev);
      saver.schedule(prev);
      return p.slice(0, -1);
    });
  }, [saver]);

  const redo = useCallback(() => {
    setFuture((f) => {
      if (f.length === 0) return f;
      const next = f[0];
      setPast((p) => [...p, docRef.current]);
      setDoc(next);
      saver.schedule(next);
      return f.slice(1);
    });
  }, [saver]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.ctrlKey || e.metaKey;
      if (mod && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if (mod && (e.key.toLowerCase() === 'y' || (e.key.toLowerCase() === 'z' && e.shiftKey))) {
        e.preventDefault();
        redo();
      } else if (mod && e.key.toLowerCase() === 's') {
        e.preventDefault();
        void saver.flush();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [undo, redo, saver]);

  const patch = useCallback(
    (fn: (d: ResumeDoc) => ResumeDoc) => update(fn(docRef.current)),
    [update],
  );

  const patchSection = useCallback(
    (section: Section) =>
      patch((d) => ({
        ...d,
        sections: d.sections.map((s) => (s.id === section.id ? section : s)),
      })),
    [patch],
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    patch((d) => {
      const oldIndex = d.sections.findIndex((s) => s.id === active.id);
      const newIndex = d.sections.findIndex((s) => s.id === over.id);
      return { ...d, sections: arrayMove(d.sections, oldIndex, newIndex) };
    });
  };

  const region = REGIONS[doc.meta.region];
  const packHintsFor = (kind: SectionKind) =>
    PROFESSION_PACKS.flatMap((p) =>
      p.fieldHints.filter((h) => h.appliesTo === kind).map((h) => ({ key: h.key, label: h.label, hint: h.hint })),
    );

  const applyRegionDefaults = () => {
    patch((d) => {
      const existing = new Set(d.sections.map((s) => s.kind));
      const additions = region.defaultSections
        .filter((k) => !existing.has(k))
        .map((k) => makeSection(k));
      return {
        ...d,
        meta: { ...d.meta, region: region.id },
        theme: { ...d.theme, dateFormat: region.dateFormat },
        sections: [...d.sections, ...additions],
      };
    });
  };

  const applyPack = (packId: string) => {
    const pack = getPack(packId);
    if (!pack) return;
    patch((d) => {
      const existingKinds = new Set(d.sections.map((s) => s.kind));
      const existingTitles = new Set(d.sections.map((s) => s.title.toLowerCase()));
      const additions: Section[] = [
        ...pack.addSections.filter((k) => !existingKinds.has(k)).map((k) => makeSection(k)),
        ...pack.customSections
          .filter((c) => !existingTitles.has(c.title.toLowerCase()))
          .map((c) => ({ ...makeSection('custom', c.title), customType: c.customType })),
      ];
      return { ...d, sections: [...d.sections, ...additions] };
    });
  };

  const basicsForm = (
    <div className="space-y-3 rounded-lg border border-border bg-card p-3">
      <h2 className="text-sm font-semibold">Contact & headline</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        <TextField label="Full name" value={doc.basics.name} onChange={(v) => patch((d) => ({ ...d, basics: { ...d.basics, name: v } }))} maxLength={80} />
        <TextField label="Headline / target title" value={doc.basics.headline} onChange={(v) => patch((d) => ({ ...d, basics: { ...d.basics, headline: v } }))} placeholder="e.g. Secondary School Mathematics Teacher" maxLength={120} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <TextField
          label="Email"
          type="email"
          value={doc.basics.email}
          error={doc.basics.email && !isValidEmail(doc.basics.email) ? 'This does not look like a complete email address.' : undefined}
          onChange={(v) => patch((d) => ({ ...d, basics: { ...d.basics, email: v } }))}
        />
        <TextField
          label="Phone"
          value={doc.basics.phone}
          onChange={(v) => patch((d) => ({ ...d, basics: { ...d.basics, phone: v } }))}
          onBlur={() => {
            const raw = docRef.current.basics.phone.trim();
            if (!raw) return;
            // Lazy-loaded: libphonenumber-js stays out of the editor bundle until needed.
            void import('libphonenumber-js')
              .then(({ parsePhoneNumber }) => {
                try {
                  const parsed = parsePhoneNumber(raw);
                  if (parsed?.isValid()) {
                    const formatted = parsed.formatInternational();
                    if (formatted !== raw) {
                      patch((d) => ({ ...d, basics: { ...d.basics, phone: formatted } }));
                    }
                  }
                } catch {
                  // Not parseable as an international number — leave the user's text untouched.
                }
              })
              .catch(() => undefined);
          }}
          hint="Include the country code if you apply internationally; it is formatted when you leave the field."
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <TextField label="Location" value={doc.basics.location} onChange={(v) => patch((d) => ({ ...d, basics: { ...d.basics, location: v } }))} placeholder="City, Country" />
        <TextField
          label="Website"
          value={doc.basics.website}
          onChange={(v) => patch((d) => ({ ...d, basics: { ...d.basics, website: v } }))}
        />
      </div>
      <div className="space-y-2">
        <span className="text-sm font-medium">Links (portfolio, LinkedIn, GitHub…)</span>
        {doc.basics.links.map((link) => (
          <div key={link.id} className="flex gap-2">
            <input
              aria-label="Link label"
              value={link.label}
              placeholder="Label"
              onChange={(e) =>
                patch((d) => ({
                  ...d,
                  basics: { ...d.basics, links: d.basics.links.map((l) => (l.id === link.id ? { ...l, label: e.target.value } : l)) },
                }))
              }
              className="min-h-11 w-32 rounded-md border border-input bg-background px-2 py-1.5 text-sm"
            />
            <input
              aria-label="Link URL"
              value={link.url}
              placeholder="https://…"
              onChange={(e) =>
                patch((d) => ({
                  ...d,
                  basics: { ...d.basics, links: d.basics.links.map((l) => (l.id === link.id ? { ...l, url: e.target.value } : l)) },
                }))
              }
              className="min-h-11 flex-1 rounded-md border border-input bg-background px-2 py-1.5 text-sm"
            />
            <button
              type="button"
              aria-label="Remove link"
              className="flex h-11 w-11 items-center justify-center rounded border border-input text-destructive"
              onClick={() => patch((d) => ({ ...d, basics: { ...d.basics, links: d.basics.links.filter((l) => l.id !== link.id) } }))}
            >
              <Trash2 className="h-4 w-4" aria-hidden />
            </button>
          </div>
        ))}
        <button
          type="button"
          className="inline-flex min-h-11 items-center gap-1.5 rounded-md border border-input px-3 text-sm font-medium"
          onClick={() => patch((d) => ({ ...d, basics: { ...d.basics, links: [...d.basics.links, { id: uid('link'), label: '', url: '' }] } }))}
        >
          <Plus className="h-4 w-4" aria-hidden /> Add link
        </button>
      </div>
    </div>
  );

  const sensitivePanel = (
    <div className="space-y-3 rounded-lg border border-border bg-card p-3">
      <h2 className="text-sm font-semibold">Personal details (optional)</h2>
      <p className="text-xs text-muted-foreground">
        These are off by default. Your region ({region.label}) customarily offers:{' '}
        {region.sensitiveOffered.length ? region.sensitiveOffered.map((k) => SENSITIVE_LABELS[k].label).join(', ') : 'none of these fields'}.
        Add only what a specific employer asks for.
      </p>
      {region.sensitiveOffered.map((key) => {
        const field = doc.sensitive[key];
        const info = SENSITIVE_LABELS[key];
        return (
          <div key={key} className="rounded-md border border-dashed border-border p-3">
            <TextField
              label={info.label}
              value={field?.value ?? ''}
              hint={info.note}
              onChange={(v) =>
                patch((d) => ({
                  ...d,
                  sensitive: { ...d.sensitive, [key]: { value: v, include: field?.include ?? false } },
                }))
              }
            />
            <div className="mt-2 flex flex-wrap gap-2">
              <label className="flex min-h-11 items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={!!field?.include}
                  disabled={!field?.value}
                  onChange={(e) =>
                    patch((d) => ({
                      ...d,
                      sensitive: { ...d.sensitive, [key]: { value: field?.value ?? '', include: e.target.checked } },
                    }))
                  }
                  className="h-4 w-4"
                />
                Show on the resume
              </label>
              {field?.value ? (
                <button
                  type="button"
                  className="min-h-11 rounded-md border border-input px-3 text-sm text-destructive"
                  onClick={() =>
                    patch((d) => {
                      const next = { ...d.sensitive };
                      delete next[key as (typeof SENSITIVE_KEYS)[number]];
                      return { ...d, sensitive: next };
                    })
                  }
                >
                  Remove completely
                </button>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );

  const designPanel = (
    <div className="space-y-3 rounded-lg border border-border bg-card p-3">
      <h2 className="text-sm font-semibold">Design basics</h2>
      <label className="block space-y-1">
        <span className="text-sm font-medium">Template</span>
        <select
          aria-label="Template"
          value={doc.meta.templateId}
          onChange={(e) => {
            const id = e.target.value;
            void loadTemplate(id).then((def) =>
              patch((d) => ({
                ...d,
                meta: { ...d.meta, templateId: id },
                theme: { ...d.theme, accent: def.tokens.accent },
              })),
            );
          }}
          className="min-h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          {TEMPLATE_META.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name} — {t.profession}
            </option>
          ))}
        </select>
      </label>
      {template ? (
        <p className="text-xs text-muted-foreground">
          {template.atsSafe ? 'ATS-safe template. ' : 'Designed template (best for human readers). '}
          {template.why}
        </p>
      ) : null}
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block space-y-1">
          <span className="text-sm font-medium">Regional mode</span>
          <select
            value={doc.meta.region}
            onChange={(e) => patch((d) => ({ ...d, meta: { ...d.meta, region: e.target.value as ResumeDoc['meta']['region'] } }))}
            className="min-h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            {Object.values(REGIONS).map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block space-y-1">
          <span className="text-sm font-medium">Page size</span>
          <select
            value={doc.theme.pageSize}
            onChange={(e) => patch((d) => ({ ...d, theme: { ...d.theme, pageSize: e.target.value as 'a4' | 'letter' } }))}
            className="min-h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="a4">A4</option>
            <option value="letter">US Letter</option>
          </select>
        </label>
      </div>
      <p className="text-xs text-muted-foreground">{region.pageGuidance}</p>
      <p className="text-xs text-muted-foreground">Photo: {region.photoNote}</p>
      <div className="flex flex-wrap gap-2">
        <button type="button" className="min-h-11 rounded-md border border-input px-3 text-sm font-medium" onClick={applyRegionDefaults}>
          Apply {region.label} default sections
        </button>
        <label className="flex min-h-11 items-center gap-2 text-sm">
          Accent
          <input
            type="color"
            value={doc.theme.accent}
            onChange={(e) => patch((d) => ({ ...d, theme: { ...d.theme, accent: e.target.value } }))}
            className="h-11 w-14 rounded border border-input bg-background"
            aria-label="Accent colour"
          />
        </label>
      </div>
      <label className="block space-y-1">
        <span className="text-sm font-medium">Add a profession pack (sections & fields)</span>
        <span className="flex gap-2">
          <select id="pack-select" className="min-h-11 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm" defaultValue="">
            <option value="" disabled>
              Choose a profession…
            </option>
            {PROFESSION_PACKS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="min-h-11 rounded-md border border-input px-3 text-sm font-medium"
            onClick={() => {
              const sel = document.getElementById('pack-select') as HTMLSelectElement | null;
              if (sel?.value) applyPack(sel.value);
            }}
          >
            Add pack
          </button>
        </span>
      </label>
    </div>
  );

  const sectionsList = (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={doc.sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {doc.sections.map((section) => (
            <SortableSection
              key={section.id}
              section={section}
              onToggleVisible={() => patchSection({ ...section, visible: !section.visible })}
              onRename={(title) => patchSection({ ...section, title })}
              onDelete={() => patch((d) => ({ ...d, sections: d.sections.filter((s) => s.id !== section.id) }))}
            >
              <SectionEditor section={section} onChange={patchSection} packHints={packHintsFor(section.kind)} />
            </SortableSection>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );

  const addSectionMenu = (
    <label className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium">Add section:</span>
      <select
        id="add-section-select"
        className="min-h-11 rounded-md border border-input bg-background px-3 py-2 text-sm"
        defaultValue=""
      >
        <option value="" disabled>
          Choose…
        </option>
        {SECTION_KINDS.map((k) => (
          <option key={k} value={k}>
            {k === 'custom' ? 'Custom section' : k.charAt(0).toUpperCase() + k.slice(1)}
          </option>
        ))}
      </select>
      <button
        type="button"
        className="inline-flex min-h-11 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground"
        onClick={() => {
          const sel = document.getElementById('add-section-select') as HTMLSelectElement | null;
          if (sel?.value) {
            patch((d) => ({ ...d, sections: [...d.sections, makeSection(sel.value as SectionKind)] }));
            sel.value = '';
          }
        }}
      >
        <Plus className="h-4 w-4" aria-hidden /> Add
      </button>
    </label>
  );

  const wizardBody = (step: number) => {
    switch (WIZARD_STEPS[step]) {
      case 'Target role':
        return (
          <div className="space-y-3">
            <TextField label="What job are you applying for?" value={doc.meta.targetRole ?? ''} onChange={(v) => patch((d) => ({ ...d, meta: { ...d.meta, targetRole: v } }))} placeholder="e.g. Staff Nurse, ICU" hint="Used for the headline suggestion and the job-match tools. Stored only in this browser." />
            <TextField label="Resume name (only you see this)" value={doc.meta.title} onChange={(v) => patch((d) => ({ ...d, meta: { ...d.meta, title: v } }))} />
            {designPanel}
          </div>
        );
      case 'Contact':
        return basicsForm;
      case 'Summary': {
        const s = doc.sections.find((x) => x.kind === 'summary');
        return s ? <SectionEditor section={s} onChange={patchSection} packHints={[]} /> : <p>Add a Summary section from the Extras step.</p>;
      }
      case 'Experience': {
        const s = doc.sections.find((x) => x.kind === 'experience');
        return s ? <SectionEditor section={s} onChange={patchSection} packHints={packHintsFor('experience')} /> : null;
      }
      case 'Education': {
        const s = doc.sections.find((x) => x.kind === 'education');
        return s ? <SectionEditor section={s} onChange={patchSection} packHints={[]} /> : null;
      }
      case 'Skills': {
        const s = doc.sections.find((x) => x.kind === 'skills');
        return s ? <SectionEditor section={s} onChange={patchSection} packHints={[]} /> : null;
      }
      case 'Extras':
        return (
          <div className="space-y-3">
            {addSectionMenu}
            {sensitivePanel}
          </div>
        );
      case 'Design':
        return designPanel;
      default:
        return null;
    }
  };

  return (
    <div className="mx-auto max-w-[1600px] px-3 py-4 sm:px-5">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <button type="button" className="inline-flex min-h-11 items-center gap-1.5 rounded-md border border-input px-3 text-sm font-medium" onClick={props.onBack}>
          <ArrowLeft className="h-4 w-4" aria-hidden /> All resumes
        </button>
        <input
          aria-label="Resume name"
          value={doc.meta.title}
          onChange={(e) => patch((d) => ({ ...d, meta: { ...d.meta, title: e.target.value } }))}
          className="min-h-11 min-w-40 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm font-semibold sm:flex-none sm:w-72"
        />
        <span aria-live="polite" className="text-xs text-muted-foreground">
          {saveStatus.state === 'saving'
            ? 'Saving…'
            : saveStatus.state === 'saved'
              ? `Saved locally at ${new Date(saveStatus.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
              : saveStatus.state === 'error'
                ? `Could not save: ${saveStatus.message}`
                : ''}
        </span>
        <div className="ml-auto flex gap-1.5">
          <button type="button" aria-label="Undo (Ctrl+Z)" className="flex h-11 w-11 items-center justify-center rounded border border-input disabled:opacity-40" disabled={past.length === 0} onClick={undo}>
            <Undo2 className="h-4 w-4" aria-hidden />
          </button>
          <button type="button" aria-label="Redo (Ctrl+Y)" className="flex h-11 w-11 items-center justify-center rounded border border-input disabled:opacity-40" disabled={future.length === 0} onClick={redo}>
            <Redo2 className="h-4 w-4" aria-hidden />
          </button>
          <button type="button" className="inline-flex min-h-11 items-center gap-1.5 rounded-md border border-input px-3 text-sm font-medium" onClick={() => setWizardStep(0)}>
            <Wand2 className="h-4 w-4" aria-hidden /> Guided mode
          </button>
          <button type="button" aria-label="Keyboard shortcuts" className="flex h-11 w-11 items-center justify-center rounded border border-input" onClick={() => setShowShortcuts(true)}>
            <Keyboard className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>

      {conflict && (
        <div role="alert" className="mb-3 rounded-lg border border-amber-500 bg-amber-50 p-3 text-sm text-amber-900 dark:bg-amber-950 dark:text-amber-100">
          <p className="font-medium">This resume was changed in another tab.</p>
          <p className="mt-1">The other tab saved a newer copy. You can switch to that copy, or keep editing this one (saving will overwrite). Nothing has been merged silently.</p>
          <div className="mt-2 flex gap-2">
            <button type="button" className="min-h-11 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground" onClick={() => { setDoc(conflict); setConflict(null); }}>
              Use the newer copy
            </button>
            <button type="button" className="min-h-11 rounded-md border border-input bg-background px-3 text-sm font-medium" onClick={() => setConflict(null)}>
              Keep editing mine
            </button>
          </div>
        </div>
      )}

      {showShortcuts && (
        <div role="dialog" aria-modal="true" aria-label="Keyboard shortcuts" className="mb-3 rounded-lg border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Keyboard shortcuts</h2>
            <button type="button" aria-label="Close shortcuts" className="flex h-11 w-11 items-center justify-center rounded border border-input" onClick={() => setShowShortcuts(false)}>
              <X className="h-4 w-4" aria-hidden />
            </button>
          </div>
          <ul className="mt-2 space-y-1 text-sm">
            <li><kbd>Ctrl/⌘ + Z</kbd> — Undo</li>
            <li><kbd>Ctrl/⌘ + Shift + Z</kbd> or <kbd>Ctrl/⌘ + Y</kbd> — Redo</li>
            <li><kbd>Ctrl/⌘ + S</kbd> — Save now</li>
            <li>Sections and bullets can be reordered with the arrow buttons next to them — no dragging required.</li>
          </ul>
        </div>
      )}

      {wizardStep !== null ? (
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-semibold">
              Guided mode — step {wizardStep + 1} of {WIZARD_STEPS.length}: {WIZARD_STEPS[wizardStep]}
            </h2>
            <div className="ml-auto flex gap-2">
              <button type="button" className="min-h-11 rounded-md border border-input px-3 text-sm font-medium" disabled={wizardStep === 0} onClick={() => setWizardStep((s) => (s !== null && s > 0 ? s - 1 : s))}>
                Back
              </button>
              <button
                type="button"
                className="min-h-11 rounded-md border border-input px-3 text-sm font-medium"
                onClick={() => setWizardStep((s) => (s !== null && s < WIZARD_STEPS.length - 1 ? s + 1 : null))}
              >
                {wizardStep < WIZARD_STEPS.length - 1 ? 'Skip / Next' : 'Finish'}
              </button>
              <button type="button" className="min-h-11 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground" onClick={() => setWizardStep(null)}>
                Exit guided mode
              </button>
            </div>
          </div>
          <div className="mt-2 h-1.5 rounded bg-muted" role="progressbar" aria-valuenow={wizardStep + 1} aria-valuemin={1} aria-valuemax={WIZARD_STEPS.length} aria-label="Guided mode progress">
            <div className="h-full rounded bg-primary" style={{ width: `${((wizardStep + 1) / WIZARD_STEPS.length) * 100}%` }} />
          </div>
          <div className="mt-4">{wizardBody(wizardStep)}</div>
        </div>
      ) : (
        <>
          <div className="mb-3 flex gap-2 lg:hidden" role="tablist" aria-label="Editor or preview">
            <button type="button" role="tab" aria-selected={mobileTab === 'edit'} className={`min-h-11 flex-1 rounded-md border px-3 text-sm font-medium ${mobileTab === 'edit' ? 'border-primary bg-primary/10' : 'border-input'}`} onClick={() => setMobileTab('edit')}>
              Edit
            </button>
            <button type="button" role="tab" aria-selected={mobileTab === 'preview'} className={`min-h-11 flex-1 rounded-md border px-3 text-sm font-medium ${mobileTab === 'preview' ? 'border-primary bg-primary/10' : 'border-input'}`} onClick={() => setMobileTab('preview')}>
              Preview
            </button>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <div className={`space-y-3 ${mobileTab === 'preview' ? 'hidden lg:block' : ''}`}>
              {basicsForm}
              <PhotoStudio
                store={store}
                resumeId={doc.id}
                photo={doc.photo}
                accent={doc.theme.accent}
                onChange={(photo) => patch((d) => ({ ...d, photo }))}
              />
              {sectionsList}
              {addSectionMenu}
              {sensitivePanel}
              {designPanel}
            </div>
            <div className={`${mobileTab === 'edit' ? 'hidden lg:block' : ''}`}>
              <div className="lg:sticky lg:top-20">
                {template ? (
                  <TemplateView doc={doc} template={template} photoUrl={photoUrl} />
                ) : (
                  <ResumePreview doc={doc} photoUrl={photoUrl} />
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
