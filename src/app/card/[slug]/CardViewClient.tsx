'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Phone,
  Mail,
  Globe,
  MapPin,
  Share2,
  CheckCircle2,
  UserPlus,
  QrCode as QrIcon,
  X,
  ExternalLink,
} from 'lucide-react';
import type { DigitalCard, CardTheme } from '@/types/card';
import { toast } from 'sonner';

interface CardViewClientProps {
  card: DigitalCard;
}

const THEME_STYLES: Record<
  CardTheme,
  {
    bg: string;
    cardBg: string;
    accent: string;
    button: string;
    border: string;
    textPrimary: string;
    textSecondary: string;
  }
> = {
  'luxury-dark': {
    bg: 'bg-gradient-to-b from-neutral-950 via-neutral-900 to-black',
    cardBg: 'bg-neutral-900/80 backdrop-blur-2xl border-amber-500/20 shadow-2xl shadow-amber-500/5',
    accent: 'text-amber-400',
    button: 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-neutral-950 font-semibold shadow-lg shadow-amber-500/20',
    border: 'border-amber-500/30',
    textPrimary: 'text-white',
    textSecondary: 'text-neutral-400',
  },
  'emerald-glass': {
    bg: 'bg-gradient-to-b from-emerald-950 via-teal-950 to-slate-950',
    cardBg: 'bg-slate-900/75 backdrop-blur-2xl border-emerald-500/20 shadow-2xl shadow-emerald-500/10',
    accent: 'text-emerald-400',
    button: 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold shadow-lg shadow-emerald-500/25',
    border: 'border-emerald-500/30',
    textPrimary: 'text-white',
    textSecondary: 'text-emerald-200/70',
  },
  'royal-indigo': {
    bg: 'bg-gradient-to-b from-indigo-950 via-slate-900 to-neutral-950',
    cardBg: 'bg-slate-900/80 backdrop-blur-2xl border-indigo-500/20 shadow-2xl shadow-indigo-500/10',
    accent: 'text-indigo-400',
    button: 'bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-semibold shadow-lg shadow-indigo-500/25',
    border: 'border-indigo-500/30',
    textPrimary: 'text-white',
    textSecondary: 'text-indigo-200/70',
  },
  'sunset-rose': {
    bg: 'bg-gradient-to-b from-rose-950 via-slate-950 to-neutral-950',
    cardBg: 'bg-slate-900/80 backdrop-blur-2xl border-rose-500/20 shadow-2xl shadow-rose-500/10',
    accent: 'text-rose-400',
    button: 'bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-semibold shadow-lg shadow-rose-500/25',
    border: 'border-rose-500/30',
    textPrimary: 'text-white',
    textSecondary: 'text-rose-200/70',
  },
  'minimalist': {
    bg: 'bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-950 dark:to-neutral-950',
    cardBg: 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border-slate-200 dark:border-slate-800 shadow-xl',
    accent: 'text-primary',
    button: 'bg-slate-900 hover:bg-black dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-semibold shadow-md',
    border: 'border-slate-200 dark:border-slate-800',
    textPrimary: 'text-slate-900 dark:text-white',
    textSecondary: 'text-slate-500 dark:text-slate-400',
  },
};

export function CardViewClient({ card }: CardViewClientProps) {
  const [showQrModal, setShowQrModal] = useState(false);
  const theme = THEME_STYLES[card.theme || 'luxury-dark'];

  // Generate downloadable vCard 3.0 (.vcf)
  function handleDownloadVCard() {
    const vcard = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${card.name}`,
      `N:${card.name};;;;`,
      card.title ? `TITLE:${card.title}` : '',
      card.company ? `ORG:${card.company}` : '',
      card.phone ? `TEL;TYPE=CELL,VOICE:${card.phone}` : '',
      card.email ? `EMAIL;TYPE=PREF,INTERNET:${card.email}` : '',
      card.website ? `URL:${card.website}` : '',
      card.address ? `ADR;TYPE=WORK:;;${card.address};;;;` : '',
      card.bio ? `NOTE:${card.bio.replace(/\n/g, '\\n')}` : '',
      'END:VCARD',
    ]
      .filter(Boolean)
      .join('\r\n');

    const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${card.name.replace(/\s+/g, '_')}.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Contact file downloaded! Open it to save to your phone.');
  }

  function handleShare() {
    if (typeof window !== 'undefined' && navigator.share) {
      navigator
        .share({
          title: card.name,
          text: `Digital business card for ${card.name}`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Card link copied to clipboard!');
    }
  }

  const cleanPhone = card.phone?.replace(/[^\d+]/g, '');

  return (
    <div className={`min-h-screen ${theme.bg} py-8 px-4 sm:px-6 flex flex-col justify-between items-center transition-colors duration-500`}>
      {/* Top action bar */}
      <div className="w-full max-w-md flex justify-between items-center mb-4">
        <Link
          href="/"
          className="text-xs font-medium text-white/60 hover:text-white transition flex items-center gap-1.5 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full border border-white/10"
        >
          <span>← QR Code Tools</span>
        </Link>
        <div className="flex gap-2">
          <button
            onClick={() => setShowQrModal(true)}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition border border-white/10"
            title="Show QR Code"
          >
            <QrIcon className="w-4 h-4" />
          </button>
          <button
            onClick={handleShare}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition border border-white/10"
            title="Share Card"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Digital Card */}
      <div className={`w-full max-w-md rounded-3xl border p-6 sm:p-8 ${theme.cardBg} transition-all duration-300`}>
        {/* Cover / Header Glow */}
        <div className="flex flex-col items-center text-center">
          {/* Avatar with luxury ring */}
          <div className="relative mb-4">
            <div className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 ${theme.border} p-1 shadow-2xl`}>
              {card.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={card.avatarUrl}
                  alt={card.name}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-gradient-to-tr from-neutral-800 to-neutral-700 flex items-center justify-center text-3xl font-bold text-white">
                  {card.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            {/* Verified badge */}
            <div className="absolute bottom-1 right-1 bg-neutral-950 rounded-full p-0.5 border border-white/20">
              <CheckCircle2 className={`w-6 h-6 fill-current ${theme.accent}`} />
            </div>
          </div>

          {/* Name & Title */}
          <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${theme.textPrimary}`}>
            {card.name}
          </h1>
          {card.title && (
            <p className={`mt-1 text-sm sm:text-base font-medium ${theme.textSecondary}`}>
              {card.title}
            </p>
          )}
          {card.company && (
            <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white/90 border border-white/10">
              {card.company}
            </div>
          )}

          {/* Bio */}
          {card.bio && (
            <p className={`mt-4 text-xs sm:text-sm leading-relaxed ${theme.textSecondary} max-w-xs`}>
              {card.bio}
            </p>
          )}

          {/* Badges / Skills */}
          {card.badges && card.badges.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5 justify-center">
              {card.badges.map((badge, i) => (
                <span
                  key={i}
                  className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-white/5 border border-white/10 text-white/80"
                >
                  {badge}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Primary Action: Save Contact */}
        <div className="mt-6">
          <button
            onClick={handleDownloadVCard}
            className={`w-full py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2.5 text-sm transition-all transform active:scale-[0.98] ${theme.button}`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Save Contact to Phone</span>
          </button>
        </div>

        {/* Quick Action Grid */}
        <div className="mt-6 grid grid-cols-4 gap-3 text-center">
          {card.phone && (
            <a
              href={`tel:${cleanPhone}`}
              className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition group"
            >
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white group-hover:scale-110 transition">
                <Phone className="w-4 h-4" />
              </div>
              <span className="text-[11px] text-white/70 font-medium">Call</span>
            </a>
          )}

          {card.email && (
            <a
              href={`mailto:${card.email}`}
              className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition group"
            >
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white group-hover:scale-110 transition">
                <Mail className="w-4 h-4" />
              </div>
              <span className="text-[11px] text-white/70 font-medium">Email</span>
            </a>
          )}

          {card.phone && (
            <a
              href={`https://wa.me/${cleanPhone?.replace('+', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition">
                <span className="text-sm font-bold">WA</span>
              </div>
              <span className="text-[11px] text-white/70 font-medium">WhatsApp</span>
            </a>
          )}

          {card.website && (
            <a
              href={card.website.startsWith('http') ? card.website : `https://${card.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition group"
            >
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white group-hover:scale-110 transition">
                <Globe className="w-4 h-4" />
              </div>
              <span className="text-[11px] text-white/70 font-medium">Website</span>
            </a>
          )}
        </div>

        {/* Address */}
        {card.address && (
          <div className="mt-4 p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
            <MapPin className="w-4 h-4 text-white/60 shrink-0" />
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(card.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-white/80 hover:underline flex-1 truncate"
            >
              {card.address}
            </a>
            <ExternalLink className="w-3.5 h-3.5 text-white/40" />
          </div>
        )}

        {/* Social Links */}
        {card.socials && Object.values(card.socials).some(Boolean) && (
          <div className="mt-6 pt-6 border-t border-white/10">
            <h3 className="text-xs uppercase tracking-wider text-white/50 mb-3 font-semibold text-center">
              Connect & Follow
            </h3>
            <div className="flex flex-wrap justify-center gap-2">
              {card.socials.linkedin && (
                <a
                  href={card.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-blue-600/30 border border-white/10 text-xs text-white/80 transition flex items-center gap-1.5"
                >
                  <span>LinkedIn</span>
                </a>
              )}
              {card.socials.twitter && (
                <a
                  href={card.socials.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-sky-500/30 border border-white/10 text-xs text-white/80 transition flex items-center gap-1.5"
                >
                  <span>Twitter / X</span>
                </a>
              )}
              {card.socials.instagram && (
                <a
                  href={card.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-pink-600/30 border border-white/10 text-xs text-white/80 transition flex items-center gap-1.5"
                >
                  <span>Instagram</span>
                </a>
              )}
              {card.socials.github && (
                <a
                  href={card.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/20 border border-white/10 text-xs text-white/80 transition flex items-center gap-1.5"
                >
                  <span>GitHub</span>
                </a>
              )}
              {card.socials.youtube && (
                <a
                  href={card.socials.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-red-600/30 border border-white/10 text-xs text-white/80 transition flex items-center gap-1.5"
                >
                  <span>YouTube</span>
                </a>
              )}
              {card.socials.telegram && (
                <a
                  href={card.socials.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-sky-600/30 border border-white/10 text-xs text-white/80 transition flex items-center gap-1.5"
                >
                  <span>Telegram</span>
                </a>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer Powered By */}
      <footer className="mt-8 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-white/50 hover:text-white/80 transition"
        >
          <span>Created with</span>
          <span className="font-semibold text-white/80">QR Code Tools</span>
        </Link>
      </footer>

      {/* Share / Scan QR Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-sm rounded-3xl bg-neutral-900 border border-neutral-800 p-6 text-center text-white shadow-2xl">
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-lg font-bold">Scan to Connect</h3>
            <p className="text-xs text-neutral-400 mt-1">
              Point phone camera to save {card.name}&apos;s contact
            </p>

            <div className="mt-6 flex justify-center p-4 bg-white rounded-2xl shadow-inner inline-block mx-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
                  typeof window !== 'undefined' ? window.location.href : ''
                )}`}
                alt="QR Code"
                className="w-48 h-48"
              />
            </div>

            <p className="mt-4 text-[11px] text-neutral-500">
              Instant offline and online contact exchange
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
