import { defineTemplate } from '../define';
import { makeSample, extraSection } from '../sample-helpers';

export default defineTemplate({
  id: 'construction-supervisor',
  name: 'Site Supervisor',
  profession: 'Construction Supervisor',
  category: 'Skilled trades',
  atsSafe: false,
  columns: 2,
  supportsPhoto: true,
  layout: 'sidebar-left',
  header: 'photo-left',
  heading: 'band-chip',
  fontPair: 'grotesk-inter',
  tokens: { accent: '#c2410c', palettes: ['#c2410c', '#334155', '#166534', '#1d4ed8'] },
  sideSections: ['skills', 'certifications'],
  sectionOrder: ['summary', 'experience', 'projects', 'education', 'skills', 'certifications'],
  why: 'Site leadership is judged on safety record, crew size and project value. The photo sidebar carries tickets and plant licences while the main column proves delivery on real schemes.',
  sample: () =>
    makeSample({
      templateId: 'construction-supervisor',
      name: 'Brian O\u2019Connell',
      headline: 'Construction Site Supervisor',
      email: 'brian.oconnell@example.com',
      phone: '+353 87 000 0000',
      location: 'Cork, Ireland',
      summary:
        'Site supervisor with 12 years on residential and commercial builds. Zero lost-time injuries across the last 4 projects; runs tidy, well-documented sites that hand over on programme.',
      experience: [
        {
          role: 'Site Supervisor',
          org: 'Granite Build Ltd (fictional)',
          location: 'Cork',
          start: [2020, 6],
          current: true,
          bullets: [
            'Supervise 35–50 operatives and 6 subcontractors on a 120-unit housing scheme (€38m, fictional)',
            'Chair daily briefings and weekly safety walks; 640 days without a lost-time injury',
            'Coordinate inspections and snagging to a 98% first-pass handover rate',
          ],
        },
        {
          role: 'Foreman',
          org: 'Example Construction (fictional)',
          location: 'Limerick',
          start: [2016, 3],
          end: [2020, 5],
          bullets: ['Ran groundworks and frame packages for a team of 18', 'Kept daily records, permits and delivery schedules audit-ready'],
        },
      ],
      education: [
        { institution: 'Example Institute of Technology (fictional)', area: 'Construction Management', studyType: 'Higher Certificate', start: [2013], end: [2015], score: 'Completed' },
      ],
      skillGroups: [
        { name: 'Site', skills: ['Site supervision', 'Health & safety management', 'Programme tracking', 'Quality inspections', 'Subcontractor coordination'] },
        { name: 'Plant & tickets', skills: ['Telehandler licence', 'MEWP', 'First aid at work', 'Temporary works awareness'] },
      ],
      extraSections: [
        extraSection('certifications', 'Certifications', {
          certifications: [{ id: 'cs1', name: 'Site Management Safety Certificate', issuer: 'Example Safety Board (fictional)' }],
        }),
      ],
    }),
});
