'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useMusicStore } from '@/lib/musicStore';
import { useAudioEngine } from '@/lib/audioEngine';
import VinylDisc from '@/components/player/VinylDisc';
import CassetteDeck from '@/components/player/CassetteDeck';
import AudioVisualizer from '@/components/player/AudioVisualizer';
import ProgressBar from '@/components/player/ProgressBar';
import TransportControls from '@/components/player/TransportControls';
import VolumeControl from '@/components/player/VolumeControl';
import FavoriteButton from '@/components/shared/FavoriteButton';

export default function NowPlayingScreen() {
  const {
    currentSong,
    isPlaying,
    deckMode,
    toggleDeckMode,
  } = useMusicStore();

  const { handleSeek } = useAudioEngine();

  if (!currentSong) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-on-surface-variant gap-4 px-6">
        <span className="material-symbols-outlined text-[64px] text-outline">album</span>
        <p className="font-playfair text-headline-sm text-center">Nothing Playing Yet</p>
        <p className="font-sans text-body-md text-center text-on-surface-variant">
          Go back and select a song to begin your journey.
        </p>
        <Link
          href="/"
          className="mt-4 px-6 py-3 rounded-full bg-primary-container text-on-primary font-sans text-title-md font-semibold active:scale-95 transition-transform"
        >
          Browse Music
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      {/* Background ambient aura */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full" style={{
          background: `radial-gradient(ellipse at 50% 30%, rgba(138,43,226,0.15) 0%, transparent 70%), radial-gradient(ellipse at 80% 60%, rgba(0,227,253,0.08) 0%, transparent 50%)`
        }} />
      </div>

      {/* Sub-header */}
      <div className="relative z-10 w-full px-4 pt-safe pt-4 pb-2 flex items-center justify-between">
        <Link
          href="/"
          className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant active:scale-95 transition-transform"
          aria-label="Minimize Player"
        >
          <span className="material-symbols-outlined text-[20px]">keyboard_arrow_down</span>
        </Link>
        <div className="flex flex-col items-center text-center">
          <span className="font-mono-space text-[10px] text-secondary-fixed tracking-widest uppercase">Playing from Cassette Archive</span>
          <span className="font-sans text-title-md text-primary font-medium tracking-tight">90s Time Machine • {currentSong.year}</span>
        </div>
        <button
          className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant active:scale-95 transition-transform relative"
          aria-label="Open Queue"
        >
          <span className="material-symbols-outlined text-[20px]">queue_music</span>
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-secondary-fixed shadow-[0_0_8px_#9cf0ff]" />
        </button>
      </div>

      {/* Audio fidelity pill */}
      <div className="relative z-10 flex justify-center px-4 mb-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-lowest/80 backdrop-blur-md shadow-[0_2px_12px_rgba(0,0,0,0.6)]">
          <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-ping" />
          <span className="font-mono-space text-[10px] text-secondary-fixed tracking-wider uppercase">
            Lossless Master • 24-Bit / 96kHz Analog Tape
          </span>
          <span className="px-1.5 py-0.5 rounded bg-tertiary-container/40 text-tertiary-fixed font-mono-space text-[9px] uppercase tracking-wider ml-1">
            Dolby B-NR
          </span>
        </div>
      </div>

      {/* Main content grid: 1 col on mobile, 2 cols on desktop/tablet */}
      <div className="relative z-10 w-full max-w-md md:max-w-5xl mx-auto px-4 my-auto md:grid md:grid-cols-2 md:gap-10 md:items-center">
        {/* Left Column: Deck & Mode Switch */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative w-full max-w-sm mx-auto my-2 flex flex-col items-center justify-center min-h-[300px] sm:min-h-[330px]">
            {/* Ambient halos */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-64 h-64 rounded-full bg-primary-container/25 blur-3xl mix-blend-screen animate-pulse" />
              <div className="w-56 h-56 rounded-full bg-secondary-fixed-dim/20 blur-2xl mix-blend-screen ml-8" />
            </div>

            {deckMode === 'vinyl' ? (
              <VinylDisc
                coverSrc={currentSong.coverSrc}
                label={currentSong.title}
                filmLabel={currentSong.filmLabel}
                playing={isPlaying}
              />
            ) : (
              <CassetteDeck title={currentSong.title} playing={isPlaying} />
            )}
          </div>

          {/* Quick Deck Switcher under deck */}
          <div className="hidden md:flex items-center justify-center gap-3 mt-4">
            <button
              onClick={toggleDeckMode}
              className="px-4 py-2 rounded-full bg-surface-container-high hover:bg-surface-bright flex items-center gap-2 transition-all text-on-surface active:scale-95 shadow-md"
            >
              <span className="material-symbols-outlined text-[18px] text-secondary">
                {deckMode === 'vinyl' ? 'mobile_share_stack' : 'album'}
              </span>
              <span className="font-mono-space text-[11px] text-secondary-fixed uppercase tracking-wider">
                Switch to {deckMode === 'vinyl' ? 'Tape Deck' : 'Turntable'}
              </span>
            </button>
          </div>
        </div>

        {/* Right Column: Metadata, Lyrics, Visualizer, Progress, Transport Controls, Hardware */}
        <div className="flex flex-col w-full">
          {/* Song metadata */}
          <div className="w-full px-2 mt-2 flex items-start justify-between">
            <div className="flex flex-col min-w-0 pr-3">
              <div className="flex items-center gap-2">
                <h2 className="font-playfair text-headline-lg-mobile md:text-headline-lg text-on-surface font-semibold tracking-tight truncate">
                  {currentSong.title}
                </h2>
                <span className="px-1.5 py-0.5 rounded bg-primary-container/30 text-primary-fixed-dim font-mono-space text-[9px] uppercase font-bold tracking-wider flex-shrink-0">
                  Hi-Fi
                </span>
              </div>
              <p className="font-sans text-body-lg text-on-surface-variant truncate mt-0.5">{currentSong.artist}</p>
              <div className="flex items-center gap-2 mt-1 text-on-surface-variant">
                <span className="font-sans text-body-sm text-secondary-fixed">{currentSong.album}</span>
                <span className="text-[10px]">•</span>
                <span className="font-mono-space text-[11px]">{currentSong.composer}</span>
              </div>
            </div>
            <FavoriteButton songId={currentSong.id} size="lg" />
          </div>

          {/* Lyrics teaser */}
          <div className="w-full px-2 my-2.5">
            <div className="w-full p-3 rounded-xl bg-surface-container-low/90 backdrop-blur-md flex items-center justify-between gap-3 shadow-sm cursor-pointer hover:bg-surface-container transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-primary-container/40 flex items-center justify-center text-primary flex-shrink-0">
                  <span className="material-symbols-outlined text-[16px]">format_quote</span>
                </div>
                <p className="font-sans text-body-md text-primary italic truncate">
                  {currentSong.lyrics}
                </p>
              </div>
              <div className="flex items-center gap-1 text-secondary-fixed flex-shrink-0">
                <span className="font-mono-space text-[10px] uppercase">Lyrics</span>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </div>
            </div>
          </div>

          {/* Audio Visualizer */}
          <div className="w-full px-2 mb-2.5">
            <AudioVisualizer />
          </div>

          {/* Progress bar */}
          <div className="w-full px-2 mb-2">
            <ProgressBar onSeek={handleSeek} />
          </div>

          {/* Transport controls */}
          <div className="w-full px-1 my-1">
            <TransportControls />
          </div>

          {/* Bottom hardware rack */}
          <div className="w-full px-2 mt-2 pb-16 md:pb-4">
            <div className="w-full p-3 rounded-2xl bg-surface-container-low/95 backdrop-blur-xl shadow-xl flex flex-col gap-3">
              {/* Deck mode toggle (mobile only) */}
              <div className="flex items-center justify-between md:hidden">
                <button
                  onClick={toggleDeckMode}
                  className="px-3 py-1.5 rounded-full bg-surface-container-high hover:bg-surface-bright flex items-center gap-1.5 transition-all text-on-surface active:scale-95"
                >
                  <span className="material-symbols-outlined text-[18px] text-secondary">
                    {deckMode === 'vinyl' ? 'mobile_share_stack' : 'album'}
                  </span>
                  <span className="font-mono-space text-[10px] text-secondary-fixed uppercase tracking-wider">
                    Switch to {deckMode === 'vinyl' ? 'Tape Deck' : 'Turntable'}
                  </span>
                </button>
                <div className="flex items-center gap-1.5">
                  <button className="px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant font-mono-space text-[11px] hover:text-primary flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">tune</span>
                    WARM TUBE EQ
                  </button>
                </div>
              </div>

              {/* Volume */}
              <VolumeControl />

              {/* Quick actions */}
              <div className="flex items-center justify-between pt-1 text-on-surface-variant font-mono-space text-[10px]">
                <div className="flex items-center gap-1 text-secondary-fixed">
                  <span className="material-symbols-outlined text-[16px]">spatial_audio_off</span>
                  <span>Nostalgia Tube 3D</span>
                </div>
                <div className="flex items-center gap-3">
                  <button className="hover:text-primary transition-colors flex items-center gap-1" aria-label="Audio output">
                    <span className="material-symbols-outlined text-[18px]">devices</span>
                    <span className="text-[10px]">Studio Mon</span>
                  </button>
                  <button className="hover:text-tertiary transition-colors" aria-label="Track info">
                    <span className="material-symbols-outlined text-[18px]">info</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
