import type { MarvelContent } from './content';

export interface ProgressSummary {
  total: number;
  watched: number;
  pending: number;
  percentage: number;
  totalRuntime: number;
  watchedRuntime: number;
  remainingRuntime: number;
  pendingMovies: number;
  pendingEpisodes: number;
  weeklyMinutes: number;
  dailyMinutes: number;
  weeksRemaining: number;
}

export const DOOMSDAY_RELEASE_DATE = '2026-12-18';
export const DOOMSDAY_DATE = new Date(`${DOOMSDAY_RELEASE_DATE}T00:00:00`);

export function getWeeksUntilDoomsday(today = new Date()): number {
  const days = Math.max(0, (DOOMSDAY_DATE.getTime() - today.getTime()) / 86400000);
  return Math.max(1, Math.ceil(days / 7));
}

export function calculateProgress(contents: MarvelContent[], watchedIds: Set<string>, today = new Date()): ProgressSummary {
  const trackable = contents.filter((content) => content.availability === 'released');
  const duration = (content: MarvelContent) => content.runtimeMinutes ?? 0;
  const totalRuntime = trackable.reduce((sum, content) => sum + duration(content), 0);
  const watched = trackable.filter((content) => watchedIds.has(content.id));
  const pending = trackable.filter((content) => !watchedIds.has(content.id));
  const weeksRemaining = getWeeksUntilDoomsday(today);
  const remainingRuntime = pending.reduce((sum, content) => sum + duration(content), 0);

  return {
    total: trackable.length,
    watched: watched.length,
    pending: pending.length,
    percentage: trackable.length ? Math.round((watched.length / trackable.length) * 100) : 0,
    totalRuntime,
    watchedRuntime: watched.reduce((sum, content) => sum + duration(content), 0),
    remainingRuntime,
    pendingMovies: pending.filter((content) => content.type === 'movie').length,
    pendingEpisodes: pending.filter((content) => content.type === 'series').reduce((sum, content) => sum + (content.episodes ?? 0), 0),
    weeklyMinutes: Math.ceil(remainingRuntime / weeksRemaining),
    dailyMinutes: Math.ceil(remainingRuntime / weeksRemaining / 7),
    weeksRemaining,
  };
}

export function formatHours(minutes: number): string {
  return `${Math.floor(minutes / 60)} h ${minutes % 60} min`;
}
