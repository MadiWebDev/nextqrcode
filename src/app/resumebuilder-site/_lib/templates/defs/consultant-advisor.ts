import { defineTemplate } from '../define';
import { makeSample, extraSection, bulletsOf } from '../sample-helpers';

export default defineTemplate({
  id: 'consultant-advisor',
  name: 'Independent Consultant',
  profession: 'Consultant',
  category: 'Business',
  atsSafe: false,
  columns: 1,
  supportsPhoto: true,
  layout: 'single',
  header: 'split',
  heading: 'overline',
  fontPair: 'playfair-worksans',
  tokens: { accent: '#713f12', palettes: ['#713f12', '#1e3a5f', '#166534', '#334155'] },
  sectionOrder: ['summary', 'projects', 'experience', 'education', 'skills'],
  why: 'Independent consultants sell engagements, not jobs. Selected engagements lead with client type and outcome, and the employment history follows as credibility — the order buyers of expertise actually read.',
  sample: () =>
    makeSample({
      templateId: 'consultant-advisor',
      name: 'Margaret Chen',
      headline: 'Operations Consultant — Supply Chain',
      email: 'margaret.chen@example.com',
      phone: '+1 416 000 0000',
      location: 'Toronto, Canada',
      summary:
        'Operations consultant with 14 years helping manufacturers cut lead times and inventory. Former plant operations manager; engagements typically pay back inside two quarters.',
      experience: [
        {
          role: 'Operations Manager',
          org: 'Example Manufacturing Group (fictional)',
          location: 'Toronto',
          start: [2012, 3],
          end: [2019, 8],
          bullets: ['Ran operations for a 140-person plant across 3 product lines', 'Led the lean programme that cut lead time from 6 weeks to 12 days'],
        },
      ],
      education: [
        { institution: 'University of Example (fictional)', area: 'Industrial Engineering', studyType: 'BASc', start: [2004], end: [2008], score: 'Honours' },
      ],
      skillGroups: [
        { name: 'Expertise', skills: ['Supply chain diagnostics', 'Lean operations', 'Inventory optimisation', 'Change management'] },
        { name: 'Engagement', skills: ['Executive workshops', 'Board reporting', 'Interim leadership'] },
      ],
      extraSections: [
        extraSection('projects', 'Selected Engagements', {
          entries: [
            { id: 'ca1', title: 'Lead-Time Recovery — Food Manufacturer', organization: 'Confidential client (fictional)', bullets: bulletsOf(['Cut order lead time 40% in 5 months; engagement paid back in 11 weeks']) },
            { id: 'ca2', title: 'Inventory Reduction — Electronics Assembler', organization: 'Confidential client (fictional)', bullets: bulletsOf(['Released CAD 1.8m (fictional) of working capital without service-level loss']) },
          ],
        }),
      ],
    }),
});
