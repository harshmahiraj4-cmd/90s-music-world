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
    console.log('[AudioEngine] Creating HTMLAudioElement singleton');
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
    console.log('[AudioEngine] Web Audio API analyzer connected');
  } catch (err) {
    console.warn('[AudioEngine] Web Audio API analyzer skipped, direct audio output active:', err);
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

  const lastLoadedSrcRef = useRef<string>('');

  // 1. Initialize HTML5 Audio Element & Event Listeners once
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const el = getOrCreateAudioElement();
    if (!el) return;

    if (!listenersAttached) {
      listenersAttached = true;
      console.log('[AudioEngine] Attaching HTML5 audio event listeners');

      // 1. loadedmetadata
      const handleLoadedMetadata = () => {
        console.log('[AudioEngine Event] loadedmetadata fired. Duration:', el.duration);
        if (el.duration && !isNaN(el.duration)) {
          setDuration(el.duration);
        }
      };

      // 2. canplay
      const handleCanPlay = () => {
        console.log('[AudioEngine Event] canplay fired. ReadyState:', el.readyState);
      };

      // 3. play
      const handlePlay = () => {
        console.log('[AudioEngine Event] play fired');
        setIsPlaying(true);
      };

      // 4. pause
      const handlePause = () => {
        console.log('[AudioEngine Event] pause fired');
        setIsPlaying(false);
      };

      // 5. ended
      const handleEnded = () => {
        console.log('[AudioEngine Event] ended fired. RepeatMode:', repeatModeRef.current);
        if (repeatModeRef.current === 'one') {
          el.currentTime = 0;
          el.play().catch((err) => {
            console.error('[AudioEngine] Repeat play rejected:', err);
          });
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
              errorName = 'MEDIA_ERR_ABORTED (Playback aborted by user)';
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

  // 2. Coordinated Audio Execution Flow:
  // Updates src -> calls load() -> calls play() or pause()
  useEffect(() => {
    const el = getOrCreateAudioElement();
    if (!el || !currentSong) return;

    const rawSrc = currentSong.audioSrc;
    const resolvedSrc = new URL(rawSrc, window.location.href).href;
    const isNewSong = lastLoadedSrcRef.current !== resolvedSrc;

    if (isNewSong) {
      lastLoadedSrcRef.current = resolvedSrc;
      console.log(`[AudioEngine] 1. Setting audio.src = ${rawSrc}`);
      el.src = rawSrc;

      console.log('[AudioEngine] 2. Calling audio.load()');
      el.load();

      // Ensure Web Audio analyser is attached
      initAudioEngine(el);
      const ctx = getAudioContext();
      if (ctx && ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
    }

    // Playback state control
    if (isPlaying) {
      const ctx = getAudioContext();
      if (ctx && ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }

      console.log('[AudioEngine] 3. Calling audio.play() for:', currentSong.title);
      const playPromise = el.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('[AudioEngine] audio.play() Promise RESOLVED successfully');
          })
          .catch((err: DOMException) => {
            if (err.name === 'AbortError') {
              console.log('[AudioEngine] play() aborted by subsequent load request (skipping)');
              return;
            }
            console.error(
              `AUDIO LOAD ERROR\nSong Title: ${currentSong.title}\nAudio URL: ${el.src}\nBrowser Error/Code: ${err.name} - ${err.message}`
            );
            setIsPlaying(false);
          });
      }
    } else {
      if (!el.paused) {
        console.log('[AudioEngine] Calling audio.pause() for:', currentSong.title);
        el.pause();
      }
    }
  }, [currentSong, isPlaying, setIsPlaying]);

  // 3. Volume and Mute control
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
