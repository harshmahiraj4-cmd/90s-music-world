'use client';

import { useState } from 'react';
import { MOODS } from '@/data/moods';
import { SONGS } from '@/data/songs';
import { useMusicStore } from '@/lib/musicStore';
import { Mood } from '@/data/songs';

export default function MoodDiscovery() {
  const [activeMood, setActiveMood] = useState<string | null>(null);
  const { playSong } = useMusicStore();

  const handleMoodClick = (moodId: string) => {
    setActiveMood(moodId === activeMood ? null : moodId);
    const moodSongs = SONGS.filter((s) => s.mood.includes(moodId as Mood));
    if (moodSongs.length > 0) {
      playSong(moodSongs[0], moodSongs);
    }
  };

  return (
    <section className="mt-6 px-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[22px]">graphic_eq</span>
          <h2 className="font-sans text-title-lg text-on-surface font-semibold">Mood Discovery</h2>
        </div>
        <span className="font-mono-space text-[10px] text-outline">EMOTIONAL RACKS</span>
      </div>

      <div className="flex gap-2.5 overflow-x-auto pb-2 -mx-4 px-4 hide-scrollbar">
        {MOODS.map((mood) => {
          const isActive = activeMood === mood.id;
          return (
            <button
              key={mood.id}
              onClick={() => handleMoodClick(mood.id)}
              className={`flex-shrink-0 flex items-center gap-2 px-3.5 py-2.5 rounded-xl shadow-md active:scale-95 transition-all ${
                isActive
                  ? 'bg-primary-container/80 text-on-primary border border-primary/40'
                  : 'bg-surface-container-high/90 hover:bg-surface-variant text-on-surface'
              }`}
            >
              <span className="text-base">{mood.emoji}</span>
              <div className="text-left">
                <span className="font-sans text-title-md block leading-tight">{mood.label}</span>
                <span className="font-mono-space text-[10px] text-on-surface-variant">{mood.subLabel}</span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
