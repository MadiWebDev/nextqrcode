import { defineTemplate } from '../define';
import { makeSample, extraSection } from '../sample-helpers';

export default defineTemplate({
  id: 'electrical-engineer',
  name: 'Power & Controls',
  profession: 'Electrical Engineer',
  category: 'Engineering',
  atsSafe: true,
  columns: 1,
  supportsPhoto: false,
  layout: 'single',
  header: 'split',
  heading: 'numbered',
  fontPair: 'lora-plex',
  tokens: { accent: '#b45309', palettes: ['#b45309', '#1d4ed8', '#334155', '#0f766e'] },
  sectionOrder: ['summary', 'experience', 'education', 'skills', 'certifications'],
  why: 'Electrical hiring managers search for voltage levels, PLC platforms and standards by name. A strict single column with named skill groups makes every keyword findable by both software and engineers.',
  sample: () =>
    makeSample({
      templateId: 'electrical-engineer',
      name: 'Priya Nair',
      headline: 'Electrical Engineer — Industrial Power',
      email: 'priya.nair@example.com',
      phone: '+91 90000 00000',
      location: 'Pune, India',
      summary:
        'Electrical engineer with 6 years in industrial power distribution and plant maintenance. Designs to IEC standards, leads shutdown work and has cut unplanned downtime on two production lines.',
      experience: [
        {
          role: 'Senior Electrical Engineer',
          org: 'NovaSteel Manufacturing (fictional)',
          location: 'Pune',
          start: [2020, 8],
          current: true,
          bullets: [
            'Own the 11 kV / 415 V distribution network for a plant of 900 staff',
            'Led a motor-control upgrade that reduced unplanned downtime by 22% year on year',
            'Plan and supervise annual shutdown maintenance with a team of 6 technicians',
          ],
        },
        {
          role: 'Electrical Engineer',
          org: 'Example Power Services (fictional)',
          location: 'Mumbai',
          start: [2018, 5],
          end: [2020, 7],
          bullets: ['Tested and commissioned LV switchgear and protection relays on 9 client sites', 'Produced single-line diagrams and cable schedules in AutoCAD Electrical'],
        },
      ],
      education: [
        { institution: 'Institute of Example Technology (fictional)', area: 'Electrical Engineering', studyType: 'BTech', start: [2014], end: [2018], score: '8.9 CGPA' },
      ],
      skillGroups: [
        { name: 'Power', skills: ['11 kV distribution', 'Protection relays', 'Load flow studies (ETAP)', 'Earthing & lightning protection'] },
        { name: 'Controls', skills: ['PLC (Siemens S7)', 'VFD commissioning', 'SCADA basics', 'AutoCAD Electrical'] },
      ],
      extraSections: [
        extraSection('certifications', 'Certifications', {
          certifications: [{ id: 'e1', name: 'Certified Energy Auditor', issuer: 'Example Energy Bureau (fictional)' }],
        }),
      ],
    }),
});
