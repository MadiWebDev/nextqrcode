import { defineTemplate } from '../define';
import { makeSample, extraSection } from '../sample-helpers';

export default defineTemplate({
  id: 'academic-cv',
  name: 'Academic CV',
  profession: 'Academic / Researcher',
  category: 'Education',
  atsSafe: false,
  columns: 1,
  supportsPhoto: false,
  layout: 'single',
  header: 'centered',
  heading: 'numbered',
  fontPair: 'georgia-arial',
  tokens: { accent: '#44403c', palettes: ['#44403c', '#7c2d12', '#1d4ed8', '#166534'] },
  sectionOrder: ['summary', 'education', 'experience', 'publications', 'projects', 'awards', 'skills'],
  why: 'Academic CVs are long by design: committees expect education first, then posts, publications and funding in full. Numbered sections and generous spacing keep a six-page record readable and citable.',
  sample: () =>
    makeSample({
      templateId: 'academic-cv',
      name: 'Dr Elena Petrova',
      headline: 'Lecturer in Environmental Economics',
      email: 'elena.petrova@example.com',
      phone: '+359 2 000 0000',
      location: 'Sofia, Bulgaria',
      summary:
        'Environmental economist researching water pricing and rural livelihoods. Fourteen peer-reviewed publications, two completed grants as principal investigator and undergraduate teaching across microeconomics and econometrics.',
      experience: [
        {
          role: 'Lecturer',
          org: 'University of Example (fictional)',
          location: 'Sofia',
          start: [2020, 9],
          current: true,
          bullets: [
            'Teach microeconomics (240 students) and econometrics (60 students) with consistently strong evaluations',
            'Supervise 4 PhD candidates and 12 MSc dissertations to completion',
            'Principal investigator on a 3-year water-pricing study (fictional grant value €180,000)',
          ],
        },
        {
          role: 'Postdoctoral Researcher',
          org: 'Example Institute for Policy Studies (fictional)',
          location: 'Vienna',
          start: [2017, 10],
          end: [2020, 8],
          bullets: ['Led the quantitative workstream of a 5-country household survey (n = 6,200)', 'Published 5 articles from the project, 2 as first author'],
        },
      ],
      education: [
        { institution: 'University of Example (fictional)', area: 'Economics', studyType: 'PhD', start: [2013], end: [2017], score: 'Thesis: Pricing Water for Equity and Efficiency' },
        { institution: 'University of Example (fictional)', area: 'Economics', studyType: 'MSc', start: [2011], end: [2013], score: 'Distinction' },
      ],
      skillGroups: [
        { name: 'Methods', skills: ['Econometrics', 'Survey design', 'Stata', 'R', 'LaTeX'] },
        { name: 'Languages', skills: ['Bulgarian (native)', 'English (fluent)', 'German (intermediate)'] },
      ],
      extraSections: [
        extraSection('publications', 'Selected Publications', {
          publications: [
            { id: 'ap1', title: 'Pricing Water for Equity and Efficiency', publisher: 'Journal of Example Studies (fictional), 2023 — first author' },
            { id: 'ap2', title: 'Rural Households and Tariff Reform', publisher: 'Example Policy Review (fictional), 2021 — co-author' },
          ],
        }),
        extraSection('awards', 'Awards & Funding', {
          awards: [
            { id: 'aa1', title: 'Early Career Research Grant', awarder: 'Example Research Council (fictional), 2021', summary: 'Principal investigator' },
          ],
        }),
      ],
    }),
});
