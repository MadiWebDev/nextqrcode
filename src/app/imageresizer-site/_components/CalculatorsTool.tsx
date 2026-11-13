'use client';

/**
 * Image maths calculators: aspect ratio, DPI and print size. Pure,
 * instant, and honest about the maths — including the classic gotcha that
 * "300 DPI" only means something together with a physical size.
 */
import { useState } from 'react';

const inputCls = 'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm';
const cardCls = 'min-w-0 rounded-xl border border-border bg-card p-4 sm:p-5';

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

function AspectCalculator() {
  const [w, setW] = useState('1920');
  const [h, setH] = useState('1080');
  const [newW, setNewW] = useState('800');
  const wn = parseFloat(w) || 0;
  const hn = parseFloat(h) || 0;
  const divisor = wn > 0 && hn > 0 && Number.isInteger(wn) && Number.isInteger(hn) ? gcd(wn, hn) : 0;
  const ratioText = divisor ? `${wn / divisor}:${hn / divisor}` : '—';
  const decimal = hn > 0 ? (wn / hn).toFixed(4) : '—';
  const computedH = wn > 0 && hn > 0 && parseFloat(newW) > 0 ? Math.round((parseFloat(newW) * hn) / wn) : null;
  return (
    <div className={cardCls}>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="text-xs font-medium">Width (px)</span>
          <input type="number" value={w} onChange={(e) => setW(e.target.value)} className={inputCls} />
        </label>
        <label className="block">
          <span className="text-xs font-medium">Height (px)</span>
          <input type="number" value={h} onChange={(e) => setH(e.target.value)} className={inputCls} />
        </label>
      </div>
      <dl className="mt-4 space-y-1.5 text-sm">
        <div className="flex justify-between"><dt className="text-muted-foreground">Aspect ratio</dt><dd className="font-semibold">{ratioText}</dd></div>
        <div className="flex justify-between"><dt className="text-muted-foreground">Decimal</dt><dd className="font-semibold">{decimal}</dd></div>
      </dl>
      <div className="mt-4 border-t border-border pt-4">
        <label className="block">
          <span className="text-xs font-medium">Resize keeping this ratio — new width (px)</span>
          <input type="number" value={newW} onChange={(e) => setNewW(e.target.value)} className={inputCls} />
        </label>
        {computedH !== null && (
          <p className="mt-2 text-sm">
            New size: <strong>{newW} × {computedH}px</strong>
          </p>
        )}
      </div>
    </div>
  );
}

function DpiCalculator() {
  const [pxW, setPxW] = useState('3000');
  const [inches, setInches] = useState('10');
  const [targetDpi, setTargetDpi] = useState('300');
  const px = parseFloat(pxW) || 0;
  const inch = parseFloat(inches) || 0;
  const dpi = inch > 0 ? Math.round(px / inch) : null;
  const neededPx = inch > 0 && parseFloat(targetDpi) > 0 ? Math.round(inch * parseFloat(targetDpi)) : null;
  return (
    <div className={cardCls}>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="text-xs font-medium">Image width (px)</span>
          <input type="number" value={pxW} onChange={(e) => setPxW(e.target.value)} className={inputCls} />
        </label>
        <label className="block">
          <span className="text-xs font-medium">Print width (inches)</span>
          <input type="number" value={inches} onChange={(e) => setInches(e.target.value)} className={inputCls} />
        </label>
      </div>
      {dpi !== null && (
        <p className="mt-4 text-sm">
          Effective resolution: <strong>{dpi} DPI</strong>{' '}
          <span className="text-muted-foreground">
            ({dpi >= 300 ? 'print-quality' : dpi >= 150 ? 'acceptable for many prints' : 'likely soft in print'})
          </span>
        </p>
      )}
      <div className="mt-4 border-t border-border pt-4">
        <label className="block">
          <span className="text-xs font-medium">…or: pixels needed at a target DPI for that width</span>
          <input type="number" value={targetDpi} onChange={(e) => setTargetDpi(e.target.value)} className={inputCls} />
        </label>
        {neededPx !== null && (
          <p className="mt-2 text-sm">
            You need <strong>{neededPx}px</strong> across for {targetDpi} DPI at {inches} inches.
          </p>
        )}
      </div>
    </div>
  );
}

function PrintSizeCalculator() {
  const [pxW, setPxW] = useState('3000');
  const [pxH, setPxH] = useState('2000');
  const [dpi, setDpi] = useState('300');
  const w = parseFloat(pxW) || 0;
  const h = parseFloat(pxH) || 0;
  const d = parseFloat(dpi) || 0;
  const inW = d > 0 ? w / d : 0;
  const inH = d > 0 ? h / d : 0;
  return (
    <div className={cardCls}>
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="block">
          <span className="text-xs font-medium">Width (px)</span>
          <input type="number" value={pxW} onChange={(e) => setPxW(e.target.value)} className={inputCls} />
        </label>
        <label className="block">
          <span className="text-xs font-medium">Height (px)</span>
          <input type="number" value={pxH} onChange={(e) => setPxH(e.target.value)} className={inputCls} />
        </label>
        <label className="block">
          <span className="text-xs font-medium">DPI</span>
          <input type="number" value={dpi} onChange={(e) => setDpi(e.target.value)} className={inputCls} />
        </label>
      </div>
      {d > 0 && (
        <dl className="mt-4 space-y-1.5 text-sm">
          <div className="flex justify-between"><dt className="text-muted-foreground">Print size (inches)</dt><dd className="font-semibold">{inW.toFixed(2)} × {inH.toFixed(2)} in</dd></div>
          <div className="flex justify-between"><dt className="text-muted-foreground">Print size (cm)</dt><dd className="font-semibold">{(inW * 2.54).toFixed(1)} × {(inH * 2.54).toFixed(1)} cm</dd></div>
          <div className="flex justify-between"><dt className="text-muted-foreground">Print size (mm)</dt><dd className="font-semibold">{Math.round(inW * 25.4)} × {Math.round(inH * 25.4)} mm</dd></div>
        </dl>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        {[72, 150, 300].map((preset) => (
          <button key={preset} type="button" onClick={() => setDpi(String(preset))} className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-accent">
            {preset} DPI {preset === 72 ? '(screen)' : preset === 300 ? '(print)' : '(draft print)'}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function CalculatorsTool({ variant }: { variant: 'aspect' | 'dpi' | 'print' }) {
  return (
    <div className="mx-auto w-full max-w-2xl min-w-0">
      {variant === 'aspect' && <AspectCalculator />}
      {variant === 'dpi' && <DpiCalculator />}
      {variant === 'print' && <PrintSizeCalculator />}
      <p className="mt-4 text-xs text-muted-foreground">
        The maths: DPI = pixels ÷ inches. A pixel count alone is never 300 DPI — DPI only exists
        once a physical print size is chosen. Screens, by contrast, just use pixels.
      </p>
    </div>
  );
}
