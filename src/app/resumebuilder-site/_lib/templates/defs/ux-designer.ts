import { defineTemplate } from '../define';
import { makeSample, extraSection, bulletsOf } from '../sample-helpers';

export default defineTemplate({
  id: 'ux-designer',
  name: 'UX Case Grid',
  profession: 'UX Designer',
  category: 'Design',
  atsSafe: false,
  columns: 2,
  supportsPhoto: true,
  layout: 'two-column',
  header: 'split',
  heading: 'dot-leader',
  fontPair: 'grotesk-inter',
  tokens: { accent: '#db2777', palettes: ['#db2777', '#7c3aed', '#0369a1', '#0f766e'] },
  sideSections: ['skills', 'languages'],
  sectionOrder: ['summary', 'projects', 'experience', 'education', 'skills'],
  why: 'UX hiring is portfolio-led: projects come before job titles. This grid gives case studies the first column while methods, tools and research skills stay visible in the sidebar.',
  sample: () =>
    makeSample({
      templateId: 'ux-designer',
      name: 'Mia Kowalski',
      headline: 'Product Designer (UX/UI)',
      email: 'mia.kowalski@example.com',
      phone: '+48 600 000 000',
      location: 'Kraków, Poland',
      summary:
        'Product designer with 6 years across fintech and health apps. Research-driven, systems-minded; designs accessible flows that measurably cut support contacts.',
      experience: [
        {
          role: 'Senior Product Designer',
          org: 'Finch Bank App (fictional)',
          location: 'Kraków (remote)',
          start: [2021, 6],
          current: true,
          bullets: [
            'Redesigned onboarding: completion up from 54% to 78%, support tickets down 31%',
            'Own the design system (120 components) used by 5 product teams',
            'Run monthly usability rounds with 6–8 participants, including assistive-tech users',
          ],
        },
        {
          role: 'UX Designer',
          org: 'Example Health Startup (fictional)',
          location: 'Warsaw',
          start: [2019, 2],
          end: [2021, 5],
          bullets: ['Designed appointment booking used by 200 clinics', 'Built the accessibility checklist now standard in design reviews'],
        },
      ],
      education: [
        { institution: 'Academy of Example Arts (fictional)', area: 'Communication Design', studyType: 'BA', start: [2014], end: [2018], score: 'With Distinction' },
      ],
      skillGroups: [
        { name: 'Design', skills: ['Interaction design', 'Design systems', 'Prototyping', 'Accessibility (WCAG 2.2)'] },
        { name: 'Research', skills: ['Usability testing', 'Interviews', 'Journey mapping', 'Survey design'] },
        { name: 'Tools', skills: ['Figma', 'FigJam', 'Maze', 'Notion'] },
      ],
      extraSections: [
        extraSection('projects', 'Case Studies', {
          entries: [
            { id: 'ux1', title: 'Onboarding Redesign — Finch Bank App', organization: 'Portfolio case study', bullets: bulletsOf(['Problem framing, 3 tested directions, shipped flow and measured results']) },
          ],
        }),
      ],
    }),
});
