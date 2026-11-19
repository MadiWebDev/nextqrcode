import { defineTemplate } from '../define';
import { makeSample } from '../sample-helpers';

export default defineTemplate({
  id: 'sales-executive',
  name: 'Pipeline Pro',
  profession: 'Sales Executive',
  category: 'Sales',
  atsSafe: false,
  columns: 2,
  supportsPhoto: true,
  layout: 'sidebar-right',
  header: 'band',
  heading: 'band-chip',
  fontPair: 'grotesk-inter',
  tokens: { accent: '#b91c1c', palettes: ['#b91c1c', '#1d4ed8', '#0f766e', '#334155'] },
  sideSections: ['skills', 'awards', 'languages'],
  sectionOrder: ['summary', 'experience', 'awards', 'education', 'skills'],
  why: 'Sales leaders read numbers first: quota, attainment, deal size. A bold band header and a sidebar for awards and tools put the proof of performance where a VP of Sales looks for it.',
  sample: () =>
    makeSample({
      templateId: 'sales-executive',
      name: 'Lucas Meyer',
      headline: 'B2B Sales Executive — SaaS',
      email: 'lucas.meyer@example.com',
      phone: '+49 170 0000000',
      location: 'Munich, Germany',
      summary:
        'B2B sales executive with 6 years selling software to mid-market operations teams. President\u2019s Club 2023; known for multi-threaded deals and honest forecasting.',
      experience: [
        {
          role: 'Senior Account Executive',
          org: 'FlowDesk Software (fictional)',
          location: 'Munich',
          start: [2021, 2],
          current: true,
          bullets: [
            'Closed €1.4m new ARR in 2024 against a €1.1m quota (127% attainment)',
            'Average deal size €38k across 37 closed-won opportunities',
            'Built the DACH manufacturing vertical from 2 to 19 accounts',
          ],
        },
        {
          role: 'Account Executive',
          org: 'Example CRM GmbH (fictional)',
          location: 'Berlin',
          start: [2018, 7],
          end: [2021, 1],
          bullets: ['Achieved 105–118% of quota in 8 consecutive quarters', 'Ran discovery and demos for inbound and partner-sourced pipeline'],
        },
      ],
      education: [
        { institution: 'University of Example (fictional)', area: 'Business Administration', studyType: 'BA', start: [2014], end: [2018], score: '2.1 equivalent' },
      ],
      skillGroups: [
        { name: 'Selling', skills: ['MEDDICC discovery', 'Multi-threading', 'Negotiation', 'Forecasting'] },
        { name: 'Tools', skills: ['Salesforce', 'Outreach', 'LinkedIn Sales Navigator', 'Gong'] },
      ],
    }),
});
