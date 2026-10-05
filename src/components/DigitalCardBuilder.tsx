'use client';

import { useState } from 'react';
import {
  Sparkles,
  Database,
  Upload,
  CheckCircle2,
  ExternalLink,
  Loader2,
  Palette,
  Share2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { QRData } from '@/types';
import type { CardTheme } from '@/types/card';
import { toast } from 'sonner';

interface DigitalCardBuilderProps {
  data: QRData;
  onChange: (data: QRData) => void;
}

const THEMES: { id: CardTheme; label: string; preview: string }[] = [
  { id: 'luxury-dark', label: 'Luxury Obsidian', preview: 'bg-neutral-950 border-amber-500/50' },
  { id: 'emerald-glass', label: 'Emerald Glass', preview: 'bg-emerald-950 border-emerald-500/50' },
  { id: 'royal-indigo', label: 'Royal Indigo', preview: 'bg-indigo-950 border-indigo-500/50' },
  { id: 'sunset-rose', label: 'Sunset Rose', preview: 'bg-rose-950 border-rose-500/50' },
  { id: 'minimalist', label: 'Titanium Minimal', preview: 'bg-slate-200 dark:bg-slate-800 border-slate-400' },
];

export function DigitalCardBuilder({ data, onChange }: DigitalCardBuilderProps) {
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(Boolean(data['cardUrl']));

  const cardTheme = (data['cardTheme'] as CardTheme) || 'luxury-dark';

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'image');

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        toast.error(result.error || 'Failed to upload photo');
        return;
      }
      onChange({ ...data, avatarUrl: result.url });
      toast.success('Avatar uploaded to Cloudinary CDN!');
    } catch {
      toast.error('Network error during avatar upload');
    } finally {
      setUploadingAvatar(false);
    }
  }

  async function handleSaveCard() {
    if (!data['name'] || !data['name'].trim()) {
      toast.error('Please enter a Full Name first.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: data['name'],
        title: data['title'] || '',
        company: data['company'] || '',
        phone: data['phone'] || '',
        email: data['email'] || '',
        website: data['website'] || '',
        address: data['address'] || '',
        bio: data['bio'] || '',
        avatarUrl: data['avatarUrl'] || '',
        theme: cardTheme,
        socials: {
          linkedin: data['linkedin'] || '',
          twitter: data['twitter'] || '',
          instagram: data['instagram'] || '',
          github: data['github'] || '',
          whatsapp: data['phone'] ? `https://wa.me/${data['phone'].replace(/\D/g, '')}` : '',
        },
      };

      const res = await fetch('/api/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        toast.error(result.error || 'Failed to save card');
        return;
      }

      onChange({
        ...data,
        cardUrl: result.url,
        cardSlug: result.card.slug,
      });

      toast.success('Digital Card published! QR code is now linked.');
    } catch {
      toast.error('Network error saving digital card');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-2xl border border-primary/20 bg-primary/[0.03] p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <span>Cloud Digital Card Suite</span>
              <span className="text-[10px] font-semibold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                <Database className="w-2.5 h-2.5" />
                MongoDB
              </span>
            </h4>
            <p className="text-[11px] text-muted-foreground">
              Generate a mobile landing card with 1-tap contact saving
            </p>
          </div>
        </div>

        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-xs h-7 text-primary hover:text-primary"
        >
          {showAdvanced ? 'Hide Options' : 'Customize Card'}
        </Button>
      </div>

      {showAdvanced && (
        <div className="pt-2 border-t border-border/50 space-y-4">
          {/* Avatar Upload via Cloudinary */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Profile Photo / Avatar</Label>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-border bg-muted flex items-center justify-center shrink-0">
                {data['avatarUrl'] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={data['avatarUrl']}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xs font-bold text-muted-foreground">
                    {data['name'] ? data['name'].charAt(0).toUpperCase() : '?'}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <input
                  id="avatar-file-input"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={uploadingAvatar}
                  onClick={() => document.getElementById('avatar-file-input')?.click()}
                  className="text-xs h-8 gap-1.5"
                >
                  {uploadingAvatar ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Uploading to Cloudinary...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5" />
                      <span>{data['avatarUrl'] ? 'Change Photo' : 'Upload to Cloudinary'}</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Theme Selector */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-primary" />
              <span>Card Design Theme</span>
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => onChange({ ...data, cardTheme: t.id })}
                  className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all ${
                    cardTheme === t.id
                      ? 'border-primary ring-2 ring-primary/20 bg-card'
                      : 'border-border/60 hover:border-border'
                  }`}
                >
                  <div className={`w-3.5 h-3.5 rounded-full border ${t.preview} shrink-0`} />
                  <span className="text-[11px] font-medium text-foreground truncate">
                    {t.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Bio / Tagline */}
          <div className="space-y-1.5">
            <Label htmlFor="card-bio" className="text-xs font-medium">
              Bio / Elevator Pitch
            </Label>
            <Textarea
              id="card-bio"
              value={data['bio'] || ''}
              onChange={(e) => onChange({ ...data, bio: e.target.value })}
              placeholder="Helping founders scale optical systems and web technologies..."
              rows={2}
              className="resize-none text-xs"
            />
          </div>

          {/* Social Links */}
          <div className="space-y-2">
            <Label className="text-xs font-medium flex items-center gap-1">
              <Share2 className="w-3 h-3 text-primary" />
              <span>Social Links (Optional)</span>
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Input
                placeholder="LinkedIn URL"
                value={data['linkedin'] || ''}
                onChange={(e) => onChange({ ...data, linkedin: e.target.value })}
                className="text-xs h-8"
              />
              <Input
                placeholder="Twitter / X URL"
                value={data['twitter'] || ''}
                onChange={(e) => onChange({ ...data, twitter: e.target.value })}
                className="text-xs h-8"
              />
              <Input
                placeholder="Instagram URL"
                value={data['instagram'] || ''}
                onChange={(e) => onChange({ ...data, instagram: e.target.value })}
                className="text-xs h-8"
              />
              <Input
                placeholder="GitHub Profile URL"
                value={data['github'] || ''}
                onChange={(e) => onChange({ ...data, github: e.target.value })}
                className="text-xs h-8"
              />
            </div>
          </div>

          {/* Save & Publish Action */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2">
            <Button
              type="button"
              size="sm"
              disabled={saving}
              onClick={handleSaveCard}
              className="flex-1 text-xs gap-1.5 font-semibold"
            >
              {saving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Publishing to Cloud...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>
                    {data['cardUrl'] ? 'Update Card & Sync QR' : 'Publish Card & Link to QR'}
                  </span>
                </>
              )}
            </Button>

            {data['cardUrl'] && (
              <a
                href={data['cardUrl']}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg border border-border bg-background hover:bg-muted text-xs font-medium transition"
              >
                <span>Preview Card</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          {data['cardUrl'] && (
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center justify-between">
              <span className="truncate">
                Linked: <span className="font-mono">{data['cardUrl']}</span>
              </span>
              <span className="font-semibold shrink-0 ml-2">Active</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
