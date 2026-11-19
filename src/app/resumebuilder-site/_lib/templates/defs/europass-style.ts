import { defineTemplate } from '../define';
import { makeSample, extraSection } from '../sample-helpers';

export default defineTemplate({
  id: 'europass-style',
  name: 'Europass-Style (Original Design)',
  profession: 'General — EU',
  category: 'General',
  atsSafe: false,
  columns: 2,
  supportsPhoto: true,
  layout: 'label-column',
  header: 'left',
  heading: 'side-tab',
  sideSections: ['skills', 'languages'],
  tokens: { accent: '#003399', palettes: ['#003399', '#334155', '#166534'] },
  sectionOrder: ['summary', 'experience', 'education', 'languages', 'skills', 'certifications'],
  why: 'Many EU employers are used to the public Europass conventions: labelled sections, a language grid and a structured personal profile. This is an original design following those conventions — it uses no official Europass marks or assets.',
  sample: () =>
    makeSample({
      templateId: 'europass-style',
      name: 'Giulia Romano',
      headline: 'Hotel Receptionist — Front Office',
      email: 'giulia.romano@example.com',
      phone: '+39 333 000 0000',
      location: 'Bologna, Italy',
      region: 'eu',
      summary:
        'Front-office receptionist with 6 years in mid-size city hotels. Handles check-in, billing and guest requests in Italian, English and German; calm under pressure at full occupancy.',
      experience: [
        {
          role: 'Front Office Receptionist',
          org: 'Fictional Hotel Aurora',
          location: 'Bologna',
          start: [2021, 3],
          current: true,
          bullets: [
            'Check in 60–90 guests a day at a 120-room property',
            'Handle billing, night-audit support and OTA extranet updates',
            'Guest-satisfaction mentions by name: 30+ in the last year',
          ],
        },
        {
          role: 'Reception Assistant',
          org: 'Example Residence Hotel (fictional)',
          start: [2019, 6],
          end: [2021, 2],
          bullets: ['Reservations, switchboard and concierge requests'],
        },
      ],
      education: [
        { institution: 'Example Tourism Institute (fictional)', area: 'Hospitality & Tourism', studyType: 'Diploma', start: [2016], end: [2019] },
      ],
      skillGroups: [
        { name: 'Front office', skills: ['PMS (example system)', 'Night audit', 'OTA extranets', 'Cash & card billing'] },
        { name: 'Digital', skills: ['Office suite', 'Email & messaging etiquette', 'Basic revenue reports'] },
      ],
      extraSections: [
        extraSection('languages', 'Languages', {
          languages: [
            { id: 'l1', language: 'Italian', fluency: 'Native' },
            { id: 'l2', language: 'English', fluency: 'C1 — Advanced' },
            { id: 'l3', language: 'German', fluency: 'B1 — Intermediate' },
          ],
        }),
      ],
    }),
});
