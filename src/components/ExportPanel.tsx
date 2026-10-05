'use client';
import type { RefObject } from 'react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Download, Copy, Printer, Share2, Link, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import type { QRType, QRState, CustomizationOptions } from '@/types';
import { drawCustomQR } from '@/lib/canvas-qr';
import QRCodeLib from 'qrcode';

interface ExportPanelProps {
  qrText: string;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  type: QRType;
  state: QRState & { customization: CustomizationOptions };
}

function downloadBlob(blob: Blob | null, filename: string): void {
  if (!blob) return;
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a); URL.revokeObjectURL(url);
}

export function ExportPanel({ qrText, canvasRef, type, state }: ExportPanelProps) {
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const canvas = canvasRef.current;

  const handleDownload = async (format: string) => {
    if (!canvas || !qrText) { toast.error('No QR code to download. Fill in the required fields first.'); return; }
    try {
      switch (format) {
        case 'png': canvas.toBlob(blob => downloadBlob(blob, `qrcode-${type}.png`)); toast.success('PNG downloaded'); break;
        case 'png-hd': {
          const hdCanvas = document.createElement('canvas');
          await drawCustomQR(hdCanvas, qrText, { ...state.customization, outputSize: state.customization.outputSize * 4 });
          hdCanvas.toBlob(blob => downloadBlob(blob, `qrcode-${type}-hd.png`)); toast.success('HD PNG downloaded'); break;
        }
        case 'svg': {
          const svgStr = await QRCodeLib.toString(qrText, { type: 'svg', errorCorrectionLevel: state.customization.ecLevel, margin: 2, color: { dark: state.customization.fgColor, light: state.customization.transparent ? '#00000000' : state.customization.bgColor } });
          downloadBlob(new Blob([svgStr], { type: 'image/svg+xml' }), `qrcode-${type}.svg`); toast.success('SVG downloaded'); break;
        }
        case 'jpeg': canvas.toBlob(blob => downloadBlob(blob, `qrcode-${type}.jpg`), 'image/jpeg', 0.92); toast.success('JPEG downloaded'); break;
        case 'pdf': {
          const dataUrl = canvas.toDataURL('image/png');
          const w = window.open('', '_blank');
          if (!w) { toast.error('Pop-up blocked. Allow pop-ups and try again.'); return; }
          w.document.write(`<!DOCTYPE html><html><head><title>QR Code PDF</title><style>*{margin:0;padding:0;box-sizing:border-box}body{display:flex;align-items:center;justify-content:center;min-height:100vh;background:#fff}.page{width:210mm;min-height:297mm;display:flex;align-items:center;justify-content:center}img{width:80mm;height:80mm;object-fit:contain}@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}</style></head><body><div class="page"><img src="${dataUrl}" alt="QR Code"/></div><script>window.onload=()=>{setTimeout(()=>{window.print();window.close();},300);}<\/script></body></html>`);
          w.document.close(); toast.success('PDF print dialog opened'); break;
        }
      }
    } catch { toast.error('Download failed. Please try again.'); }
  };

  const handleCopy = async (mode: string) => {
    if (!canvas || !qrText) { toast.error('No QR code to copy.'); return; }
    try {
      if (mode === 'image') {
        await new Promise<void>((resolve, reject) => {
          canvas.toBlob(async blob => {
            if (!blob) { reject(new Error('No blob')); return; }
            await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
            resolve();
          });
        });
        toast.success('Image copied to clipboard');
      } else if (mode === 'datauri') {
        await navigator.clipboard.writeText(canvas.toDataURL('image/png'));
        toast.success('Data URI copied to clipboard');
      } else if (mode === 'embed') {
        await navigator.clipboard.writeText(`<img src="${canvas.toDataURL('image/png')}" alt="QR Code" style="max-width:100%;height:auto;" />`);
        toast.success('Embed HTML copied to clipboard');
      }
    } catch { toast.error('Copy failed. Check browser permissions.'); }
  };

  const handleShare = async () => {
    if (!canvas || !qrText) { toast.error('No QR code to share.'); return; }
    try {
      const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve));
      if (blob && navigator.share) {
        await navigator.share({ title: 'QR Code', text: 'Scan this QR code', files: [new File([blob], `qrcode-${type}.png`, { type: 'image/png' })] });
      } else { handleShareableLink(); setShareDialogOpen(true); }
    } catch { /* user cancelled */ }
  };

  const handlePrint = () => {
    if (!canvas || !qrText) { toast.error('No QR code to print.'); return; }
    const dataUrl = canvas.toDataURL('image/png');
    const w = window.open('', '_blank');
    if (!w) { toast.error('Pop-up blocked.'); return; }
    w.document.write(`<!DOCTYPE html><html><head><title>Print QR Code</title><style>body{margin:0;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;font-family:system-ui}.qr{text-align:center;padding:40px}img{max-width:400px;width:100%;height:auto}p{margin-top:16px;font-size:14px;color:#666}@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}</style></head><body><div class="qr"><img src="${dataUrl}" alt="QR Code"/><p>Generated with QR Studio</p></div><script>window.onload=()=>{setTimeout(()=>{window.print();window.close();},200);}<\/script></body></html>`);
    w.document.close();
  };

  const handleShareableLink = () => {
    try {
      const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(state))));
      const url = `${window.location.origin}${window.location.pathname}?state=${encoded}`;
      setShareUrl(url);
      navigator.clipboard.writeText(url).then(() => toast.success('Shareable link copied!')).catch(() => setShareDialogOpen(true));
      if (url.length > 2048) toast.warning('Shareable URL is very long.');
    } catch { toast.error('Failed to generate shareable link.'); }
  };

  const disabled = !qrText;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="default" size="sm" disabled={disabled} className="w-full flex items-center justify-center gap-1.5" aria-label="Download QR code">
              <Download className="w-3.5 h-3.5 shrink-0" /><span className="text-xs">Download</span><ChevronDown className="w-3 h-3 shrink-0" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-44">
            <DropdownMenuItem onClick={() => handleDownload('png')}>PNG (standard)</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDownload('png-hd')}>PNG HD (4×)</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDownload('svg')}>SVG (vector)</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDownload('jpeg')}>JPEG</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleDownload('pdf')}>PDF (print)</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" disabled={disabled} className="w-full flex items-center justify-center gap-1.5" aria-label="Copy QR code">
              <Copy className="w-3.5 h-3.5 shrink-0" /><span className="text-xs">Copy</span><ChevronDown className="w-3 h-3 shrink-0" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-44">
            <DropdownMenuItem onClick={() => handleCopy('image')}>Copy Image</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleCopy('datauri')}>Copy Data URI</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleCopy('embed')}>Copy Embed HTML</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="outline" size="sm" onClick={handlePrint} disabled={disabled} className="w-full flex items-center justify-center gap-1.5" aria-label="Print QR code">
          <Printer className="w-3.5 h-3.5 shrink-0" /><span className="text-xs">Print</span>
        </Button>
        <Button variant="outline" size="sm" onClick={handleShare} disabled={disabled} className="w-full flex items-center justify-center gap-1.5" aria-label="Share QR code">
          <Share2 className="w-3.5 h-3.5 shrink-0" /><span className="text-xs">Share</span>
        </Button>
      </div>
      <Button variant="ghost" size="sm" onClick={handleShareableLink} className="w-full flex items-center justify-center gap-1.5 text-muted-foreground" aria-label="Copy shareable link">
        <Link className="w-3.5 h-3.5 shrink-0" /><span className="text-xs">Copy shareable link</span>
      </Button>
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Shareable Link</DialogTitle></DialogHeader>
          <div className="flex gap-2">
            <Input value={shareUrl} readOnly className="text-xs font-mono" onFocus={e => e.target.select()} />
            <Button size="sm" onClick={() => { navigator.clipboard.writeText(shareUrl).then(() => toast.success('Copied!')); }}>Copy</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
