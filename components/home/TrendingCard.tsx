'use client';

import { useMusicStore } from '@/lib/musicStore';
import { SONGS } from '@/data/songs';
import FavoriteButton from '@/components/shared/FavoriteButton';
import EqBars from '@/components/shared/EqBars';

const TRENDING = SONGS[0]; // Tujhe Dekha Toh

export default function TrendingCard() {
  const { playSong, currentSong, isPlaying, playPause } = useMusicStore();
  const isActive = currentSong?.id === TRENDING.id;

  const handlePlay = () => {
    if (isActive) {
      playPause();
    } else {
      playSong(TRENDING, SONGS);
    }
  };

  return (
    <section className="px-4 mt-2">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-error animate-pulse shadow-[0_0_8px_rgba(255,180,171,0.8)]" />
          <h2 className="font-sans text-title-lg text-on-surface font-semibold tracking-tight">Currently Trending</h2>
        </div>
        <span className="font-mono-space text-[10px] text-secondary-container">#1 AIRPLAY</span>
      </div>

      <div className="relative bg-surface-container rounded-xl p-4 sm:p-5 shadow-xl overflow-hidden">
        <div className="absolute -right-16 -top-16 w-44 h-44 rounded-full bg-primary-container/20 blur-2xl pointer-events-none" />
        <div className="flex gap-4 items-center">
          {/* Album art */}
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 rounded-lg overflow-hidden shadow-lg bg-surface-container-highest">
            <img src={TRENDING.coverSrc} alt={TRENDING.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest/80 via-transparent to-transparent" />
            <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-surface-container-lowest/90 text-secondary font-mono-space text-[10px]">
              {TRENDING.filmLabel}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 rounded bg-tertiary-container/30 text-tertiary font-mono-space text-[10px] uppercase">
                Original {TRENDING.year}
              </span>
              <span className="font-mono-space text-[10px] text-secondary flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[13px]">headphones</span> 2.4M
              </span>
            </div>
            <h3 className="font-sans text-title-lg text-on-surface font-bold truncate mt-1">{TRENDING.title}</h3>
            <p className="font-sans text-body-sm text-on-surface-variant truncate">{TRENDING.artist}</p>
            <p className="font-mono-space text-[10px] text-outline truncate mt-0.5">
              {TRENDING.composer} • Anand Bakshi
            </p>
            {/* EQ bars when playing */}
            {isActive && isPlaying && <EqBars count={5} className="h-3 mt-2" />}
          </div>
        </div>

        {/* Bottom controls */}
        <div className="mt-4 pt-1 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePlay}
              className="flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-tr from-primary to-primary-container text-on-primary shadow-lg shadow-primary/30 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                {isActive && isPlaying ? 'pause' : 'play_arrow'}
              </span>
            </button>
            <FavoriteButton songId={TRENDING.id} size="md" />
            <button className="flex items-center justify-center w-10 h-10 rounded-full bg-surface-container-high text-on-surface-variant hover:text-secondary active:scale-90 transition-colors">
              <span className="material-symbols-outlined text-[20px]">playlist_add</span>
            </button>
          </div>
          <div className="text-right">
            <span className="font-mono-space text-label-mono text-secondary-fixed-dim block">{TRENDING.duration}</span>
            <span className="font-mono-space text-[10px] text-outline uppercase">{TRENDING.quality}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
