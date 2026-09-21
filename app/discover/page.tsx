'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import { SONGS, searchSongs } from '@/data/songs';
import { useMusicStore } from '@/lib/musicStore';
import TrackRow from '@/components/shared/TrackRow';
import Link from 'next/link';

const GENRE_FILTERS = [
  { id: 'all', label: 'All', icon: 'all_inclusive' },
  { id: 'romantic', label: 'Romantic', icon: 'favorite' },
  { id: 'dance', label: 'Dance Hits', icon: 'electric_bolt' },
  { id: 'melancholy', label: 'Melancholy', icon: 'nightlight' },
  { id: 'party', label: 'Party', icon: 'speaker' },
  { id: 'late-night', label: 'Late Night', icon: 'bedtime' },
  { id: 'ghazal', label: 'Ghazals', icon: 'music_note' },
];

const ARTIST_DATA = [
  { name: 'Kumar Sanu', sub: 'Melody King', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB0s1QczY39WNrcneQkNx62OG_-azB0n23AiMcAKTijFgUSI8Fg2jTzaM4WCxVXw5iSB2LLWyWvYaToe7hdwSQkUfnYDhOZBZGyZBQpeLES_-HWDDS95Xrv1uFTQJeqpgrzKvzPFPyOZnHHgnDmSnmwb9jrkoE09y96sG3pYw0o6QUuqq0mgv74rASPs1FyB06aCnwVR4qRTrD2c7kkMqXrwnnJcEAUp7FzN6AhAq2qixZHftM3diA8', gradient: 'from-primary-container via-surface-variant to-secondary-container' },
  { name: 'Udit Narayan', sub: 'Pure Magic', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxf37qo3i8i78AUrZiKx-WUz0aeM0tCeqQtE9imUCTaYHL1XpyIbJ4dXiAAWsx_bAMfI5fthr30vnnN3eGFZ8Q0Z0wDiw3ICC94nCjtNHg5JA6QOML5ugQ2oGSwOmW5NKfUTP758OIWfwDYcY-OPrerT5zO3zXFceljsrPf0QVHOacaLfHDJGjmQH2VFd8TfAz0BE2bTubasUaph7L71JxL6LORN0rKwyHbabi-g1Q6IScIiiSEE2u', gradient: 'from-tertiary-container via-surface-variant to-primary' },
  { name: 'Alka Yagnik', sub: 'Nightingale', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAfERgCujYz7AVfj-SUSfgmjHfSy-suu-1ji_rOXiSv3QlclxplrBwUrxE8gxPOWvDFtAIBhLiIimy861B1qsbkCAO4dd6KeWLFo_DS2Jwx0ZkRY4rOF7mv8P7sCd4c2Iq94UKJTFjqTpSxZ_3tZla3UEZb8YbqMLfO6M7rMCY3zAdoAzKMiHwpzV87dNto2uA_o2JcffMR_2PWxnLdj2YEwqMA-FlITO9-VSoQDggbh09NLCGJLJL9', gradient: 'from-secondary via-surface-variant to-primary-container' },
  { name: 'A.R. Rahman', sub: 'Mozart of Madras', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDiyPgwb5T7QXdhBtw504kqkIE4cMknltRUizchhwbeYlRQ9HyKkm7ru3moenwgAukXfRLMmbwWYVtQJcQicMNXgMcMIHetTaRz_TA6s1u6FRLpsraBb5WmzROABpt18ZO9da5iBdHPcLxHXZs8GhVmAmLgtpa167Q6cNLhx2bQ2kkEYjMyib3fIEVLfTJJl0lRSChZVKwnR4rL8xVsmgAci7gH6Td67t-kTHD9HAjr4sQQu26N_AW', gradient: 'from-primary via-surface-variant to-secondary' },
  { name: 'Lata Mangeshkar', sub: 'Voice of India', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBo1OIRHwBfxJALRAeBId8psq45rOUvJIL6T3pcD1gy2PlgYRSgFP8v-smlWYoWVv4QGXTC9Kos7ALRFVFLaXufXUkU6AgigNIUwnDO6qW-ZESC8PoyC3xXh_8xYmE2FSn9Xhrz2kshp4co1OzR9F2BKWg2rZrQvZS9DwjjTZzoBhAtmQINaWs_ekM_tkpAQUhm2uAGo2aoRGqmzf4BMkz2qoYkJuPs5n_qbtWdNXq382az6pWD8T5A', gradient: 'from-primary-container to-tertiary' },
  { name: 'Sonu Nigam', sub: 'Golden Voice', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCjux1ukHLCuzCZfQgUQUBHix7SMGOGfQ6f3nkJSxgH5Aj9gDioJlvK0jmnpXuRsZPLQ2ZywmaI4elfZ9U5qvUaoBMdub45mO0sz0u58-979HpX52NJoReP4iJO_KOFrJ1584LJUFbK5ZE4z8lH1zc9Vgf9AC1gTBDI95LrC0EMiuOKwOLEjyZhZbM4q9s4jdyCDBDU76v69hA6zzJ9AokVi5-Ams162EN4y72aB4VA3sMz4txRIWaV', gradient: 'from-secondary-container via-surface-variant to-primary-container' },
];

export default function DiscoverPage() {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const { playSong } = useMusicStore();

  const filteredSongs = useMemo(() => {
    if (query.trim()) return searchSongs(query);
    if (activeFilter === 'all') return SONGS;
    return SONGS.filter((s) => s.mood.includes(activeFilter as typeof SONGS[0]['mood'][0]));
  }, [query, activeFilter]);

  return (
    <>
      <Header title="Discover" subtitle="Dolby Stereo 90s" />
      <main className="pt-16 pb-36 bg-background min-h-screen">
        <div className="max-w-2xl md:max-w-4xl lg:max-w-6xl mx-auto">
          {/* Search console */}
          <section className="px-4 pt-4">
            <div className="relative w-full rounded-xl bg-surface-container-high/90 backdrop-blur-xl shadow-xl overflow-hidden p-3 flex flex-col gap-3">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-secondary-container animate-pulse shadow-[0_0_8px_rgba(0,227,253,0.9)]" />
                  <span className="font-mono-space text-[10px] text-secondary-fixed-dim uppercase tracking-wider">Hi-Fi Frequency Tuner 96.4 MHz</span>
                </div>
                <div className="flex items-center gap-1 text-on-surface-variant">
                  <span className="material-symbols-outlined text-[16px] text-tertiary">graphic_eq</span>
                  <span className="font-mono-space text-[10px]">DOLBY HX PRO</span>
                </div>
              </div>

              <div className="relative flex items-center bg-surface-container-lowest/90 rounded-lg px-4 py-3 shadow-inner group">
                <span className="material-symbols-outlined text-secondary mr-3 text-[22px]">radio</span>
                <input
                  className="w-full bg-transparent text-on-surface placeholder:text-on-surface-variant/70 font-sans text-body-md focus:outline-none"
                  placeholder="Search songs, artists, albums, retro moods..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  type="text"
                  id="discover-search"
                />
                {query && (
                  <button
                    onClick={() => setQuery('')}
                    className="text-on-surface-variant hover:text-on-surface transition-colors p-1"
                    aria-label="Clear search"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                )}
              </div>

              {/* Genre filters */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 hide-scrollbar">
                {GENRE_FILTERS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => { setActiveFilter(f.id); setQuery(''); }}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-full font-mono-space text-[10px] transition-all active:scale-95 flex items-center gap-1 ${
                      activeFilter === f.id && !query
                        ? 'bg-gradient-to-r from-primary-container to-tertiary-container text-on-primary shadow-md'
                        : 'bg-surface-variant/70 hover:bg-surface-variant text-on-surface'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[14px]">{f.icon}</span>
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Live Tape Deck Marquee */}
          <div className="px-4 mt-4">
            <div className="bg-gradient-to-r from-surface-container-lowest via-surface-container to-surface-container-lowest py-2 px-4 rounded-lg flex items-center justify-between shadow-inner">
              <div className="flex items-center gap-2 min-w-0">
                <span className="material-symbols-outlined text-secondary animate-spin-slow text-[18px]">album</span>
                <span className="font-mono-space text-label-mono text-secondary truncate">TAPE DECK ACTIVE: 1994 MONSOON RAAG SESSIONS</span>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0 pl-2">
                {[0.1, 0.25, 0.4].map((d, i) => (
                  <span key={i} className="inline-block w-1.5 rounded-xs animate-bounce"
                    style={{ height: ['12px', '16px', '8px'][i], animationDelay: `${d}s`, background: ['#00e3fd', '#ecb2ff', '#dcb8ff'][i] }} />
                ))}
              </div>
            </div>
          </div>

          {/* Search results or filtered songs */}
          {(query || activeFilter !== 'all') && (
            <section className="mt-4 px-4 flex flex-col gap-1">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-sans text-title-lg text-on-surface font-semibold">
                  {query ? `Results for "${query}"` : `${GENRE_FILTERS.find(f=>f.id===activeFilter)?.label} Songs`}
                </h2>
                <span className="font-mono-space text-[10px] text-on-surface-variant">{filteredSongs.length} tracks</span>
              </div>
              {filteredSongs.length === 0 ? (
                <div className="text-center py-8 text-on-surface-variant font-sans text-body-md">
                  No songs found. Try another search.
                </div>
              ) : (
                filteredSongs.map((song) => (
                  <TrackRow key={song.id} song={song} queue={filteredSongs} />
                ))
              )}
            </section>
          )}

          {/* Today's 90s Picks — show when not searching */}
          {!query && activeFilter === 'all' && (
            <>
              <section className="mt-6 flex flex-col gap-3">
                <div className="px-4 flex items-end justify-between">
                  <div>
                    <span className="font-mono-space text-[10px] text-tertiary-fixed-dim uppercase tracking-wider block">Hand-Curated Mixtapes</span>
                    <h2 className="font-playfair text-headline-sm text-on-surface leading-tight">Today&apos;s 90s Picks</h2>
                  </div>
                  <span className="font-mono-space text-[10px] text-secondary bg-surface-container-high px-2 py-1 rounded-full flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px]">bolt</span> 24h Refresh
                  </span>
                </div>
                <div className="flex gap-4 overflow-x-auto px-4 pb-3 hide-scrollbar">
                  {[
                    { song: SONGS[0], label: 'SIDE A', badgeLabel: 'DOLBY-C', tracks: '9 Tracks', subtitle: 'Jatin-Lalit • 1995 Platinum Release', name: 'DDLJ Golden Cassette', src: SONGS[0].coverSrc },
                    { song: SONGS[7], label: 'CASSETTE 02', badgeLabel: 'ANALOG TAPE', tracks: '10 Tracks', subtitle: 'Lucky Ali • 1996 Indie Masterpiece', name: 'Sunoh (The Wanderer)', src: SONGS[7].coverSrc },
                    { song: SONGS[8], label: 'ORIGINAL OST', badgeLabel: 'STUDIO MASTER', tracks: '6 Tracks', subtitle: 'A.R. Rahman • 1998 Revolutionary Sound', name: 'Dil Se Audio Archive', src: SONGS[8].coverSrc },
                  ].map((item, i) => (
                    <div key={i} className="w-64 flex-shrink-0 bg-surface-container-high/80 rounded-xl p-3 flex flex-col gap-3 shadow-xl backdrop-blur-md group hover:bg-surface-container-high transition-all">
                      <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-surface-container-lowest">
                        <img src={item.src} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent opacity-80" />
                        <span className="absolute top-2 left-2 font-mono-space text-[10px] bg-surface-container-lowest/80 text-secondary backdrop-blur-md px-2 py-0.5 rounded">{item.label}</span>
                        <button
                          onClick={() => playSong(item.song, SONGS)}
                          className="absolute bottom-3 right-3 w-11 h-11 rounded-full bg-gradient-to-tr from-primary-container to-tertiary-container flex items-center justify-center text-on-primary shadow-[0_0_16px_rgba(138,43,226,0.6)] active:scale-95 transition-transform"
                        >
                          <span className="material-symbols-outlined text-[24px]">play_arrow</span>
                        </button>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-sans text-title-md text-on-surface truncate">{item.name}</span>
                        <span className="font-sans text-body-sm text-on-surface-variant truncate">{item.subtitle}</span>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="font-mono-space text-[10px] text-secondary bg-surface-variant/80 px-1.5 py-0.5 rounded">{item.badgeLabel}</span>
                          <span className="font-mono-space text-[10px] text-tertiary">{item.tracks}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* 90s Essentials Artists */}
              <section className="mt-6 px-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-mono-space text-[10px] text-secondary-fixed-dim uppercase tracking-wider block">Legends of the Decade</span>
                    <h2 className="font-playfair text-headline-sm text-on-surface">90s Essentials</h2>
                  </div>
                  <button className="font-mono-space text-label-mono text-primary hover:text-secondary transition-colors">See 24 Icons</button>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar pt-2">
                  {ARTIST_DATA.map((artist) => (
                    <div key={artist.name} className="flex flex-col items-center gap-1.5 w-20 flex-shrink-0 cursor-pointer group">
                      <div className={`relative w-18 h-18 rounded-full p-1 bg-gradient-to-tr ${artist.gradient} group-hover:scale-105 transition-transform shadow-md w-16 h-16`}>
                        <div className="w-full h-full rounded-full overflow-hidden bg-surface-container-lowest">
                          <img src={artist.src} alt={artist.name} className="w-full h-full object-cover" />
                        </div>
                      </div>
                      <span className="font-sans text-title-md text-on-surface text-center truncate w-full text-xs">{artist.name}</span>
                      <span className="font-mono-space text-[10px] text-on-surface-variant">{artist.sub}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* All songs track list */}
              <section className="mt-6 px-4 flex flex-col gap-1">
                <div className="flex items-end justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-secondary-container text-[18px]">auto_awesome</span>
                      <span className="font-mono-space text-[10px] text-secondary-container uppercase tracking-wider">Unsung Melodies</span>
                    </div>
                    <h2 className="font-playfair text-headline-sm text-on-surface">Hidden Gems & Lost B-Sides</h2>
                  </div>
                  <button
                    onClick={() => playSong(SONGS[0], SONGS)}
                    className="flex items-center gap-1 font-mono-space text-[10px] text-on-primary bg-primary-container hover:bg-opacity-90 px-3 py-1.5 rounded-full shadow-md active:scale-95 transition-all"
                  >
                    <span className="material-symbols-outlined text-[16px]">play_circle</span> Play All
                  </button>
                </div>
                {SONGS.slice(10).map((song) => (
                  <TrackRow key={song.id} song={song} queue={SONGS} />
                ))}
              </section>
            </>
          )}
        </div>
      </main>
    </>
  );
}
