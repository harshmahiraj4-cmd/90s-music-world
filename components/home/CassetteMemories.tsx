'use client';

import { CASSETTES } from '@/data/moods';
import { SONGS } from '@/data/songs';
import { useMusicStore } from '@/lib/musicStore';

export default function CassetteMemories() {
  const { playSong } = useMusicStore();

  const handlePlay = (cassette: typeof CASSETTES[0]) => {
    const song = SONGS.find((s) => s.id === cassette.songId);
    if (song) playSong(song, SONGS);
  };

  return (
    <section className="mt-6">
      <div className="px-4 flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary text-[22px]">album</span>
          <h2 className="font-sans text-title-lg text-on-surface font-semibold">Cassette Memories</h2>
        </div>
        <span className="font-mono-space text-[10px] text-outline">MAGNETIC TAPE REELS</span>
      </div>

      <div className="flex gap-3 overflow-x-auto px-4 pb-3 hide-scrollbar">
        {CASSETTES.map((tape) => (
          <div
            key={tape.id}
            className="w-60 flex-shrink-0 bg-surface-container rounded-xl p-3 shadow-xl relative overflow-hidden group"
          >
            {/* Color strip top */}
            <div
              className={`h-2 rounded-t bg-gradient-to-r ${tape.gradientFrom} ${tape.gradientVia} ${tape.gradientTo} -mx-3 -mt-3 mb-3`}
            />

            <div className="p-2 bg-surface-container-low rounded-lg">
              <div className={`flex justify-between items-center ${tape.accentColor} font-mono-space text-[10px]`}>
                <span>{tape.side}</span>
                <span>{tape.type}</span>
              </div>
              <h4 className="font-sans text-title-md text-on-surface font-bold mt-1 tracking-tight">{tape.title}</h4>
              <p className="font-sans text-body-sm text-on-surface-variant">{tape.subtitle}</p>

              {/* Magnetic tape window */}
              <div className="mt-2.5 h-10 rounded-md bg-surface-container-lowest p-1.5 flex items-center justify-between shadow-inner">
                <div className="w-6 h-6 rounded-full border border-primary/40 flex items-center justify-center animate-spin-slow">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary-container" />
                </div>
                <div className="h-4 flex-1 mx-2 rounded bg-surface-variant/40 flex items-center justify-center px-1">
                  <span className={`font-mono-space text-[9px] ${tape.tapeLabelColor} tracking-widest`}>
                    {tape.tapeText}
                  </span>
                </div>
                <div className="w-6 h-6 rounded-full border border-primary/40 flex items-center justify-center animate-spin-slow">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary-container" />
                </div>
              </div>
            </div>

            <div className="mt-2 flex justify-between items-center px-1">
              <span className="font-mono-space text-[10px] text-outline">{tape.duration}</span>
              <button
                onClick={() => handlePlay(tape)}
                className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center active:scale-90 transition-transform"
                aria-label={`Play ${tape.title}`}
              >
                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  play_arrow
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
