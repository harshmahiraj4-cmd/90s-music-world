'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useMusicStore } from '@/lib/musicStore';

let audioCtx: AudioContext | null = null;
let analyser: AnalyserNode | null = null;
let sourceNode: MediaElementAudioSourceNode | null = null;
let audioEl: HTMLAudioElement | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  return audioCtx;
}

export function getOrCreateAudioElement(): HTMLAudioElement {
  if (!audioEl && typeof window !== 'undefined') {
    audioEl = new Audio();
    audioEl.crossOrigin = 'anonymous';
    audioEl.preload = 'metadata';
  }
  return audioEl!;
}

export function getAnalyser(): AnalyserNode | null {
  return analyser;
}

export function initAudioEngine(el: HTMLAudioElement) {
  if (sourceNode) return; // Already initialized
  const ctx = getAudioContext();
  sourceNode = ctx.createMediaElementSource(el);
  analyser = ctx.createAnalyser();
  analyser.fftSize = 256;
  analyser.smoothingTimeConstant = 0.8;
  sourceNode.connect(analyser);
  analyser.connect(ctx.destination);
}

export function useAudioEngine() {
  const {
    currentSong,
    isPlaying,
    volume,
    isMuted,
    repeatMode,
    seekTo,
    setProgress,
    setDuration,
    setIsPlaying,
    next,
  } = useMusicStore();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isSeeking = useRef(false);

  // Initialize audio element once
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const el = getOrCreateAudioElement();
    audioRef.current = el;

    const handleTimeUpdate = () => {
      if (!isSeeking.current && el.duration) {
        setProgress(el.currentTime / el.duration, el.currentTime);
      }
    };
    const handleDurationChange = () => {
      if (el.duration && !isNaN(el.duration)) {
        setDuration(el.duration);
      }
    };
    const handleEnded = () => {
      if (repeatMode === 'one') {
        el.currentTime = 0;
        el.play().catch(() => {});
      } else {
        next();
      }
    };
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    el.addEventListener('timeupdate', handleTimeUpdate);
    el.addEventListener('durationchange', handleDurationChange);
    el.addEventListener('ended', handleEnded);
    el.addEventListener('play', handlePlay);
    el.addEventListener('pause', handlePause);

    return () => {
      el.removeEventListener('timeupdate', handleTimeUpdate);
      el.removeEventListener('durationchange', handleDurationChange);
      el.removeEventListener('ended', handleEnded);
      el.removeEventListener('play', handlePlay);
      el.removeEventListener('pause', handlePause);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repeatMode]);

  // Load new song when currentSong changes
  useEffect(() => {
    const el = audioRef.current;
    if (!el || !currentSong) return;

    const src = currentSong.audioSrc;
    if (el.src !== window.location.origin + src && el.src !== src) {
      el.src = src;
      el.load();
    }

    // Initialize Web Audio API engine
    try {
      initAudioEngine(el);
      const ctx = getAudioContext();
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
    } catch {
      // Safari or restricted environment
    }
  }, [currentSong]);

  // Play / pause
  useEffect(() => {
    const el = audioRef.current;
    if (!el || !currentSong) return;

    if (isPlaying) {
      const ctx = getAudioContext();
      if (ctx.state === 'suspended') ctx.resume().catch(() => {});
      el.play().catch((err) => {
        // File not found - show graceful error, don't crash
        if (err.name === 'NotSupportedError' || err.name === 'NotAllowedError') {
          setIsPlaying(false);
        }
      });
    } else {
      el.pause();
    }
  }, [isPlaying, currentSong, setIsPlaying]);

  // Volume
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    el.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  // Seek
  const handleSeek = useCallback(
    (progress: number) => {
      const el = audioRef.current;
      if (!el || !el.duration) return;
      isSeeking.current = true;
      el.currentTime = progress * el.duration;
      seekTo(progress);
      setTimeout(() => {
        isSeeking.current = false;
      }, 100);
    },
    [seekTo]
  );

  return { handleSeek, audioRef };
}
