'use client';

import { useMusicStore } from '@/lib/musicStore';

interface VolumeControlProps {
  onVolumeChange?: (v: number) => void;
}

export default function VolumeControl({ onVolumeChange }: VolumeControlProps) {
  const { volume, isMuted, setVolume, toggleMute } = useMusicStore();

  const displayVolume = isMuted ? 0 : volume;

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.min(Math.max(x / rect.width, 0), 1);
    setVolume(pct);
    onVolumeChange?.(pct);
  };

  return (
    <div className="flex items-center gap-3 px-1">
      <button
        onClick={toggleMute}
        aria-label={isMuted ? 'Unmute' : 'Mute'}
        className="text-on-surface-variant hover:text-on-surface flex items-center justify-center transition-colors"
      >
        <span className="material-symbols-outlined text-[20px]">
          {isMuted || volume === 0 ? 'volume_off' : volume < 0.5 ? 'volume_down' : 'volume_up'}
        </span>
      </button>

      <div
        className="relative flex-1 h-5 flex items-center group cursor-pointer"
        onClick={handleClick}
        role="slider"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(displayVolume * 100)}
        aria-label="Volume"
      >
        <div className="w-full h-1.5 rounded-full bg-surface-container-highest overflow-hidden relative">
          <div
            className="absolute left-0 top-0 bottom-0 rounded-full shadow-[0_0_8px_rgba(0,227,253,0.5)]"
            style={{
              width: `${displayVolume * 100}%`,
              background: 'linear-gradient(to right, #00daf3, #bdf4ff)',
              transition: 'width 80ms ease-out',
            }}
          />
        </div>
        <div
          className="absolute -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-secondary-fixed shadow-[0_0_10px_rgba(0,227,253,0.8)] transition-transform group-hover:scale-125"
          style={{ left: `${displayVolume * 100}%` }}
        />
      </div>

      <button
        onClick={() => setVolume(1)}
        aria-label="Max volume"
        className="text-on-surface-variant hover:text-on-surface flex items-center justify-center transition-colors"
      >
        <span className="material-symbols-outlined text-[20px]">volume_up</span>
      </button>
    </div>
  );
}
