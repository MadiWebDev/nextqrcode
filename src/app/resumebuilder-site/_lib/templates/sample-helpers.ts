import type { ResumeDoc, Section } from '../schema';
import { rt } from '../schema';
import { makeSection, uid } from '../defaults';

/**
 * Terse builder for the fictional sample documents every template
 * carries. All people, employers, schools and numbers are invented;
 * emails use example.com and phone numbers use fictional ranges.
 */
export interface SampleSpec {
  name: string;
  headline: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  experience: Array<{
    role: string;
    org: string;
    location?: string;
    start: [number, number?];
    end?: [number, number?];
    current?: boolean;
    bullets: string[];
  }>;
  education: Array<{
    institution: string;
    area: string;
    studyType?: string;
    start: [number, number?];
    end?: [number, number?];
    score?: string;
  }>;
  skillGroups: Array<{ name: string; skills: string[] }>;
  extraSections?: Section[];
  templateId: string;
  region?: ResumeDoc['meta']['region'];
}

export function makeSample(spec: SampleSpec): ResumeDoc {
  const now = Date.now();
  const sections: Section[] = [
    { ...makeSection('summary'), text: [rt.p(spec.summary)] },
    {
      ...makeSection('experience'),
      experience: spec.experience.map((e) => ({
        id: uid('exp'),
        role: e.role,
        organization: e.org,
        location: e.location,
        start: { y: e.start[0], m: e.start[1] },
        end: e.end ? { y: e.end[0], m: e.end[1] } : undefined,
        current: e.current,
        bullets: [rt.bullets(e.bullets)],
      })),
    },
    {
      ...makeSection('education'),
      education: spec.education.map((e) => ({
        id: uid('edu'),
        institution: e.institution,
        area: e.area,
        studyType: e.studyType,
        start: { y: e.start[0], m: e.start[1] },
        end: e.end ? { y: e.end[0], m: e.end[1] } : undefined,
        score: e.score,
        bullets: [],
      })),
    },
    {
      ...makeSection('skills'),
      skillGroups: spec.skillGroups.map((g) => ({
        id: uid('group'),
        name: g.name,
        skills: g.skills.map((name) => ({ id: uid('skill'), name })),
      })),
    },
    ...(spec.extraSections ?? []),
  ];
  return {
    schemaVersion: 1,
    id: uid('sample'),
    meta: {
      title: `${spec.headline} — sample`,
      templateId: spec.templateId,
      region: spec.region ?? 'us-ca',
      language: 'en',
      direction: 'ltr',
      targetRole: spec.headline,
      createdAt: now,
      updatedAt: now,
    },
    basics: {
      name: spec.name,
      headline: spec.headline,
      email: spec.email,
      phone: spec.phone,
      location: spec.location,
      website: '',
      links: [],
    },
    photo: { shape: 'rounded', show: false },
    sensitive: {},
    sections,
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

export function extraSection(kind: Section['kind'], title: string, fill: Partial<Section>): Section {
  return { ...makeSection(kind, title), ...fill };
}

export function bulletsOf(items: string[]) {
  return [rt.bullets(items)];
}
