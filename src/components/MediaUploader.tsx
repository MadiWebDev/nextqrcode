'use client';

import { useState, useRef } from 'react';
import { UploadCloud, CheckCircle2, AlertCircle, Loader2, Sparkles, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface MediaUploaderProps {
  type: 'image' | 'video' | 'audio';
  currentUrl?: string;
  onUploadSuccess: (url: string) => void;
}

export function MediaUploader({ type, currentUrl, onUploadSuccess }: MediaUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const acceptMap = {
    image: 'image/jpeg,image/png,image/webp,image/gif,image/svg+xml',
    video: 'video/mp4,video/webm,video/quicktime',
    audio: 'audio/mpeg,audio/mp3,audio/wav,audio/ogg,audio/aac',
  };

  const labelMap = {
    image: 'Upload Image to Cloudinary',
    video: 'Upload Video to Cloudinary',
    audio: 'Upload MP3 / Audio to Cloudinary',
  };

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset state
    setUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (data.unconfigured) {
          setUploadError(
            'Cloudinary is not configured yet. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in .env.local to enable 1-click cloud uploads.'
          );
          toast.error('Cloudinary not configured in .env.local');
        } else {
          setUploadError(data.error || 'Upload failed');
          toast.error(data.error || 'Failed to upload media file');
        }
        return;
      }

      onUploadSuccess(data.url);
      toast.success(`${type.toUpperCase()} successfully uploaded to Cloudinary CDN!`);
    } catch {
      setUploadError('Network error uploading file. Please try again.');
      toast.error('Network error during upload');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  return (
    <div className="rounded-xl border border-dashed border-border/80 bg-slate-50/50 dark:bg-slate-900/40 p-4 transition-all hover:border-primary/50">
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptMap[type]}
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            {uploading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : currentUrl ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            ) : (
              <UploadCloud className="w-5 h-5" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-foreground">
                {uploading ? 'Uploading to CDN...' : labelMap[type]}
              </span>
              <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-amber-500 bg-amber-500/10 px-1.5 py-0.2 rounded-full">
                <Sparkles className="w-2.5 h-2.5" />
                Cloudinary
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              {currentUrl
                ? 'CDN URL generated and applied to QR code'
                : '1-click cloud upload with instant global CDN delivery'}
            </p>
          </div>
        </div>

        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          className="text-xs h-8 shrink-0 gap-1.5"
        >
          {uploading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Choose File</span>
            </>
          )}
        </Button>
      </div>

      {uploadError && (
        <div className="mt-3 p-2.5 rounded-lg bg-destructive/10 border border-destructive/20 text-[11px] text-destructive flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="flex-1 leading-normal">{uploadError}</div>
        </div>
      )}

      {currentUrl && (
        <div className="mt-3 pt-2.5 border-t border-border/50 flex items-center justify-between text-[11px] text-muted-foreground truncate">
          <span className="truncate flex items-center gap-1">
            <FileText className="w-3.5 h-3.5 shrink-0" />
            <span className="font-mono truncate">{currentUrl}</span>
          </span>
          <span className="text-emerald-500 font-medium shrink-0 ml-2">Ready</span>
        </div>
      )}
    </div>
  );
}
