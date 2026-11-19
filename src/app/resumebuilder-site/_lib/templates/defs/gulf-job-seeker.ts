import { defineTemplate } from '../define';
import { makeSample, extraSection } from '../sample-helpers';

export default defineTemplate({
  id: 'gulf-job-seeker',
  name: 'Overseas / Gulf Job Seeker',
  profession: 'Gulf Job Seeker',
  category: 'General',
  atsSafe: false,
  columns: 2,
  supportsPhoto: true,
  layout: 'sidebar-right',
  header: 'photo-left',
  heading: 'rule-under',
  sideSections: ['skills', 'languages', 'certifications'],
  tokens: { accent: '#065f46', palettes: ['#065f46', '#1e40af', '#7c2d12', '#334155'] },
  sectionOrder: ['summary', 'experience', 'education', 'skills', 'languages', 'certifications'],
  why: 'Built for Gulf-region applications: photo placement, nationality and visa-status fields (off until you add them), languages and licences in a sidebar recruiters can verify quickly, and a declaration section where employers expect one.',
  sample: () =>
    makeSample({
      templateId: 'gulf-job-seeker',
      name: 'Imran Sheikh',
      headline: 'Site Supervisor — Building Construction',
      email: 'imran.sheikh@example.com',
      phone: '+92 321 0000000',
      location: 'Lahore, Pakistan',
      region: 'gulf',
      summary:
        'Site supervisor with 10 years on residential and commercial projects in Pakistan and two completed projects in the Gulf. Reads drawings fluently, runs toolbox talks and keeps clean safety and progress records.',
      experience: [
        {
          role: 'Site Supervisor',
          org: 'Fictional Builders LLC',
          location: 'Dubai, UAE',
          start: [2022, 2],
          end: [2024, 11],
          bullets: [
            'Supervised finishing works for a 14-storey residential tower, team of 38',
            'Daily progress reporting and snag-list closure with the main contractor',
            'Zero reportable safety incidents across both project phases',
          ],
        },
        {
          role: 'Foreman',
          org: 'Example Construction Co. (fictional)',
          location: 'Lahore',
          start: [2016, 5],
          end: [2022, 1],
          bullets: [
            'Ran concrete and blockwork gangs on school and clinic projects',
            'Read structural and architectural drawings; set out levels and lines',
          ],
        },
      ],
      education: [
        { institution: 'Example Technical Institute (fictional)', area: 'Civil Technology', studyType: 'Diploma (DAE)', start: [2013], end: [2016] },
      ],
      skillGroups: [
        { name: 'Site skills', skills: ['Drawing reading', 'Setting out', 'Finishing works', 'Safety toolbox talks'] },
        { name: 'Documents', skills: ['Daily reports', 'Snag lists', 'Material requests'] },
      ],
      extraSections: [
        extraSection('languages', 'Languages', {
          languages: [
            { id: 'l1', language: 'Urdu', fluency: 'Native' },
            { id: 'l2', language: 'English', fluency: 'Good working proficiency' },
            { id: 'l3', language: 'Arabic', fluency: 'Basic workplace' },
            { id: 'l4', language: 'Hindi', fluency: 'Fluent spoken' },
          ],
        }),
        extraSection('certifications', 'Certifications & Licences', {
          certifications: [
            { id: 'c1', name: 'First Aid at Work', issuer: 'Example Safety Institute (fictional)' },
            { id: 'c2', name: 'Driving Licence — Light Vehicle', issuer: 'Example Licensing Authority (fictional)' },
          ],
        }),
      ],
    }),
});
