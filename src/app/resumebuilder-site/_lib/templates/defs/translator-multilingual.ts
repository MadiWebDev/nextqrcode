import { defineTemplate } from '../define';
import { makeSample, extraSection } from '../sample-helpers';

export default defineTemplate({
  id: 'translator-multilingual',
  name: 'Multilingual',
  profession: 'Translator',
  category: 'Languages',
  atsSafe: false,
  columns: 1,
  supportsPhoto: false,
  layout: 'label-column',
  header: 'split',
  heading: 'dot-leader',
  fontPair: 'lora-plex',
  tokens: { accent: '#0f766e', palettes: ['#0f766e', '#7c3aed', '#b45309', '#334155'] },
  sectionOrder: ['summary', 'languages', 'experience', 'education', 'skills', 'certifications'],
  why: 'Translation buyers shop by language pair, domain and volume. The label column puts pairs and CAT tools beside the work history so an agency can qualify a translator in one pass.',
  sample: () =>
    makeSample({
      templateId: 'translator-multilingual',
      name: 'Yusuf Demir',
      headline: 'Translator — English ↔ Turkish, German → Turkish',
      email: 'yusuf.demir@example.com',
      phone: '+90 530 000 00 00',
      location: 'Istanbul, Türkiye',
      summary:
        'Freelance translator with 7 years and 2.4m words delivered across legal, medical and software texts. Sworn translator; consistent terminology through maintained glossaries for 12 long-term clients.',
      experience: [
        {
          role: 'Freelance Translator',
          org: 'Self-employed',
          location: 'Istanbul (remote)',
          start: [2018, 5],
          current: true,
          bullets: [
            'Deliver 2,500–3,500 words a day with a personal QA checklist and second-pass proofread',
            'Localise a SaaS product into Turkish continuously since 2021 (UI, help centre, release notes)',
            'Sworn translation of contracts and certificates with same-day turnaround',
          ],
        },
        {
          role: 'In-house Translator',
          org: 'Example Language Services (fictional)',
          location: 'Istanbul',
          start: [2016, 9],
          end: [2018, 4],
          bullets: ['Translated medical device documentation under ISO 17100 workflows', 'Built the agency\u2019s Turkish legal glossary (1,900 terms)'],
        },
      ],
      education: [
        { institution: 'University of Example (fictional)', area: 'Translation Studies', studyType: 'BA', start: [2012], end: [2016], score: 'Honours' },
      ],
      skillGroups: [
        { name: 'Domains', skills: ['Legal', 'Medical devices', 'Software localisation', 'Marketing transcreation'] },
        { name: 'Tools', skills: ['Trados Studio', 'memoQ', 'Phrase', 'QA checks (Xbench)'] },
      ],
      extraSections: [
        extraSection('languages', 'Language Pairs', {
          languages: [
            { id: 'tl1', language: 'Turkish', fluency: 'Native' },
            { id: 'tl2', language: 'English', fluency: 'Fluent — source & target' },
            { id: 'tl3', language: 'German', fluency: 'Fluent — source' },
          ],
        }),
        extraSection('certifications', 'Credentials', {
          certifications: [{ id: 'tc1', name: 'Sworn Translator', issuer: 'Notary & Courts Registry (fictional)' }],
        }),
      ],
    }),
});
