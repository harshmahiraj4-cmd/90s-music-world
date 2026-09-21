export interface MoodItem {
  id: string;
  emoji: string;
  label: string;
  subLabel: string;
  trackCount: number;
  gradient: string;
}

export const MOODS: MoodItem[] = [
  { id: 'romantic', emoji: '❤️', label: 'Romantic', subLabel: '120 Tracks', trackCount: 120, gradient: 'from-pink-900/40 to-purple-900/40' },
  { id: 'melancholy', emoji: '🌧️', label: 'Melancholy', subLabel: '84 Tracks', trackCount: 84, gradient: 'from-blue-900/40 to-indigo-900/40' },
  { id: 'happy', emoji: '☀️', label: 'Happy', subLabel: '95 Tracks', trackCount: 95, gradient: 'from-amber-900/40 to-orange-900/40' },
  { id: 'party', emoji: '🕺', label: 'Party', subLabel: '110 Tracks', trackCount: 110, gradient: 'from-violet-900/40 to-fuchsia-900/40' },
  { id: 'late-night', emoji: '🌙', label: 'Late Night', subLabel: '65 Tracks', trackCount: 65, gradient: 'from-slate-900/40 to-purple-900/40' },
  { id: 'ghazal', emoji: '🎻', label: 'Ghazals', subLabel: '42 Tracks', trackCount: 42, gradient: 'from-zinc-900/40 to-stone-900/40' },
];

export interface CassetteItem {
  id: string;
  side: string;
  type: string;
  title: string;
  subtitle: string;
  duration: string;
  accentColor: string;
  tapeLabelColor: string;
  gradientFrom: string;
  gradientVia: string;
  gradientTo: string;
  tapeText: string;
  songId?: string;
}

export const CASSETTES: CassetteItem[] = [
  {
    id: 'love-mix',
    side: 'SIDE A',
    type: 'CHROME CrO2',
    title: '90s Love Mix',
    subtitle: '18 Soulful Duets',
    duration: '64 MIN',
    accentColor: 'text-primary',
    tapeLabelColor: 'text-secondary',
    gradientFrom: 'from-[#8a2be2]',
    gradientVia: 'via-[#a100da]',
    gradientTo: 'to-[#dcb8ff]',
    tapeText: 'RECORDED HI-FI',
    songId: 'tujhe-dekha-toh',
  },
  {
    id: 'rainy-day',
    side: 'SIDE A',
    type: 'DOLBY B-NR',
    title: 'Rainy Day Classics',
    subtitle: 'Tip Tip Barsa & Beyond',
    duration: '58 MIN',
    accentColor: 'text-[#00e3fd]',
    tapeLabelColor: 'text-[#9cf0ff]',
    gradientFrom: 'from-[#00e3fd]',
    gradientVia: 'via-[#bdf4ff]',
    gradientTo: 'to-[#8a2be2]',
    tapeText: 'MONSOON STEREO',
    songId: 'tip-tip-barsa',
  },
  {
    id: 'school-time',
    side: 'SIDE B',
    type: 'FERRIC NORMAL',
    title: 'School Time Hits',
    subtitle: 'Bus Rides & Lunchbreaks',
    duration: '72 MIN',
    accentColor: 'text-[#bdf4ff]',
    tapeLabelColor: 'text-[#00daf3]',
    gradientFrom: 'from-[#9cf0ff]',
    gradientVia: 'via-[#efdbff]',
    gradientTo: 'to-[#ecb2ff]',
    tapeText: 'WALKMAN ED.',
    songId: 'purani-jeans',
  },
  {
    id: 'late-night',
    side: 'SIDE A/B',
    type: 'METAL IV',
    title: 'Late Night 90s',
    subtitle: 'Ghazals & Slow Jams',
    duration: '90 MIN',
    accentColor: 'text-[#988ca0]',
    tapeLabelColor: 'text-[#cfc2d7]',
    gradientFrom: 'from-[#363439]',
    gradientVia: 'via-[#4c4354]',
    gradientTo: 'to-[#8a2be2]',
    tapeText: 'MIDNIGHT FM',
    songId: 'chitthi-aayi-hai',
  },
];

export interface MemoryEpisode {
  id: string;
  episode: string;
  title: string;
  subtitle: string;
  colorClass: string;
  imageSrc: string;
  songId?: string;
}

export const MEMORY_LANE: MemoryEpisode[] = [
  {
    id: 'first-love',
    episode: 'EPISODE 01',
    title: 'First Love',
    subtitle: 'Pehla Nasha • 1992',
    colorClass: 'text-[#9cf0ff]',
    imageSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBhT2kwoOCOBu-XmiEKSAiJ7MXgJu02g8RMJs3QTX98Sm1KjavSnmQQOSe_D-YCT_Z0RN7jhcoDU8nB4lPFI-1SquCdjSTs38rr4wFjD84GYxhTzTGgq1pgmuGqDCq2Sx56HN32kN8oOh3_6E0jzFzVlWpTdIiMYSpBzWq3HrU88ltGlXiiaBNMm_gkm03PF-GbcOQGzQDjuDcHNFG1aIB3WiIghC-_BRRzcvN6xnNAaMaxSRQkcQ9V',
    songId: 'pehla-nasha',
  },
  {
    id: 'monsoon-classics',
    episode: 'EPISODE 02',
    title: 'Monsoon Classics',
    subtitle: 'Rimjhim Gire Sawan',
    colorClass: 'text-[#00e3fd]',
    imageSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBu8kjomX7wf9O8umzwPSzwsNpr-vSrmY95So7TBF-4VtDEr8DB_ycfnOS6IdfqboQBHAFao0STQ1EEYuiUHLXM1NBKA8P3aEiiIsGR6cb2vh24GyJp7YXhzGEvgMVtk2Y95Cvkd_L42sh6_QXAhW5ur7fuIDjPcX181DIQRAoajJ_4CRP4Z9mvJH4iCzCmnk-LtXimk2D9mZYY2pSmhUuv9Dkps8rV8_RcpGOSyBt-Lx2YB0-AgExv',
    songId: 'rimjhim-gire-sawan',
  },
  {
    id: 'school-days',
    episode: 'EPISODE 03',
    title: 'School Days',
    subtitle: 'Purani Jeans • Euphoria',
    colorClass: 'text-[#dcb8ff]',
    imageSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDwjzZ6z9Z0TY228gO8wvwy1E9bFOrOBVyaRk7_qWq_zkz1kXcyXtXzalsfq_qOj3nQfZnYXYrlkT6zqLPzPIXP4ODZfkVVo8b8mjbEK1KUXghH2cikoiQVT7LpeYyf4pvnAO-3sZxO6Qz5rODxY9kbiX4iNnV0SSvM-1NSkJU9lSqXKguqkYOgPH40rSTVTEzVA710uHQv4qZrfTi86teGbB0TYCIn0sXAdy_rEtWZ3-DcqzEGN2pn',
    songId: 'purani-jeans',
  },
  {
    id: 'late-night',
    episode: 'EPISODE 04',
    title: 'Late Night',
    subtitle: 'Chitthi Aayi Hai',
    colorClass: 'text-[#ecb2ff]',
    imageSrc: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2kzB2a-7MlN27zE3zZ2_yPuUK53ULlJhdjee407UlHpLvWks48lHWAotsV8EHsBjxNoDDdQWYgeAzj98fiY4UZmiQhAADpu1-fBC9kOMeYwCKk-FBy_SHpcSWmdkJw9JRRhq7yZuyumrrQPKqtcXClNlvHELjoeAqFlRyjM5O6_kmsSs8doR76jsoAYduSMz6tntNiBxJ8bZyf6xXAXoma9Q_89_G6u3lo5MQypOnauY_m5oG2X9s',
    songId: 'chitthi-aayi-hai',
  },
];
