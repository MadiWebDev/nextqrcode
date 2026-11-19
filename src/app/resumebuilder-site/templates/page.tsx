import type { Metadata } from 'next';
import { Gallery } from '../_components/Gallery';

export const metadata: Metadata = {
  title: 'Resume Templates — 47 Profession Designs, ATS-Safe & Designed',
  description:
    'Browse 47 free resume templates by profession: ATS-safe single-column designs and designed layouts with photos and sidebars. Preview each with real sample content, then build yours free — no sign-up, no watermark.',
  alternates: { canonical: 'https://resumebuilder.freeqrcode.tools/templates' },
};

export default function TemplatesPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight">Resume templates by profession</h1>
      <p className="mt-3 max-w-3xl text-muted-foreground">
        Every template below is a real, working design — the previews are rendered live from each
        template&apos;s own fictional sample resume, not screenshots. ATS-safe templates use a
        single column and standard headings that applicant tracking systems parse reliably;
        designed templates add photos, sidebars and timelines for human readers. Your content
        moves between templates without retyping.
      </p>
      <Gallery />
    </main>
  );
}
