const MAP_SVG = `
<svg
  class="world-map__svg"
  viewBox="0 0 1600 1000"
  preserveAspectRatio="xMidYMid slice"
  xmlns="http://www.w3.org/2000/svg"
  focusable="false"
>
  <defs>
    <pattern id="wm-grid" width="80" height="80" patternUnits="userSpaceOnUse">
      <path d="M80 0H0V80" fill="none" stroke="currentColor" stroke-opacity=".12" stroke-width=".6" />
    </pattern>
    <pattern id="wm-ticks-x" width="80" height="14" patternUnits="userSpaceOnUse">
      <path d="M0 0V6" fill="none" stroke="currentColor" stroke-opacity=".28" stroke-width="1" />
    </pattern>
    <pattern id="wm-ticks-y" width="14" height="80" patternUnits="userSpaceOnUse">
      <path d="M0 0H6" fill="none" stroke="currentColor" stroke-opacity=".28" stroke-width="1" />
    </pattern>
    <filter id="wm-glow" x="-200%" y="-200%" width="400%" height="400%">
      <feGaussianBlur stdDeviation="2.6" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <path id="wm-grand-path" d="M180 860C390 740 560 630 760 535S1120 330 1410 190" />
    <path id="wm-calm-path" d="M455 335C610 175 990 175 1145 335" />
    <symbol id="wm-star" viewBox="-8 -8 16 16">
      <path d="M0-7 1.5-1.5 7 0 1.5 1.5 0 7-1.5 1.5-7 0-1.5-1.5Z" />
    </symbol>
  </defs>

  <rect class="wm-grid" width="1600" height="1000" fill="url(#wm-grid)" />

  <g class="wm-frame">
    <rect x="36" y="28" width="1528" height="944" />
    <rect class="wm-frame__inner" x="56" y="48" width="1488" height="904" />
    <rect x="36" y="28" width="1528" height="14" fill="url(#wm-ticks-x)" />
    <rect x="36" y="958" width="1528" height="14" fill="url(#wm-ticks-x)" />
    <rect x="36" y="28" width="14" height="944" fill="url(#wm-ticks-y)" />
    <rect x="1550" y="28" width="14" height="944" fill="url(#wm-ticks-y)" />
  </g>

  <g class="wm-coords">
    <text x="80" y="19">N 23° 20'</text>
    <text x="800" y="19" text-anchor="middle">THE GRAND LINE · CHART 001</text>
    <text x="1520" y="19" text-anchor="end">E 85° 19'</text>
    <text x="80" y="991">LOG POSE / TRUE NORTH</text>
    <text x="1520" y="991" text-anchor="end">SCALE / UNKNOWN</text>
  </g>

  <g class="wm-sea">
    <ellipse class="wm-line wm-line--bright" cx="800" cy="500" rx="470" ry="330" />
    <ellipse class="wm-line wm-line--faint wm-dash" cx="800" cy="500" rx="392" ry="272" />
    <ellipse class="wm-line" cx="800" cy="500" rx="310" ry="212" />
    <path class="wm-line wm-line--faint" d="M330 500H286M1270 500H1314M800 170V126M800 830V874" />
    <path class="wm-line wm-line--faint" d="M442 286q16-9 32 0t32 0M1094 286q16-9 32 0t32 0M442 714q16-9 32 0t32 0M1094 714q16-9 32 0t32 0" />
    <path class="wm-line wm-line--faint" d="M350 430q18-10 36 0t36 0M1178 430q18-10 36 0t36 0M350 570q18-10 36 0t36 0M1178 570q18-10 36 0t36 0" />
    <text class="wm-label wm-label--track">
      <textPath href="#wm-calm-path" startOffset="50%" text-anchor="middle">THE CALM BELT</textPath>
    </text>
  </g>

  <g class="wm-redline">
    <path class="wm-line wm-line--bright" d="M230 500H1370" />
    <path class="wm-line wm-line--faint wm-dash" d="M230 507H1370" />
    <path class="wm-line wm-line--faint" d="M250 494v13M330 494v13M410 494v13M490 494v13M570 494v13M650 494v13M730 494v13M810 494v13M890 494v13M970 494v13M1050 494v13M1130 494v13M1210 494v13M1290 494v13M1350 494v13" />
    <text class="wm-label" x="242" y="486">RED LINE</text>
  </g>

  <g class="wm-grandline">
    <use class="wm-line wm-line--bright" href="#wm-grand-path" />
    <use class="wm-line wm-line--faint wm-dash wm-offset" href="#wm-grand-path" />
    <text class="wm-label wm-label--track">
      <textPath href="#wm-grand-path" startOffset="57%">GRAND LINE</textPath>
    </text>
  </g>

  <g class="wm-routes">
    <path d="M640 660C690 620 735 575 790 540" />
    <path d="M790 540C865 555 920 585 960 620" />
    <path d="M960 620C960 680 950 735 940 780" />
    <path d="M940 780C865 815 760 815 700 800" />
    <path d="M720 300C760 330 775 400 790 540" />
    <path d="M880 250C900 350 850 450 790 540" />
    <path d="M600 430C680 455 735 495 790 540" />
    <path d="M700 800C650 760 620 700 640 660" />
    <path class="wm-route--faint" d="M400 600C480 580 560 560 640 660" />
    <path class="wm-route--faint" d="M1200 400C1080 430 1000 500 960 620" />
  </g>

  <g class="wm-islands">
    <g class="map-island" data-map-stage="home" transform="translate(640 660)">
      <path class="map-island__land" transform="rotate(-6) scale(1.05)" d="M-31-5c3-13 17-23 31-20 13 2 23 13 24 26 1 12-9 23-21 26-13 3-27-3-33-14-4-7-3-12-1-18Z" />
      <path class="map-island__contour" transform="rotate(-6) scale(1.05)" d="M-16-5c3-7 10-11 17-9 7 2 11 8 10 15-1 7-8 12-15 11-7-1-13-7-13-14 0-1 0-2 1-3Z" />
      <circle class="map-island__ring" r="8" />
      <circle class="map-island__dot" r="2.4" />
      <text class="map-island__label" x="38" y="3">EAST BLUE</text>
    </g>

    <g class="map-island" data-map-stage="about" transform="translate(720 300)">
      <path class="map-island__land" transform="rotate(12) scale(.85)" d="M-28-9c7-12 22-17 34-11 12 6 18 19 15 31-3 13-16 21-29 19-13-2-23-13-24-26-1-5 2-9 4-13Z" />
      <path class="map-island__contour" transform="rotate(12) scale(.85)" d="M-15-6c3-6 10-8 15-5 5 3 7 9 5 14-2 5-8 8-13 6-5-2-8-8-7-13 0-1 0-1 0-2Z" />
      <circle class="map-island__ring" r="8" />
      <circle class="map-island__dot" r="2.4" />
    </g>

    <g class="map-island" data-map-stage="skills" transform="translate(880 250)">
      <path class="map-island__land" transform="rotate(-18) scale(.75)" d="M-35 0c2-14 14-24 28-24 15 0 28 10 31 24 3 13-8 25-22 28-14 3-29-4-35-17-1-3-2-7-2-11Z" />
      <path class="map-island__contour" transform="rotate(-18) scale(.75)" d="M-16-4c3-7 10-11 17-9 7 2 11 8 10 15-1 7-8 12-15 11-7-1-13-7-13-14 0-1 0-2 1-3Z" />
      <circle class="map-island__ring" r="8" />
      <circle class="map-island__dot" r="2.4" />
    </g>

    <g class="map-island" data-map-stage="projects" transform="translate(790 540)">
      <path class="map-island__land" transform="rotate(24)" d="M-29-6c4-11 15-18 27-17 13 1 23 11 25 24 2 12-6 23-18 27-13 4-27-1-34-12-4-7-4-14 0-22Z" />
      <path class="map-island__contour" transform="rotate(24)" d="M-14-4c3-6 9-9 15-7 6 2 9 7 8 13-1 5-7 9-13 8-6-1-11-6-11-12 0-1 0-1 1-2Z" />
      <circle class="map-island__ring" r="8" />
      <circle class="map-island__dot" r="2.4" />
      <text class="map-island__label" x="38" y="3">GRAND LINE</text>
    </g>

    <g class="map-island" data-map-stage="education" transform="translate(600 430)">
      <path class="map-island__land" transform="rotate(40) scale(.9)" d="M-31-5c3-13 17-23 31-20 13 2 23 13 24 26 1 12-9 23-21 26-13 3-27-3-33-14-4-7-3-12-1-18Z" />
      <path class="map-island__contour" transform="rotate(40) scale(.9)" d="M-16-5c3-7 10-11 17-9 7 2 11 8 10 15-1 7-8 12-15 11-7-1-13-7-13-14 0-1 0-2 1-3Z" />
      <circle class="map-island__ring" r="8" />
      <circle class="map-island__dot" r="2.4" />
    </g>

    <g class="map-island" data-map-stage="experience" transform="translate(960 620)">
      <path class="map-island__land" transform="rotate(-32) scale(1.05)" d="M-28-9c7-12 22-17 34-11 12 6 18 19 15 31-3 13-16 21-29 19-13-2-23-13-24-26-1-5 2-9 4-13Z" />
      <path class="map-island__contour" transform="rotate(-32) scale(1.05)" d="M-15-6c3-6 10-8 15-5 5 3 7 9 5 14-2 5-8 8-13 6-5-2-8-8-7-13 0-1 0-1 0-2Z" />
      <circle class="map-island__ring" r="8" />
      <circle class="map-island__dot" r="2.4" />
      <text class="map-island__label" x="-38" y="3" text-anchor="end">NEW WORLD</text>
    </g>

    <g class="map-island" data-map-stage="resume" transform="translate(700 800)">
      <path class="map-island__land" transform="rotate(8) scale(.8)" d="M-35 0c2-14 14-24 28-24 15 0 28 10 31 24 3 13-8 25-22 28-14 3-29-4-35-17-1-3-2-7-2-11Z" />
      <path class="map-island__contour" transform="rotate(8) scale(.8)" d="M-16-4c3-7 10-11 17-9 7 2 11 8 10 15-1 7-8 12-15 11-7-1-13-7-13-14 0-1 0-2 1-3Z" />
      <circle class="map-island__ring" r="8" />
      <circle class="map-island__dot" r="2.4" />
    </g>

    <g class="map-island" data-map-stage="contact" transform="translate(940 780)">
      <path class="map-island__land" transform="rotate(-12) scale(1.1)" d="M-29-6c4-11 15-18 27-17 13 1 23 11 25 24 2 12-6 23-18 27-13 4-27-1-34-12-4-7-4-14 0-22Z" />
      <path class="map-island__contour" transform="rotate(-12) scale(1.1)" d="M-14-4c3-6 9-9 15-7 6 2 9 7 8 13-1 5-7 9-13 8-6-1-11-6-11-12 0-1 0-1 1-2Z" />
      <circle class="map-island__ring" r="8" />
      <circle class="map-island__dot" r="2.4" />
      <text class="map-island__label" x="-42" y="3" text-anchor="end">LAUGH TALE</text>
    </g>

    <g class="map-island" transform="translate(400 600)">
      <path class="map-island__land" transform="rotate(70) scale(.65)" d="M-28-9c7-12 22-17 34-11 12 6 18 19 15 31-3 13-16 21-29 19-13-2-23-13-24-26-1-5 2-9 4-13Z" />
      <path class="map-island__contour" transform="rotate(70) scale(.65)" d="M-15-6c3-6 10-8 15-5 5 3 7 9 5 14-2 5-8 8-13 6-5-2-8-8-7-13 0-1 0-1 0-2Z" />
      <circle class="map-island__dot" r="2.2" />
    </g>

    <g class="map-island" transform="translate(1200 400)">
      <path class="map-island__land" transform="rotate(-60) scale(.7)" d="M-31-5c3-13 17-23 31-20 13 2 23 13 24 26 1 12-9 23-21 26-13 3-27-3-33-14-4-7-3-12-1-18Z" />
      <path class="map-island__contour" transform="rotate(-60) scale(.7)" d="M-16-5c3-7 10-11 17-9 7 2 11 8 10 15-1 7-8 12-15 11-7-1-13-7-13-14 0-1 0-2 1-3Z" />
      <circle class="map-island__dot" r="2.2" />
    </g>
  </g>

  <g class="wm-compass" transform="translate(230 210)">
    <circle class="wm-line wm-line--bright" r="54" />
    <circle class="wm-line wm-line--faint wm-dash" r="42" />
    <path class="wm-line wm-line--faint" d="M0-66V-58M0 58V66M-66 0H-58M58 0H66" />
    <path class="wm-line wm-line--bright" d="M0-52 11-11 52 0 11 11 0 52-11 11-52 0-11-11Z" />
    <path class="wm-line wm-line--faint" d="M0-38 8-8 38 0 8 8 0 38-8 8-38 0-8-8Z" />
    <circle class="wm-line" r="4" />
    <text class="wm-label wm-compass__label" x="0" y="-72" text-anchor="middle">N</text>
    <text class="wm-label wm-compass__label" x="72" y="3">E</text>
    <text class="wm-label wm-compass__label" x="0" y="82" text-anchor="middle">S</text>
    <text class="wm-label wm-compass__label" x="-72" y="3" text-anchor="end">W</text>
  </g>

  <g class="wm-stars">
    <use href="#wm-star" x="300" y="310" width="12" height="12" />
    <use href="#wm-star" x="1320" y="690" width="14" height="14" />
    <use href="#wm-star" x="560" y="140" width="9" height="9" />
    <use href="#wm-star" x="1070" y="890" width="11" height="11" />
    <use href="#wm-star" x="1100" y="130" width="8" height="8" />
    <use href="#wm-star" x="220" y="760" width="10" height="10" />
  </g>
</svg>
`;

export function initWorldMap(reducedMotion: boolean): void {
  const app = document.querySelector<HTMLElement>("#app");
  if (!app || document.querySelector("#world-map")) return;

  const layer = document.createElement("div");
  layer.id = "world-map";
  layer.className = "world-map";
  layer.setAttribute("aria-hidden", "true");
  layer.innerHTML = MAP_SVG;

  const canvas = app.querySelector("#led-canvas");
  if (canvas) canvas.insertAdjacentElement("afterend", layer);
  else app.prepend(layer);

  const svg = layer.querySelector<SVGSVGElement>(".world-map__svg");
  const islands = Array.from(layer.querySelectorAll<SVGGElement>(".map-island"));
  const narrow = window.matchMedia("(max-width: 879px)").matches;
  const mobileSections = narrow
    ? Array.from(document.querySelectorAll<HTMLElement>("#mobile-flow [id^='flow-']"))
    : [];

  const syncStage = (): void => {
    const stage = document.body.dataset.stage ?? "home";
    for (const island of islands) {
      island.classList.toggle("is-current", island.dataset.mapStage === stage);
    }
  };

  const stageObserver = new MutationObserver(syncStage);
  stageObserver.observe(document.body, {
    attributes: true,
    attributeFilter: ["data-stage"],
  });
  syncStage();

  const updateMobileStage = (): void => {
    if (mobileSections.length === 0) return;
    const marker = window.innerHeight * 0.36;
    let current = "home";
    for (const section of mobileSections) {
      if (section.getBoundingClientRect().top <= marker) {
        current = section.id.replace(/^flow-/, "");
      }
    }
    if (document.body.dataset.stage !== current) {
      document.body.dataset.stage = current;
    }
  };

  let queued = false;
  const update = (): void => {
    queued = false;
    updateMobileStage();
    if (reducedMotion || !svg) return;
    const maxScroll = Math.max(
      0,
      document.documentElement.scrollHeight - window.innerHeight,
    );
    const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    const shift = (Math.max(0, Math.min(1, progress)) - 0.5) * 76;
    svg.style.setProperty("--wm-shift", `${shift.toFixed(2)}px`);
  };

  const requestUpdate = (): void => {
    if (queued) return;
    queued = true;
    window.requestAnimationFrame(update);
  };

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate, { passive: true });
  update();
}
