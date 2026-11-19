import { defineTemplate } from '../define';
import { makeSample, extraSection } from '../sample-helpers';

export default defineTemplate({
  id: 'auto-mechanic',
  name: 'Auto Mechanic — Tools & Certifications',
  profession: 'Auto Mechanic',
  category: 'Skilled trades',
  atsSafe: true,
  columns: 1,
  supportsPhoto: true,
  layout: 'single',
  header: 'band',
  heading: 'band-chip',
  tokens: { accent: '#b45309', palettes: ['#b45309', '#334155', '#166534', '#991b1b'] },
  sectionOrder: ['summary', 'certifications', 'experience', 'skills', 'education'],
  why: 'Workshops hire on certifications, diagnostic skill and what you can be left alone with. This layout puts licences and certifications directly under the summary, then backs them with workshop-floor evidence.',
  sample: () =>
    makeSample({
      templateId: 'auto-mechanic',
      name: 'Jorge Ramirez',
      headline: 'Auto Mechanic — Diagnostics & Drivetrain',
      email: 'jorge.ramirez@example.com',
      phone: '+1 555 010 7788',
      location: 'Denver, CO',
      summary:
        'Mechanic with 9 years in independent and dealership workshops. Strong on electrical diagnosis and drivetrain work; known for first-time fixes and honest estimates customers come back for.',
      experience: [
        {
          role: 'Senior Mechanic',
          org: 'Fictional AutoWorks',
          location: 'Denver',
          start: [2020, 2],
          current: true,
          bullets: [
            'Diagnose and repair 25–30 vehicles a week across petrol, diesel and hybrid models',
            'First-time fix rate of 94% over the last 12 months',
            'Train 2 apprentices on scan-tool diagnostics and wiring diagrams',
          ],
        },
        {
          role: 'Mechanic',
          org: 'Example Motors Service Centre (fictional)',
          start: [2016, 5],
          end: [2020, 1],
          bullets: [
            'Servicing, brakes, suspension and timing work on a 6-bay workshop floor',
            'Promoted to inspections lead after 18 months',
          ],
        },
      ],
      education: [
        { institution: 'Example Technical College (fictional)', area: 'Automotive Technology', studyType: 'Diploma', start: [2014], end: [2016] },
      ],
      skillGroups: [
        { name: 'Diagnostics', skills: ['OBD scan tools', 'Oscilloscope testing', 'CAN-bus faults', 'Parasitic drain tracing'] },
        { name: 'Repairs', skills: ['Engine rebuilds', 'Automatic gearboxes', 'Hybrid battery service', 'Air conditioning'] },
        { name: 'Tools owned', skills: ['Full hand-tool set', 'Torque wrenches', 'Compression & leak-down testers'] },
      ],
      extraSections: [
        extraSection('certifications', 'Certifications & Licences', {
          certifications: [
            { id: 'c1', name: 'ASE-style Master Technician (example entry)', issuer: 'Example Certification Institute (fictional)', credentialId: 'CERT-000000' },
            { id: 'c2', name: 'Driving Licence — Category B', issuer: 'State DMV (example entry)' },
          ],
        }),
      ],
    }),
});
