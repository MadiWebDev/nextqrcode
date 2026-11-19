import { defineTemplate } from '../define';
import { makeSample } from '../sample-helpers';

export default defineTemplate({
  id: 'retail-manager',
  name: 'Store Leader',
  profession: 'Retail Manager',
  category: 'Retail',
  atsSafe: false,
  columns: 2,
  supportsPhoto: true,
  layout: 'sidebar-left',
  header: 'split',
  heading: 'dot-leader',
  fontPair: 'grotesk-inter',
  tokens: { accent: '#be185d', palettes: ['#be185d', '#1d4ed8', '#065f46', '#334155'] },
  sideSections: ['skills', 'certifications'],
  sectionOrder: ['summary', 'experience', 'education', 'skills'],
  why: 'Retail area managers scan for sales versus target, shrinkage and team size. A split header and metrics-led bullets put store performance first, with operational skills stacked neatly aside.',
  sample: () =>
    makeSample({
      templateId: 'retail-manager',
      name: 'Emma Novak',
      headline: 'Store Manager — Fashion Retail',
      email: 'emma.novak@example.com',
      phone: '+420 700 000 000',
      location: 'Brno, Czechia',
      summary:
        'Store manager with 8 years in fashion retail. Runs a €2.8m turnover store (fictional) with a team of 16; beat sales target 3 years running while cutting shrinkage below 1%.',
      experience: [
        {
          role: 'Store Manager',
          org: 'ModaPoint (fictional)',
          location: 'Brno',
          start: [2020, 9],
          current: true,
          bullets: [
            'Lead a team of 16 in a flagship store turning over €2.8m a year (fictional)',
            'Beat annual sales target by 6–11% in each of the last 3 years',
            'Reduced shrinkage from 1.6% to 0.9% through stock-cycle counting',
          ],
        },
        {
          role: 'Deputy Manager',
          org: 'Example Clothing Group (fictional)',
          location: 'Prague',
          start: [2017, 4],
          end: [2020, 8],
          bullets: ['Owned visual merchandising resets for seasonal launches', 'Trained 10 new supervisors across the region'],
        },
      ],
      education: [
        { institution: 'Example Business Academy (fictional)', area: 'Retail Management', studyType: 'Diploma', start: [2014], end: [2016], score: 'Completed' },
      ],
      skillGroups: [
        { name: 'Retail', skills: ['Sales coaching', 'Visual merchandising', 'Stock & shrinkage control', 'Rostering', 'KPI reporting'] },
        { name: 'Systems', skills: ['POS & back-office', 'Workforce planning tools', 'Excel'] },
      ],
    }),
});
