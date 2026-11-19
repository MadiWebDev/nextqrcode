import { defineTemplate } from '../define';
import { makeSample, extraSection } from '../sample-helpers';

export default defineTemplate({
  id: 'chef-culinary',
  name: 'Chef\u2019s Whites',
  profession: 'Chef',
  category: 'Hospitality',
  atsSafe: false,
  columns: 1,
  supportsPhoto: true,
  layout: 'single',
  header: 'centered',
  heading: 'boxed',
  fontPair: 'playfair-worksans',
  tokens: { accent: '#7f1d1d', palettes: ['#7f1d1d', '#166534', '#334155', '#9a3412'] },
  sectionOrder: ['summary', 'experience', 'skills', 'certifications', 'education'],
  why: 'Kitchens hire on stations run, covers handled and hygiene discipline. An elegant centred layout suits fine-dining houses while keeping service numbers and food-safety certificates unmistakable.',
  sample: () =>
    makeSample({
      templateId: 'chef-culinary',
      name: 'Claire Dubois',
      headline: 'Sous Chef — Modern French',
      email: 'claire.dubois@example.com',
      phone: '+33 6 00 00 00 00',
      location: 'Lyon, France',
      summary:
        'Sous chef with 8 years in bistronomy and fine dining. Runs larder and sauce sections at pace, trains commis chefs and holds a spotless hygiene record across 5 inspections.',
      experience: [
        {
          role: 'Sous Chef',
          org: 'Maison Verger (fictional)',
          location: 'Lyon',
          start: [2021, 5],
          current: true,
          bullets: [
            'Second-in-command of a 9-chef brigade serving 90 covers a night',
            'Own ordering and stock for larder; cut food waste from 8% to 4.5%',
            'Develop seasonal starters with the head chef; 3 dishes carried across 2 menus',
          ],
        },
        {
          role: 'Chef de Partie',
          org: 'Example Brasserie (fictional)',
          location: 'Lyon',
          start: [2018, 2],
          end: [2021, 4],
          bullets: ['Ran the sauce section solo during service for 120-cover lunches', 'Trained 4 commis chefs to section standard'],
        },
      ],
      education: [
        { institution: 'Example Culinary School (fictional)', area: 'Professional Cookery', studyType: 'Diploma', start: [2015], end: [2017], score: 'With Merit' },
      ],
      skillGroups: [
        { name: 'Kitchen', skills: ['Sauce & larder sections', 'Menu development', 'Stock & ordering', 'Brigade training', 'Allergen management'] },
        { name: 'Standards', skills: ['HACCP', 'Food hygiene level 3', 'Costing & GP control'] },
      ],
      extraSections: [
        extraSection('certifications', 'Certifications', {
          certifications: [{ id: 'ch1', name: 'Food Hygiene & Safety Level 3', issuer: 'Example Hygiene Institute (fictional)' }],
        }),
      ],
    }),
});
