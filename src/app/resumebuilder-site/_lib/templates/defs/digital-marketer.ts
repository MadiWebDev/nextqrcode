import { defineTemplate } from '../define';
import { makeSample } from '../sample-helpers';

export default defineTemplate({
  id: 'digital-marketer',
  name: 'Growth Marketer',
  profession: 'Digital Marketer',
  category: 'Marketing',
  atsSafe: false,
  columns: 2,
  supportsPhoto: true,
  layout: 'sidebar-right',
  header: 'monogram',
  heading: 'dot-leader',
  fontPair: 'grotesk-inter',
  tokens: { accent: '#ea580c', palettes: ['#ea580c', '#db2777', '#0369a1', '#0f766e'] },
  sideSections: ['skills', 'certifications'],
  sectionOrder: ['summary', 'experience', 'projects', 'education', 'skills', 'certifications'],
  why: 'Marketing managers scan for channels, budgets and growth numbers. A monogram header gives personal-brand energy while the sidebar keeps platforms and certifications in one glanceable stack.',
  sample: () =>
    makeSample({
      templateId: 'digital-marketer',
      name: 'Sofia Rossi',
      headline: 'Digital Marketing Specialist — Paid & Organic',
      email: 'sofia.rossi@example.com',
      phone: '+39 340 000 0000',
      location: 'Milan, Italy',
      summary:
        'Digital marketer with 5 years across paid social, search and lifecycle email. Manages €40k/month budgets (fictional) with a test-and-learn backlog that ships two experiments a week.',
      experience: [
        {
          role: 'Digital Marketing Specialist',
          org: 'Casa Living E-commerce (fictional)',
          location: 'Milan',
          start: [2021, 4],
          current: true,
          bullets: [
            'Grew paid revenue 63% year on year while holding ROAS above 4.2',
            'Built lifecycle email flows contributing 21% of total store revenue',
            'Own the content calendar across Instagram, TikTok and the blog (SEO traffic +88% YoY)',
          ],
        },
        {
          role: 'Marketing Executive',
          org: 'Example Travel Startup (fictional)',
          location: 'Rome',
          start: [2019, 5],
          end: [2021, 3],
          bullets: ['Ran Google and Meta campaigns for 3 European markets', 'Introduced UTM governance and weekly performance reporting'],
        },
      ],
      education: [
        { institution: 'University of Example (fictional)', area: 'Marketing & Communications', studyType: 'BA', start: [2015], end: [2019], score: 'Cum Laude' },
      ],
      skillGroups: [
        { name: 'Channels', skills: ['Meta Ads', 'Google Ads', 'SEO', 'Email lifecycle', 'TikTok organic'] },
        { name: 'Analytics', skills: ['GA4', 'Looker Studio', 'A/B testing', 'Attribution basics'] },
      ],
    }),
});
