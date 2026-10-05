import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, isMongoConfigured } from '@/lib/mongodb';
import { getMemoryCard } from '../route';
import type { DigitalCard } from '@/types/card';

export const runtime = 'nodejs';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json({ success: false, error: 'Slug required' }, { status: 400 });
    }

    let card: DigitalCard | null = null;

    if (isMongoConfigured()) {
      const db = await getDatabase();
      const collection = db.collection<DigitalCard>('cards');
      card = await collection.findOne({ slug });
    } else {
      card = getMemoryCard(slug) || null;
    }

    if (!card) {
      return NextResponse.json({ success: false, error: 'Card not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, card });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error fetching card';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
