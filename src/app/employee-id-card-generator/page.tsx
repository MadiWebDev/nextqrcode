'use client';

import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Building2, Download, KeyRound, ShieldAlert } from 'lucide-react';
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

const THEMES: Record<string, { band: string, accent: string, label: string }> = {
  corporate: { band: '#0f2a52', accent: '#2563eb', label: 'Corporate Blue' },
  teal: { band: '#134e4a', accent: '#14b8a6', label: 'Deep Teal' },
  slate: { band: '#334155', accent: '#94a3b8', label: 'Slate Grey' },
  burgundy: { band: '#4c0519', accent: '#e11d48', label: 'Burgundy' },
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
    question: 'Can the QR code on an employee badge work with our door access system?',
    answer:
      'No — and it is important to understand why. A printed QR code is a picture anyone can photocopy in seconds, so it can identify a person but it cannot securely authenticate them. Real access control needs a credential that is hard to clone, such as an RFID/NFC card, a phone-based credential, or a PIN. Use the QR on these badges for visual identification, attendance check-in, visitor sign-in matching, or pulling up a staff profile — and let your door system keep its own secure cards or fobs.',
  },
  {
    question: 'What information should an employee ID card show?',
    answer:
      'The working minimum is: employee photograph, full name, job title or designation, department, and a unique employee ID number that matches your HR records. Blood group and an emergency contact number earn their space in workplaces with physical risk — warehouses, factories, field sites — and add clutter in a small office, so decide by environment. A valid-through year helps security staff spot badges that should have been handed back. Company registration numbers, personal phone numbers and home addresses do not belong on a badge that is worn in public.',
  },
  {
    question: 'How do we issue these badges across a whole company?',
    answer:
      'Standardise first: fix one template, one photo style and one naming format for employee IDs, then work through the staff list department by department. This generator handles one card at a time, which suits new starters, replacements and small teams well. For a first issue of hundreds of badges, use the same design values here to brief a print vendor, or print in-house in daily batches. Keep an issue log — badge number, employee, date issued, date returned — from day one; retrofitting one later is painful.',
  },
  {
    question: 'What happens when an employee leaves or loses a badge?',
    answer:
      'Treat a badge like a key. On the last working day, collect it with the laptop and any physical keys, and note the return in your issue log. For a lost badge, record it as lost immediately, and if the badge number feeds any internal system such as attendance or canteen accounts, retire that number rather than reusing it for the replacement. Because the QR code here is only an identifier, a lost badge cannot open doors by itself — but it can help someone impersonate staff visually, which is exactly why prompt collection matters.',
  },
  {
    question: 'Which printer and material should we use for staff badges?',
    answer:
      'For badges worn daily, PVC on a dedicated card printer is the professional standard: it survives wallets, rain and two or more years of handling, and prints at the CR80 size this file is designed for. The exported PNG is 2568 × 1620 pixels, above the 300 DPI a card printer needs. For office-only roles, laminated 350 gsm card is an acceptable budget alternative, but expect edge wear within months. If staff wear badges on clips, choose the layout first and punch the slot last — never through the photo or the company name.',
  },
];

export default function EmployeeIdCardGeneratorPage() {
  const [company, setCompany] = useState('Northwind Logistics (Pvt) Ltd');
  const [name, setName] = useState('Bilal Ahmed');
  const [designation, setDesignation] = useState('Warehouse Supervisor');
  const [empId, setEmpId] = useState('EMP-1047');
  const [department, setDepartment] = useState('Operations');
  const [blood, setBlood] = useState('O+');
  const [emergency, setEmergency] = useState('+92 321 9876543');
  const [valid, setValid] = useState('2027');
  const [theme, setTheme] = useState('corporate');
  const [photo, setPhoto] = useState('');
  const [logo, setLogo] = useState('');
  const [qrEnabled, setQrEnabled] = useState(true);
  const [qrUrl, setQrUrl] = useState('');
  const svgRef = useRef<SVGSVGElement>(null);

  const t = THEMES[theme];

  useEffect(() => {
    if (!qrEnabled) {
      return;
    }
    const payload = `${empId} | ${name} | ${designation} | ${department}`;
    QRCode.toDataURL(payload, { width: 240, margin: 1 })
      .then(setQrUrl)
      .catch(() => setQrUrl(''));
  }, [qrEnabled, empId, name, designation, department]);
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
      img.onerror = () => reject(new Error('Could not render the badge image'));
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
      a.download = `employee-id-${(empId || 'badge').replace(/[^a-z0-9-]+/gi, '-').toLowerCase()}.png`;
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
      <Breadcrumbs items={[{ label: 'Employee ID Card Generator', href: '/employee-id-card-generator' }]} />

      <header className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight flex items-center gap-3">
          <Building2 className="w-9 h-9 text-primary" aria-hidden="true" />
          Employee ID Card Generator
        </h1>
        <p className="text-muted-foreground max-w-3xl">
          Produce clean, consistent staff badges without waiting on a design agency: company logo,
          employee photo, designation, department, employee ID and an optional QR code, exported as
          a print-ready PNG at the universal CR80 badge size. The whole tool runs locally in your
          browser, so staff photographs and personal details never pass through a third-party
          server — a real consideration when HR data is involved. It is built for the way badges
          are actually needed in a business: a new starter starting Monday, a replacement for the
          badge that went through the wash, a contractor who needs site identification today, or a
          small company issuing its first proper set of IDs.
        </p>
      </header>

      <Card className="p-5 sm:p-6 space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {field('company', 'Company name', company, setCompany)}
          {field('ename', 'Employee name', name, setName)}
          {field('designation', 'Designation / job title', designation, setDesignation)}
          {field('empid', 'Employee ID', empId, setEmpId)}
          {field('department', 'Department', department, setDepartment)}
          <div className="space-y-1.5">
            <Label htmlFor="eblood">Blood group</Label>
            <Select value={blood} onValueChange={setBlood}>
              <SelectTrigger id="eblood">
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
          {field('emergency', 'Emergency contact', emergency, setEmergency)}
          {field('evalid', 'Valid through (year)', valid, setValid)}
          <div className="space-y-1.5">
            <Label htmlFor="etheme">Colour scheme</Label>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger id="etheme">
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
            <Label htmlFor="ephoto">Employee photo</Label>
            <Input
              id="ephoto"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) readFile(f, setPhoto);
              }}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="elogo">Company logo (optional)</Label>
            <Input
              id="elogo"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) readFile(f, setLogo);
              }}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="eqr">QR code (ID + name + designation)</Label>
            <Select value={qrEnabled ? 'on' : 'off'} onValueChange={(v) => setQrEnabled(v === 'on')}>
              <SelectTrigger id="eqr">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="on">On</SelectItem>
                <SelectItem value="off">Off</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${CARD_W} ${CARD_H}`}
            className="w-full max-w-[640px] mx-auto rounded-xl shadow-md border border-border"
            role="img"
            aria-label="Employee ID badge preview"
          >
            <defs>
              <clipPath id="employeePhotoClip">
                <rect x="636" y="140" width="180" height="226" rx="12" />
              </clipPath>
              <clipPath id="employeeLogoClip">
                <rect x="30" y="20" width="58" height="58" rx="8" />
              </clipPath>
            </defs>
            <rect x="0" y="0" width={CARD_W} height={CARD_H} fill="#ffffff" />
            <rect x="0" y="0" width={CARD_W} height="98" fill={t.band} />
            {logo ? (
              <image href={logo} x="30" y="20" width="58" height="58" clipPath="url(#employeeLogoClip)" preserveAspectRatio="xMidYMid slice" />
            ) : (
              <rect x="30" y="20" width="58" height="58" rx="8" fill="#ffffff" opacity="0.18" />
            )}
            <text x="104" y="58" fontFamily="Arial, Helvetica, sans-serif" fontSize="27" fontWeight="bold" fill="#ffffff">
              {company || 'Company Name'}
            </text>
            <text x="104" y="84" fontFamily="Arial, Helvetica, sans-serif" fontSize="14" letterSpacing="3" fill="#ffffff" opacity="0.85">
              EMPLOYEE IDENTIFICATION
            </text>
            <rect x="0" y="98" width={CARD_W} height="6" fill={t.accent} />
            <rect x="636" y="140" width="180" height="226" rx="12" fill="#e5e7eb" />
            {photo ? (
              <image href={photo} x="636" y="140" width="180" height="226" clipPath="url(#employeePhotoClip)" preserveAspectRatio="xMidYMid slice" />
            ) : (
              <text x="726" y="263" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" fontSize="18" fill="#6b7280">
                PHOTO
              </text>
            )}
            <text x="40" y="186" fontFamily="Arial, Helvetica, sans-serif" fontSize="38" fontWeight="bold" fill="#111827">
              {name || 'Employee Name'}
            </text>
            <text x="40" y="226" fontFamily="Arial, Helvetica, sans-serif" fontSize="22" fill={t.accent} fontWeight="bold">
              {designation}
            </text>
            <text x="40" y="276" fontFamily="Arial, Helvetica, sans-serif" fontSize="19" fill="#374151">
              {`Employee ID:  ${empId}`}
            </text>
            <text x="40" y="310" fontFamily="Arial, Helvetica, sans-serif" fontSize="19" fill="#374151">
              {`Department:  ${department}`}
            </text>
            <text x="40" y="344" fontFamily="Arial, Helvetica, sans-serif" fontSize="19" fill="#374151">
              {`Blood Group:  ${blood}`}
            </text>
            <text x="40" y="378" fontFamily="Arial, Helvetica, sans-serif" fontSize="19" fill="#374151">
              {`Emergency:  ${emergency}`}
            </text>
            {effectiveQrUrl && (
              <>
                <image href={effectiveQrUrl} x="40" y="404" width="92" height="92" />
                <text x="146" y="442" fontFamily="Arial, Helvetica, sans-serif" fontSize="14" fill="#6b7280">
                  Scan for staff
                </text>
                <text x="146" y="464" fontFamily="Arial, Helvetica, sans-serif" fontSize="14" fill="#6b7280">
                  profile lookup
                </text>
              </>
            )}
            <text x="726" y="404" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" fontSize="15" fill="#6b7280">
              If found, please return
            </text>
            <text x="726" y="426" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" fontSize="15" fill="#6b7280">
              to the issuing company
            </text>
            <rect x="0" y="500" width={CARD_W} height="40" fill={t.band} />
            <text x="40" y="527" fontFamily="Arial, Helvetica, sans-serif" fontSize="15" fill="#ffffff">
              This badge remains the property of the issuing company.
            </text>
            <text x="816" y="527" textAnchor="end" fontFamily="Arial, Helvetica, sans-serif" fontSize="15" fontWeight="bold" fill="#ffffff">
              {`VALID THRU ${valid}`}
            </text>
          </svg>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={downloadPng} size="lg">
            <Download className="w-4 h-4 mr-2" aria-hidden="true" />
            Download print-ready PNG
          </Button>
          <p className="text-sm text-muted-foreground">
            Exports at 2568 × 1620 px — above 300 DPI at CR80 badge size.
          </p>
        </div>
      </Card>

      <AdSlot id="employee-id-card-generator-after-tool" format="horizontal-banner" />

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">How HR teams use this generator</h2>
        <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">
          <li>
            <strong className="text-foreground">Fix the template before the first badge.</strong>{' '}
            Agree the company name format, ID numbering scheme and colour with whoever owns your
            brand, then never improvise per employee. Consistency is what makes a badge read as
            official at a glance.
          </li>
          <li>
            <strong className="text-foreground">Collect a proper photo.</strong> Ask for a plain
            background, shoulders-up photo — or take one against an office wall during onboarding.
            Selfies with filters and group-photo crops undermine the badge&apos;s one job:
            recognition.
          </li>
          <li>
            <strong className="text-foreground">Enter details from the HR record, not from memory.</strong>{' '}
            Name spelling, designation and department should match the contract and payroll
            records exactly. The employee ID must be the unique key your HR system uses.
          </li>
          <li>
            <strong className="text-foreground">Print, issue, log.</strong> Download the PNG, print
            on PVC or laminated card, and record the issue — employee, ID number, date — in your
            badge log before the badge leaves the HR desk.
          </li>
        </ol>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
          <KeyRound className="w-6 h-6 text-primary" aria-hidden="true" />
          An honest note about badges and security
        </h2>
        <p className="text-muted-foreground">
          An ID badge does three things well: it shows at a glance who belongs in a building, it
          puts a name to a face so colleagues and visitors can address people properly, and it
          gives security staff something standard to check. What it does not do is prove anything
          cryptographically. The QR code on this badge encodes the employee ID, name, designation
          and department as plain text — useful for attendance check-in, canteen or library
          accounts, equipment issue and staff-profile lookup, but readable by any phone and
          copyable by any printer. Never let a printed QR code be the only factor that opens a
          door, a system or a payment. Pair visual badges with real credentials where it matters:
          RFID or NFC cards for doors, accounts and passwords for systems, and a culture where an
          unbadged stranger gets politely challenged. Also keep personal data off the badge face:
          home addresses, personal mobile numbers and national ID numbers are visible to everyone
          an employee meets, including outside work.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Print and production specifications</h2>
        <p className="text-muted-foreground">
          Badges are produced at CR80, 85.6 × 53.98 mm — the blank stocked by every card printer
          and bureau. The design canvas matches that ratio exactly and the PNG export is 2568 ×
          1620 pixels, which is roughly 760 DPI at finished size and far beyond the 300 DPI a card
          printer can lay down, so edges and small text stay sharp. When ordering from a bureau,
          specify CR80 PVC, full-colour front, gloss finish for site and warehouse staff (easier
          to wipe clean) or matte for office staff (no glare under lights or on camera). Decide the
          wearing method before printing: a top-centre slot for clips and reels is standard for
          landscape badges, and this layout keeps the header band clear for it; if you use round
          holes for lanyards, keep them out of the photo corner. Colour in print shifts slightly
          darker than on screen, especially deep blues — print one sample before a full staff run.
          For multi-site companies, the cheapest consistency trick is a single master: same colour
          scheme, same ID format, site name in the department field, so a badge from any branch is
          recognisable at every other branch.
        </p>
      </section>

      <AdSlot id="employee-id-card-generator-in-content" format="in-article" />

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Who issues badges with a tool like this</h2>
        <p className="text-muted-foreground">
          Small and mid-sized companies without a design department are the core users: a
          12-person logistics firm formalising its warehouse, a clinic that needs role-clear
          identification for patients&apos; peace of mind, a restaurant group whose staff rotate
          between branches, a security company badging guards for client sites, or a startup whose
          first investor visit makes lanyards suddenly feel overdue. It also fits the gaps in
          bigger organisations — the contractor, intern or auditor who needs identification today,
          not after the next quarterly print order. And because nothing is uploaded, HR teams can
          use it on the same machine that holds personnel files without creating a new data
          trail.
        </p>
        <p className="text-muted-foreground flex items-start gap-2">
          <ShieldAlert className="w-5 h-5 mt-0.5 shrink-0 text-primary" aria-hidden="true" />
          Build the leavers&apos; process at the same time as the badges: collect on the last day,
          log the return, retire the ID number. A badge system without a return process slowly
          becomes a drawer full of valid-looking badges for people who no longer work for you.
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
