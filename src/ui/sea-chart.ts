import type { SectionId } from "../content";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  SEA CHART — the scroll-driven navigation chart behind the portfolio.
 * ─────────────────────────────────────────────────────────────────────────────
 *  Everything visual is generated once at boot. The frame loop only touches:
 *    • the chart layer's transform (camera pan / zoom)
 *    • the route mask's stroke-dashoffset (self-drawing route)
 *
 *  Tune the whole scene from CONFIG. Opacities are desktop values; mobile adds
 *  a little contrast and removes the secondary chart furniture.
 */

const CONFIG = {
  mapOpacity: 0.34, // coastlines, islands, Red Line, Grand Line
  gridOpacity: 0.12, // latitude / longitude grid, ticks, notes, decoration
  cameraZoom: 1.02, // base zoom; the journey adds a gentle zoom-in per chapter
  cameraSpeed: 0.18, // damping per 60fps frame
  routeGlow: true,
  fogOfWar: true,
} as const;

const WORLD_W = 3200;
const WORLD_H = 3200;
const CENTER_X = WORLD_W / 2;
const CENTER_Y = WORLD_H / 2;
const FRAME_INNER = 112;
const FRAME_SIZE = WORLD_W - FRAME_INNER * 2;
const SECTION_COUNT = 8;
const MOBILE_ZOOM = 0.72;
const MOBILE_QUERY = "(max-width: 879px)";

type Align = "start" | "middle" | "end";

interface Point {
  x: number;
  y: number;
}

interface IslandSpec {
  id: SectionId;
  label: string;
  x: number;
  y: number;
  rx: number;
  ry: number;
  seed: number;
  rotation: number;
  labelX: number;
  labelY: number;
  align: Align;
  coord: string;
  note?: string;
}

interface IslandShape {
  path: string;
  contourA: string;
  contourB: string;
  waves: string;
}

const ISLANDS: readonly IslandSpec[] = [
  {
    id: "home",
    label: "HOME",
    x: 2170,
    y: 2330,
    rx: 108,
    ry: 80,
    seed: 1103,
    rotation: -0.24,
    labelX: 0,
    labelY: -122,
    align: "middle",
    coord: "13°42′N · 048°10′E",
  },
  {
    id: "about",
    label: "ABOUT",
    x: 1980,
    y: 2550,
    rx: 94,
    ry: 71,
    seed: 2207,
    rotation: 0.42,
    labelX: -110,
    labelY: 30,
    align: "end",
    coord: "11°08′N · 045°22′E",
  },
  {
    id: "skills",
    label: "SKILLS",
    x: 2010,
    y: 1880,
    rx: 101,
    ry: 75,
    seed: 3313,
    rotation: -0.62,
    labelX: 0,
    labelY: -100,
    align: "middle",
    coord: "16°55′N · 043°04′E",
  },
  {
    id: "projects",
    label: "PROJECTS",
    x: 1760,
    y: 2080,
    rx: 112,
    ry: 83,
    seed: 4421,
    rotation: 0.78,
    labelX: 0,
    labelY: -120,
    align: "middle",
    coord: "14°27′N · 039°18′E",
  },
  {
    id: "education",
    label: "EDUCATION",
    x: 1470,
    y: 1260,
    rx: 97,
    ry: 73,
    seed: 5531,
    rotation: 0.18,
    labelX: 0,
    labelY: -112,
    align: "middle",
    coord: "30°12′N · 033°40′E",
  },
  {
    id: "experience",
    label: "EXPERIENCE",
    x: 1160,
    y: 1330,
    rx: 105,
    ry: 77,
    seed: 6643,
    rotation: -0.88,
    labelX: 0,
    labelY: 114,
    align: "middle",
    coord: "28°04′N · 028°57′E",
  },
  {
    id: "resume",
    label: "RESUME",
    x: 930,
    y: 890,
    rx: 89,
    ry: 69,
    seed: 7757,
    rotation: 0.54,
    labelX: -104,
    labelY: 4,
    align: "end",
    coord: "37°31′N · 025°16′E",
  },
  {
    id: "contact",
    label: "CONTACT",
    x: 680,
    y: 610,
    rx: 113,
    ry: 85,
    seed: 8861,
    rotation: -0.34,
    labelX: 0,
    labelY: -145,
    align: "middle",
    coord: "44°09′N · 019°48′E",
    note: "LAUGH TALE",
  },
];

/** Route control points in page order, with Reverse Mountain between chapters 4 and 5. */
const ROUTE_POINTS: readonly Point[] = [
  ...ISLANDS.slice(0, 4).map((island) => ({ x: island.x, y: island.y })),
  { x: CENTER_X, y: CENTER_Y },
  ...ISLANDS.slice(4).map((island) => ({ x: island.x, y: island.y })),
];

const GRAND_LINE_POINTS: readonly Point[] = [
  { x: 3100, y: 700 },
  { x: 2820, y: 940 },
  { x: 2520, y: 1210 },
  { x: 2220, y: 1455 },
  { x: 1900, y: 1580 },
  { x: 1600, y: 1600 },
  { x: 1300, y: 1730 },
  { x: 1010, y: 1910 },
  { x: 740, y: 2140 },
  { x: 470, y: 2380 },
  { x: 180, y: 2650 },
];

const RED_TOP: readonly Point[] = [
  { x: 120, y: 1548 },
  { x: 305, y: 1536 },
  { x: 490, y: 1552 },
  { x: 675, y: 1534 },
  { x: 860, y: 1548 },
  { x: 1045, y: 1532 },
  { x: 1230, y: 1550 },
  { x: 1415, y: 1537 },
  { x: 1600, y: 1528 },
  { x: 1785, y: 1544 },
  { x: 1970, y: 1536 },
  { x: 2155, y: 1552 },
  { x: 2340, y: 1534 },
  { x: 2525, y: 1548 },
  { x: 2710, y: 1533 },
  { x: 2895, y: 1550 },
  { x: 3080, y: 1537 },
];

const RED_BOTTOM: readonly Point[] = [
  { x: 120, y: 1688 },
  { x: 305, y: 1676 },
  { x: 490, y: 1692 },
  { x: 675, y: 1674 },
  { x: 860, y: 1688 },
  { x: 1045, y: 1672 },
  { x: 1230, y: 1690 },
  { x: 1415, y: 1677 },
  { x: 1600, y: 1668 },
  { x: 1785, y: 1684 },
  { x: 1970, y: 1676 },
  { x: 2155, y: 1692 },
  { x: 2340, y: 1674 },
  { x: 2525, y: 1688 },
  { x: 2710, y: 1673 },
  { x: 2895, y: 1690 },
  { x: 3080, y: 1677 },
];

function mulberry32(seed: number): () => number {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let t = value;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function n(value: number): string {
  return (Math.round(value * 10) / 10).toString();
}

function smoothPath(points: readonly Point[], closed: boolean): string {
  if (points.length === 0) return "";
  if (points.length < 3) {
    return `M${n(points[0].x)} ${n(points[0].y)}${points
      .slice(1)
      .map((point) => `L${n(point.x)} ${n(point.y)}`)
      .join("")}`;
  }

  const count = points.length;
  const at = (index: number): Point => {
    if (closed) return points[(index + count) % count];
    return points[Math.max(0, Math.min(count - 1, index))];
  };

  let path = `M${n(points[0].x)} ${n(points[0].y)}`;
  const segments = closed ? count : count - 1;
  for (let index = 0; index < segments; index += 1) {
    const p0 = at(index - 1);
    const p1 = at(index);
    const p2 = at(index + 1);
    const p3 = at(index + 2);
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    path += `C${n(c1x)} ${n(c1y)} ${n(c2x)} ${n(c2y)} ${n(p2.x)} ${n(p2.y)}`;
  }
  return closed ? `${path}Z` : path;
}

function sampleSpline(points: readonly Point[], samplesPerSpan = 16): Point[] {
  const result: Point[] = [];
  for (let index = 0; index < points.length - 1; index += 1) {
    const p0 = points[Math.max(0, index - 1)];
    const p1 = points[index];
    const p2 = points[index + 1];
    const p3 = points[Math.min(points.length - 1, index + 2)];
    for (let sample = 0; sample < samplesPerSpan; sample += 1) {
      const t = sample / samplesPerSpan;
      const t2 = t * t;
      const t3 = t2 * t;
      result.push({
        x:
          0.5 *
          (2 * p1.x +
            (-p0.x + p2.x) * t +
            (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
            (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
        y:
          0.5 *
          (2 * p1.y +
            (-p0.y + p2.y) * t +
            (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
            (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3),
      });
    }
  }
  result.push(points[points.length - 1]);
  return result;
}

function offsetPoints(points: readonly Point[], distance: number, wave = 0): Point[] {
  return points.map((point, index) => {
    const previous = points[Math.max(0, index - 1)];
    const next = points[Math.min(points.length - 1, index + 1)];
    const dx = next.x - previous.x;
    const dy = next.y - previous.y;
    const length = Math.max(0.001, Math.hypot(dx, dy));
    const drift = wave === 0 ? 0 : Math.sin((index / points.length) * Math.PI * 9) * wave;
    return {
      x: point.x - (dy / length) * (distance + drift),
      y: point.y + (dx / length) * (distance + drift),
    };
  });
}

function polylinePath(points: readonly Point[]): string {
  return points
    .map((point, index) => `${index === 0 ? "M" : "L"}${n(point.x)} ${n(point.y)}`)
    .join("");
}

function rotatedPoint(x: number, y: number, angle: number): Point {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return { x: x * cos - y * sin, y: x * sin + y * cos };
}

function islandShape(spec: IslandSpec): IslandShape {
  const random = mulberry32(spec.seed);
  const phaseA = random() * Math.PI * 2;
  const phaseB = random() * Math.PI * 2;
  const phaseC = random() * Math.PI * 2;
  const phaseD = random() * Math.PI * 2;
  const pointCount = 26;
  const points: Point[] = [];

  for (let index = 0; index < pointCount; index += 1) {
    const angle = (index / pointCount) * Math.PI * 2;
    const wobble =
      1 +
      Math.sin(angle * 3 + phaseA) * 0.115 +
      Math.sin(angle * 5 + phaseB) * 0.062 +
      Math.sin(angle * 7 + phaseC) * 0.038 +
      Math.sin(angle * 11 + phaseD) * 0.018;
    const grain = 1 + (random() * 2 - 1) * 0.018;
    const point = rotatedPoint(
      Math.cos(angle) * spec.rx * wobble * grain,
      Math.sin(angle) * spec.ry * wobble * grain,
      spec.rotation,
    );
    points.push(point);
  }

  const scaled = (factor: number): Point[] =>
    points.map((point) => ({ x: point.x * factor, y: point.y * factor }));

  const waves: string[] = [];
  const waveIndices = [2, 7, 12, 17, 22];
  for (const index of waveIndices) {
    const point = points[index];
    const next = points[(index + 1) % points.length];
    const angle = (Math.atan2(next.y - point.y, next.x - point.x) * 180) / Math.PI;
    const distance = 1.055;
    const x = point.x * distance;
    const y = point.y * distance;
    waves.push(
      `<path class="chart-island__wave" d="M-7 0q3.5 -3.8 7 0t7 0" transform="translate(${n(
        x,
      )} ${n(y)}) rotate(${n(angle)})" />`,
    );
  }

  return {
    path: smoothPath(points, true),
    contourA: smoothPath(scaled(0.66), true),
    contourB: smoothPath(scaled(0.33), true),
    waves: waves.join(""),
  };
}

function islandMarkup(spec: IslandSpec): string {
  const shape = islandShape(spec);
  const leaderLength = Math.min(54, Math.max(28, Math.abs(spec.labelX) - spec.rx - 20));
  const leaderDirection = spec.labelX === 0 ? 0 : Math.sign(spec.labelX);
  const leader =
    leaderDirection === 0
      ? ""
      : `<path class="chart-island__leader" d="M${n(
          leaderDirection * (spec.rx + 15),
        )} ${n(spec.labelY * 0.24)}h${n(leaderDirection * leaderLength)}" />`;
  const note = spec.note
    ? `<text class="chart-island__note" x="${n(spec.labelX)}" y="${n(
        spec.labelY + 21,
      )}" text-anchor="${spec.align}">${spec.note}</text>`
    : "";
  const coordY = spec.note ? spec.labelY + 38 : spec.labelY + 20;

  return `<g class="chart-island" data-chart-stage="${spec.id}" transform="translate(${n(
    spec.x,
  )} ${n(spec.y)})">
    <circle class="chart-island__halo" r="${n(Math.max(spec.rx, spec.ry) + 38)}" />
    <circle class="chart-island__ring" r="${n(Math.max(spec.rx, spec.ry) + 26)}" />
    <path class="chart-island__land" d="${shape.path}" />
    <path class="chart-island__contour" d="${shape.contourA}" />
    <path class="chart-island__contour chart-island__contour--deep" d="${shape.contourB}" />
    ${shape.waves}
    ${leader}
    <circle class="chart-island__port" cx="0" cy="0" r="3.1" />
    <text class="chart-island__name" x="${n(spec.labelX)}" y="${n(
      spec.labelY,
    )}" text-anchor="${spec.align}">${spec.label}</text>
    ${note}
    <text class="chart-island__coord" x="${n(spec.labelX)}" y="${n(
      coordY,
    )}" text-anchor="${spec.align}">${spec.coord}</text>
  </g>`;
}

function frameMarkup(): string {
  const ticks: string[] = [];
  const labels: string[] = [];
  const steps = 24;
  for (let index = 0; index <= steps; index += 1) {
    const x = FRAME_INNER + (FRAME_SIZE / steps) * index;
    const major = index % 4 === 0;
    const length = major ? 14 : 7;
    ticks.push(
      `<path class="${major ? "chart-frame__tick chart-frame__tick--major" : "chart-frame__tick"}" d="M${n(
        x,
      )} ${FRAME_INNER}v${length}M${n(x)} ${FRAME_INNER + FRAME_SIZE}v-${length}" />`,
    );
  }
  for (let index = 0; index <= steps; index += 1) {
    const y = FRAME_INNER + (FRAME_SIZE / steps) * index;
    const major = index % 4 === 0;
    const length = major ? 14 : 7;
    ticks.push(
      `<path class="${major ? "chart-frame__tick chart-frame__tick--major" : "chart-frame__tick"}" d="M${FRAME_INNER} ${n(
        y,
      )}h${length}M${FRAME_INNER + FRAME_SIZE} ${n(y)}h-${length}" />`,
    );
  }

  for (let index = 0; index <= 6; index += 1) {
    const x = FRAME_INNER + (FRAME_SIZE / 6) * index;
    const label = `${index * 30}°`;
    labels.push(
      `<text class="chart-frame__label" x="${n(x)}" y="${
        FRAME_INNER - 18
      }" text-anchor="middle">${label}</text>`,
      `<text class="chart-frame__label" x="${n(x)}" y="${
        FRAME_INNER + FRAME_SIZE + 26
      }" text-anchor="middle">${label}</text>`,
    );
  }
  const latitudes = ["60°N", "30°N", "0°", "30°S", "60°S"];
  for (let index = 0; index < latitudes.length; index += 1) {
    const y = FRAME_INNER + (FRAME_SIZE / 4) * index;
    labels.push(
      `<text class="chart-frame__label" x="${
        FRAME_INNER - 24
      }" y="${n(y + 4)}" text-anchor="end">${latitudes[index]}</text>`,
      `<text class="chart-frame__label" x="${
        FRAME_INNER + FRAME_SIZE + 24
      }" y="${n(y + 4)}" text-anchor="start">${latitudes[index]}</text>`,
    );
  }

  return `<g class="chart-frame chart-detail">${ticks.join("")}${labels.join("")}</g>`;
}

function gridMarkup(): string {
  const lines: string[] = [];
  for (let x = 352; x <= 2848; x += 256) {
    lines.push(`<path class="chart-grid__line" d="M${x} ${FRAME_INNER}V${FRAME_INNER + FRAME_SIZE}" />`);
  }
  for (let y = 352; y <= 2848; y += 256) {
    lines.push(`<path class="chart-grid__line" d="M${FRAME_INNER} ${y}H${FRAME_INNER + FRAME_SIZE}" />`);
  }

  const notes = [
    { x: 390, y: 760, text: "48°E" },
    { x: 2810, y: 760, text: "24°E" },
    { x: 390, y: 2470, text: "48°E" },
    { x: 2810, y: 2470, text: "24°E" },
    { x: 560, y: 1040, text: "36°N" },
    { x: 2640, y: 2200, text: "12°N" },
  ];
  const labels = notes
    .map(
      (note) =>
        `<text class="chart-grid__label" x="${note.x}" y="${note.y}" text-anchor="middle">${note.text}</text>`,
    )
    .join("");

  return `<g class="chart-grid chart-detail" clip-path="url(#chart-sea-clip)">
    ${lines.join("")}
    ${labels}
  </g>`;
}

function seaLabelsMarkup(): string {
  const seas = [
    { name: "NORTH BLUE", x: 2180, y: 440, note: "THE NORTHERN SEA", align: "middle" },
    { name: "EAST BLUE", x: 2740, y: 2220, note: "THE EASTERN SEA", align: "middle" },
    { name: "SOUTH BLUE", x: 1320, y: 2920, note: "THE SOUTHERN SEA", align: "middle" },
    { name: "WEST BLUE", x: 430, y: 1120, note: "THE WESTERN SEA", align: "middle" },
  ];
  return seas
    .map(
      (sea) => `<g class="chart-sea-label">
        <text class="chart-sea-label__name" x="${sea.x}" y="${
          sea.y
        }" text-anchor="${sea.align}">${sea.name}</text>
        <text class="chart-sea-label__note" x="${sea.x}" y="${
          sea.y + 19
        }" text-anchor="${sea.align}">${sea.note}</text>
      </g>`,
    )
    .join("");
}

function currentMarkup(): string {
  const currents = [
    { d: "M1810 760q110 -34 220 10", x: 2032, y: 770, rotate: 18 },
    { d: "M460 2050q100 36 190 5", x: 648, y: 2058, rotate: 12 },
    { d: "M1160 2860q120 -30 240 9", x: 1402, y: 2868, rotate: -8 },
    { d: "M2740 1510q-92 -52 -196 -13", x: 2544, y: 1500, rotate: 192 },
    { d: "M2210 1120q90 -55 186 -18", x: 2396, y: 1102, rotate: 211 },
  ];
  return `<g class="chart-currents chart-detail">${currents
    .map(
      (current) => `<g transform="translate(${current.x} ${current.y}) rotate(${current.rotate})">
        <path class="chart-current__line" d="${current.d}" />
        <path class="chart-current__head" d="M-4 -9L9 0L-4 9" />
      </g>`,
    )
    .join("")}</g>`;
}

function shipMarkup(): string {
  return `<g class="chart-ships chart-detail">
    <g transform="translate(2320 1080) rotate(-19)"><use href="#chart-vessel" x="-17" y="-15" width="34" height="30" /></g>
    <g transform="translate(1440 1940) rotate(23)"><use href="#chart-vessel" x="-17" y="-15" width="34" height="30" /></g>
    <g transform="translate(2010 720) rotate(-32)"><use href="#chart-vessel" x="-17" y="-15" width="34" height="30" /></g>
  </g>`;
}

function starMarkup(): string {
  const stars = [
    [540, 540, 10],
    [700, 1280, 8],
    [1100, 300, 7],
    [1400, 340, 9],
    [2100, 380, 8],
    [2700, 780, 9],
    [2820, 1140, 7],
    [2780, 1900, 10],
    [2190, 2200, 8],
    [1540, 2120, 7],
    [1230, 1720, 8],
    [2920, 2000, 9],
  ];
  return `<g class="chart-stars chart-detail">${stars
    .map(
      ([x, y, size]) =>
        `<use href="#chart-star" x="${x - size / 2}" y="${y - size / 2}" width="${size}" height="${size}" />`,
    )
    .join("")}</g>`;
}

function compassMarkup(): string {
  return `<g class="chart-compass chart-detail" transform="translate(2700 720)">
    <circle class="chart-compass__rim" r="90" />
    <circle class="chart-compass__rim chart-compass__rim--inner" r="67" />
    <path class="chart-compass__point" d="M0 -62L6 -12 0 0-6-12Z" />
    <path class="chart-compass__point chart-compass__point--muted" d="M0 62L5 12 0 0-5 12Z" />
    <path class="chart-compass__point chart-compass__point--muted" d="M62 0L12 -5 0 0 12 5Z" />
    <path class="chart-compass__point chart-compass__point--muted" d="M-62 0L-12 -5 0 0-12 5Z" />
    <circle class="chart-compass__pin" r="4" />
    <text class="chart-compass__label" x="0" y="-99" text-anchor="middle">N</text>
    <text class="chart-compass__label" x="102" y="4" text-anchor="middle">E</text>
    <text class="chart-compass__label" x="0" y="110" text-anchor="middle">S</text>
    <text class="chart-compass__label" x="-102" y="4" text-anchor="middle">W</text>
  </g>`;
}

function monsterMarkup(): string {
  return `<g class="chart-monster chart-detail" transform="translate(820 1850) rotate(-7)">
    <path class="chart-monster__body" d="M-178 46C-158 -10-126 -34-92 -12-70 2-58 3-42 -12-18 -36 8 -37 31 -13 48 5 62 5 78 -10 99 -30 125 -28 146 -4 160 12 174 17 193 7" />
    <path class="chart-monster__body" d="M-178 46C-152 61-124 67-102 57" />
    <path class="chart-monster__head" d="M193 7c14-12 29-14 45-7l-7 14c-10 18-26 24-45 17-7-3-10-9-8-14 2-4 8-8 15-10Z" />
    <path class="chart-monster__detail" d="M206 2l13 9M215 24l9 4M-164 34c-8-8-14-17-15-27M-140 45c-9-7-16-15-19-26" />
    <circle class="chart-monster__eye" cx="215" cy="9" r="2.3" />
  </g>`;
}

function chartMarkup(): string {
  const routeD = smoothPath(ROUTE_POINTS, false);
  const sampledGrandLine = sampleSpline(GRAND_LINE_POINTS);
  const grandLineUpper = offsetPoints(sampledGrandLine, 128);
  const grandLineLower = offsetPoints(sampledGrandLine, -128);
  const calmUpper = offsetPoints(sampledGrandLine, 238, 12);
  const calmLower = offsetPoints(sampledGrandLine, -238, 12);
  const calmUpperExtra = offsetPoints(sampledGrandLine, 270, 8);
  const calmLowerExtra = offsetPoints(sampledGrandLine, -270, 8);
  const calmLabel = offsetPoints(sampledGrandLine, 252, 9);
  const redBand = smoothPath([...RED_TOP, ...[...RED_BOTTOM].reverse()], true);
  const innerTop = RED_TOP.map((point) => ({ x: point.x, y: point.y + 13 }));
  const innerBottom = RED_BOTTOM.map((point) => ({ x: point.x, y: point.y - 13 }));
  const redInner = smoothPath([...innerTop, ...[...innerBottom].reverse()], true);

  // Fill each thin Calm Belt band so the pair of wavy lines reads as a strip
  // rather than as another set of chart grid rules.
  const calmUpperBand = smoothPath([...calmUpper, ...[...calmUpperExtra].reverse()], true);
  const calmLowerBand = smoothPath([...calmLower, ...[...calmLowerExtra].reverse()], true);

  // Keep one calm-belt label clear of the central crossing.
  const calmLabelD = polylinePath(calmLabel);

  return `<svg
    class="sea-chart__svg"
    viewBox="0 0 ${WORLD_W} ${WORLD_H}"
    preserveAspectRatio="xMidYMid slice"
    xmlns="http://www.w3.org/2000/svg"
    focusable="false"
  >
    <defs>
      <clipPath id="chart-sea-clip">
        <rect x="${FRAME_INNER}" y="${FRAME_INNER}" width="${FRAME_SIZE}" height="${FRAME_SIZE}" />
      </clipPath>
      <pattern id="chart-hatch" width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <path class="chart-hatch__line" d="M0 0V20" />
      </pattern>
      <mask id="chart-route-mask" maskUnits="userSpaceOnUse" x="${FRAME_INNER}" y="${FRAME_INNER}" width="${FRAME_SIZE}" height="${FRAME_SIZE}">
        <path
          id="chart-route-mask-path"
          d="${routeD}"
          fill="none"
          stroke="#fff"
          stroke-width="14"
          stroke-linecap="round"
          pathLength="1"
          stroke-dasharray="1 1"
          stroke-dashoffset="1"
        />
      </mask>
      <radialGradient id="chart-halo-fill" cx="50%" cy="50%" r="50%">
        <stop class="chart-halo__stop" offset="0%" stop-opacity="0.55" />
        <stop class="chart-halo__stop" offset="55%" stop-opacity="0.18" />
        <stop class="chart-halo__stop" offset="100%" stop-opacity="0" />
      </radialGradient>
      <symbol id="chart-star" viewBox="-8 -8 16 16">
        <path d="M0-8 1.6-1.6 8 0 1.6 1.6 0 8-1.6 1.6-8 0-1.6-1.6Z" />
      </symbol>
      <symbol id="chart-vessel" viewBox="-36 -32 72 64">
        <path class="chart-vessel__wake" d="M-34 14q-8 4-18 1M-32 21q-10 3-20 0" />
        <path class="chart-vessel__hull" d="M-28 6H18Q25 6 31 0L26 14Q22 22 12 22H-18Q-26 22-30 14Z" />
        <path class="chart-vessel__mast" d="M-2 -2V-30" />
        <path class="chart-vessel__sail" d="M-2 -28L23 -4L-2 -4Z" />
        <path class="chart-vessel__sail chart-vessel__sail--aft" d="M-4 -25L-25 -6L-4 -6Z" />
        <path class="chart-vessel__flag" d="M-2 -30L12 -26L-2 -22Z" />
        <path class="chart-vessel__rigging" d="M-2 -28L-25 -6M-2 -28L23 -4" />
      </symbol>
    </defs>

    <g class="chart-sea">
      <rect class="chart-sea__water" x="${FRAME_INNER}" y="${FRAME_INNER}" width="${FRAME_SIZE}" height="${FRAME_SIZE}" />
      <rect class="chart-sea__frame" x="88" y="88" width="${WORLD_W - 176}" height="${WORLD_H - 176}" />
      <rect class="chart-sea__frame chart-sea__frame--inner" x="${FRAME_INNER}" y="${FRAME_INNER}" width="${FRAME_SIZE}" height="${FRAME_SIZE}" />
      ${frameMarkup()}
      ${gridMarkup()}
    </g>

    <g clip-path="url(#chart-sea-clip)">
      <g class="chart-waves chart-detail">
        <path d="M560 1420q12-8 24 0t24 0M2560 1780q12-8 24 0t24 0M1980 520q12-8 24 0t24 0M360 980q12-8 24 0t24 0" />
        <path d="M960 2680q13-8 26 0t26 0M2540 1020q13-8 26 0t26 0M1460 560q13-8 26 0t26 0" />
      </g>

      <g class="chart-redline">
        <path class="chart-redline__fill" d="${redBand}" />
        <path class="chart-redline__hatch" d="${redBand}" />
        <path class="chart-redline__coast" d="${redBand}" />
        <path class="chart-redline__inner" d="${redInner}" />
        <g class="chart-redline__ticks chart-detail">
          <path d="M740 1548v-18M920 1548v-18M1100 1548v-18M1280 1548v-18M1460 1548v-18M1640 1548v-18M1820 1548v-18M2000 1548v-18M2180 1548v-18M2360 1548v-18M2540 1548v-18M2720 1548v-18M2900 1548v-18" />
        </g>
        <text class="chart-region-label" x="690" y="1508">RED LINE</text>
      </g>

      <g class="chart-grandline">
        <path class="chart-grandline__water" d="${polylinePath(grandLineUpper)}${polylinePath(
          [...grandLineLower].reverse(),
        ).replace(/^M/, "L")}Z" />
        <path class="chart-grandline__edge" d="${polylinePath(grandLineUpper)}" />
        <path class="chart-grandline__edge" d="${polylinePath(grandLineLower)}" />
        <path class="chart-grandline__center" d="${polylinePath(sampledGrandLine)}" />
      </g>

      <g class="chart-calm">
        <path class="chart-calm__band" d="${calmUpperBand}" />
        <path class="chart-calm__band" d="${calmLowerBand}" />
        <path class="chart-calm__line" d="${polylinePath(calmUpper)}" />
        <path class="chart-calm__line" d="${polylinePath(calmLower)}" />
        <path class="chart-calm__line chart-calm__line--extra" d="${polylinePath(calmUpperExtra)}" />
        <path class="chart-calm__line chart-calm__line--extra" d="${polylinePath(calmLowerExtra)}" />
        <path id="chart-calm-guide" class="chart-guide" d="${calmLabelD}" />
        <text class="chart-calm__label">
          <textPath href="#chart-calm-guide" startOffset="62%">CALM BELT</textPath>
        </text>
      </g>

      ${currentMarkup()}
      ${starMarkup()}
      ${monsterMarkup()}
      ${shipMarkup()}

      ${seaLabelsMarkup()}

      <path class="chart-route__ghost" d="${routeD}" />
      <g mask="url(#chart-route-mask)">
        ${CONFIG.routeGlow ? `<path class="chart-route__glow" d="${routeD}" />` : ""}
        <path id="chart-route-path" class="chart-route__line" d="${routeD}" />
      </g>

      ${ISLANDS.map((island) => islandMarkup(island)).join("")}
      <g class="chart-reverse" transform="translate(${CENTER_X} ${CENTER_Y})">
        <path class="chart-reverse__peak" d="M-92 28C-70-16-53-80-19-108-7-118 1-104-4-81 3-61 14-30 25-15 36-52 50-92 73-97 96-102 105-56 118 15" />
        <path class="chart-reverse__peak chart-reverse__peak--inner" d="M-62 25C-44-17-35-54-12-76M45 27C32-10 23-43 16-73M-5-81C-2-54 0-39 8-22M21-15C29 6 38 17 54 34" />
        <path class="chart-reverse__water" d="M-12-82C-8-35-6 8 5 34M4-83C8-38 14 7 25 32M-28 40q11-7 22 0t22 0M36 40q10-7 20 0t20 0" />
        <text class="chart-reverse__label" x="0" y="-128" text-anchor="middle">REVERSE MOUNTAIN</text>
        <text class="chart-reverse__note" x="0" y="57" text-anchor="middle">ROUTES MEET HERE</text>
      </g>
      <g class="chart-route-end" transform="translate(${ISLANDS[0].x} ${ISLANDS[0].y})">
        <circle r="5" />
        <text x="0" y="152" text-anchor="middle">SET SAIL</text>
      </g>
    </g>

    ${compassMarkup()}
  </svg>`;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function precise(value: number): string {
  return (Math.round(value * 10000) / 10000).toString();
}

export function initSeaChart(reducedMotion: boolean): void {
  const app = document.querySelector<HTMLElement>("#app");
  if (!app || document.querySelector("#sea-chart")) return;

  const layer = document.createElement("div");
  layer.id = "sea-chart";
  layer.className = "sea-chart";
  if (reducedMotion) layer.classList.add("is-reduced");
  layer.setAttribute("aria-hidden", "true");
  layer.style.setProperty("--chart-map-base", String(CONFIG.mapOpacity));
  layer.style.setProperty("--chart-grid-base", String(CONFIG.gridOpacity));
  if (!CONFIG.routeGlow) layer.classList.add("has-no-route-glow");
  if (CONFIG.fogOfWar) layer.classList.add("has-fog");
  layer.innerHTML = `${chartMarkup()}<div class="sea-chart__veil"></div>`;

  const canvas = app.querySelector("#led-canvas");
  if (canvas) canvas.insertAdjacentElement("afterend", layer);
  else app.prepend(layer);

  const svg = layer.querySelector<SVGSVGElement>(".sea-chart__svg");
  const routeMask = layer.querySelector<SVGPathElement>("#chart-route-mask-path");
  const islands = Array.from(layer.querySelectorAll<SVGGElement>(".chart-island"));
  const sectionIslands = new Map(
    islands.map((island) => [island.dataset.chartStage ?? "", island]),
  );
  if (!svg || !routeMask) return;


  const mobileQuery = window.matchMedia(MOBILE_QUERY);
  let isMobile = mobileQuery.matches;
  let viewportWidth = window.innerWidth;
  let viewportHeight = window.innerHeight;
  let chartScale = 1;
  let offsetX = 0;
  let offsetY = 0;

  const setMobileClass = (): void => {
    layer.classList.toggle("is-mobile", isMobile);
  };
  setMobileClass();

  const mobileSections = Array.from(
    document.querySelectorAll<HTMLElement>("#mobile-flow [id^='flow-']"),
  );

  let cameraX = 0;
  let cameraY = 0;
  let cameraZoom = 1;
  let cameraAnchorX = 0.38;
  let targetX = 0;
  let targetY = 0;
  let targetZoom = 1;
  let targetAnchorX = 0.38;
  let cameraReady = false;
  let maxScroll = 0;
  let mobileSectionTops: number[] = [];

  let routeReveal = reducedMotion ? 1 : 0;
  let targetReveal = reducedMotion ? 1 : 0;
  let currentStage = 0;
  let maxVisited = 0;
  let frame = 0;
  let lastFrame = 0;
  let lastAppliedStage = -1;

  const measure = (): void => {
    viewportWidth = window.innerWidth;
    viewportHeight = window.innerHeight;
    isMobile = mobileQuery.matches;
    setMobileClass();

    // Square chart: keep it a little over two viewports wide, and taller than
    // a phone viewport, while preserving the SVG's 1:1 aspect.
    const chartSize = Math.max(viewportWidth * 2.1, viewportHeight * 2.8);
    chartScale = chartSize / WORLD_W;
    offsetX = 0;
    offsetY = 0;
    maxScroll = Math.max(0, document.documentElement.scrollHeight - viewportHeight);
    mobileSectionTops = mobileSections.map(
      (section) => section.getBoundingClientRect().top + window.scrollY,
    );
    refreshAvoidRects();
  };

  const stagePosition = (): number => {
    if (isMobile && mobileSectionTops.length > 0) {
      const marker = window.scrollY + viewportHeight * 0.36;
      let index = 0;
      for (let i = 0; i < mobileSectionTops.length; i += 1) {
        if (mobileSectionTops[i] <= marker) index = i;
        else break;
      }
      if (index >= SECTION_COUNT - 1) return SECTION_COUNT - 1;
      const currentTop = mobileSectionTops[index];
      const nextTop = mobileSectionTops[index + 1];
      const span = Math.max(1, nextTop - currentTop);
      const local = clamp((marker - currentTop) / span, 0, 1);
      return index + local;
    }
    const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    return clamp(progress, 0, 1) * SECTION_COUNT;
  };

  const islandPoint = (index: number): Point => {
    const island = ISLANDS[clamp(index, 0, ISLANDS.length - 1)];
    return { x: island.x, y: island.y };
  };

  // Keep each current island clear of the reading panel. Chapters with a
  // left-hand panel anchor the chart to the right, and vice versa.
  const CHAPTER_ANCHORS = [0.38, 0.48, 0.38, 0.38, 0.47, 0.38, 0.63, 0.38] as const;

  const cameraTargetFor = (
    position: number,
  ): { x: number; y: number; zoom: number; anchorX: number } => {
    const stage = clamp(position, 0, SECTION_COUNT);
    const index = Math.min(SECTION_COUNT - 1, Math.floor(stage));
    const fraction = stage - index;
    const travel = clamp((fraction - 0.18) / 0.82, 0, 1);
    const eased = travel * travel * (3 - 2 * travel);
    const from = islandPoint(index);
    const to = islandPoint(Math.min(SECTION_COUNT - 1, index + 1));
    const worldX = from.x + (to.x - from.x) * eased;
    const worldY = from.y + (to.y - from.y) * eased;
    const fromAnchor = CHAPTER_ANCHORS[index] ?? 0.38;
    const toAnchor = CHAPTER_ANCHORS[Math.min(SECTION_COUNT - 1, index + 1)] ?? 0.38;
    // Pan between islands, then ease in a little as the journey advances.
    // The zoom delta stays small so the chart's line weight and the particle
    // field keep their balance; damping in renderFrame makes the change smooth.
    const journeyZoom = 0.97 + (index / (SECTION_COUNT - 1)) * 0.09;
    const zoom = CONFIG.cameraZoom * journeyZoom * (isMobile ? MOBILE_ZOOM : 1);

    return {
      x: worldX,
      y: worldY,
      zoom,
      anchorX: isMobile ? 0.5 : fromAnchor + (toAnchor - fromAnchor) * eased,
    };
  };

  const selected = (position: number): number =>
    clamp(Math.floor(clamp(position, 0, SECTION_COUNT - 1)), 0, SECTION_COUNT - 1);

  const applyRoute = (): void => {
    routeMask.style.strokeDashoffset = String(1 - routeReveal);
  };

  const applyCamera = (): void => {
    if (reducedMotion) {
      const fit = Math.min(viewportWidth / (WORLD_W * chartScale), viewportHeight / (WORLD_H * chartScale));
      const z = Math.max(0.001, fit);
      const tx = (viewportWidth - WORLD_W * chartScale * z) / 2;
      const ty = (viewportHeight - WORLD_H * chartScale * z) / 2;
      svg.style.transform = `translate3d(${precise(tx)}px, ${precise(ty)}px, 0) scale(${precise(z)})`;
      cullLabels(true);
      return;
    }

    const localX = offsetX + cameraX * chartScale;
    const localY = offsetY + cameraY * chartScale;
    const anchorX = isMobile ? 0.5 : cameraAnchorX;
    const anchorY = isMobile ? 0.46 : 0.54;
    const tx = anchorX * viewportWidth - cameraZoom * localX;
    const ty = anchorY * viewportHeight - cameraZoom * localY;
    svg.style.transform = `translate3d(${precise(tx)}px, ${precise(ty)}px, 0) scale(${precise(
      cameraZoom,
    )})`;
    cullLabels();
  };

  const labelNodes = Array.from(
    layer.querySelectorAll<SVGTextElement>(".sea-chart__svg text"),
  );
  const avoidNodes = Array.from(
    document.querySelectorAll<HTMLElement>(
      ".site-header, .site-footer, .nav-rail, .telemetry, " +
        ".scene .hero-copy, .scene .scene-meta, .scene .about-panel, .scene .skills-layout, " +
        ".scene .project-dock, .scene .education-panel, .scene .experience-panel, " +
        ".scene .resume-side, .scene .contact-panel",
    ),
  );

  let avoidRects: DOMRect[] = [];
  let lastCullAt = 0;

  const refreshAvoidRects = (): void => {
    lastCullAt = 0;
    avoidRects = [];
    for (const node of avoidNodes) {
      if (node.getClientRects().length === 0) continue;
      const rect = node.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) avoidRects.push(rect);
    }
  };

  // Labels are decorative, so it is always better to drop one than to let a
  // clipped fragment drift across the page or a paragraph.
  const CULL_INTERVAL_MS = 120;
  const cullLabels = (force = false): void => {
    if (isMobile) return;
    const now = performance.now();
    if (!force && now - lastCullAt < CULL_INTERVAL_MS) return;
    lastCullAt = now;
    for (const label of labelNodes) {
      if (label.closest(".chart-island.is-current")) {
        label.classList.remove("is-culled");
        continue;
      }
      if (label.getClientRects().length === 0) continue;
      const rect = label.getBoundingClientRect();
      const outside =
        rect.left < 6 ||
        rect.top < 6 ||
        rect.right > viewportWidth - 6 ||
        rect.bottom > viewportHeight - 6;
      const covered = avoidRects.some(
        (area) =>
          rect.right > area.left + 2 &&
          rect.left < area.right - 2 &&
          rect.bottom > area.top + 2 &&
          rect.top < area.bottom - 2,
      );
      label.classList.toggle("is-culled", outside || covered);
    }
  };

  const updateIslandStates = (stage: number): void => {
    if (stage !== lastAppliedStage) {
      lastAppliedStage = stage;
      refreshAvoidRects();
      for (const [id, island] of sectionIslands) {
        const islandIndex = ISLANDS.findIndex((spec) => spec.id === id);
        if (islandIndex < 0) continue;
        island.classList.toggle("is-current", islandIndex === currentStage);
        island.classList.toggle("is-visited", islandIndex <= maxVisited && islandIndex !== currentStage);
      }
    }
  };

  const update = (): void => {
    const position = stagePosition();
    currentStage = selected(position);
    maxVisited = Math.max(maxVisited, currentStage);
    if (isMobile) {
      const stageId = ISLANDS[currentStage]?.id ?? "home";
      if (document.body.dataset.stage !== stageId) {
        document.body.dataset.stage = stageId;
      }
    }
    updateIslandStates(currentStage);

    const target = cameraTargetFor(position);
    targetX = target.x;
    targetY = target.y;
    targetZoom = target.zoom;
    targetAnchorX = target.anchorX;

    if (reducedMotion) {
      const staticReveal = SECTION_COUNT > 1 ? currentStage / (SECTION_COUNT - 1) : 1;
      routeReveal = staticReveal;
      targetReveal = staticReveal;
      applyCamera();
      applyRoute();
      return;
    }

    // Four island-to-island moves make up the dotted route; hold at each
    // chapter until the reader has settled into it.
    const stage = clamp(position, 0, SECTION_COUNT);
    const index = Math.min(SECTION_COUNT - 1, Math.floor(stage));
    const fraction = stage - index;
    const travel = clamp((fraction - 0.18) / 0.82, 0, 1);
    const eased = travel * travel * (3 - 2 * travel);
    targetReveal = clamp((index + eased) / (SECTION_COUNT - 1), 0, 1);

    if (!cameraReady) {
      cameraX = targetX;
      cameraY = targetY;
      cameraZoom = targetZoom;
      cameraAnchorX = targetAnchorX;
      routeReveal = targetReveal;
      cameraReady = true;
      applyCamera();
      applyRoute();
      return;
    }

    scheduleFrame();
  };

  const renderFrame = (now: number): void => {
    frame = 0;
    if (reducedMotion) return;
    const dt = lastFrame > 0 ? Math.min(0.05, Math.max(0.001, (now - lastFrame) / 1000)) : 1 / 60;
    lastFrame = now;
    const damping = 1 - Math.exp(-CONFIG.cameraSpeed * dt * 60);

    cameraX += (targetX - cameraX) * damping;
    cameraY += (targetY - cameraY) * damping;
    cameraZoom += (targetZoom - cameraZoom) * damping;
    cameraAnchorX += (targetAnchorX - cameraAnchorX) * damping;
    routeReveal += (targetReveal - routeReveal) * Math.min(1, damping * 1.15);

    if (
      Math.abs(targetX - cameraX) < 0.02 &&
      Math.abs(targetY - cameraY) < 0.02 &&
      Math.abs(targetZoom - cameraZoom) < 0.0002 &&
      Math.abs(targetAnchorX - cameraAnchorX) < 0.0004 &&
      Math.abs(targetReveal - routeReveal) < 0.0004
    ) {
      cameraX = targetX;
      cameraY = targetY;
      cameraZoom = targetZoom;
      cameraAnchorX = targetAnchorX;
      routeReveal = targetReveal;
      applyCamera();
      applyRoute();
      return;
    }

    applyCamera();
    applyRoute();
    scheduleFrame();
  };

  const scheduleFrame = (): void => {
    if (frame || reducedMotion) return;
    frame = window.requestAnimationFrame(renderFrame);
  };

  const requestUpdate = (): void => {
    update();
    if (!reducedMotion) scheduleFrame();
  };

  let scrollFrame = 0;
  const onScroll = (): void => {
    if (scrollFrame) return;
    scrollFrame = window.requestAnimationFrame(() => {
      scrollFrame = 0;
      update();
      if (!reducedMotion) scheduleFrame();
    });
  };
  const onResize = (): void => {
    measure();
    if (!reducedMotion) {
      cameraReady = false;
      lastAppliedStage = -1;
    }
    requestUpdate();
  };
  const onMobileChange = (): void => {
    measure();
    cameraReady = false;
    lastAppliedStage = -1;
    requestUpdate();
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize, { passive: true });
  mobileQuery.addEventListener("change", onMobileChange);
  window.addEventListener("orientationchange", onResize, { passive: true });
  void document.fonts.ready.then(() => {
    measure();
    requestUpdate();
  });

  measure();
  update();
  if (reducedMotion) {
    applyCamera();
    applyRoute();
  }

  // Expose a tiny tuning hook for quick browser checks without opening the
  // module's private config.
  (window as unknown as { __seaChart?: object }).__seaChart = {
    config: CONFIG,
    stage: () => currentStage,
    reveal: () => routeReveal,
  };
}
