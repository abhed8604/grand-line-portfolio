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

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

When the user types `/graphify`, use the installed graphify skill or instructions before doing anything else.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- Dirty graphify-out/ files are expected after hooks or incremental updates; dirty graph files are not a reason to skip graphify. Only skip graphify if the task is about stale or incorrect graph output, or the user explicitly says not to use it.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
