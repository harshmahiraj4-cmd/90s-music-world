'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAudioEngine } from '@/lib/audioEngine';
import MiniPlayer from '@/components/player/MiniPlayer';
import BottomNav from '@/components/layout/BottomNav';
import { useMusicStore } from '@/lib/musicStore';

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const currentSong = useMusicStore((s) => s.currentSong);
  const isNowPlaying = pathname === '/now-playing';

  // Initialize audio engine (singleton, runs once)
  useAudioEngine();

  return (
    <>
      {children}
      {/* Mini player — shown on all pages except the full now-playing screen */}
      {currentSong && !isNowPlaying && <MiniPlayer />}
      {/* Bottom nav */}
      <BottomNav />
    </>
  );
}
