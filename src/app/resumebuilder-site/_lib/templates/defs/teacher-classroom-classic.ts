import { defineTemplate } from '../define';
import { makeSample, extraSection, bulletsOf } from '../sample-helpers';
import { rt } from '../../schema';

export default defineTemplate({
  id: 'teacher-classroom-classic',
  name: 'Classroom Classic',
  profession: 'Teacher',
  category: 'Education',
  atsSafe: true,
  columns: 1,
  supportsPhoto: true,
  layout: 'single',
  header: 'left',
  heading: 'rule-under',
  tokens: { accent: '#166534', palettes: ['#166534', '#1d4ed8', '#9a3412', '#0f766e'] },
  sectionOrder: ['summary', 'experience', 'education', 'skills', 'certifications', 'courses'],
  why: 'Schools scan for subjects, grade levels and classroom results in a familiar order. This single-column layout keeps qualifications and experience up front, with certifications easy for an administrator to verify.',
  sample: () =>
    makeSample({
      templateId: 'teacher-classroom-classic',
      name: 'Maryam Siddiqui',
      headline: 'Secondary School Mathematics Teacher',
      email: 'maryam.siddiqui@example.com',
      phone: '+92 300 0000000',
      location: 'Karachi, Pakistan',
      summary:
        'Mathematics teacher with 7 years of experience across grades 6–10. Known for structured lesson planning, data-informed revision cycles and calm, consistent classroom routines that lift attainment for mixed-ability classes.',
      experience: [
        {
          role: 'Mathematics Teacher',
          org: 'Northgate Learning Academy (fictional)',
          location: 'Karachi',
          start: [2021, 9],
          current: true,
          bullets: [
            'Raised the grade 9 class average from 61% to 74% over two terms by introducing weekly low-stakes quizzes and targeted re-teaching',
            'Plan and deliver 24 lessons a week across grades 7–10, including two examination classes',
            'Mentor 3 early-career teachers in lesson observation and feedback',
          ],
        },
        {
          role: 'Junior Mathematics Teacher',
          org: 'Elmwood Community School (fictional)',
          location: 'Karachi',
          start: [2018, 8],
          end: [2021, 7],
          bullets: [
            'Taught grades 6–8 mathematics to classes of up to 38 students',
            'Ran the after-school numeracy club, attended by 45 students a week',
          ],
        },
      ],
      education: [
        {
          institution: 'University of Example (fictional)',
          area: 'Mathematics Education',
          studyType: 'BEd',
          start: [2014],
          end: [2018],
          score: 'First Class Honours',
        },
      ],
      skillGroups: [
        { name: 'Subjects', skills: ['Mathematics (Grades 6–10)', 'Statistics', 'Further Mathematics (introductory)'] },
        { name: 'Classroom', skills: ['Lesson planning', 'Formative assessment', 'Behaviour management', 'Differentiation'] },
        { name: 'Technology', skills: ['Google Classroom', 'GeoGebra', 'Interactive whiteboard'] },
      ],
      extraSections: [
        extraSection('certifications', 'Certifications & Licences', {
          certifications: [
            { id: 'c1', name: 'Teaching Licence — Secondary Mathematics', issuer: 'Provincial Education Board (fictional)', credentialId: 'LIC-000000' },
          ],
        }),
        extraSection('custom', 'Teaching Philosophy', {
          customType: 'text',
          text: [rt.p('I believe students learn mathematics by doing it daily in small, successful steps. My classroom pairs worked examples with frequent low-stakes practice, so every learner experiences progress they can see.')],
        }),
        extraSection('courses', 'Courses & Training', {
          entries: [
            { id: 't1', title: 'Formative Assessment in Practice', organization: 'Example CPD Institute (fictional)', bullets: bulletsOf(['16-hour certificate course']) },
          ],
        }),
      ],
    }),
});
