'use client';

import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Download,
  Share2,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Music,
  Video as VideoIcon,
  Image as ImageIcon,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';

export function MediaViewClient() {
  const searchParams = useSearchParams();
  const rawType = searchParams.get('type') || 'image';
  const url = searchParams.get('url') || '';
  const title = searchParams.get('title') || 'Shared Media';

  // Normalise type
  const type = ['image', 'video', 'audio'].includes(rawType) ? rawType : 'image';

  // Audio player state
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration || 0);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [type]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const mins = Math.floor(secs / 60);
    const remaining = Math.floor(secs % 60);
    return `${mins}:${remaining < 10 ? '0' : ''}${remaining}`;
  };

  const handleShare = () => {
    if (typeof window !== 'undefined' && navigator.share) {
      navigator.share({ title, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  if (!url) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-6 text-white text-center">
        <h1 className="text-xl font-bold mb-2">No media URL specified</h1>
        <p className="text-xs text-neutral-400 mb-6">
          This QR code does not contain a media destination link.
        </p>
        <Link
          href="/"
          className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold transition"
        >
          Return to Generator
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-black text-white flex flex-col justify-between py-6 px-4 sm:px-6">
      {/* Top Navbar */}
      <header className="max-w-3xl w-full mx-auto flex justify-between items-center mb-6">
        <Link
          href="/"
          className="text-xs font-medium text-white/70 hover:text-white transition flex items-center gap-1.5 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full border border-white/10"
        >
          <span>← QR Code Tools</span>
        </Link>
        <div className="flex items-center gap-2">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition border border-white/10"
            title="Download Media File"
          >
            <Download className="w-4 h-4" />
          </a>
          <button
            onClick={handleShare}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition border border-white/10"
            title="Share"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Showcase Container */}
      <main className="max-w-2xl w-full mx-auto flex-1 flex flex-col justify-center items-center">
        {/* Type Badge */}
        <div className="mb-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white/10 border border-white/15 text-white/90">
          {type === 'image' && <ImageIcon className="w-3.5 h-3.5 text-sky-400" />}
          {type === 'video' && <VideoIcon className="w-3.5 h-3.5 text-violet-400" />}
          {type === 'audio' && <Music className="w-3.5 h-3.5 text-emerald-400" />}
          <span className="capitalize">{type} Showcase</span>
        </div>

        {/* Title */}
        <h1 className="text-xl sm:text-2xl font-bold text-center mb-6 max-w-lg px-2 text-white">
          {title}
        </h1>

        {/* Media Frame */}
        <div className="w-full rounded-3xl bg-neutral-900/90 border border-neutral-800 shadow-2xl p-4 sm:p-6 backdrop-blur-xl">
          {/* IMAGE VIEWER */}
          {type === 'image' && (
            <div className="flex flex-col items-center">
              <div className="relative max-h-[65vh] w-full flex items-center justify-center rounded-2xl overflow-hidden bg-black/40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={title}
                  className="max-h-[60vh] w-auto max-w-full object-contain rounded-xl shadow-lg transition-transform hover:scale-[1.01]"
                />
              </div>
              <div className="mt-4 flex gap-2 w-full justify-center">
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition border border-white/10"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Full Screen</span>
                </a>
                <a
                  href={url}
                  download
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-xs font-semibold text-primary-foreground transition shadow-md shadow-primary/20"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download HD</span>
                </a>
              </div>
            </div>
          )}

          {/* VIDEO VIEWER */}
          {type === 'video' && (
            <div className="flex flex-col items-center">
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-lg">
                <video
                  src={url}
                  controls
                  playsInline
                  className="w-full h-full object-contain"
                >
                  Your browser does not support video playback.
                </video>
              </div>
              <div className="mt-4 flex gap-2 w-full justify-center">
                <a
                  href={url}
                  download
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-xs font-semibold text-primary-foreground transition shadow-md shadow-primary/20"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Video</span>
                </a>
              </div>
            </div>
          )}

          {/* AUDIO PLAYER */}
          {type === 'audio' && (
            <div className="flex flex-col items-center py-4">
              <audio ref={audioRef} src={url} preload="metadata" />

              {/* Vinyl / Cover animation */}
              <div className="relative mb-6">
                <div
                  className={`w-36 h-36 sm:w-44 sm:h-44 rounded-full border-4 border-neutral-800 bg-gradient-to-tr from-neutral-950 via-neutral-900 to-neutral-800 flex items-center justify-center shadow-2xl transition-transform duration-1000 ${
                    isPlaying ? 'animate-[spin_6s_linear_infinite]' : ''
                  }`}
                >
                  {/* Vinyl grooves */}
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border border-neutral-800/80 flex items-center justify-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                      <Music className="w-8 h-8" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Animated Waveform Bars */}
              <div className="flex items-center gap-1 h-8 mb-6">
                {[40, 70, 30, 90, 60, 100, 50, 80, 45, 95, 35, 75, 65, 85].map((h, i) => (
                  <span
                    key={i}
                    className={`w-1 rounded-full bg-emerald-400/80 transition-all duration-300 ${
                      isPlaying ? 'animate-pulse' : 'opacity-40'
                    }`}
                    style={{
                      height: isPlaying ? `${Math.max(15, Math.round(h * Math.random()))}%` : '20%',
                    }}
                  />
                ))}
              </div>

              {/* Progress Slider */}
              <div className="w-full max-w-sm mb-4">
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />
                <div className="flex justify-between text-[11px] text-neutral-400 mt-1 font-mono">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Player Controls */}
              <div className="flex items-center gap-4">
                <button
                  onClick={toggleMute}
                  className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>

                <button
                  onClick={togglePlay}
                  className="w-14 h-14 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/25 transition transform active:scale-95"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 fill-current" />
                  ) : (
                    <Play className="w-6 h-6 fill-current ml-0.5" />
                  )}
                </button>

                <a
                  href={url}
                  download
                  className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition"
                  title="Download Track"
                >
                  <Download className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Feature note */}
        <div className="mt-4 flex items-center gap-2 text-[11px] text-neutral-400">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>High-speed global CDN delivery</span>
          <span>·</span>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white underline inline-flex items-center gap-1"
          >
            <span>Raw Link</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-8 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-white/50 hover:text-white/80 transition"
        >
          <span>Created with</span>
          <span className="font-semibold text-white/80">QR Code Tools</span>
        </Link>
      </footer>
    </div>
  );
}
