'use client';

import { useState } from 'react';
import { TIME_MACHINE_YEARS } from '@/data/timeMachine';
import { SONGS } from '@/data/songs';
import { useMusicStore } from '@/lib/musicStore';

export default function TimeMachine() {
  const [selectedYear, setSelectedYear] = useState(1995);
  const yearData = TIME_MACHINE_YEARS.find((y) => y.year === selectedYear) || TIME_MACHINE_YEARS[5];
  const { playSong } = useMusicStore();

  const handleYearPlay = () => {
    const yearSongs = SONGS.filter((s) => s.year === selectedYear);
    const toPlay = yearSongs.length > 0 ? yearSongs : SONGS;
    playSong(toPlay[0], toPlay);
  };

  return (
    <section className="mt-6 px-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[22px]">history_toggle_off</span>
          <h2 className="font-sans text-title-lg text-on-surface font-semibold">90s Time Machine</h2>
        </div>
        <span className="font-mono-space text-[10px] text-secondary-fixed-dim">DECADE SELECTOR</span>
      </div>

      {/* Year pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4 hide-scrollbar">
        {TIME_MACHINE_YEARS.map((y) => (
          <button
            key={y.year}
            onClick={() => setSelectedYear(y.year)}
            className={`flex-shrink-0 px-3.5 py-1.5 rounded-full font-mono-space text-label-mono transition-all ${
              selectedYear === y.year
                ? 'bg-primary text-on-primary font-bold shadow-md shadow-primary/30'
                : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-variant'
            }`}
          >
            {y.year}
          </button>
        ))}
      </div>

      {/* Year card */}
      <div className="mt-2 bg-surface-container-low rounded-xl p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <span className="font-mono-space text-[10px] text-secondary-fixed uppercase tracking-wider">
            {yearData.vaultLabel}
          </span>
          <span className="font-mono-space text-[10px] text-on-surface-variant">
            {yearData.albumCount} Platinum Albums
          </span>
        </div>
        <h3 className="font-playfair text-headline-sm text-on-surface font-semibold mt-1">{yearData.heading}</h3>
        <p className="font-sans text-body-sm text-on-surface-variant mt-1">{yearData.description}</p>

        {/* Featured films */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {yearData.featuredFilms.map((film) => (
            <span
              key={film}
              className="px-2.5 py-1 rounded-md bg-surface-container-high text-secondary font-mono-space text-[10px]"
            >
              ✦ {film}
            </span>
          ))}
        </div>

        {/* Play year button */}
        <button
          onClick={handleYearPlay}
          className="mt-3 w-full py-2.5 rounded-xl bg-gradient-to-r from-primary-container to-tertiary-container text-on-primary font-sans text-title-md font-semibold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md"
        >
          <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
          Play {selectedYear} Hits
        </button>
      </div>
    </section>
  );
}
