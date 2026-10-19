#!/usr/bin/env npx tsx
/**
 * Seed starter QR templates (idempotent — safe to re-run).
 *
 * Seeds the `Template` collection with 3 real QR design templates derived
 * from the template gallery data in `src/data/templates-gallery.ts` (30
 * published design entries with slugs, palettes, dot/eye styles, EC levels,
 * frames, and scanability guidance). The three chosen cover distinct,
 * real-world design styles: minimalist, corporate, luxury.
 *
 * No users are created — user accounts are real sign-ups only.
 *
 * Upsert key: `design.slug` (the Template schema has no dedicated slug
 * field; the gallery slug is stored inside the `design` payload).
 *
 * Usage:  MONGODB_URI="mongodb+srv://..." npx tsx scripts/seed.ts
 * Exit codes: 0 = success, 1 = failure (missing MONGODB_URI, DB error,
 *             or gallery data missing).
 */
import mongoose from 'mongoose';

import { dbConnect } from '../src/lib/db/mongoose.js';
import { Template } from '../src/models/Template.js';
import { TEMPLATE_GALLERY, type TemplateGalleryEntry } from '../src/data/templates-gallery.js';

/** Gallery slugs to seed as starter templates. */
const SEED_SLUGS = ['minimalist-white-card', 'corporate-navy-trust', 'luxury-gold-foil'] as const;

/**
 * Build the Template `design` payload from a gallery entry, keeping the
 * slug first so it is easy to query (`design.slug`).
 */
function toTemplateDesign(entry: TemplateGalleryEntry): Record<string, unknown> {
  const { slug, name, ...rest } = entry;
  return { slug, name, ...rest };
}

async function main(): Promise<void> {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not set. Nothing was seeded.');
  }

  const entries = SEED_SLUGS.map((slug) => TEMPLATE_GALLERY.find((entry) => entry.slug === slug));

  const missing = SEED_SLUGS.filter((_, i) => !entries[i]);
  if (missing.length > 0) {
    throw new Error(`Gallery data missing for slug(s): ${missing.join(', ')}. Nothing was seeded.`);
  }

  await dbConnect();

  let created = 0;
  let updated = 0;
  const results: Array<{ slug: string; name: string; action: 'created' | 'updated' }> = [];

  for (const entry of entries) {
    const gallery = entry as TemplateGalleryEntry;
    const existing = await Template.findOne({ 'design.slug': gallery.slug }).select('_id').lean();
    await Template.findOneAndUpdate(
      { 'design.slug': gallery.slug },
      { name: gallery.name, design: toTemplateDesign(gallery) },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    const action = existing ? 'updated' : 'created';
    if (existing) {
      updated += 1;
    } else {
      created += 1;
    }
    results.push({ slug: gallery.slug, name: gallery.name, action });
  }

  console.log('Seed summary:');
  for (const result of results) {
    console.log(`  - ${result.slug} ("${result.name}"): ${result.action}`);
  }
  console.log(`Templates seeded: ${created + updated} (${created} created, ${updated} updated)`);

  await mongoose.disconnect();
}

main().catch((error: unknown) => {
  console.error('Seed failed:', error instanceof Error ? error.message : error);
  process.exit(1);
});
