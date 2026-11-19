import { defineTemplate } from '../define';
import { makeSample, extraSection, bulletsOf } from '../sample-helpers';

export default defineTemplate({
  id: 'staff-engineer',
  name: 'Staff Engineer',
  profession: 'Senior Software Engineer',
  category: 'Technology',
  atsSafe: true,
  columns: 1,
  supportsPhoto: false,
  layout: 'single',
  header: 'split',
  heading: 'plain-caps',
  fontPair: 'grotesk-inter',
  tokens: { accent: '#0f172a', palettes: ['#0f172a', '#1d4ed8', '#0f766e', '#7c2d12'] },
  sectionOrder: ['summary', 'skills', 'experience', 'projects', 'education'],
  why: 'Senior engineering screens look for scope: systems owned, scale handled, people mentored. Skills sit above experience for fast keyword matching, and project entries carry the architectural detail hiring panels probe in interviews.',
  sample: () =>
    makeSample({
      templateId: 'staff-engineer',
      name: 'Ingrid Johansson',
      headline: 'Staff Software Engineer — Platform',
      email: 'ingrid.j@example.com',
      phone: '+46 73 000 0000',
      location: 'Stockholm, Sweden',
      summary:
        'Staff engineer with 11 years building payment and platform systems. Led the migration of a monolith serving 40m monthly users to services with zero downtime cutovers; mentors 5 engineers.',
      experience: [
        {
          role: 'Staff Software Engineer',
          org: 'NorthPay (fictional)',
          location: 'Stockholm',
          start: [2021, 5],
          current: true,
          bullets: [
            'Own the platform roadmap for 4 teams (28 engineers) across payments and identity',
            'Led monolith-to-services migration: 14 services extracted, deploy frequency up 6×, incidents down 35%',
            'Designed the idempotency framework now used by all payment APIs (2.1bn requests/year, fictional)',
          ],
        },
        {
          role: 'Senior Software Engineer',
          org: 'Example Retail Tech (fictional)',
          location: 'Stockholm',
          start: [2017, 3],
          end: [2021, 4],
          bullets: ['Built the checkout API handling peak traffic of 9,000 requests/minute', 'Introduced contract testing, cutting integration defects by half'],
        },
      ],
      education: [
        { institution: 'Example Institute of Technology (fictional)', area: 'Computer Science', studyType: 'MSc', start: [2011], end: [2016], score: 'With Honours' },
      ],
      skillGroups: [
        { name: 'Languages', skills: ['TypeScript', 'Go', 'Kotlin', 'SQL'] },
        { name: 'Platform', skills: ['Kubernetes', 'Kafka', 'PostgreSQL', 'AWS', 'Terraform', 'Observability (Grafana/OTel)'] },
      ],
      extraSections: [
        extraSection('projects', 'Selected Projects', {
          entries: [
            { id: 'sp1', title: 'Payments Idempotency Framework', organization: 'NorthPay (fictional)', bullets: bulletsOf(['Eliminated duplicate-charge incidents across all payment APIs']) },
          ],
        }),
      ],
    }),
});
