'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  rightSlot?: React.ReactNode;
}

const LOGO_SRC = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAAnLvPoZIGxw2p-rA1ehE6wK76uB90gTDOPI55uG9_e9dE3fc1-r45PcK_g_-vXIP9sQuIhHfPMOVcK7YmsAEilkQBCzh3cJIXWmmGEk3eNUGFaI5zk0g89pmhGz79Op3x5XXgjAcisAeStLA5u43hqd_5tZVD3XfoPJ1ouhs2JbG1_qczXrNW2Zsv6tu_PXNNffPZM-cmHO2dZWL5i3EJ6mB29Wfzk5_gpGrBhCA7v8_OWAA0PsKC';

const NAV_LINKS = [
  { href: '/', label: 'Home', icon: 'home' },
  { href: '/discover', label: 'Discover', icon: 'explore' },
  { href: '/hits', label: '90s Hits', icon: 'album' },
];

export default function Header({ title, subtitle = 'Dolby Stereo 90s', showBack = false, rightSlot }: HeaderProps) {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 w-full z-50 pt-safe bg-surface-container-lowest/85 backdrop-blur-xl border-b border-outline-variant/20 shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
      <div className="h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 max-w-7xl mx-auto">
        {/* Left branding */}
        <div className="flex items-center gap-3 min-w-0">
          {showBack && (
            <Link
              href="/"
              className="w-10 h-10 flex items-center justify-center text-on-surface hover:text-primary transition-colors rounded-full -ml-2 flex-shrink-0"
              aria-label="Go back"
            >
              <span className="material-symbols-outlined text-[22px]">arrow_back_ios_new</span>
            </Link>
          )}
          <Link href="/" className="flex items-center gap-2.5 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={LOGO_SRC}
              alt="90s Music World Logo"
              className="h-8 w-auto object-contain flex-shrink-0 group-hover:scale-105 transition-transform"
            />
            <div className="flex flex-col min-w-0">
              <span className="font-playfair text-title-lg sm:text-headline-sm text-on-surface truncate tracking-tight font-bold">
                90s Music World
              </span>
              <span className="font-mono-space text-[10px] text-secondary-fixed-dim uppercase tracking-wider hidden sm:block">
                {subtitle}
              </span>
            </div>
          </Link>
        </div>

        {/* Center navigation for Desktop/Tablet */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {NAV_LINKS.map(({ href, label, icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-full font-mono-space text-xs tracking-wider uppercase transition-all ${
                  isActive
                    ? 'bg-primary-container/30 text-primary border border-primary/40 font-semibold shadow-[0_0_12px_rgba(138,43,226,0.3)]'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                  {icon}
                </span>
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {rightSlot || (
            <>
              <Link
                href="/discover"
                className="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:text-secondary hover:bg-surface-container transition-colors rounded-full"
                aria-label="Search"
              >
                <span className="material-symbols-outlined text-[20px]">search</span>
              </Link>
              <button
                className="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors rounded-full relative"
                aria-label="Notifications"
              >
                <span className="material-symbols-outlined text-[20px]">notifications</span>
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-secondary-container shadow-[0_0_8px_rgba(0,227,253,0.8)]" />
              </button>
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center ml-1 shadow-[0_0_12px_rgba(220,184,255,0.35)] cursor-pointer">
                <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
