'use client';

import { useMusicStore } from '@/lib/musicStore';

interface VinylDiscProps {
  coverSrc: string;
  label?: string;
  filmLabel?: string;
  playing: boolean;
}

export default function VinylDisc({ coverSrc, label, filmLabel, playing }: VinylDiscProps) {
  return (
    <div
      className="relative w-72 h-72 rounded-full p-2 flex items-center justify-center shadow-[0_16px_50px_rgba(0,0,0,0.9),0_0_30px_rgba(138,43,226,0.25)] bg-gradient-to-br from-surface-container-high to-surface-container-lowest transition-all duration-500"
      id="vinylDeck"
    >
      {/* Tonearm */}
      <div
        className="absolute -top-4 right-1 z-30 pointer-events-none transition-transform duration-700"
        style={{ transform: playing ? 'rotate(18deg)' : 'rotate(0deg)', transformOrigin: 'top right' }}
        id="toneArmAssembly"
      >
        <div className="relative flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-gradient-to-b from-surface-bright to-surface-container-lowest shadow-md flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-primary shadow-inner" />
          </div>
          <div className="w-1.5 h-28 bg-gradient-to-b from-outline-variant to-surface-bright rounded-full -mt-1 shadow-sm" />
          <div
            className="w-3 h-5 bg-gradient-to-tr from-secondary-fixed to-secondary-container rounded-sm shadow-[0_0_10px_rgba(0,227,253,0.6)]"
            style={{ transform: 'rotate(-12deg)' }}
          />
        </div>
      </div>

      {/* Vinyl Record */}
      <div
        className={`w-full h-full rounded-full relative flex items-center justify-center shadow-inner overflow-hidden ${playing ? 'animate-vinyl' : 'animate-vinyl-paused'}`}
        style={{
          background: 'radial-gradient(circle at center, #1b1920 0%, #0d0c10 35%, #18171d 50%, #08070a 70%, #16151c 88%, #080709 100%)',
        }}
        id="vinylRecord"
      >
        {/* Micro-grooves */}
        <div
          className="absolute inset-0 rounded-full opacity-60 pointer-events-none"
          style={{
            background: 'repeating-radial-gradient(circle, transparent 0, transparent 2px, rgba(255,255,255,0.03) 3px, rgba(255,255,255,0.01) 4px)',
          }}
        />
        {/* Light sheen */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />

        {/* Center label */}
        <div className="w-28 h-28 rounded-full bg-surface-container-lowest relative overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.8)] flex items-center justify-center">
          <img
            src={coverSrc}
            alt={label || 'Album art'}
            className="absolute inset-0 w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest/90 via-surface-container-lowest/30 to-transparent" />
          <div className="relative z-10 flex flex-col items-center justify-center text-center px-1">
            <span className="font-mono-space text-[8px] uppercase tracking-widest text-secondary-fixed">HMV Classics</span>
            <span className="font-playfair text-[12px] leading-tight text-primary font-bold">{filmLabel || label}</span>
            <span className="font-mono-space text-[7px] text-on-surface-variant tracking-wider">SIDE A • 33 RPM</span>
          </div>
          {/* Spindle hole */}
          <div className="w-4 h-4 rounded-full bg-surface-container-lowest shadow-inner border border-primary/40 relative z-20" />
        </div>
      </div>
    </div>
  );
}
