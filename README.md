# Nikhar's Music Journal — frontend prototype

An interactive, mobile-first Vite + React + TypeScript visual foundation for the journal described in the brief.

## Run locally

Install Node.js 20+ and run:

```bash
npm install
npm run dev
```

Open the local URL Vite prints (normally `http://localhost:5173`). Do **not** open `dist/index.html` directly from File Explorer: browsers assign it a `file://` origin and block the bundled JavaScript modules with a CORS error.

To preview the production build instead:

```bash
npm run build
npm run preview
```

## Included

- Premium dark dashboard with adaptive desktop sidebar and mobile navigation
- Quick library search
- Favorite toggles on music cards
- Responsive summary cards, discovery feature, and recent-library views

## API foundation

The `backend/` directory now contains a single-user Express + MongoDB API with JWT login, bcrypt password hashing, Helmet, a CORS allowlist, rate limiting, and canonical `MusicRecord` / `JournalEntry` schemas. It exposes:

- `POST /api/auth/login`
- `GET`, `POST`, and `PATCH /api/library` (JWT protected)
- `GET /api/health`

To run it, copy `backend/.env.example` to `backend/.env`, fill in your MongoDB Atlas connection string and a long random JWT secret, then run:

```bash
cd backend
npm install
npm run dev
```

Keep `FRONTEND_ORIGIN=http://localhost:5173` while working locally. This explicit allowlist is what prevents browser CORS errors while keeping the API private.

During local development, Vite forwards `/api/*` requests to `http://localhost:4000`, so the browser makes same-origin requests and never encounters a CORS preflight. For a separately deployed frontend, set `VITE_API_URL` to your deployed API URL plus `/api` at build time and set `FRONTEND_ORIGIN` on the API to the deployed frontend URL.

## Provider search

Adding music is provider-backed: press **Add music**, search once, select a Spotify or YouTube result, then add your personal rating, notes, tags, and favorite status. No music metadata is typed manually.

Add the following server-only credentials to `backend/.env` (never to a frontend `.env` file):

```env
SPOTIFY_CLIENT_ID=...
SPOTIFY_CLIENT_SECRET=...
YOUTUBE_API_KEY=...
```

Create the Spotify keys in the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard) and create a Google Cloud API key with **YouTube Data API v3** enabled. The Spotify service uses its server-to-server Client Credentials flow; YouTube uses `search.list` restricted to videos. [Spotify documentation](https://developer.spotify.com/documentation/web-api/tutorials/client-credentials-flow), [YouTube documentation](https://developers.google.com/youtube/v3/docs/search/list)

## Next implementation milestones

1. Add Express/MongoDB API, single-user JWT login, and canonical music/journal schemas.
2. Integrate Spotify and YouTube provider search behind server-side credentials.
3. Replace the sample dataset with TanStack Query-backed pagination and virtualized library rows.
4. Add persistence for ratings, notes, tags, import/export, timeline, calendar, and analytics.
