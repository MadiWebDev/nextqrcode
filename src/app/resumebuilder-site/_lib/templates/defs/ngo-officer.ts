import { defineTemplate } from '../define';
import { makeSample, extraSection, bulletsOf } from '../sample-helpers';

export default defineTemplate({
  id: 'ngo-officer',
  name: 'Programme Officer',
  profession: 'NGO Programme Officer',
  category: 'Public Sector',
  atsSafe: false,
  columns: 1,
  supportsPhoto: false,
  layout: 'timeline',
  header: 'left',
  heading: 'rule-under',
  fontPair: 'source-inter',
  tokens: { accent: '#15803d', palettes: ['#15803d', '#0369a1', '#b45309', '#334155'] },
  sectionOrder: ['summary', 'experience', 'projects', 'education', 'skills', 'languages'],
  why: 'NGO recruiters read for programme scale, donor reporting and field credibility. A timeline shows multi-year programmes clearly, and project entries name funders, reach and results the way proposals do.',
  sample: () =>
    makeSample({
      templateId: 'ngo-officer',
      name: 'Wanjiru Kamau',
      headline: 'Programme Officer — WASH',
      email: 'wanjiru.kamau@example.com',
      phone: '+254 722 000000',
      location: 'Kisumu, Kenya',
      summary:
        'Programme officer with 6 years delivering water and sanitation projects across 3 counties. Manages grants of up to USD 400k (fictional) with clean donor audits and community-first delivery.',
      experience: [
        {
          role: 'Programme Officer',
          org: 'ClearWater Initiative (fictional)',
          location: 'Kisumu',
          start: [2021, 3],
          current: true,
          bullets: [
            'Manage a WASH programme reaching 48,000 people across 3 counties',
            'Write quarterly donor reports and logframes for 2 institutional funders',
            'Supervise 5 field officers and 30 community health volunteers',
          ],
        },
        {
          role: 'Field Officer',
          org: 'Example Relief Organisation (fictional)',
          location: 'Turkana',
          start: [2018, 7],
          end: [2021, 2],
          bullets: ['Ran hygiene promotion in 26 communities and 40 schools', 'Conducted baseline and endline surveys with Kobo Toolbox'],
        },
      ],
      education: [
        { institution: 'University of Example (fictional)', area: 'Development Studies', studyType: 'BA', start: [2014], end: [2018], score: 'Second Class Upper' },
      ],
      skillGroups: [
        { name: 'Programme', skills: ['Grant management', 'M&E and logframes', 'Donor reporting', 'Community mobilisation', 'Budget tracking'] },
        { name: 'Tools', skills: ['Kobo Toolbox', 'Excel', 'CommCare basics'] },
      ],
      extraSections: [
        extraSection('projects', 'Key Programmes', {
          entries: [
            { id: 'ng1', title: 'Safe Water for Schools', organization: 'ClearWater Initiative (fictional)', bullets: bulletsOf(['40 schools, 18,000 pupils reached with handwashing stations and water treatment']) },
          ],
        }),
      ],
    }),
});
