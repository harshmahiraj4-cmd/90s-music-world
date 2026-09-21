'use client';

import { useCallback } from 'react';
import { useMusicStore } from '@/lib/musicStore';

function formatTime(secs: number) {
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

interface ProgressBarProps {
  onSeek: (progress: number) => void;
}

export default function ProgressBar({ onSeek }: ProgressBarProps) {
  const { progress, currentTime, duration, currentSong } = useMusicStore();

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const pct = Math.min(Math.max(x / rect.width, 0), 1);
      onSeek(pct);
    },
    [onSeek]
  );

  const totalSecs = duration || currentSong?.durationSeconds || 0;

  return (
    <div className="w-full flex flex-col gap-1.5">
      {/* Track */}
      <div
        className="relative w-full h-6 flex items-center cursor-pointer group"
        onClick={handleClick}
        role="slider"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
        aria-label="Seek"
      >
        <div className="w-full h-1.5 rounded-full bg-surface-container-high overflow-hidden relative">
          {/* Buffered */}
          <div className="absolute left-0 top-0 bottom-0 w-[68%] bg-surface-bright rounded-full" />
          {/* Progress */}
          <div
            className="absolute left-0 top-0 bottom-0 rounded-full shadow-[0_0_12px_rgba(220,184,255,0.7)]"
            style={{
              width: `${progress * 100}%`,
              background: 'linear-gradient(to right, #bdf4ff, #8a2be2)',
              transition: 'width 100ms linear',
            }}
          />
        </div>
        {/* Scrubber knob */}
        <div
          className="absolute -translate-x-1/2 w-4 h-4 rounded-full bg-primary-fixed shadow-[0_0_14px_rgba(220,184,255,0.9)] ring-4 ring-primary-container/40 flex items-center justify-center transition-transform group-hover:scale-125"
          style={{ left: `${progress * 100}%` }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-on-primary" />
        </div>
      </div>

      {/* Timestamps */}
      <div className="flex justify-between items-center font-mono-space text-label-mono text-on-surface-variant">
        <span className="text-secondary-fixed font-semibold tracking-wider">
          {formatTime(currentTime)}
        </span>
        <span className="text-[10px] text-outline uppercase tracking-widest">Dolby Surr 5.1</span>
        <span className="tracking-wider">{formatTime(totalSecs)}</span>
      </div>
    </div>
  );
}
