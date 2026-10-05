'use client';
import { useRef } from 'react';
import { toast } from 'sonner';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { RotateCcw, Upload, X } from 'lucide-react';
import type { CustomizationOptions, DotStyle, EyeOuterStyle, EyeInnerStyle, FrameStyle, ECLevel } from '@/types';
import { getContrastRatio, getAutoECLevel } from '@/lib/qr-helpers';

interface CustomizationPanelProps {
  options: CustomizationOptions;
  onChange: (options: CustomizationOptions) => void;
  qrText: string;
}

const COLOR_PRESETS = [
  { fg: '#000000', bg: '#ffffff' }, { fg: '#ffffff', bg: '#000000' }, { fg: '#1e40af', bg: '#eff6ff' },
  { fg: '#15803d', bg: '#f0fdf4' }, { fg: '#7c3aed', bg: '#faf5ff' }, { fg: '#dc2626', bg: '#fef2f2' },
  { fg: '#d97706', bg: '#fffbeb' }, { fg: '#0891b2', bg: '#ecfeff' }, { fg: '#be185d', bg: '#fdf2f8' },
  { fg: '#374151', bg: '#f9fafb' }, { fg: '#1e293b', bg: '#f8fafc' }, { fg: '#4d7c0f', bg: '#f7fee7' },
];

const DOT_STYLES: { value: DotStyle; label: string }[] = [
  { value: 'square', label: 'Square' }, { value: 'rounded', label: 'Rounded' }, { value: 'dots', label: 'Dots' },
  { value: 'classy', label: 'Classy' }, { value: 'classy-rounded', label: 'Classy+' }, { value: 'extra-rounded', label: 'Pill' },
];
const EYE_OUTER_STYLES: { value: EyeOuterStyle; label: string }[] = [{ value: 'square', label: 'Square' }, { value: 'rounded', label: 'Rounded' }, { value: 'circle', label: 'Circle' }];
const EYE_INNER_STYLES: { value: EyeInnerStyle; label: string }[] = [{ value: 'square', label: 'Square' }, { value: 'dot', label: 'Dot' }, { value: 'diamond', label: 'Diamond' }];
const FRAME_STYLES: { value: FrameStyle; label: string }[] = [{ value: 'none', label: 'None' }, { value: 'simple', label: 'Simple' }, { value: 'rounded', label: 'Rounded' }, { value: 'badge', label: 'Badge' }, { value: 'banner', label: 'Banner' }, { value: 'ticket', label: 'Ticket' }];
const EC_OPTIONS: { value: ECLevel; label: string; desc: string }[] = [
  { value: 'L', label: 'L', desc: '~7% recovery — smallest QR' }, { value: 'M', label: 'M', desc: '~15% recovery — recommended' },
  { value: 'Q', label: 'Q', desc: '~25% recovery — good for logos' }, { value: 'H', label: 'H', desc: '~30% recovery — best for logos' },
];

function ColorPicker({ label, value, onChange, disabled }: { label: string; value: string; onChange: (v: string) => void; disabled?: boolean }) {
  return (
    <div className={`space-y-1 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <div className="flex items-center gap-2">
        <input type="color" value={value} onChange={e => onChange(e.target.value)} className="w-10 h-9 rounded-md cursor-pointer border border-border bg-transparent p-0.5" aria-label={`${label} color picker`} disabled={disabled} />
        <Input type="text" value={value} onChange={e => { const v = e.target.value; if (/^#[0-9A-Fa-f]{0,6}$/.test(v)) onChange(v.length === 7 ? v : value); }} className="w-28 text-xs font-mono h-9" placeholder="#000000" maxLength={7} disabled={disabled} />
      </div>
    </div>
  );
}

export function CustomizationPanel({ options, onChange, qrText }: CustomizationPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const update = (patch: Partial<CustomizationOptions>) => onChange({ ...options, ...patch });
  const contrastRatio = getContrastRatio(options.fgColor, options.bgColor);
  const autoEC = getAutoECLevel(!!options.logoUrl, qrText.length);
  const contrastLabel = contrastRatio >= 7 ? `AA+ (${contrastRatio.toFixed(1)}:1)` : contrastRatio >= 4.5 ? `AA (${contrastRatio.toFixed(1)}:1)` : contrastRatio >= 3 ? `A (${contrastRatio.toFixed(1)}:1)` : `Poor (${contrastRatio.toFixed(1)}:1)`;
  const contrastVariant: 'default' | 'secondary' | 'destructive' = contrastRatio >= 7 ? 'default' : contrastRatio >= 4.5 ? 'secondary' : 'destructive';

  const handleLogoFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = e => { update({ logoUrl: (e.target as FileReader).result as string, ecLevel: 'H' }); toast.info('Error correction set to H for logo compatibility'); };
    reader.readAsDataURL(file);
  };

  return (
    <Accordion type="multiple" className="space-y-1">
      <AccordionItem value="colors" className="border rounded-lg px-3">
        <AccordionTrigger className="text-sm font-medium py-3">Colors</AccordionTrigger>
        <AccordionContent className="space-y-4 pb-4">
          <div className="grid grid-cols-2 gap-3">
            <ColorPicker label="Foreground" value={options.fgColor} onChange={v => update({ fgColor: v })} />
            <ColorPicker label="Background" value={options.bgColor} onChange={v => update({ bgColor: v })} disabled={options.transparent} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Contrast ratio</span>
            <Badge variant={contrastVariant}>{contrastLabel}</Badge>
          </div>
          {contrastRatio < 3 && <p className="text-xs text-destructive">Poor contrast — this QR code may not scan on all devices.</p>}
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Presets</Label>
            <div className="flex flex-wrap gap-1.5">
              {COLOR_PRESETS.map(({ fg, bg }, i) => (
                <button key={i} type="button" onClick={() => update({ fgColor: fg, bgColor: bg })} className="w-7 h-7 rounded-md border-2 border-border hover:scale-110 transition-transform overflow-hidden" aria-label={`Color preset ${fg} on ${bg}`} style={{ background: `linear-gradient(135deg, ${fg} 50%, ${bg} 50%)` }} />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3 pt-1">
            <Button variant="outline" size="sm" onClick={() => update({ fgColor: options.bgColor, bgColor: options.fgColor })} className="gap-1.5 text-xs"><RotateCcw className="w-3.5 h-3.5" />Invert colors</Button>
            <div className="flex items-center gap-2">
              <Switch id="transparent-bg" checked={options.transparent} onCheckedChange={v => update({ transparent: v })} />
              <Label htmlFor="transparent-bg" className="text-xs cursor-pointer">Transparent bg</Label>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="dots" className="border rounded-lg px-3">
        <AccordionTrigger className="text-sm font-medium py-3">Dot Style</AccordionTrigger>
        <AccordionContent className="pb-4">
          <ToggleGroup type="single" value={options.dotStyle} onValueChange={v => { if (v) update({ dotStyle: v as DotStyle }); }} className="flex flex-wrap gap-2">
            {DOT_STYLES.map(s => <ToggleGroupItem key={s.value} value={s.value} aria-label={`Dot style: ${s.label}`} className="flex-1 min-w-[80px] text-xs">{s.label}</ToggleGroupItem>)}
          </ToggleGroup>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="eyes" className="border rounded-lg px-3">
        <AccordionTrigger className="text-sm font-medium py-3">Eye (Finder) Style</AccordionTrigger>
        <AccordionContent className="space-y-4 pb-4">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Outer shape</Label>
            <ToggleGroup type="single" value={options.eyeOuterStyle} onValueChange={v => { if (v) update({ eyeOuterStyle: v as EyeOuterStyle }); }} className="flex gap-2">
              {EYE_OUTER_STYLES.map(s => <ToggleGroupItem key={s.value} value={s.value} className="flex-1 text-xs">{s.label}</ToggleGroupItem>)}
            </ToggleGroup>
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Inner dot</Label>
            <ToggleGroup type="single" value={options.eyeInnerStyle} onValueChange={v => { if (v) update({ eyeInnerStyle: v as EyeInnerStyle }); }} className="flex gap-2">
              {EYE_INNER_STYLES.map(s => <ToggleGroupItem key={s.value} value={s.value} className="flex-1 text-xs">{s.label}</ToggleGroupItem>)}
            </ToggleGroup>
          </div>
          <ColorPicker label="Eye color" value={options.eyeColor} onChange={v => update({ eyeColor: v })} />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="logo" className="border rounded-lg px-3">
        <AccordionTrigger className="text-sm font-medium py-3">Logo</AccordionTrigger>
        <AccordionContent className="space-y-4 pb-4">
          <div onDrop={e => { e.preventDefault(); const f = e.dataTransfer?.files[0]; if (f?.type.startsWith('image/')) handleLogoFile(f); }} onDragOver={e => e.preventDefault()} onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/40 transition-colors" role="button" tabIndex={0} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click(); }} aria-label="Upload logo image">
            {options.logoUrl ? (
              <div className="flex items-center justify-center gap-3">
                <img src={options.logoUrl} alt="Logo preview" className="w-12 h-12 object-contain rounded-md border border-border" />
                <div className="text-left"><p className="text-xs font-medium">Logo loaded</p><p className="text-xs text-muted-foreground">Click to replace</p></div>
                <button type="button" onClick={e => { e.stopPropagation(); update({ logoUrl: null }); }} className="ml-auto text-destructive hover:text-destructive/80" aria-label="Remove logo"><X className="w-4 h-4" /></button>
              </div>
            ) : (
              <div className="space-y-1"><Upload className="w-6 h-6 mx-auto text-muted-foreground" /><p className="text-xs text-muted-foreground">Drag & drop or click to upload</p></div>
            )}
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleLogoFile(f); }} />
          {options.logoUrl && (
            <>
              <div className="space-y-2">
                <div className="flex justify-between"><Label className="text-xs text-muted-foreground">Logo size</Label><span className="text-xs text-muted-foreground">{Math.round(options.logoSize * 100)}%</span></div>
                <Slider min={10} max={40} step={1} value={[Math.round(options.logoSize * 100)]} onValueChange={v => update({ logoSize: (v[0] ?? 20) / 100 })} aria-label="Logo size" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between"><Label className="text-xs text-muted-foreground">Padding</Label><span className="text-xs text-muted-foreground">{options.logoPadding}px</span></div>
                <Slider min={0} max={10} step={1} value={[options.logoPadding]} onValueChange={v => update({ logoPadding: v[0] ?? 2 })} aria-label="Logo padding" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Logo shape</Label>
                <ToggleGroup type="single" value={options.logoShape} onValueChange={v => { if (v) update({ logoShape: v as 'square' | 'circle' }); }} className="flex gap-2">
                  <ToggleGroupItem value="square" className="flex-1 text-xs">Square</ToggleGroupItem>
                  <ToggleGroupItem value="circle" className="flex-1 text-xs">Circle</ToggleGroupItem>
                </ToggleGroup>
              </div>
            </>
          )}
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="ec" className="border rounded-lg px-3">
        <AccordionTrigger className="text-sm font-medium py-3">Error Correction</AccordionTrigger>
        <AccordionContent className="pb-4">
          <RadioGroup value={options.ecLevel} onValueChange={v => update({ ecLevel: v as ECLevel })} className="space-y-2">
            {EC_OPTIONS.map(o => (
              <div key={o.value} className="flex items-center gap-2">
                <RadioGroupItem value={o.value} id={`ec-${o.value}`} />
                <Label htmlFor={`ec-${o.value}`} className="text-sm cursor-pointer flex items-center gap-2">
                  <span className="font-medium">Level {o.value}</span>
                  <Tooltip><TooltipTrigger asChild><span className="text-xs text-muted-foreground underline decoration-dotted cursor-help">{o.desc.split('—')[0]?.trim()}</span></TooltipTrigger><TooltipContent className="max-w-xs text-xs">{o.desc}</TooltipContent></Tooltip>
                  {autoEC === o.value && <Badge variant="secondary" className="text-xs py-0 px-1.5">Recommended</Badge>}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="size" className="border rounded-lg px-3">
        <AccordionTrigger className="text-sm font-medium py-3">Output Size</AccordionTrigger>
        <AccordionContent className="space-y-4 pb-4">
          <div className="flex justify-between"><span className="text-xs text-muted-foreground">Size</span><span className="text-xs font-medium">{options.outputSize} × {options.outputSize} px</span></div>
          <Slider min={128} max={2000} step={8} value={[options.outputSize]} onValueChange={v => update({ outputSize: v[0] ?? 512 })} aria-label="Output size in pixels" />
          <div className="flex gap-2">
            {[256, 512, 1024].map(px => <Button key={px} variant="outline" size="sm" onClick={() => update({ outputSize: px })} className={`flex-1 text-xs ${options.outputSize === px ? 'ring-2 ring-primary' : ''}`}>{px}px</Button>)}
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="frame" className="border rounded-lg px-3">
        <AccordionTrigger className="text-sm font-medium py-3">Frame</AccordionTrigger>
        <AccordionContent className="space-y-4 pb-4">
          <ToggleGroup type="single" value={options.frameStyle} onValueChange={v => { if (v) update({ frameStyle: v as FrameStyle }); }} className="flex flex-wrap gap-2">
            {FRAME_STYLES.map(s => <ToggleGroupItem key={s.value} value={s.value} className="flex-1 min-w-[72px] text-xs">{s.label}</ToggleGroupItem>)}
          </ToggleGroup>
          {options.frameStyle !== 'none' && (
            <div className="space-y-4">
              <div className="space-y-1"><Label className="text-xs text-muted-foreground">Call-to-action text</Label><Input value={options.frameCta} onChange={e => update({ frameCta: e.target.value })} placeholder="Scan Me" className="text-xs h-9" /></div>
              <ColorPicker label="Frame color" value={options.frameColor} onChange={v => update({ frameColor: v })} />
              <div className="space-y-2">
                <div className="flex justify-between"><Label className="text-xs text-muted-foreground">Font size</Label><span className="text-xs text-muted-foreground">{options.frameFontSize}px</span></div>
                <Slider min={10} max={24} step={1} value={[options.frameFontSize]} onValueChange={v => update({ frameFontSize: v[0] ?? 14 })} aria-label="Frame font size" />
              </div>
            </div>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
