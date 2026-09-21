'use client';

import { Song } from '@/data/songs';
import { useMusicStore } from '@/lib/musicStore';
import { SONGS } from '@/data/songs';
import FavoriteButton from '@/components/shared/FavoriteButton';
import EqBars from '@/components/shared/EqBars';

interface TrackRowProps {
  song: Song;
  index?: number;
  showIndex?: boolean;
  queue?: Song[];
  className?: string;
}

export default function TrackRow({ song, index, showIndex = false, queue, className = '' }: TrackRowProps) {
  const { playSong, currentSong, isPlaying } = useMusicStore();
  const isActive = currentSong?.id === song.id;

  const handlePlay = () => {
    playSong(song, queue || SONGS);
  };

  return (
    <div
      className={`group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors hover:bg-surface-container-high ${isActive ? 'bg-surface-container-high' : 'bg-surface-container/60'} ${className}`}
      onClick={handlePlay}
    >
      {/* Artwork / Index */}
      <div className="relative w-12 h-12 rounded-lg flex-shrink-0 overflow-hidden bg-surface-container-lowest">
        <img
          src={song.coverSrc}
          alt={song.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-surface-container-lowest/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          {isActive && isPlaying ? (
            <EqBars count={4} className="h-4" />
          ) : (
            <span className="material-symbols-outlined text-primary text-[22px]">play_arrow</span>
          )}
        </div>
        {isActive && !isPlaying && (
          <div className="absolute inset-0 bg-surface-container-lowest/70 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-[18px]">pause</span>
          </div>
        )}
      </div>

      {/* Metadata */}
      <div className="flex-1 min-w-0">
        <span
          className={`block font-mono-space text-[11px] uppercase tracking-widest mb-0.5 ${isActive ? 'text-secondary' : 'text-on-surface-variant'}`}
        >
          {showIndex && index !== undefined ? `${String(index + 1).padStart(2, '0')}` : song.filmLabel || song.year}
        </span>
        <span className={`block text-title-md font-semibold truncate ${isActive ? 'text-primary' : 'text-on-surface'} group-hover:text-primary transition-colors`}>
          {song.title}
        </span>
        <span className="block text-body-sm text-on-surface-variant truncate">
          {song.artist} • {song.composer} ({song.year})
        </span>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="hidden sm:inline font-mono-space text-[10px] text-on-surface-variant tracking-wider">
          {song.duration}
        </span>
        <FavoriteButton songId={song.id} size="sm" />
        <button
          onClick={(e) => { e.stopPropagation(); }}
          className="w-8 h-8 flex items-center justify-center rounded-full text-on-surface-variant hover:text-secondary transition-colors"
          aria-label="Add to playlist"
        >
          <span className="material-symbols-outlined text-[16px]">playlist_add</span>
        </button>
      </div>
    </div>
  );
}
