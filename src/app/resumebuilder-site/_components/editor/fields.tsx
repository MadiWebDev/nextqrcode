'use client';

import { useId, useState } from 'react';
import { Bold, Italic, Link2, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import type { ResumeDate, RichText } from '../../_lib/schema';
import { rt } from '../../_lib/schema';

/** Shared editor field components. All inputs are ≥44px touch targets
 * where they act as controls, labelled, and keyboard-operable. */

export function TextField(props: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
  error?: string;
  type?: string;
  maxLength?: number;
  onBlur?: () => void;
}) {
  const id = useId();
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="text-sm font-medium">
        {props.label}
        {props.maxLength ? (
          <span className="ml-2 text-xs font-normal text-muted-foreground">
            {props.value.length}/{props.maxLength}
          </span>
        ) : null}
      </label>
      <input
        id={id}
        type={props.type ?? 'text'}
        value={props.value}
        maxLength={props.maxLength}
        placeholder={props.placeholder}
        onChange={(e) => props.onChange(e.target.value)}
        onBlur={props.onBlur}
        aria-invalid={!!props.error}
        className="min-h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
      />
      {props.error ? (
        <p className="text-xs text-destructive">{props.error}</p>
      ) : props.hint ? (
        <p className="text-xs text-muted-foreground">{props.hint}</p>
      ) : null}
    </div>
  );
}

export function TextAreaField(props: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
  rows?: number;
  maxLength?: number;
}) {
  const id = useId();
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="text-sm font-medium">
        {props.label}
        {props.maxLength ? (
          <span className="ml-2 text-xs font-normal text-muted-foreground">
            {props.value.length}/{props.maxLength}
          </span>
        ) : null}
      </label>
      <textarea
        id={id}
        value={props.value}
        rows={props.rows ?? 3}
        maxLength={props.maxLength}
        placeholder={props.placeholder}
        onChange={(e) => props.onChange(e.target.value)}
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
      />
      {props.hint ? <p className="text-xs text-muted-foreground">{props.hint}</p> : null}
    </div>
  );
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/** Month/year date input with a "current / Present" toggle. */
export function DateField(props: {
  label: string;
  value?: ResumeDate;
  onChange: (v: ResumeDate | undefined) => void;
  current?: boolean;
  onCurrentChange?: (v: boolean) => void;
  allowCurrent?: boolean;
}) {
  const { value, onChange } = props;
  return (
    <fieldset className="space-y-1">
      <legend className="text-sm font-medium">{props.label}</legend>
      <div className="flex flex-wrap items-center gap-2">
        <select
          aria-label={`${props.label} month`}
          value={value?.m ?? ''}
          onChange={(e) =>
            onChange({
              y: value?.y ?? new Date().getFullYear(),
              m: e.target.value ? Number(e.target.value) : undefined,
            })
          }
          className="min-h-11 rounded-md border border-input bg-background px-2 py-2 text-sm"
        >
          <option value="">Year only</option>
          {MONTH_NAMES.map((name, i) => (
            <option key={name} value={i + 1}>
              {name}
            </option>
          ))}
        </select>
        <input
          aria-label={`${props.label} year`}
          type="number"
          min={1950}
          max={2100}
          value={value?.y ?? ''}
          placeholder="Year"
          onChange={(e) =>
            onChange(
              e.target.value
                ? { y: Number(e.target.value), m: value?.m }
                : undefined,
            )
          }
          className="min-h-11 w-24 rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
        {value ? (
          <button
            type="button"
            className="min-h-11 rounded-md border border-input px-3 text-sm"
            onClick={() => onChange(undefined)}
          >
            Clear
          </button>
        ) : null}
        {props.allowCurrent ? (
          <label className="flex min-h-11 items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={!!props.current}
              onChange={(e) => props.onCurrentChange?.(e.target.checked)}
              className="h-4 w-4"
            />
            I currently hold this role
          </label>
        ) : null}
      </div>
    </fieldset>
  );
}

/**
 * Bullet editor over the rich-text AST. Each bullet is one span-run;
 * bold/italic/link apply to the whole bullet (span-level granularity is
 * preserved in storage; the Phase 3 UI edits per-bullet marks).
 * Bullets can be reordered by buttons (keyboard alternative to drag)
 * and moved between entries by the parent via onMoveOut.
 */
export function BulletListField(props: {
  label: string;
  value: RichText;
  onChange: (v: RichText) => void;
  hint?: string;
}) {
  const bulletsBlock = props.value.find((b) => b.type === 'bullets');
  const items: string[][] = bulletsBlock?.type === 'bullets' ? bulletsBlock.items.map((i) => i.map((s) => s.text)) : [];
  const marks: Array<{ bold?: boolean; italic?: boolean; link?: string }> =
    bulletsBlock?.type === 'bullets' ? bulletsBlock.items.map((i) => i[0]?.marks ?? {}) : [];

  const emit = (
    nextItems: string[][],
    nextMarks: typeof marks,
  ) => {
      const others = props.value.filter((b) => b.type !== 'bullets');
      const block =
        nextItems.length === 0
          ? []
          : [
              {
                type: 'bullets' as const,
                items: nextItems.map((item, idx) => [
                  { text: item.join(''), ...(Object.keys(nextMarks[idx] ?? {}).length ? { marks: nextMarks[idx] } : {}) },
                ]),
              },
            ];
      props.onChange([...others, ...block]);
    };

  const move = (idx: number, dir: -1 | 1) => {
    const j = idx + dir;
    if (j < 0 || j >= items.length) return;
    const ni = [...items];
    const nm = [...marks];
    [ni[idx], ni[j]] = [ni[j], ni[idx]];
    [nm[idx], nm[j]] = [nm[j], nm[idx]];
    emit(ni, nm);
  };

  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium">{props.label}</legend>
      {props.hint ? <p className="text-xs text-muted-foreground">{props.hint}</p> : null}
      {items.map((item, idx) => (
        <div key={idx} className="flex items-start gap-1.5">
          <div className="flex flex-col">
            <button type="button" aria-label={`Move bullet ${idx + 1} up`} className="flex h-6 w-8 items-center justify-center rounded border border-input disabled:opacity-40" disabled={idx === 0} onClick={() => move(idx, -1)}>
              <ArrowUp className="h-3.5 w-3.5" aria-hidden />
            </button>
            <button type="button" aria-label={`Move bullet ${idx + 1} down`} className="flex h-6 w-8 items-center justify-center rounded border border-input disabled:opacity-40" disabled={idx === items.length - 1} onClick={() => move(idx, 1)}>
              <ArrowDown className="h-3.5 w-3.5" aria-hidden />
            </button>
          </div>
          <textarea
            aria-label={`Bullet ${idx + 1}`}
            value={item.join('')}
            rows={2}
            onChange={(e) => {
              const ni = items.map((it, i) => (i === idx ? [e.target.value] : it));
              emit(ni, marks);
            }}
            className="min-h-11 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
          <div className="flex flex-col gap-1">
            <div className="flex gap-1">
              <button
                type="button"
                aria-label={`Toggle bold on bullet ${idx + 1}`}
                aria-pressed={!!marks[idx]?.bold}
                className={`flex h-8 w-8 items-center justify-center rounded border ${marks[idx]?.bold ? 'border-primary bg-primary/10' : 'border-input'}`}
                onClick={() => {
                  const nm = [...marks];
                  nm[idx] = { ...nm[idx], bold: !nm[idx]?.bold };
                  emit(items, nm);
                }}
              >
                <Bold className="h-3.5 w-3.5" aria-hidden />
              </button>
              <button
                type="button"
                aria-label={`Toggle italic on bullet ${idx + 1}`}
                aria-pressed={!!marks[idx]?.italic}
                className={`flex h-8 w-8 items-center justify-center rounded border ${marks[idx]?.italic ? 'border-primary bg-primary/10' : 'border-input'}`}
                onClick={() => {
                  const nm = [...marks];
                  nm[idx] = { ...nm[idx], italic: !nm[idx]?.italic };
                  emit(items, nm);
                }}
              >
                <Italic className="h-3.5 w-3.5" aria-hidden />
              </button>
              <button
                type="button"
                aria-label={`Remove bullet ${idx + 1}`}
                className="flex h-8 w-8 items-center justify-center rounded border border-input text-destructive"
                onClick={() => emit(items.filter((_, i) => i !== idx), marks.filter((_, i) => i !== idx))}
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden />
              </button>
            </div>
            <LinkEditor
              value={marks[idx]?.link}
              onChange={(link) => {
                const nm = [...marks];
                nm[idx] = { ...nm[idx], link };
                emit(items, nm);
              }}
            />
          </div>
        </div>
      ))}
      <button
        type="button"
        className="inline-flex min-h-11 items-center gap-1.5 rounded-md border border-input px-3 text-sm font-medium"
        onClick={() => emit([...items, ['']], [...marks, {}])}
      >
        <Plus className="h-4 w-4" aria-hidden /> Add bullet
      </button>
    </fieldset>
  );
}

function LinkEditor(props: { value?: string; onChange: (v: string | undefined) => void }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(props.value ?? '');
  if (!open) {
    return (
      <button
        type="button"
        aria-label="Set link for this bullet"
        className={`flex h-8 w-8 items-center justify-center rounded border ${props.value ? 'border-primary bg-primary/10' : 'border-input'}`}
        onClick={() => {
          setDraft(props.value ?? '');
          setOpen(true);
        }}
      >
        <Link2 className="h-3.5 w-3.5" aria-hidden />
      </button>
    );
  }
  return (
    <span className="flex items-center gap-1">
      <input
        aria-label="Link URL"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder="https://…"
        className="h-8 w-36 rounded border border-input bg-background px-2 text-xs"
      />
      <button
        type="button"
        className="h-8 rounded border border-input px-2 text-xs"
        onClick={() => {
          props.onChange(draft.trim() || undefined);
          setOpen(false);
        }}
      >
        Set
      </button>
    </span>
  );
}

/** Paragraph rich text: one textarea per paragraph, stored as AST paragraphs. */
export function RichTextField(props: {
  label: string;
  value: RichText;
  onChange: (v: RichText) => void;
  hint?: string;
  maxLength?: number;
}) {
  const paragraphs = props.value.filter((b) => b.type === 'paragraph');
  const text = paragraphs.map((p) => (p.type === 'paragraph' ? p.spans.map((s) => s.text).join('') : '')).join('\n\n');
  return (
    <TextAreaField
      label={props.label}
      value={text}
      hint={props.hint}
      rows={5}
      maxLength={props.maxLength}
      onChange={(v) => {
        const blocks = v
          .split(/\n\s*\n/)
          .map((chunk) => chunk.trim())
          .filter(Boolean)
          .map((chunk) => rt.p(chunk));
        const bullets = props.value.filter((b) => b.type === 'bullets');
        props.onChange([...blocks, ...bullets]);
      }}
    />
  );
}

/** Tag list editor (skills-style chips, interests, custom tag sections). */
export function TagsField(props: {
  label: string;
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState('');
  const add = () => {
    const v = draft.trim();
    if (v && !props.value.includes(v)) props.onChange([...props.value, v]);
    setDraft('');
  };
  return (
    <div className="space-y-2">
      <span className="text-sm font-medium">{props.label}</span>
      <div className="flex flex-wrap gap-1.5">
        {props.value.map((tag) => (
          <span key={tag} className="inline-flex items-center gap-1 rounded-full border border-border bg-muted px-2.5 py-1 text-xs">
            {tag}
            <button
              type="button"
              aria-label={`Remove ${tag}`}
              className="text-muted-foreground hover:text-destructive"
              onClick={() => props.onChange(props.value.filter((t) => t !== tag))}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          aria-label={`Add to ${props.label}`}
          value={draft}
          placeholder={props.placeholder ?? 'Type and press Add'}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              add();
            }
          }}
          className="min-h-11 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
        <button type="button" className="min-h-11 rounded-md border border-input px-3 text-sm font-medium" onClick={add}>
          Add
        </button>
      </div>
    </div>
  );
}
