export type ContentType = 'movie' | 'series';
export type Importance = 'essential' | 'recommended' | 'complementary';
export type Availability = 'released' | 'upcoming';
export type SortMode = 'narrative' | 'chronological' | 'release';

export interface MarvelContent {
  id: string;
  title: string;
  type: ContentType;
  universe: string;
  phase: string;
  releaseYear: number;
  releaseDate: string;
  posterUrl: string;
  tmdbId?: number;
  chronologicalOrder: number;
  narrativeOrder: number;
  runtimeMinutes: number | null;
  essential: boolean;
  importance: Importance;
  availability: Availability;
  episodes?: number;
  season?: string;
}

export interface FilterState {
  type: 'all' | ContentType;
  importance: 'all' | 'essential';
  universe: string;
  status: 'all' | 'watched' | 'pending';
}

export const defaultFilters: FilterState = {
  type: 'all',
  importance: 'all',
  universe: 'all',
  status: 'all',
};
