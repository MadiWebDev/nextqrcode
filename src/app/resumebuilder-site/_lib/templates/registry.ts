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
  'nurse-clinical': () => import('./defs/nurse-clinical'),
  'pharmacist-care': () => import('./defs/pharmacist-care'),
  'civil-engineer': () => import('./defs/civil-engineer'),
  'electrical-engineer': () => import('./defs/electrical-engineer'),
  'dentist-clinical': () => import('./defs/dentist-clinical'),
  'academic-cv': () => import('./defs/academic-cv'),
  'accountant-ledger': () => import('./defs/accountant-ledger'),
  'bank-officer': () => import('./defs/bank-officer'),
  'sales-executive': () => import('./defs/sales-executive'),
  'customer-support': () => import('./defs/customer-support'),
  'hr-professional': () => import('./defs/hr-professional'),
  'real-estate-agent': () => import('./defs/real-estate-agent'),
  'staff-engineer': () => import('./defs/staff-engineer'),
  'product-manager': () => import('./defs/product-manager'),
  'data-analyst': () => import('./defs/data-analyst'),
  'ux-designer': () => import('./defs/ux-designer'),
  'digital-marketer': () => import('./defs/digital-marketer'),
  'content-writer': () => import('./defs/content-writer'),
  'electrician-trades': () => import('./defs/electrician-trades'),
  'construction-supervisor': () => import('./defs/construction-supervisor'),
  'chef-culinary': () => import('./defs/chef-culinary'),
  'driver-logistics': () => import('./defs/driver-logistics'),
  'warehouse-supervisor': () => import('./defs/warehouse-supervisor'),
  'security-officer': () => import('./defs/security-officer'),
  'hospitality-manager': () => import('./defs/hospitality-manager'),
  'retail-manager': () => import('./defs/retail-manager'),
  'government-applicant': () => import('./defs/government-applicant'),
  'ngo-officer': () => import('./defs/ngo-officer'),
  'lawyer-legal': () => import('./defs/lawyer-legal'),
  'translator-multilingual': () => import('./defs/translator-multilingual'),
  'student-intern': () => import('./defs/student-intern'),
  'consultant-advisor': () => import('./defs/consultant-advisor'),
  'architect-design': () => import('./defs/architect-design'),
  'universal-minimal': () => import('./defs/universal-minimal'),
  'creative-director': () => import('./defs/creative-director'),
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
  { id: 'nurse-clinical', name: 'Clinical Care', profession: 'Nurse', category: 'Healthcare' },
  { id: 'pharmacist-care', name: 'Pharmacy Care', profession: 'Pharmacist', category: 'Healthcare' },
  { id: 'civil-engineer', name: 'Site & Structures', profession: 'Civil Engineer', category: 'Engineering' },
  { id: 'electrical-engineer', name: 'Power & Controls', profession: 'Electrical Engineer', category: 'Engineering' },
  { id: 'dentist-clinical', name: 'Dental Practice', profession: 'Dentist', category: 'Healthcare' },
  { id: 'academic-cv', name: 'Academic CV', profession: 'Academic / Researcher', category: 'Education' },
  { id: 'accountant-ledger', name: 'Ledger & Close', profession: 'Accountant', category: 'Finance' },
  { id: 'bank-officer', name: 'Banking Officer', profession: 'Bank Officer', category: 'Finance' },
  { id: 'sales-executive', name: 'Pipeline Pro', profession: 'Sales Executive', category: 'Sales' },
  { id: 'customer-support', name: 'Support Star', profession: 'Customer Support Specialist', category: 'Support' },
  { id: 'hr-professional', name: 'People Partner', profession: 'HR Professional', category: 'Business' },
  { id: 'real-estate-agent', name: 'Property Closer', profession: 'Real Estate Agent', category: 'Sales' },
  { id: 'staff-engineer', name: 'Staff Engineer', profession: 'Senior Software Engineer', category: 'Technology' },
  { id: 'product-manager', name: 'Product Story', profession: 'Product Manager', category: 'Technology' },
  { id: 'data-analyst', name: 'Insight Report', profession: 'Data Analyst', category: 'Technology' },
  { id: 'ux-designer', name: 'UX Case Grid', profession: 'UX Designer', category: 'Design' },
  { id: 'digital-marketer', name: 'Growth Marketer', profession: 'Digital Marketer', category: 'Marketing' },
  { id: 'content-writer', name: "Writer's Page", profession: 'Content Writer', category: 'Marketing' },
  { id: 'electrician-trades', name: 'Licensed Electrician', profession: 'Electrician', category: 'Skilled trades' },
  { id: 'construction-supervisor', name: 'Site Supervisor', profession: 'Construction Supervisor', category: 'Skilled trades' },
  { id: 'chef-culinary', name: "Chef's Whites", profession: 'Chef', category: 'Hospitality' },
  { id: 'driver-logistics', name: 'On the Road', profession: 'Driver / Logistics', category: 'Logistics' },
  { id: 'warehouse-supervisor', name: 'Warehouse Lead', profession: 'Warehouse Supervisor', category: 'Logistics' },
  { id: 'security-officer', name: 'Security Professional', profession: 'Security Officer', category: 'Services' },
  { id: 'hospitality-manager', name: 'Guest Experience', profession: 'Hospitality Manager', category: 'Hospitality' },
  { id: 'retail-manager', name: 'Store Leader', profession: 'Retail Manager', category: 'Retail' },
  { id: 'government-applicant', name: 'Public Service', profession: 'Government Applicant', category: 'Public Sector' },
  { id: 'ngo-officer', name: 'Programme Officer', profession: 'NGO Programme Officer', category: 'Public Sector' },
  { id: 'lawyer-legal', name: 'Legal Counsel', profession: 'Lawyer', category: 'Legal' },
  { id: 'translator-multilingual', name: 'Multilingual', profession: 'Translator', category: 'Languages' },
  { id: 'student-intern', name: 'Student & Intern', profession: 'Student / Intern', category: 'Early Career' },
  { id: 'consultant-advisor', name: 'Independent Consultant', profession: 'Consultant', category: 'Business' },
  { id: 'architect-design', name: 'Architect Portfolio', profession: 'Architect', category: 'Design' },
  { id: 'universal-minimal', name: 'Universal Minimal', profession: 'Any Profession', category: 'General' },
  { id: 'creative-director', name: 'Creative Direction', profession: 'Creative Director', category: 'Design' },
];
