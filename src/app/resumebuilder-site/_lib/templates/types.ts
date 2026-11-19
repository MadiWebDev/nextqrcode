import type { ResumeDoc, SectionKind } from '../schema';

/**
 * Template engine types (ADR D-RB-02). A template is data: design
 * tokens + a structural layout definition composed from primitives.
 * The uniqueness triple — (layout, header, heading) — is derived from
 * these fields and enforced by registry.test.ts across all templates.
 */

export type LayoutStructure =
  | 'single'
  | 'sidebar-left'
  | 'sidebar-right'
  | 'two-column'
  | 'timeline'
  | 'label-column'
  | 'cards';

export type HeaderStyle =
  | 'left'
  | 'centered'
  | 'band'
  | 'split'
  | 'rule-double'
  | 'monogram'
  | 'photo-left'
  | 'underline-accent';

export type HeadingStyle =
  | 'rule-under'
  | 'band-chip'
  | 'overline'
  | 'side-tab'
  | 'numbered'
  | 'plain-caps'
  | 'boxed'
  | 'dot-leader';

export interface TemplateTokens {
  /** Default accent (hex). Palettes are options inside a template. */
  accent: string;
  /** Curated palette presets offered in the gallery. */
  palettes: string[];
  ink: string;
  muted: string;
  surface: string;
  headingFont: string;
  bodyFont: string;
  baseSize: number; // px at 96dpi for body text
  headingSize: number;
  nameSize: number;
  lineHeight: number;
  sectionGap: number; // px between sections
  entryGap: number;
  bullet: 'disc' | 'dash' | 'arrow' | 'none';
  divider: 'rule' | 'none' | 'dots';
}

export interface TemplateDef {
  id: string;
  name: string;
  profession: string;
  category: string;
  atsSafe: boolean;
  columns: 1 | 2;
  supportsPhoto: boolean;
  supportsRtl: boolean;
  pageSizes: Array<'a4' | 'letter'>;
  layout: LayoutStructure;
  header: HeaderStyle;
  heading: HeadingStyle;
  tokens: TemplateTokens;
  /** The font pair this design was made with (id from _lib/fonts). */
  fontPair?: string;
  /** Profession-aware default section order for new resumes. */
  sectionOrder: SectionKind[];
  /** For sidebar/two-column layouts: section kinds rendered in the side column. */
  sideSections?: SectionKind[];
  why: string;
  /** Fictional sample document for gallery previews and SEO pages. */
  sample: () => ResumeDoc;
}

/** The uniqueness key the spec's automated test enforces. */
export function uniquenessKey(t: TemplateDef): string {
  return `${t.layout}|${t.header}|${t.heading}`;
}

// ── Page model ───────────────────────────────────────────────────────────────

/**
 * A renderable block in logical reading order. The paginator groups
 * blocks into pages; the DOM renderer, print CSS and the PDF/DOCX
 * writers all consume the same ordered block list, so reading order
 * is shared by construction.
 */
export interface Block {
  id: string;
  kind:
    | 'header'
    | 'section-title'
    | 'entry-head'
    | 'rich'
    | 'skills'
    | 'tags'
    | 'table'
    | 'line';
  sectionId?: string;
  /** Measured or estimated height in px at the template's base size. */
  height: number;
  /** Keep this block on the same page as the next one (headings, entry heads). */
  keepWithNext?: boolean;
  /** Manual page break: this block starts a new page (spec §7). */
  breakBefore?: boolean;
  /** Sidebar blocks render in the sidebar column for 2-col layouts but
   * keep their logical position in the reading order. */
  column: 'main' | 'side';
  payload: unknown;
}

export interface Page {
  blocks: Block[];
  height: number;
}

/**
 * Group ordered blocks into pages of `pageHeight` usable px.
 * keepWithNext blocks move with their successor; a block taller than a
 * page is placed alone (renderers shrink-to-fit such blocks rather
 * than clipping — asserted by the layout-matrix tests).
 */
export function paginate(blocks: Block[], pageHeight: number): Page[] {
  const pages: Page[] = [];
  let current: Block[] = [];
  let height = 0;
  const flush = () => {
    if (current.length) pages.push({ blocks: current, height });
    current = [];
    height = 0;
  };
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    // Look ahead: a keepWithNext block must fit together with the next block.
    let needed = block.height;
    if (block.keepWithNext && i + 1 < blocks.length) {
      needed += blocks[i + 1].height;
    }
    if (height > 0 && height + needed > pageHeight) {
      flush();
    }
    current.push(block);
    height += block.height;
  }
  flush();
  return pages.length ? pages : [{ blocks: [], height: 0 }];
}

/** Usable height (px @96dpi) for a page size + margin preset. */
export function usableHeight(pageSize: 'a4' | 'letter', margin: 'narrow' | 'normal' | 'wide'): number {
  const total = pageSize === 'a4' ? 1123 : 1056;
  const m = margin === 'narrow' ? 28 : margin === 'wide' ? 56 : 40;
  return total - m * 2;
}

export function usableWidth(pageSize: 'a4' | 'letter', margin: 'narrow' | 'normal' | 'wide'): number {
  const total = pageSize === 'a4' ? 794 : 816;
  const m = margin === 'narrow' ? 28 : margin === 'wide' ? 56 : 40;
  return total - m * 2;
}
