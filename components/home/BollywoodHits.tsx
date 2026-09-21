'use client';

import { SONGS } from '@/data/songs';
import { useMusicStore } from '@/lib/musicStore';
import AlbumCard from '@/components/shared/AlbumCard';

const BOLLYWOOD_HITS = SONGS.filter((s) =>
  ['chaiyya-chaiyya', 'didi-tera-devar', 'dheere-dheere', 'tanha-tanha'].includes(s.id)
);
const ROMANTIC_CLASSICS = SONGS.filter((s) =>
  ['kuch-kuch-hota-hai', 'pehla-nasha', 'mera-dil-bhi', 'tip-tip-barsa'].includes(s.id)
);

export default function BollywoodHits() {
  const { playSong } = useMusicStore();

  return (
    <>
      {/* 90s Bollywood Hits */}
      <section className="mt-6">
        <div className="px-4 flex items-center justify-between mb-2">
          <div>
            <h2 className="font-sans text-title-lg text-on-surface font-semibold">90s Bollywood Hits</h2>
            <p className="font-sans text-body-sm text-on-surface-variant">Chartbusters that shaped cinema history</p>
          </div>
          <a href="/hits" className="text-secondary font-mono-space text-[10px] uppercase">See All</a>
        </div>
        <div className="flex gap-3 overflow-x-auto px-4 pb-3 hide-scrollbar">
          {BOLLYWOOD_HITS.map((song) => (
            <AlbumCard key={song.id} song={song} queue={BOLLYWOOD_HITS} />
          ))}
        </div>
      </section>

      {/* Romantic Classics */}
      <section className="mt-6">
        <div className="px-4 flex items-center justify-between mb-2">
          <div>
            <h2 className="font-sans text-title-lg text-on-surface font-semibold">Romantic Classics</h2>
            <p className="font-sans text-body-sm text-on-surface-variant">The duets that defined true romance</p>
          </div>
          <button className="text-tertiary font-mono-space text-[10px] uppercase">See All</button>
        </div>
        <div className="flex gap-3 overflow-x-auto px-4 pb-3 hide-scrollbar">
          {ROMANTIC_CLASSICS.map((song) => (
            <AlbumCard key={song.id} song={song} queue={ROMANTIC_CLASSICS} />
          ))}
        </div>
      </section>
    </>
  );
}
