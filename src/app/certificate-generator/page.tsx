'use client';

import { useRef, useState } from 'react';
import { Award, Download, PenLine, Printer } from 'lucide-react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { AdSlot } from '@/components/AdSlot';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const THEMES: Record<
  string,
  { border: string, soft: string, seal: string, label: string }
> = {
  gold: { border: '#b8860b', soft: '#f7ecd2', seal: '#b8860b', label: 'Classic Gold' },
  blue: { border: '#1d4ed8', soft: '#e3ecfd', seal: '#1d4ed8', label: 'Modern Blue' },
  black: { border: '#111827', soft: '#e5e7eb', seal: '#111827', label: 'Minimal Black' },
};

const CERT_W = 1123;
const CERT_H = 794;

const FAQS = [
  {
    question: 'What size and resolution should a printable certificate be?',
    answer:
      'Certificates are normally printed on A4 landscape, 297 × 210 mm. At the professional print standard of 300 DPI that is 3508 × 2480 pixels. This generator designs on an exact A4-ratio canvas of 1123 × 794 and lets you export at 3× — 3369 × 2382 pixels, about 288 DPI, which is visually indistinguishable from 300 DPI on paper. Use 3× for anything going to a printer or print shop, and 2× (2246 × 1588) for certificates that will only be emailed, shared or shown on screen.',
  },
  {
    question: 'What paper should certificates be printed on?',
    answer:
      'A smooth, heavy stock transforms the same design: 250–300 gsm matte or silk card is the sweet spot — stiff enough to feel substantial, still fine in office printers that accept card. Avoid glossy photo paper, which makes formal designs look like flyers, and avoid textured stock under fine border lines, which can break the line. If certificates will be framed, matte stock also avoids reflections under glass. Always print one test sheet and check border alignment before a full run.',
  },
  {
    question: 'What wording should go on a certificate?',
    answer:
      'Keep the classical order: the kind of certificate (Certificate of Achievement, Completion, Appreciation), who it is presented to, what for, and who says so. The programme line should name the course, role or achievement precisely — "Advanced First Aid Training, Level 2" convinces; "Training" does not. The description line is for one warm, specific sentence: what the person did, over what period, and any result worth recording. Finish with the date (the date of the achievement or the ceremony — be consistent across a set) and the names and titles of up to two signatories.',
  },
  {
    question: 'Can these certificates be verified or faked?',
    answer:
      'Be clear-eyed: a certificate image or printout is a presentation document, not proof by itself — anyone can type a name into a generator, including this one. What gives a certificate weight is the issuer behind it. If verification matters (professional training, safety courses), keep your own register of recipient names, dates and a reference number, and put that reference number on the certificate — in the description line, for example "Register No. 2026-118". Anyone checking can then confirm against your register. This tool keeps no records and issues no credentials.',
  },
  {
    question: 'How do I make certificates for a whole class or team?',
    answer:
      'Set the design once — title, programme line, theme, date and signatories — then change only the recipient name (and the description line when it mentions an individual result) for each person, downloading one PNG per recipient. Work from the official class list so spellings match your records exactly, and name each downloaded file with the recipient and reference number before moving on. For a ceremony, sort the printouts in presentation order the night before; mis-ordered certificates are the most common and most avoidable ceremony hiccup.',
  },
];

export default function CertificateGeneratorPage() {
  const [title, setTitle] = useState('Certificate of Achievement');
  const [recipient, setRecipient] = useState('Fatima Noor');
  const [programme, setProgramme] = useState('Advanced Diploma in Digital Marketing');
  const [description, setDescription] = useState(
    'For successfully completing the programme with distinction and ranking first in the final project assessment.'
  );
  const [date, setDate] = useState('10 November 2026');
  const [issuer, setIssuer] = useState('Bright Skills Institute');
  const [signatory1, setSignatory1] = useState('Dr. Sarah Malik');
  const [signatory1Title, setSignatory1Title] = useState('Director');
  const [signatory2, setSignatory2] = useState('James Carter');
  const [signatory2Title, setSignatory2Title] = useState('Programme Head');
  const [theme, setTheme] = useState('gold');
  const [scale, setScale] = useState('3');
  const svgRef = useRef<SVGSVGElement>(null);

  const t = THEMES[theme];

  const downloadPng = async () => {
    if (!svgRef.current) return;
    const clone = svgRef.current.cloneNode(true) as SVGSVGElement;
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    clone.setAttribute('width', String(CERT_W));
    clone.setAttribute('height', String(CERT_H));
    const xml = new XMLSerializer().serializeToString(clone);
    const url = URL.createObjectURL(new Blob([xml], { type: 'image/svg+xml;charset=utf-8' }));
    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('Could not render the certificate image'));
      img.src = url;
    });
    const s = Number(scale);
    const canvas = document.createElement('canvas');
    canvas.width = CERT_W * s;
    canvas.height = CERT_H * s;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    URL.revokeObjectURL(url);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `certificate-${(recipient || 'recipient')
        .replace(/[^a-z0-9-]+/gi, '-')
        .toLowerCase()}.png`;
      a.click();
      window.setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    }, 'image/png');
  };

  const field = (
    id: string,
    label: string,
    value: string,
    set: (v: string) => void,
    placeholder?: string
  ) => (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        value={value}
        onChange={(e) => set(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <Breadcrumbs items={[{ label: 'Certificate Generator', href: '/certificate-generator' }]} />

      <header className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight flex items-center gap-3">
          <Award className="w-9 h-9 text-primary" aria-hidden="true" />
          Certificate Generator
        </h1>
        <p className="text-muted-foreground max-w-3xl">
          Create formal, print-ready certificates for courses, training, school awards, employee
          recognition and appreciation — with the recipient&apos;s name set large, your programme
          and signatories in place, and a seal and double border doing the visual heavy lifting.
          The design sits on a true A4 landscape canvas and exports up to 3369 × 2382 pixels, sharp
          enough for a print shop. Like every tool here, it runs entirely in your browser:
          recipient lists and names are never uploaded, stored or shared. Whether you need one
          certificate for a star employee or forty for a graduating class, you set the design once
          and change only the name.
        </p>
      </header>

      <Card className="p-5 sm:p-6 space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {field('ctitle', 'Certificate title', title, setTitle)}
          {field('recipient', 'Recipient name', recipient, setRecipient)}
          {field('programme', 'Programme / course / reason', programme, setProgramme)}
          {field('cdesc', 'Description line', description, setDescription)}
          {field('cdate', 'Date', date, setDate)}
          {field('issuer', 'Issuing organisation', issuer, setIssuer)}
          {field('sig1', 'Signatory 1 name', signatory1, setSignatory1)}
          {field('sig1t', 'Signatory 1 title', signatory1Title, setSignatory1Title)}
          {field('sig2', 'Signatory 2 name', signatory2, setSignatory2)}
          {field('sig2t', 'Signatory 2 title', signatory2Title, setSignatory2Title)}
          <div className="space-y-1.5">
            <Label htmlFor="ctheme">Border style</Label>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger id="ctheme">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(THEMES).map(([key, v]) => (
                  <SelectItem key={key} value={key}>
                    {v.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cscale">Download size</Label>
            <Select value={scale} onValueChange={setScale}>
              <SelectTrigger id="cscale">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3× — for printing (3369 × 2382)</SelectItem>
                <SelectItem value="2">2× — for screen / email (2246 × 1588)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${CERT_W} ${CERT_H}`}
            className="w-full max-w-[760px] mx-auto rounded-xl shadow-md border border-border"
            role="img"
            aria-label="Certificate preview"
          >
            <rect x="0" y="0" width={CERT_W} height={CERT_H} fill="#fffdf7" />
            <rect x="28" y="28" width={CERT_W - 56} height={CERT_H - 56} fill="none" stroke={t.border} strokeWidth="5" />
            <rect x="44" y="44" width={CERT_W - 88} height={CERT_H - 88} fill="none" stroke={t.border} strokeWidth="1.5" />
            <circle cx={CERT_W / 2} cy="150" r="46" fill={t.soft} stroke={t.seal} strokeWidth="3" />
            <circle cx={CERT_W / 2} cy="150" r="34" fill="none" stroke={t.seal} strokeWidth="1.5" />
            <text
              x={CERT_W / 2}
              y="163"
              textAnchor="middle"
              fontFamily="Georgia, 'Times New Roman', serif"
              fontSize="30"
              fill={t.seal}
            >
              ★
            </text>
            <text
              x={CERT_W / 2}
              y="262"
              textAnchor="middle"
              fontFamily="Georgia, 'Times New Roman', serif"
              fontSize="47"
              fontWeight="bold"
              letterSpacing="2"
              fill="#1f2937"
            >
              {title || 'Certificate'}
            </text>
            <text
              x={CERT_W / 2}
              y="308"
              textAnchor="middle"
              fontFamily="Arial, Helvetica, sans-serif"
              fontSize="17"
              letterSpacing="4"
              fill="#6b7280"
            >
              THIS CERTIFICATE IS PROUDLY PRESENTED TO
            </text>
            <text
              x={CERT_W / 2}
              y="392"
              textAnchor="middle"
              fontFamily="Georgia, 'Times New Roman', serif"
              fontStyle="italic"
              fontSize="64"
              fill={t.border}
            >
              {recipient || 'Recipient Name'}
            </text>
            <line x1={CERT_W / 2 - 300} y1="420" x2={CERT_W / 2 + 300} y2="420" stroke={t.border} strokeWidth="1.5" />
            <text
              x={CERT_W / 2}
              y="466"
              textAnchor="middle"
              fontFamily="Arial, Helvetica, sans-serif"
              fontSize="22"
              fill="#374151"
            >
              {programme}
            </text>
            <text
              x={CERT_W / 2}
              y="506"
              textAnchor="middle"
              fontFamily="Arial, Helvetica, sans-serif"
              fontSize="17"
              fill="#6b7280"
            >
              {description}
            </text>
            <text
              x={CERT_W / 2}
              y="566"
              textAnchor="middle"
              fontFamily="Arial, Helvetica, sans-serif"
              fontSize="16"
              fill="#6b7280"
            >
              {`Awarded on ${date} · ${issuer}`}
            </text>
            <text
              x="210"
              y="682"
              textAnchor="middle"
              fontFamily="Georgia, 'Times New Roman', serif"
              fontStyle="italic"
              fontSize="27"
              fill="#1f2937"
            >
              {signatory1}
            </text>
            <line x1="90" y1="700" x2="330" y2="700" stroke="#9ca3af" strokeWidth="1.5" />
            <text
              x="210"
              y="726"
              textAnchor="middle"
              fontFamily="Arial, Helvetica, sans-serif"
              fontSize="14"
              letterSpacing="2"
              fill="#6b7280"
            >
              {signatory1Title.toUpperCase()}
            </text>
            <text
              x={CERT_W - 210}
              y="682"
              textAnchor="middle"
              fontFamily="Georgia, 'Times New Roman', serif"
              fontStyle="italic"
              fontSize="27"
              fill="#1f2937"
            >
              {signatory2}
            </text>
            <line x1={CERT_W - 330} y1="700" x2={CERT_W - 90} y2="700" stroke="#9ca3af" strokeWidth="1.5" />
            <text
              x={CERT_W - 210}
              y="726"
              textAnchor="middle"
              fontFamily="Arial, Helvetica, sans-serif"
              fontSize="14"
              letterSpacing="2"
              fill="#6b7280"
            >
              {signatory2Title.toUpperCase()}
            </text>
          </svg>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={downloadPng} size="lg">
            <Download className="w-4 h-4 mr-2" aria-hidden="true" />
            Download certificate PNG
          </Button>
          <p className="text-sm text-muted-foreground flex items-center gap-1.5">
            <Printer className="w-4 h-4" aria-hidden="true" />
            Choose 3× for print (about 288 DPI on A4) and 2× for email or sharing.
          </p>
        </div>
      </Card>

      <AdSlot id="certificate-generator-after-tool" format="horizontal-banner" />

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">How to create a certificate in four steps</h2>
        <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">
          <li>
            <strong className="text-foreground">Name the award precisely.</strong> &quot;Certificate
            of Completion — Food Hygiene Level 2&quot; tells the reader exactly what was earned.
            Vague titles produce vague certificates that recipients quietly leave in drawers.
          </li>
          <li>
            <strong className="text-foreground">Enter the recipient and the reason.</strong> Type
            the name exactly as it should appear — check the spelling against the official list,
            because a misspelled name is the one error every recipient notices. Use the description
            line for one specific, generous sentence about what they did.
          </li>
          <li>
            <strong className="text-foreground">Add the issuer and signatories.</strong> The
            organisation line and up to two signatories with their titles give the document its
            authority. Keep titles short — Director, Head of Training, Principal — so they sit
            cleanly under the signature lines.
          </li>
          <li>
            <strong className="text-foreground">Pick a border, download at 3×, print on card.</strong>{' '}
            Gold for traditional and academic settings, blue for corporate training, black for a
            restrained modern look. Then print on 250–300 gsm matte card, or send the file to a
            print shop with the same instruction.
          </li>
        </ol>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
          <PenLine className="w-6 h-6 text-primary" aria-hidden="true" />
          Wording that makes a certificate worth framing
        </h2>
        <p className="text-muted-foreground">
          Recipients keep certificates that say something true and specific about them, and bin the
          ones that could have been handed to anyone. The structure that works: achievement first
          (&quot;has successfully completed&quot;), the programme named in full with its level or
          duration, then one human sentence — the project they led, the distinction they earned,
          the streak they kept, the standard they set. For appreciation certificates, name the act
          and its effect: not &quot;for hard work&quot; but &quot;for redesigning the intake
          process, cutting patient waiting times by a third this winter&quot;. For school awards,
          the same rule applies at smaller scale — &quot;for the most improved handwriting in
          Grade 4&quot; will be treasured longer than a generic &quot;good student&quot; line.
          Watch the small consistencies across a batch: the same date format, the same signatory
          order, capitalisation of course names, and one spelling system. A wall of certificates
          from the same institution should look and read like siblings.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Printing certificates properly</h2>
        <p className="text-muted-foreground">
          A certificate lives or dies on paper and resolution. The canvas here is true A4 landscape
          ratio (297 × 210 mm). Full 300 DPI print needs 3508 × 2480 pixels; the 3× export gives
          3369 × 2382 — about 288 DPI, a difference no eye can detect on matte card, and a good
          reason to choose 3× for anything physical. Print on 250–300 gsm smooth matte or silk
          card: heavy enough to hand over with confidence, light enough for office printers rated
          for card. Set the printer to A4, landscape, 100% scale (never &quot;fit to page&quot;,
          which shrinks the design and fattens the margins unevenly), and the highest quality
          setting. The double border sits 28 and 44 units inside the edge — roughly 7 and 11 mm —
          safely inside the printable area of almost all printers, but run one test sheet: if your
          printer clips borders, it will clip them on the test, not on the ceremony stack. For
          framing, standard A4 frames and document frames fit without trimming; for shop printing,
          send the 3× PNG and specify A4 landscape, no scaling, on 300 gsm matte.
        </p>
      </section>

      <AdSlot id="certificate-generator-in-content" format="in-article" />

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">When certificates are used</h2>
        <p className="text-muted-foreground">
          Training providers close every cohort with one: short courses, safety certifications,
          software bootcamps, first aid, food hygiene, language levels. Schools issue them for
          term awards, reading milestones, sports and attendance. Companies use the appreciation
          format for milestones that deserve more than an email — years of service, a rescued
          project, a peer-nominated award — and the completion format for internal academies and
          onboarding programmes. Community groups, sports clubs and religious schools use them for
          volunteers and participants, where the certificate may be the only formal thank-you a
          person receives. In each case the pattern is the same: a named person, a specific
          achievement, an identifiable issuer, and a date — the four things this form puts on the
          page.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Frequently asked questions</h2>
        <dl className="space-y-3">
          {FAQS.map((f) => (
            <div key={f.question} className="border border-border/70 rounded-xl p-4 bg-card">
              <dt className="font-semibold text-foreground">{f.question}</dt>
              <dd className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{f.answer}</dd>
            </div>
          ))}
        </dl>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: FAQS.map((f) => ({
                '@type': 'Question',
                name: f.question,
                acceptedAnswer: { '@type': 'Answer', text: f.answer },
              })),
            }),
          }}
        />
      </section>
    </div>
  );
}
