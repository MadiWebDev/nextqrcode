import { defineTemplate } from '../define';
import { makeSample } from '../sample-helpers';

export default defineTemplate({
  id: 'timeline-general',
  name: 'Timeline',
  profession: 'General',
  category: 'General',
  atsSafe: false,
  columns: 1,
  supportsPhoto: true,
  layout: 'timeline',
  header: 'split',
  heading: 'dot-leader',
  tokens: { accent: '#0e7490', palettes: ['#0e7490', '#7c3aed', '#166534', '#b45309'] },
  sectionOrder: ['summary', 'experience', 'education', 'projects', 'skills'],
  why: 'A visible timeline suits careers with a clear story — promotions inside one employer, a trade progressing through grades, or a return after a break. Dates sit on a rail so the eye reads the journey first.',
  sample: () =>
    makeSample({
      templateId: 'timeline-general',
      name: 'Peter Novak',
      headline: 'Warehouse Team Leader',
      email: 'peter.novak@example.com',
      phone: '+420 600 000 000',
      location: 'Brno, Czechia',
      region: 'eu',
      summary:
        'Warehouse professional with 10 years across goods-in, picking and dispatch, promoted three times within one employer. Team leader for a shift of 14 with a clean safety record.',
      experience: [
        {
          role: 'Warehouse Team Leader',
          org: 'Fictional Logistics s.r.o.',
          location: 'Brno',
          start: [2021, 4],
          current: true,
          bullets: [
            'Lead a shift of 14 across picking and dispatch, 1,900 orders a day',
            'Zero lost-time injuries in 3 years on my shift',
            'Introduced a pick-face layout change that cut walking distance by 18%',
          ],
        },
        {
          role: 'Senior Warehouse Operative',
          org: 'Fictional Logistics s.r.o.',
          start: [2018, 2],
          end: [2021, 3],
          bullets: ['Trained 20+ new starters on WMS and safe manual handling'],
        },
        {
          role: 'Warehouse Operative',
          org: 'Fictional Logistics s.r.o.',
          start: [2015, 9],
          end: [2018, 1],
          bullets: ['Goods-in checking, put-away and stock counts'],
        },
      ],
      education: [
        { institution: 'Example Secondary Technical School (fictional)', area: 'Logistics', studyType: 'Certificate', start: [2011], end: [2015] },
      ],
      skillGroups: [
        { name: 'Operations', skills: ['WMS (example system)', 'Forklift — counterbalance & reach', 'Stock control', 'Shift planning'] },
        { name: 'Safety', skills: ['Manual handling trainer', 'First aider', 'Fire marshal'] },
      ],
    }),
});
