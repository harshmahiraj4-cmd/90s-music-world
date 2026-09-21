'use client';

import { create } from 'zustand';
import { Song, SONGS } from '@/data/songs';
import { getFromStorage, saveToStorage } from '@/lib/localStorage';

export type RepeatMode = 'off' | 'one' | 'all';

interface MusicState {
  // Playback
  currentSong: Song | null;
  queue: Song[];
  isPlaying: boolean;
  progress: number; // 0-1
  currentTime: number; // seconds
  duration: number; // seconds
  volume: number; // 0-1
  isMuted: boolean;
  isShuffle: boolean;
  repeatMode: RepeatMode;

  // Library
  favorites: string[]; // song ids
  recentlyPlayed: string[]; // song ids (most recent first, max 20)
  playlists: Playlist[];

  // UI
  showMiniPlayer: boolean;
  deckMode: 'vinyl' | 'cassette';

  // Actions
  playSong: (song: Song, queue?: Song[]) => void;
  playPause: () => void;
  pause: () => void;
  play: () => void;
  next: () => void;
  prev: () => void;
  seekTo: (progress: number) => void;
  setVolume: (v: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  setRepeatMode: (m: RepeatMode) => void;
  setProgress: (p: number, currentTime: number) => void;
  setDuration: (d: number) => void;
  setIsPlaying: (v: boolean) => void;

  // Library
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  addRecentlyPlayed: (id: string) => void;
  addPlaylist: (name: string) => void;
  addToPlaylist: (playlistId: string, songId: string) => void;
  removeFromPlaylist: (playlistId: string, songId: string) => void;
  deletePlaylist: (playlistId: string) => void;

  // UI
  toggleDeckMode: () => void;
}

export interface Playlist {
  id: string;
  name: string;
  songIds: string[];
  createdAt: number;
}

const getNextIndex = (queue: Song[], currentId: string, shuffle: boolean): number => {
  const idx = queue.findIndex((s) => s.id === currentId);
  if (idx === -1) return 0;
  if (shuffle) {
    let next: number;
    do {
      next = Math.floor(Math.random() * queue.length);
    } while (next === idx && queue.length > 1);
    return next;
  }
  return (idx + 1) % queue.length;
};

const getPrevIndex = (queue: Song[], currentId: string): number => {
  const idx = queue.findIndex((s) => s.id === currentId);
  if (idx === -1) return 0;
  return (idx - 1 + queue.length) % queue.length;
};

export const useMusicStore = create<MusicState>((set, get) => ({
  currentSong: null,
  queue: SONGS,
  isPlaying: false,
  progress: 0,
  currentTime: 0,
  duration: 0,
  volume: getFromStorage<number>('volume', 0.8),
  isMuted: false,
  isShuffle: false,
  repeatMode: 'off',
  favorites: getFromStorage<string[]>('favorites', []),
  recentlyPlayed: getFromStorage<string[]>('recentlyPlayed', []),
  playlists: getFromStorage<Playlist[]>('playlists', []),
  showMiniPlayer: false,
  deckMode: 'vinyl',

  playSong: (song, queue) => {
    const newQueue = queue || get().queue;
    set({
      currentSong: song,
      queue: newQueue,
      isPlaying: true,
      progress: 0,
      currentTime: 0,
      showMiniPlayer: true,
    });
    get().addRecentlyPlayed(song.id);
  },

  playPause: () => {
    const { isPlaying } = get();
    set({ isPlaying: !isPlaying });
  },

  pause: () => set({ isPlaying: false }),
  play: () => set({ isPlaying: true }),

  next: () => {
    const { currentSong, queue, isShuffle, repeatMode } = get();
    if (!currentSong || queue.length === 0) return;
    if (repeatMode === 'one') {
      set({ progress: 0, currentTime: 0 });
      return;
    }
    const nextIdx = getNextIndex(queue, currentSong.id, isShuffle);
    const next = queue[nextIdx];
    set({ currentSong: next, progress: 0, currentTime: 0, isPlaying: true });
    get().addRecentlyPlayed(next.id);
  },

  prev: () => {
    const { currentSong, currentTime, queue } = get();
    if (!currentSong) return;
    // If more than 3 seconds in, restart; otherwise go to previous
    if (currentTime > 3) {
      set({ progress: 0, currentTime: 0 });
      return;
    }
    const prevIdx = getPrevIndex(queue, currentSong.id);
    const prev = queue[prevIdx];
    set({ currentSong: prev, progress: 0, currentTime: 0, isPlaying: true });
    get().addRecentlyPlayed(prev.id);
  },

  seekTo: (progress) => {
    const { duration } = get();
    set({ progress, currentTime: progress * duration });
  },

  setVolume: (v) => {
    set({ volume: v, isMuted: v === 0 });
    saveToStorage('volume', v);
  },

  toggleMute: () => {
    const { isMuted } = get();
    set({ isMuted: !isMuted });
  },

  toggleShuffle: () => {
    set((s) => ({ isShuffle: !s.isShuffle }));
  },

  setRepeatMode: (m) => set({ repeatMode: m }),

  setProgress: (p, currentTime) => set({ progress: p, currentTime }),

  setDuration: (d) => set({ duration: d }),

  setIsPlaying: (v) => set({ isPlaying: v }),

  toggleFavorite: (id) => {
    const { favorites } = get();
    const newFavs = favorites.includes(id)
      ? favorites.filter((f) => f !== id)
      : [...favorites, id];
    set({ favorites: newFavs });
    saveToStorage('favorites', newFavs);
  },

  isFavorite: (id) => get().favorites.includes(id),

  addRecentlyPlayed: (id) => {
    const { recentlyPlayed } = get();
    const filtered = recentlyPlayed.filter((r) => r !== id);
    const updated = [id, ...filtered].slice(0, 20);
    set({ recentlyPlayed: updated });
    saveToStorage('recentlyPlayed', updated);
  },

  addPlaylist: (name) => {
    const { playlists } = get();
    const newPl: Playlist = {
      id: `pl-${Date.now()}`,
      name,
      songIds: [],
      createdAt: Date.now(),
    };
    const updated = [...playlists, newPl];
    set({ playlists: updated });
    saveToStorage('playlists', updated);
  },

  addToPlaylist: (playlistId, songId) => {
    const { playlists } = get();
    const updated = playlists.map((pl) =>
      pl.id === playlistId && !pl.songIds.includes(songId)
        ? { ...pl, songIds: [...pl.songIds, songId] }
        : pl
    );
    set({ playlists: updated });
    saveToStorage('playlists', updated);
  },

  removeFromPlaylist: (playlistId, songId) => {
    const { playlists } = get();
    const updated = playlists.map((pl) =>
      pl.id === playlistId
        ? { ...pl, songIds: pl.songIds.filter((id) => id !== songId) }
        : pl
    );
    set({ playlists: updated });
    saveToStorage('playlists', updated);
  },

  deletePlaylist: (playlistId) => {
    const { playlists } = get();
    const updated = playlists.filter((pl) => pl.id !== playlistId);
    set({ playlists: updated });
    saveToStorage('playlists', updated);
  },

  toggleDeckMode: () => {
    set((s) => ({ deckMode: s.deckMode === 'vinyl' ? 'cassette' : 'vinyl' }));
  },
}));
