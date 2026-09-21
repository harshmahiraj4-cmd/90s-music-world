'use client';

import { MEMORY_LANE } from '@/data/moods';
import { SONGS } from '@/data/songs';
import { useMusicStore } from '@/lib/musicStore';

export default function MemoryLane() {
  const { playSong } = useMusicStore();

  const handleMemoryClick = (ep: typeof MEMORY_LANE[0]) => {
    const song = SONGS.find((s) => s.id === ep.songId);
    if (song) playSong(song, SONGS);
  };

  return (
    <section className="mt-6 px-4">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="font-sans text-title-lg text-on-surface font-semibold">Memory Lane</h2>
          <p className="font-sans text-body-sm text-on-surface-variant">Songs that sound like memories</p>
        </div>
        <span className="material-symbols-outlined text-tertiary text-[20px]">auto_stories</span>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-2">
        {MEMORY_LANE.map((ep) => (
          <div
            key={ep.id}
            className="relative h-36 rounded-xl overflow-hidden shadow-lg group cursor-pointer active:scale-[0.98] transition-transform"
            onClick={() => handleMemoryClick(ep)}
          >
            <img
              src={ep.imageSrc}
              alt={ep.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/40 to-transparent p-3 flex flex-col justify-end">
              <span className={`font-mono-space text-[10px] ${ep.colorClass}`}>{ep.episode}</span>
              <h4 className="font-sans text-title-md text-on-surface font-semibold">{ep.title}</h4>
              <span className="font-sans text-[11px] text-on-surface-variant">{ep.subtitle}</span>
            </div>
            <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-surface-container-lowest/70 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="material-symbols-outlined text-primary text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                play_arrow
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
