'use client';

interface EqBarsProps {
  count?: number;
  className?: string;
  active?: boolean;
}

export default function EqBars({ count = 5, className = '', active = true }: EqBarsProps) {
  const bars = Array.from({ length: count }, (_, i) => i);
  const delays = ['0s', '0.15s', '0.3s', '0.1s', '0.25s'];
  const heights = ['h-2', 'h-3', 'h-1.5', 'h-3', 'h-2'];
  const colors = [
    'bg-secondary-container',
    'bg-primary',
    'bg-tertiary-fixed-dim',
    'bg-secondary',
    'bg-primary-container',
  ];

  return (
    <div className={`flex items-end gap-0.5 ${className}`} aria-label="Equalizer">
      {bars.map((i) => (
        <div
          key={i}
          className={`w-1 rounded-full ${colors[i % colors.length]} ${active ? 'animate-bounce' : ''} ${heights[i % heights.length]}`}
          style={active ? { animationDelay: delays[i % delays.length], animationDuration: '0.8s' } : {}}
        />
      ))}
    </div>
  );
}
