# Historic Ornament Research

The personal site includes a local-first catalog for historical ornament research at `/ornaments`.

## Data Model

The catalog uses SQLite through Drizzle ORM. The default database path is `data/ornament-research.sqlite`; override it with `ORNAMENT_DB_PATH`.

- `Source`: research source metadata, reading status, notes, and either a URL or local file path.
- `Motif`: extracted ornament records linked to a source, with type, style, tags, visual prompt, applications, notes, and a user-set `resonanceScore`.
- `ProjectThread`: thematic project ideas that link many motifs and sources through join tables.

Migrations run automatically from `lib/ornaments/migrations.ts` when the DB singleton initializes.

## API Endpoints

- `POST /api/ornaments/sources`
- `GET /api/ornaments/sources?type=&era=&status=`
- `GET /api/ornaments/sources/:id`
- `PATCH /api/ornaments/sources/:id`
- `POST /api/ornaments/sources/:id/archive`
- `POST /api/ornaments/sources/:id/digest?dryRun=true`
- `POST /api/ornaments/motifs`
- `GET /api/ornaments/motifs?motifType=&style=&era=&tags=&resonanceScore=`
- `GET /api/ornaments/motifs/:id`
- `PATCH /api/ornaments/motifs/:id`
- `POST /api/ornaments/projects`
- `GET /api/ornaments/projects?status=`
- `GET /api/ornaments/projects/:id`
- `PATCH /api/ornaments/projects/:id`
- `POST /api/ornaments/projects/suggest`

## Services

`lib/ornaments/digester.ts` turns a source and optional text content into motif candidates. If `OPENAI_API_KEY` is present it calls OpenAI; otherwise it uses a deterministic local stub. `dryRun=true` previews motifs without saving.

`lib/ornaments/weaver.ts` clusters motifs into unsaved project suggestions, prioritizing higher-resonance groups and optional desired output formats.

`lib/ornaments/notion-sync.ts` imports rows from the Notion Historical Ornaments database as `Source` records and dedupes by Notion page ID. Website archives set the row's Notion `Status` select to `Archived` and store a local `archivedAt` timestamp; archived rows move from the active sources list to the archived view. See [`notion-ornament-sync.md`](notion-ornament-sync.md) for setup and daily scheduling.

`lib/ornaments/export.ts` writes a deterministic tracked snapshot to `data/ornaments/sources.json`. `npm run sync-ornaments-and-push` syncs Notion into SQLite, refreshes that snapshot, and commits/pushes only the export file when it changes.

Autonomous updates use Notion webhooks at `POST /api/ornaments/notion-webhook`, which trigger the GitHub Action `.github/workflows/sync-ornaments.yml`. See [`notion-ornament-sync.md`](notion-ornament-sync.md).

## UI Structure

- `/ornaments`: dashboard counts and recent high-resonance motifs.
- `/ornaments/sources`: filterable source list.
- `/ornaments/sources/:id`: metadata, linked motifs, and digest button.
- `/ornaments/motifs`: filterable motif grid.
- `/ornaments/motifs/:id`: motif detail with editable tags, resonance score, and notes.
- `/ornaments/projects`: filterable project thread list.
- `/ornaments/projects/:id`: linked motifs, sources, status, notes, and formats.
