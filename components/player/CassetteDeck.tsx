'use client';

interface CassetteDeckProps {
  title: string;
  playing: boolean;
}

export default function CassetteDeck({ title, playing }: CassetteDeckProps) {
  return (
    <div className="w-72 rounded-xl bg-surface-container-lowest p-3 relative shadow-[0_16px_40px_rgba(0,0,0,0.9),0_0_25px_rgba(0,227,253,0.15)] flex flex-col justify-between overflow-hidden">
      <div className="w-full flex justify-between items-center text-on-surface-variant font-mono-space text-[9px] uppercase px-1">
        <span className="text-secondary-fixed">TDK SA-X90</span>
        <span className="text-tertiary">Type II • Chrome EQ 70µs</span>
        <span className="text-on-surface">STEREO</span>
      </div>

      <div className="w-full bg-surface-container-high rounded-lg p-2 flex flex-col gap-1 shadow-inner mt-1">
        <div className="flex justify-between items-baseline">
          <span className="font-sans text-title-md text-primary font-semibold truncate">{title}</span>
          <span className="font-mono-space text-label-mono text-secondary-fixed">NR [B]</span>
        </div>

        {/* Tape window with spinning reels */}
        <div className="w-full h-14 bg-surface-container-lowest rounded-md flex items-center justify-around px-4 relative overflow-hidden">
          {/* Exposed magnetic ribbon */}
          <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-8 rounded-sm opacity-90" style={{ background: '#3d2417' }} />

          {/* Left reel */}
          <div className={`relative z-10 w-9 h-9 rounded-full bg-surface-variant shadow flex items-center justify-center ${playing ? 'animate-spin-fast' : ''}`}>
            <div className="w-4 h-4 rounded-full bg-surface-container-lowest flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary-fixed" />
            </div>
            <div className="absolute w-full h-0.5 bg-on-surface-variant/40" />
            <div className="absolute h-full w-0.5 bg-on-surface-variant/40" />
          </div>

          {/* Tape counter */}
          <div className="relative z-10 px-2 py-0.5 rounded bg-surface-container-lowest/90 font-mono-space text-[10px] text-secondary tracking-widest">
            {playing ? '0248' : '0000'}
          </div>

          {/* Right reel */}
          <div className={`relative z-10 w-9 h-9 rounded-full bg-surface-variant shadow flex items-center justify-center ${playing ? 'animate-spin-fast' : ''}`}>
            <div className="w-4 h-4 rounded-full bg-surface-container-lowest flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary-fixed" />
            </div>
            <div className="absolute w-full h-0.5 bg-on-surface-variant/40" />
            <div className="absolute h-full w-0.5 bg-on-surface-variant/40" />
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center px-1 font-mono-space text-[9px] text-outline mt-1">
        <span>AUTO REVERSE</span>
        <span>A-SIDE: 01/06</span>
        <span>DOLBY HX PRO</span>
      </div>
    </div>
  );
}
