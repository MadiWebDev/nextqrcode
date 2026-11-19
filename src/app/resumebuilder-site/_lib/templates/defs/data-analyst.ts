import { defineTemplate } from '../define';
import { makeSample, extraSection, bulletsOf } from '../sample-helpers';

export default defineTemplate({
  id: 'data-analyst',
  name: 'Insight Report',
  profession: 'Data Analyst',
  category: 'Technology',
  atsSafe: true,
  columns: 1,
  supportsPhoto: false,
  layout: 'single',
  header: 'left',
  heading: 'band-chip',
  fontPair: 'grotesk-inter',
  tokens: { accent: '#0369a1', palettes: ['#0369a1', '#0f766e', '#7c3aed', '#334155'] },
  sectionOrder: ['summary', 'skills', 'experience', 'projects', 'education'],
  why: 'Analytics hiring screens for tools first, then evidence of decisions changed. Skills lead, and project entries give dashboards and analyses the space to name their audience and impact.',
  sample: () =>
    makeSample({
      templateId: 'data-analyst',
      name: 'Chen Wei',
      headline: 'Data Analyst — Commercial Analytics',
      email: 'chen.wei@example.com',
      phone: '+65 9000 0000',
      location: 'Singapore',
      summary:
        'Data analyst with 5 years turning messy operational data into decisions. Builds the dashboards executives open daily; fluent in SQL, Python and explaining uncertainty to non-technical audiences.',
      experience: [
        {
          role: 'Data Analyst',
          org: 'Meridian Retail Group (fictional)',
          location: 'Singapore',
          start: [2021, 3],
          current: true,
          bullets: [
            'Built the executive sales dashboard (Looker) used by 120 managers across 6 markets',
            'Identified a pricing leak worth S$1.2m a year (fictional) through margin analysis by SKU',
            'Automated weekly reporting, saving the team 10 hours a week',
          ],
        },
        {
          role: 'Junior Data Analyst',
          org: 'Example Logistics (fictional)',
          location: 'Singapore',
          start: [2019, 7],
          end: [2021, 2],
          bullets: ['Cleaned and modelled delivery data for route optimisation pilots', 'Maintained data quality checks across 14 source tables'],
        },
      ],
      education: [
        { institution: 'University of Example (fictional)', area: 'Statistics', studyType: 'BSc', start: [2015], end: [2019], score: 'Second Class Upper' },
      ],
      skillGroups: [
        { name: 'Analysis', skills: ['SQL (advanced)', 'Python (pandas)', 'A/B test analysis', 'Cohort & funnel analysis'] },
        { name: 'Reporting', skills: ['Looker', 'Tableau', 'dbt', 'Excel / Sheets'] },
      ],
      extraSections: [
        extraSection('projects', 'Selected Analyses', {
          entries: [
            { id: 'da1', title: 'SKU Margin Leak Analysis', organization: 'Meridian Retail Group (fictional)', bullets: bulletsOf(['Traced margin loss to a promotion-stacking rule; fix recovered margin within one quarter']) },
          ],
        }),
      ],
    }),
});
