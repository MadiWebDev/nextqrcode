import type { CustomSectionType, SectionKind } from './schema';

/**
 * Profession packs (spec §6): data-driven configuration, not hard-coded
 * UI. A pack adds sections, pre-built custom sections and field hints
 * (carried in entry `extras`) for a profession. The editor reads packs;
 * it never branches on profession ids.
 */
export interface PackCustomSection {
  title: string;
  customType: CustomSectionType;
  hint: string;
}

export interface ProfessionPack {
  id: string;
  label: string;
  addSections: SectionKind[];
  customSections: PackCustomSection[];
  /** Field hints shown on relevant entries (extras keys). */
  fieldHints: Array<{ appliesTo: SectionKind | 'experience' | 'education'; key: string; label: string; hint: string }>;
  note?: string;
}

export const PROFESSION_PACKS: ProfessionPack[] = [
  {
    id: 'teaching',
    label: 'Teaching',
    addSections: ['courses'],
    customSections: [
      { title: 'Teaching Philosophy', customType: 'text', hint: 'Three to five sentences on how you teach and how you know it works.' },
      { title: 'Subjects & Grade Levels', customType: 'tags', hint: 'e.g. Mathematics — Grades 6–8' },
      { title: 'Curriculum Frameworks', customType: 'tags', hint: 'e.g. Cambridge, IB, national curriculum' },
      { title: 'Classroom Technology', customType: 'tags', hint: 'Tools you genuinely use: LMS, smart boards, assessment apps.' },
    ],
    fieldHints: [
      { appliesTo: 'experience', key: 'studentOutcomes', label: 'Student outcomes', hint: 'A measurable result, e.g. "Class average rose from 61% to 74%".' },
      { appliesTo: 'experience', key: 'classSize', label: 'Class size', hint: 'Typical number of students per class.' },
    ],
  },
  {
    id: 'engineering',
    label: 'Engineering',
    addSections: ['projects', 'certifications', 'memberships'],
    customSections: [
      { title: 'Software & Tools', customType: 'tags', hint: 'CAD/CAE and analysis tools you can be tested on.' },
      { title: 'Standards & Codes', customType: 'tags', hint: 'e.g. ACI 318, Eurocode 2, ASME BPVC' },
    ],
    fieldHints: [
      { appliesTo: 'projects', key: 'impact', label: 'Measurable impact', hint: 'Cost, time, load, throughput — a number a reviewer can check.' },
      { appliesTo: 'experience', key: 'charteredStatus', label: 'Professional status', hint: 'e.g. PE, CEng, PEC registration — only if current and verifiable.' },
    ],
  },
  {
    id: 'medical',
    label: 'Medical & Healthcare',
    addSections: ['certifications', 'publications', 'research', 'memberships'],
    customSections: [
      { title: 'Clinical Rotations', customType: 'timeline', hint: 'Department, hospital (fictional in samples), dates.' },
      { title: 'Procedures Performed', customType: 'list', hint: 'Procedures you are credentialed to perform, with approximate volumes.' },
      { title: 'Continuing Medical Education', customType: 'list', hint: 'Course, provider, year, credit hours.' },
    ],
    fieldHints: [
      { appliesTo: 'certifications', key: 'issuingBody', label: 'Issuing body', hint: 'The council or board that issued the licence/registration.' },
      { appliesTo: 'certifications', key: 'registrationNumber', label: 'Registration number', hint: 'Your own verifiable registration number only.' },
    ],
    note: 'Enter only your own verifiable credentials. Employers and regulators check licences and registrations.',
  },
  {
    id: 'trades',
    label: 'Skilled Trades',
    addSections: ['certifications'],
    customSections: [
      { title: 'Tools & Equipment', customType: 'tags', hint: 'Tools you own or are certified to operate.' },
      { title: 'Machinery Operated', customType: 'tags', hint: 'Machines and plant you can operate safely.' },
      { title: 'Safety Certifications', customType: 'list', hint: 'e.g. first aid, working at height, confined space — with expiry dates.' },
      { title: 'Availability', customType: 'text', hint: 'Shifts, weekends, travel and start date.' },
    ],
    fieldHints: [
      { appliesTo: 'experience', key: 'siteExperience', label: 'Worksite experience', hint: 'Site types: residential, commercial, industrial, infrastructure.' },
    ],
  },
  {
    id: 'finance',
    label: 'Finance & Accounting',
    addSections: ['certifications', 'memberships'],
    customSections: [
      { title: 'Systems & Software', customType: 'tags', hint: 'e.g. SAP, QuickBooks, Oracle, advanced Excel' },
    ],
    fieldHints: [
      { appliesTo: 'experience', key: 'portfolioSize', label: 'Scale handled', hint: 'Budget, book size or transaction volume you were responsible for.' },
    ],
  },
  {
    id: 'law',
    label: 'Law',
    addSections: ['memberships', 'publications'],
    customSections: [
      { title: 'Practice Areas', customType: 'tags', hint: 'Areas you are admitted and practised in.' },
      { title: 'Bar Admissions', customType: 'list', hint: 'Jurisdiction, year of admission, current standing.' },
    ],
    fieldHints: [],
  },
  {
    id: 'it',
    label: 'IT & Software',
    addSections: ['projects', 'certifications'],
    customSections: [
      { title: 'Technical Stack', customType: 'tags', hint: 'Languages, platforms and tools — only what you can demonstrate.' },
    ],
    fieldHints: [
      { appliesTo: 'projects', key: 'impact', label: 'Measurable impact', hint: 'Latency, uptime, users, cost — a number, not an adjective.' },
    ],
  },
  {
    id: 'design',
    label: 'Design & Creative',
    addSections: ['projects'],
    customSections: [
      { title: 'Design Tools', customType: 'tags', hint: 'Tools you use professionally.' },
    ],
    fieldHints: [
      { appliesTo: 'projects', key: 'portfolioUrl', label: 'Portfolio link', hint: 'A link a reviewer can open — put the best piece first.' },
    ],
  },
  {
    id: 'hospitality',
    label: 'Hospitality',
    addSections: ['certifications'],
    customSections: [
      { title: 'Certifications', customType: 'list', hint: 'Food hygiene, first aid, responsible service — with expiry dates.' },
      { title: 'Availability', customType: 'text', hint: 'Shifts, weekends and seasonal availability.' },
    ],
    fieldHints: [
      { appliesTo: 'experience', key: 'covers', label: 'Covers / guests', hint: 'Typical covers per service or guests per shift.' },
    ],
  },
  {
    id: 'sales',
    label: 'Sales & Business Development',
    addSections: ['awards'],
    customSections: [],
    fieldHints: [
      { appliesTo: 'experience', key: 'quotaAttainment', label: 'Quota attainment', hint: 'e.g. "112% of annual target, FY2024" — only figures you can evidence.' },
      { appliesTo: 'experience', key: 'territory', label: 'Territory / book', hint: 'Region, segment or number of accounts.' },
    ],
  },
  {
    id: 'aviation',
    label: 'Aviation',
    addSections: ['certifications'],
    customSections: [
      { title: 'Licences & Ratings', customType: 'list', hint: 'Licence type, ratings, issuing authority, expiry.' },
      { title: 'Flight / Duty Hours', customType: 'table', hint: 'Total time by aircraft type, where relevant.' },
    ],
    fieldHints: [],
    note: 'Enter only licences and hours you can document in your logbook.',
  },
  {
    id: 'military-transition',
    label: 'Military to Civilian',
    addSections: ['certifications', 'courses'],
    customSections: [
      { title: 'Service Summary', customType: 'text', hint: 'Branch, role and years — translated into civilian terms a recruiter understands.' },
      { title: 'Security Clearance', customType: 'text', hint: 'Level and status only, if you are permitted to state it.' },
    ],
    fieldHints: [
      { appliesTo: 'experience', key: 'teamSize', label: 'Team size led', hint: 'Civilian reviewers understand "led a team of 12" better than unit designations.' },
    ],
  },
];

export function getPack(id: string): ProfessionPack | undefined {
  return PROFESSION_PACKS.find((p) => p.id === id);
}
