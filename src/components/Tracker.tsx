import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { marvelContent } from '../data/marvel-content';
import { tmdbPosterPaths } from '../data/tmdb-posters';
import { defaultFilters, type FilterState, type SortMode } from '../domain/content';
import { calculateProgress, DOOMSDAY_DATE, formatHours } from '../domain/progress';
import { filterContents, sortContents } from '../domain/filtering';
import { readTrackerState, writeTrackerState, type StoredTrackerState } from '../services/tracker-storage';
import Countdown from './Countdown';
import '../styles/tracker.css';

const initialState: StoredTrackerState = { watchedIds: [], filters: defaultFilters, sortMode: 'narrative', theme: 'dark' };
const stageOrder = [...new Set(marvelContent.map((content) => content.phase))];
const universeList = [...new Set(marvelContent.map((content) => content.universe))];
const typeLabel = { movie: 'Película', series: 'Serie' };
const importanceLabel = { essential: 'Esencial', recommended: 'Recomendada', complementary: 'Complementaria' };

function formatDate(date: Date) { return new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'long', year: 'numeric' }).format(date); }
function formatReleaseDate(date: string) { return new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(`${date}T00:00:00`)); }

export default function Tracker() {
  const [state, setState] = useState<StoredTrackerState>(initialState);
  const [hydrated, setHydrated] = useState(false);
  const [collapsed, setCollapsed] = useState<string[]>([]);

  useEffect(() => { setState(readTrackerState(initialState)); setHydrated(true); }, []);
  useEffect(() => { if (hydrated) writeTrackerState(state); }, [state, hydrated]);
  useEffect(() => { document.documentElement.dataset.theme = state.theme; }, [state.theme]);

  const watchedIds = useMemo(() => new Set(state.watchedIds), [state.watchedIds]);
  const progress = useMemo(() => calculateProgress(marvelContent, watchedIds), [watchedIds]);
  const visible = useMemo(() => sortContents(filterContents(marvelContent, state.filters, watchedIds), state.sortMode), [state.filters, state.sortMode, watchedIds]);
  const grouped = useMemo(() => stageOrder.map((stage) => ({ stage, entries: visible.filter((content) => content.phase === stage) })).filter((group) => group.entries.length), [visible]);

  const updateFilters = (change: Partial<FilterState>) => setState((current) => ({ ...current, filters: { ...current.filters, ...change } }));
  const toggleWatched = (id: string) => setState((current) => ({ ...current, watchedIds: current.watchedIds.includes(id) ? current.watchedIds.filter((item) => item !== id) : [...current.watchedIds, id] }));
  const reset = () => { if (window.confirm('¿Restablecer todo el progreso?')) setState((current) => ({ ...current, watchedIds: [] })); };
  const clearFilters = () => setState((current) => ({ ...current, filters: defaultFilters, sortMode: 'narrative' }));

  return <main className="tracker-shell">
    <header className="hero">
      <div className="hero-topline"><span className="eyebrow">ARCHIVO MULTIVERSAL · 001</span><button className="theme-toggle" type="button" onClick={() => setState((current) => ({ ...current, theme: current.theme === 'dark' ? 'light' : 'dark' }))} aria-pressed={state.theme === 'dark'} aria-label={`Cambiar a tema ${state.theme === 'dark' ? 'claro' : 'oscuro'}`}>{state.theme === 'dark' ? '☼ Claro' : '◐ Oscuro'}</button></div>
      <div className="hero-grid"><div><p className="kicker">La ruta antes de que todo colapse</p><h1>Road to<br /><em>Doomsday.</em></h1></div><div className="hero-note"><span className="orbit-mark">◎</span><Countdown /><p>La cuenta regresiva ha comenzado. El tiempo se agota antes del <strong>{formatDate(DOOMSDAY_DATE)}</strong>. Dr. Doom está llegando a nuestro universo.</p><span className="scroll-hint">SCROLL TO EXPLORE ↓</span></div></div>
      <div className="hero-footer"><span><b>{marvelContent.length}</b> archivos indexados</span><span><b>{stageOrder.length}</b> etapas narrativas</span><span><b>616</b> universo base</span></div>
    </header>

    <section className="progress-section" aria-labelledby="progress-title"><div className="section-heading"><div><span className="eyebrow">ESTADO DE LA MISIÓN</span><h2 id="progress-title">Tu línea temporal</h2></div><button className="reset-button" onClick={reset}>Restablecer progreso</button></div><div className="progress-overview"><div className="progress-ring" style={{ '--progress': `${progress.percentage * 3.6}deg` } as CSSProperties}><div><strong>{progress.percentage}<small>%</small></strong><span>completado</span></div></div><div className="progress-copy"><div className="progress-bar"><span style={{ width: `${progress.percentage}%` }} /></div><p><strong>{progress.watched}</strong> vistos <i>/</i> {progress.pending} pendientes <span className="muted">· {formatHours(progress.remainingRuntime)} restantes</span></p><div className="pace-grid"><div><b>{formatHours(progress.weeklyMinutes)}</b><span>por semana</span></div><div><b>{formatHours(progress.dailyMinutes)}</b><span>por día</span></div><div><b>{progress.pendingMovies}</b><span>películas</span></div><div><b>{progress.pendingEpisodes}</b><span>episodios aprox.</span></div></div></div></div></section>

    <section className="roadmap-section"><div className="section-heading roadmap-heading"><div><span className="eyebrow">THE MARVEL INDEX</span><h2>La ruta completa</h2></div><p>Ordena. Filtra. Marca tu avance.<br />El multiverso no espera.</p></div>
      <div className="controls"><div className="filter-group"><label>Mostrar</label><select value={state.filters.type} onChange={(event) => updateFilters({ type: event.target.value as FilterState['type'] })}><option value="all">Todo el contenido</option><option value="movie">Solo películas</option><option value="series">Solo series</option></select><select value={state.filters.status} onChange={(event) => updateFilters({ status: event.target.value as FilterState['status'] })}><option value="all">Cualquier estado</option><option value="pending">Pendientes</option><option value="watched">Vistos</option></select><select value={state.filters.universe} onChange={(event) => updateFilters({ universe: event.target.value })}><option value="all">Todos los universos</option>{universeList.map((universe) => <option key={universe}>{universe}</option>)}</select></div><div className="filter-group filter-right"><label>Orden</label><select value={state.sortMode} onChange={(event) => setState((current) => ({ ...current, sortMode: event.target.value as SortMode }))}><option value="narrative">Narrativo recomendado</option><option value="chronological">Cronológico aproximado</option><option value="release">Orden de estreno</option></select><label className="essential-toggle"><input type="checkbox" checked={state.filters.importance === 'essential'} onChange={(event) => updateFilters({ importance: event.target.checked ? 'essential' : 'all' })} /> Solo esenciales</label><button className="clear-button" onClick={clearFilters}>Limpiar</button></div></div>
      <div className="timeline">{grouped.length ? grouped.map(({ stage, entries }) => <section className={`stage ${collapsed.includes(stage) ? 'is-collapsed' : ''}`} key={stage}><button className="stage-heading" onClick={() => setCollapsed((current) => current.includes(stage) ? current.filter((item) => item !== stage) : [...current, stage])} aria-expanded={!collapsed.includes(stage)}><span className="stage-number">{String(stageOrder.indexOf(stage) + 1).padStart(2, '0')}</span><span><span className="eyebrow">ETAPA {String(stageOrder.indexOf(stage) + 1).padStart(2, '0')}</span><strong>{stage}</strong></span><span className="stage-count">{entries.length} archivos <b>{collapsed.includes(stage) ? '+' : '−'}</b></span></button><div className="stage-items">{entries.map((content) => <article className={`content-card ${watchedIds.has(content.id) ? 'is-watched' : ''} ${content.availability === 'upcoming' ? 'is-upcoming' : ''}`} key={content.id}><label className="check-control"><input type="checkbox" checked={watchedIds.has(content.id)} disabled={content.availability === 'upcoming'} onChange={() => toggleWatched(content.id)} /><span className="custom-check" /></label><div className="content-index">{String(content.narrativeOrder).padStart(2, '0')}</div><div className="poster-wrap"><img src={tmdbPosterPaths[content.id] ? `https://image.tmdb.org/t/p/w342${tmdbPosterPaths[content.id]}` : content.posterUrl} alt={`Póster de ${content.title}`} loading="lazy" onError={(event) => { const image = event.currentTarget; if (image.dataset.fallback !== 'true' && image.src !== content.posterUrl) { image.dataset.fallback = 'true'; image.src = content.posterUrl; } else { image.style.display = 'none'; } }} /></div><div className="content-main"><div className="content-title-row"><h3>{content.title}</h3>{content.essential && <span className="essential-star" title="Contenido esencial">✦</span>}</div><div className="content-meta"><span className={`type-badge ${content.type}`}>{content.type === 'movie' ? '◉' : '▣'} {typeLabel[content.type]}</span><span>{content.universe}</span><span>{formatReleaseDate(content.releaseDate)}</span>{content.episodes && <span>{content.episodes} episodios</span>}</div></div><div className="content-status">{content.availability === 'upcoming' ? <span className="upcoming-label">PRÓXIMAMENTE</span> : <span className={`importance ${content.importance}`}>{importanceLabel[content.importance]}</span>}<span>{content.runtimeMinutes ? `${Math.floor(content.runtimeMinutes / 60)}h ${content.runtimeMinutes % 60}m` : 'Duración TBA'}</span></div></article>)}</div></section>) : <div className="empty-state"><span>◌</span><h3>No hay archivos en esta ruta</h3><p>Prueba a cambiar los filtros para volver a abrir el multiverso.</p><button onClick={clearFilters}>Restablecer filtros</button></div>}</div>
    </section>
    <footer className="site-footer"><span>ROAD TO DOOMSDAY / 2026</span><span>Hecho para quienes miran hasta la escena postcréditos.</span><span>LOCAL ARCHIVE · NO ACCOUNT REQUIRED</span><span className="tmdb-attribution">Posters powered by TMDB. This product uses the TMDB API but is not endorsed or certified by TMDB.</span></footer>
  </main>;
}
