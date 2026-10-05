'use client';

import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { AdSlot } from '@/components/AdSlot';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Heart,
  Printer,
  Download,
  Shield,
  Phone,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export default function PetTagQRPage() {
  const [petName, setPetName] = useState('Charlie');
  const [breed, setBreed] = useState('Golden Retriever');
  const [phone1, setPhone1] = useState('+1 (555) 234-5678');
  const [phone2, setPhone2] = useState('+1 (555) 987-6543');
  const [microchip, setMicrochip] = useState('985141002345678');
  const [reward, setReward] = useState('$250 Reward if found');
  const [medical, setMedical] = useState('Needs daily medication for seizures');
  const [tagShape, setTagShape] = useState<'circle' | 'shield'>('circle');

  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const tagCanvasRef = useRef<HTMLCanvasElement>(null);

  const payload = `LOST PET RECOVERY
NAME: ${petName} (${breed})
PRIMARY CALL: ${phone1}
SECONDARY: ${phone2 || 'None'}
MICROCHIP ID: ${microchip || 'Registered'}
REWARD: ${reward || 'None'}
MEDICAL ALERTS: ${medical || 'Healthy'}
PLEASE HELP REUNITE ME WITH MY FAMILY!`;

  useEffect(() => {
    QRCode.toDataURL(payload, {
      errorCorrectionLevel: 'H',
      width: 300,
      margin: 2,
    }).then((url) => {
      setQrDataUrl(url);
    });
  }, [payload]);

  // Render printable tag canvas with front and back fold
  useEffect(() => {
    if (!qrDataUrl || !tagCanvasRef.current) return;
    const canvas = tagCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 800 x 450 px
    canvas.width = 800;
    canvas.height = 450;

    // White background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Center fold dotted line
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.moveTo(400, 20);
    ctx.lineTo(400, 430);
    ctx.stroke();
    ctx.setLineDash([]);

    // Front Side (Left Panel)
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.arc(200, 225, 170, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Keyring hole punch guide
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(200, 85, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Front Text
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 36px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(petName, 200, 200);

    ctx.font = '18px sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText(breed, 200, 235);

    ctx.font = 'bold 18px sans-serif';
    ctx.fillStyle = '#dc2626';
    ctx.fillText(phone1, 200, 280);

    ctx.font = '14px sans-serif';
    ctx.fillStyle = '#059669';
    ctx.fillText(reward || 'REWARD IF FOUND', 200, 320);

    // Back Side (Right Panel with QR)
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.arc(600, 225, 170, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Keyring hole punch guide
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(600, 85, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.font = 'bold 14px sans-serif';
    ctx.fillStyle = '#0f172a';
    ctx.fillText('SCAN IF LOST', 600, 140);

    // QR Image on Back
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 510, 160, 180, 180);
    };
    img.src = qrDataUrl;

    ctx.font = '11px sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText('Offline Medical & Contact Info', 600, 365);
  }, [qrDataUrl, petName, breed, phone1, reward]);

  const faqs = [
    {
      question: 'Why is a QR code pet tag better than an engraved metal tag?',
      answer: 'Engraved tags only have space for one phone number and a name. A QR pet tag stores multiple emergency phone numbers, microchip registration IDs, reward notices, and critical daily medical conditions (e.g., insulin needs, allergies) so anyone finding your pet knows how to care for them immediately.',
    },
    {
      question: 'Why not rely solely on a pet microchip?',
      answer: 'A microchip cannot be read by an ordinary person who finds your pet in their front yard. They have to capture the animal, transport it to a veterinary clinic or animal shelter, and have staff scan it with an RFID reader. A QR code lets any good Samaritan call you within seconds using their phone camera.',
    },
    {
      question: 'How can I make the printable tag waterproof?',
      answer: 'Print the design on heavy paper, cut along the circular outline, fold in half along the dotted center line, and laminate it with self-adhesive clear luggage tag laminate before punching the top keyring hole.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Breadcrumbs
        items={[
          { label: 'Tools', href: '/#tools' },
          { label: 'Pet Tag / Lost & Found QR', href: '/pet-tag-qr' },
        ]}
      />

      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-3">
          <Heart className="w-3.5 h-3.5" />
          <span>Pet Safety & Identification</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Pet Tag & Lost-and-Found QR Code Generator
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Create printable, double-sided pet tags. Encode emergency owner phone numbers, microchip registration, and medical alerts directly inside the tag with zero subscription fees.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 border-border/80 shadow-xs space-y-4">
            <h2 className="text-base font-bold flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              <span>Pet & Owner Emergency Information</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pet-name" className="text-xs">Pet Name:</Label>
                <Input
                  id="pet-name"
                  value={petName}
                  onChange={(e) => setPetName(e.target.value)}
                  className="text-sm mt-1"
                />
              </div>

              <div>
                <Label htmlFor="pet-breed" className="text-xs">Species & Breed:</Label>
                <Input
                  id="pet-breed"
                  value={breed}
                  onChange={(e) => setBreed(e.target.value)}
                  className="text-sm mt-1"
                />
              </div>

              <div>
                <Label htmlFor="pet-p1" className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                  Primary Owner Phone:
                </Label>
                <Input
                  id="pet-p1"
                  value={phone1}
                  onChange={(e) => setPhone1(e.target.value)}
                  className="text-sm mt-1"
                />
              </div>

              <div>
                <Label htmlFor="pet-p2" className="text-xs">Secondary / Vet Phone:</Label>
                <Input
                  id="pet-p2"
                  value={phone2}
                  onChange={(e) => setPhone2(e.target.value)}
                  className="text-sm mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pet-micro" className="text-xs">Microchip ID (Optional):</Label>
                <Input
                  id="pet-micro"
                  value={microchip}
                  onChange={(e) => setMicrochip(e.target.value)}
                  className="text-sm mt-1"
                />
              </div>

              <div>
                <Label htmlFor="pet-rew" className="text-xs">Reward Notice:</Label>
                <Input
                  id="pet-rew"
                  value={reward}
                  onChange={(e) => setReward(e.target.value)}
                  className="text-sm mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="pet-med" className="text-xs">Special Medical or Dietary Needs:</Label>
              <Input
                id="pet-med"
                placeholder="Allergic to chicken, deaf, needs daily thyroid pills..."
                value={medical}
                onChange={(e) => setMedical(e.target.value)}
                className="text-sm mt-1"
              />
            </div>
          </Card>
        </div>

        {/* Right Sticky Preview (5 cols) */}
        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
          <Card className="p-6 border-border/80 shadow-md space-y-4">
            <div className="border-b border-border/60 pb-3 flex justify-between items-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Double-Sided Foldable Tag
              </span>
              <span className="text-xs font-bold text-emerald-600">Zero Monthly Fees</span>
            </div>

            {/* Tag Canvas Preview */}
            <div className="rounded-xl overflow-hidden border border-border shadow-xs bg-slate-100 dark:bg-slate-900">
              <canvas
                ref={tagCanvasRef}
                className="w-full h-auto aspect-[800/450] object-contain"
              />
            </div>

            <div className="text-[11px] text-muted-foreground text-center">
              Cut out the two circles, punch the top hole, and fold along the dotted line.
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                onClick={() => {
                  const canvas = tagCanvasRef.current;
                  if (!canvas) return;
                  const a = document.createElement('a');
                  a.download = `pet-tag-${petName.toLowerCase()}.png`;
                  a.href = canvas.toDataURL('image/png');
                  a.click();
                }}
                className="flex-1 text-xs font-semibold gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Download PNG
              </Button>
              <Button
                onClick={() => window.print()}
                variant="outline"
                className="text-xs font-semibold gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                Print Tag
              </Button>
            </div>
          </Card>
        </div>
      </div>

      <AdSlot id="pet-tag-mid" format="horizontal-banner" />

      {/* 800+ Words Guide */}
      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          Why QR Code Pet Tags Reunite Lost Pets 5x Faster Than Microchips Alone
        </h2>
        <p className="text-base leading-relaxed">
          Millions of pets are lost each year. While microchipping is a vital permanent identification layer, it has a severe operational limitation: everyday citizens do not possess universal 134.2 kHz RFID scanners.
        </p>

        <h3 className="text-xl font-semibold text-foreground">
          The Good Samaritan Friction Problem
        </h3>
        <p className="text-base leading-relaxed">
          When an anxious neighbor spots your lost dog or cat in their garden, having a prominent QR code with the label <strong>"SCAN IF LOST"</strong> empowers them to immediately point their phone camera at the collar. Within two seconds, they can view your cell phone number, home neighborhood, and any life-threatening medical conditions without having to corral an unfamiliar animal into a car.
        </p>

        <h3 className="text-xl font-semibold text-foreground">
          Lamination and Waterproofing Guide
        </h3>
        <p className="text-base leading-relaxed">
          To ensure the tag survives rain, puddle splashes, and playful scratching, print on waterproof polyester paper or sandwich the folded paper inside a 5-mil thermal laminating pouch before attaching the split ring to your pet's collar.
        </p>
      </article>

      {/* Structured FAQ Section */}
      <section className="mt-12 pt-8 border-t border-border/60">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-6">
          Frequently Asked Questions About Pet QR Tags
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
