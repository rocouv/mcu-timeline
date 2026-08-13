import type { FilterState, SortMode } from '../domain/content';

const STORAGE_KEY = 'road-to-doomsday:tracker:v1';
export interface StoredTrackerState {
  watchedIds: string[];
  filters: FilterState;
  sortMode: SortMode;
  theme: 'dark' | 'light';
}

export function readTrackerState(fallback: StoredTrackerState): StoredTrackerState {
  if (typeof window === 'undefined') return fallback;
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved ? { ...fallback, ...JSON.parse(saved) } : fallback;
  } catch { return fallback; }
}

export function writeTrackerState(state: StoredTrackerState) {
  try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* storage can be unavailable */ }
}
