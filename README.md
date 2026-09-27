# Infobees Frontend

React 19 + Vite + Tailwind CSS v4. Public website and admin dashboard; all editable
content comes from the backend API (see `../Backend`).

## Setup

1. `npm install`
2. Copy `.env.example` to `.env` and set `VITE_API_URL` to the backend API.
3. `npm run dev` → http://localhost:5173 (the backend must be running too).

Other scripts: `npm run build` (production build in `dist/`), `npm run preview`, `npm run lint`.

## Pages

| Path               | What it is                                                     |
| ------------------ | -------------------------------------------------------------- |
| `/`                | Home: Hero, Latest Notice, Services, Leadership, Why Us, Contact |
| `/services/:slug`  | One service's page (`/services` redirects to the home section) |
| `/notices`         | All notices (search, topic filter, pagination)                 |
| `/notices/:slug`   | One notice                                                     |
| `/admin`           | Admin login (not linked from the site)                         |
| `/admin/dashboard` | Admin dashboard, notices, website sections (JWT protected)    |

## How content loads

- `SiteContentProvider` fetches every section (`GET /api/sections`) once and shares it with all
  pages; the last response is cached in `localStorage` so returning visitors see it instantly.
- Until the first response (or if the API is down) `src/data/sectionFallbacks.js` is shown.
- Notices are fetched per page (`/api/notices`). Admin pages are code-split and only load on `/admin`.

## Structure

```
src/
├── App.jsx              # routes (admin routes lazy-loaded)
├── pages/               # public pages + pages/admin/*
├── sections/            # home-page sections
├── components/          # shared UI (+ components/admin/*)
├── context/             # site content provider + useSection()
├── lib/                 # API clients, auth session, icons, helpers
└── data/                # static nav links + fallback content
```

## Deploying

The host must send every unknown path to `index.html` (SPA rewrite), otherwise opening
`/admin` or `/services/...` directly returns 404. Set `VITE_API_URL` to the live API and add
the site's URL to the backend's `CLIENT_URL`.
