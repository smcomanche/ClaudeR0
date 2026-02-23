# Moab 2026 — Spring Break Road Trip

A Progressive Web App (PWA) for the Meredith family spring break road trip: Denver to Glenwood Springs to Moab, March 27 - April 1, 2026.

Built with React 18 + Vite 5. Works fully offline after first load.

## Features

- **Itinerary** — Day-by-day schedule with times, locations, maps, phone numbers, and trail links
- **Checklist** — Pre-trip to-do list with localStorage persistence
- **Journal** — Travel diary with location tagging
- **Info** — Susan's routes, backup restaurants, key contacts, and trip tips

## Setup

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Deploy to GitHub Pages

1. Create a GitHub repo named `moab-2026`
2. Push this code to the repo
3. Run:

```bash
npm run deploy
```

The app will be available at `https://<username>.github.io/moab-2026/`

If you change the repo name, update `repoName` in `vite.config.js` and the asset paths in `index.html`.
