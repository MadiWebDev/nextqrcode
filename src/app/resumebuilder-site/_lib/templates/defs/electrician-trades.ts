import { defineTemplate } from '../define';
import { makeSample, extraSection } from '../sample-helpers';

export default defineTemplate({
  id: 'electrician-trades',
  name: 'Licensed Electrician',
  profession: 'Electrician',
  category: 'Skilled trades',
  atsSafe: true,
  columns: 1,
  supportsPhoto: false,
  layout: 'single',
  header: 'band',
  heading: 'dot-leader',
  fontPair: 'grotesk-inter',
  tokens: { accent: '#a16207', palettes: ['#a16207', '#334155', '#b91c1c', '#166534'] },
  sectionOrder: ['summary', 'certifications', 'experience', 'skills', 'education'],
  why: 'Electrical contractors verify licence and ticket dates before reading anything else. Certifications sit high, and the single column keeps fault-finding and installation keywords machine-readable.',
  sample: () =>
    makeSample({
      templateId: 'electrician-trades',
      name: 'Tomás Silva',
      headline: 'Licensed Electrician — Commercial & Domestic',
      email: 'tomas.silva@example.com',
      phone: '+351 910 000 000',
      location: 'Porto, Portugal',
      summary:
        'Licensed electrician with 9 years across commercial fit-outs and domestic work. Fault-finding specialist; first-time fix rate of 94% on service calls.',
      experience: [
        {
          role: 'Electrician',
          org: 'VoltWorks Contracting (fictional)',
          location: 'Porto',
          start: [2020, 2],
          current: true,
          bullets: [
            'Install and certify distribution boards, lighting and power in commercial fit-outs up to 3,000 m²',
            'Run a service van covering 25–30 fault calls a week',
            'Test and inspect rental properties, issuing condition reports same-day',
          ],
        },
        {
          role: 'Electrician\u2019s Mate / Apprentice',
          org: 'Example Electrical Services (fictional)',
          location: 'Porto',
          start: [2016, 9],
          end: [2020, 1],
          bullets: ['Completed apprenticeship across domestic rewires and new builds', 'First-fix containment and cable pulling for teams of 4'],
        },
      ],
      education: [
        { institution: 'Example Training Centre (fictional)', area: 'Electrical Installation', studyType: 'Vocational Diploma', start: [2014], end: [2016], score: 'Completed' },
      ],
      skillGroups: [
        { name: 'Work', skills: ['Fault finding', 'Consumer unit replacement', 'EICR testing', 'Three-phase systems', 'EV charger installation'] },
        { name: 'Compliance', skills: ['Wiring regulations (current edition)', 'Safe isolation', 'Certification paperwork'] },
      ],
      extraSections: [
        extraSection('certifications', 'Licences & Tickets', {
          certifications: [
            { id: 'el1', name: 'Licensed Electrician', issuer: 'National Energy Authority (fictional)', credentialId: 'EL-00000' },
            { id: 'el2', name: 'Inspection & Testing Certificate', issuer: 'Example Awards Body (fictional)' },
          ],
        }),
      ],
    }),
});
