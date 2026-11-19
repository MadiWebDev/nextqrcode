import type { TemplateDef } from './types';

/**
 * Typed template registry. Templates are lazy-loaded modules; the
 * registry maps id → dynamic import so no template's code or sample
 * data enters a bundle until it is chosen. Adding a template = add a
 * defs/<id>.ts file + one line here (see docs/resumebuilder/
 * ADD_A_TEMPLATE.md and scripts/new-resume-template.mjs).
 */
const LOADERS: Record<string, () => Promise<{ default: TemplateDef }>> = {
  'teacher-classroom-classic': () => import('./defs/teacher-classroom-classic'),
  'software-engineer-clean': () => import('./defs/software-engineer-clean'),
  'mechanical-engineer-sidebar': () => import('./defs/mechanical-engineer-sidebar'),
  'physician-cv': () => import('./defs/physician-cv'),
  'auto-mechanic': () => import('./defs/auto-mechanic'),
  'executive-serif': () => import('./defs/executive-serif'),
  'timeline-general': () => import('./defs/timeline-general'),
  'fresher-graduate': () => import('./defs/fresher-graduate'),
  'europass-style': () => import('./defs/europass-style'),
  'designer-portfolio': () => import('./defs/designer-portfolio'),
  'one-page-compact': () => import('./defs/one-page-compact'),
  'gulf-job-seeker': () => import('./defs/gulf-job-seeker'),
};

export const TEMPLATE_IDS = Object.keys(LOADERS);

const cache = new Map<string, TemplateDef>();

export async function loadTemplate(id: string): Promise<TemplateDef> {
  const hit = cache.get(id);
  if (hit) return hit;
  const loader = LOADERS[id] ?? LOADERS['teacher-classroom-classic'];
  const mod = await loader();
  cache.set(id, mod.default);
  return mod.default;
}

export async function loadAllTemplates(): Promise<TemplateDef[]> {
  return Promise.all(TEMPLATE_IDS.map((id) => loadTemplate(id)));
}

/** Lightweight metadata for pickers that must not load every sample. */
export interface TemplateMeta {
  id: string;
  name: string;
  profession: string;
  category: string;
}

export const TEMPLATE_META: TemplateMeta[] = [
  { id: 'teacher-classroom-classic', name: 'Classroom Classic', profession: 'Teacher', category: 'Education' },
  { id: 'software-engineer-clean', name: 'Software Engineer Clean ATS', profession: 'Software Engineer', category: 'Engineering' },
  { id: 'mechanical-engineer-sidebar', name: 'Mechanical Engineer — Technical Sidebar', profession: 'Mechanical Engineer', category: 'Engineering' },
  { id: 'physician-cv', name: 'Physician CV', profession: 'Physician', category: 'Medical' },
  { id: 'auto-mechanic', name: 'Auto Mechanic — Tools & Certifications', profession: 'Auto Mechanic', category: 'Skilled trades' },
  { id: 'executive-serif', name: 'Executive Serif', profession: 'Executive', category: 'Business' },
  { id: 'timeline-general', name: 'Timeline', profession: 'General', category: 'General' },
  { id: 'fresher-graduate', name: 'Fresher / Graduate — Education First', profession: 'Fresher / Graduate', category: 'General' },
  { id: 'europass-style', name: 'Europass-Style (Original Design)', profession: 'General — EU', category: 'General' },
  { id: 'designer-portfolio', name: 'Designer / UX — Portfolio Grid', profession: 'Designer / UX', category: 'Tech and creative' },
  { id: 'one-page-compact', name: 'One-Page Compact', profession: 'General', category: 'General' },
  { id: 'gulf-job-seeker', name: 'Overseas / Gulf Job Seeker', profession: 'Gulf Job Seeker', category: 'General' },
];
