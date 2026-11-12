'use client';

import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Download, GraduationCap, ImagePlus, QrCode, ShieldCheck } from 'lucide-react';
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

const THEMES: Record<string, { header: string, sub: string, label: string }> = {
  navy: { header: '#1e3a8a', sub: '#3b82f6', label: 'Navy & Sky' },
  emerald: { header: '#065f46', sub: '#10b981', label: 'Emerald' },
  maroon: { header: '#7f1d1d', sub: '#dc2626', label: 'Maroon' },
  charcoal: { header: '#1f2937', sub: '#6b7280', label: 'Charcoal' },
};

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const CARD_W = 856;
const CARD_H = 540;

function readFile(file: File, onLoad: (url: string) => void) {
  const reader = new FileReader();
  reader.onload = () => {
    if (typeof reader.result === 'string') onLoad(reader.result);
  };
  reader.readAsDataURL(file);
}

const FAQS = [
  {
    question: 'What size is a student ID card, and what size is this design?',
    answer:
      'School ID cards almost everywhere follow the CR80 standard: 85.6 mm × 53.98 mm, the same size as a bank card. This generator designs at exactly that ratio (an 856 × 540 canvas) and exports the PNG at three times that size, 2568 × 1620 pixels, which prints at well over 300 DPI at CR80 size. If your card printer asks for a bleed area, add 3 mm on each side in your printer software and keep faces and text inside the safe zone.',
  },
  {
    question: 'Is it safe to enter student details and photos here?',
    answer:
      'Yes — the generator runs entirely in your web browser. Names, photos and phone numbers are never uploaded to a server, never stored by us, and disappear when you close the tab. Because student records are sensitive, we recommend designing cards on a school computer rather than a shared one, downloading the finished PNGs to your school drive, and handling printed cards and spare prints the same way you handle any pupil record.',
  },
  {
    question: 'What should the QR code on a student ID card contain?',
    answer:
      'Keep it minimal. The safest payload is the admission or roll number on its own: a scanner can match it against your register without the card broadcasting personal data to anyone who photographs it. Avoid encoding home addresses, parent phone numbers or medical details in the QR code — anyone with a phone camera can read a printed QR code, so treat its contents as public. The name + class + roll option is a reasonable middle ground for internal attendance use.',
  },
  {
    question: 'What photo works best for a student ID card?',
    answer:
      'A plain, well-lit head-and-shoulders photo against a light background, taken straight-on at eye level. The photo area on the card is portrait-shaped, so a portrait photo fills it without heavy cropping. Avoid group photos, sunglasses, hats that shadow the face, and screenshots of photos, which lose sharpness. Most recent phone photos are far higher resolution than the card needs, so file size is rarely a problem.',
  },
  {
    question: 'How do I print the cards — at school or with a card printer?',
    answer:
      'You have three routes. A dedicated PVC card printer (the kind used for staff badges) prints the PNG directly at CR80 size with the best durability. A print shop can produce laminated cards from the same file — ask for CR80, 300 DPI, gloss lamination. For a budget option, print on thick 300 gsm card at 100% scale, cut carefully, and seal in a rigid holder; it will not survive a school year like PVC, but it is fine for trips and temporary passes.',
  },
];

export default function StudentIdCardGeneratorPage() {
  const [school, setSchool] = useState('Greenfield High School');
  const [name, setName] = useState('Ayesha Khan');
  const [grade, setGrade] = useState('Grade 8 — Section B');
  const [roll, setRoll] = useState('GF-2026-0142');
  const [dob, setDob] = useState('14 Mar 2012');
  const [blood, setBlood] = useState('B+');
  const [phone, setPhone] = useState('+92 300 1234567');
  const [valid, setValid] = useState('2027');
  const [address, setAddress] = useState('House 12, Street 4, Model Town');
  const [theme, setTheme] = useState('navy');
  const [photo, setPhoto] = useState('');
  const [logo, setLogo] = useState('');
  const [qrEnabled, setQrEnabled] = useState(true);
  const [qrPayload, setQrPayload] = useState('roll');
  const [qrCustom, setQrCustom] = useState('');
  const [qrUrl, setQrUrl] = useState('');
  const svgRef = useRef<SVGSVGElement>(null);

  const t = THEMES[theme];

  useEffect(() => {
    if (!qrEnabled) {
      return;
    }
    const payload =
      qrPayload === 'roll'
        ? roll || 'STUDENT'
        : qrPayload === 'summary'
          ? `${name} | ${grade} | ${roll}`
          : qrCustom || roll || 'STUDENT';
    QRCode.toDataURL(payload, { width: 240, margin: 1 })
      .then(setQrUrl)
      .catch(() => setQrUrl(''));
  }, [qrEnabled, qrPayload, qrCustom, name, grade, roll]);
  const effectiveQrUrl = qrEnabled ? qrUrl : '';

  const downloadPng = async () => {
    if (!svgRef.current) return;
    const clone = svgRef.current.cloneNode(true) as SVGSVGElement;
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    clone.setAttribute('width', String(CARD_W));
    clone.setAttribute('height', String(CARD_H));
    const xml = new XMLSerializer().serializeToString(clone);
    const url = URL.createObjectURL(new Blob([xml], { type: 'image/svg+xml;charset=utf-8' }));
    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('Could not render the card image'));
      img.src = url;
    });
    const scale = 3;
    const canvas = document.createElement('canvas');
    canvas.width = CARD_W * scale;
    canvas.height = CARD_H * scale;
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
      a.download = `student-id-${(roll || 'card').replace(/[^a-z0-9-]+/gi, '-').toLowerCase()}.png`;
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
      <Breadcrumbs items={[{ label: 'Student ID Card Generator', href: '/student-id-card-generator' }]} />

      <header className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight flex items-center gap-3">
          <GraduationCap className="w-9 h-9 text-primary" aria-hidden="true" />
          Student ID Card Generator
        </h1>
        <p className="text-muted-foreground max-w-3xl">
          Design a proper CR80 student ID card — photo, school logo, class, roll number and an
          optional QR code — and download a print-ready PNG in under a minute. Everything happens in
          your browser: pupil names, photographs and phone numbers are never uploaded anywhere,
          which matters when you are handling children&apos;s data. The card is drawn at the exact
          proportions of a standard bank-card-sized ID (85.6 × 53.98 mm), so what you see on screen
          is what comes out of a card printer, with no stretching or surprises. Use it for a whole
          class list one pupil at a time, for replacement cards when one is lost, or for trip and
          event passes that only need to survive a day.
        </p>
      </header>

      <Card className="p-5 sm:p-6 space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {field('school', 'School / institution name', school, setSchool)}
          {field('sname', 'Student name', name, setName)}
          {field('grade', 'Class / grade', grade, setGrade)}
          {field('roll', 'Roll / admission number', roll, setRoll)}
          {field('dob', 'Date of birth', dob, setDob)}
          <div className="space-y-1.5">
            <Label htmlFor="blood">Blood group</Label>
            <Select value={blood} onValueChange={setBlood}>
              <SelectTrigger id="blood">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BLOOD_GROUPS.map((b) => (
                  <SelectItem key={b} value={b}>
                    {b}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {field('phone', 'Guardian / school phone', phone, setPhone)}
          {field('valid', 'Valid through (year)', valid, setValid)}
          {field('address', 'Address (footer line)', address, setAddress)}
          <div className="space-y-1.5">
            <Label htmlFor="theme">Header colour scheme</Label>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger id="theme">
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
            <Label htmlFor="photo">Student photo</Label>
            <Input
              id="photo"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) readFile(f, setPhoto);
              }}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="logo">School logo (optional)</Label>
            <Input
              id="logo"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) readFile(f, setLogo);
              }}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="qrmode">QR code on card</Label>
            <Select
              value={qrEnabled ? qrPayload : 'off'}
              onValueChange={(v) => {
                if (v === 'off') {
                  setQrEnabled(false);
                } else {
                  setQrEnabled(true);
                  setQrPayload(v);
                }
              }}
            >
              <SelectTrigger id="qrmode">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="roll">On — admission number only (safest)</SelectItem>
                <SelectItem value="summary">On — name + class + roll</SelectItem>
                <SelectItem value="custom">On — custom text</SelectItem>
                <SelectItem value="off">Off</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {qrEnabled && qrPayload === 'custom' && field('qrcustom', 'Custom QR text', qrCustom, setQrCustom)}
        </div>

        <div className="overflow-x-auto">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${CARD_W} ${CARD_H}`}
            className="w-full max-w-[640px] mx-auto rounded-xl shadow-md border border-border"
            role="img"
            aria-label="Student ID card preview"
          >
            <defs>
              <clipPath id="studentPhotoClip">
                <rect x="40" y="150" width="200" height="252" rx="14" />
              </clipPath>
              <clipPath id="studentLogoClip">
                <rect x="28" y="24" width="66" height="66" rx="10" />
              </clipPath>
            </defs>
            <rect x="0" y="0" width={CARD_W} height={CARD_H} fill="#ffffff" />
            <rect x="0" y="0" width={CARD_W} height="118" fill={t.header} />
            <rect x="0" y="118" width={CARD_W} height="8" fill={t.sub} />
            {logo ? (
              <image href={logo} x="28" y="24" width="66" height="66" clipPath="url(#studentLogoClip)" preserveAspectRatio="xMidYMid slice" />
            ) : (
              <rect x="28" y="24" width="66" height="66" rx="10" fill="#ffffff" opacity="0.18" />
            )}
            <text x="112" y="66" fontFamily="Arial, Helvetica, sans-serif" fontSize="31" fontWeight="bold" fill="#ffffff">
              {school || 'School Name'}
            </text>
            <text x="112" y="96" fontFamily="Arial, Helvetica, sans-serif" fontSize="17" letterSpacing="3" fill="#ffffff" opacity="0.85">
              STUDENT IDENTITY CARD
            </text>
            <rect x="40" y="150" width="200" height="252" rx="14" fill="#e5e7eb" />
            {photo ? (
              <image href={photo} x="40" y="150" width="200" height="252" clipPath="url(#studentPhotoClip)" preserveAspectRatio="xMidYMid slice" />
            ) : (
              <text x="140" y="285" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" fontSize="19" fill="#6b7280">
                PHOTO
              </text>
            )}
            <text x="272" y="196" fontFamily="Arial, Helvetica, sans-serif" fontSize="37" fontWeight="bold" fill="#111827">
              {name || 'Student Name'}
            </text>
            <text x="272" y="240" fontFamily="Arial, Helvetica, sans-serif" fontSize="21" fill="#374151">
              {grade}
            </text>
            <text x="272" y="288" fontFamily="Arial, Helvetica, sans-serif" fontSize="19" fill="#4b5563">
              {`Roll / Adm No:  ${roll}`}
            </text>
            <text x="272" y="322" fontFamily="Arial, Helvetica, sans-serif" fontSize="19" fill="#4b5563">
              {`Date of Birth:  ${dob}`}
            </text>
            <text x="272" y="356" fontFamily="Arial, Helvetica, sans-serif" fontSize="19" fill="#4b5563">
              {`Blood Group:  ${blood}`}
            </text>
            <text x="272" y="390" fontFamily="Arial, Helvetica, sans-serif" fontSize="19" fill="#4b5563">
              {`Phone:  ${phone}`}
            </text>
            {effectiveQrUrl && (
              <>
                <image href={effectiveQrUrl} x="706" y="330" width="118" height="118" />
                <text x="765" y="470" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" fontSize="13" fill="#6b7280">
                  SCAN TO VERIFY
                </text>
              </>
            )}
            <rect x="0" y="486" width={CARD_W} height="54" fill={t.header} />
            <text x="32" y="520" fontFamily="Arial, Helvetica, sans-serif" fontSize="16" fill="#ffffff">
              {address}
            </text>
            <text x="824" y="520" textAnchor="end" fontFamily="Arial, Helvetica, sans-serif" fontSize="16" fontWeight="bold" fill="#ffffff">
              {`VALID THRU ${valid}`}
            </text>
          </svg>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={downloadPng} size="lg">
            <Download className="w-4 h-4 mr-2" aria-hidden="true" />
            Download print-ready PNG
          </Button>
          <p className="text-sm text-muted-foreground flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" aria-hidden="true" />
            Exports at 2568 × 1620 px. Photo and details never leave this tab.
          </p>
        </div>
      </Card>

      <AdSlot id="student-id-card-generator-after-tool" format="horizontal-banner" />

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">How it works</h2>
        <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">
          <li>
            <strong className="text-foreground">Fill in the pupil&apos;s details.</strong> School
            name, student name, class, roll or admission number, date of birth, blood group and a
            contact number. Keep the name exactly as it appears in the register — this card will be
            checked against it at the gate, on trips and at exam doors.
          </li>
          <li>
            <strong className="text-foreground">Add a photo and, if you have one, the school logo.</strong>{' '}
            Both are read straight from your computer into the preview. A plain-background,
            head-and-shoulders photo works best; the portrait frame crops it to shape
            automatically.
          </li>
          <li>
            <strong className="text-foreground">Choose a colour scheme and QR setting.</strong> Four
            header colours cover most school uniforms and house colours. For the QR code, the
            admission-number-only option is the safest default for children.
          </li>
          <li>
            <strong className="text-foreground">Download and print.</strong> The PNG is exported at
            three times card size for sharp printing. Print it on a PVC card printer, send it to a
            print shop for laminated CR80 cards, or print on heavy card for short-term passes.
          </li>
        </ol>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">What belongs on a student ID card</h2>
        <p className="text-muted-foreground">
          A student ID card has one job: let a teacher, guard or bus driver confirm in seconds that
          the child in front of them is who they should be, and know who to call if something is
          wrong. That means a clear recent photo, the pupil&apos;s full name, class and a unique
          roll or admission number are essential. Date of birth helps staff verify identity
          verbally and matters for age-banded activities. Blood group is standard on school cards
          across South Asia and the Middle East because it speeds up first response in an
          emergency, though it should always be confirmed against medical records before any
          treatment decision. A guardian or school office phone number is the most useful line on
          the whole card when a child is lost, ill or travelling. What does not belong on the front
          of a child&apos;s card: a full home address in large type (a short footer line is enough),
          national ID numbers, or anything encoded in the QR code that you would not want a
          stranger with a phone camera to read. If your school prints a back side, the back is the
          right place for the full address, the school&apos;s lost-card instructions — &quot;if
          found, please return to…&quot; — and an authorised signature strip.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Design and print specifications</h2>
        <p className="text-muted-foreground">
          The card uses the CR80 format, 85.6 mm × 53.98 mm with 3.375 inch × 2.125 inch
          dimensions, the same blank used for bank cards and most school ID systems worldwide, so
          it fits standard lanyards, holders and card-printer trays. Professional card printing
          runs at 300 DPI, which needs 1012 × 638 pixels at finished size; this generator exports
          2568 × 1620 pixels, comfortably above that, so text and photos stay crisp. Leave a quiet
          margin: keep faces at least 4 mm from any edge, because card printers and guillotines
          wander by a millimetre or two. If you print on PVC, choose gloss lamination for outdoor
          use and matte if cards will be photographed or scanned often, since glare defeats phone
          cameras. For the QR code, print it at 12 mm or larger, keep it on a white quiet zone, and
          test-scan the first printed card with an ordinary phone before printing a whole class
          set — ink spread on uncoated card is the number one cause of unscannable school IDs. If
          cards will be punched for lanyard clips, use the top-centre slot position and keep the
          header text clear of it; a hole through the school name is a classic first-batch mistake.
        </p>
      </section>

      <AdSlot id="student-id-card-generator-in-content" format="in-article" />

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Where schools use cards like these</h2>
        <p className="text-muted-foreground">
          The obvious use is the everyday school ID worn on a lanyard, but the same design serves
          several other jobs. Exam entry cards for board-style tests, where invigilators match
          face, name and roll number at the door. School trip and sports-day passes, printed on
          card for a day and colour-coded by group using the header themes. Library and computer
          lab cards where the QR or roll number doubles as the borrower ID. Bus and van passes,
          where drivers need the guardian phone number more than anything else. Tuition centres,
          academies and summer camps issuing short-life IDs for a single term. And replacement
          cards: when a pupil loses theirs mid-year, the office can regenerate an identical card
          from the register in two minutes instead of waiting for the annual print run.
        </p>
        <h2 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
          <ImagePlus className="w-6 h-6 text-primary" aria-hidden="true" />
          Tips for cards that survive the school year
        </h2>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>Photograph pupils against the same plain wall, at the same distance, in the same week — a consistent set looks professional and makes face-checking faster.</li>
          <li>Put the valid-through year in large type; expired cards get spotted instantly at the gate and reissue lists become trivial to build.</li>
          <li>Never encode a child&apos;s home address or medical details in the QR code. Roll number only — the register holds the sensitive data, the card holds a key to it.</li>
          <li>Print one test card and scan the QR code, check the colours against the uniform, and proofread the phone number before committing to a full class set.</li>
          <li>Keep a spreadsheet mapping roll numbers to card issue dates, so a found card can be matched to its owner and lost cards can be invalidated in your records.</li>
        </ul>
        <p className="text-muted-foreground flex items-start gap-2">
          <QrCode className="w-5 h-5 mt-0.5 shrink-0 text-primary" aria-hidden="true" />
          A note on privacy: because this tool never transmits data, it is suitable for use under
          school data-handling policies that prohibit uploading pupil photos to unknown websites.
          The PNG files you download are ordinary images — store and share them with the same care
          you give the school register.
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
