/**
 * RelatedTools — server-rendered internal-linking block for tool pages.
 *
 * Renders up to 6 real <Link>s: same-category siblings first, then tools
 * from other categories, always excluding the current page. Pure server
 * component — the links are in the initial HTML for crawlers.
 */
import Link from 'next/link';
import { TOOL_REGISTRY, getToolByPath, type ToolCategory } from '@/data/tool-registry';

export function RelatedTools({
  currentPath,
  category,
  limit = 6,
}: {
  currentPath: string;
  category?: ToolCategory;
  limit?: number;
}) {
  const resolvedCategory = category ?? getToolByPath(currentPath)?.category;
  const others = TOOL_REGISTRY.filter((t) => t.slug !== currentPath);
  const sameCategory = resolvedCategory
    ? others.filter((t) => t.category === resolvedCategory)
    : [];
  const rest = others.filter((t) => t.category !== resolvedCategory);
  const picks = [...sameCategory, ...rest].slice(0, limit);

  if (picks.length === 0) return null;

  return (
    <section aria-labelledby="related-tools-heading" className="space-y-4">
      <h2 id="related-tools-heading" className="text-xl font-bold tracking-tight">
        Related tools
      </h2>
      <ul className="grid gap-3 sm:grid-cols-2">
        {picks.map((tool) => (
          <li key={tool.slug} className="border border-border/70 rounded-xl p-4 bg-card">
            <Link href={tool.slug} className="font-semibold text-primary hover:underline">
              {tool.name}
            </Link>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{tool.blurb}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
