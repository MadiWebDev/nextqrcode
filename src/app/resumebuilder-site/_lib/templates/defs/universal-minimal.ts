import { defineTemplate } from '../define';
import { makeSample } from '../sample-helpers';

export default defineTemplate({
  id: 'universal-minimal',
  name: 'Universal Minimal',
  profession: 'Any Profession',
  category: 'General',
  atsSafe: true,
  columns: 1,
  supportsPhoto: false,
  layout: 'single',
  header: 'left',
  heading: 'boxed',
  fontPair: 'source-inter',
  tokens: { accent: '#111827', palettes: ['#111827', '#1d4ed8', '#0f766e', '#7c2d12'] },
  sectionOrder: ['summary', 'experience', 'education', 'skills'],
  why: 'The safe default for any profession: one column, standard headings, no photo, no graphics — nothing between your words and the reader or the screening software. Choose it when you do not know how the employer will read your resume.',
  sample: () =>
    makeSample({
      templateId: 'universal-minimal',
      name: 'Sam Carter',
      headline: 'Operations Coordinator',
      email: 'sam.carter@example.com',
      phone: '+1 555 010 0000',
      location: 'Austin, TX',
      summary:
        'Operations coordinator with 5 years keeping schedules, vendors and records on track for a 60-person company. The person teams call when a process needs to just work.',
      experience: [
        {
          role: 'Operations Coordinator',
          org: 'Example Services Inc (fictional)',
          location: 'Austin, TX',
          start: [2021, 2],
          current: true,
          bullets: [
            'Coordinate schedules and vendors for 60 staff across 2 sites',
            'Cut invoice processing time from 5 days to 2 by redesigning the approvals flow',
            'Maintain the asset register for 400+ items with quarterly audits',
          ],
        },
        {
          role: 'Administrative Assistant',
          org: 'Example Clinic Group (fictional)',
          location: 'Austin, TX',
          start: [2019, 5],
          end: [2021, 1],
          bullets: ['Managed appointments and records for 3 practitioners', 'Trained 4 new assistants on office systems'],
        },
      ],
      education: [
        { institution: 'Example Community College (fictional)', area: 'Business Administration', studyType: 'Associate Degree', start: [2017], end: [2019], score: 'Completed' },
      ],
      skillGroups: [
        { name: 'Operations', skills: ['Scheduling', 'Vendor coordination', 'Records management', 'Process improvement'] },
        { name: 'Tools', skills: ['Microsoft 365', 'Google Workspace', 'QuickBooks basics'] },
      ],
    }),
});
