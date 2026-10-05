import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getDatabase, isMongoConfigured } from '@/lib/mongodb';
import { getMemoryCard } from '@/app/api/cards/route';
import type { DigitalCard } from '@/types/card';
import { CardViewClient } from './CardViewClient';

export const runtime = 'nodejs';

async function fetchCard(slug: string): Promise<DigitalCard | null> {
  if (isMongoConfigured()) {
    try {
      const db = await getDatabase();
      const collection = db.collection<DigitalCard>('cards');
      const card = await collection.findOne({ slug });
      if (card) {
        return {
          ...card,
          _id: card._id?.toString(),
        };
      }
    } catch {
      // Fallback
    }
  }
  return getMemoryCard(slug) || null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const card = await fetchCard(slug);

  if (!card) {
    return {
      title: 'Digital Business Card — QR Code Tools',
    };
  }

  const title = `${card.name} | ${card.title || 'Digital Business Card'}`;
  const description = card.bio || `Connect with ${card.name} at ${card.company || 'QR Code Tools'}. Save contact directly to your phone.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: card.avatarUrl ? [{ url: card.avatarUrl }] : undefined,
    },
    twitter: {
      card: 'summary',
      title,
      description,
      images: card.avatarUrl ? [card.avatarUrl] : undefined,
    },
  };
}

export default async function CardPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const card = await fetchCard(slug);

  if (!card) {
    notFound();
  }

  return <CardViewClient card={card} />;
}
