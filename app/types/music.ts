export type RepeatMode = "off" | "one" | "all";

export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  year: number;
  genre: string;
  moods: string[];
  duration: string;
  categories: string[];
  audioSrc: string;
  artwork: string;
}

export interface Playlist {
  name: string;
  songIds: string[];
}
