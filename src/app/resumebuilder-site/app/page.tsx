import type { Metadata } from 'next';
import { Workspace } from '../_components/Workspace';

export const metadata: Metadata = {
  title: 'Your Resumes — Resume Builder',
  description: 'Your private resume workspace. Everything is stored only in this browser.',
  robots: { index: false, follow: false },
  alternates: { canonical: 'https://resumebuilder.freeqrcode.tools/app' },
};

export default function ResumeWorkspacePage() {
  return <Workspace />;
}
