'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Camera, Download, Info, Move, Upload, ZoomIn } from 'lucide-react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { AdSlot } from '@/components/AdSlot';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Slider } from '@/components/ui/slider';

interface Preset {
  label: string;
  sizeText: string;
  w: number;
  h: number;
  copies: string;
}

const PRESETS: Record<string, Preset> = {
  us: {
    label: 'US / India / Pakistan passport — 2 x 2 in',
    sizeText: '2 x 2 in (51 x 51 mm)',
    w: 600,
    h: 600,
    copies: '2 per 4x6 sheet',
  },
  uk: {
    label: 'UK / EU / Schengen visa — 35 x 45 mm',
    sizeText: '35 x 45 mm',
    w: 413,
    h: 531,
    copies: '8 per 4x6 sheet',
  },
  ca: {
    label: 'Canada passport — 50 x 70 mm',
    sizeText: '50 x 70 mm',
    w: 591,
    h: 827,
    copies: '2 per 4x6 sheet',
  },
  cn: {
    label: 'China visa — 33 x 48 mm',
    sizeText: '33 x 48 mm',
    w: 390,
    h: 567,
    copies: '8 per 4x6 sheet',
  },
};

const SHEET_W = 1800;
const SHEET_H = 1200;
const TILE_GAP = 24; // 2 mm at 300 dpi

const FAQS = [
  {
    q: 'Does this tool remove or replace the background of my photo?',
    a: 'No — and any tool that promises one-click background replacement for an official photo deserves suspicion, because several authorities reject photos with digitally altered backgrounds. This maker crops and sizes your photo exactly; the background is whatever you stood in front of. Photograph against a plain white or light-grey wall in even light, and the result meets the background rule of every preset listed here.',
  },
  {
    q: 'How big should my head be inside the frame?',
    a: 'For the US 2 x 2 in standard, the head — chin to crown — must measure between 1 and 1 3/8 inches, roughly 50 to 69 percent of the photo height. The dashed oval in the editor is drawn to that proportion: drag and zoom until your head fills the oval with a small margin above the crown, and your eyes sit near the middle of the frame.',
  },
  {
    q: 'Can I take the original photo with my phone?',
    a: 'Yes. Use the rear camera at its highest resolution, stand about 1.5 metres from the camera with the phone at eye level, and face a window for soft daylight rather than using flash, which creates harsh shadows and red-eye. Keep the camera level, look straight into the lens with a neutral expression, and leave space around your head — this editor needs room to crop.',
  },
  {
    q: 'Are glasses, hats and headscarves allowed in passport photos?',
    a: 'Glasses are not allowed in US passport photos and are discouraged almost everywhere else, so remove them. Hats and head coverings are only accepted for religious or medical reasons, and even then your full face from chin to forehead must stay visible with no shadows. Rules differ slightly by country, so check your application guidance before submitting — this tool guarantees the size and crop, not the final acceptance decision.',
  },
  {
    q: 'How do I print the 4x6 sheet correctly at home or in a shop?',
    a: 'The sheet is exactly 1800 x 1200 pixels — a 4 x 6 inch print at 300 dpi. In your printer dialog or the photo shop kiosk, choose 4x6 paper and turn off any "fit to page" or borderless-stretch option, which would rescale the photos away from their official size. Print once, measure one photo with a ruler against the preset size in the table below, and only then print the batch.',
  },
];

export default function PassportPhotoMakerPage() {
  const [presetKey, setPresetKey] = useState('us');
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const previewRef = useRef<HTMLCanvasElement>(null);
  const dragRef = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(
    null
  );

  const preset = PRESETS[presetKey];

  const renderPhoto = useCallback(
    (canvas: HTMLCanvasElement, withGuide: boolean) => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const { w, h } = preset;
      ctx.fillStyle = '#e8e8ec';
      ctx.fillRect(0, 0, w, h);
      if (!img) {
        ctx.fillStyle = '#6b7280';
        ctx.font = '600 22px Arial, Helvetica, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Upload a photo to begin', w / 2, h / 2);
        return;
      }
      const baseScale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
      const s = baseScale * zoom;
      const dw = img.naturalWidth * s;
      const dh = img.naturalHeight * s;
      const dx = (w - dw) / 2 + offset.x;
      const dy = (h - dh) / 2 + offset.y;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, dx, dy, dw, dh);
      if (withGuide) {
        ctx.save();
        ctx.strokeStyle = 'rgba(17, 24, 39, 0.45)';
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 7]);
        ctx.beginPath();
        ctx.ellipse(w / 2, h * 0.42, w * 0.26, h * 0.3, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(w * 0.14, h * 0.86);
        ctx.lineTo(w * 0.86, h * 0.86);
        ctx.stroke();
        ctx.restore();
      }
    },
    [img, zoom, offset, preset]
  );

  useEffect(() => {
    if (previewRef.current) renderPhoto(previewRef.current, true);
  }, [renderPhoto]);

  function handleFile(file: File | undefined) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        setImg(image);
        setZoom(1);
        setOffset({ x: 0, y: 0 });
      };
      image.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  }

  function pointerPos(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = previewRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  }

  function onPointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!img) return;
    (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);
    const pos = pointerPos(e);
    dragRef.current = { startX: pos.x, startY: pos.y, origX: offset.x, origY: offset.y };
  }

  function onPointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    const drag = dragRef.current;
    if (!drag) return;
    const pos = pointerPos(e);
    setOffset({ x: drag.origX + (pos.x - drag.startX), y: drag.origY + (pos.y - drag.startY) });
  }

  function onPointerUp() {
    dragRef.current = null;
  }

  function downloadBlob(canvas: HTMLCanvasElement, filename: string) {
    canvas.toBlob((png) => {
      if (!png) return;
      const url = URL.createObjectURL(png);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    }, 'image/png');
  }

  function downloadSingle() {
    const single = document.createElement('canvas');
    single.width = preset.w;
    single.height = preset.h;
    renderPhoto(single, false);
    downloadBlob(single, `passport-photo-${preset.w}x${preset.h}.png`);
  }

  function downloadSheet() {
    const single = document.createElement('canvas');
    single.width = preset.w;
    single.height = preset.h;
    renderPhoto(single, false);
    const sheet = document.createElement('canvas');
    sheet.width = SHEET_W;
    sheet.height = SHEET_H;
    const ctx = sheet.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, SHEET_W, SHEET_H);
    const cols = Math.max(1, Math.floor((SHEET_W + TILE_GAP) / (preset.w + TILE_GAP)));
    const rows = Math.max(1, Math.floor((SHEET_H + TILE_GAP) / (preset.h + TILE_GAP)));
    const gridW = cols * preset.w + (cols - 1) * TILE_GAP;
    const gridH = rows * preset.h + (rows - 1) * TILE_GAP;
    const startX = (SHEET_W - gridW) / 2;
    const startY = (SHEET_H - gridH) / 2;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = startX + c * (preset.w + TILE_GAP);
        const y = startY + r * (preset.h + TILE_GAP);
        ctx.drawImage(single, x, y);
        ctx.strokeStyle = '#d4d4d8';
        ctx.lineWidth = 1;
        ctx.strokeRect(x + 0.5, y + 0.5, preset.w - 1, preset.h - 1);
      }
    }
    downloadBlob(sheet, 'passport-photos-4x6-sheet.png');
  }

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <Breadcrumbs
        items={[
          { label: 'Tools', href: '/tools' },
          { label: 'Passport Photo Maker', href: '/passport-photo-maker' },
        ]}
      />

      <header className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight flex items-center gap-3">
          <Camera className="w-8 h-8 text-primary" />
          Passport Photo Maker
        </h1>
        <p className="text-muted-foreground max-w-3xl">
          Studio passport photos are mostly a sizing problem: the right head proportion, the exact
          millimetres, a clean print. This maker solves the sizing half for free. Upload a photo
          taken against a plain wall, pick your country preset — United States, United Kingdom,
          European Union, Canada, China, India and Pakistan standards are included — drag to position
          your face inside the guide oval, zoom to fit, and download a single photo or a full 4 x 6
          inch print sheet. Your photo never leaves your device; all processing happens in your
          browser.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Create your passport photo</CardTitle>
          <CardDescription>
            Currently {preset.sizeText} at 300 dpi ({preset.w} x {preset.h} px). The dashed oval is
            an on-screen guide only — it never appears in your downloads.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid lg:grid-cols-[1fr_340px] gap-8 items-start">
            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="pp-preset">Country / document preset</Label>
                <Select
                  value={presetKey}
                  onValueChange={(v) => {
                    setPresetKey(v);
                    setZoom(1);
                    setOffset({ x: 0, y: 0 });
                  }}
                >
                  <SelectTrigger id="pp-preset" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(PRESETS).map(([key, p]) => (
                      <SelectItem key={key} value={key}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="pp-file">
                  <Upload className="w-4 h-4 inline mr-1" /> Upload your photo
                </Label>
                <Input
                  id="pp-file"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFile(e.target.files?.[0])}
                />
                <p className="text-xs text-muted-foreground">
                  JPG or PNG from a phone or camera. Best results: plain light wall behind you, face
                  the window light, no flash.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="pp-zoom">
                  <ZoomIn className="w-4 h-4 inline mr-1" /> Zoom — {zoom.toFixed(2)}x
                </Label>
                <Slider
                  id="pp-zoom"
                  value={[zoom]}
                  onValueChange={(v) => setZoom(v[0])}
                  min={1}
                  max={3}
                  step={0.01}
                  disabled={!img}
                />
                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Move className="w-3.5 h-3.5" /> Drag the photo in the preview to reposition it.
                  Fill the dashed oval with your head, keeping a small margin above your hair.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 pt-1">
                <Button type="button" onClick={downloadSheet} disabled={!img} className="gap-2">
                  <Download className="w-4 h-4" /> Download 4x6 print sheet
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={downloadSingle}
                  disabled={!img}
                  className="gap-2"
                >
                  <Download className="w-4 h-4" /> Download single photo
                </Button>
              </div>
              <p className="text-sm text-muted-foreground flex gap-2">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                This tool does not remove or change your background — no editor here touches
                anything except crop, position and size, which is exactly what photo rules allow
                you to adjust yourself.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-muted/40 p-3">
              <canvas
                ref={previewRef}
                width={preset.w}
                height={preset.h}
                className="w-full max-w-[320px] mx-auto block touch-none cursor-grab active:cursor-grabbing bg-white"
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
                aria-label="Passport photo crop preview — drag to reposition"
              />
              <p className="text-xs text-muted-foreground text-center mt-2">
                Preview at exact preset pixels. The horizontal dashed line marks where the shoulders
                should sit.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <AdSlot id="passport-photo-maker-after-tool" format="horizontal-banner" />

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">How to make a passport photo at home</h2>
        <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">
          <li>
            <strong className="text-foreground">Take the photo correctly first.</strong> Stand about
            half a metre in front of a plain white or light-grey wall, face a window so daylight
            falls evenly on both sides of your face, and have someone else take the picture at eye
            level from roughly 1.5 metres away. Selfies distort facial proportions because the lens
            sits too close.
          </li>
          <li>
            <strong className="text-foreground">Choose the preset that matches your document.</strong>{' '}
            A US visa photo and a UK passport photo are different shapes — square 2 x 2 inches
            versus 35 x 45 mm — and submitting one in place of the other is a common reason
            applications bounce. The preset list names the countries each size serves.
          </li>
          <li>
            <strong className="text-foreground">Fit your head to the oval.</strong> Drag the photo
            until your face is centred, then use the zoom slider until the top of your head nearly
            touches the top of the dashed oval and your chin rests near its bottom. Shoulders should
            cross the lower dashed line. This proportion — not the crop alone — is what automated
            checkers measure first.
          </li>
          <li>
            <strong className="text-foreground">Print the sheet and measure before you submit.</strong>{' '}
            Download the 4x6 sheet, print it on glossy or matte photo paper, and check one cut photo
            with a ruler: it must match the preset size to the millimetre. If it is even 2 mm off,
            your printer scaled it — turn off fit-to-page and print again.
          </li>
        </ol>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Who uses this maker</h2>
        <div className="grid sm:grid-cols-2 gap-4 text-muted-foreground">
          <p>
            <strong className="text-foreground">Visa and passport applicants</strong> who need a
            compliant photo tonight, not after a studio appointment — for themselves and for family
            members applying together, since one 4x6 sheet can carry a whole household&apos;s photos
            across two prints.
          </p>
          <p>
            <strong className="text-foreground">Parents photographing babies and toddlers.</strong>{' '}
            Studios struggle with infants; at home you can lay the baby on a plain white sheet, shoot
            from directly above, and crop here. Most authorities accept a relaxed expression and no
            visible hands for children under one year.
          </p>
          <p>
            <strong className="text-foreground">HR teams and schools</strong> standardising ID photos
            for badges and records. The UK/EU 35 x 45 mm preset doubles as the standard ID-photo
            size in most of Europe and South Asia, so one workflow covers staff files and student
            records alike.
          </p>
          <p>
            <strong className="text-foreground">Exam and job applicants</strong> who need the same
            photo at three different sizes for three different forms in one evening — switch the
            preset, keep the same crop position, and download each size in under a minute.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Official sizes in this maker</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-muted text-left">
                <th className="p-3 font-semibold">Preset</th>
                <th className="p-3 font-semibold">Print size</th>
                <th className="p-3 font-semibold">Pixels at 300 dpi</th>
                <th className="p-3 font-semibold">Copies on a 4x6 sheet</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              {Object.entries(PRESETS).map(([key, p]) => (
                <tr key={key} className="border-t border-border">
                  <td className="p-3">{p.label}</td>
                  <td className="p-3">{p.sizeText}</td>
                  <td className="p-3">
                    {p.w} x {p.h}
                  </td>
                  <td className="p-3">{p.copies}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-muted-foreground">
          Every preset is exported at a true 300 dpi, the resolution photo printers and application
          portals expect. The 4x6 sheet places copies with 2 mm cutting gaps and a fine grey border
          around each photo so you can trim accurately with scissors or a paper cutter. Digital
          submissions usually want the single photo file instead — upload the single-photo download,
          not the sheet.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Mistakes that get passport photos rejected</h2>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>
            <strong className="text-foreground">Shadows on the face or wall.</strong> A window to one
            side lights half the face and leaves the other half grey. Face the light source directly,
            or use two lamps at equal angles, and stand a step away from the wall so your head casts
            no shadow on it.
          </li>
          <li>
            <strong className="text-foreground">Head too small in the frame.</strong> The single most
            common rejection. If your head occupies less than half the photo height, zoom in here
            rather than submitting and hoping — automated systems measure this precisely.
          </li>
          <li>
            <strong className="text-foreground">Smiling with visible teeth or raised eyebrows.</strong>{' '}
            Most standards require a neutral expression with the mouth closed. It feels unnatural;
            it is also what the template expects.
          </li>
          <li>
            <strong className="text-foreground">Edited or filtered photos.</strong> Beauty filters,
            skin smoothing and background replacement are all grounds for rejection in the US, UK and
            Schengen systems. This maker only crops and resizes, which keeps your photo on the right
            side of that rule.
          </li>
          <li>
            <strong className="text-foreground">Printing at the wrong scale.</strong> A photo that
            measures 33 mm instead of 35 mm wide fails even if everything else is perfect. Measure
            the first print with a ruler — every time, not just the first time you use a new printer.
          </li>
        </ul>
      </section>

      <AdSlot id="passport-photo-maker-in-content" format="in-article" />

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Frequently asked questions</h2>
        <dl className="space-y-3">
          {FAQS.map((f) => (
            <div key={f.q} className="border border-border/70 rounded-xl p-4 bg-card">
              <dt className="font-semibold text-foreground">{f.q}</dt>
              <dd className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{f.a}</dd>
            </div>
          ))}
        </dl>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      </section>
    </div>
  );
}
