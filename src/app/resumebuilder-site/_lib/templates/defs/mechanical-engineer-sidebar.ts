import { defineTemplate } from '../define';
import { makeSample, extraSection } from '../sample-helpers';

export default defineTemplate({
  id: 'mechanical-engineer-sidebar',
  name: 'Mechanical Engineer — Technical Sidebar',
  profession: 'Mechanical Engineer',
  category: 'Engineering',
  atsSafe: false,
  columns: 2,
  supportsPhoto: true,
  layout: 'sidebar-left',
  header: 'photo-left',
  heading: 'side-tab',
  sideSections: ['skills', 'certifications', 'languages'],
  tokens: { accent: '#9a3412', palettes: ['#9a3412', '#334155', '#166534', '#1e40af'] },
  sectionOrder: ['summary', 'experience', 'projects', 'education', 'skills', 'certifications'],
  why: 'Plant and manufacturing reviewers look for tools, standards and machine experience at a glance. The sidebar keeps CAD/CAE tools and certifications visible on every page while the main column carries project evidence.',
  sample: () =>
    makeSample({
      templateId: 'mechanical-engineer-sidebar',
      name: 'Tomasz Nowak',
      headline: 'Mechanical Design Engineer',
      email: 'tomasz.nowak@example.com',
      phone: '+48 600 000 000',
      location: 'Poznan, Poland',
      region: 'eu',
      summary:
        'Mechanical design engineer with 8 years in industrial machinery. Designs welded and machined assemblies from concept to released drawings, with a record of cutting part counts and assembly time.',
      experience: [
        {
          role: 'Senior Mechanical Design Engineer',
          org: 'Fictional Machine Works',
          location: 'Poznan',
          start: [2020, 4],
          current: true,
          bullets: [
            'Redesigned a conveyor drive assembly, reducing part count from 64 to 41 and assembly time by 30%',
            'Own tolerance analysis and drawing release for 3 product lines',
            'Led DFMEA reviews with manufacturing and quality teams',
          ],
        },
        {
          role: 'Mechanical Engineer',
          org: 'Example Industrial Group (fictional)',
          start: [2017, 7],
          end: [2020, 3],
          bullets: [
            'Produced fabrication drawings for pressure-rated pipe supports',
            'Ran FEA on lifting frames to EN 1993 with a 2.0 safety factor',
          ],
        },
      ],
      education: [
        { institution: 'Example Polytechnic (fictional)', area: 'Mechanical Engineering', studyType: 'MEng', start: [2012], end: [2017] },
      ],
      skillGroups: [
        { name: 'CAD/CAE', skills: ['SolidWorks', 'Inventor', 'ANSYS Mechanical', 'GD&T'] },
        { name: 'Standards', skills: ['EN 1993', 'ISO 9001', 'Machinery Directive 2006/42/EC'] },
        { name: 'Workshop', skills: ['CNC milling (3-axis)', 'TIG welding', 'CMM inspection'] },
      ],
      extraSections: [
        extraSection('certifications', 'Certifications & Licences', {
          certifications: [
            { id: 'c1', name: 'CSWP — Certified SolidWorks Professional', issuer: 'Dassault Systemes (example entry)', credentialId: 'C-000000' },
          ],
        }),
      ],
    }),
});
