import { defineTemplate } from '../define';
import { makeSample, extraSection } from '../sample-helpers';

export default defineTemplate({
  id: 'lawyer-legal',
  name: 'Legal Counsel',
  profession: 'Lawyer',
  category: 'Legal',
  atsSafe: true,
  columns: 1,
  supportsPhoto: false,
  layout: 'single',
  header: 'centered',
  heading: 'band-chip',
  fontPair: 'georgia-arial',
  tokens: { accent: '#292524', palettes: ['#292524', '#1e3a5f', '#7c2d12', '#334155'] },
  sectionOrder: ['summary', 'experience', 'education', 'certifications', 'skills'],
  why: 'Law firms and chambers read for admissions, practice areas and matter experience in a conservative format. Double-ruled headings and centred serif type signal exactly that tradition, in parseable text.',
  sample: () =>
    makeSample({
      templateId: 'lawyer-legal',
      name: 'Alexandra Popescu',
      headline: 'Associate Lawyer — Corporate & Commercial',
      email: 'alexandra.popescu@example.com',
      phone: '+40 720 000 000',
      location: 'Bucharest, Romania',
      summary:
        'Corporate lawyer with 6 years advising on M&A support, commercial contracts and company governance. Admitted to the Bar in 2019; drafts bilingually in Romanian and English.',
      experience: [
        {
          role: 'Associate Lawyer',
          org: 'Popescu & Partners (fictional)',
          location: 'Bucharest',
          start: [2021, 4],
          current: true,
          bullets: [
            'Advise 25+ SME clients on commercial contracts, terms and shareholder matters',
            'Ran due-diligence workstreams on 4 acquisitions (values €2–15m, fictional)',
            'Draft and negotiate NDAs, supply and distribution agreements in Romanian and English',
          ],
        },
        {
          role: 'Junior Lawyer',
          org: 'Example Law Office (fictional)',
          location: 'Bucharest',
          start: [2019, 2],
          end: [2021, 3],
          bullets: ['Prepared court filings and attended hearings in civil matters', 'Maintained the precedent bank for the corporate team'],
        },
      ],
      education: [
        { institution: 'University of Example (fictional)', area: 'Law', studyType: 'LLB', start: [2014], end: [2018], score: '9.2 / 10' },
        { institution: 'University of Example (fictional)', area: 'Business Law', studyType: 'LLM', start: [2018], end: [2019], score: 'Distinction' },
      ],
      skillGroups: [
        { name: 'Practice', skills: ['Commercial contracts', 'Corporate governance', 'Due diligence', 'Legal drafting (RO/EN)'] },
        { name: 'Tools', skills: ['Legal research databases', 'Document automation basics', 'MS Office'] },
      ],
      extraSections: [
        extraSection('certifications', 'Admissions', {
          certifications: [{ id: 'lw1', name: 'Admitted to the Bar', issuer: 'National Bar Association (fictional)', credentialId: 'BAR-0000' }],
        }),
      ],
    }),
});
