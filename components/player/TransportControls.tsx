'use client';

import { useMusicStore, RepeatMode } from '@/lib/musicStore';

export default function TransportControls() {
  const {
    isPlaying,
    playPause,
    next,
    prev,
    isShuffle,
    toggleShuffle,
    repeatMode,
    setRepeatMode,
  } = useMusicStore();

  const nextRepeat = (): RepeatMode => {
    if (repeatMode === 'off') return 'all';
    if (repeatMode === 'all') return 'one';
    return 'off';
  };

  const repeatIcon = repeatMode === 'one' ? 'repeat_one' : 'repeat';
  const repeatActive = repeatMode !== 'off';

  return (
    <div className="w-full flex items-center justify-between px-2">
      {/* Shuffle */}
      <button
        onClick={toggleShuffle}
        aria-label="Shuffle songs"
        className={`w-11 h-11 rounded-full flex items-center justify-center transition-all active:scale-95 relative ${
          isShuffle ? 'text-secondary-fixed' : 'text-on-surface-variant hover:text-secondary-fixed'
        }`}
      >
        <span className="material-symbols-outlined text-[22px]">shuffle</span>
        {isShuffle && (
          <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-secondary-fixed" />
        )}
      </button>

      {/* Previous */}
      <button
        onClick={prev}
        aria-label="Previous track"
        className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface active:scale-90 transition-all shadow-md hover:bg-surface-container-highest"
      >
        <span className="material-symbols-outlined text-[28px]">skip_previous</span>
      </button>

      {/* Play / Pause */}
      <button
        onClick={playPause}
        aria-label={isPlaying ? 'Pause' : 'Play'}
        className={`w-20 h-20 rounded-full flex items-center justify-center transition-transform active:scale-95 ${
          isPlaying
            ? 'bg-gradient-to-tr from-primary-container via-inverse-primary to-primary text-on-primary shadow-[0_0_32px_rgba(138,43,226,0.65)]'
            : 'bg-gradient-to-tr from-primary-container to-primary text-on-primary shadow-[0_0_16px_rgba(138,43,226,0.4)]'
        }`}
      >
        <span
          className="material-symbols-outlined text-[42px]"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          {isPlaying ? 'pause' : 'play_arrow'}
        </span>
      </button>

      {/* Next */}
      <button
        onClick={next}
        aria-label="Next track"
        className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface active:scale-90 transition-all shadow-md hover:bg-surface-container-highest"
      >
        <span className="material-symbols-outlined text-[28px]">skip_next</span>
      </button>

      {/* Repeat */}
      <button
        onClick={() => setRepeatMode(nextRepeat())}
        aria-label={`Repeat: ${repeatMode}`}
        className={`w-11 h-11 rounded-full flex items-center justify-center transition-all active:scale-95 relative ${
          repeatActive ? 'text-secondary-fixed' : 'text-on-surface-variant hover:text-secondary-fixed'
        }`}
      >
        <span className="material-symbols-outlined text-[22px]">{repeatIcon}</span>
        {repeatActive && (
          <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-secondary-fixed" />
        )}
      </button>
    </div>
  );
}
