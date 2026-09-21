'use client';

import { useMusicStore } from '@/lib/musicStore';
import { SONGS } from '@/data/songs';

const ARTIST_SONG = SONGS.find((s) => s.id === 'mera-dil-bhi') || SONGS[0];

export default function ArtistSpotlight() {
  const { playSong } = useMusicStore();
  
  return (
    <section className="mt-6 px-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-tertiary text-[22px]">stars</span>
          <h2 className="font-sans text-title-lg text-on-surface font-semibold">Artist Spotlight</h2>
        </div>
        <span className="font-mono-space text-[10px] text-secondary-fixed">DUO OF THE DECADE</span>
      </div>

      <div className="relative bg-surface-container rounded-xl p-4 shadow-xl overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="relative w-28 h-28 flex-shrink-0 rounded-xl overflow-hidden shadow-lg">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9we3ViXxO0B0qfMyOnDHGQN0naH_X8_YMBkLyw_0FxLcDrXagy3SdMBjrWyBtgyDe36KYZyfCH-TKMSarxeCUc9A9cQw1EbmbWTPdJtxxGWH0od5viwxBt6p0ICqPxyVI15nIsdMhGfAHYTLZDRb5wYHS1tlthfk44FGcAJUlD6NDDwIV7KUUFDxih4D9t7K45BX_aV-T4MiRlF5LworQJZpDj7_eu3NaFivLeOqzyDtKgm1y9CrT"
              alt="Kumar Sanu & Alka Yagnik"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest/80 to-transparent" />
            <div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-surface-container-lowest/90 font-mono-space text-[10px] text-tertiary">
              5x Filmfare
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-sans text-title-lg text-on-surface font-bold truncate">Kumar Sanu & Alka Yagnik</h3>
            <p className="font-mono-space text-[11px] text-secondary mt-0.5">Over 20,000 Recorded Tracks</p>
            <p className="font-sans text-body-sm text-on-surface-variant mt-1 line-clamp-2">
              The defining vocal pairing that ruled the radio waves across the subcontinent through the entire decade of the 1990s.
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-2 pt-2">
          <div className="flex flex-col">
            <span className="font-mono-space text-[10px] text-outline">TOP PLAYLIST</span>
            <span className="font-sans text-body-sm text-on-surface font-medium truncate">Golden Melodies Vol. 1</span>
          </div>
          <button
            onClick={() => playSong(ARTIST_SONG, SONGS.filter(s => s.mood.includes('romantic')))}
            className="flex items-center gap-2 py-2 px-4 rounded-xl bg-primary text-on-primary font-sans text-title-md font-semibold shadow-md active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-[18px]">radio</span>
            <span>Play Artist Radio</span>
          </button>
        </div>
      </div>
    </section>
  );
}
