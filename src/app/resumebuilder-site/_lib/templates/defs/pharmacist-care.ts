import { defineTemplate } from '../define';
import { makeSample, extraSection } from '../sample-helpers';

export default defineTemplate({
  id: 'pharmacist-care',
  name: 'Pharmacy Care',
  profession: 'Pharmacist',
  category: 'Healthcare',
  atsSafe: true,
  columns: 1,
  supportsPhoto: false,
  layout: 'single',
  header: 'band',
  heading: 'plain-caps',
  fontPair: 'source-inter',
  tokens: { accent: '#0f766e', palettes: ['#0f766e', '#0369a1', '#166534', '#334155'] },
  sectionOrder: ['summary', 'certifications', 'experience', 'education', 'skills'],
  why: 'Pharmacy employers check registration and dispensing accuracy before anything else. This layout leads with credentials and quantifies dispensing volume and error-checking practice in plain, parseable text.',
  sample: () =>
    makeSample({
      templateId: 'pharmacist-care',
      name: 'Daniel Osei',
      headline: 'Community Pharmacist',
      email: 'daniel.osei@example.com',
      phone: '+233 20 000 0000',
      location: 'Accra, Ghana',
      summary:
        'Community pharmacist with 5 years in high-volume retail pharmacy. Final-check accuracy focus, strong patient counselling and experience training dispensing technicians.',
      experience: [
        {
          role: 'Pharmacist',
          org: 'Wellcare Pharmacy (fictional)',
          location: 'Accra',
          start: [2021, 1],
          current: true,
          bullets: [
            'Final-check an average of 220 items a day with a personal near-miss rate below 0.1%',
            'Run hypertension and diabetes screening clinics for 30+ patients a week',
            'Train and supervise 4 dispensing technicians',
          ],
        },
        {
          role: 'Pre-registration Pharmacist',
          org: 'Example Teaching Hospital (fictional)',
          location: 'Accra',
          start: [2019, 7],
          end: [2020, 12],
          bullets: ['Rotated through dispensary, wards and aseptic services', 'Completed medicines reconciliation for 15 patients a week'],
        },
      ],
      education: [
        { institution: 'University of Example (fictional)', area: 'Pharmacy', studyType: 'MPharm', start: [2015], end: [2019], score: 'Second Class Upper' },
      ],
      skillGroups: [
        { name: 'Practice', skills: ['Dispensing & final check', 'Patient counselling', 'Medicines reconciliation', 'Controlled drugs governance'] },
        { name: 'Systems', skills: ['Pharmacy dispensing software', 'Stock control', 'EPS workflows'] },
      ],
      extraSections: [
        extraSection('certifications', 'Registration', {
          certifications: [{ id: 'p1', name: 'Pharmacy Council Registration', issuer: 'Pharmacy Council (fictional)', credentialId: 'PC-000000' }],
        }),
      ],
    }),
});
