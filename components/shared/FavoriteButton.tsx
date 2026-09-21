'use client';

import { useMusicStore } from '@/lib/musicStore';
import { SONGS } from '@/data/songs';

interface FavoriteButtonProps {
  songId: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function FavoriteButton({ songId, size = 'md', className = '' }: FavoriteButtonProps) {
  const { toggleFavorite, isFavorite } = useMusicStore();
  const fav = isFavorite(songId);

  const sizeMap = {
    sm: 'w-8 h-8 text-[16px]',
    md: 'w-10 h-10 text-[20px]',
    lg: 'w-12 h-12 text-[26px]',
  };

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        toggleFavorite(songId);
      }}
      aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
      className={`flex items-center justify-center rounded-full bg-surface-container-high text-on-surface-variant transition-all active:scale-90 ${sizeMap[size]} ${className}`}
    >
      <span
        className="material-symbols-outlined transition-colors"
        style={{
          fontVariationSettings: fav ? "'FILL' 1" : "'FILL' 0",
          color: fav ? '#ecb2ff' : undefined,
        }}
      >
        favorite
      </span>
    </button>
  );
}
