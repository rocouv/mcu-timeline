import { describe, expect, it } from 'vitest';
import { calculateProgress } from './progress';
import type { MarvelContent } from './content';

const contents: MarvelContent[] = [
  { id: 'movie', title: 'Movie', type: 'movie', universe: 'MCU', phase: 'Test', releaseYear: 2020, releaseDate: '2020-01-01', posterUrl: '', chronologicalOrder: 1, narrativeOrder: 1, runtimeMinutes: 120, essential: true, importance: 'essential', availability: 'released' },
  { id: 'series', title: 'Series', type: 'series', universe: 'MCU', phase: 'Test', releaseYear: 2021, releaseDate: '2021-01-01', posterUrl: '', chronologicalOrder: 2, narrativeOrder: 2, runtimeMinutes: 240, episodes: 6, essential: false, importance: 'recommended', availability: 'released' },
  { id: 'upcoming', title: 'Upcoming', type: 'movie', universe: 'MCU', phase: 'Test', releaseYear: 2026, releaseDate: '2026-01-01', posterUrl: '', chronologicalOrder: 3, narrativeOrder: 3, runtimeMinutes: null, essential: true, importance: 'essential', availability: 'upcoming' },
];

describe('calculateProgress', () => {
  it('counts released content and runtime while excluding upcoming entries', () => {
    const summary = calculateProgress(contents, new Set(['movie']), new Date('2026-08-01T00:00:00'));

    expect(summary.total).toBe(2);
    expect(summary.watched).toBe(1);
    expect(summary.pending).toBe(1);
    expect(summary.percentage).toBe(50);
    expect(summary.remainingRuntime).toBe(240);
    expect(summary.pendingEpisodes).toBe(6);
  });
});
