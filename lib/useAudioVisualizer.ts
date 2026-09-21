'use client';

import { useEffect, useRef, useState } from 'react';
import { getAnalyser } from '@/lib/audioEngine';
import { useMusicStore } from '@/lib/musicStore';

export function useAudioVisualizer(barCount = 16) {
  const [bars, setBars] = useState<number[]>(Array(barCount).fill(0.3));
  const animRef = useRef<number>(0);
  const isPlaying = useMusicStore((s) => s.isPlaying);

  useEffect(() => {
    const animate = () => {
      const analyser = getAnalyser();
      if (analyser && isPlaying) {
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(dataArray);
        // Map 256-bin FFT to barCount bars
        const step = Math.floor(dataArray.length / barCount);
        const newBars = Array.from({ length: barCount }, (_, i) => {
          const start = i * step;
          let sum = 0;
          for (let j = start; j < start + step; j++) {
            sum += dataArray[j] || 0;
          }
          const avg = sum / step / 255;
          return Math.max(0.08, avg);
        });
        setBars(newBars);
      } else if (!isPlaying) {
        // Gracefully decay bars
        setBars((prev) =>
          prev.map((b) => Math.max(0.05, b * 0.92))
        );
      }
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [isPlaying, barCount]);

  return bars;
}
