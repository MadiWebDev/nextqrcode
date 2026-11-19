import { defineTemplate } from '../define';
import { makeSample, extraSection } from '../sample-helpers';

export default defineTemplate({
  id: 'dentist-clinical',
  name: 'Dental Practice',
  profession: 'Dentist',
  category: 'Healthcare',
  atsSafe: false,
  columns: 2,
  supportsPhoto: true,
  layout: 'two-column',
  header: 'photo-left',
  heading: 'boxed',
  fontPair: 'playfair-worksans',
  tokens: { accent: '#155e75', palettes: ['#155e75', '#0f766e', '#7c2d12', '#334155'] },
  sideSections: ['skills', 'certifications', 'languages'],
  sectionOrder: ['summary', 'experience', 'education', 'certifications', 'skills'],
  why: 'Private dental practices hire on trust: registration, procedure mix and patient manner. A photo-forward two-column design presents credentials beside a calm clinical summary.',
  sample: () =>
    makeSample({
      templateId: 'dentist-clinical',
      name: 'Sara Lindqvist',
      headline: 'General Dentist — Restorative & Family Care',
      email: 'sara.lindqvist@example.com',
      phone: '+46 70 000 0000',
      location: 'Gothenburg, Sweden',
      summary:
        'General dentist with 9 years in family practice. Gentle, explanation-first approach with a loyal patient base; special interest in restorative work and anxious patients.',
      experience: [
        {
          role: 'Associate Dentist',
          org: 'Harbour Dental Practice (fictional)',
          location: 'Gothenburg',
          start: [2019, 2],
          current: true,
          bullets: [
            'Provide restorative, prosthetic and preventive care to a list of 1,400 patients',
            'Built the practice anxious-patient pathway; rebooking rate for nervous patients up 30%',
            'Mentor 1 dental hygienist and supervise radiography quality audits',
          ],
        },
        {
          role: 'Dentist',
          org: 'Example Public Dental Service (fictional)',
          location: 'Borås',
          start: [2016, 8],
          end: [2019, 1],
          bullets: ['Ran school screening sessions for 2,000 children a year', 'Completed 300+ endodontic treatments with documented outcomes'],
        },
      ],
      education: [
        { institution: 'University of Example (fictional)', area: 'Dentistry', studyType: 'MSc Dentistry', start: [2011], end: [2016], score: 'With Distinction' },
      ],
      skillGroups: [
        { name: 'Procedures', skills: ['Restorative dentistry', 'Endodontics', 'Crowns & bridges', 'Paediatric dentistry', 'Extractions'] },
        { name: 'Practice', skills: ['Treatment planning', 'Digital radiography', 'Infection control lead'] },
      ],
      extraSections: [
        extraSection('certifications', 'Registration', {
          certifications: [{ id: 'd1', name: 'Dental Council Registration', issuer: 'National Dental Board (fictional)', credentialId: 'DC-000000' }],
        }),
      ],
    }),
});
