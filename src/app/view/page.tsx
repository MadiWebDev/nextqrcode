import { Suspense } from 'react';
import type { Metadata } from 'next';
import { MediaViewClient } from './MediaViewClient';

export const metadata: Metadata = {
  title: 'Media Showcase — QR Code Tools',
  description: 'View images, watch high-definition video, or stream audio shared via QR code.',
};

export default function MediaViewerPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white text-sm">
          Loading media...
        </div>
      }
    >
      <MediaViewClient />
    </Suspense>
  );
}
