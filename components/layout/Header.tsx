'use client';

import Link from 'next/link';
import Image from 'next/image';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  rightSlot?: React.ReactNode;
}

const LOGO_SRC = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAAnLvPoZIGxw2p-rA1ehE6wK76uB90gTDOPI55uG9_e9dE3fc1-r45PcK_g_-vXIP9sQuIhHfPMOVcK7YmsAEilkQBCzh3cJIXWmmGEk3eNUGFaI5zk0g89pmhGz79Op3x5XXgjAcisAeStLA5u43hqd_5tZVD3XfoPJ1ouhs2JbG1_qczXrNW2Zsv6tu_PXNNffPZM-cmHO2dZWL5i3EJ6mB29Wfzk5_gpGrBhCA7v8_OWAA0PsKC';

export default function Header({ title, subtitle = 'Dolby Stereo 90s', showBack = false, rightSlot }: HeaderProps) {
  return (
    <header className="fixed top-0 w-full z-50 pt-safe bg-surface-container-lowest/80 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
      <div className="h-16 px-4 flex items-center justify-between gap-2 max-w-2xl mx-auto">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {showBack && (
            <Link
              href="/"
              className="w-11 h-11 flex items-center justify-center text-on-surface hover:text-primary transition-colors rounded-full -ml-2 flex-shrink-0"
              aria-label="Go back"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back_ios_new</span>
            </Link>
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={LOGO_SRC}
            alt="90s Music World Logo"
            className="h-8 w-auto object-contain flex-shrink-0"
          />
          <div className="flex flex-col min-w-0 ml-1">
            <span className="font-playfair text-headline-sm text-on-surface truncate tracking-tight">{title}</span>
            <span className="font-mono-space text-label-mono-sm text-secondary-fixed-dim uppercase tracking-wider">{subtitle}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          {rightSlot || (
            <>
              <Link
                href="/search"
                className="w-11 h-11 flex items-center justify-center text-on-surface-variant hover:text-secondary transition-colors rounded-full"
                aria-label="Search"
              >
                <span className="material-symbols-outlined text-[22px]">search</span>
              </Link>
              <button
                className="w-11 h-11 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors rounded-full relative"
                aria-label="Notifications"
              >
                <span className="material-symbols-outlined text-[22px]">notifications</span>
                <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-secondary-container shadow-[0_0_8px_rgba(0,227,253,0.8)]" />
              </button>
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center ml-1 shadow-[0_0_12px_rgba(220,184,255,0.35)]">
                <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
