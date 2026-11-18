import type { Metadata } from 'next';
import { StoreProvider } from '../_lib/store';
import ShareViewer from '../_components/ShareViewer';

export const metadata: Metadata = {
  title: 'Shared calendar (read-only) — Social Media Calendar',
  robots: { index: false, follow: false },
};

/**
 * Read-only viewer for fragment share links. The StoreProvider is here
 * only so "Copy to my calendar" can save into the visitor's own local
 * workspace; viewing itself needs no account and uploads nothing.
 */
export default function SharedCalendarPage() {
  return (
    <StoreProvider>
      <ShareViewer />
    </StoreProvider>
  );
}
