# 90s Music World

A production-ready cinematic 90s music streaming app built with Next.js, React, TypeScript, Tailwind CSS, HTML5 Audio API and Web Audio API.

## Features

- 20 curated experiences (hero, time machine, carousel, artist collections, playlists, search, favorites, recently played, and more)
- Functional music player: play/pause, previous/next, seek, volume, shuffle, repeat, queue, favorite toggle
- Mini-player + fullscreen "Now Playing"
- LocalStorage persistence for favorites, recently played, playlists, and playback preferences
- Dark neon glassmorphism UI with responsive layout and animated visual elements

## Audio and Artwork Structure

Place real licensed/royalty-free assets in:

- `/public/audio/` for MP3 tracks
- `/public/images/` for artwork (albums/artists)

Current song metadata is maintained in `app/data/musicLibrary.ts` for easy expansion.

## Development

```bash
npm install
npm run dev
```

## Validation

```bash
npm run lint
npm run build
```
