import { defineTemplate } from '../define';
import { makeSample, extraSection } from '../sample-helpers';

export default defineTemplate({
  id: 'hr-professional',
  name: 'People Partner',
  profession: 'HR Professional',
  category: 'Business',
  atsSafe: false,
  columns: 2,
  supportsPhoto: true,
  layout: 'two-column',
  header: 'left',
  heading: 'side-tab',
  fontPair: 'playfair-worksans',
  tokens: { accent: '#86198f', palettes: ['#86198f', '#0f766e', '#1d4ed8', '#334155'] },
  sideSections: ['skills', 'certifications', 'languages'],
  sectionOrder: ['summary', 'experience', 'education', 'certifications', 'skills'],
  why: 'HR leaders hire HR people on breadth: hiring volume, employee relations, policy and systems. The sidebar organises specialisms and credentials while the main column carries outcomes like time-to-hire and retention.',
  sample: () =>
    makeSample({
      templateId: 'hr-professional',
      name: 'Hannah Kim',
      headline: 'HR Business Partner',
      email: 'hannah.kim@example.com',
      phone: '+82 10 0000 0000',
      location: 'Seoul, South Korea',
      summary:
        'HR business partner with 8 years supporting product and operations teams of up to 600 staff. Trusted on sensitive employee-relations work; data-led on hiring and retention.',
      experience: [
        {
          role: 'HR Business Partner',
          org: 'Brightline Technologies (fictional)',
          location: 'Seoul',
          start: [2020, 4],
          current: true,
          bullets: [
            'Partner with 4 department heads on workforce planning for 320 staff',
            'Cut time-to-hire from 52 to 34 days by rebuilding interview scorecards',
            'Led a restructuring consultation for 45 roles with zero tribunal claims',
          ],
        },
        {
          role: 'HR Officer',
          org: 'Example Logistics Group (fictional)',
          location: 'Incheon',
          start: [2017, 1],
          end: [2020, 3],
          bullets: ['Ran end-to-end recruitment for 120 hires a year', 'Introduced structured onboarding, lifting 90-day retention by 9 points'],
        },
      ],
      education: [
        { institution: 'University of Example (fictional)', area: 'Psychology', studyType: 'BA', start: [2012], end: [2016], score: 'First Class' },
      ],
      skillGroups: [
        { name: 'HR practice', skills: ['Employee relations', 'Recruitment', 'Performance cycles', 'Policy writing', 'Compensation bands'] },
        { name: 'Systems', skills: ['HRIS (Workday)', 'ATS (Greenhouse)', 'People analytics (Excel/Tableau)'] },
      ],
      extraSections: [
        extraSection('certifications', 'Certifications', {
          certifications: [{ id: 'h1', name: 'SHRM-CP', issuer: 'Example HR Institute (fictional)' }],
        }),
      ],
    }),
});
