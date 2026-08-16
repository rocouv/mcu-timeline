# Road to Doomsday

Checklist cronológico de películas y series esenciales antes de *Avengers: Doomsday*.

## Posters TMDB

Los posters se sirven desde la CDN de TMDB. La API key solo se utiliza para sincronizar rutas durante el desarrollo o CI y nunca se expone al navegador.

1. Crea un Read Access Token en [TMDB](https://www.themoviedb.org/settings/api).
2. Copia `.env.example` a `.env` y define `TMDB_API_TOKEN`.
3. Ejecuta `bun run sync:posters`.
4. Ejecuta `bun run build`.

El archivo `src/data/tmdb-posters.ts` contiene únicamente rutas públicas de imágenes y puede versionarse. Si una entrada no tiene coincidencia, la app conserva el fallback configurado en el catálogo.

La aplicación debe incluir atribución visible a TMDB en producción, de acuerdo con sus términos de uso.
