'use client';

import { useEffect, useMemo } from 'react';
import { countCaption } from '../_lib/captions';
import { getPlatform, PLATFORM_SPECS_REVIEWED } from '../_lib/platforms';
import { useStore } from '../_lib/store';
import type { Post } from '../_lib/types';

/**
 * Original preview cards (spec §8) — generic representations of how a
 * post reads per platform. They deliberately do NOT copy any platform's
 * proprietary interface design.
 */
export function PlatformPreviews({ post }: { post: Post }) {
  const store = useStore();
  const brand = store.activeWorkspace?.brand;
  const handle = brand?.brandName ? `@${brand.brandName.replace(/\s+/g, '').toLowerCase()}` : '@yourbrand';
  const firstMedia = post.mediaIds
    .map((id) => store.data.media.find((m) => m.id === id))
    .find((m) => m?.mimeType.startsWith('image/'));

  const thumbUrl = useMemo(
    () =>
      firstMedia
        ? URL.createObjectURL(firstMedia.thumbnailBlob ?? firstMedia.blob)
        : null,
    [firstMedia],
  );
  useEffect(() => {
    return () => {
      if (thumbUrl) URL.revokeObjectURL(thumbUrl);
    };
  }, [thumbUrl]);

  if (post.platformIds.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Select at least one platform to see per-platform previews.
      </p>
    );
  }
  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2">
        {post.platformIds.map((pid) => {
          const spec = getPlatform(pid);
          if (!spec) return null;
          const caption = post.platformCaptions[pid] ?? post.caption;
          const counts = countCaption(caption, spec);
          const imageSpec = spec.imageSpecs[0];
          return (
            <article key={pid} className="overflow-hidden rounded-lg border border-border" aria-label={`Preview for ${spec.name}`}>
              <header className="flex items-center gap-2 border-b border-border px-3 py-2">
                <span aria-hidden className="h-3 w-3 rounded-full" style={{ backgroundColor: spec.color }} />
                <span className="font-semibold">{spec.name}</span>
                <span className="text-xs text-muted-foreground">{handle}</span>
                <span className="ml-auto rounded bg-muted px-1.5 py-0.5 text-[11px]">{post.contentType}</span>
              </header>
              {thumbUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- local blob preview
                <img src={thumbUrl} alt={firstMedia?.altText ?? ''} className="aspect-video w-full object-cover" />
              ) : (
                <div className="flex aspect-video items-center justify-center bg-muted/40 px-3 text-center text-xs text-muted-foreground">
                  {post.contentType} media area
                  {imageSpec ? ` · recommended ${imageSpec.width}×${imageSpec.height} (${imageSpec.label})` : ''}
                </div>
              )}
              <div className="px-3 py-2">
                <p className="line-clamp-4 whitespace-pre-wrap text-sm">{caption || '(no caption yet)'}</p>
                <p className={`mt-1 text-[11px] ${counts.overLimit ? 'font-semibold text-red-600 dark:text-red-400' : 'text-muted-foreground'}`}>
                  {counts.weighted}
                  {spec.charLimit ? ` / ${spec.charLimit}` : ''} characters
                  {post.platformCaptions[pid] ? ' · platform override' : ' · master caption'}
                </p>
              </div>
            </article>
          );
        })}
      </div>
      <p className="mt-2 text-[11px] text-muted-foreground">
        Platform specifications last reviewed: {PLATFORM_SPECS_REVIEWED} — guidance, not a
        live guarantee. Limits can be adjusted per workspace in the Platforms panel.
      </p>
    </div>
  );
}
