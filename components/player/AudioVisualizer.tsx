'use client';

import { useAudioVisualizer } from '@/lib/useAudioVisualizer';
import { useMusicStore } from '@/lib/musicStore';

const BAR_COUNT = 14;

export default function AudioVisualizer() {
  const bars = useAudioVisualizer(BAR_COUNT);
  const isPlaying = useMusicStore((s) => s.isPlaying);

  return (
    <div className="w-full p-3 rounded-xl bg-surface-container-lowest/80 backdrop-blur-md flex flex-col gap-1.5 shadow-inner">
      <div className="flex justify-between items-center text-label-mono-sm font-mono-space text-outline">
        <span className="flex items-center gap-1 text-secondary-fixed-dim">
          <span className="material-symbols-outlined text-[12px] text-secondary">graphic_eq</span>
          REALTIME RTA FREQ
        </span>
        <span className="text-tertiary-fixed-dim">PEAK -1.2 dBFS</span>
      </div>

      <div className="w-full h-11 flex items-end justify-between gap-1 pt-1">
        {bars.map((height, i) => {
          const isPeak = height > 0.85;
          return (
            <div
              key={i}
              className="flex-1 bg-surface-container-high rounded-full overflow-hidden flex flex-col justify-end h-full"
            >
              <div
                className={`w-full rounded-full transition-all duration-150 ${
                  isPeak
                    ? 'shadow-[0_0_8px_#ecb2ff]'
                    : ''
                }`}
                style={{
                  height: `${Math.max(8, height * 100)}%`,
                  background: isPeak
                    ? 'linear-gradient(to top, #00daf3, #ecb2ff)'
                    : 'linear-gradient(to top, #9cf0ff, #dcb8ff)',
                  transition: 'height 120ms ease-out',
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
