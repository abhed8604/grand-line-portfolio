# LED Grand Line

A One Piece–inspired portfolio for **Abhed Srivastava**, focused on data engineering, analytics and applied AI. Ice-blue LED particles form a scroll-driven journey through eight chapters, with a readable mobile layout and a plain-text Quick View.

> Fan tribute. One Piece © Eiichiro Oda / Shueisha.

## Features

- **Desktop voyage:** a fixed WebGL particle canvas morphs between Home, About, Skills, Projects, Education, Experience, Résumé and Contact.
- **Interactive projects:** selectable islands and project rows open a text-first detail panel with Problem, Approach, Result, Stack and links.
- **Navigation:** chapter links and section dots track the journey. Chapters can also be opened directly through a URL.
- **Mobile edition:** screens narrower than 880px, or devices with a coarse pointer, use a document layout with a particle hero. The hero simulation pauses when it leaves view.
- **Quick View:** a native dialog presents the complete portfolio without requiring the particle engine.
- **Adaptive rendering:** GPU benchmarking selects a quality tier; when frame time stays high, the active particle budget drops in 30% steps and never increases again.
- **Motion and atmosphere:** an original SVG sea chart, cursor ripples, particle repulsion, shape-specific idle motion and three hidden interactions.
- **Readable fallback:** if WebGL initialization fails or its context is lost, the site switches to the document edition.

## Stack

| Technology            | Purpose                                                               |
| --------------------- | --------------------------------------------------------------------- |
| Vite 8 + TypeScript 7 | Development server, type checking and static production build         |
| Three.js              | WebGL rendering and GPGPU particle simulation                         |
| GSAP + ScrollTrigger  | Scroll-driven chapters, transitions and navigation                    |
| Lenis                 | Smooth desktop scrolling                                              |
| Fontsource            | Locally bundled Anybody, Doto and Hanken Grotesk fonts                |
| Playwright            | Unit tests, browser captures, visual diagnostics and social image     |

The application uses vanilla TypeScript, with no UI framework or backend.

## Getting started

### Requirements

- **Node.js 20.19+ or 22.12+**, as required by Vite 8; a current supported LTS release is recommended.
- **npm** to install the dependencies recorded in `package-lock.json`.
- A modern browser with WebGL2 support for the particle edition. JavaScript is required for the portfolio UI; without it, the page provides a résumé PDF link.

From the project directory:

```bash
npm ci
npm run dev
```

Open the URL printed by Vite, normally `http://localhost:5173`.

### Production build

```bash
npm run build
npm run preview
```

`build` runs TypeScript checking before generating `dist/`. The preview server normally runs at `http://localhost:4173`; it is for local verification, not production hosting.

## Commands

| Command               | Description                                                                                                  |
| --------------------- | ------------------------------------------------------------------------------------------------------------ |
| `npm run dev`         | Start the Vite development server                                                                            |
| `npm run check`       | Run TypeScript checking without emitting files                                                               |
| `npm run test`        | Run fast unit and link integrity tests                                                                       |
| `npm run build`       | Type-check and build into `dist/`                                                                            |
| `npm run preview`     | Serve the production build locally                                                                           |
| `npm run shots`       | Capture all desktop chapters at 1366 × 768 and mobile views at 390 × 844                                     |
| `npm run quick-check` | Capture selected layouts, mobile and the no-WebGL fallback; log browser diagnostics                          |
| `npm run qa`          | Capture desktop chapters at three sizes, plus loader, Quick View, reduced-motion, mobile and fallback states |
| `npm run interaction-check` | Run assertion-based browser checks for navigation, project details, Quick View, copy and layout collisions |
| `npm run check:resume` | Build, then verify every number and date in Quick View against `RESUME_SOURCE`              |
| `npm run resume:pdf`  | Regenerate `public/resume.pdf` from the canonical November 2026 resume source               |
| `npm run og`          | Capture the live hero as `public/og.png` at 1200 × 630                                                       |

## Content and customization

The canonical fact source is [`src/resume.ts`](src/resume.ts). Its `RESUME_SOURCE` block is the November 2026 resume text; `resume` exposes typed, structured entries and [`src/content.ts`](src/content.ts) derives the chapter, mobile and Quick View content from it.

`npm run check:resume` extracts numeric and date tokens from the rendered Quick View and fails if any token is absent from `RESUME_SOURCE`. `npm run resume:pdf` regenerates the one-page PDF from the same block.

| Content key                                     | Controls                                                  |
| ----------------------------------------------- | --------------------------------------------------------- |
| `resume`                                        | Canonical resume facts, dates, metrics, skills and links   |
| `meta`                                          | Runtime page metadata                                     |
| `brand`, `identity`                             | Site branding, name, role, biography and availability     |
| `nav`                                           | Chapter labels and particle titles                        |
| `sceneLabels`                                   | Particle microtype                                        |
| `ui`, `loader`                                  | Interface labels, loading messages and fallback copy      |
| `skills`, `projects`, `education`, `experience` | Derived chapter entries and readable layouts              |
| `contact`                                       | Email, social links and closing note                      |
| `easterEggs`                                    | Hidden-interaction labels and feedback                    |

When adapting the site:

1. Update the canonical block and typed entries in `src/resume.ts`, then verify every claim and contact link. Project links currently point to a GitHub profile; replace them with individual repositories or demos as appropriate.
2. Keep existing chapter IDs unless you also update the associated types, layouts and target-generation logic.
3. Update the static title, description, Open Graph and Twitter tags in [`index.html`](index.html) alongside `content.meta`, so the initial HTML and share metadata match.
4. Review decorative sea-chart labels and geometry in [`src/ui/sea-chart.ts`](src/ui/sea-chart.ts) if changing the theme; not every decorative label comes from the content module.
5. Regenerate the resume with `npm run resume:pdf`, replace or regenerate the other public assets, then rebuild.

### Public assets

- [`public/resume.pdf`](public/resume.pdf) — the downloadable November 2026 one-page résumé, generated from `src/resume.ts`.
- [`public/og.png`](public/og.png) — the social preview image.
- [`public/favicon.svg`](public/favicon.svg) — the LED-style favicon.

Asset generation requires Playwright's Chromium browser:

```bash
npx playwright install chromium
```

On Linux, missing browser system libraries may require `npx playwright install --with-deps chromium` and administrator permissions.

To regenerate the social image, first start a dev or preview server. The script defaults to port **4173**, so use `BASE_URL` when running the default dev server:

```bash
BASE_URL=http://127.0.0.1:5173 npm run og
```

The OG command overwrites `public/og.png`. Run `npm run build` afterward to include the new file in `dist/`.

## Project structure

```text
index.html                  HTML shell, static metadata and no-JavaScript notice
public/                     Résumé, social image and favicon
scripts/                    Asset generators and browser diagnostics
src/
  content.ts                Portfolio content and content types
  main.ts                   Boot sequence, mode selection, events and fallback
  styles.css                Layout, typography, visual effects and responsive rules
  engine/
    constants.ts            Quality tiers and device/motion helpers
    engine.ts               Renderer, GPU simulation and particle lifecycle
    motion.ts               Motion configuration
    quality.ts              GPU benchmark and initial tier selection
    shaders.ts              Simulation and LED rendering shaders
  scroll/story.ts           Desktop chapter and project transitions
  targets/
    shapes.ts               Original simplified silhouettes
    target-factory.ts       SVG/text sampling and particle target generation
  ui/
    build.ts                DOM layouts and content rendering
    build.test.ts           Unit tests for URL safety and navigation integrity
    cursor.ts               Pointer effects and ripple interaction
    icons.ts                Interface icons
    quickview.ts            Plain-edition dialog behavior
    sea-chart.ts            Scroll-driven SVG sea chart
vite.config.ts              Relative asset base and build configuration
```

## Particle engine

The visible particle field uses a single `THREE.Points` draw call, with additional GPU passes for simulation. SVG silhouettes and canvas-rendered text are sampled into target clouds on the CPU, then used by the GPU simulation to form and animate each scene.

Engine and target-generation modules are dynamically imported. Chapter targets are cached during boot; the active chapter or project target is regenerated after a debounced resize with automatic cache invalidation. The engine pauses when the tab is hidden or Quick View is open.

### Quality tiers

| Tier   |  Points | Active simulation rows | DPR cap |
| ------ | ------: | ---------------------: | ------: |
| high   | 150,016 |                    293 |     1.5 |
| medium |  65,024 |                    127 |     1.5 |
| low    |  32,768 |                     64 |       1 |
| lite   |   8,192 |                     16 |       1 |

Mobile/coarse-pointer devices default to lite quality; low-memory desktops start at low. Desktop selection uses a short GPU benchmark and device hints; detected software renderers default to low. Adaptive quality keeps the named tier but lowers the render scale before reducing the active point budget when frames run long, and restores render scale when headroom returns.

For repeatable captures or troubleshooting, force a tier:

```text
/?tier=high
/?tier=medium
/?tier=low
```

A forced tier disables automatic downgrading. Open a chapter directly with `?stage=projects` or `#projects`, and combine parameters when needed:

```text
/?tier=high&stage=projects
```

Valid chapter IDs are `home`, `about`, `skills`, `projects`, `education`, `experience`, `resume` and `contact`.

## Accessibility and motion

- Portfolio copy is rendered as real DOM text, including a full text edition in `#accessible-content`.
- Quick View uses a native `<dialog>` with keyboard focus handling, Escape-to-close and focus restoration.
- Navigation, project controls and easter-egg buttons are keyboard reachable; the skip link moves focus to the main content region.
- The no-WebGL fallback provides a bright ice-blue primary action and a linked list of all eight chapters.
- `prefers-reduced-motion` reduces animation and disables smooth scrolling and cursor ripples.
- Fine-pointer devices receive the custom cursor; touch devices do not receive a trailing cursor.
- WebGL failure preserves the JavaScript-rendered portfolio in the readable fallback layout. This is distinct from the no-JavaScript notice, which only links to the résumé.

### Easter eggs

1. **Straw hat:** activate the hat hotspot on Home to scatter and reassemble the particles.
2. **Following wind:** activate the ship hotspot on Projects to surge the route forward.
3. **Final poneglyph:** activate the X hotspot on Contact to temporarily form “THE ONE PIECE IS REAL.”

All three provide accessible labels and toast feedback.

## Testing and visual QA

### Unit tests

Run fast link and navigation integrity tests without needing a running server or browser window:

```bash
npm test
```

### Visual and behavioural QA

Install Chromium as described above, then keep a dev or preview server running in another terminal. The capture scripts do not start a server themselves. They wait for `document.body.dataset.ledState === "settled"` after each chapter or project morph, with an eight-second failure, before taking a screenshot.

Using the default dev-server port:

```bash
BASE_URL=http://127.0.0.1:5173 OUT_DIR=./artifacts/shots npm run shots
BASE_URL=http://127.0.0.1:5173 OUT_DIR=./artifacts/quick-check npm run quick-check
BASE_URL=http://127.0.0.1:5173 OUT_DIR=./artifacts/qa npm run qa
BASE_URL=http://127.0.0.1:5173 npm run interaction-check
```

Without overrides, the capture scripts use `http://127.0.0.1:4173`. `shots` and `quick-check` write to `/tmp/opencode/led-shots`; `qa` writes to `/tmp/opencode/led-qa2`. `interaction-check` prints assertions and exits non-zero on failure.

Headless captures use SwiftShader, so their FPS readings do not represent hardware GPU performance. Desktop captures force high quality for consistency. Inspect the results manually and verify motion and performance on a real device before publishing.

## Deployment

Deploy the **contents of `dist/`** to a static host after running `npm run build`. No application server, API keys or environment variables are required for the portfolio itself; `BASE_URL` and `OUT_DIR` are local script options.

Vite is configured with `base: "./"` for relative asset URLs. If hosting in a subdirectory, verify the résumé, favicon, generated bundles and share-image URLs at the deployed path. Use a public absolute social-image URL in the static metadata when required by your sharing platform.

Before publishing, verify the contact and project links, résumé contents, social preview, mobile layout, Quick View and reduced-motion/WebGL fallback behavior.

## Credits and licensing

This project is a personal, non-commercial fan tribute. One Piece and its characters belong to Eiichiro Oda and Shueisha. Silhouette artwork is an original simplified interpretation; no official artwork, logos, audio or music are bundled.

Footer credit: **Fan tribute. One Piece © Eiichiro Oda / Shueisha.**

No standalone software license file is currently included in this repository. The fan attribution above is not a software license.
