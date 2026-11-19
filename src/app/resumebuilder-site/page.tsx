import Link from 'next/link';
import { JsonLd } from '@/lib/seo/jsonld';
import { AdSlot } from '@/components/AdSlot';
import {
  ShieldCheck,
  FileText,
  FileDown,
  LayoutTemplate,
  QrCode,
  ScanSearch,
  Globe2,
  HardDriveDownload,
} from 'lucide-react';

const FAQS = [
  {
    q: 'Is this resume builder really free?',
    a: 'Yes. Every template, the PDF and DOCX downloads, the photo tools and the ATS check are free, with no sign-up, no watermark and no paywalled download button. The site is supported by ads shown on content pages — never inside the editor.',
  },
  {
    q: 'Where is my resume data stored?',
    a: 'Only in your own browser, in its local database (IndexedDB). Nothing about your resume, photo or contact details is sent to a server. That also means your data lives on this device: use the built-in backup export if you want a copy you can move or restore.',
  },
  {
    q: 'Can I download a real PDF and an editable Word file?',
    a: 'Yes. The PDF contains real, selectable text (not a picture of your resume), so applicant tracking systems can read it, and the DOCX is a genuinely editable Word document built from real paragraphs and styles. Both are generated on your device.',
  },
  {
    q: 'What does ATS-safe mean here?',
    a: 'Templates labelled ATS-safe use a single reading order, standard section headings and real text throughout — no text baked into images and no layout tricks that break parsing. We verify the label by extracting the text from generated PDFs and checking the order, not just by asserting it.',
  },
  {
    q: 'Should my resume have a photo?',
    a: 'It depends on the country and the job. In the US, Canada and the UK a photo is usually discouraged; in much of Europe, the Gulf and South Asia it is commonly expected. The builder offers regional modes that set sensible defaults and explain the reasoning — the choice is always yours.',
  },
  {
    q: 'Can I add a QR code to my resume?',
    a: 'Yes — an optional QR code can link to your portfolio, LinkedIn or GitHub profile, open a WhatsApp chat, or carry a vCard of the contact details you choose. The code is generated locally and checked for contrast and scannability before it goes on the page.',
  },
];

const FEATURES = [
  {
    icon: LayoutTemplate,
    title: '45+ profession templates',
    body: 'Structurally different designs for teachers, engineers, medical staff, trades, business and more — not recolours of one layout. Each states plainly whether it is ATS-safe or designed.',
  },
  {
    icon: FileDown,
    title: 'Real PDF & DOCX',
    body: 'Selectable-text PDF with embedded fonts and clickable links, plus a truly editable Word document. PNG, TXT, Markdown, HTML and JSON exports too.',
  },
  {
    icon: ShieldCheck,
    title: 'Private by default',
    body: 'Your resume, photo and personal details stay in your browser. Exports are rendered on your device. No account, no upload, no tracking of your content.',
  },
  {
    icon: ScanSearch,
    title: 'Explainable ATS check',
    body: 'A checklist-based health check that shows every deduction, the evidence in your resume and how to fix it — labelled honestly as an estimate, not a real employer system.',
  },
  {
    icon: QrCode,
    title: 'Optional QR code',
    body: 'Link a portfolio, start a WhatsApp chat or share a vCard. Placement, size and label are yours to choose, with a built-in scan check.',
  },
  {
    icon: Globe2,
    title: 'Regional modes & scripts',
    body: 'US/Canada, UK/Ireland, EU, Gulf, South Asia and academic defaults for photos, sections and dates — and correct rendering for Urdu, Arabic and Hindi resumes.',
  },
];

const TEMPLATE_FAMILIES = [
  { name: 'Education', examples: 'Teacher, Professor, Early-Childhood Educator, School Principal' },
  { name: 'Engineering', examples: 'Software, Civil, Mechanical, Electrical, Chemical, Site Engineer' },
  { name: 'Medical', examples: 'Physician, Surgeon, Nurse, Pharmacist, Dentist, Lab Technician' },
  { name: 'Skilled trades', examples: 'Mechanic, Electrician, Plumber/HVAC, Welder, Driver, Carpenter' },
  { name: 'Business', examples: 'Accountant, Executive, Sales, Marketing, HR, Project Manager, Lawyer, Banker' },
  { name: 'Tech & creative', examples: 'Designer/UX, Data Analyst, IT Support, Writer' },
  { name: 'General', examples: 'Fresher, Hospitality, Customer Service, Gulf Job Seeker, Minimal ATS, Timeline' },
];

export default function ResumeBuilderHomePage() {
  return (
    <main>
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'Resume Builder — Free CV Maker',
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Web browser',
            url: 'https://resumebuilder.freeqrcode.tools/',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
            description:
              'Free resume and CV builder with 45+ profession-specific templates, real PDF and DOCX export, profile photo and QR code support. All data stays in the browser.',
          },
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: FAQS.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          },
        ]}
      />

      <section className="mx-auto max-w-6xl px-4 pt-14 pb-10 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Free resume builder &amp; CV maker — no sign-up, no watermark
          </h1>
          <p className="mt-5 text-lg text-muted-foreground">
            Pick from 45+ templates designed for real professions, add your photo and an optional
            QR code, check your resume against an explainable ATS checklist, and download a real
            PDF or editable Word file. Everything happens in your browser: your data never leaves
            your device.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="#templates"
              className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              Browse templates
            </Link>
            <Link
              href="#privacy"
              className="rounded-md border border-input px-5 py-2.5 text-sm font-medium hover:bg-muted"
            >
              How your privacy works
            </Link>
          </div>
          <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <HardDriveDownload className="h-4 w-4" aria-hidden />
            Saved automatically in this browser — come back any time and continue where you left off.
          </p>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight">What the builder does</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <article key={f.title} className="rounded-lg border border-border bg-card p-5">
              <f.icon className="h-6 w-6 text-primary" aria-hidden />
              <h3 className="mt-3 font-semibold">{f.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{f.body}</p>
            </article>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <AdSlot id="resumebuilder-landing-mid" format="horizontal-banner" />
      </div>

      <section id="templates" className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
          <FileText className="h-6 w-6 text-primary" aria-hidden /> Templates by profession
        </h2>
        <p className="mt-3 max-w-3xl text-muted-foreground">
          Each template has its own structure — header style, section order and heading treatment
          differ, because a nurse&apos;s CV and a welder&apos;s CV should not look like the same
          form with different colours. Templates that a profession does not need (a photo for US
          applications, publications for academic CVs) are handled by regional and profession
          defaults you can override.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TEMPLATE_FAMILIES.map((family) => (
            <article key={family.name} className="rounded-lg border border-border p-5">
              <h3 className="font-semibold">{family.name}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{family.examples}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="privacy" className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight">Your data stays on your device</h2>
        <div className="mt-4 max-w-3xl space-y-3 text-muted-foreground">
          <p>
            The builder has no account system and no server copy of your resume. Your details,
            photo and documents are stored in your browser&apos;s local database and every export
            — PDF, Word, images — is produced on your device. Share links, when you choose to
            create one, carry the data inside the link itself (in the part after the # symbol,
            which browsers never send to a server) and never include your photo.
          </p>
          <p>
            The trade-off is honest: if you clear this browser&apos;s data, your saved resumes go
            with it. The builder offers one-click backups (optionally protected with a password
            only you know) so you can keep your own copy.
          </p>
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-6xl px-4 py-10 pb-16 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight">Frequently asked questions</h2>
        <div className="mt-6 max-w-3xl space-y-3">
          {FAQS.map((f) => (
            <details key={f.q} className="rounded-lg border border-border p-4">
              <summary className="cursor-pointer font-medium">{f.q}</summary>
              <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
