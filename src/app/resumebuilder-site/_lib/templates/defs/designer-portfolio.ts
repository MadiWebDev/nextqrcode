import { defineTemplate } from '../define';
import { makeSample, extraSection } from '../sample-helpers';

export default defineTemplate({
  id: 'designer-portfolio',
  name: 'Designer / UX — Portfolio Grid',
  profession: 'Designer / UX',
  category: 'Tech and creative',
  atsSafe: false,
  columns: 2,
  supportsPhoto: true,
  layout: 'two-column',
  header: 'monogram',
  heading: 'boxed',
  sideSections: ['skills'],
  tokens: { accent: '#db2777', headingFont: 'Arial, Helvetica, sans-serif', palettes: ['#db2777', '#111827', '#2563eb', '#0f766e'] },
  sectionOrder: ['summary', 'projects', 'experience', 'skills', 'education'],
  why: 'Design hiring starts with the portfolio. Projects get grid treatment with links up front, while experience stays complete for the recruiter who reads second. Marked Designed: the two-column flow is for human eyes first.',
  sample: () =>
    makeSample({
      templateId: 'designer-portfolio',
      name: 'Sofia Lindqvist',
      headline: 'Product Designer — UX & Interfaces',
      email: 'sofia.lindqvist@example.com',
      phone: '+46 70 000 00 00',
      location: 'Stockholm, Sweden',
      region: 'eu',
      summary:
        'Product designer with 6 years across fintech and health apps. I take features from discovery interviews to shipped, measured interfaces, working in tight loops with engineers.',
      experience: [
        {
          role: 'Senior Product Designer',
          org: 'Fictional Fintech AB',
          location: 'Stockholm',
          start: [2022, 5],
          current: true,
          bullets: [
            'Redesigned onboarding, lifting completion from 41% to 63% across 200k new users a year',
            'Own the design system (120 components) used by 4 product teams',
            'Run monthly usability sessions and publish findings to the whole company',
          ],
        },
        {
          role: 'UX Designer',
          org: 'Example Health Studio (fictional)',
          start: [2019, 8],
          end: [2022, 4],
          bullets: ['Designed a patient booking flow that cut phone bookings by 35%'],
        },
      ],
      education: [
        { institution: 'Example Design School (fictional)', area: 'Interaction Design', studyType: 'BFA', start: [2015], end: [2019] },
      ],
      skillGroups: [
        { name: 'Design', skills: ['UX research', 'Wireframing', 'Design systems', 'Accessibility (WCAG)'] },
        { name: 'Tools', skills: ['Figma', 'FigJam', 'Maze (example tool)', 'Basic HTML/CSS'] },
      ],
      extraSections: [
        extraSection('projects', 'Selected Work', {
          projects: [
            { id: 'p1', name: 'Onboarding redesign — case study', description: [], stack: ['UX', 'Mobile'], url: 'https://example.com/work/onboarding' },
            { id: 'p2', name: 'Design system v2 — case study', description: [], stack: ['Systems', 'Web'], url: 'https://example.com/work/ds' },
            { id: 'p3', name: 'Patient booking flow — case study', description: [], stack: ['UX', 'Health'], url: 'https://example.com/work/booking' },
          ],
        }),
      ],
    }),
});
