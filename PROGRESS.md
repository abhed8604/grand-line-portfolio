# Progress

## 2026-11-10 — Island camera, living LEDs, smaller cursor and chart-card panels

- Sea-chart camera now uses per-chapter anchor points, so the active island clears the reading panel: Skills/Projects/Experience/Contact sit left of their right-side panels, while the left-panel chapters (About/Education/Resume) shift the island to the right. Base zoom rose from 0.86 to 1.02, camera speed from 0.12 to 0.18, and map/grid opacity to 0.34/0.12. Each chapter now shows only 2–4 neighbouring islands instead of the same four, and every chapter has a distinct island position.
- Current-island labels are exempt from chart label culling, so the name and coordinates stay visible. Current ring, halo and port pulse are stronger; visited islands are dimmed. This makes the island change readable even behind dense particle art.
- LED art is visibly alive: idle drift 0.55→1.35, push radius 54→38, push strength 980→780, ripple strength 600→520. The vertex shader adds faster two-harmonic drift, stronger shape-wide breathing/sway, more twinkling LEDs and more frequent sparkles. Reduced motion still suppresses the movement.
- Cursor glow is smaller and dimmer: head 11→8px, interactive ring 36→26px, ripple 54→36px, shorter crosshair and softer shadows. The shader cursor halo now uses a tighter radius (`pushRadius*.12` to `.72`) and roughly half the previous colour/size/alpha boost.
- Desktop reading panels now use a CSS-only nautical chart-card treatment: translucent ice-blue glass, eight corner ticks, fine chart grid, left accent rail, dotted panel rules, dashed row separators, nested education/skill plates and clipped metric chips. Panel headings use Anybody with uppercase tracking, micro-labels use Doto, and body copy stays Hanken Grotesk for readability.
- QA: `npm run check` passes; `npm test` 6 passed (29.3s); `npm run build` passes with only the existing 524.06 kB Three.js chunk warning; `npm run interaction-check` passes with `MESSAGES []`. Captured all eight desktop chapters at 1440×900 and mobile About/Contact at 390×844; confirmed current-island labels, panel clearance, no horizontal overflow and visible frame-to-frame LED motion. Graph refreshed: 533 nodes, 876 edges, 33 communities. No commit or push.

## 2026-11-10 — Ponytail audit fixes

- Fixed chapter navigation so `goTo()` no longer activates the destination tab, hash and `aria-current` before the 1.2s scroll arrives. Immediate jumps and reduced-motion still activate at once, and nav clicks still close an open project or experience panel immediately.
- Escape now leaves Quick View to its native dialog close and no longer closes the project or experience panel behind it.
- Resize now rebuilds every chapter target cloud for the new viewport, active chapter first, with a generation guard and a rebuild of the open project cloud. `targetCache` now holds only project/one-piece clouds; the dead loader/home/section writes were removed.
- Shared morph timing: `MORPH_LOCK_START_SECONDS` 2.4, `MORPH_LOCK_END_SECONDS` 3.4 and `MORPH_SETTLE_MS` 3400 now drive both the shaders and `ledState="settled"`.
- Quick View contents links subtract the scroll container's offset, so section headings are no longer clipped.
- Social preview image uses the absolute GitHub Pages URL.
- Removed the hidden sea-chart ship and its route sampling; label culling now caches reading-panel rectangles and throttles to 120ms.
- Removed unused `MotionSpec`, `motionFor()` and extra `TargetCloud` metadata.
- Added `playwright.config.ts` and `src/scroll/story.test.ts` with nav-arrival and resize-cloud regressions; `npm test` now runs all Playwright tests.
- QA: `npm run check`, `npm test` (6 passed), `npm run build` (only the existing three.js chunk warning) and `npm run interaction-check` (no console messages, zero mobile overflow) pass. Manual probes confirm Escape closes only Quick View and Quick View contents land with the heading visible.
- Graph refreshed: 528 nodes, 874 edges, 30 communities.
- No commit or push made. Untracked `skills/` preserved.

## 2026-11-10 — Blue palette, arrival-aligned tabs and layout rhythm

- Removed the gold palette completely. The theme now uses layered ice blues only (`--accent`, `--accent-soft`, `--accent-bright`, `--accent-deep`), including chart highlights, chips, quick-view icon, status dots, shader accent particles and the favicon hat band. Bronze/Silver/Gold resume wording is factual content and stays. Regenerated `public/og.png` from the new hero palette.
- All eight right-side nav labels are now visible at rest instead of only the active label. Active labels still brighten; hover uses the standard accent.
- Deleted the bottom-left “GRAND LINE / ROUTE” overview card and the phone route rail, including their SVG, state-update and CSS code. The sea-chart camera remains the only route indicator.
- Stage handoff now waits until the camera has visually arrived: `stageForProgress()` adds a 0.06-stage settle after each boundary, handles backwards scrolling immediately and still allows direct jumps. Sea-chart `cameraSpeed` rose from 0.085 to 0.12 so travel settles around the same moment the tab changes. Verified at 1440×900 that at raw stage 1.008 the island is About while the tab is still Home, and the tab changes at raw 1.072.
- Particle art is livelier: `idleDrift` is 0.55 (about 2px combined) and the render vertex shader adds a subtle shape-wide breath/sway (0.6% scale, ~2.4px x / ~1.8px y) suppressed under reduced motion. Gold-tagged particles became blue accent marks (`accentLow` deep blue, `accentHigh` ice white).
- Alternating composition: About, Education and Resume now put copy on the left and particle art on the right; Home, Skills, Projects, Experience and Contact keep art-left/copy-right. Target-factory positions and motion centres were mirrored, the final desktop-only CSS keeps the reading panels legible, and Education panels scroll internally at shorter viewports.
- Renamed target-layer “gold” identifiers to “accent” and updated the README fallback wording.
- QA: `npm run check` and `npm run build` pass (only the existing three.js chunk-size warning). Captures at 1440×900, 1280×800, 1024×768, 900×800 and mobile 390×844 confirm no yellow, all nav labels visible, no route card, alternating sides and readable panels. No commit or push was made. Untracked `skills/` preserved.

## 2026-11-10 — Readability, route map and responsive polish

- Particle titles (`TRAINING ARC`, `NEW WORLD`, `GRAND LINE`, `WANTED`) now settle crisply and stay sharp on slow devices. The spring ramp/settle window was shortened, attraction raised, idle drift lowered, and the position pass gained a wall-clock lock (`uMorphAge` 2.4–3.4s) that places every LED exactly on its target even when a low-FPS device cannot run enough simulation steps. Brightness is capped with a fragment `uExposure` uniform (0.68 at ≤879px, 0.92 desktop), smaller points and a slightly tighter halo.
- Mobile/tablet particle art is bound to the Home hero (`#led-canvas` is absolute and 100svh) instead of sitting fixed behind every chapter. The mobile loader is opaque, so the page can no longer ghost through boot.
- The travelling chart ship is replaced by a real route overview. Desktop/tablet use a fixed bottom-left card with the full route, eight island nodes, a pulsing “you are here” dot and an `01 / 08` readout; phones use a narrow fixed left-edge rail so it cannot cover copy. The map hides on Home, in Quick View, print and no-WebGL. Chart labels are culled when they leave the viewport or overlap a reading panel, and all SVG chart text is hidden on mobile.
- Project panels start at the top of the dock and reset their scroll when a detail opens, so long titles are no longer clipped. HTML project marker labels open leftward and disappear while a detail is open.
- Content cleanup: removed About’s incorrect `FORMAT: PDF` fact and duplicated status lines from About/Contact, removed the duplicated coursework paragraph, and replaced the About note with a non-coursework sentence. Mobile Experience now shows the same summary, metrics and action as desktop instead of an invented intro and full bullet wall. No resume facts were invented.
- Education is now art-left with a plain right-side reading panel (shared translucent dark sidebar treatment, top-rule subsections) instead of an overlay card. Chapter body sizes, project/experience copy, skill clusters, footer micro-text and Quick View were unified and enlarged. Quick View is a 1040px dialog with an 880px reading column and 18px body; `LINKEDIN` no longer wraps; About has no `FORMAT` row. The Wanted poster’s noisy particle bounty text was removed, and `+9.9%` is rendered with an explicit gold plus sign.
- Tablet 700–879px has a true two-column long-form layout with a sticky left heading, capped measure, 17px body and a wider hero. The tablet footer gets 132px bottom padding so the fixed route card clears `Quick view / Back to top`.
- QA: `npm run check` and `npm run build` pass. Verified at desktop 1440×900, tablet 834×1112, mobile 390×844 and 360×800, plus Quick View, reduced motion, loader and no-WebGL fallback. No horizontal overflow; the phone rail and tablet card do not intersect text; tablet footer clearance ≈37px. Screenshots are in `/tmp/opencode/` (`v2-*` through `v11-*`). Remaining minor caveat: decorative chart lines remain visible behind mobile/tablet long-form copy, matching the existing visual identity; labels are hidden and body text stays readable.
- No commit or push was made in this pass. Untracked `skills/` was preserved.

## 2026-11-09 — Full visual archive contact sheets

- Captured the complete current site for six viewports: laptop 1366×768, desktop 1440×900, wide 1920×1080, mobile 390×844, tablet 834×1112 and mobile-small 360×800.
- Each view sheet includes all eight journey pages plus its hidden states: loader, Quick View top/body/bottom, contact final word, no-WebGL fallback and reduced-motion mode. Desktop/laptop/wide sheets also include the three project panels (top/body) and the Experience warehouse panel (top/body).
- Corrected the project inventory: `enterprise-warehouse` is the Experience detail, not a project panel. Fixed Quick View bottom captures to use instant scrolling so they reach Contact rather than stopping mid-panel.
- Output: `/home/abhed/Pictures/LED Grand Line Grids 2026-11-09/` — six 1800 px-wide contact sheets at 23 captures each for desktop/laptop/wide and 15 each for mobile/tablet/mobile-small, plus `originals/<view>/` with the full-resolution screenshots and `index.json`, and a README.
- No website source files changed.

## 2026-11-09 — Performance pass, square chart and wayfinding ship

- Fixed the low-tier point collapse: adaptive quality now measures against each tier's own frame budget (`budget * 1.24 + 1.5`) instead of a fixed 22 ms threshold. Low/lite target 30 fps, so they no longer auto-degrade to the 8K floor during normal play. Render scale drops to 0.8 before point count is reduced, and recovers when frame time improves.
- Raised the visible budgets: low is now 32,768 points (64 simulation rows) and lite 8,192 (16 rows). Desktop quality selection no longer forces 4 GB machines to lite; low-memory desktops start at low, and the benchmark thresholds are less conservative. Mobile/coarse pointers still start at lite.
- Engine render path: depth buffer disabled, object sorting disabled, color-only clears. The simulation shader now uses a cheap sin/cos flow when settled and only evaluates curl noise during morphs; the LED fragment shader uses squared-distance falloff instead of `length`/`pow`.
- Chart is now a 3200×3200 square: rectangular sea and double frame, square graticule and edge ticks replace the circular rim/clip. Islands were repositioned, with Contact/Laugh Tale moved inward so its label and note stay inside the frame at every camera stop.
- Ship is now a separate 104 px fixed overlay above the particle canvas (below text), rendered as an inline side-view sailboat with a dark hull, ice sails, mast, pennant, wake and halo. It stays upright and mirrors when the route heads west, so it remains recognizable instead of rotating into a paper-plane silhouette. Route and current-island ring visibility were increased modestly.
- Verified at 1440×900: Contact island is fully on screen (rect x≈345–606, y≈265–534 at the final camera pose), ship clear of the particle field. Mobile keeps the same route and camera with the simplified chart; reduced motion fits the static square and docks the ship at the current island. Quick View still hides the map and ship.
- QA: `npm run check` and `npm run build` pass. Final captures for Home/Projects/Contact at 1440×900 and 390×844, Quick View and reduced motion are in `/tmp/opencode/sea-chart-perf/final/`. At `?tier=low&debug=1` in headless SwiftShader the engine reports LOW / 33K / 36 FPS with no auto-degrade or console errors (RAF sample ~44 fps); hardware GPUs should be higher.

## 2026-11-08 — Sea chart visibility and mobile pass

- Replaced the raster chart path with the live vector SVG. The generated `public/sea-chart-map.png` was fully transparent, so normal loads were missing the circular sea, Red Line, graticule and Blue quadrant names; the file, `scripts/make-chart-map.mjs`, `scripts/debug-chart.mjs` and the `chart-map` script are removed. `src/ui/sea-chart.ts` is now the single source for the full map.
- Tuned visibility: `mapOpacity: 0.3`, `gridOpacity: 0.11`; mobile contrast multiplier `1.18` (effective 0.354 / 0.13). The sea has a faint water fill, Calm Belt bands are filled, the grid is dashed, and the Red Line/Grand Line/coast strokes are stronger while staying behind copy.
- Composition: removed the two large grid rings that read as graph paper; widened the home camera (`cameraZoom: 0.86`) and eased journey zoom from 0.95 to 1.08; repositioned the four Blue labels and the Red Line label; moved the Home label above its island and the route-end note below it.
- Mobile simplification now hides all sea labels, island names/notes, secondary calm lines, route labels and Reverse Mountain labels, keeping the same route and camera with thicker strokes.
- Reduced motion keeps the static chart and ship at the current chapter instead of always revealing the full route.
- Updated the stale `world-map.ts` references in `README.md` to `src/ui/sea-chart.ts`; Quick View now uses an opaque black backdrop so the chart cannot ghost around the dialog.
- QA: `npm run build` passes. Final captures at 1440×900 and 390×844 for Home, Projects and Contact (plus Quick View and reduced motion) are in `/tmp/opencode/sea-chart-final/`; tested at `?tier=low` (16,384 points). No blockers.

## 2026-11-08 — Graphify setup re-verified

- Confirmed Python 3.14.4 and graphifyy 0.9.17 (uv tool). `graphify install --platform opencode` and `graphify opencode install` report the skill, plugin hook and AGENTS.md integration already configured.
- `.graphifyignore` covers `node_modules/`, `dist/`, `build/`, logs and large binary/data formats. Root `opencode.json` already has compactions auto/prune and `@tarquinen/opencode-dcp@latest`.
- `AGENTS.md` is 46 lines; corrected its UI folder-map entry from the removed world map to `src/ui/sea-chart.ts`.
- Ran `graphify update .`: 527 nodes, 878 edges, 29 communities. `graphify query` resolves the sea-chart/story subgraph. No failures or blockers.

## 2026-11-07 — Sea chart background

- Replaced the old static world map with `src/ui/sea-chart.ts`; removed `src/ui/world-map.ts` and its import. The Three.js canvas now renders with `alpha: true` and a transparent clear so the chart can sit behind the particles while text stays above both.
- New original chart: 3600×2400 SVG sized to cover ~3× the viewport, circular sea, double-outlined Red Line with diagonal hatching, Grand Line plus two Calm Belt bands, four Blue quadrants, Reverse Mountain, compass rose, graticule with tick labels, currents, ships, sea monster, stars, and eight seeded noise-distorted islands in page order (Home through Contact/Laugh Tale).
- Scroll journey: damped camera pan/zoom follows section progress with a hold-and-ease travel curve; the dotted route reveals via `stroke-dashoffset`; a ship follows the route tangent. Visited islands stay bright, the current island gets an ice-blue halo, and unvisited islands use fog-of-war dimming. Side-nav clicks use the same camera motion.
- Readability: chart at z2, transparent particles at z3, text at z10. Desktop right-column/edge veil plus an education-specific left scrim; mobile has a stronger radial/vertical veil and a 1.12× map contrast multiplier. Labels use the display and Doto fonts. Map is hidden in Quick View, print and no-WebGL fallback.
- Fallbacks: mobile keeps the same route/camera with secondary detail hidden; reduced motion fits the whole chart statically, reveals the route and highlights the current island without camera movement.
- Config lives at the top of `src/ui/sea-chart.ts`: `mapOpacity: 0.26`, `gridOpacity: 0.11`, `cameraZoom: 1.02`, `cameraSpeed: 0.085`, `routeGlow: true`, `fogOfWar: true`.
- QA: `npm run build` passes. Playwright captures at 1440×900 (all eight sections, Quick View, reduced motion) and 390×844 (Home, Projects, Contact) are in `test-results/map-qa/`. Tested at `?tier=low` = 16,384 points with no console errors. SwiftShader comparison measured ~54 fps with the chart and ~59 without; the expensive SVG blur halos were replaced with a radial gradient, and only transforms/dash offsets animate.
- Next optional polish: mobile chart-label collisions at some camera positions and current-island visibility against the particle art.

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
