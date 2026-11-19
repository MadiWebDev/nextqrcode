import { defineTemplate } from '../define';
import { makeSample, extraSection } from '../sample-helpers';

export default defineTemplate({
  id: 'nurse-clinical',
  name: 'Clinical Care',
  profession: 'Nurse',
  category: 'Healthcare',
  atsSafe: true,
  columns: 1,
  supportsPhoto: false,
  layout: 'single',
  header: 'centered',
  heading: 'rule-under',
  fontPair: 'source-inter',
  tokens: { accent: '#0369a1', palettes: ['#0369a1', '#0f766e', '#7c2d12', '#334155'] },
  sectionOrder: ['summary', 'certifications', 'experience', 'education', 'skills'],
  why: 'Hospital recruiters and their systems look for registration, ward specialisms and shift-ready clinical skills in a strict order. Licences sit directly under the summary so a shortlisting nurse manager can verify them in seconds.',
  sample: () =>
    makeSample({
      templateId: 'nurse-clinical',
      name: 'Fatima Noor',
      headline: 'Registered Nurse — Medical Ward',
      email: 'fatima.noor@example.com',
      phone: '+92 321 0000000',
      location: 'Lahore, Pakistan',
      summary:
        'Registered nurse with 6 years on acute medical wards. Calm under pressure, precise with medication rounds and known for clear handover notes that night teams rely on.',
      experience: [
        {
          role: 'Staff Nurse, Medical Ward',
          org: 'City General Hospital (fictional)',
          location: 'Lahore',
          start: [2020, 3],
          current: true,
          bullets: [
            'Care for a bay of 8–10 acute patients per shift, including IV therapy, wound care and discharge planning',
            'Reduced medication-round interruptions by introducing a do-not-disturb tabard system adopted across 3 wards',
            'Precept 2 student nurses per rotation',
          ],
        },
        {
          role: 'Staff Nurse, Surgical Ward',
          org: 'St Mary Example Hospital (fictional)',
          location: 'Lahore',
          start: [2018, 6],
          end: [2020, 2],
          bullets: [
            'Provided post-operative care for up to 12 patients, monitoring vitals and escalating concerns early',
            'Completed pre-operative checklists with zero omissions across 14 months of audits',
          ],
        },
      ],
      education: [
        { institution: 'Example School of Nursing (fictional)', area: 'General Nursing', studyType: 'BS Nursing', start: [2014], end: [2018], score: 'Registered Nurse (RN)' },
      ],
      skillGroups: [
        { name: 'Clinical', skills: ['IV cannulation & therapy', 'Wound care', 'Catheterisation', 'ECG monitoring', 'Infection control'] },
        { name: 'Ward practice', skills: ['Medication administration', 'Care planning', 'Handover (SBAR)', 'Discharge planning'] },
      ],
      extraSections: [
        extraSection('certifications', 'Registration & Certifications', {
          certifications: [
            { id: 'n1', name: 'Nursing Council Registration', issuer: 'National Nursing Council (fictional)', credentialId: 'RN-000000' },
            { id: 'n2', name: 'Basic Life Support (BLS)', issuer: 'Example Resuscitation Council (fictional)' },
          ],
        }),
      ],
    }),
});
