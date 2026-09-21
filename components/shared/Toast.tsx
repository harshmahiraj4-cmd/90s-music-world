'use client';

import { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  visible: boolean;
  icon?: string;
}

export default function Toast({ message, visible, icon = 'album' }: ToastProps) {
  return (
    <div
      className={`fixed top-20 left-1/2 -translate-x-1/2 z-[200] pointer-events-none transition-all duration-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}
    >
      <div className="bg-surface-container-highest/95 backdrop-blur-xl px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 text-secondary">
        <span className="material-symbols-outlined text-[16px]">{icon}</span>
        <span className="font-mono-space text-[11px] tracking-wider uppercase text-secondary-fixed">{message}</span>
      </div>
    </div>
  );
}

export function useToast() {
  const [toast, setToast] = useState({ message: '', visible: false, icon: 'album' });
  
  const showToast = (message: string, icon = 'album') => {
    setToast({ message, visible: true, icon });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2200);
  };

  return { toast, showToast };
}
