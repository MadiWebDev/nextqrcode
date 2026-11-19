import { defineTemplate } from '../define';
import { makeSample, extraSection, bulletsOf } from '../sample-helpers';

export default defineTemplate({
  id: 'civil-engineer',
  name: 'Site & Structures',
  profession: 'Civil Engineer',
  category: 'Engineering',
  atsSafe: false,
  columns: 2,
  supportsPhoto: true,
  layout: 'sidebar-left',
  header: 'left',
  heading: 'side-tab',
  fontPair: 'lora-plex',
  tokens: { accent: '#9a3412', palettes: ['#9a3412', '#334155', '#166534', '#1d4ed8'] },
  sideSections: ['skills', 'certifications', 'languages'],
  sectionOrder: ['summary', 'experience', 'projects', 'education', 'skills', 'certifications'],
  why: 'Civil roles are won on project scale: budgets, spans and ground conditions. The sidebar keeps software, codes and site certifications visible while the main column gives projects the room their numbers deserve.',
  sample: () =>
    makeSample({
      templateId: 'civil-engineer',
      name: 'Ahmed Raza',
      headline: 'Civil Engineer — Roads & Drainage',
      email: 'ahmed.raza@example.com',
      phone: '+92 333 0000000',
      location: 'Islamabad, Pakistan',
      summary:
        'Civil engineer with 8 years delivering road and drainage schemes from feasibility to handover. Strong on quantities, contractor supervision and keeping works safe and on programme.',
      experience: [
        {
          role: 'Senior Site Engineer',
          org: 'BuildRight Contracting (fictional)',
          location: 'Islamabad',
          start: [2021, 4],
          current: true,
          bullets: [
            'Deliver a 14 km urban road upgrade (PKR 2.1bn fictional value) with drainage, footways and signals',
            'Supervise 3 subcontractors and a site team of 18; programme currently 3 weeks ahead',
            'Verify quantities for interim certificates totalling PKR 640m to date',
          ],
        },
        {
          role: 'Site Engineer',
          org: 'Example Infrastructure Group (fictional)',
          location: 'Rawalpindi',
          start: [2017, 2],
          end: [2021, 3],
          bullets: ['Set out and supervised 6 reinforced-concrete culverts and 2 retaining walls', 'Maintained site diaries, QA checklists and as-built records for audit'],
        },
      ],
      education: [
        { institution: 'University of Example (fictional)', area: 'Civil Engineering', studyType: 'BSc (Hons)', start: [2012], end: [2016], score: 'First Class' },
      ],
      skillGroups: [
        { name: 'Software', skills: ['AutoCAD Civil 3D', 'MS Project', 'Primavera P6 (basic)', 'Excel (quantities)'] },
        { name: 'Site', skills: ['Setting out (total station)', 'Quantity surveying', 'QA/QC documentation', 'Site safety supervision'] },
      ],
      extraSections: [
        extraSection('projects', 'Selected Projects', {
          entries: [
            { id: 'cp1', title: 'Urban Road Upgrade — Phase 2', organization: 'BuildRight Contracting (fictional)', bullets: bulletsOf(['14 km dual carriageway, 2 signalised junctions, storm drainage throughout']) },
          ],
        }),
        extraSection('certifications', 'Certifications', {
          certifications: [{ id: 'cc1', name: 'Professional Engineer (PE)', issuer: 'Engineering Council (fictional)', credentialId: 'PE-000000' }],
        }),
      ],
    }),
});
