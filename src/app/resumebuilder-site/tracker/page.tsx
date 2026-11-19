import type { Metadata } from 'next';
import { Tracker } from '../_components/Tracker';

export const metadata: Metadata = {
  title: 'Job Application Tracker — Resume Builder',
  description:
    'Track your job applications on a simple board: saved, applied, interview, offer. Stored only in your browser — no account, no sync, no tracking.',
  robots: { index: false, follow: false },
};

export default function TrackerPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight">Job application tracker</h1>
      <p className="mt-3 max-w-3xl text-muted-foreground">
        A simple board for the applications you are juggling. Everything is stored only in this
        browser, like your resumes — closing the tab loses nothing, and nobody else can see it.
      </p>
      <Tracker />
    </main>
  );
}
