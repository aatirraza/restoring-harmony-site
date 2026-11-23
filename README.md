# Restoring Harmony: Book World Website

An interactive React site for *Restoring Harmony* by Tawaskee L. Hill, built with React and Vite.

## Run it on your computer

1. Install **Node.js LTS** (version 20 or newer) from https://nodejs.org.
2. Open this folder in **VS Code**: File → Open Folder.
3. Open the terminal (Terminal → New Terminal) and run:

```bash
npm install
npm run dev
```

4. Open the link it prints, usually http://localhost:5173. `npm run dev` starts the site and the API together. The API uses a local SQLite file in `data/`, so there is no database to install.
5. To use the admin page at http://localhost:5173/admin.html, first create an account: `npm run admin:create -- you@example.com`.

## Build for hosting

```bash
npm run build
```

This creates a `dist/` folder. Then run `npm start`, which serves the site, the API and the admin page from one Node process. Copy `.env.example` to `.env` first and fill it in; `SESSION_SECRET` and the database settings are required in production.

## Folder map

| Path | What it is |
|---|---|
| `src/components/` | One file per section of the page (the Threshold, the Graduation, and so on through the Pandemonium, plus the Claim, Offer page, Footer and Presenter map) |
| `src/engine/world.js` | All animation, canvas, scroll and easter-egg behaviour |
| `src/styles/world.css` | All styles |
| `public/images/` | Scene backgrounds and the book cover |
| `src/admin/`, `admin.html` | The admin page (leads and egg stats) |
| `server/` | The Express API: leads, events, admin login, database migrations |

## Working with Claude Code

Open the folder in VS Code and start Claude Code there. It reads `CLAUDE.md` first, which explains how the project is put together and what comes next.
