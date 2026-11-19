import { defineTemplate } from '../define';
import { makeSample, extraSection, bulletsOf } from '../sample-helpers';

export default defineTemplate({
  id: 'content-writer',
  name: 'Writer\u2019s Page',
  profession: 'Content Writer',
  category: 'Marketing',
  atsSafe: true,
  columns: 1,
  supportsPhoto: false,
  layout: 'single',
  header: 'split',
  heading: 'rule-under',
  fontPair: 'georgia-arial',
  tokens: { accent: '#7c2d12', palettes: ['#7c2d12', '#334155', '#166534', '#1d4ed8'] },
  sectionOrder: ['summary', 'experience', 'projects', 'education', 'skills'],
  why: 'Editors hire writers on clips and clarity. A serif, editorial single column showcases published work as a projects list and keeps the prose itself as the loudest sample.',
  sample: () =>
    makeSample({
      templateId: 'content-writer',
      name: 'James Whitfield',
      headline: 'Content Writer — B2B Technology',
      email: 'james.whitfield@example.com',
      phone: '+44 7700 000000',
      location: 'Leeds, United Kingdom',
      summary:
        'B2B content writer with 6 years turning technical subjects into readable, ranking articles. 300+ published pieces; house-style stickler; interviews engineers without making them cry.',
      experience: [
        {
          role: 'Senior Content Writer',
          org: 'Northbeam Software (fictional)',
          location: 'Remote',
          start: [2021, 1],
          current: true,
          bullets: [
            'Write 6 long-form articles a month; the library now drives 38% of demo requests',
            'Own the editorial calendar and brief freelance writers',
            'Rewrote the help-centre top 50 articles, cutting related tickets by 17%',
          ],
        },
        {
          role: 'Content Writer',
          org: 'Example Marketing Agency (fictional)',
          location: 'Leeds',
          start: [2018, 9],
          end: [2020, 12],
          bullets: ['Produced blogs, white papers and email campaigns for 9 client accounts', 'Introduced a fact-check checklist adopted agency-wide'],
        },
      ],
      education: [
        { institution: 'University of Example (fictional)', area: 'English Language', studyType: 'BA', start: [2014], end: [2017], score: 'Upper Second' },
      ],
      skillGroups: [
        { name: 'Writing', skills: ['Long-form articles', 'White papers', 'Interview-based features', 'Editing & proofreading', 'SEO briefs'] },
        { name: 'Tools', skills: ['WordPress', 'Google Docs', 'Ahrefs (basics)', 'Grammarly'] },
      ],
      extraSections: [
        extraSection('projects', 'Selected Published Work', {
          entries: [
            { id: 'cw1', title: 'The Hidden Cost of Manual Reporting', organization: 'Northbeam blog (fictional)', bullets: bulletsOf(['Ranks top 3 for its target term; 4,100 monthly reads']) },
          ],
        }),
      ],
    }),
});
