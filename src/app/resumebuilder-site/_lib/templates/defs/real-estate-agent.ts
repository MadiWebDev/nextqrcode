import { defineTemplate } from '../define';
import { makeSample, extraSection } from '../sample-helpers';

export default defineTemplate({
  id: 'real-estate-agent',
  name: 'Property Closer',
  profession: 'Real Estate Agent',
  category: 'Sales',
  atsSafe: false,
  columns: 2,
  supportsPhoto: true,
  layout: 'sidebar-left',
  header: 'band',
  heading: 'boxed',
  fontPair: 'playfair-worksans',
  tokens: { accent: '#854d0e', palettes: ['#854d0e', '#1e3a5f', '#166534', '#334155'] },
  sideSections: ['skills', 'certifications', 'languages'],
  sectionOrder: ['summary', 'experience', 'awards', 'education', 'skills', 'certifications'],
  why: 'Brokerages judge agents on volume, local knowledge and licence status. A confident band header with a credentials sidebar presents closed deals and patch expertise like a personal brand page.',
  sample: () =>
    makeSample({
      templateId: 'real-estate-agent',
      name: 'Omar Haddad',
      headline: 'Real Estate Agent — Residential',
      email: 'omar.haddad@example.com',
      phone: '+971 50 000 0000',
      location: 'Dubai, UAE',
      summary:
        'Residential agent with 6 years in family communities. AED 96m in closed sales over the last 3 years (fictional); known for honest pricing advice that sells homes in weeks, not months.',
      experience: [
        {
          role: 'Senior Property Consultant',
          org: 'Keystone Properties (fictional)',
          location: 'Dubai',
          start: [2021, 3],
          current: true,
          bullets: [
            'Closed 41 residential sales in 2024 totalling AED 58m (fictional)',
            'Average days-on-market of 26 against a community average of 44',
            'Built a referral base supplying 55% of new listings',
          ],
        },
        {
          role: 'Property Consultant',
          org: 'Example Homes Realty (fictional)',
          location: 'Dubai',
          start: [2019, 1],
          end: [2021, 2],
          bullets: ['Leased and sold villas across two master communities', 'Hosted weekend open houses averaging 18 visiting families'],
        },
      ],
      education: [
        { institution: 'Example Business School (fictional)', area: 'Marketing', studyType: 'Diploma', start: [2016], end: [2018], score: 'Completed' },
      ],
      skillGroups: [
        { name: 'Selling', skills: ['Valuation & pricing', 'Negotiation', 'Listing marketing', 'Off-plan sales'] },
        { name: 'Tools', skills: ['CRM (Property Monitor)', 'Bayut & Dubizzle listings', 'Photography briefs'] },
      ],
      extraSections: [
        extraSection('certifications', 'Licence', {
          certifications: [{ id: 'r1', name: 'Real Estate Regulatory Licence', issuer: 'Land Department (fictional)', credentialId: 'BRN-00000' }],
        }),
      ],
    }),
});
