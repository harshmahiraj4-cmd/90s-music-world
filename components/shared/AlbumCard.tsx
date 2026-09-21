'use client';

import { Song } from '@/data/songs';
import { useMusicStore } from '@/lib/musicStore';
import { SONGS } from '@/data/songs';
import FavoriteButton from '@/components/shared/FavoriteButton';

interface AlbumCardProps {
  song: Song;
  queue?: Song[];
  width?: string;
}

export default function AlbumCard({ song, queue, width = 'w-40' }: AlbumCardProps) {
  const { playSong, currentSong, isPlaying } = useMusicStore();
  const isActive = currentSong?.id === song.id;

  return (
    <div className={`${width} flex-shrink-0 bg-surface-container-low rounded-xl p-space-xs shadow-md group`}>
      <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-surface-container-highest">
        <img
          src={song.coverSrc}
          alt={song.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {isActive && isPlaying && (
          <div className="absolute inset-0 bg-surface-container-lowest/60 flex items-center justify-center">
            <div className="flex items-end gap-0.5 h-6">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-1 rounded-full bg-primary animate-bounce"
                  style={{ height: `${[60, 100, 40, 80, 60][i]}%`, animationDelay: `${i * 0.12}s` }}
                />
              ))}
            </div>
          </div>
        )}
        <button
          onClick={() => playSong(song, queue || SONGS)}
          className={`absolute bottom-2 right-2 w-9 h-9 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all
            ${isActive ? 'bg-primary-container text-on-primary shadow-[0_0_12px_rgba(138,43,226,0.6)]' : 'bg-primary text-on-primary opacity-0 group-hover:opacity-100'}`}
          aria-label={isActive && isPlaying ? 'Pause' : 'Play'}
        >
          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            {isActive && isPlaying ? 'pause' : 'play_arrow'}
          </span>
        </button>
      </div>
      <div className="mt-2 px-1">
        <h4 className="text-title-md font-semibold text-on-surface truncate">{song.title}</h4>
        <p className="text-body-sm text-on-surface-variant truncate">{song.album} ({song.year})</p>
        <div className="flex justify-between items-center mt-1">
          <span className="font-mono-space text-[10px] text-secondary-fixed-dim tracking-wider">{song.duration}</span>
          <FavoriteButton songId={song.id} size="sm" className="bg-transparent" />
        </div>
      </div>
    </div>
  );
}
