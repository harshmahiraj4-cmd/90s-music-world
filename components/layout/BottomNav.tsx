'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMusicStore } from '@/lib/musicStore';

const NAV_ITEMS = [
  { href: '/', icon: 'home', label: 'Home' },
  { href: '/discover', icon: 'explore', label: 'Discover' },
  { href: '/hits', icon: 'album', label: '90s Hits' },
  { href: '/favorites', icon: 'favorite', label: 'Library' },
];

export default function BottomNav() {
  const pathname = usePathname();
  const currentSong = useMusicStore((s) => s.currentSong);

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-surface-container-lowest/95 backdrop-blur-xl border-t border-outline-variant/30 pb-safe"
      style={{ boxShadow: '0 -4px 24px rgba(0,0,0,0.4)' }}
    >
      <div className="flex items-center justify-around h-16 px-2 max-w-lg mx-auto">
        {NAV_ITEMS.map(({ href, icon, label }) => {
          const isActive = pathname === href;
          const isFavorites = href === '/favorites';
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-0.5 min-w-[3.5rem] py-1 group"
            >
              <span
                className={`material-symbols-outlined text-[24px] transition-all ${
                  isActive ? 'text-primary scale-110' : 'text-on-surface-variant group-hover:text-primary'
                }`}
                style={{
                  fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                }}
              >
                {icon}
              </span>
              <span
                className={`text-[10px] font-mono-space tracking-wider uppercase transition-colors ${
                  isActive ? 'text-primary font-semibold' : 'text-on-surface-variant'
                }`}
              >
                {label}
              </span>
              {isActive && (
                <div className="absolute bottom-1 w-1 h-1 rounded-full bg-primary shadow-[0_0_6px_rgba(220,184,255,0.8)]" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
