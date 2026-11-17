import type { Metadata } from 'next';
import { StoreProvider } from '../_lib/store';
import { WorkspaceApp } from '../_components/WorkspaceApp';

export const metadata: Metadata = {
  title: 'Workspace — Social Media Calendar',
  robots: { index: false, follow: false },
  alternates: { canonical: 'https://socialcalendar.freeqrcode.tools/app' },
};

/** The local-first workspace. All data stays in the visitor's browser. */
export default function WorkspacePage() {
  return (
    <StoreProvider>
      <WorkspaceApp />
    </StoreProvider>
  );
}
