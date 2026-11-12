// _lib/templates.ts — the invoice template system.
// One definition per template drives BOTH the live preview (InvoiceApp) and
// the PDF renderer (_lib/pdf.ts), so the two can never drift apart in
// structure: header layout, table treatment, totals treatment and typeface
// all come from here. Colours come from the invoice's profile/brand settings.

export type TemplateName =
  | 'classic'
  | 'modern'
  | 'minimal'
  | 'corporate'
  | 'creative'
  | 'freelancer'
  | 'elegant'
  | 'executive'
  | 'retail'
  | 'international';

export type TemplateHeaderKind = 'band' | 'serif' | 'plain' | 'side' | 'centered';
export type TemplateTableKind = 'filled' | 'ruled' | 'plain' | 'striped';
export type TemplateTotalsKind = 'boxed' | 'plain';

export interface TemplateDef {
  id: TemplateName;
  name: string;
  blurb: string;
  header: TemplateHeaderKind;
  /** Band headers: brand colour, or a dark executive tone. */
  bandTone: 'brand' | 'dark';
  table: TemplateTableKind;
  totals: TemplateTotalsKind;
  font: 'sans' | 'serif';
}

export const TEMPLATES: TemplateDef[] = [
  {
    id: 'classic',
    name: 'Classic Professional',
    blurb: 'Serif title, double-rule header, timeless business formality.',
    header: 'serif',
    bandTone: 'brand',
    table: 'ruled',
    totals: 'plain',
    font: 'serif',
  },
  {
    id: 'modern',
    name: 'Modern Business',
    blurb: 'Full-width colour band header with a filled table head.',
    header: 'band',
    bandTone: 'brand',
    table: 'filled',
    totals: 'plain',
    font: 'sans',
  },
  {
    id: 'minimal',
    name: 'Minimal Clean',
    blurb: 'Quiet typography, hairline rules, nothing extra.',
    header: 'plain',
    bandTone: 'brand',
    table: 'plain',
    totals: 'plain',
    font: 'sans',
  },
  {
    id: 'corporate',
    name: 'Corporate',
    blurb: 'Colour band, filled table and a boxed totals panel.',
    header: 'band',
    bandTone: 'brand',
    table: 'filled',
    totals: 'boxed',
    font: 'sans',
  },
  {
    id: 'creative',
    name: 'Creative Agency',
    blurb: 'Bold side accent, striped rows, contemporary energy.',
    header: 'side',
    bandTone: 'brand',
    table: 'striped',
    totals: 'plain',
    font: 'sans',
  },
  {
    id: 'freelancer',
    name: 'Freelancer',
    blurb: 'Friendly side-accent layout tuned for solo professionals.',
    header: 'side',
    bandTone: 'brand',
    table: 'ruled',
    totals: 'plain',
    font: 'sans',
  },
  {
    id: 'elegant',
    name: 'Elegant',
    blurb: 'Centred serif masthead with a boxed totals panel.',
    header: 'centered',
    bandTone: 'brand',
    table: 'ruled',
    totals: 'boxed',
    font: 'serif',
  },
  {
    id: 'executive',
    name: 'Business Executive',
    blurb: 'Dark executive band, filled table, boxed totals.',
    header: 'band',
    bandTone: 'dark',
    table: 'filled',
    totals: 'boxed',
    font: 'sans',
  },
  {
    id: 'retail',
    name: 'Retail Invoice',
    blurb: 'Centred masthead and striped rows that scan fast at the till.',
    header: 'centered',
    bandTone: 'brand',
    table: 'striped',
    totals: 'plain',
    font: 'sans',
  },
  {
    id: 'international',
    name: 'International Invoice',
    blurb: 'Band header, ruled table, boxed totals — built for cross-border billing.',
    header: 'band',
    bandTone: 'brand',
    table: 'ruled',
    totals: 'boxed',
    font: 'sans',
  },
];

export const TEMPLATE_IDS = TEMPLATES.map((t) => t.id) as TemplateName[];

export function templateDef(name: string): TemplateDef {
  return TEMPLATES.find((t) => t.id === name) ?? TEMPLATES[1]; // modern fallback
}

/** Per-invoice presentation settings (never touches financial data). */
export interface TemplateSettings {
  /** Optional second colour for accents ('' = use the brand colour). */
  secondaryColor: string;
  fontScale: 'compact' | 'regular' | 'large';
  paperSize: 'a4' | 'letter';
  orientation: 'portrait' | 'landscape';
  showLogo: boolean;
  showStamp: boolean;
  showPayments: boolean;
  showNotes: boolean;
  showTerms: boolean;
}

export const DEFAULT_TEMPLATE_SETTINGS: TemplateSettings = {
  secondaryColor: '',
  fontScale: 'regular',
  paperSize: 'a4',
  orientation: 'portrait',
  showLogo: true,
  showStamp: true,
  showPayments: true,
  showNotes: true,
  showTerms: true,
};

export function normalizeTemplateSettings(
  raw: Partial<TemplateSettings> | undefined | null
): TemplateSettings {
  const r = raw ?? {};
  return {
    secondaryColor: typeof r.secondaryColor === 'string' ? r.secondaryColor : '',
    fontScale: r.fontScale === 'compact' || r.fontScale === 'large' ? r.fontScale : 'regular',
    paperSize: r.paperSize === 'letter' ? 'letter' : 'a4',
    orientation: r.orientation === 'landscape' ? 'landscape' : 'portrait',
    showLogo: r.showLogo !== false,
    showStamp: r.showStamp !== false,
    showPayments: r.showPayments !== false,
    showNotes: r.showNotes !== false,
    showTerms: r.showTerms !== false,
  };
}
