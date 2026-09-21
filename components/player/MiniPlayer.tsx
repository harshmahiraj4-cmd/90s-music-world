'use client';

import Link from 'next/link';
import { useMusicStore } from '@/lib/musicStore';
import EqBars from '@/components/shared/EqBars';

function formatTime(secs: number) {
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function MiniPlayer() {
  const {
    currentSong,
    isPlaying,
    playPause,
    next,
    progress,
  } = useMusicStore();

  if (!currentSong) return null;

  return (
    <div className="fixed bottom-16 md:bottom-4 left-0 right-0 z-30 px-3 pb-1">
      <div
        className="max-w-lg md:max-w-3xl lg:max-w-4xl mx-auto rounded-2xl bg-surface-container-high/95 backdrop-blur-xl shadow-[0_-4px_32px_rgba(138,43,226,0.35)] border border-outline-variant/30 overflow-hidden"
      >
        {/* Progress strip */}
        <div className="h-0.5 bg-surface-container-highest w-full relative">
          <div
            className="h-full bg-gradient-to-r from-secondary to-primary-container transition-all duration-300"
            style={{ width: `${progress * 100}%` }}
          />
        </div>

        <Link href="/now-playing" className="flex items-center gap-3 px-3 py-2.5">
          {/* Album art — rotating when playing */}
          <div className="relative w-10 h-10 flex-shrink-0">
            <div
              className={`w-10 h-10 rounded-full overflow-hidden border-2 border-primary-container/60 shadow-[0_0_10px_rgba(138,43,226,0.4)] ${isPlaying ? 'animate-spin-slow' : ''}`}
            >
              <img
                src={currentSong.coverSrc}
                alt={currentSong.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Metadata */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-title-md font-semibold text-on-surface truncate">{currentSong.title}</span>
              {isPlaying && <EqBars count={3} className="h-3 flex-shrink-0" />}
            </div>
            <span className="text-body-sm text-on-surface-variant truncate block">{currentSong.artist}</span>
          </div>
        </Link>

        {/* Controls outside the Link */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none" style={{ top: 'calc(50% + 1px)' }}>
          <div className="pointer-events-auto flex items-center gap-1">
            <button
              onClick={(e) => { e.stopPropagation(); e.preventDefault(); playPause(); }}
              className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-container to-primary text-on-primary flex items-center justify-center shadow-[0_0_16px_rgba(138,43,226,0.5)] active:scale-90 transition-transform"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                {isPlaying ? 'pause' : 'play_arrow'}
              </span>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); e.preventDefault(); next(); }}
              className="w-9 h-9 flex items-center justify-center text-on-surface-variant hover:text-on-surface active:scale-90 transition-all"
              aria-label="Next track"
            >
              <span className="material-symbols-outlined text-[22px]">skip_next</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
