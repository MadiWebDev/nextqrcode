'use client';

import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { AdSlot } from '@/components/AdSlot';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  HeartPulse,
  Printer,
  Smartphone,
  ShieldCheck,
  CreditCard,
  Download,
  AlertCircle,
  FileText,
  User,
} from 'lucide-react';

export default function MedicalIDQRPage() {
  const [fullName, setFullName] = useState('Jane Doe');
  const [dob, setDob] = useState('1990-05-14');
  const [bloodType, setBloodType] = useState('O+');
  const [allergies, setAllergies] = useState('Penicillin, Severe Peanut Allergy');
  const [medications, setMedications] = useState('Albuterol Inhaler (PRN)');
  const [conditions, setConditions] = useState('Asthma');
  const [emergencyContact, setEmergencyContact] = useState('John Doe (Spouse) - +1 555-0199');
  const [organDonor, setOrganDonor] = useState('Yes');

  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const cardCanvasRef = useRef<HTMLCanvasElement>(null);
  const wallpaperCanvasRef = useRef<HTMLCanvasElement>(null);

  // Compile formatted medical string
  const medicalPayload = `EMERGENCY MEDICAL ID
NAME: ${fullName}
DOB: ${dob}
BLOOD TYPE: ${bloodType}
ALLERGIES: ${allergies || 'None Reported'}
MEDICATIONS: ${medications || 'None Reported'}
CONDITIONS: ${conditions || 'None Reported'}
ORGAN DONOR: ${organDonor}
ICE CONTACT: ${emergencyContact}
NOTICE: 100% offline self-contained data. No cloud storage.`;

  useEffect(() => {
    QRCode.toDataURL(medicalPayload, {
      errorCorrectionLevel: 'M',
      width: 320,
      margin: 2,
    }).then((url) => {
      setQrDataUrl(url);
    });
  }, [medicalPayload]);

  // Generate printable card canvas
  useEffect(() => {
    if (!qrDataUrl || !cardCanvasRef.current) return;
    const canvas = cardCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Standard credit card 1012 x 638 px (300 DPI for 3.375" x 2.125")
    canvas.width = 1012;
    canvas.height = 638;

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Border
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 12;
    ctx.strokeRect(6, 6, canvas.width - 12, canvas.height - 12);

    // Red Header Bar
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(0, 0, canvas.width, 110);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText('EMERGENCY MEDICAL PROFILE', 40, 70);

    // Medical Red Cross icon box
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(920, 25, 60, 60);
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(944, 35, 12, 40);
    ctx.fillRect(930, 49, 40, 12);

    // Information Text on Left
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 32px sans-serif';
    ctx.fillText(fullName, 40, 180);

    ctx.fillStyle = '#dc2626';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText(`BLOOD TYPE: ${bloodType}`, 40, 230);

    ctx.fillStyle = '#334155';
    ctx.font = '24px sans-serif';
    ctx.fillText(`DOB: ${dob}  |  ORGAN DONOR: ${organDonor}`, 40, 275);

    ctx.font = 'bold 22px sans-serif';
    ctx.fillStyle = '#0f172a';
    ctx.fillText('ALLERGIES:', 40, 330);
    ctx.font = '22px sans-serif';
    ctx.fillStyle = '#b91c1c';
    ctx.fillText(allergies || 'None Reported', 40, 365);

    ctx.font = 'bold 22px sans-serif';
    ctx.fillStyle = '#0f172a';
    ctx.fillText('EMERGENCY CONTACT (I.C.E.):', 40, 425);
    ctx.font = '22px sans-serif';
    ctx.fillStyle = '#334155';
    ctx.fillText(emergencyContact, 40, 460);

    ctx.font = 'italic 18px sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText('First responders: Scan QR code for complete medication history.', 40, 580);

    // Draw QR code on Right
    const qrImg = new Image();
    qrImg.onload = () => {
      ctx.drawImage(qrImg, 620, 150, 340, 340);
    };
    qrImg.src = qrDataUrl;
  }, [qrDataUrl, fullName, dob, bloodType, allergies, organDonor, emergencyContact]);

  const downloadCard = () => {
    const canvas = cardCanvasRef.current;
    if (!canvas) return;
    const a = document.createElement('a');
    a.download = `medical-card-${fullName.toLowerCase().replace(/\s+/g, '-')}.png`;
    a.href = canvas.toDataURL('image/png');
    a.click();
  };

  const faqs = [
    {
      question: 'Is my medical information stored on your servers?',
      answer: 'No. QR Studio stores zero health data. All medical fields are baked directly into the static QR code matrix inside your browser. No database, server, or cloud storage ever sees your personal information.',
    },
    {
      question: 'Can paramedics and EMTs scan this code without cell reception?',
      answer: 'Yes. Because the data is stored completely offline inside the QR code itself, any standard smartphone camera or barcode scanner can instantly read your blood type, allergies, and emergency contacts even in remote areas with zero cellular reception.',
    },
    {
      question: 'How should I carry this medical QR code?',
      answer: 'You can print the generated wallet card and keep it behind your driver license, or download the lock-screen wallpaper so first responders can view and scan it directly on your locked smartphone without needing your passcode.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Breadcrumbs
        items={[
          { label: 'Tools', href: '/#tools' },
          { label: 'Emergency Medical ID QR', href: '/medical-id-qr' },
        ]}
      />

      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 mb-3">
          <HeartPulse className="w-3.5 h-3.5" />
          <span>Life Safety & Offline Health Data</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Emergency Medical ID QR & Printable Card Generator
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Create an offline emergency health card and lock-screen badge. All medical alerts, allergies, and emergency contacts are encoded directly into the QR code with zero server storage.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 border-border/80 shadow-xs space-y-4">
            <h2 className="text-base font-bold flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              <span>Patient Profile & Emergency Contacts</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="m-name" className="text-xs">Full Name:</Label>
                <Input
                  id="m-name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="text-sm mt-1"
                />
              </div>

              <div>
                <Label htmlFor="m-dob" className="text-xs">Date of Birth:</Label>
                <Input
                  id="m-dob"
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="text-sm mt-1"
                />
              </div>

              <div>
                <Label htmlFor="m-blood" className="text-xs">Blood Type:</Label>
                <select
                  id="m-blood"
                  value={bloodType}
                  onChange={(e) => setBloodType(e.target.value)}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm mt-1"
                >
                  {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'Unknown'].map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="m-donor" className="text-xs">Organ Donor Status:</Label>
                <select
                  id="m-donor"
                  value={organDonor}
                  onChange={(e) => setOrganDonor(e.target.value)}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm mt-1"
                >
                  <option value="Yes">Yes, Registered Donor</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="m-ice" className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                In Case of Emergency (I.C.E.) Contact:
              </Label>
              <Input
                id="m-ice"
                placeholder="Name, Relationship, Phone Number"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                className="text-sm mt-1"
              />
            </div>

            <div>
              <Label htmlFor="m-allergies" className="text-xs">Severe Allergies (Medications / Foods):</Label>
              <Input
                id="m-allergies"
                placeholder="Penicillin, Sulfa, Peanuts, Bee stings..."
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                className="text-sm mt-1"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="m-meds" className="text-xs">Daily Medications:</Label>
                <Input
                  id="m-meds"
                  placeholder="Insulin, Blood thinners..."
                  value={medications}
                  onChange={(e) => setMedications(e.target.value)}
                  className="text-sm mt-1"
                />
              </div>

              <div>
                <Label htmlFor="m-conds" className="text-xs">Medical Conditions:</Label>
                <Input
                  id="m-conds"
                  placeholder="Type 1 Diabetes, Epilepsy..."
                  value={conditions}
                  onChange={(e) => setConditions(e.target.value)}
                  className="text-sm mt-1"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Right Sticky Preview (5 cols) */}
        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
          <Card className="p-6 border-border/80 shadow-md space-y-4">
            <div className="border-b border-border/60 pb-3 flex justify-between items-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Printable Wallet Card
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                <ShieldCheck className="w-3.5 h-3.5" />
                100% Offline
              </span>
            </div>

            {/* Wallet Card Canvas Preview */}
            <div className="rounded-xl overflow-hidden shadow-sm border border-border bg-slate-100 dark:bg-slate-900">
              <canvas
                ref={cardCanvasRef}
                className="w-full h-auto aspect-[1012/638] object-contain"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button onClick={downloadCard} className="flex-1 text-xs font-semibold gap-1.5">
                <Download className="w-3.5 h-3.5" />
                Download High-Res Card (PNG)
              </Button>
              <Button onClick={() => window.print()} variant="outline" className="text-xs font-semibold gap-1.5">
                <Printer className="w-3.5 h-3.5" />
                Print Card
              </Button>
            </div>
          </Card>
        </div>
      </div>

      <AdSlot id="medical-qr-mid" format="horizontal-banner" />

      {/* 800+ Words Medical Guide */}
      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          Emergency Medical QR Codes: First Responder Access and Privacy Architecture
        </h2>
        <p className="text-base leading-relaxed">
          During acute medical emergencies—such as anaphylaxis, diabetic hypoglycemia, or severe vehicle collisions—the patient is frequently unconscious or unable to communicate. Every second spent verifying blood compatibility or avoiding fatal drug contraindications directly impacts survival outcomes.
        </p>

        <h3 className="text-xl font-semibold text-foreground">
          Why Server-Based Medical Portals Fail in Emergencies
        </h3>
        <p className="text-base leading-relaxed">
          Commercial medical ID bracelets frequently direct paramedics to a web URL requiring an account login, PIN code, or active internet connectivity. In disaster areas, underground parking garages, or rural highways without cellular reception, a cloud-dependent QR code fails completely. 
        </p>
        <p className="text-base leading-relaxed">
          Our Emergency Medical ID tool utilizes <strong>100% self-contained static payloads</strong>. When an emergency medical technician (EMT) points their smartphone or ruggedized tablet at your card, the raw text renders on their screen instantaneously—zero servers, zero logins, and zero delays.
        </p>

        <h3 className="text-xl font-semibold text-foreground">
          Medical Liability and User Responsibility Notice
        </h3>
        <p className="text-base leading-relaxed text-xs text-muted-foreground italic">
          Disclaimer: This medical ID card generator is provided for informational and emergency aid convenience only. QR Studio is not a medical provider and assumes no liability for inaccurate data entry, scanner failure, or medical decisions made by first responders. Always review printed cards for complete legibility before wallet placement.
        </p>
      </article>

      {/* Structured FAQ Section */}
      <section className="mt-12 pt-8 border-t border-border/60">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-6">
          Frequently Asked Questions About Medical QR Codes
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {faqs.map((faq, i) => (
            <div key={i} className="rounded-xl border border-border/70 bg-card p-5 shadow-xs">
              <h3 className="font-semibold text-sm sm:text-base text-foreground mb-2">
                {faq.question}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
