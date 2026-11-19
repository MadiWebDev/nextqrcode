import type { Metadata } from 'next';
import { SharedResumeView } from '../_components/SharedResumeView';

export const metadata: Metadata = {
  title: 'Shared Resume — Resume Builder',
  robots: { index: false, follow: false },
};

export default function ViewPage() {
  return <SharedResumeView />;
}
