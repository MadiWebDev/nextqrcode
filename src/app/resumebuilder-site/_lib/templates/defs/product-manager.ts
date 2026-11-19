import { defineTemplate } from '../define';
import { makeSample } from '../sample-helpers';

export default defineTemplate({
  id: 'product-manager',
  name: 'Product Story',
  profession: 'Product Manager',
  category: 'Technology',
  atsSafe: false,
  columns: 1,
  supportsPhoto: false,
  layout: 'single',
  header: 'centered',
  heading: 'dot-leader',
  fontPair: 'playfair-worksans',
  tokens: { accent: '#1d4ed8', palettes: ['#1d4ed8', '#0f766e', '#b91c1c', '#334155'] },
  sectionOrder: ['summary', 'experience', 'skills', 'education'],
  why: 'Product roles are judged on outcomes and narrative: what shipped, what moved. A centred editorial header with outcome-led bullets reads like a product story, while staying fully text-based for screening tools.',
  sample: () =>
    makeSample({
      templateId: 'product-manager',
      name: 'Diego Fuentes',
      headline: 'Senior Product Manager — Growth',
      email: 'diego.fuentes@example.com',
      phone: '+34 600 000 000',
      location: 'Madrid, Spain',
      summary:
        'Product manager with 7 years in consumer apps. Owns activation and retention for a 2m-user product; ships experiments weekly and writes the specs engineers actually thank me for.',
      experience: [
        {
          role: 'Senior Product Manager',
          org: 'Viaja App (fictional)',
          location: 'Madrid',
          start: [2021, 9],
          current: true,
          bullets: [
            'Lifted new-user activation from 31% to 44% with an onboarding redesign tested across 6 experiments',
            'Own the growth roadmap for a squad of 8 (design, engineering, data)',
            'Launched referral programme driving 18% of new signups at zero media cost',
          ],
        },
        {
          role: 'Product Manager',
          org: 'Example Fintech (fictional)',
          location: 'Barcelona',
          start: [2018, 6],
          end: [2021, 8],
          bullets: ['Shipped instant payments feature adopted by 61% of active users in 3 months', 'Ran discovery with 40+ customers per quarter across 3 segments'],
        },
      ],
      education: [
        { institution: 'University of Example (fictional)', area: 'Industrial Engineering', studyType: 'BSc', start: [2012], end: [2017], score: 'Notable' },
      ],
      skillGroups: [
        { name: 'Product', skills: ['Roadmapping', 'Experiment design', 'User discovery', 'Pricing tests', 'Funnel analytics'] },
        { name: 'Tools', skills: ['Amplitude', 'Figma', 'SQL (intermediate)', 'Jira', 'Notion'] },
      ],
    }),
});
