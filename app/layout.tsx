import type { Metadata } from 'next';
import './globals.css';
import AppShell from '@/components/layout/AppShell';

export const metadata: Metadata = {
  title: '90s Music World — Relive the Golden Era',
  description: 'Stream the greatest 90s Bollywood music. Rediscover unforgettable melodies, legendary voices and timeless memories. Spotify meets a cinematic 90s Bollywood time machine.',
  keywords: ['90s music', 'Bollywood', 'Kumar Sanu', 'Lata Mangeshkar', 'streaming', 'cassette', 'nostalgia'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,600&family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
        <meta name="theme-color" content="#141317" />
      </head>
      <body className="bg-background text-on-surface min-h-screen overflow-x-hidden">
        <AppShell>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
