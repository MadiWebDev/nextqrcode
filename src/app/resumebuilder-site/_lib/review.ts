/**
 * Writing review, job-description matching and the ATS health check
 * (spec §9). All analysis is local, deterministic and explainable:
 * every finding names the rule that produced it. The ATS check is a
 * checklist-based estimate — it is labelled as such everywhere it
 * appears, because no tool can reproduce a specific employer's
 * proprietary screening system.
 */
import type { ResumeDoc } from './schema';
import { rt } from './schema';
import type { TemplateDef } from './templates/types';
import { buildBlocks } from './templates/build-blocks';
import { paginate, usableHeight } from './templates/types';
import { DEFAULT_SECTION_TITLES } from './defaults';

// ── Writing analysis ─────────────────────────────────────────────────────────

export const ACTION_VERBS = [
  'achieved', 'built', 'cut', 'delivered', 'designed', 'developed', 'drove', 'grew',
  'improved', 'introduced', 'launched', 'led', 'managed', 'mentored', 'negotiated',
  'organised', 'owned', 'planned', 'produced', 'raised', 'reduced', 'ran', 'saved',
  'served', 'shipped', 'sold', 'supervised', 'taught', 'trained', 'wrote',
];

const WEAK_OPENERS: Array<{ pattern: RegExp; advice: string }> = [
  { pattern: /^responsible for/i, advice: 'Start with what you did, not the duty: try a verb like "led", "built" or "delivered", then the result.' },
  { pattern: /^duties included/i, advice: 'Duty lists read as job descriptions. Rewrite as achievements: verb + what changed + a number.' },
  { pattern: /^worked on/i, advice: '"Worked on" hides your part. Name your exact contribution and its outcome.' },
  { pattern: /^helped (with|to)?/i, advice: '"Helped" undersells you. Say what you personally did.' },
  { pattern: /^tasked with/i, advice: 'Being tasked is not the achievement — the finished result is. Lead with that.' },
  { pattern: /^in charge of/i, advice: 'Replace with the scale you ran: team size, budget or volume, plus one outcome.' },
];

const PRESENT_FORMS = new Set([
  'manage', 'lead', 'develop', 'build', 'design', 'deliver', 'run', 'teach', 'train',
  'supervise', 'sell', 'write', 'plan', 'own', 'drive', 'support', 'handle', 'create',
]);
const PAST_FORMS = new Set([
  'managed', 'led', 'developed', 'built', 'designed', 'delivered', 'ran', 'taught',
  'trained', 'supervised', 'sold', 'wrote', 'planned', 'owned', 'drove', 'supported',
  'handled', 'created',
]);

export interface BulletIssue {
  sectionTitle: string;
  entryTitle: string;
  bullet: string;
  kind: 'weak-opener' | 'no-metric' | 'too-long' | 'duplicate' | 'tense';
  message: string;
}

/** Individual text units: each paragraph and each bullet item. */
export function richUnits(blocks: import('./schema').RichText): string[] {
  const out: string[] = [];
  for (const b of blocks) {
    if (b.type === 'paragraph') out.push(b.spans.map((x) => x.text).join(''));
    else for (const item of b.items) out.push(item.map((x) => x.text).join(''));
  }
  return out;
}

function wordSet(text: string): Set<string> {
  return new Set(text.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean));
}

function jaccard(a: Set<string>, b: Set<string>): number {
  const inter = [...a].filter((x) => b.has(x)).length;
  const union = new Set([...a, ...b]).size;
  return union === 0 ? 0 : inter / union;
}

export function analyseWriting(doc: ResumeDoc): BulletIssue[] {
  const issues: BulletIssue[] = [];
  const seen: Array<{ text: string; set: Set<string>; where: string }> = [];
  for (const section of doc.sections) {
    const entries = [
      ...(section.experience ?? []).map((e) => ({ title: e.role, bullets: e.bullets, current: e.current === true })),
      ...(section.entries ?? []).map((e) => ({ title: e.title, bullets: e.bullets, current: false })),
    ];
    for (const entry of entries) {
      for (const rawText of richUnits(entry.bullets)) {
        const text = rawText.trim();
        if (!text) continue;
        for (const w of WEAK_OPENERS) {
          if (w.pattern.test(text)) {
            issues.push({ sectionTitle: section.title, entryTitle: entry.title, bullet: text, kind: 'weak-opener', message: w.advice });
          }
        }
        if (!/\d/.test(text) && text.length > 40) {
          issues.push({
            sectionTitle: section.title, entryTitle: entry.title, bullet: text, kind: 'no-metric',
            message: 'No number in this bullet. Add one if you honestly can — team size, volume, money, time saved or a percentage.',
          });
        }
        if (text.length > 220) {
          issues.push({
            sectionTitle: section.title, entryTitle: entry.title, bullet: text, kind: 'too-long',
            message: 'This bullet is long enough to be two. Split it, or cut the least important clause.',
          });
        }
        const first = text.split(/\s+/)[0]?.toLowerCase().replace(/[^a-z]/g, '') ?? '';
        if (!entry.current && PRESENT_FORMS.has(first)) {
          issues.push({
            sectionTitle: section.title, entryTitle: entry.title, bullet: text, kind: 'tense',
            message: 'This is a past role but the bullet starts in the present tense. Use the past form for finished jobs.',
          });
        }
        if (entry.current && PAST_FORMS.has(first)) {
          issues.push({
            sectionTitle: section.title, entryTitle: entry.title, bullet: text, kind: 'tense',
            message: 'This is your current role but the bullet starts in the past tense. Use the present form for work you still do.',
          });
        }
        const set = wordSet(text);
        for (const prev of seen) {
          if (jaccard(set, prev.set) > 0.8) {
            issues.push({
              sectionTitle: section.title, entryTitle: entry.title, bullet: text, kind: 'duplicate',
              message: `This bullet is nearly the same as one under ${prev.where}. Repetition weakens both — merge or differentiate them.`,
            });
            break;
          }
        }
        seen.push({ text, set, where: entry.title });
      }
    }
  }
  return issues;
}

/** Original starter bullets per profession — patterns to rewrite in
 *  the user's own words, each with a metric prompt. */
export const BULLET_LIBRARY: Record<string, string[]> = {
  generic: [
    'Delivered [project/result] for [team or customers], improving [metric] by [number]%',
    'Trained [number] new colleagues on [process], cutting onboarding time by [number] days',
    'Handled [volume] of [work] per [day/week] while keeping [quality measure] at [number]',
    'Introduced [change] that saved [number] hours a week for [team]',
    'Recognised by [manager/customers] for [specific achievement] in [year]',
  ],
  teaching: [
    'Raised the class average in [subject] from [x]% to [y]% over [period] by [method]',
    'Planned and delivered [number] lessons a week across grades [range]',
    'Mentored [number] early-career teachers in [area]',
  ],
  nursing: [
    'Cared for [number] patients per shift on [ward type], including [specialist care]',
    'Introduced [practice change] that reduced [incidents/errors] by [number]%',
    'Precepted [number] student nurses through their placements',
  ],
  engineering: [
    'Designed [system/component] handling [scale], reducing [cost/downtime] by [number]%',
    'Led the migration of [system] with zero downtime across [number] users',
    'Cut [process] time from [x] to [y] by [approach]',
  ],
  sales: [
    'Closed [currency + amount] in new business against a [target] quota ([x]% attainment)',
    'Grew territory revenue by [number]% year on year across [number] accounts',
    'Built pipeline of [amount] through [method], converting at [number]%',
  ],
  support: [
    'Resolved [number] tickets a day with a CSAT of [x]/5 and [time] median first response',
    'Wrote [number] help-centre articles deflecting about [number] tickets a month',
    'Coached [number] new starters to full productivity in [time]',
  ],
  trades: [
    'Completed [number] jobs in [period] with a first-time fix rate of [number]%',
    'Supervised a crew of [number] on [project type] worth [amount]',
    'Kept a zero-incident safety record across [number] months on site',
  ],
};

// ── Job-description matching ─────────────────────────────────────────────────

const SKILL_LEXICON = new Set<string>([
  'excel', 'sql', 'python', 'javascript', 'typescript', 'react', 'node', 'aws', 'azure',
  'kubernetes', 'docker', 'figma', 'photoshop', 'autocad', 'revit', 'sap', 'salesforce',
  'quickbooks', 'tableau', 'power bi', 'looker', 'jira', 'confluence', 'zendesk',
  'communication', 'leadership', 'budgeting', 'forecasting', 'recruitment', 'training',
  'customer service', 'project management', 'agile', 'scrum', 'seo', 'google ads',
  'meta ads', 'email marketing', 'content writing', 'copywriting', 'editing',
  'bookkeeping', 'vat', 'payroll', 'auditing', 'risk management', 'compliance',
  'first aid', 'food hygiene', 'haccp', 'forklift', 'driving licence', 'negotiation',
  'data analysis', 'machine learning', 'statistics', 'reporting', 'presentation',
  'teaching', 'lesson planning', 'assessment', 'mentoring', 'counselling',
  'inventory', 'stock control', 'procurement', 'logistics', 'dispatch',
]);

export interface JdMatchResult {
  coverage: number;
  matched: Array<{ term: string; jdCount: number }>;
  missing: Array<{ term: string; jdCount: number }>;
  note: string;
}

export function matchJobDescription(doc: ResumeDoc, jd: string): JdMatchResult {
  const jdLower = jd.toLowerCase();
  const resumeText = [
    doc.basics.headline ?? '',
    ...doc.sections.flatMap((s) => [
      s.title,
      ...(s.skillGroups ?? []).flatMap((g) => g.skills.map((sk) => sk.name)),
      ...(s.tags ?? []),
      ...(s.experience ?? []).flatMap((e) => [e.role, e.organization, rt.plain(e.bullets)]),
      ...(s.text ? [rt.plain(s.text)] : []),
    ]),
  ]
    .join('\n')
    .toLowerCase();

  // Candidate terms: lexicon hits + the resume's own skill names found in the JD.
  const candidates = new Map<string, number>();
  const count = (term: string) => {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return (jdLower.match(new RegExp(`\\b${escaped}\\b`, 'g')) ?? []).length;
  };
  for (const term of SKILL_LEXICON) {
    const c = count(term);
    if (c > 0) candidates.set(term, c);
  }
  // Capitalised technical-looking terms the lexicon does not know
  // (product and language names: Rust, COBOL, Kubernetes variants…).
  const STOP = new Set(['the', 'we', 'you', 'our', 'this', 'and', 'for', 'with', 'will', 'are', 'job', 'work', 'team', 'role', 'plus', 'need', 'needs', 'using', 'use', 'day', 'new', 'all', 'who', 'has', 'have', 'from', 'your', 'their', 'about', 'into', 'over', 'per', 'etc', 'including', 'include', 'required', 'requirements', 'experience', 'knowledge', 'skills', 'ability', 'strong', 'good', 'great', 'excellent']);
  for (const raw of jd.split(/[^A-Za-z0-9+#.]+/)) {
    if (raw.length < 3 || !/^[A-Z]/.test(raw)) continue;
    const term = raw.toLowerCase().replace(/\.+$/, '');
    if (STOP.has(term) || candidates.has(term)) continue;
    const c = count(term);
    if (c > 0) candidates.set(term, c);
  }
  for (const s of doc.sections) {
    for (const g of s.skillGroups ?? []) {
      for (const sk of g.skills) {
        const term = sk.name.toLowerCase();
        if (term.length > 2 && !candidates.has(term)) {
          const c = count(term);
          if (c > 0) candidates.set(term, c);
        }
      }
    }
  }
  const matched: JdMatchResult['matched'] = [];
  const missing: JdMatchResult['missing'] = [];
  for (const [term, jdCount] of [...candidates.entries()].sort((a, b) => b[1] - a[1])) {
    (resumeText.includes(term) ? matched : missing).push({ term, jdCount });
  }
  const total = matched.length + missing.length;
  return {
    coverage: total === 0 ? 0 : Math.round((matched.length / total) * 100),
    matched,
    missing,
    note:
      total === 0
        ? 'No recognisable skill terms were found in that job description. Paste the full posting, including its requirements section.'
        : 'Matching is literal: a term counts only when the same words appear in your resume. Add a missing term only where it is honestly true of you.',
  };
}

// ── ATS health check ─────────────────────────────────────────────────────────

export interface AtsCheckItem {
  id: string;
  status: 'pass' | 'warn' | 'fail';
  title: string;
  detail: string;
}

export function atsHealthCheck(doc: ResumeDoc, template: TemplateDef): AtsCheckItem[] {
  const items: AtsCheckItem[] = [];
  const push = (id: string, status: AtsCheckItem['status'], title: string, detail: string) =>
    items.push({ id, status, title, detail });

  push(
    'contact',
    doc.basics.name.trim() && doc.basics.email.trim() ? 'pass' : 'fail',
    'Name and email present',
    'Screening software looks for a name and an email address first. Both must be real text (they are, in every template here).',
  );
  push(
    'phone',
    doc.basics.phone.trim() ? 'pass' : 'warn',
    'Phone number included',
    'Most application forms ask for a phone number; a resume without one can stall at the first human review.',
  );
  const nonStandard = doc.sections.filter(
    (s) => s.visible && DEFAULT_SECTION_TITLES[s.kind] && s.title !== DEFAULT_SECTION_TITLES[s.kind],
  );
  push(
    'headings',
    nonStandard.length === 0 ? 'pass' : 'warn',
    'Standard section headings',
    nonStandard.length === 0
      ? 'Your section titles use the standard words (Experience, Education, Skills) that parsers map reliably.'
      : `Renamed sections (${nonStandard.map((s) => s.title).join(', ')}) may be mapped to the wrong category by strict parsers. Standard titles are safest for online applications.`,
  );
  push(
    'template',
    template.atsSafe ? 'pass' : 'warn',
    'Template parseability',
    template.atsSafe
      ? 'This is an ATS-safe template: single column, standard headings, no photo or graphics between the words.'
      : 'This is a designed template. Two columns and photos look better to humans but some parsers read columns in the wrong order. For a big company portal, consider the ATS-safe version too — your words carry over when you switch.',
  );
  const blocks = buildBlocks(doc, template);
  const pages = paginate(blocks, usableHeight(doc.theme.pageSize, doc.theme.margin)).length;
  push(
    'length',
    pages <= 2 ? 'pass' : 'warn',
    'Length',
    pages === 1
      ? 'One page — ideal for under ten years of experience.'
      : pages === 2
        ? 'Two pages — normal for experienced professionals.'
        : `${pages} pages is long for most roles. Cut the oldest or least relevant entries first.`,
  );
  const allBullets = doc.sections.flatMap((s) =>
    (s.experience ?? []).flatMap((e) => richUnits(e.bullets)),
  );
  const withNumbers = allBullets.filter((b) => /\d/.test(b)).length;
  const ratio = allBullets.length === 0 ? 0 : withNumbers / allBullets.length;
  push(
    'metrics',
    ratio >= 0.4 ? 'pass' : 'warn',
    'Bullets with numbers',
    allBullets.length === 0
      ? 'No experience bullets yet — add your roles before judging this.'
      : `${withNumbers} of ${allBullets.length} experience bullets include a number. Recruiters and screeners both weight measurable results; aim for at least 40%.`,
  );
  const hasSummary = doc.sections.some((s) => s.kind === 'summary' && s.visible && (s.text?.some((b) => rt.plain([b]).trim()) ?? false));
  push(
    'summary',
    hasSummary ? 'pass' : 'warn',
    'Professional summary',
    hasSummary
      ? 'A summary is present — it is the highest-value place for the job title and top skills from the posting.'
      : 'No summary yet. Two or three lines naming the role you want and your strongest matching skills help both parsers and humans.',
  );
  const hasSkills = doc.sections.some((s) => s.kind === 'skills' && s.visible && ((s.skillGroups ?? []).some((g) => g.skills.length > 0) || (s.tags?.length ?? 0) > 0));
  push(
    'skills',
    hasSkills ? 'pass' : 'warn',
    'Skills section',
    hasSkills
      ? 'A skills section is present and machine-readable.'
      : 'Add a skills section listing tools and methods in plain words — it is the densest keyword area a parser reads.',
  );
  const includedSensitive = Object.values(doc.sensitive).filter((f) => f?.include && f.value.trim());
  push(
    'sensitive',
    includedSensitive.length === 0 ? 'pass' : 'warn',
    'Sensitive details',
    includedSensitive.length === 0
      ? 'No sensitive fields (ID numbers, date of birth and similar) are included. That is the safe default for online applications.'
      : 'You have chosen to include sensitive fields. Some employers (for example Gulf and government roles) ask for them; for general online applications they are safer shared later in the process.',
  );
  const badLinks = [doc.basics.website, ...doc.basics.links.map((l) => l.url)].filter(
    (u) => u && u.startsWith('http://'),
  );
  push(
    'links',
    badLinks.length === 0 ? 'pass' : 'warn',
    'Secure links',
    badLinks.length === 0
      ? 'All links use https or are plain contact details.'
      : 'Some links use http:// — update them to https:// where the site supports it.',
  );
  return items;
}
