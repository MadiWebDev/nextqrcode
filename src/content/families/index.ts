/**
 * Content family registry.
 *
 * Each family has its own adapter module under ./families/ exporting a loader
 * that returns schema-validated ContentEntry objects. Adapters translate the
 * domain data files in src/data/ into the unified content schema (deriving
 * h1, internalLinks, lastReviewed, etc.).
 */
import type { ContentEntry, ContentFamily } from '../schema';
import { loadIndustries } from './industries';
import { loadGlossary } from './glossary';
import { loadScanGuide } from './scan-guide';
import { loadSizeGuide } from './size-guide';
import { loadTemplates } from './templates';

export const familyLoaders: Record<ContentFamily, () => Promise<ContentEntry[]>> = {
  industries: async () => loadIndustries(),
  glossary: async () => loadGlossary(),
  'scan-guide': async () => loadScanGuide(),
  'size-guide': async () => loadSizeGuide(),
  templates: async () => loadTemplates(),
};
