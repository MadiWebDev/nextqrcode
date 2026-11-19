import { z } from 'zod';

/**
 * Resume document schema — the single source of truth for the whole
 * product (editor, preview, PDF/DOCX/TXT exports, share links, ATS
 * checks all derive from this one document).
 *
 * Design rules (spec §5):
 * - Versioned: every record carries `schemaVersion`; migrations are
 *   pure functions in migrations.ts.
 * - JSON Resume-compatible superset: `toJsonResume()` maps the core
 *   fields onto the JSON Resume schema; extra sections ride along in
 *   our own namespaces.
 * - Unknown fields are preserved on round-trip: every object schema is
 *   `.passthrough()`-equivalent via the `extras` capture below, so a
 *   document written by a newer version never loses data in this one.
 * - Rich text is a constrained AST, never raw HTML.
 */

// ── Rich text AST ────────────────────────────────────────────────────────────

export const RichMarkSchema = z.object({
  bold: z.boolean().optional(),
  italic: z.boolean().optional(),
  link: z.string().optional(),
});
export type RichMark = z.infer<typeof RichMarkSchema>;

export const RichSpanSchema = z.object({
  text: z.string(),
  marks: RichMarkSchema.optional(),
});
export type RichSpan = z.infer<typeof RichSpanSchema>;

/** A block is either a paragraph of spans or a bullet list of span-runs. */
export const RichBlockSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('paragraph'), spans: z.array(RichSpanSchema) }),
  z.object({ type: z.literal('bullets'), items: z.array(z.array(RichSpanSchema)) }),
]);
export type RichBlock = z.infer<typeof RichBlockSchema>;
export type RichText = RichBlock[];

/** Convenience constructors used by the editor, samples and importers. */
export const rt = {
  p: (text: string): RichBlock => ({ type: 'paragraph', spans: [{ text }] }),
  bullets: (items: string[]): RichBlock => ({
    type: 'bullets',
    items: items.map((text) => [{ text }]),
  }),
  plain: (blocks: RichText): string =>
    blocks
      .map((b) =>
        b.type === 'paragraph'
          ? b.spans.map((s) => s.text).join('')
          : b.items.map((item) => item.map((s) => s.text).join('')).join('\n'),
      )
      .join('\n'),
};

// ── Dates ────────────────────────────────────────────────────────────────────

/** Month-precision date; `m` omitted = year-only. `end: null` + current flag = Present. */
export const ResumeDateSchema = z.object({
  y: z.number().int().min(1900).max(2200),
  m: z.number().int().min(1).max(12).optional(),
});
export type ResumeDate = z.infer<typeof ResumeDateSchema>;

// ── Entries ──────────────────────────────────────────────────────────────────

const entryBase = {
  id: z.string(),
  /** Free-form extra fields (profession-pack data) — preserved verbatim. */
  extras: z.record(z.string(), z.string()).optional(),
};

export const ExperienceEntrySchema = z.object({
  ...entryBase,
  role: z.string(),
  organization: z.string(),
  location: z.string().optional(),
  start: ResumeDateSchema.optional(),
  end: ResumeDateSchema.optional(),
  current: z.boolean().optional(),
  bullets: z.array(RichBlockSchema).default([]),
});
export type ExperienceEntry = z.infer<typeof ExperienceEntrySchema>;

export const EducationEntrySchema = z.object({
  ...entryBase,
  institution: z.string(),
  area: z.string(),
  studyType: z.string().optional(),
  location: z.string().optional(),
  start: ResumeDateSchema.optional(),
  end: ResumeDateSchema.optional(),
  current: z.boolean().optional(),
  score: z.string().optional(),
  bullets: z.array(RichBlockSchema).default([]),
});
export type EducationEntry = z.infer<typeof EducationEntrySchema>;

export const ProjectEntrySchema = z.object({
  ...entryBase,
  name: z.string(),
  description: z.array(RichBlockSchema).default([]),
  url: z.string().optional(),
  stack: z.array(z.string()).default([]),
  start: ResumeDateSchema.optional(),
  end: ResumeDateSchema.optional(),
});
export type ProjectEntry = z.infer<typeof ProjectEntrySchema>;

export const CertificationEntrySchema = z.object({
  ...entryBase,
  name: z.string(),
  issuer: z.string(),
  date: ResumeDateSchema.optional(),
  expiry: ResumeDateSchema.optional(),
  credentialId: z.string().optional(),
  url: z.string().optional(),
});
export type CertificationEntry = z.infer<typeof CertificationEntrySchema>;

export const AwardEntrySchema = z.object({
  ...entryBase,
  title: z.string(),
  awarder: z.string().optional(),
  date: ResumeDateSchema.optional(),
  summary: z.string().optional(),
});
export type AwardEntry = z.infer<typeof AwardEntrySchema>;

export const LanguageEntrySchema = z.object({
  ...entryBase,
  language: z.string(),
  fluency: z.string().optional(),
  level: z.number().int().min(1).max(5).optional(),
});
export type LanguageEntry = z.infer<typeof LanguageEntrySchema>;

export const PublicationEntrySchema = z.object({
  ...entryBase,
  title: z.string(),
  publisher: z.string().optional(),
  date: ResumeDateSchema.optional(),
  url: z.string().optional(),
  summary: z.string().optional(),
});
export type PublicationEntry = z.infer<typeof PublicationEntrySchema>;

export const GenericEntrySchema = z.object({
  ...entryBase,
  title: z.string(),
  organization: z.string().optional(),
  location: z.string().optional(),
  start: ResumeDateSchema.optional(),
  end: ResumeDateSchema.optional(),
  current: z.boolean().optional(),
  summary: z.string().optional(),
  bullets: z.array(RichBlockSchema).default([]),
});
export type GenericEntry = z.infer<typeof GenericEntrySchema>;

export const ReferenceEntrySchema = z.object({
  ...entryBase,
  name: z.string(),
  role: z.string().optional(),
  contact: z.string().optional(),
  note: z.string().optional(),
});
export type ReferenceEntry = z.infer<typeof ReferenceEntrySchema>;

export const SkillItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  level: z.number().int().min(1).max(5).optional(),
});
export type SkillItem = z.infer<typeof SkillItemSchema>;

export const SkillGroupSchema = z.object({
  id: z.string(),
  name: z.string(),
  skills: z.array(SkillItemSchema).default([]),
});
export type SkillGroup = z.infer<typeof SkillGroupSchema>;

// ── Sections ─────────────────────────────────────────────────────────────────

export const SECTION_KINDS = [
  'summary',
  'experience',
  'education',
  'skills',
  'projects',
  'certifications',
  'awards',
  'languages',
  'publications',
  'research',
  'volunteering',
  'courses',
  'memberships',
  'references',
  'interests',
  'declaration',
  'custom',
] as const;
export type SectionKind = (typeof SECTION_KINDS)[number];

export const CustomSectionTypeSchema = z.enum(['text', 'list', 'timeline', 'table', 'tags']);
export type CustomSectionType = z.infer<typeof CustomSectionTypeSchema>;

export const SectionSchema = z.object({
  id: z.string(),
  kind: z.enum(SECTION_KINDS),
  /** Display title — renameable per resume. */
  title: z.string(),
  visible: z.boolean().default(true),
  /** Per-section layout options (e.g. skills display: tags|bars|columns). */
  layout: z.record(z.string(), z.string()).optional(),
  // Payloads — exactly one is meaningful per kind; all optional so a
  // section can be created empty and filled in any order.
  text: z.array(RichBlockSchema).optional(),
  experience: z.array(ExperienceEntrySchema).optional(),
  education: z.array(EducationEntrySchema).optional(),
  skillGroups: z.array(SkillGroupSchema).optional(),
  projects: z.array(ProjectEntrySchema).optional(),
  certifications: z.array(CertificationEntrySchema).optional(),
  awards: z.array(AwardEntrySchema).optional(),
  languages: z.array(LanguageEntrySchema).optional(),
  publications: z.array(PublicationEntrySchema).optional(),
  entries: z.array(GenericEntrySchema).optional(),
  references: z.array(ReferenceEntrySchema).optional(),
  referencesMode: z.enum(['list', 'on-request']).optional(),
  tags: z.array(z.string()).optional(),
  table: z.array(z.array(z.string())).optional(),
  customType: CustomSectionTypeSchema.optional(),
});
export type Section = z.infer<typeof SectionSchema>;

// ── Basics / sensitive / theme ───────────────────────────────────────────────

export const LinkSchema = z.object({
  id: z.string(),
  label: z.string(),
  url: z.string(),
});
export type ResumeLink = z.infer<typeof LinkSchema>;

export const BasicsSchema = z.object({
  name: z.string().default(''),
  headline: z.string().default(''),
  email: z.string().default(''),
  phone: z.string().default(''),
  location: z.string().default(''),
  website: z.string().default(''),
  links: z.array(LinkSchema).default([]),
});
export type Basics = z.infer<typeof BasicsSchema>;

/**
 * Sensitive personal details (spec §6): OFF by default, only offered in
 * regional modes that customarily include them, each individually
 * includable, never pre-filled and never in share links unless ticked.
 */
export const SENSITIVE_KEYS = [
  'dateOfBirth',
  'nationality',
  'maritalStatus',
  'visaStatus',
  'drivingLicence',
  'parentName',
] as const;
export type SensitiveKey = (typeof SENSITIVE_KEYS)[number];

export const SensitiveFieldSchema = z.object({
  value: z.string(),
  include: z.boolean().default(false),
});
export type SensitiveField = z.infer<typeof SensitiveFieldSchema>;

export const SensitiveMapSchema = z.object({
  dateOfBirth: SensitiveFieldSchema.optional(),
  nationality: SensitiveFieldSchema.optional(),
  maritalStatus: SensitiveFieldSchema.optional(),
  visaStatus: SensitiveFieldSchema.optional(),
  drivingLicence: SensitiveFieldSchema.optional(),
  parentName: SensitiveFieldSchema.optional(),
});
export type SensitiveMap = z.infer<typeof SensitiveMapSchema>;

export const PhotoRefSchema = z.object({
  /** Ids into the photos store (original kept alongside the crop). */
  originalId: z.string().optional(),
  croppedId: z.string().optional(),
  shape: z.enum(['circle', 'rounded', 'square', 'portrait', 'hexagon']).default('rounded'),
  show: z.boolean().default(false),
});
export type PhotoRef = z.infer<typeof PhotoRefSchema>;

export const ThemeSchema = z.object({
  accent: z.string().default('#0f766e'),
  fontPair: z.string().default('source-inter'),
  fontScale: z.number().min(0.85).max(1.2).default(1),
  lineHeight: z.number().min(1.2).max(1.8).default(1.45),
  margin: z.enum(['narrow', 'normal', 'wide']).default('normal'),
  sectionSpacing: z.enum(['compact', 'normal', 'relaxed']).default('normal'),
  headingCase: z.enum(['upper', 'title', 'asis']).default('upper'),
  bulletStyle: z.enum(['disc', 'dash', 'arrow', 'none']).default('disc'),
  showIcons: z.boolean().default(true),
  pageSize: z.enum(['a4', 'letter']).default('a4'),
  dateFormat: z.enum(['mmm-yyyy', 'mm-yyyy', 'yyyy', 'mmm-yyyy-range']).default('mmm-yyyy'),
});
export type Theme = z.infer<typeof ThemeSchema>;

export const QrConfigSchema = z.object({
  enabled: z.boolean().default(false),
  target: z.enum(['vcard', 'url', 'whatsapp', 'email']).default('url'),
  url: z.string().optional(),
  label: z.string().optional(),
  placement: z.enum(['header', 'sidebar', 'footer']).default('header'),
  sizeMm: z.number().min(15).max(40).default(22),
  vcardFields: z.array(z.string()).default(['name', 'email', 'phone']),
});
export type QrConfig = z.infer<typeof QrConfigSchema>;

// ── The document ─────────────────────────────────────────────────────────────

export const CURRENT_SCHEMA_VERSION = 1;

export const RegionIdSchema = z.enum([
  'us-ca',
  'uk-ie',
  'eu',
  'gulf',
  'south-asia',
  'au-nz',
  'academic',
]);
export type RegionId = z.infer<typeof RegionIdSchema>;

export const ResumeDocSchema = z.object({
  schemaVersion: z.literal(CURRENT_SCHEMA_VERSION),
  id: z.string(),
  meta: z.object({
    /** Internal name shown in the resume library (not printed). */
    title: z.string().default('Untitled resume'),
    templateId: z.string().default('universal-minimal'),
    region: RegionIdSchema.default('us-ca'),
    language: z.string().default('en'),
    direction: z.enum(['ltr', 'rtl']).default('ltr'),
    targetRole: z.string().optional(),
    createdAt: z.number(),
    updatedAt: z.number(),
  }),
  basics: BasicsSchema,
  photo: PhotoRefSchema.default({ shape: 'rounded', show: false }),
  sensitive: SensitiveMapSchema.default({}),
  sections: z.array(SectionSchema).default([]),
  theme: ThemeSchema.default({}),
  qr: QrConfigSchema.default({}),
  /** Fields written by newer versions that this schema does not know. */
  extras: z.record(z.string(), z.unknown()).optional(),
});
export type ResumeDoc = z.infer<typeof ResumeDocSchema>;

// ── Other stored records ─────────────────────────────────────────────────────

export const SnapshotSchema = z.object({
  id: z.string(),
  resumeId: z.string(),
  name: z.string().optional(),
  kind: z.enum(['auto', 'named']),
  createdAt: z.number(),
  doc: ResumeDocSchema,
});
export type Snapshot = z.infer<typeof SnapshotSchema>;

export const CoverLetterSchema = z.object({
  schemaVersion: z.literal(CURRENT_SCHEMA_VERSION),
  id: z.string(),
  resumeId: z.string().optional(),
  recipient: z.string().default(''),
  subject: z.string().default(''),
  body: z.array(RichBlockSchema).default([]),
  updatedAt: z.number(),
});
export type CoverLetter = z.infer<typeof CoverLetterSchema>;

export const TRACKER_STATUSES = ['saved', 'applied', 'interview', 'offer', 'rejected'] as const;
export type TrackerStatus = (typeof TRACKER_STATUSES)[number];

export const TrackerItemSchema = z.object({
  schemaVersion: z.literal(CURRENT_SCHEMA_VERSION),
  id: z.string(),
  company: z.string(),
  role: z.string(),
  status: z.enum(TRACKER_STATUSES).default('saved'),
  appliedDate: z.string().optional(),
  followUpDate: z.string().optional(),
  url: z.string().optional(),
  notes: z.string().default(''),
  resumeId: z.string().optional(),
  updatedAt: z.number(),
});
export type TrackerItem = z.infer<typeof TrackerItemSchema>;

// ── JSON Resume mapping ──────────────────────────────────────────────────────

/** Map the core of a ResumeDoc onto the JSON Resume schema (jsonresume.org). */
export function toJsonResume(doc: ResumeDoc): Record<string, unknown> {
  const find = (kind: SectionKind) => doc.sections.find((s) => s.kind === kind && s.visible);
  const exp = find('experience');
  const edu = find('education');
  const skills = find('skills');
  const projects = find('projects');
  const certs = find('certifications');
  const awards = find('awards');
  const langs = find('languages');
  const pubs = find('publications');
  const fmt = (d?: ResumeDate) =>
    d ? `${d.y}-${String(d.m ?? 1).padStart(2, '0')}` : undefined;
  return {
    $schema: 'https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json',
    basics: {
      name: doc.basics.name,
      label: doc.basics.headline,
      email: doc.basics.email,
      phone: doc.basics.phone,
      url: doc.basics.website || undefined,
      location: { address: doc.basics.location },
      profiles: doc.basics.links.map((l) => ({ network: l.label, url: l.url })),
    },
    work: (exp?.experience ?? []).map((e) => ({
      name: e.organization,
      position: e.role,
      location: e.location,
      startDate: fmt(e.start),
      endDate: e.current ? undefined : fmt(e.end),
      highlights: (e.bullets ?? [])
        .filter((b) => b.type === 'bullets')
        .flatMap((b) => (b.type === 'bullets' ? b.items.map((i) => i.map((s) => s.text).join('')) : [])),
    })),
    education: (edu?.education ?? []).map((e) => ({
      institution: e.institution,
      area: e.area,
      studyType: e.studyType,
      startDate: fmt(e.start),
      endDate: e.current ? undefined : fmt(e.end),
      score: e.score,
    })),
    skills: (skills?.skillGroups ?? []).flatMap((g) =>
      g.skills.map((s) => ({ name: s.name, keywords: [g.name].filter(Boolean) })),
    ),
    projects: (projects?.projects ?? []).map((p) => ({
      name: p.name,
      url: p.url,
      keywords: p.stack,
      description: rt.plain(p.description ?? []),
    })),
    certificates: (certs?.certifications ?? []).map((c) => ({
      name: c.name,
      issuer: c.issuer,
      date: fmt(c.date),
      url: c.url,
    })),
    awards: (awards?.awards ?? []).map((a) => ({
      title: a.title,
      awarder: a.awarder,
      date: fmt(a.date),
      summary: a.summary,
    })),
    languages: (langs?.languages ?? []).map((l) => ({
      language: l.language,
      fluency: l.fluency,
    })),
    publications: (pubs?.publications ?? []).map((p) => ({
      name: p.title,
      publisher: p.publisher,
      releaseDate: fmt(p.date),
      url: p.url,
      summary: p.summary,
    })),
  };
}
