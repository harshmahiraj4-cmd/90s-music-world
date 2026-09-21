'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import { SONGS } from '@/data/songs';
import { useMusicStore } from '@/lib/musicStore';
import TrackRow from '@/components/shared/TrackRow';

type VoiceFilter = 'all' | 'male' | 'female';

const MALE_VOICES = [
  { initials: 'KS', name: 'Kumar Sanu', color: 'text-primary', from: 'from-primary', to: 'to-secondary' },
  { initials: 'UN', name: 'Udit Narayan', color: 'text-tertiary', from: 'from-tertiary', to: 'to-primary' },
  { initials: 'SS', name: 'SP Balasubrahmanyam', color: 'text-secondary', from: 'from-secondary', to: 'to-primary' },
  { initials: 'AR', name: 'A.R. Rahman', color: 'text-primary', from: 'from-primary-container', to: 'to-tertiary' },
];
const FEMALE_VOICES = [
  { initials: 'AY', name: 'Alka Yagnik', color: 'text-tertiary', from: 'from-tertiary', to: 'to-primary' },
  { initials: 'LM', name: 'Lata Mangeshkar', color: 'text-primary', from: 'from-primary', to: 'to-secondary' },
  { initials: 'AB', name: 'Asha Bhosle', color: 'text-secondary', from: 'from-secondary', to: 'to-tertiary' },
  { initials: 'KK', name: 'Kavita Krishnamurthy', color: 'text-secondary', from: 'from-secondary-container', to: 'to-primary-container' },
];

const VAULTS = [
  {
    badge: 'BLOCKBUSTERS',
    badgeClass: 'bg-primary-container/90 text-on-primary-container',
    name: '90s Bollywood Giants',
    subtitle: 'DDLJ, Aashiqui, KKHH, Saajan',
    count: '48 CLASSICS',
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBWHiqQQ3Jfy2hKMk-y9gVEbrQRXg_Mr6zDbtjXhG5fctFg4pyawwF8yM-buHKrfG3biBPPJnl2eIvz4zEZghBLQavsgEVy6FmXncrCnq8GIYB0j-X54-qVkHgRKxJnDw7LVTLkHUrxh15KZsWIlm-cg2_uy_esjhDierkiDGajPz5od593AjbtcCj51a7g-Z-L4wvLknIJ4cDo_PF3TYGz5HUR8PiK2A1AO067ayqG8GLBZ6pm8ptz',
  },
  {
    badge: 'MELODIC DUETS',
    badgeClass: 'bg-secondary-container/90 text-on-secondary-container',
    name: 'Romantic Tape Exchanges',
    subtitle: 'Kumar Sanu, Alka, Udit & Anuradha',
    count: '62 BALLADS',
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD0thfDorgPcw-pjg1dzsCZ0BHEKnYoDSCSBxNTGGhSonN_eh2LJPqqJWbUqCYgnLm1W6EELAtXfp6FPbum7w3DB48lsb054J1ROthN6JP4fWYR11kFLOCjW7ZzKmofTuEYt079m66uxPzNbIjLPZHDDHfNTr6MkfDF4eQWvkcdVyKu4zkuX_kzWUPFGQE3mkaQpa3pqh59sc_9QNZNzNhTdJJNxEZfZ-qpEgbP_4LW5IyR50eyv9w6g9T6',
  },
  {
    badge: 'DANCE ANTHEMS',
    badgeClass: 'bg-tertiary-container/90 text-on-tertiary-container',
    name: 'High Voltage 90s Club',
    subtitle: 'Chaiyya Chaiyya, Ole Ole, Tan Tana Tan',
    count: '35 ANTHEMS',
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAyDyoToIH1MQZiq1L_CL1z03iHic3YH1R1q-J-nBqDOlSTUvWPT-kRH6gKnzbrqw49Kkcdf2CUfubiRxEHS7OKtN3rxXBxb7QAa0DRndmAzM-kfvLL0VBJmvOZVmz-og07ubRmkAR_iKTTrfNHHEzs74alyuprLVTmAkQkbjj_6zDGWFKarrSDfplaU1B0hR7WspE87G-TKDlpgwPR3tRi4fwukm7byXlkB2qH2UQq95-izrZXyX7L',
  },
  {
    badge: 'SOUL & GHAZALS',
    badgeClass: 'bg-surface-variant/90 text-on-surface',
    name: 'Late Night Heartbreak',
    subtitle: 'Jagjit Singh, Pankaj Udhas, Nadeem-Shravan',
    count: '29 POEMS',
    src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAG22TMf_KyDF1P5Nw813o1Kcg7tJPCY0rmca_4clWGsfXNytClzYifSKuYsHrfZzEDxrO5gZ0_CEeZnEtmVsihp5PYSP5nrVh-t6vCVIJsOFKr_jaLTpHxLLWWE32IYZfqKCAlAk5nI0-z_D0-VgXx3WQAAMABS2WafR2tZYxy4vdVPLUqO6UUYN7cyx2OJYhT858C1M52v9IbX5cIb26LKhswAx1iO2pkoN6vn36lKcBqQOr578fc',
  },
];

export default function HitsPage() {
  const [voiceFilter, setVoiceFilter] = useState<VoiceFilter>('all');
  const { playSong } = useMusicStore();

  const voices = voiceFilter === 'male' ? MALE_VOICES : voiceFilter === 'female' ? FEMALE_VOICES : [...MALE_VOICES, ...FEMALE_VOICES];

  return (
    <>
      <Header title="90S Hits" subtitle="Dolby Stereo 90s" />
      <main className="pt-16 pb-36 bg-background min-h-screen">
        <div className="max-w-2xl mx-auto">
          {/* Hero capsule */}
          <section className="relative w-full px-4 pt-4 pb-6 overflow-hidden">
            <div className="relative w-full rounded-xl bg-surface-container-high/70 backdrop-blur-2xl p-space-lg shadow-xl shadow-primary-container/15 overflow-hidden flex flex-col justify-between">
              {/* Vinyl decorative */}
              <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full opacity-20 pointer-events-none" style={{ background: 'repeating-radial-gradient(circle at center, #dcb8ff 0px, #dcb8ff 1px, transparent 2px, transparent 6px)' }} />
              <div className="absolute -left-12 -bottom-16 w-48 h-48 rounded-full opacity-15 pointer-events-none" style={{ background: 'radial-gradient(circle at center,#00e3fd,transparent 70%)' }} />

              <div className="flex items-center justify-between z-10">
                <div className="flex items-center gap-2 bg-surface-container-lowest/80 px-2.5 py-1 rounded-full backdrop-blur-md">
                  <span className="material-symbols-outlined text-[14px] text-secondary-fixed-dim animate-pulse">album</span>
                  <span className="font-mono-space text-[10px] text-secondary-fixed-dim uppercase tracking-widest">Master Tape Vault</span>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-surface-variant/80 text-secondary font-mono-space text-[10px]">
                  DOLBY HX PRO
                </div>
              </div>

              <div className="my-4 z-10 flex flex-col gap-1">
                <span className="font-mono-space text-label-mono text-tertiary uppercase tracking-widest">Curated Archive • 1990–1999</span>
                <h1 className="font-playfair text-headline-lg-mobile font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-fixed via-secondary to-tertiary-fixed leading-tight">
                  THE SOUNDTRACK OF A GENERATION
                </h1>
                <p className="font-sans text-body-sm text-on-surface-variant line-clamp-2 mt-1">
                  Relive timeless magnetic nostalgia. 20 digitally restored cinematic anthems, golden duets, and late-night tape cassettes.
                </p>
              </div>

              <div className="z-10 flex items-center gap-3">
                <button
                  onClick={() => playSong(SONGS[0], SONGS)}
                  className="flex-1 h-12 rounded-full bg-gradient-to-r from-primary-container to-tertiary-container flex items-center justify-center gap-2 text-on-primary font-sans text-title-md font-semibold shadow-lg shadow-primary-container/40 active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined text-[20px]">play_arrow</span>
                  Play All 90s Hits
                </button>
                <button
                  onClick={() => {
                    const shuffled = [...SONGS].sort(() => Math.random() - 0.5);
                    playSong(shuffled[0], shuffled);
                  }}
                  className="w-12 h-12 rounded-full bg-surface-container-highest/90 flex items-center justify-center text-secondary hover:text-on-surface active:scale-95 transition-all shadow-md"
                  aria-label="Shuffle Tape"
                >
                  <span className="material-symbols-outlined text-[20px]">shuffle</span>
                </button>
              </div>
            </div>
          </section>

          {/* Curated Vaults */}
          <section className="px-4 mt-2 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-4 rounded-full bg-secondary-container" />
                <h2 className="font-sans text-title-lg text-on-surface font-semibold">Curated Vaults</h2>
              </div>
              <span className="font-mono-space text-label-mono-sm text-on-surface-variant">4 THEMES</span>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
              {VAULTS.map((vault) => (
                <div key={vault.badge} className="snap-start flex-shrink-0 w-64 rounded-xl bg-surface-container-high/80 p-3 backdrop-blur-xl flex flex-col gap-2 group shadow-md shadow-black/40">
                  <div className="relative w-full h-36 rounded-lg overflow-hidden bg-surface-container-lowest">
                    <img src={vault.src} alt={vault.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/30 to-transparent" />
                    <span className={`absolute bottom-2 left-2 px-2 py-0.5 rounded font-mono-space text-[10px] font-semibold ${vault.badgeClass}`}>
                      {vault.badge}
                    </span>
                  </div>
                  <span className="font-sans text-title-md text-on-surface truncate">{vault.name}</span>
                  <span className="font-sans text-body-sm text-on-surface-variant truncate">{vault.subtitle}</span>
                  <div className="flex items-center justify-between text-secondary-fixed-dim">
                    <span className="font-mono-space text-[10px]">{vault.count}</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Voice Showcase */}
          <section className="mt-6 px-4 flex flex-col gap-3 bg-surface-container-low/70 backdrop-blur-xl p-4 rounded-xl mx-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-tertiary">mic</span>
                <h2 className="font-sans text-title-lg text-on-surface font-semibold">Voice Showcase</h2>
              </div>
              <span className="font-mono-space text-[10px] text-secondary">STUDIO TAPES</span>
            </div>

            {/* Voice filter pills */}
            <div className="flex items-center p-1 rounded-full bg-surface-container-lowest">
              {(['all', 'male', 'female'] as VoiceFilter[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setVoiceFilter(f)}
                  className={`flex-1 py-1.5 rounded-full font-mono-space text-[10px] capitalize text-center transition-all ${
                    voiceFilter === f
                      ? 'bg-primary-container text-on-primary font-semibold shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {f === 'all' ? 'All Voices' : f === 'male' ? 'Iconic Male' : 'Iconic Female'}
                </button>
              ))}
            </div>

            {/* Voice avatar grid */}
            <div className="grid grid-cols-4 gap-3">
              {voices.map((v) => (
                <div key={v.name} className="flex flex-col items-center gap-1">
                  <div className={`w-14 h-14 rounded-full p-0.5 bg-gradient-to-tr ${v.from} ${v.to}`}>
                    <div className="w-full h-full rounded-full bg-surface-container-high flex items-center justify-center">
                      <span className={`font-sans text-title-md font-bold ${v.color}`}>{v.initials}</span>
                    </div>
                  </div>
                  <span className="font-mono-space text-[10px] text-on-surface truncate w-full text-center leading-tight">{v.name}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Full Track List */}
          <section className="mt-6 px-4 flex flex-col gap-1">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-playfair text-headline-sm text-on-surface font-semibold">Complete Archive</h2>
              <span className="font-mono-space text-label-mono text-secondary">{SONGS.length} CLASSICS</span>
            </div>
            {SONGS.map((song, idx) => (
              <TrackRow key={song.id} song={song} index={idx} showIndex queue={SONGS} />
            ))}
          </section>
        </div>
      </main>
    </>
  );
}
