import { defineTemplate } from '../define';
import { makeSample, extraSection, bulletsOf } from '../sample-helpers';

export default defineTemplate({
  id: 'architect-design',
  name: 'Architect Portfolio',
  profession: 'Architect',
  category: 'Design',
  atsSafe: false,
  columns: 2,
  supportsPhoto: true,
  layout: 'sidebar-right',
  header: 'split',
  heading: 'plain-caps',
  fontPair: 'lora-plex',
  tokens: { accent: '#44403c', palettes: ['#44403c', '#9a3412', '#1d4ed8', '#166534'] },
  sideSections: ['skills', 'certifications', 'languages'],
  sectionOrder: ['summary', 'projects', 'experience', 'education', 'skills'],
  why: 'Architecture practices hire on built work and stage experience. Projects lead the main column with typology and RIBA-stage detail, while software and registration sit in a precise sidebar.',
  sample: () =>
    makeSample({
      templateId: 'architect-design',
      name: 'Jonas Weber',
      headline: 'Architect — Residential & Cultural',
      email: 'jonas.weber@example.com',
      phone: '+49 30 0000000',
      location: 'Berlin, Germany',
      summary:
        'Architect with 9 years from concept to site on residential and cultural projects. Strong on timber construction and planning negotiation; leads design teams of 3–5.',
      experience: [
        {
          role: 'Project Architect',
          org: 'Studio Nord Beispiel (fictional)',
          location: 'Berlin',
          start: [2020, 5],
          current: true,
          bullets: [
            'Lead architect for a 24-unit timber housing scheme, now on site',
            'Took 3 projects through planning approval with no refusals',
            'Coordinate structures, MEP and landscape consultants in weekly design reviews',
          ],
        },
        {
          role: 'Architectural Assistant → Architect',
          org: 'Example Architects (fictional)',
          location: 'Hamburg',
          start: [2016, 8],
          end: [2020, 4],
          bullets: ['Produced planning and tender packages for education projects', 'Ran the office BIM template used across 4 teams'],
        },
      ],
      education: [
        { institution: 'University of Example (fictional)', area: 'Architecture', studyType: 'MArch', start: [2011], end: [2016], score: 'With Merit' },
      ],
      skillGroups: [
        { name: 'Design', skills: ['Concept design', 'Planning submissions', 'Detailing', 'Timber construction'] },
        { name: 'Software', skills: ['Revit', 'ArchiCAD', 'Rhino', 'Adobe Suite'] },
      ],
      extraSections: [
        extraSection('projects', 'Selected Projects', {
          entries: [
            { id: 'ar1', title: 'Timber Housing, District North (fictional)', organization: 'Studio Nord Beispiel', bullets: bulletsOf(['24 units, mass-timber frame, on site 2025–2026']) },
          ],
        }),
        extraSection('certifications', 'Registration', {
          certifications: [{ id: 'ac1', name: 'Registered Architect', issuer: 'Chamber of Architects (fictional)', credentialId: 'AR-00000' }],
        }),
      ],
    }),
});
