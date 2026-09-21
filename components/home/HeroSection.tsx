'use client';

import { useMusicStore } from '@/lib/musicStore';
import { SONGS } from '@/data/songs';

export default function HeroSection() {
  const { playSong } = useMusicStore();
  const featuredSong = SONGS[0]; // Tujhe Dekha Toh

  return (
    <section className="relative px-4 pt-4 pb-6 overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute -top-10 -right-12 w-64 h-64 bg-primary-container/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-24 -left-12 w-48 h-48 bg-secondary-container/15 rounded-full blur-2xl pointer-events-none" />

      <div className="relative bg-surface-container-low/90 rounded-xl p-4 shadow-2xl backdrop-blur-2xl overflow-hidden">
        {/* Top badge */}
        <div className="flex items-center justify-between gap-1 mb-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-variant/80 text-secondary font-mono-space text-[10px] uppercase tracking-wider shadow-inner">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary-container animate-ping" />
            Master Tape Audio • 96kHz
          </span>
          <span className="font-mono-space text-[10px] text-on-surface-variant uppercase">Cassette Deck 01</span>
        </div>

        {/* Hero visual — vinyl + cassette composition */}
        <div className="relative my-2 flex items-center justify-center">
          <div className="relative w-44 h-44 flex items-center justify-center">
            {/* Spinning vinyl */}
            <div className="absolute inset-0 rounded-full bg-surface-container-lowest p-2 shadow-2xl shadow-primary-container/30 flex items-center justify-center animate-spin-slow">
              <div className="w-full h-full rounded-full flex items-center justify-center relative"
                style={{ background: 'radial-gradient(circle at center, #0f0d12 25%, #363439 42%, #0f0d12 58%, #363439 72%, #0f0d12 88%)' }}>
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-primary-container to-secondary-container/60 p-1 flex items-center justify-center shadow-lg">
                  <div className="w-5 h-5 rounded-full bg-surface-container-lowest flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-secondary-container" />
                  </div>
                </div>
              </div>
            </div>
            {/* Cassette hologram card */}
            <div className="relative z-10 w-36 h-24 rounded-lg bg-surface-container-high/90 backdrop-blur-md p-2 shadow-xl flex flex-col justify-between" style={{ transform: 'rotate(-6deg)' }}>
              <div className="flex justify-between items-center text-on-surface-variant font-mono-space text-[10px]">
                <span className="text-secondary font-semibold">TDK C-90</span>
                <span>STEREO A</span>
              </div>
              <div className="h-7 rounded bg-surface-container-lowest px-2 py-1 flex items-center justify-between">
                <div className="w-3.5 h-3.5 rounded-full border border-outline/30 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-secondary-container" />
                </div>
                <div className="h-1 flex-1 mx-2 bg-outline-variant/50 rounded-full overflow-hidden">
                  <div className="h-full w-2/3 bg-primary rounded-full" />
                </div>
                <div className="w-3.5 h-3.5 rounded-full border border-outline/30 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                </div>
              </div>
              <div className="truncate font-mono-space text-[10px] text-on-surface">GOLDEN ERA &apos;95</div>
            </div>
          </div>
        </div>

        {/* Text */}
        <div className="text-center mt-2">
          <h1 className="font-playfair text-headline-lg-mobile text-on-surface font-bold tracking-tight">
            WELCOME TO{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-tertiary to-secondary">
              90s MUSIC WORLD
            </span>
          </h1>
          <p className="font-sans text-title-md text-secondary-fixed-dim mt-1">Relive the Golden Era of Music</p>
          <p className="font-sans text-body-sm text-on-surface-variant mt-2 max-w-sm mx-auto line-clamp-3">
            Rediscover unforgettable melodies, legendary voices and timeless memories from the golden era — alongside today&apos;s biggest hits.
          </p>
        </div>

        {/* CTA buttons */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            onClick={() => playSong(featuredSong, SONGS)}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-primary-container via-tertiary-container to-primary text-on-primary font-sans text-title-md font-semibold shadow-lg shadow-primary-container/40 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
            <span>Start Listening</span>
          </button>
          <a
            href="/discover"
            className="flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl bg-surface-container-high/80 hover:bg-surface-container-highest text-on-surface font-sans text-title-md font-medium shadow-md transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[20px]">explore</span>
            <span>Explore Music</span>
          </a>
        </div>
      </div>
    </section>
  );
}
