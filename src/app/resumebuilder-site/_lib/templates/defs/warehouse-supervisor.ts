import { defineTemplate } from '../define';
import { makeSample, extraSection } from '../sample-helpers';

export default defineTemplate({
  id: 'warehouse-supervisor',
  name: 'Warehouse Lead',
  profession: 'Warehouse Supervisor',
  category: 'Logistics',
  atsSafe: false,
  columns: 2,
  supportsPhoto: true,
  layout: 'sidebar-right',
  header: 'left',
  heading: 'overline',
  fontPair: 'grotesk-inter',
  tokens: { accent: '#57534e', palettes: ['#57534e', '#065f46', '#1d4ed8', '#b91c1c'] },
  sideSections: ['skills', 'certifications'],
  sectionOrder: ['summary', 'experience', 'education', 'skills', 'certifications'],
  why: 'Warehouse leadership is throughput, accuracy and shift safety. The sidebar collects WMS platforms and MHE licences while the main column quantifies picks, dispatches and team size.',
  sample: () =>
    makeSample({
      templateId: 'warehouse-supervisor',
      name: 'Tunde Balogun',
      headline: 'Warehouse Supervisor — Nights',
      email: 'tunde.balogun@example.com',
      phone: '+234 800 000 0000',
      location: 'Lagos, Nigeria',
      summary:
        'Warehouse supervisor with 7 years in FMCG distribution. Runs a night shift of 22 pickers and loaders dispatching 1,400 cases a night at 99.6% accuracy.',
      experience: [
        {
          role: 'Warehouse Supervisor',
          org: 'SwiftMart Distribution (fictional)',
          location: 'Lagos',
          start: [2020, 8],
          current: true,
          bullets: [
            'Supervise 22 staff across picking, packing and loading for 40 outbound vehicles a night',
            'Raised pick accuracy from 98.1% to 99.6% with a scan-check station',
            'Cut loading time per vehicle from 55 to 38 minutes by re-sequencing bays',
          ],
        },
        {
          role: 'Warehouse Team Leader',
          org: 'Example 3PL (fictional)',
          location: 'Lagos',
          start: [2017, 5],
          end: [2020, 7],
          bullets: ['Led a team of 8 on goods-in and putaway', 'Ran monthly stock counts with variance below 0.3%'],
        },
      ],
      education: [
        { institution: 'Example Polytechnic (fictional)', area: 'Supply Chain Management', studyType: 'Diploma', start: [2014], end: [2017], score: 'Upper Credit' },
      ],
      skillGroups: [
        { name: 'Operations', skills: ['Shift management', 'Pick & pack optimisation', 'Stock control', 'Health & safety briefings'] },
        { name: 'Systems & MHE', skills: ['WMS (Manhattan basics)', 'Forklift licence (counterbalance)', 'Reach truck', 'RF scanners'] },
      ],
      extraSections: [
        extraSection('certifications', 'Certifications', {
          certifications: [{ id: 'w1', name: 'Forklift Operator Licence', issuer: 'Example Safety Council (fictional)' }],
        }),
      ],
    }),
});
