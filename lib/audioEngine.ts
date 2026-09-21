'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useMusicStore } from '@/lib/musicStore';

let audioCtx: AudioContext | null = null;
let analyser: AnalyserNode | null = null;
let sourceNode: MediaElementAudioSourceNode | null = null;
let audioEl: HTMLAudioElement | null = null;
let isSeeking = false;
let listenersAttached = false;

export function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioCtxClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioCtxClass) {
      audioCtx = new AudioCtxClass();
    }
  }
  return audioCtx;
}

export function getOrCreateAudioElement(): HTMLAudioElement | null {
  if (typeof window === 'undefined') return null;
  if (!audioEl) {
    audioEl = new Audio();
    audioEl.preload = 'metadata';
  }
  return audioEl;
}

export function getAnalyser(): AnalyserNode | null {
  return analyser;
}

export function initAudioEngine(el: HTMLAudioElement) {
  if (sourceNode || typeof window === 'undefined') return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    sourceNode = ctx.createMediaElementSource(el);
    analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.8;
    sourceNode.connect(analyser);
    analyser.connect(ctx.destination);
  } catch (err) {
    // If Web Audio routing is restricted or fails (e.g. CORS on audio element),
    // let HTML5 audio play directly to output rather than failing silently
    console.warn('AudioAnalyser init skipped, falling back to direct audio output:', err);
  }
}

export function seekAudio(progress: number) {
  const el = getOrCreateAudioElement();
  if (!el) return;
  const duration = el.duration || useMusicStore.getState().duration || 0;
  if (duration && !isNaN(duration)) {
    isSeeking = true;
    el.currentTime = progress * duration;
    useMusicStore.getState().seekTo(progress);
    setTimeout(() => {
      isSeeking = false;
    }, 150);
  } else {
    useMusicStore.getState().seekTo(progress);
  }
}

export function useAudioEngine() {
  const {
    currentSong,
    isPlaying,
    volume,
    isMuted,
    repeatMode,
    setProgress,
    setDuration,
    setIsPlaying,
    next,
  } = useMusicStore();

  const currentSongRef = useRef(currentSong);
  currentSongRef.current = currentSong;

  const repeatModeRef = useRef(repeatMode);
  repeatModeRef.current = repeatMode;

  // Initialize HTML5 Audio Element and its Event Listeners once
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const el = getOrCreateAudioElement();
    if (!el) return;

    if (!listenersAttached) {
      listenersAttached = true;

      // 1. loadedmetadata
      const handleLoadedMetadata = () => {
        if (el.duration && !isNaN(el.duration)) {
          setDuration(el.duration);
        }
      };

      // 2. canplay
      const handleCanPlay = () => {
        const state = useMusicStore.getState();
        if (state.isPlaying && el.paused) {
          el.play().catch((err: DOMException) => {
            if (err.name !== 'AbortError') {
              console.error(
                `AUDIO LOAD ERROR\nSong Title: ${currentSongRef.current?.title || 'Unknown'}\nAudio URL: ${el.src}\nBrowser Error: ${err.name} - ${err.message}`
              );
              setIsPlaying(false);
            }
          });
        }
      };

      // 3. play
      const handlePlay = () => {
        setIsPlaying(true);
      };

      // 4. pause
      const handlePause = () => {
        setIsPlaying(false);
      };

      // 5. ended
      const handleEnded = () => {
        if (repeatModeRef.current === 'one') {
          el.currentTime = 0;
          el.play().catch(() => {});
        } else {
          next();
        }
      };

      // 6. error
      const handleError = () => {
        const song = currentSongRef.current;
        const err = el.error;
        let errorCode = 0;
        let errorName = 'UNKNOWN_ERROR';

        if (err) {
          errorCode = err.code;
          switch (err.code) {
            case MediaError.MEDIA_ERR_ABORTED:
              errorName = 'MEDIA_ERR_ABORTED (User aborted audio playback)';
              break;
            case MediaError.MEDIA_ERR_NETWORK:
              errorName = 'MEDIA_ERR_NETWORK (Network error downloading audio)';
              break;
            case MediaError.MEDIA_ERR_DECODE:
              errorName = 'MEDIA_ERR_DECODE (Failed decoding audio track)';
              break;
            case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
              errorName = 'MEDIA_ERR_SRC_NOT_SUPPORTED (404 Not Found or unsupported audio format)';
              break;
            default:
              errorName = `Code ${err.code}: ${err.message || 'Unknown error'}`;
          }
        }

        console.error(
          `AUDIO LOAD ERROR\nSong Title: ${song?.title || 'Unknown'}\nAudio URL: ${el.src || song?.audioSrc}\nBrowser Error/Code: [${errorCode}] ${errorName}`
        );

        setIsPlaying(false);
      };

      // 7. timeupdate
      const handleTimeUpdate = () => {
        if (!isSeeking && el.duration && !isNaN(el.duration)) {
          setProgress(el.currentTime / el.duration, el.currentTime);
        }
      };

      el.addEventListener('loadedmetadata', handleLoadedMetadata);
      el.addEventListener('canplay', handleCanPlay);
      el.addEventListener('play', handlePlay);
      el.addEventListener('pause', handlePause);
      el.addEventListener('ended', handleEnded);
      el.addEventListener('error', handleError);
      el.addEventListener('timeupdate', handleTimeUpdate);
    }
  }, [setDuration, setIsPlaying, setProgress, next]);

  // Handle song source changes
  useEffect(() => {
    const el = getOrCreateAudioElement();
    if (!el || !currentSong) return;

    const rawSrc = currentSong.audioSrc;
    // Normalize path to absolute URL for accurate comparison
    const resolvedSrc = new URL(rawSrc, window.location.href).href;

    if (el.src !== resolvedSrc) {
      el.src = rawSrc;
      el.load();

      // Initialize Web Audio API node on first play
      initAudioEngine(el);
      const ctx = getAudioContext();
      if (ctx && ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }

      if (isPlaying) {
        const playPromise = el.play();
        if (playPromise !== undefined) {
          playPromise.catch((err: DOMException) => {
            if (err.name !== 'AbortError') {
              console.error(
                `AUDIO LOAD ERROR\nSong Title: ${currentSong.title}\nAudio URL: ${el.src}\nBrowser Error: ${err.name} - ${err.message}`
              );
              setIsPlaying(false);
            }
          });
        }
      }
    }
  }, [currentSong, isPlaying, setIsPlaying]);

  // Handle Play / Pause commands
  useEffect(() => {
    const el = getOrCreateAudioElement();
    if (!el || !currentSong) return;

    if (isPlaying) {
      const ctx = getAudioContext();
      if (ctx && ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }

      if (el.paused) {
        const playPromise = el.play();
        if (playPromise !== undefined) {
          playPromise.catch((err: DOMException) => {
            if (err.name !== 'AbortError') {
              console.error(
                `AUDIO LOAD ERROR\nSong Title: ${currentSong.title}\nAudio URL: ${el.src}\nBrowser Error: ${err.name} - ${err.message}`
              );
              setIsPlaying(false);
            }
          });
        }
      }
    } else {
      if (!el.paused) {
        el.pause();
      }
    }
  }, [isPlaying, currentSong, setIsPlaying]);

  // Handle Volume & Mute
  useEffect(() => {
    const el = getOrCreateAudioElement();
    if (!el) return;
    el.volume = isMuted ? 0 : Math.max(0, Math.min(1, volume));
  }, [volume, isMuted]);

  const handleSeek = useCallback((progress: number) => {
    seekAudio(progress);
  }, []);

  return { handleSeek };
}
