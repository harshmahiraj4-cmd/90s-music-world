"use client";

import Image from "next/image";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { EXPERIENCE_SECTIONS, YEARS, songs } from "@/app/data/musicLibrary";
import { Playlist, RepeatMode, Song } from "@/app/types/music";

const FAVORITES_KEY = "nineties:favorites";
const RECENTLY_PLAYED_KEY = "nineties:recently-played";
const PLAYLISTS_KEY = "nineties:playlists";
const PREFERENCES_KEY = "nineties:preferences";

type PlayerPreferences = {
  volume: number;
  shuffle: boolean;
  repeat: RepeatMode;
};

const defaultPreferences: PlayerPreferences = {
  volume: 0.7,
  shuffle: false,
  repeat: "off",
};

function readFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function formatTime(totalSeconds: number) {
  if (!Number.isFinite(totalSeconds)) return "0:00";
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function gradientsForTrack(track: Song) {
  const palette = [
    "from-purple-950 via-black to-blue-950",
    "from-indigo-950 via-black to-fuchsia-900",
    "from-slate-950 via-black to-violet-950",
    "from-black via-indigo-950 to-cyan-950",
  ];
  const index = Number(track.id.split("-")[1]) % palette.length;
  return palette[index];
}

export default function MusicWorldApp() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [yearFilter, setYearFilter] = useState<number | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showNowPlaying, setShowNowPlaying] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() => readFromStorage<string[]>(FAVORITES_KEY, []));
  const [recentlyPlayed, setRecentlyPlayed] = useState<string[]>(() =>
    readFromStorage<string[]>(RECENTLY_PLAYED_KEY, []),
  );
  const [playlists, setPlaylists] = useState<Playlist[]>(() => readFromStorage<Playlist[]>(PLAYLISTS_KEY, []));
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [volume, setVolume] = useState(() => readFromStorage<PlayerPreferences>(PREFERENCES_KEY, defaultPreferences).volume);
  const [shuffle, setShuffle] = useState(() => readFromStorage<PlayerPreferences>(PREFERENCES_KEY, defaultPreferences).shuffle);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>(
    () => readFromStorage<PlayerPreferences>(PREFERENCES_KEY, defaultPreferences).repeat,
  );
  const [visualizerBars, setVisualizerBars] = useState<number[]>(Array.from({ length: 18 }, () => 10));
  const [audioStatus, setAudioStatus] = useState<Record<string, boolean>>({});
  const [statusMessage, setStatusMessage] = useState("Load royalty-free songs into /public/audio to unlock playback.");

  const currentTrack = songs[currentIndex];

  const trackLookup = useMemo(() => {
    return Object.fromEntries(songs.map((song) => [song.id, song]));
  }, []);

  useEffect(() => {
    window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    window.localStorage.setItem(RECENTLY_PLAYED_KEY, JSON.stringify(recentlyPlayed));
  }, [recentlyPlayed]);

  useEffect(() => {
    window.localStorage.setItem(PLAYLISTS_KEY, JSON.stringify(playlists));
  }, [playlists]);

  useEffect(() => {
    window.localStorage.setItem(
      PREFERENCES_KEY,
      JSON.stringify({ volume, shuffle, repeat: repeatMode } satisfies PlayerPreferences),
    );
  }, [volume, shuffle, repeatMode]);

  useEffect(() => {
    const audio = new Audio();
    audio.preload = "metadata";
    audio.volume = volume;
    audioRef.current = audio;

    const onTimeUpdate = () => {
      setProgress(audio.currentTime);
      setDuration(audio.duration || 0);
    };

    const onLoaded = () => {
      setDuration(audio.duration || 0);
      setStatusMessage(`Ready: ${currentTrack.title}`);
    };

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    const onEnded = () => {
      if (repeatMode === "one") {
        audio.currentTime = 0;
        void audio.play();
        return;
      }
      nextTrack();
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
      audioRef.current = null;
      sourceNodeRef.current?.disconnect();
      analyserRef.current?.disconnect();
      audioContextRef.current?.close().catch(() => undefined);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (!isPlaying || !analyserRef.current) return;

    let frame = 0;
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);

    const animate = () => {
      analyserRef.current?.getByteFrequencyData(dataArray);
      const bars = Array.from({ length: 18 }, (_, idx) => {
        const value = dataArray[idx * 2] || 0;
        return Math.max(8, Math.round((value / 255) * 100));
      });
      setVisualizerBars(bars);
      frame = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(frame);
  }, [isPlaying]);

  const filteredByYear = useMemo(() => {
    if (yearFilter === "all") return songs;
    return songs.filter((track) => track.year === yearFilter);
  }, [yearFilter]);

  const searchResults = useMemo(() => {
    const term = searchQuery.trim().toLowerCase();
    if (!term) return [];

    return songs.filter((track) => {
      return (
        track.title.toLowerCase().includes(term) ||
        track.artist.toLowerCase().includes(term) ||
        track.album.toLowerCase().includes(term) ||
        track.genre.toLowerCase().includes(term)
      );
    });
  }, [searchQuery]);

  const sectionSongs = useMemo(() => {
    return EXPERIENCE_SECTIONS.map((section) => ({
      section,
      tracks: songs.filter((song) => song.categories.includes(section)),
    }));
  }, []);

  const queue = useMemo(() => {
    const remaining = songs.filter((_, idx) => idx !== currentIndex);
    return [songs[currentIndex], ...remaining];
  }, [currentIndex]);

  const recentlyPlayedTracks = useMemo(
    () => recentlyPlayed.map((songId) => trackLookup[songId]).filter(Boolean),
    [recentlyPlayed, trackLookup],
  );

  const favoriteTracks = useMemo(
    () => favorites.map((songId) => trackLookup[songId]).filter(Boolean),
    [favorites, trackLookup],
  );

  const cycleRepeat = () => {
    setRepeatMode((prev) => (prev === "off" ? "all" : prev === "all" ? "one" : "off"));
  };

  const ensureAudioPipeline = () => {
    if (!audioRef.current) return;
    if (!audioContextRef.current) {
      audioContextRef.current = new window.AudioContext();
    }

    if (!sourceNodeRef.current) {
      sourceNodeRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 64;
      sourceNodeRef.current.connect(analyserRef.current);
      analyserRef.current.connect(audioContextRef.current.destination);
    }
  };

  const canPlayTrack = async (track: Song) => {
    if (audioStatus[track.id] === false) return false;
    if (audioStatus[track.id] === true) return true;

    try {
      const response = await fetch(track.audioSrc, { method: "HEAD" });
      const available = response.ok;
      setAudioStatus((prev) => ({ ...prev, [track.id]: available }));
      return available;
    } catch {
      setAudioStatus((prev) => ({ ...prev, [track.id]: false }));
      return false;
    }
  };

  const updateRecentlyPlayed = (songId: string) => {
    setRecentlyPlayed((prev) => [songId, ...prev.filter((id) => id !== songId)].slice(0, 10));
  };

  const playTrack = async (index: number) => {
    const track = songs[index];
    if (!audioRef.current) return;

    const available = await canPlayTrack(track);
    setCurrentIndex(index);
    if (!available) {
      setIsPlaying(false);
      setStatusMessage(`${track.title} is unavailable. Add ${track.audioSrc} in /public/audio.`);
      return;
    }

    ensureAudioPipeline();
    await audioContextRef.current?.resume();

    if (audioRef.current.src !== `${window.location.origin}${track.audioSrc}`) {
      audioRef.current.src = track.audioSrc;
      audioRef.current.load();
    }

    try {
      await audioRef.current.play();
      updateRecentlyPlayed(track.id);
      setStatusMessage(`Now Playing: ${track.title}`);
    } catch {
      setStatusMessage("Playback was blocked by browser settings. Interact and try again.");
      setIsPlaying(false);
    }
  };

  const togglePlay = async () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      return;
    }

    await playTrack(currentIndex);
  };

  function nextTrack() {
    if (shuffle) {
      const randomIndex = Math.floor(Math.random() * songs.length);
      void playTrack(randomIndex);
      return;
    }

    if (currentIndex < songs.length - 1) {
      void playTrack(currentIndex + 1);
      return;
    }

    if (repeatMode === "all") {
      void playTrack(0);
      return;
    }

    setIsPlaying(false);
    audioRef.current?.pause();
  }

  function previousTrack() {
    if (audioRef.current && audioRef.current.currentTime > 5) {
      audioRef.current.currentTime = 0;
      return;
    }

    const prevIndex = currentIndex === 0 ? songs.length - 1 : currentIndex - 1;
    void playTrack(prevIndex);
  }

  const seekTrack = (value: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = value;
    setProgress(value);
  };

  const toggleFavorite = (songId: string) => {
    setFavorites((prev) =>
      prev.includes(songId) ? prev.filter((id) => id !== songId) : [...prev, songId],
    );
  };

  const createPlaylist = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = newPlaylistName.trim();
    if (!name) return;

    setPlaylists((prev) => (prev.some((playlist) => playlist.name === name) ? prev : [...prev, { name, songIds: [] }]));
    setNewPlaylistName("");
  };

  const addToPlaylist = (playlistName: string, songId: string) => {
    setPlaylists((prev) =>
      prev.map((playlist) => {
        if (playlist.name !== playlistName || playlist.songIds.includes(songId)) return playlist;
        return { ...playlist, songIds: [...playlist.songIds, songId] };
      }),
    );
  };

  return (
    <div className={`min-h-screen bg-gradient-to-b ${gradientsForTrack(currentTrack)} text-slate-100 pb-44`}>
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-35">
        {Array.from({ length: 20 }, (_, idx) => (
          <span
            key={idx}
            className="particle"
            style={{
              left: `${(idx * 13) % 100}%`,
              animationDelay: `${idx * 0.35}s`,
              animationDuration: `${6 + (idx % 7)}s`,
            }}
          />
        ))}
      </div>

      <main className="relative z-10 px-4 md:px-8 lg:px-12 py-6 space-y-10 max-w-[1400px] mx-auto">
        <section className="hero-panel min-h-[82vh] flex flex-col justify-center gap-6 p-8 md:p-14 rounded-3xl border border-white/15">
          <p className="text-cyan-300 uppercase tracking-[0.25em] text-xs">Cinematic full-screen hero</p>
          <h1 className="text-4xl md:text-7xl font-black max-w-4xl leading-tight">
            90s Music World
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-cyan-300">
              Spotify meets a cinematic 90s time machine
            </span>
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl">
            Relive iconic Bollywood, Punjabi classics and evergreen romance with neon vibes, glassmorphism and real HTML5 audio playback.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => void playTrack(currentIndex)}
              className="rounded-full bg-cyan-400 text-black font-bold px-6 py-3 hover:bg-cyan-300 transition"
            >
              ▶ Start Listening
            </button>
            <button
              onClick={() => setShowNowPlaying(true)}
              className="rounded-full border border-violet-400 text-violet-200 px-6 py-3 hover:bg-violet-500/20 transition"
            >
              Open Now Playing
            </button>
          </div>
        </section>

        <section className="glass-card p-6 rounded-2xl border border-white/10">
          <h2 className="text-2xl font-bold mb-4">90s Time Machine (1990–1999)</h2>
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setYearFilter("all")}
              className={`px-4 py-2 rounded-full text-sm ${yearFilter === "all" ? "bg-violet-500" : "bg-white/10 hover:bg-white/20"}`}
            >
              All Years
            </button>
            {YEARS.map((year) => (
              <button
                key={year}
                onClick={() => setYearFilter(year)}
                className={`px-4 py-2 rounded-full text-sm ${yearFilter === year ? "bg-cyan-500 text-black" : "bg-white/10 hover:bg-white/20"}`}
              >
                {year}
              </button>
            ))}
          </div>
          <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredByYear.slice(0, 8).map((track) => (
              <TrackCard
                key={track.id}
                track={track}
                isActive={track.id === currentTrack.id}
                isFavorite={favorites.includes(track.id)}
                onPlay={() => void playTrack(songs.findIndex((song) => song.id === track.id))}
                onFavorite={() => toggleFavorite(track.id)}
              />
            ))}
          </div>
        </section>

        <section className="glass-card p-6 rounded-2xl border border-white/10">
          <h2 className="text-2xl font-bold mb-3">Search Experience</h2>
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search songs, artists, albums, moods..."
            className="w-full bg-black/45 border border-white/20 rounded-xl px-4 py-3 outline-none focus:border-cyan-400"
          />
          {searchQuery && (
            <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.length > 0 ? (
                searchResults.map((track) => (
                  <TrackCard
                    key={`search-${track.id}`}
                    track={track}
                    isActive={track.id === currentTrack.id}
                    isFavorite={favorites.includes(track.id)}
                    onPlay={() => void playTrack(songs.findIndex((song) => song.id === track.id))}
                    onFavorite={() => toggleFavorite(track.id)}
                  />
                ))
              ) : (
                <p className="text-slate-300">No matching tracks found.</p>
              )}
            </div>
          )}
        </section>

        {sectionSongs.map(({ section, tracks }) => (
          <section key={section} className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">{section}</h2>
              <span className="text-sm text-cyan-300">{tracks.length} tracks</span>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 snap-x">
              {tracks.map((track) => (
                <div key={`${section}-${track.id}`} className="min-w-[260px] snap-start">
                  <TrackCard
                    track={track}
                    isActive={track.id === currentTrack.id}
                    isFavorite={favorites.includes(track.id)}
                    onPlay={() => void playTrack(songs.findIndex((song) => song.id === track.id))}
                    onFavorite={() => toggleFavorite(track.id)}
                  />
                </div>
              ))}
            </div>
          </section>
        ))}

        <section className="grid lg:grid-cols-3 gap-4">
          <div className="glass-card p-5 rounded-2xl border border-white/10">
            <h2 className="text-xl font-bold mb-3">Recently Played</h2>
            <TrackList
              tracks={recentlyPlayedTracks}
              currentTrackId={currentTrack.id}
              onPlay={(track) => void playTrack(songs.findIndex((song) => song.id === track.id))}
            />
          </div>

          <div className="glass-card p-5 rounded-2xl border border-white/10">
            <h2 className="text-xl font-bold mb-3">Favorites</h2>
            <TrackList
              tracks={favoriteTracks}
              currentTrackId={currentTrack.id}
              onPlay={(track) => void playTrack(songs.findIndex((song) => song.id === track.id))}
            />
          </div>

          <div className="glass-card p-5 rounded-2xl border border-white/10">
            <h2 className="text-xl font-bold mb-3">User Playlists</h2>
            <form className="flex gap-2 mb-4" onSubmit={createPlaylist}>
              <input
                className="flex-1 bg-black/40 border border-white/20 rounded-lg px-3 py-2"
                value={newPlaylistName}
                onChange={(event) => setNewPlaylistName(event.target.value)}
                placeholder="Create playlist"
              />
              <button className="px-4 py-2 rounded-lg bg-violet-500 font-semibold" type="submit">
                Add
              </button>
            </form>
            <div className="space-y-3">
              {playlists.length === 0 && <p className="text-sm text-slate-300">No playlists yet. Create one above.</p>}
              {playlists.map((playlist) => (
                <div key={playlist.name} className="cassette-card rounded-xl p-3 border border-fuchsia-300/20">
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-semibold">{playlist.name}</p>
                    <button
                      className="text-xs px-2 py-1 rounded bg-white/10 hover:bg-white/20"
                      onClick={() => addToPlaylist(playlist.name, currentTrack.id)}
                      type="button"
                    >
                      + Current
                    </button>
                  </div>
                  <p className="text-xs text-slate-300">{playlist.songIds.length} songs</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <div className="fixed bottom-0 inset-x-0 z-30 border-t border-white/10 bg-black/70 backdrop-blur-2xl px-4 md:px-8 py-3">
        <div className="max-w-[1400px] mx-auto flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <button className="flex items-center gap-3 text-left" onClick={() => setShowNowPlaying(true)}>
              <Image src={currentTrack.artwork} alt={currentTrack.album} width={52} height={52} className="rounded-lg" />
              <div>
                <p className="font-semibold leading-tight">{currentTrack.title}</p>
                <p className="text-xs text-slate-300">{currentTrack.artist}</p>
              </div>
            </button>

            <div className="flex items-center gap-2">
              <button className="control-btn" onClick={() => setShuffle((prev) => !prev)}>{shuffle ? "🔀" : "↔"}</button>
              <button className="control-btn" onClick={previousTrack}>⏮</button>
              <button className="control-btn bg-cyan-400 text-black" onClick={() => void togglePlay()}>{isPlaying ? "⏸" : "▶"}</button>
              <button className="control-btn" onClick={nextTrack}>⏭</button>
              <button className="control-btn" onClick={cycleRepeat}>{repeatMode === "off" ? "🔁" : repeatMode === "all" ? "🔁 all" : "🔂"}</button>
            </div>

            <div className="hidden md:flex items-center gap-2 min-w-[220px]">
              <span className="text-xs">🔊</span>
              <input
                aria-label="Volume"
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={(event) => setVolume(Number(event.target.value))}
                className="w-full"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span>{formatTime(progress)}</span>
            <input
              aria-label="Seek"
              type="range"
              min={0}
              max={duration || 0}
              value={Math.min(progress, duration || 0)}
              onChange={(event) => seekTrack(Number(event.target.value))}
              className="w-full"
            />
            <span>{formatTime(duration)}</span>
          </div>
          <p className="text-xs text-cyan-300/90">{statusMessage}</p>
        </div>
      </div>

      {showNowPlaying && (
        <div className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl p-6 md:p-12 overflow-auto">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-[1.15fr_1fr] gap-8">
            <div className="glass-card rounded-3xl p-6 border border-white/15">
              <button onClick={() => setShowNowPlaying(false)} className="ml-auto mb-6 block rounded-full border border-white/20 px-4 py-1 text-sm hover:bg-white/10">
                Close
              </button>
              <Image src={currentTrack.artwork} alt={currentTrack.album} width={720} height={720} className="rounded-2xl w-full h-auto shadow-[0_0_60px_rgba(34,211,238,0.2)]" priority />
              <h2 className="text-3xl mt-6 font-black">{currentTrack.title}</h2>
              <p className="text-slate-300">{currentTrack.artist} • {currentTrack.album} • {currentTrack.year}</p>

              <div className="mt-5 flex gap-2 items-end h-24">
                {visualizerBars.map((bar, index) => (
                  <span key={index} style={{ height: `${bar}%` }} className="w-2 rounded-full bg-gradient-to-t from-violet-500 to-cyan-300 transition-all duration-100" />
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="glass-card rounded-2xl p-5 border border-white/10">
                <h3 className="text-xl font-bold mb-3">Queue</h3>
                <TrackList
                  tracks={queue}
                  currentTrackId={currentTrack.id}
                  onPlay={(track) => void playTrack(songs.findIndex((song) => song.id === track.id))}
                />
              </div>

              <div className="glass-card rounded-2xl p-5 border border-white/10">
                <h3 className="text-xl font-bold mb-3">Cassette Memories</h3>
                <p className="text-sm text-slate-300 mb-4">Collect songs in personal mixtapes and revisit your favorite moments from the 90s.</p>
                <div className="grid grid-cols-2 gap-3">
                  {playlists.slice(0, 4).map((playlist) => (
                    <div key={`np-${playlist.name}`} className="cassette-card p-3 rounded-xl border border-cyan-200/20">
                      <p className="font-semibold truncate">{playlist.name}</p>
                      <p className="text-xs text-slate-300">{playlist.songIds.length} tracks</p>
                    </div>
                  ))}
                  {playlists.length === 0 && <p className="text-sm text-slate-300">Create a playlist to see it here.</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TrackCard({
  track,
  isActive,
  isFavorite,
  onPlay,
  onFavorite,
}: {
  track: Song;
  isActive: boolean;
  isFavorite: boolean;
  onPlay: () => void;
  onFavorite: () => void;
}) {
  return (
    <article className={`glass-card rounded-2xl p-4 border ${isActive ? "border-cyan-300/70" : "border-white/10"}`}>
      <Image src={track.artwork} alt={track.album} width={400} height={400} className="rounded-xl w-full h-auto" />
      <div className="mt-3 space-y-1">
        <p className="font-semibold line-clamp-1">{track.title}</p>
        <p className="text-sm text-slate-300 line-clamp-1">{track.artist}</p>
        <p className="text-xs text-slate-400">{track.year} • {track.duration}</p>
      </div>
      <div className="mt-3 flex justify-between items-center">
        <button onClick={onPlay} className="rounded-full bg-cyan-400 text-black px-4 py-2 text-sm font-semibold hover:bg-cyan-300">
          ▶ Play
        </button>
        <button onClick={onFavorite} aria-label="Favorite" className="text-xl">{isFavorite ? "💜" : "🤍"}</button>
      </div>
    </article>
  );
}

function TrackList({
  tracks,
  currentTrackId,
  onPlay,
}: {
  tracks: Song[];
  currentTrackId: string;
  onPlay: (track: Song) => void;
}) {
  if (tracks.length === 0) {
    return <p className="text-sm text-slate-300">No tracks yet.</p>;
  }

  return (
    <ul className="space-y-2">
      {tracks.map((track) => (
        <li key={track.id}>
          <button
            className={`w-full text-left rounded-lg px-3 py-2 hover:bg-white/10 transition ${currentTrackId === track.id ? "bg-cyan-500/20" : "bg-black/30"}`}
            onClick={() => onPlay(track)}
          >
            <p className="font-medium line-clamp-1">{track.title}</p>
            <p className="text-xs text-slate-300 line-clamp-1">{track.artist}</p>
          </button>
        </li>
      ))}
    </ul>
  );
}
