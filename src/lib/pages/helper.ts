// Adjust this import path to wherever your Article interface lives.
import type { Article } from '../articles';

export const AUTHOR = 'Codexengr, QR Systems Engineer';
export const UPDATED = '2026-10-05';

type FAQ = { question: string; answer: string };

export function art(
  slug: string,
  title: string,
  primaryKeyword: string,
  description: string,
  category: Article['category'],
  readTime: string,
  publishedAt: string,
  content: string,
  faqs: FAQ[]
): Article {
  return {
    slug,
    title,
    primaryKeyword,
    description,
    author: AUTHOR,
    publishedAt,
    updatedAt: UPDATED,
    readTime,
    category,
    content,
    faqs,
  };
}