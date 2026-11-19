import { defineTemplate } from '../define';
import { makeSample } from '../sample-helpers';

export default defineTemplate({
  id: 'government-applicant',
  name: 'Public Service',
  profession: 'Government Applicant',
  category: 'Public Sector',
  atsSafe: true,
  columns: 1,
  supportsPhoto: false,
  layout: 'label-column',
  header: 'left',
  heading: 'plain-caps',
  fontPair: 'georgia-arial',
  tokens: { accent: '#1e3a5f', palettes: ['#1e3a5f', '#334155', '#166534', '#7c2d12'] },
  sectionOrder: ['summary', 'experience', 'education', 'skills', 'certifications'],
  why: 'Public-sector panels score against published criteria with structured forms. The label-column layout mirrors official application sections, making it easy for a panel — or a portal — to find education, service history and competencies in order.',
  sample: () =>
    makeSample({
      templateId: 'government-applicant',
      name: 'Joseph Adeyemi',
      headline: 'Administrative Officer — Public Service',
      email: 'joseph.adeyemi@example.com',
      phone: '+234 810 000 0000',
      location: 'Abuja, Nigeria',
      summary:
        'Administrative officer with 7 years in registry, records and committee support. Known for complete files, on-time minutes and calm handling of public enquiries.',
      experience: [
        {
          role: 'Administrative Officer',
          org: 'Example Ministry Department (fictional)',
          location: 'Abuja',
          start: [2020, 2],
          current: true,
          bullets: [
            'Maintain registry of 12,000+ files with a retrieval time under 10 minutes',
            'Draft minutes and action trackers for 3 standing committees',
            'Process 200+ public enquiries a month within the service charter timeline',
          ],
        },
        {
          role: 'Clerical Officer',
          org: 'Example Local Authority (fictional)',
          location: 'Abuja',
          start: [2017, 8],
          end: [2020, 1],
          bullets: ['Digitised 4 years of correspondence records', 'Supported payroll data entry for 300 staff with zero errors at audit'],
        },
      ],
      education: [
        { institution: 'University of Example (fictional)', area: 'Public Administration', studyType: 'BSc', start: [2012], end: [2016], score: 'Second Class Upper' },
      ],
      skillGroups: [
        { name: 'Administration', skills: ['Registry & records', 'Minutes & drafting', 'Committee support', 'Data entry accuracy'] },
        { name: 'Systems', skills: ['MS Office', 'EDRMS basics', 'Typing 55 wpm'] },
      ],
    }),
});
