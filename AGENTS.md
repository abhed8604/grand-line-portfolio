# Agent Guide — LED Grand Line

A One Piece fan-tribute portfolio built with Vite, TypeScript, and Three.js. The LED particle engine lives in `src/engine/`.

## Folder map
- `src/main.ts` — app entry; boot, UI wiring, animation loop
- `src/engine/` — WebGL particle simulation, shaders, motion, quality tiers
- `src/targets/` — target shapes and cloud factory
- `src/scroll/` — scroll-driven story controller
- `src/ui/` — DOM UI, quick view, world map, cursor, icons
- `src/content.ts` — portfolio content and section data
- `scripts/` — Playwright capture, motion and QA checks
- `public/` — static assets (OG image, resume, favicon, reference)
- `graphify-out/` — generated knowledge graph; do not edit by hand
- `dist/` — production build output; ignored

## Run and test
- `npm install` — install dependencies
- `npm run dev` — start Vite dev server
- `npm run check` — TypeScript type-check only
- `npm run build` — type-check and build to `dist/`
- `npm run preview` — serve the production build
- `npm run quick-check` — fast Playwright QA pass
- `npm run qa` — full desktop/mobile visual capture
- `npm run shots` — capture all story chapters
- Browser scripts need `npx playwright install chromium` and a running `BASE_URL`.

## Rules
1. Check the graph before reading files: `graphify query "<question>"`, `graphify path "A" "B"`, or `graphify explain "X"`. Read source only when the graph lacks context.
2. Read only the line ranges you need; never dump whole files.
3. Use subagents for broad exploration or multi-file searches, then summarize.
4. After code changes, run `graphify update .`; use `/graphify .` for a full rebuild.
5. Keep `PROGRESS.md` updated before a session ends or compacts: state, changes, next steps, blockers.
