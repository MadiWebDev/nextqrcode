import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, isMongoConfigured } from '@/lib/mongodb';
import type { DigitalCard } from '@/types/card';

export const runtime = 'nodejs';

// In-memory fallback cache when MongoDB URI is not configured yet (useful for testing)
const memoryCards = new Map<string, DigitalCard>();

export function getMemoryCard(slug: string): DigitalCard | undefined {
  return memoryCards.get(slug);
}

function generateSlug(name: string): string {
  const cleanName = (name || 'card')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  const randomSuffix = Math.random().toString(36).substring(2, 7);
  return `${cleanName}-${randomSuffix}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<DigitalCard>;

    if (!body.name || !body.name.trim()) {
      return NextResponse.json(
        { success: false, error: 'Card owner name is required' },
        { status: 400 }
      );
    }

    const slug = body.slug || generateSlug(body.name);
    const newCard: DigitalCard = {
      slug,
      name: body.name.trim(),
      title: body.title?.trim() || '',
      company: body.company?.trim() || '',
      bio: body.bio?.trim() || '',
      avatarUrl: body.avatarUrl?.trim() || '',
      coverUrl: body.coverUrl?.trim() || '',
      phone: body.phone?.trim() || '',
      email: body.email?.trim() || '',
      website: body.website?.trim() || '',
      address: body.address?.trim() || '',
      theme: body.theme || 'luxury-dark',
      socials: body.socials || {},
      badges: body.badges || [],
      createdAt: new Date().toISOString(),
    };

    if (isMongoConfigured()) {
      const db = await getDatabase();
      const collection = db.collection<DigitalCard>('cards');
      await collection.updateOne(
        { slug },
        { $set: newCard },
        { upsert: true }
      );
    } else {
      // Store in in-memory fallback
      memoryCards.set(slug, newCard);
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://freeqrcode.tools';
    const cardUrl = `${siteUrl}/card/${slug}`;

    return NextResponse.json({
      success: true,
      card: newCard,
      url: cardUrl,
      isMongoConfigured: isMongoConfigured(),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to save card';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
