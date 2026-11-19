import { defineTemplate } from '../define';
import { makeSample } from '../sample-helpers';

export default defineTemplate({
  id: 'hospitality-manager',
  name: 'Guest Experience',
  profession: 'Hospitality Manager',
  category: 'Hospitality',
  atsSafe: false,
  columns: 2,
  supportsPhoto: true,
  layout: 'two-column',
  header: 'centered',
  heading: 'overline',
  fontPair: 'playfair-worksans',
  tokens: { accent: '#0d7377', palettes: ['#0d7377', '#854d0e', '#7f1d1d', '#334155'] },
  sideSections: ['skills', 'languages', 'certifications'],
  sectionOrder: ['summary', 'experience', 'education', 'skills', 'languages'],
  why: 'Hotels hire on guest scores, revenue habits and calm leadership. An elegant centred header with a languages sidebar suits guest-facing management roles where presentation is part of the job.',
  sample: () =>
    makeSample({
      templateId: 'hospitality-manager',
      name: 'Layla Haddad',
      headline: 'Front Office Manager — 4-Star Hotel',
      email: 'layla.haddad@example.com',
      phone: '+962 7 9000 0000',
      location: 'Amman, Jordan',
      summary:
        'Front office manager with 9 years in 4- and 5-star properties. Guest satisfaction 92% and rising; leads a team of 14 across reception, concierge and guest relations.',
      experience: [
        {
          role: 'Front Office Manager',
          org: 'The Example Grand Hotel (fictional)',
          location: 'Amman',
          start: [2021, 7],
          current: true,
          bullets: [
            'Run front office for a 240-room property at 81% average occupancy',
            'Lifted review-platform rating from 8.4 to 9.1 in 18 months',
            'Introduced upsell training adding JOD 6,200/month (fictional) in room upgrades',
          ],
        },
        {
          role: 'Duty Manager',
          org: 'Example Beach Resort (fictional)',
          location: 'Aqaba',
          start: [2018, 3],
          end: [2021, 6],
          bullets: ['Handled guest escalations and overnight operations for 180 rooms', 'Coordinated VIP and group arrivals of up to 120 guests'],
        },
      ],
      education: [
        { institution: 'University of Example (fictional)', area: 'Hospitality Management', studyType: 'BA', start: [2013], end: [2017], score: 'Very Good' },
      ],
      skillGroups: [
        { name: 'Operations', skills: ['Front office leadership', 'Revenue & upselling', 'Complaint recovery', 'Rostering'] },
        { name: 'Systems', skills: ['Opera PMS', 'Guest messaging platforms', 'Channel manager basics'] },
      ],
    }),
});
