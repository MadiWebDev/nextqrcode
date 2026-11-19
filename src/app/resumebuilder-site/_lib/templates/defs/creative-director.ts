import { defineTemplate } from '../define';
import { makeSample, extraSection, bulletsOf } from '../sample-helpers';

export default defineTemplate({
  id: 'creative-director',
  name: 'Creative Direction',
  profession: 'Creative Director',
  category: 'Design',
  atsSafe: false,
  columns: 2,
  supportsPhoto: true,
  layout: 'two-column',
  header: 'band',
  heading: 'side-tab',
  fontPair: 'playfair-worksans',
  tokens: { accent: '#581c87', palettes: ['#581c87', '#b91c1c', '#0369a1', '#111827'] },
  sideSections: ['skills', 'awards'],
  sectionOrder: ['summary', 'projects', 'experience', 'education', 'skills', 'awards'],
  why: 'Creative leadership is judged on campaigns and taste. A bold band and project-first grid let the work speak, while awards and disciplines stay stacked for quick credibility checks.',
  sample: () =>
    makeSample({
      templateId: 'creative-director',
      name: 'Nadia Rahman',
      headline: 'Creative Director — Brand & Campaigns',
      email: 'nadia.rahman@example.com',
      phone: '+60 12 000 0000',
      location: 'Kuala Lumpur, Malaysia',
      summary:
        'Creative director with 12 years leading brand and campaign teams across FMCG and fintech. Work recognised by regional award shows; teams of up to 14 designers, writers and art directors.',
      experience: [
        {
          role: 'Creative Director',
          org: 'Studio Kencana (fictional)',
          location: 'Kuala Lumpur',
          start: [2020, 1],
          current: true,
          bullets: [
            'Lead creative for 6 retained clients; agency revenue from creative services up 48% in 3 years',
            'Directed a rebrand rolled out across 3 markets and 400 touchpoints',
            'Built the internship-to-hire pipeline that supplied 5 current mid-weight staff',
          ],
        },
        {
          role: 'Senior Art Director',
          org: 'Example Advertising (fictional)',
          location: 'Singapore',
          start: [2016, 6],
          end: [2019, 12],
          bullets: ['Art directed integrated campaigns for retail and travel clients', 'Won 2 regional effectiveness awards as part of the core team'],
        },
      ],
      education: [
        { institution: 'Example Art Institute (fictional)', area: 'Visual Communication', studyType: 'BA', start: [2009], end: [2013], score: 'First Class' },
      ],
      skillGroups: [
        { name: 'Direction', skills: ['Brand systems', 'Campaign concepts', 'Team leadership', 'Client presentation'] },
        { name: 'Craft', skills: ['Art direction', 'Typography', 'Motion briefs', 'Photography direction'] },
      ],
      extraSections: [
        extraSection('projects', 'Signature Work', {
          entries: [
            { id: 'cd1', title: 'Rebrand — Regional Fintech (fictional client)', organization: 'Studio Kencana', bullets: bulletsOf(['Identity, campaign and product design language across 3 markets']) },
          ],
        }),
      ],
    }),
});
