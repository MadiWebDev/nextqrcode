import { defineTemplate } from '../define';
import { makeSample } from '../sample-helpers';

export default defineTemplate({
  id: 'executive-serif',
  name: 'Executive Serif',
  profession: 'Executive',
  category: 'Business',
  atsSafe: true,
  columns: 1,
  supportsPhoto: false,
  layout: 'single',
  header: 'centered',
  heading: 'overline',
  tokens: { accent: '#7c2d12', headingFont: 'Georgia, "Times New Roman", serif', bodyFont: 'Georgia, "Times New Roman", serif', palettes: ['#7c2d12', '#1e3a5f', '#334155', '#14532d'] },
  sectionOrder: ['summary', 'experience', 'education', 'memberships', 'awards', 'skills'],
  why: 'Senior appointments are read by people, not parsers alone — but the file still has to survive the parser. A centred serif presentation with a strict single column gives presence without sacrificing machine readability.',
  sample: () =>
    makeSample({
      templateId: 'executive-serif',
      name: 'Catherine Meyer',
      headline: 'Chief Operating Officer — Consumer Services',
      email: 'catherine.meyer@example.com',
      phone: '+44 20 0000 0000',
      location: 'London, UK',
      region: 'uk-ie',
      summary:
        'Operations executive with 16 years across multi-site consumer services. Led a 40-site, 1,900-person operation through a two-year turnaround, returning it to growth while lifting staff retention by 11 points.',
      experience: [
        {
          role: 'Chief Operating Officer',
          org: 'Fictional Consumer Group plc',
          location: 'London',
          start: [2020, 1],
          current: true,
          bullets: [
            'Full P&L responsibility for a 40-site operation with revenue of GBP 210m (fictional figure for illustration)',
            'Delivered a two-year turnaround: like-for-like sales +6.4%, staff retention up 11 points',
            'Chair the group risk and safeguarding committees',
          ],
        },
        {
          role: 'Regional Operations Director',
          org: 'Example Retail Services (fictional)',
          start: [2015, 6],
          end: [2019, 12],
          bullets: [
            'Ran 18 sites and 700 staff across the South East',
            'Opened 5 new sites on time and under budget',
          ],
        },
      ],
      education: [
        { institution: 'Example Business School (fictional)', area: 'Business Administration', studyType: 'MBA', start: [2009], end: [2011] },
      ],
      skillGroups: [
        { name: 'Leadership', skills: ['P&L ownership', 'Turnaround & growth', 'Board reporting', 'M&A integration'] },
        { name: 'Operations', skills: ['Multi-site operations', 'Workforce planning', 'Supplier strategy'] },
      ],
    }),
});
