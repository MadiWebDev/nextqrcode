import { defineTemplate } from '../define';
import { makeSample, extraSection, bulletsOf } from '../sample-helpers';

export default defineTemplate({
  id: 'physician-cv',
  name: 'Physician CV',
  profession: 'Physician',
  category: 'Medical',
  atsSafe: true,
  columns: 1,
  supportsPhoto: false,
  layout: 'single',
  header: 'rule-double',
  heading: 'numbered',
  tokens: { accent: '#334155', headingFont: 'Georgia, "Times New Roman", serif', palettes: ['#334155', '#166534', '#7c2d12'] },
  sectionOrder: ['summary', 'certifications', 'education', 'experience', 'research', 'publications', 'memberships', 'courses'],
  why: 'Medical appointments committees read for licensure first, then training, then scholarship. This long-form CV numbers its sections, leads with registration, and gives publications and research their own full sections.',
  sample: () =>
    makeSample({
      templateId: 'physician-cv',
      name: 'Dr. Leila Haddad',
      headline: 'Consultant Physician — Internal Medicine',
      email: 'leila.haddad@example.com',
      phone: '+971 50 000 0000',
      location: 'Dubai, UAE',
      region: 'gulf',
      summary:
        'Internal medicine consultant with 11 years of practice across acute and ambulatory care. Special interests in diabetes management and clinical teaching; active in undergraduate and residency education.',
      experience: [
        {
          role: 'Consultant, Internal Medicine',
          org: 'Fictional City Hospital',
          location: 'Dubai',
          start: [2019, 5],
          current: true,
          bullets: [
            'Lead a 24-bed acute medical unit with a team of 6 residents',
            'Run the diabetes optimisation clinic, 3 sessions a week, 900 patients a year',
            'Undergraduate teaching lead for final-year medical students',
          ],
        },
        {
          role: 'Specialist Registrar, Internal Medicine',
          org: 'Example University Hospital (fictional)',
          start: [2015, 8],
          end: [2019, 4],
          bullets: [
            'Completed residency rotations in cardiology, respiratory and acute medicine',
            'Introduced a discharge-summary checklist that cut addenda by 40%',
          ],
        },
      ],
      education: [
        { institution: 'Example Medical University (fictional)', area: 'Medicine', studyType: 'MBBS', start: [2007], end: [2013] },
        { institution: 'Example Royal College (fictional)', area: 'Internal Medicine', studyType: 'MRCP-equivalent', start: [2014], end: [2017] },
      ],
      skillGroups: [
        { name: 'Clinical', skills: ['Acute medicine', 'Diabetes care', 'ECG interpretation', 'Point-of-care ultrasound'] },
        { name: 'Academic', skills: ['Clinical teaching', 'OSCE examining', 'Audit & quality improvement'] },
      ],
      extraSections: [
        extraSection('certifications', 'Licence & Registration', {
          certifications: [
            { id: 'c1', name: 'Medical Licence — Consultant, Internal Medicine', issuer: 'Example Health Authority (fictional)', credentialId: 'REG-000000' },
          ],
        }),
        extraSection('publications', 'Publications', {
          publications: [
            { id: 'p1', title: 'Structured discharge summaries and readmission: a service evaluation', publisher: 'Journal of Example Medicine (fictional)', date: { y: 2022 } },
            { id: 'p2', title: 'A diabetes optimisation clinic model for busy acute units', publisher: 'Example Clinical Review (fictional)', date: { y: 2024 } },
          ],
        }),
        extraSection('research', 'Research', {
          entries: [
            { id: 'r1', title: 'Co-investigator — inpatient glycaemic control audit', organization: 'Fictional City Hospital', bullets: bulletsOf(['Multi-cycle audit across 4 wards, 2021–2023']) },
          ],
        }),
      ],
    }),
});
