import type { FilterState, MarvelContent, SortMode } from './content';

export function filterContents(contents: MarvelContent[], filters: FilterState, watchedIds: Set<string>) {
  return contents.filter((content) => {
    if (filters.type !== 'all' && content.type !== filters.type) return false;
    if (filters.importance === 'essential' && !content.essential) return false;
    if (filters.universe !== 'all' && content.universe !== filters.universe) return false;
    if (filters.status === 'watched' && !watchedIds.has(content.id)) return false;
    if (filters.status === 'pending' && watchedIds.has(content.id)) return false;
    return true;
  });
}

export function sortContents(contents: MarvelContent[], mode: SortMode) {
  if (mode === 'release') return [...contents].sort((a, b) => a.releaseDate.localeCompare(b.releaseDate) || a.narrativeOrder - b.narrativeOrder);
  const key = mode === 'narrative' ? 'narrativeOrder' : 'chronologicalOrder';
  return [...contents].sort((a, b) => a[key] - b[key] || a.narrativeOrder - b.narrativeOrder);
}
