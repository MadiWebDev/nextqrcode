import type { ResumeDoc, RichText, Section } from '../schema';
import { rt } from '../schema';
import { formatDateRange } from '../dates';
import type { Block, TemplateDef } from './types';
import { usableWidth } from './types';

/**
 * Convert a ResumeDoc into the ordered block list for a template.
 * Heights are estimated from text volume (chars-per-line from the
 * usable width and the template's base size); the preview re-measures
 * real DOM heights and re-paginates, and the PDF writer lays out the
 * same blocks — reading order never differs between outputs.
 */

export interface HeaderPayload {
  name: string;
  headline: string;
  contactLine: string;
  linksLine: string;
  sensitiveLine: string;
  showPhoto: boolean;
  qrEnabled: boolean;
}

export interface EntryPayload {
  title: string;
  subtitle?: string;
  dateLine?: string;
  location?: string;
  body: RichText;
  meta?: string[];
}

export interface SkillsPayload {
  groups: Array<{ name: string; skills: Array<{ name: string; level?: number }> }>;
}

function estimateTextHeight(text: string, cpl: number, lineHeightPx: number): number {
  if (!text.trim()) return 0;
  const lines = Math.max(1, Math.ceil(text.length / cpl));
  return lines * lineHeightPx;
}

function richHeight(blocks: RichText, cpl: number, lineHeightPx: number): number {
  let h = 0;
  for (const b of blocks) {
    if (b.type === 'paragraph') {
      h += estimateTextHeight(b.spans.map((s) => s.text).join(''), cpl, lineHeightPx);
    } else {
      for (const item of b.items) {
        h += estimateTextHeight(item.map((s) => s.text).join(''), cpl, lineHeightPx) + 2;
      }
    }
  }
  return h;
}

export function sectionHasContent(s: Section): boolean {
  return (
    (s.text?.some((b) => rt.plain([b]).trim().length > 0) ?? false) ||
    (s.experience?.length ?? 0) > 0 ||
    (s.education?.length ?? 0) > 0 ||
    (s.skillGroups?.some((g) => g.skills.length > 0) ?? false) ||
    (s.projects?.length ?? 0) > 0 ||
    (s.certifications?.length ?? 0) > 0 ||
    (s.awards?.length ?? 0) > 0 ||
    (s.languages?.length ?? 0) > 0 ||
    (s.publications?.length ?? 0) > 0 ||
    (s.entries?.length ?? 0) > 0 ||
    (s.references?.length ?? 0) > 0 ||
    (s.tags?.length ?? 0) > 0 ||
    (s.table?.length ?? 0) > 0 ||
    (s.kind === 'references' && s.referencesMode === 'on-request')
  );
}

export function buildBlocks(doc: ResumeDoc, template: TemplateDef): Block[] {
  const t = template.tokens;
  const width = usableWidth(doc.theme.pageSize, doc.theme.margin);
  const mainWidth =
    template.columns === 2 ? width * (template.layout === 'label-column' ? 0.72 : 0.66) : width;
  const sideWidth = template.columns === 2 ? width - mainWidth - 24 : width;
  const cplMain = Math.max(24, Math.floor(mainWidth / (t.baseSize * 0.52)));
  const cplSide = Math.max(16, Math.floor(sideWidth / (t.baseSize * 0.52)));
  const lh = t.baseSize * t.lineHeight;
  const sideKinds = new Set(template.sideSections ?? []);
  const columnFor = (s: Section): 'main' | 'side' =>
    template.columns === 2 && sideKinds.has(s.kind) ? 'side' : 'main';

  const blocks: Block[] = [];

  const sensitiveLine = Object.values(doc.sensitive)
    .filter((f) => f?.include && f.value.trim())
    .map((f) => f!.value)
    .join('  ·  ');
  blocks.push({
    id: 'header',
    kind: 'header',
    height: template.header === 'band' ? 108 : 92,
    column: 'main',
    payload: {
      name: doc.basics.name,
      headline: doc.basics.headline,
      contactLine: [doc.basics.email, doc.basics.phone, doc.basics.location, doc.basics.website]
        .filter(Boolean)
        .join('  ·  '),
      linksLine: doc.basics.links.map((l) => `${l.label}: ${l.url}`).join('  ·  '),
      sensitiveLine,
      showPhoto: doc.photo.show && template.supportsPhoto,
      qrEnabled: doc.qr.enabled,
    } satisfies HeaderPayload,
  });

  const ordered = [...doc.sections]
    .filter((s) => s.visible && sectionHasContent(s))
    .sort((a, b) => {
      const ia = template.sectionOrder.indexOf(a.kind);
      const ib = template.sectionOrder.indexOf(b.kind);
      // Template order wins for kinds it lists; unlisted kinds keep doc order after.
      if (ia !== -1 && ib !== -1) return ia - ib;
      if (ia !== -1) return -1;
      if (ib !== -1) return 1;
      return 0;
    });

  // Logical reading order: main column sections first, then side column
  // (this is the order PDF text extraction is asserted against).
  const inReadingOrder = [
    ...ordered.filter((s) => columnFor(s) === 'main'),
    ...ordered.filter((s) => columnFor(s) === 'side'),
  ];

  for (const s of inReadingOrder) {
    const column = columnFor(s);
    const cpl = column === 'side' ? cplSide : cplMain;
    blocks.push({
      id: `title-${s.id}`,
      kind: 'section-title',
      sectionId: s.id,
      height: t.headingSize * 1.9 + 6,
      keepWithNext: true,
      column,
      payload: { title: s.title },
    });
    const entryGap = t.entryGap;
    const pushEntry = (payload: EntryPayload, bodyBlocks: RichText) => {
      blocks.push({
        id: `entry-${s.id}-${blocks.length}`,
        kind: 'entry-head',
        sectionId: s.id,
        height: lh * 1.25 + richHeight(bodyBlocks, cpl, lh) + entryGap,
        column,
        payload,
      });
    };
    if (s.text?.length) {
      blocks.push({
        id: `rich-${s.id}`,
        kind: 'rich',
        sectionId: s.id,
        height: richHeight(s.text, cpl, lh) + entryGap,
        column,
        payload: { blocks: s.text },
      });
    }
    for (const e of s.experience ?? []) {
      pushEntry(
        {
          title: e.role,
          subtitle: e.organization,
          dateLine: formatDateRange(e.start, e.end, e.current, doc.theme.dateFormat),
          location: e.location,
          body: e.bullets,
          meta: Object.values(e.extras ?? {}).filter(Boolean),
        },
        e.bullets,
      );
    }
    for (const e of s.education ?? []) {
      pushEntry(
        {
          title: [e.studyType, e.area].filter(Boolean).join(', '),
          subtitle: e.institution,
          dateLine: formatDateRange(e.start, e.end, e.current, doc.theme.dateFormat),
          location: e.location,
          body: e.bullets,
          meta: e.score ? [`Result: ${e.score}`] : undefined,
        },
        e.bullets,
      );
    }
    for (const p of s.projects ?? []) {
      pushEntry(
        {
          title: p.name,
          subtitle: p.url,
          body: p.description,
          meta: p.stack.length ? [p.stack.join(' · ')] : undefined,
        },
        p.description,
      );
    }
    for (const e of s.entries ?? []) {
      pushEntry(
        {
          title: e.title,
          subtitle: e.organization,
          dateLine: formatDateRange(e.start, e.end, e.current, doc.theme.dateFormat),
          location: e.location,
          body: e.bullets,
        },
        e.bullets,
      );
    }
    for (const c of s.certifications ?? []) {
      blocks.push({
        id: `line-${s.id}-${blocks.length}`,
        kind: 'line',
        sectionId: s.id,
        height: lh + entryGap / 2,
        column,
        payload: {
          text: [c.name, c.issuer, c.credentialId].filter(Boolean).join(' — '),
          strong: c.name,
        },
      });
    }
    for (const a of s.awards ?? []) {
      blocks.push({
        id: `line-${s.id}-${blocks.length}`,
        kind: 'line',
        sectionId: s.id,
        height: lh * (a.summary ? 2 : 1) + entryGap / 2,
        column,
        payload: { text: [a.title, a.awarder].filter(Boolean).join(' — '), strong: a.title, sub: a.summary },
      });
    }
    for (const l of s.languages ?? []) {
      blocks.push({
        id: `line-${s.id}-${blocks.length}`,
        kind: 'line',
        sectionId: s.id,
        height: lh + entryGap / 2,
        column,
        payload: { text: [l.language, l.fluency].filter(Boolean).join(' — '), strong: l.language },
      });
    }
    for (const p of s.publications ?? []) {
      blocks.push({
        id: `line-${s.id}-${blocks.length}`,
        kind: 'line',
        sectionId: s.id,
        height: lh + entryGap / 2,
        column,
        payload: { text: [p.title, p.publisher].filter(Boolean).join(' — '), strong: p.title },
      });
    }
    if (s.skillGroups?.some((g) => g.skills.length > 0)) {
      const groups = s.skillGroups.filter((g) => g.skills.length > 0);
      const textLen = groups.reduce(
        (n, g) => n + g.name.length + g.skills.reduce((m, sk) => m + sk.name.length + 3, 0),
        0,
      );
      blocks.push({
        id: `skills-${s.id}`,
        kind: 'skills',
        sectionId: s.id,
        height: estimateTextHeight('x'.repeat(textLen), cpl, lh) + groups.length * 2 + entryGap,
        column,
        payload: { groups } satisfies SkillsPayload,
      });
    }
    if (s.tags?.length) {
      blocks.push({
        id: `tags-${s.id}`,
        kind: 'tags',
        sectionId: s.id,
        height: estimateTextHeight(s.tags.join(' · '), cpl, lh) + entryGap,
        column,
        payload: { tags: s.tags },
      });
    }
    if (s.table?.length) {
      blocks.push({
        id: `table-${s.id}`,
        kind: 'table',
        sectionId: s.id,
        height: s.table.length * (lh + 8) + entryGap,
        column,
        payload: { rows: s.table },
      });
    }
    if (s.kind === 'references') {
      if (s.referencesMode === 'on-request') {
        blocks.push({
          id: `line-${s.id}-onreq`,
          kind: 'line',
          sectionId: s.id,
          height: lh + entryGap / 2,
          column,
          payload: { text: 'References available on request.' },
        });
      }
      for (const r of s.references ?? []) {
        blocks.push({
          id: `line-${s.id}-${blocks.length}`,
          kind: 'line',
          sectionId: s.id,
          height: lh * 1.6 + entryGap / 2,
          column,
          payload: { text: [r.name, r.role].filter(Boolean).join(' — '), strong: r.name, sub: r.contact },
        });
      }
    }
  }
  return blocks;
}
