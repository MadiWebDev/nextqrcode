import {
  CURRENT_SCHEMA_VERSION,
  type ResumeDoc,
  type Section,
  type SectionKind,
} from './schema';

let counter = 0;
/** Collision-safe-enough local id (not a security token). */
export function uid(prefix = 'id'): string {
  counter += 1;
  return `${prefix}-${Date.now().toString(36)}-${counter.toString(36)}-${Math.floor(
    Math.random() * 1e6,
  ).toString(36)}`;
}

export const DEFAULT_SECTION_TITLES: Record<SectionKind, string> = {
  summary: 'Summary',
  experience: 'Experience',
  education: 'Education',
  skills: 'Skills',
  projects: 'Projects',
  certifications: 'Certifications & Licences',
  awards: 'Awards',
  languages: 'Languages',
  publications: 'Publications',
  research: 'Research',
  volunteering: 'Volunteering',
  courses: 'Courses & Training',
  memberships: 'Memberships',
  references: 'References',
  interests: 'Interests',
  declaration: 'Declaration',
  custom: 'Custom Section',
};

export function makeSection(kind: SectionKind, title?: string): Section {
  const base: Section = {
    id: uid('sec'),
    kind,
    title: title ?? DEFAULT_SECTION_TITLES[kind],
    visible: true,
  };
  switch (kind) {
    case 'summary':
    case 'declaration':
      return { ...base, text: [] };
    case 'experience':
      return { ...base, experience: [] };
    case 'education':
      return { ...base, education: [] };
    case 'skills':
      return { ...base, skillGroups: [] };
    case 'projects':
      return { ...base, projects: [] };
    case 'certifications':
      return { ...base, certifications: [] };
    case 'awards':
      return { ...base, awards: [] };
    case 'languages':
      return { ...base, languages: [] };
    case 'publications':
      return { ...base, publications: [] };
    case 'references':
      return { ...base, references: [], referencesMode: 'on-request' };
    case 'interests':
      return { ...base, tags: [] };
    case 'custom':
      return { ...base, customType: 'text', text: [] };
    default:
      return { ...base, entries: [] };
  }
}

/** A fresh, empty resume with the standard section set (region defaults refine this in the editor). */
export function newResumeDoc(init?: Partial<Pick<ResumeDoc['meta'], 'title' | 'templateId' | 'region'>>): ResumeDoc {
  const now = Date.now();
  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    id: uid('resume'),
    meta: {
      title: init?.title ?? 'Untitled resume',
      templateId: init?.templateId ?? 'universal-minimal',
      region: init?.region ?? 'us-ca',
      language: 'en',
      direction: 'ltr',
      createdAt: now,
      updatedAt: now,
    },
    basics: { name: '', headline: '', email: '', phone: '', location: '', website: '', links: [] },
    photo: { shape: 'rounded', show: false },
    sensitive: {},
    sections: [
      makeSection('summary'),
      makeSection('experience'),
      makeSection('education'),
      makeSection('skills'),
    ],
    theme: {
      accent: '#0f766e',
      fontPair: 'source-inter',
      fontScale: 1,
      lineHeight: 1.45,
      margin: 'normal',
      sectionSpacing: 'normal',
      headingCase: 'upper',
      bulletStyle: 'disc',
      showIcons: true,
      pageSize: 'a4',
      dateFormat: 'mmm-yyyy',
    },
    qr: { enabled: false, target: 'url', placement: 'header', sizeMm: 22, vcardFields: ['name', 'email', 'phone'] },
  };
}
