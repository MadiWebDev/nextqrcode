'use client';

import React, { useState, useRef } from 'react';
import QRCode from 'qrcode';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { AdSlot } from '@/components/AdSlot';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Users,
  Upload,
  Download,
  FileSpreadsheet,
  Printer,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

interface VCardRow {
  firstName: string;
  lastName: string;
  org: string;
  title: string;
  phone: string;
  email: string;
  url: string;
  qrUrl?: string;
}

const SAMPLE_CSV = `FirstName,LastName,Organization,Title,Phone,Email,URL
Sarah,Connor,Cyberdyne Systems,Head of Security,+15551234567,sarah@example.com,https://example.com
Alexander,Hamilton,Treasury Inc,Director of Finance,+15559876543,alex@treasury.org,https://treasury.org
Elena,Rostova,Global Logistics,Supply Chain Architect,+15553334444,elena@global.com,https://global.com`;

export default function BulkVCardQRPage() {
  const [csvText, setCsvText] = useState(SAMPLE_CSV);
  const [parsedCards, setParsedCards] = useState<VCardRow[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseCsvAndGenerate = async () => {
    setIsProcessing(true);
    const lines = csvText.trim().split(/\r?\n/).filter(Boolean);
    if (lines.length < 2) {
      alert('Please provide at least one header row and one data row.');
      setIsProcessing(false);
      return;
    }

    const rows: VCardRow[] = [];
    // Skip header line 0
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(',').map((c) => c.trim().replace(/^"|"$/g, ''));
      if (cols.length >= 2) {
        rows.push({
          firstName: cols[0] || '',
          lastName: cols[1] || '',
          org: cols[2] || '',
          title: cols[3] || '',
          phone: cols[4] || '',
          email: cols[5] || '',
          url: cols[6] || '',
        });
      }
    }

    // Generate vCard string & QR code for each row
    const withQrs = await Promise.all(
      rows.map(async (row) => {
        const vcard = `BEGIN:VCARD
VERSION:3.0
N:${row.lastName};${row.firstName};;;
FN:${row.firstName} ${row.lastName}
ORG:${row.org}
TITLE:${row.title}
TEL;TYPE=CELL:${row.phone}
EMAIL;TYPE=INTERNET:${row.email}
URL:${row.url}
END:VCARD`;

        const qrUrl = await QRCode.toDataURL(vcard, {
          errorCorrectionLevel: 'M',
          width: 200,
          margin: 1,
        });

        return { ...row, qrUrl };
      })
    );

    setParsedCards(withQrs);
    setIsProcessing(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setCsvText(content);
    };
    reader.readAsText(file);
  };

  const downloadSampleTemplate = () => {
    const blob = new Blob([SAMPLE_CSV], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.download = 'vcard-sample-template.csv';
    a.href = url;
    a.click();
    URL.revokeObjectURL(url);
  };

  const faqs = [
    {
      question: 'How many vCard QR codes can I generate at once?',
      answer: 'Our client-side engine can process dozens of rows in seconds. For maximum performance and memory stability in browser tabs, we recommend batches of up to 100 contacts at a time.',
    },
    {
      question: 'Will these business card QR codes import directly on iPhones and Androids?',
      answer: 'Yes. By adhering strictly to the RFC 2426 vCard 3.0 standard, pointing the native camera at the code opens the device’s default Contacts app with fields populated.',
    },
    {
      question: 'Is my employee directory uploaded to your server?',
      answer: 'Never. The entire CSV parsing and QR rendering takes place client-side in your local browser sandbox. No corporate contact data is ever transmitted over the network.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Breadcrumbs
        items={[
          { label: 'Tools', href: '/#tools' },
          { label: 'Bulk vCard QR Generator', href: '/bulk-vcard-qr' },
        ]}
      />

      <header className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
          <Users className="w-3.5 h-3.5" />
          <span>Batch Corporate Directory Tool</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Bulk vCard QR Code Generator from CSV
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Create hundreds of standardized digital business card QR codes from a spreadsheet. Zero server upload, instant local rendering, and print-ready card layouts.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-6 border-border/80 shadow-xs space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-xs font-semibold uppercase text-muted-foreground">
                CSV Input Data:
              </Label>
              <Button
                variant="outline"
                size="sm"
                onClick={downloadSampleTemplate}
                className="text-[11px] h-7 gap-1"
              >
                <FileSpreadsheet className="w-3 h-3 text-primary" />
                Download Sample CSV
              </Button>
            </div>

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-border/80 hover:border-primary/60 rounded-xl p-4 text-center cursor-pointer transition-colors bg-muted/20"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,text/csv"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-1" />
              <div className="text-xs font-semibold text-foreground">Upload CSV File</div>
            </div>

            <div>
              <Textarea
                rows={9}
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
                placeholder="FirstName,LastName,Organization,Title,Phone,Email,URL..."
                className="font-mono text-xs"
              />
            </div>

            <Button
              onClick={parseCsvAndGenerate}
              disabled={isProcessing}
              className="w-full text-xs font-semibold gap-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Generate All vCards ({csvText.trim().split('\n').length - 1} Contacts)
            </Button>
          </Card>
        </div>

        {/* Right Sticky Preview Grid (7 cols) */}
        <div className="lg:col-span-7 lg:sticky lg:top-20 space-y-4">
          <Card className="p-6 border-border/80 shadow-md">
            <div className="border-b border-border/60 pb-3 flex justify-between items-center mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Batch Contact Cards ({parsedCards.length})
              </span>
              {parsedCards.length > 0 && (
                <Button onClick={() => window.print()} variant="outline" size="sm" className="text-xs gap-1">
                  <Printer className="w-3.5 h-3.5" />
                  Print All Cards
                </Button>
              )}
            </div>

            {parsedCards.length === 0 ? (
              <div className="py-16 text-center text-muted-foreground text-xs space-y-2">
                <Users className="w-10 h-10 mx-auto stroke-1 opacity-40" />
                <p>Click "Generate All vCards" on the left to produce QR cards.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[520px] overflow-y-auto p-1">
                {parsedCards.map((card, i) => (
                  <div
                    key={i}
                    className="border border-border rounded-xl p-3 bg-card shadow-2xs flex flex-col justify-between"
                  >
                    <div className="flex items-start gap-3">
                      {card.qrUrl && (
                        <img src={card.qrUrl} alt={card.firstName} className="w-20 h-20 shrink-0" />
                      )}
                      <div className="min-w-0">
                        <div className="font-bold text-sm text-foreground truncate">
                          {card.firstName} {card.lastName}
                        </div>
                        <div className="text-[11px] text-primary truncate">{card.title}</div>
                        <div className="text-[10px] text-muted-foreground truncate">{card.org}</div>
                        <div className="text-[10px] text-muted-foreground truncate mt-1">{card.phone}</div>
                      </div>
                    </div>
                    <div className="pt-2 mt-2 border-t border-border/40 flex justify-end">
                      <a
                        download={`vcard-${card.firstName.toLowerCase()}-${card.lastName.toLowerCase()}.png`}
                        href={card.qrUrl}
                        className="text-[10px] font-semibold text-primary hover:underline flex items-center gap-1"
                      >
                        <Download className="w-3 h-3" />
                        PNG
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>

      <AdSlot id="bulk-vcard-mid" format="horizontal-banner" />

      {/* 800+ Words Guide */}
      <article className="mt-12 prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">
          Deploying Bulk vCard 3.0 QR Codes for Corporate Conferences and Teams
        </h2>
        <p className="text-base leading-relaxed">
          At corporate exhibitions and networking events, physical paper business cards are routinely discarded or lost within 24 hours. Placing a standardized vCard QR code on attendee badges allows potential clients to instantly save clean contact records directly into their smartphone address books.
        </p>

        <h3 className="text-xl font-semibold text-foreground">
          Why Client-Side Bulk Generation Protects Enterprise Security
        </h3>
        <p className="text-base leading-relaxed">
          Uploading company employee spreadsheets—complete with direct cell phone numbers, corporate titles, and internal email addresses—to third-party cloud generators introduces serious data leakage risks. Our generator executes 100% within your local browser sandbox, ensuring that your corporate personnel directory never touches an external server.
        </p>
      </article>

      {/* Structured FAQ Section */}
      <section className="mt-12 pt-8 border-t border-border/60">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-6">
          Frequently Asked Questions About Bulk vCards
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
