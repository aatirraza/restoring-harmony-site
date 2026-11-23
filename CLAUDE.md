# CLAUDE.md: Restoring Harmony book world

## What this is
This is an interactive "book world" website for the novel *Restoring Harmony* by Tawaskee L. Hill. The client is World Publishing Company (WPC). The site is a scrolling journey through the book's realms:

Threshold → Graduation → Chariot → Planet Conviction → Life Light → Night → Gifts → Temple → Pandemonium

It ends with:
- a "Get my website" call to action
- the unlock/offer page
- a footer
- a presenter's map overlay (press `?` to open it)

The site has hidden easter eggs, and seven gold coins track which ones have been found.

## Stack
- React 18 and Vite 5. Plain JavaScript, no TypeScript.
- No router. There is one page; the offer page and the presenter map are overlays that are shown and hidden.
- Backend: Express 5 in `server/`, using Knex. The same code runs on SQLite (local development, the default), MySQL or PostgreSQL; set `DB_CLIENT` in `.env` (see `.env.example`).
- `npm run dev` starts Vite on :5173 and the API on :3001 together; Vite proxies `/api`. `npm start` serves the API and the built `dist/` from one process.

## Architecture (important)
- The markup lives in `src/components/*.jsx`. These components are pure markup.
- All behaviour lives in `src/engine/world.js` as `initWorld()`. `App.jsx` calls it once from a `useEffect`. The engine finds elements by `id` and `className`, then drives canvases, scroll effects and game logic directly in the DOM.
  - **Do not rename ids or classes** without updating the engine to match.
  - `initWorld()` has a run-once guard. StrictMode is deliberately off in `main.jsx`, because it would mount everything twice.
  - If you move a piece of behaviour into React state, move it one section at a time and remove the matching code from the engine.
- Images are served from `public/images/`. The image map is `IMAGES` in `world.js`.
- Network calls from the site live in `src/engine/api.js` (`track()` for egg and coin events, `submitLead()` for the unlock-page form). Tracking fails silently so the site still works as a static page.
- The admin page is a second Vite entry: `admin.html` → `src/admin/`. It is ordinary React state, with no engine; it is served at `/admin`.
- New styles go in `src/styles/forms.css`, not in `world.css`.
- The egg ids in `EGGS` (`world.js`) must match `EGG_IDS` in `server/validate.js`. The lead options (`full`, `trustpilot`, `google`) must match `LEAD_CHOICES`.
- `src/styles/world.css` was ported verbatim from the approved design. The beast heads use the class `.bhead`, not `.head`, because `.head` clashed with another style.

## Design rules
- Font: **Poppins** only, loaded from Google Fonts in `index.html`.
- The palette is dark ink with gold accents. It is cinematic and should never look cartoonish.
- Never use the word "Mattrics" anywhere in the site, the code comments or the copy.
- Keep the layout working on phones: no horizontal scroll, 16px side gutters.

## Offer page copy (current)
- Price: $1,999.
- $500 off for a Trustpilot review, giving $1,499.
- $250 off for a Google review, giving $1,749.
- Note: Trustpilot and Google both forbid offering incentives for reviews, and doing so can get listings penalised. Before going live, reword these as general loyalty discounts, not rewards for reviews.

## Roadmap
1. **Backend.** Done (`server/`): `POST /api/leads`, `POST /api/events` (deduplicated per visitor), admin login with an scrypt hash and a signed httpOnly cookie, rate limiting and helmet. Create an admin with `npm run admin:create -- you@example.com`.
2. **Database.** Done: tables `leads`, `events` and `admins`, in migration `server/migrations/001_init.js`. Migrations run automatically on start. Add new migrations to the `MIGRATIONS` list in `server/db.js`. Tested on SQLite only so far; test on the real MySQL or Postgres once the host is chosen.
3. **Admin page.** Done: `/admin` shows lead and egg-discovery stats, a coin funnel, the leads table and a CSV export.
4. **Hosting.** Still to do. Run `npm run build`, then run `npm start` as a Node app (cPanel "Setup Node.js App", or a VPS), with `NODE_ENV=production`, `SESSION_SECRET`, the DB settings and `TRUST_PROXY=1` behind a proxy. Point the domain and turn on SSL. On static-only hosting, upload `dist/`, run the API elsewhere, and build with `VITE_API_URL` (this would also need CORS, which is not built yet).
5. **Before launch.** Reword the review discounts (see above). Add a privacy notice near the lead form, because it collects names and emails.
