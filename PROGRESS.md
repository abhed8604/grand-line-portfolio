# Progress

## 2026-11-03 — Ponytail audit fixes
- Fixed resume download links: updated `safeHref` to permit relative dot paths (`./` and `../`), restoring PDF download across header, desktop resume, mobile flow, and Quick View.
- Synchronized project particle target on resize: exposed `selectedProjectId()` on `StoryController`, cleared stale `targetCache`, and remorphed to project cloud on resize.
- Clamped offscreen sampling canvas size to 16M pixels, preventing 24-bit integer overflow in candidate encoding on 5K/8K displays.
- Purged dead Log Pose and education note logic, queries, and over 250 lines of unused CSS.
- Cleaned unused icon path definitions (`mail`, `link`, `code`, `pin`) and unreferenced content keys.
- Fixed `simVertexShader` attribute declaration from `vec2` to `vec3` to match `PlaneGeometry` buffer attribute dimensions.
- Enabled particle bursts on desktop canvas click to match touch interaction.
- Removed orphaned `scripts/review-shots.mjs` script.
- Added fast unit test suite (`npm test`) using `@playwright/test` for URL safety and navigation integrity.
- Restructured `.gitignore` into organized sections (build outputs, test reports, local tools, logs, OS files) and updated `README.md` with test commands, accurate project structure, and testing guide.
- QA: `npm run check`, `npm run test`, and `npm run build` pass cleanly. Graph updated.

## 2026-11-02 — Graphify setup
- Verified Python 3.14.4 and graphifyy 0.9.17 (installed via `uv tool`; pipx was unavailable).
- Installed the OpenCode graphify skill and plugin, added `.graphifyignore`, and built the graph.
- Graph: 406 nodes, 686 edges, 36 communities in `graphify-out/`.
- Added `AGENTS.md`, root `opencode.json` (compaction auto/prune + DCP plugin), and this file.
- Graph health note: 62 dangling edges, mostly external imports (Playwright, Node built-ins), plus 13 collapsed same-endpoint edges.
- Next: run `npm run check` and `npm run quick-check` after changes; refresh the graph with `graphify update .`.

## 2026-11-02 — Audit and finish pass
- Audited all eight scenes at 1366×768 and 1440×900, mobile at 390×844 / 320×720, Quick View, and the no-WebGL fallback.
- Confirmed the existing scroll transitions, cursor ripples, particle push, idle drift and tuning constants; kept them intact.
- Enlarged the Log Pose dial and brightened/enlarged the mono copy and labels without changing the section flow.
- Sharpened the ship sails and wanted-poster portrait; rebuilt the New World chart as a clearer route map.
- Fixed project dock, resume side panel, skills card, 1080 nav gap, mobile Quick View overflow and mobile/static Copy Email.
- Content now includes the resume skill additions (Bash, Pandas/NumPy, MySQL, SHAP). `public/resume.pdf` matches the supplied September 2026 resume byte-for-byte.
- QA: `npm run check`, `npm run build`, `npm run quick-check`, and `scripts/interaction-check.mjs` pass. Only expected warnings remain: Experience scrolls at 1366, and WebGL errors appear in the intentional no-WebGL fallback test.
- Graph refreshed: 441 nodes, 719 edges, 41 communities.
- Next: process the supplied Luffy/Jolly Roger references into clean white-on-black silhouettes before feeding them to the sampler (deferred per request). Confirm final content text with Abhed.

## 2026-11-02 — Codebase cleanup
- Deleted 15 one-off/debug scripts (including art-preview, layout probes and the placeholder résumé generator); kept the five maintained QA/capture scripts and wired `interaction-check` into npm.
- Removed unused `arrowLink`/`ledButton`/`renderStaticSectionLinks` helpers, unused cursor constants/locals, the dead `paintTargetPreview` export, and two unused CSS rules.
- Fixed `qa-capture.mjs` to select the first live project row instead of the removed `project-one` ID.
- Synchronized `package.json` devDependencies with the installed toolchain (TypeScript 7.0.2, Vite 8.3.5, Playwright 1.64.1, types). `npm ci` succeeds and the lockfile name now matches `led-grand-line`.
- Updated README stack, commands, asset instructions and QA notes; removed the stale résumé-generator warning.
- QA: `npm run check`, `npm run build`, `npm run quick-check`, `npm run qa`, `npm run interaction-check`, and `tsc --noUnusedLocals --noUnusedParameters` pass. Expected warnings only: Experience scrolls at 1366 and WebGL errors in the intentional fallback.
- Removed generated `dist/`.
- Next: image-reference cleanup deferred; confirm final content text with Abhed.
