# Progress

## 2026-11-06 — Stage A: resume sync, layout and behaviour

- Added `src/resume.ts` as the single resume source of truth for November 2026: identity, status, summary, education, internship, three projects, six skill groups, achievements, dates and metrics. `src/content.ts` now derives desktop, mobile and Quick View content from it.
- Replaced the stale September PDF with a generated one-page November 2026 PDF. `npm run resume:pdf` renders it from `RESUME_SOURCE`; `npm run check:resume` extracts every numeric/date token from Quick View and fails if it is absent from the source block.
- Migrated the Enterprise Data Warehouse from Projects into Experience. Projects are now inventory optimization, business AI agent and customer churn in resume order with corrected metrics (`15+ metrics`, `7,043 customers`, `42.7% vs 2.8%`). Experience includes a warehouse detail panel and internship metrics.
- Removed the Class XII entry, old skill themes and SQL Server from skills; added CGPA, coursework chips, six plain skill groups, Delhi location and the exact status line across Home, About, Contact, mobile and Quick View.
- Layout: 3×2 skills grid with left compass artwork; wide-screen type/art scaling; 12/13px minimums; gold metric values over labels; text-first project details with the empty particle frame collapsed; single education card; compact internship/achievement entries; Quick View 880px reading column with sticky Download Resume/Close; gold fallback CTA and eight-section link list.
- Header/rail cleanup: removed signal and subtitle, rail is dots with only the active label, 26px hit areas. Mobile hero uses 100svh, header-safe top padding and two-line status; ghost map layers, atmosphere dot grid and orbit are hidden on mobile.
- Behaviour: added `data-led-state="settled"` after morph completion and updated screenshot scripts to wait for it; added Experience detail open/close and Escape handling; slow-FPS toast now auto-hides after 12s and appears once per session; mark egg fades the contact column while “THE ONE PIECE IS REAL” is visible.
- Visual fixes: project dock scrims and 1366 compact layout (all three projects fit without scroll); about/experience/resume/contact readability; project particle title clears the index; mobile static project grid bug fixed.
- QA: `check`, `build`, `check:resume`, `test`, `qa`, `quick-check`, `interaction-check` pass. Only expected fallback WebGL console errors and the Three.js chunk warning remain. Desktop and mobile audits report no visible text below 12/13px and no horizontal overflow.
- Captures: `/tmp/opencode/stagea-final4` (40 current Stage A screenshots), `/tmp/opencode/stagea-hidden` (project bottoms, Quick View, toasts, eggs, mobile projects). Contact sheets and individual copies: `/home/abhed/Pictures/LED Grand Line Stage A/`.
- Remaining TODOs: individual repository/demo URLs for the three projects and warehouse (currently the real GitHub profile); owner confirmation that `LINKEDIN_URL` resolves. Stage B artwork is intentionally blocked until owner approval.
- Commit note: Stage A combines the content, layout, behaviour and QA phases into one commit because they share the same files; this deviation is recorded intentionally.
- Next: owner review of the Stage A checkpoint. Do not start Stage B artwork until explicitly approved.

## 2026-11-04 — Readability, accessibility and finish pass
- Integrated Phases 2–9 from the handover into one working pass: readable sans body copy, 2×2 skill cards, wider resume column, gold CTA/rail/focus system, unified particle edge/fill weighting, original back-view Luffy silhouette, gold hat band and lion figurehead, lite mobile tier, adaptive point-budget reduction, mobile section vignettes, loader skip/keyboard support, slow-FPS Quick View toast, opt-in analytics, and refreshed metadata/favicon.
- Removed remaining progress clutter: loader coordinates, right-edge coordinate label, orphan scene-note/index/skills-ring CSS and DOM, and the old scroll cue.
- Wired engine visibility pause, reduced-motion snap/morph gating, click/burst gating for mobile and reduced motion, and loader skip (button plus Escape).
- Added `src/ui/analytics.ts` (off unless provider, id and script URL are configured) and `src/ui/vignettes.ts` (blue dot-matrix mobile section motifs).
- Updated `index.html` metadata, added a real `#main-content` skip target, and replaced the favicon with an LED skull wearing a gold-banded straw hat.
- Documentation: refreshed README tier/adaptive/scene-label notes and added this pass record.
- QA: `npm run check`, `npm run build`, `npm run test` (4/4), `npm run quick-check`, `npm run interaction-check`, and the full screenshot matrix at 1440×900, 1366×768, 390×844 and 320×720 pass. No unexpected console messages; only the intentional no-WebGL fallback and the >440 kB Three.js chunk warning remain. No horizontal overflow. No visible text below 12px.
- Final layout fixes: removed stale absolute-position offsets that broke the 2×2 skill grid at 1366×768, shifted the Projects particle title clear of the index, and removed the stray project count so the right rail is the only progress indicator. The project dock still needs a small internal scroll at shorter heights; all content remains reachable.
- Remaining content TODOs: business AI agent measured result; certifications array; individual project repository/demo links; analytics credentials.
- Graph refreshed after the pass: 436 nodes, 731 edges, 26 communities.
- Commit note: phases were combined into one integrated polish commit instead of strict per-phase commits because the working tree already mixed Phase 2–9 edits in the same files. This deviation is intentional and recorded here.

## 2026-11-03 — Graphify setup verification
- Re-verified Python 3.14.4, graphifyy 0.9.17 (uv tool; pipx unavailable), and the OpenCode skill at `~/.config/opencode/skills/graphify/`.
- Confirmed `.graphifyignore` excludes `node_modules/`, `dist/`, `build/`, logs, and large binary/data files.
- Re-ran `graphify install --platform opencode` and `graphify opencode install`; plugin and AGENTS.md instructions are in place.
- Rebuilt the code graph with `graphify update .`: 413 nodes, 692 edges, 24 communities. `graphify query`, `path`, and `explain` all return results.
- Verified OpenCode loads both plugins via `opencode plugin list`: `opencode-dcp 3.2.0` and `.opencode/plugins/graphify.js`. Root `opencode.json` keeps compaction `auto`/`prune` and the DCP plugin.
- AGENTS.md is 46 lines. Current graph commit: `f9c53ac5`; run `graphify update .` again after code changes.

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
