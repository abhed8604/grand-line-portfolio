import { content, type Project } from "../content";
import { MAX_POINTS, TARGET_STRIDE } from "../engine/constants";
import { artworks, type Artwork } from "./shapes";

/**
 * Optional hand-authored reference art. Drop clean white-on-black PNG
 * silhouettes into public/reference/ with these names and the sampler uses them
 * instead of the vector fallback. Anything missing is ignored silently.
 */
const REFERENCE_FILES: Record<string, string> = {
  "straw-hat-jolly-roger": "jolly-roger.png",
  "straw-hat-luffy": "luffy.png",
  "sunny-ship": "ship.png",
  "log-pose-compass": "compass.png",
  "wanted-poster": "poster.png",
};

const references = new Map<string, HTMLCanvasElement>();
let referencePromise: Promise<void> | null = null;

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Unable to load ${url}`));
    image.src = url;
  });
}

/** Turn a white-on-black reference into a white-on-transparent canvas so the
 *  existing alpha-based sampler can read it. */
function prepareReference(image: HTMLImageElement): HTMLCanvasElement {
  const maxSide = 1400;
  const scale = Math.min(1, maxSide / Math.max(image.naturalWidth, image.naturalHeight));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
  canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return canvas;
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = frame.data;
  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const alpha = pixels[i + 3];
    const luminance = Math.max(r, g, b);
    pixels[i] = 255;
    pixels[i + 1] = 255;
    pixels[i + 2] = 255;
    pixels[i + 3] = Math.round((luminance * alpha) / 255);
  }
  ctx.putImageData(frame, 0, 0);
  return canvas;
}

async function ensureReferences(): Promise<void> {
  if (referencePromise) return referencePromise;
  referencePromise = (async () => {
    const base = import.meta.env.BASE_URL.endsWith("/")
      ? import.meta.env.BASE_URL
      : `${import.meta.env.BASE_URL}/`;
    await Promise.all(
      Object.entries(REFERENCE_FILES).map(async ([name, file]) => {
        const url = `${base}reference/${file}`;
        try {
          // A missing public file can fall through to the SPA shell in some
          // hosts. Check the content type before asking the browser to decode.
          const head = await fetch(url, { method: "HEAD", cache: "no-store" });
          const type = head.headers.get("content-type") ?? "";
          if (!head.ok || !type.startsWith("image/")) return;
          const image = await loadImage(url);
          if (image.naturalWidth === 0 || image.naturalHeight === 0) return;
          references.set(name, prepareReference(image));
        } catch {
          // Optional asset: the vector artwork is the fallback.
        }
      }),
    );
  })();
  return referencePromise;
}


export type TargetId =
  | "loader"
  | "home"
  | "about"
  | "skills"
  | "projects"
  | "education"
  | "experience"
  | "resume"
  | "contact"
  | "one-piece"
  | `project-${string}`;

export interface MotionSpec {
  type: number;
  center: [number, number];
  scale: number;
}

export interface TargetCloud {
  id: string;
  data: Float32Array;
  width: number;
  height: number;
  meta: {
    title?: string;
    mobile: boolean;
    motion: MotionSpec;
  };
}

/** 0 none · 1 jolly roger · 2 luffy · 3 compass · 4 ship · 5 book · 6 chart · 7 poster · 8 X */
function motionFor(id: string, width: number, height: number, mobile: boolean): MotionSpec {
  const world = (x: number, y: number): [number, number] => [
    x - width / 2,
    height / 2 - y,
  ];
  if (id === "home") {
    const size = mobile
      ? Math.min(width * 0.68, height * 0.3)
      : Math.min(width * 0.245, height * 0.42);
    return {
      type: 1,
      center: world(mobile ? width * 0.5 : width * 0.25, mobile ? height * 0.2 : height * 0.62),
      scale: size,
    };
  }
  if (id === "about") {
    return {
      type: 2,
      center: world(
        mobile ? width * 0.5 : width * 0.275,
        mobile ? height * 0.48 : height * 0.57,
      ),
      scale: mobile ? Math.min(width * 0.42, height * 0.4) : height * 0.57,
    };
  }
  if (id === "skills") {
    const size = mobile
      ? Math.min(width * 0.56, height * 0.42)
      : Math.min(width * 0.34, height * 0.49);
    return {
      type: 3,
      center: world(mobile ? width * 0.5 : width * 0.3, mobile ? height * 0.43 : height * 0.57),
      scale: size,
    };
  }
  if (id === "projects") {
    return {
      type: 4,
      center: world(
        mobile ? width * 0.5 : width * 0.32,
        mobile ? height * 0.4 : height * 0.61,
      ),
      scale: mobile ? Math.min(width * 0.82, height * 0.3) : Math.min(width * 0.4, height * 0.32),
    };
  }
  if (id === "education") {
    return {
      type: 5,
      center: world(
        mobile ? width * 0.5 : width * 0.735,
        mobile ? height * 0.48 : height * 0.6,
      ),
      scale: mobile ? Math.min(width * 0.62, height * 0.43) : Math.min(width * 0.37, height * 0.45),
    };
  }
  if (id === "experience") {
    return {
      type: 6,
      center: world(
        mobile ? width * 0.5 : width * 0.305,
        mobile ? height * 0.47 : height * 0.6,
      ),
      scale: mobile ? Math.min(width * 0.86, height * 0.3) : Math.min(width * 0.45, height * 0.41),
    };
  }
  if (id === "resume") {
    const frameW = mobile ? width * 0.65 : Math.min(width * 0.34, height * 0.61);
    return {
      type: 7,
      center: world(mobile ? width * 0.5 : width * 0.44, mobile ? height * 0.35 : height * 0.49),
      scale: frameW,
    };
  }
  if (id === "contact") {
    return {
      type: 8,
      center: world(
        mobile ? width * 0.5 : width * 0.305,
        mobile ? height * 0.42 : height * 0.59,
      ),
      scale: mobile ? Math.min(width * 0.5, height * 0.3) : Math.min(width * 0.27, height * 0.4),
    };
  }
  return { type: 0, center: [0, 0], scale: 1 };
}

interface DrawContext {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  scale: number;
  mobile: boolean;
  reducedMotion: boolean;
}

const TAU = Math.PI * 2;
const TITLES = new Map<string, string>(
  content.nav.map((item) => [item.id as string, item.title]),
);
const PROJECTS = new Map(content.projects.entries.map((project) => [project.id, project]));

const stageTitle = (id: string): string => (TITLES.get(id) ?? "").toUpperCase();

const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, value));

function makeRandom(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return (s >>> 0) / 4294967296;
  };
}

function applyCtxTransform(ctx: CanvasRenderingContext2D, d: DrawContext): void {
  ctx.setTransform(d.scale, 0, 0, d.scale, 0, 0);
  ctx.clearRect(0, 0, d.width, d.height);
  ctx.fillStyle = "#fff";
  ctx.strokeStyle = "#fff";
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.globalCompositeOperation = "source-over";
}

function circlePath(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number): void {
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, TAU);
}

function drawRing(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  width = 2,
  dash: number[] = [],
): void {
  ctx.save();
  ctx.lineWidth = width;
  ctx.setLineDash(dash);
  circlePath(ctx, x, y, radius);
  ctx.stroke();
  ctx.restore();
}

function drawArtwork(
  ctx: CanvasRenderingContext2D,
  artwork: Artwork,
  centerX: number,
  centerY: number,
  width: number,
  height: number,
): void {
  const s = Math.min(width / artwork.width, height / artwork.height);
  ctx.save();
  ctx.translate(centerX - (artwork.width * s) / 2, centerY - (artwork.height * s) / 2);
  ctx.scale(s, s);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  const reference = references.get(artwork.name);
  if (reference) {
    const fit = Math.min(artwork.width / reference.width, artwork.height / reference.height);
    const drawW = reference.width * fit;
    const drawH = reference.height * fit;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(
      reference,
      (artwork.width - drawW) / 2,
      (artwork.height - drawH) / 2,
      drawW,
      drawH,
    );
    ctx.restore();
    return;
  }

  for (const p of artwork.paths) {
    const path = new Path2D(p.d);
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = p.alpha ?? 1;
    if (p.fill) {
      ctx.fill(path);
    } else {
      ctx.globalAlpha = p.stroke?.alpha ?? 1;
      ctx.setLineDash(p.stroke?.dash ?? []);
      ctx.lineWidth = p.stroke?.width ?? 4;
      ctx.stroke(path);
    }
  }

  ctx.globalCompositeOperation = "destination-out";
  ctx.globalAlpha = 1;
  ctx.setLineDash([]);
  for (const cut of artwork.cuts ?? []) {
    const path = new Path2D(cut.d);
    if (cut.fill) {
      ctx.fill(path);
    } else {
      ctx.setLineDash(cut.dash ?? []);
      ctx.lineWidth = cut.width ?? 6;
      ctx.stroke(path);
    }
  }

  // Extra marks are painted after the cuts so details like teeth survive.
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 1;
  ctx.setLineDash([]);
  artwork.drawExtra?.(ctx);
  ctx.restore();
}

function measureTracked(
  ctx: CanvasRenderingContext2D,
  text: string,
  tracking: number,
): number {
  let width = 0;
  for (const char of text) {
    width += ctx.measureText(char).width + tracking;
  }
  return Math.max(0, width - tracking);
}

function drawTracked(
  ctx: CanvasRenderingContext2D,
  text: string,
  centerX: number,
  baselineY: number,
  fontSize: number,
  options: {
    family?: string;
    weight?: number | string;
    tracking?: number;
    maxWidth?: number;
    align?: "center" | "left" | "right";
  } = {},
): number {
  const family = options.family ?? '"Anybody Variable"';
  const weight = options.weight ?? 830;
  const desiredTracking = options.tracking ?? fontSize * 0.015;
  const maxWidth = options.maxWidth ?? Number.POSITIVE_INFINITY;

  ctx.save();
  ctx.font = `${weight} ${fontSize}px ${family}`;
  let actualSize = fontSize;
  let actualTracking = desiredTracking;
  let measured = measureTracked(ctx, text, actualTracking);
  if (measured > maxWidth) {
    const ratio = maxWidth / measured;
    actualSize = fontSize * ratio;
    actualTracking = desiredTracking * ratio;
    ctx.font = `${weight} ${actualSize}px ${family}`;
    measured = measureTracked(ctx, text, actualTracking);
  }

  let x = centerX - measured / 2;
  if (options.align === "left") x = centerX;
  if (options.align === "right") x = centerX - measured;
  for (const char of text) {
    ctx.fillText(char, x, baselineY);
    x += ctx.measureText(char).width + actualTracking;
  }
  ctx.restore();
  return actualSize;
}

function drawMicroType(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  size: number,
  align: "center" | "left" | "right" = "left",
): void {
  ctx.save();
  ctx.font = `500 ${size}px "Doto Variable"`;
  ctx.textAlign = align;
  ctx.fillText(text.toUpperCase(), x, y);
  ctx.restore();
}

function drawSparseDust(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  seed: number,
  mobile: boolean,
): void {
  const random = makeRandom(seed);
  const count = mobile ? 26 : 72;
  ctx.save();
  ctx.globalAlpha = 0.8;
  for (let i = 0; i < count; i += 1) {
    const x = random() * width;
    const y = random() * height;
    if (x > width * 0.06 && x < width * 0.94 && y > height * 0.12 && y < height * 0.88) {
      // Keep the dust in the wide margins so it does not muddy the lettering.
      if (random() > 0.22) continue;
    }
    ctx.beginPath();
    ctx.arc(x, y, 0.65 + random() * 1.15, 0, TAU);
    ctx.fill();
  }
  ctx.restore();
}

function drawOrbit(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radiusX: number,
  radiusY: number,
  rotation = 0,
): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.lineWidth = 1.25;
  ctx.setLineDash([2, 13]);
  ctx.beginPath();
  ctx.ellipse(0, 0, radiusX, radiusY, 0, 0, TAU);
  ctx.stroke();
  ctx.restore();
}

function drawMapRoute(
  ctx: CanvasRenderingContext2D,
  from: [number, number],
  control: [number, number],
  to: [number, number],
  dash: number[] = [2, 14],
): void {
  ctx.save();
  ctx.lineWidth = 2;
  ctx.setLineDash(dash);
  ctx.beginPath();
  ctx.moveTo(from[0], from[1]);
  ctx.quadraticCurveTo(control[0], control[1], to[0], to[1]);
  ctx.stroke();
  ctx.restore();
}

function drawLoader(d: DrawContext): void {
  const { ctx, width: w, height: h, mobile } = d;
  const name = content.identity.name.toUpperCase();
  const size = mobile ? clamp(w * 0.13, 34, 62) : clamp(w * 0.082, 58, 152);
  drawTracked(ctx, name, w / 2, h / 2 + size * 0.32, size, {
    maxWidth: w * (mobile ? 0.82 : 0.72),
    tracking: size * 0.03,
  });
  drawMicroType(ctx, content.sceneLabels.loaderBoot, w / 2, h / 2 + size * 0.98, mobile ? 8 : 10, "center");
  // LED progress ticks, drawn in the same coordinate language as the interface.
  const ticks = 17;
  const tickWidth = mobile ? 5 : 7;
  const gap = mobile ? 8 : 10;
  const total = ticks * tickWidth + (ticks - 1) * gap;
  const start = w / 2 - total / 2;
  const y = h / 2 + size * 1.35;
  for (let i = 0; i < ticks; i += 1) {
    ctx.globalAlpha = i < 6 ? 1 : 0.45;
    ctx.fillRect(start + i * (tickWidth + gap), y, tickWidth, mobile ? 2 : 3);
  }
  drawOrbit(ctx, w / 2, h / 2, Math.min(w * 0.23, 280), Math.min(h * 0.17, 150), -0.06);
}

function drawHome(d: DrawContext): void {
  const { ctx, width: w, height: h, mobile } = d;
  const name = content.identity.name.toUpperCase();
  if (mobile) {
    const artSize = Math.min(w * 0.68, h * 0.3);
    drawArtwork(ctx, artworks.hatSkull, w * 0.5, h * 0.2, artSize, artSize);
    drawOrbit(ctx, w * 0.5, h * 0.2, artSize * 0.57, artSize * 0.57, 0.12);
    return;
  }

  const artSize = Math.min(w * 0.245, h * 0.42);
  drawArtwork(ctx, artworks.hatSkull, w * 0.25, h * 0.62, artSize, artSize);
  drawOrbit(ctx, w * 0.25, h * 0.62, artSize * 0.56, artSize * 0.56, -0.18);
  drawMapRoute(ctx, [w * 0.39, h * 0.72], [w * 0.32, h * 0.83], [w * 0.14, h * 0.85], [2, 16]);
  drawMicroType(ctx, content.sceneLabels.homeLog, w * 0.25, h * 0.88, 11, "center");
  drawMicroType(ctx, content.sceneLabels.homeRoute, w * 0.46, h * 0.72, 10, "left");

  // The particle name lives in its own band above the skull, clear of the
  // headline on the right-hand side of the stage.
  const nameSize = clamp(w * 0.064, 56, 126);
  drawTracked(ctx, name, w * 0.44, h * 0.285, nameSize, {
    maxWidth: w * 0.5,
    tracking: nameSize * 0.02,
  });
  drawMicroType(ctx, content.sceneLabels.homeKicker, w * 0.44, h * 0.34, 11, "center");
}

function drawAbout(d: DrawContext): void {
  const { ctx, width: w, height: h, mobile } = d;
  const title = stageTitle("about");
  if (mobile) {
    drawTracked(ctx, title, w * 0.5, h * 0.18, clamp(w * 0.12, 30, 65), {
      maxWidth: w * 0.84,
    });
    drawArtwork(ctx, artworks.luffy, w * 0.5, h * 0.48, w * 0.42, h * 0.4);
    return;
  }
  const titleSize = clamp(w * 0.047, 48, 82);
  drawTracked(ctx, title, w * 0.34, h * 0.21, titleSize, { maxWidth: w * 0.46, tracking: titleSize * 0.02 });

  const figH = h * 0.57;
  drawArtwork(ctx, artworks.luffy, w * 0.275, h * 0.57, w * 0.34, figH);
  drawMapRoute(ctx, [w * 0.09, h * 0.28], [w * 0.15, h * 0.25], [w * 0.21, h * 0.25], [2, 18]);
  drawRing(ctx, w * 0.055, h * 0.28, 3.2, 1.8);
  drawRing(ctx, w * 0.085, h * 0.28, 1.7, 1.3);
  drawMicroType(ctx, content.sceneLabels.aboutCoordinates, w * 0.55, h * 0.87, 11, "left");
}

function drawSkills(d: DrawContext): void {
  const { ctx, width: w, height: h, mobile } = d;
  const title = stageTitle("skills");
  if (mobile) {
    drawTracked(ctx, title, w * 0.5, h * 0.16, clamp(w * 0.14, 32, 70), { maxWidth: w * 0.8 });
    drawArtwork(ctx, artworks.logPose, w * 0.5, h * 0.43, w * 0.56, h * 0.42);
    return;
  }
  const titleSize = clamp(w * 0.047, 48, 82);
  drawTracked(ctx, title, w * 0.33, h * 0.2, titleSize, { maxWidth: w * 0.44, tracking: titleSize * 0.025 });
  const artSize = Math.min(w * 0.34, h * 0.49);
  drawArtwork(ctx, artworks.logPose, w * 0.3, h * 0.57, artSize, artSize * 1.03);
  drawOrbit(ctx, w * 0.3, h * 0.57, artSize * 0.56, artSize * 0.42, 0.25);
  drawOrbit(ctx, w * 0.3, h * 0.57, artSize * 0.64, artSize * 0.48, -0.35);
}

function drawProjects(d: DrawContext): void {
  const { ctx, width: w, height: h, mobile } = d;
  const title = stageTitle("projects");
  if (mobile) {
    drawTracked(ctx, title, w * 0.5, h * 0.16, clamp(w * 0.114, 28, 58), { maxWidth: w * 0.9 });
    drawArtwork(ctx, artworks.ship, w * 0.5, h * 0.4, w * 0.82, h * 0.3);
    drawMapRoute(ctx, [w * 0.1, h * 0.53], [w * 0.4, h * 0.45], [w * 0.9, h * 0.48], [2, 12]);
    return;
  }
  const titleSize = clamp(w * 0.049, 50, 88);
  drawTracked(ctx, title, w * 0.35, h * 0.25, titleSize, { maxWidth: w * 0.5, tracking: titleSize * 0.018 });

  drawMapRoute(ctx, [w * 0.075, h * 0.79], [w * 0.12, h * 0.44], [w * 0.54, h * 0.43], [2, 16]);
  drawMapRoute(ctx, [w * 0.075, h * 0.79], [w * 0.15, h * 0.58], [w * 0.44, h * 0.67], [1, 22]);

  // Islands and route dots, original map furniture.
  drawArtwork(ctx, artworks.island, w * 0.17, h * 0.73, w * 0.095, w * 0.095);
  drawArtwork(ctx, artworks.island, w * 0.372, h * 0.56, w * 0.075, w * 0.075);
  drawArtwork(ctx, artworks.island, w * 0.52, h * 0.43, w * 0.06, w * 0.06);
  drawSparseRoute(ctx, w, h, 0.17, 0.73, 0.372, 0.56);
  drawSparseRoute(ctx, w, h, 0.372, 0.56, 0.52, 0.43);
  drawArtwork(ctx, artworks.compassRose, w * 0.53, h * 0.74, w * 0.12, w * 0.12);
  drawArtwork(ctx, artworks.ship, w * 0.32, h * 0.61, w * 0.35, h * 0.28);
  drawMicroType(ctx, content.sceneLabels.projectsFoot, w * 0.52, h * 0.84, 11, "center");
}

function drawSparseRoute(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): void {
  const dx = (x2 - x1) * w;
  const dy = (y2 - y1) * h;
  const length = Math.hypot(dx, dy);
  const steps = Math.max(4, Math.floor(length / 28));
  ctx.save();
  for (let i = 1; i < steps; i += 1) {
    const t = i / steps;
    const x = x1 * w + dx * t;
    const y = y1 * h + dy * t - Math.sin(t * Math.PI) * 18;
    circlePath(ctx, x, y, i % 2 === 0 ? 2.2 : 1.2);
    ctx.fill();
  }
  ctx.restore();
}

function drawProject(d: DrawContext, project: Project): void {
  const { ctx, width: w, height: h, mobile } = d;
  if (mobile) {
    drawTracked(ctx, project.title, w * 0.5, h * 0.18, clamp(w * 0.11, 28, 58), {
      maxWidth: w * 0.86,
    });
    drawOrbit(ctx, w * 0.5, h * 0.48, w * 0.35, h * 0.25, 0.08);
    drawTracked(ctx, content.sceneLabels.projectLog, w * 0.5, h * 0.56, 15, { maxWidth: w * 0.6 });
    return;
  }
  // The panel itself lives in real DOM text; the LEDs conjure its title and frame.
  const titleSize = clamp(w * 0.042, 42, 74);
  const lines = project.title.split(" ");
  const baseY = h * 0.37;
  if (lines.length > 1) {
    drawTracked(ctx, lines.slice(0, 2).join(" "), w * 0.3, baseY, titleSize, {
      maxWidth: w * 0.4,
    });
    drawTracked(ctx, lines.slice(2).join(" "), w * 0.3, baseY + titleSize * 0.94, titleSize, {
      maxWidth: w * 0.4,
    });
  } else {
    drawTracked(ctx, project.title, w * 0.3, baseY, titleSize, { maxWidth: w * 0.42 });
  }
  const boxW = Math.min(w * 0.42, 680);
  const boxH = Math.min(h * 0.37, 370);
  const x = w * 0.3 - boxW / 2;
  const y = h * 0.49;
  ctx.save();
  ctx.lineWidth = 2;
  ctx.setLineDash([26, 16]);
  ctx.strokeRect(x, y, boxW, boxH);
  ctx.setLineDash([]);
  ctx.lineWidth = 2;
  // Corner brackets.
  const corner = 28;
  for (const [cx, cy, sx, sy] of [
    [x, y, 1, 1],
    [x + boxW, y, -1, 1],
    [x, y + boxH, 1, -1],
    [x + boxW, y + boxH, -1, -1],
  ]) {
    ctx.beginPath();
    ctx.moveTo(cx + sx * corner, cy);
    ctx.lineTo(cx, cy);
    ctx.lineTo(cx, cy + sy * corner);
    ctx.stroke();
  }
  ctx.restore();
  drawOrbit(ctx, w * 0.3, h * 0.49 + boxH / 2, boxW * 0.58, boxH * 0.65, -0.1);
}

function drawEducation(d: DrawContext): void {
  const { ctx, width: w, height: h, mobile } = d;
  const title = stageTitle("education");
  if (mobile) {
    drawTracked(ctx, title, w * 0.5, h * 0.17, clamp(w * 0.105, 26, 54), { maxWidth: w * 0.86 });
    drawArtwork(ctx, artworks.book, w * 0.5, h * 0.48, w * 0.66, h * 0.4);
    return;
  }
  const titleSize = clamp(w * 0.043, 44, 74);
  const [firstWord, ...restWords] = title.split(" ");
  drawTracked(ctx, firstWord, w * 0.732, h * 0.2, titleSize, { maxWidth: w * 0.34 });
  if (restWords.length > 0) {
    drawTracked(ctx, restWords.join(" "), w * 0.732, h * 0.2 + titleSize * 0.95, titleSize, { maxWidth: w * 0.34 });
  }
  drawArtwork(ctx, artworks.book, w * 0.735, h * 0.6, w * 0.37, h * 0.45);
  drawOrbit(ctx, w * 0.735, h * 0.6, w * 0.23, h * 0.26, -0.12);
  drawMicroType(ctx, content.sceneLabels.educationKicker, w * 0.735, h * 0.86, 11, "center");
}

function drawExperience(d: DrawContext): void {
  const { ctx, width: w, height: h, mobile } = d;
  const title = stageTitle("experience");
  if (mobile) {
    drawTracked(ctx, title, w * 0.5, h * 0.17, clamp(w * 0.118, 28, 58), { maxWidth: w * 0.86 });
    drawArtwork(ctx, artworks.chart, w * 0.5, h * 0.47, w * 0.86, h * 0.32);
    return;
  }
  const titleSize = clamp(w * 0.048, 48, 82);
  drawTracked(ctx, title, w * 0.305, h * 0.235, titleSize, { maxWidth: w * 0.44 });
  drawArtwork(ctx, artworks.chart, w * 0.305, h * 0.6, w * 0.45, h * 0.41);
  drawOrbit(ctx, w * 0.305, h * 0.6, w * 0.25, h * 0.22, 0.18);
  drawMicroType(ctx, content.sceneLabels.experienceKicker, w * 0.305, h * 0.86, 11, "center");
}

function drawResume(d: DrawContext): void {
  const { ctx, width: w, height: h, mobile } = d;
  const frameW = mobile ? w * 0.65 : Math.min(w * 0.34, h * 0.61);
  const frameH = mobile ? h * 0.45 : Math.min(h * 0.7, w * 0.61);
  const cx = mobile ? w * 0.5 : w * 0.44;
  const cy = mobile ? h * 0.35 : h * 0.49;
  drawArtwork(ctx, artworks.wantedFrame, cx, cy, frameW, frameH);

  // The poster keeps its own 800 x 1100 aspect ratio inside the frame. Anchor
  // the type to the poster itself so WANTED and the name stay clear of the
  // inner rule at every viewport size.
  const posterScale = Math.min(
    frameW / artworks.wantedFrame.width,
    frameH / artworks.wantedFrame.height,
  );
  const posterW = artworks.wantedFrame.width * posterScale;
  const posterH = artworks.wantedFrame.height * posterScale;

  const titleSize = mobile
    ? clamp(posterW * 0.17, 24, 46)
    : clamp(posterW * 0.15, 34, 58);
  drawTracked(ctx, stageTitle("resume"), cx, cy - posterH * 0.272, titleSize, {
    maxWidth: posterW * 0.76,
    tracking: titleSize * 0.08,
  });
  const name = content.identity.name.toUpperCase();
  drawTracked(
    ctx,
    name,
    cx,
    cy + posterH * 0.292,
    mobile ? clamp(posterW * 0.11, 18, 32) : clamp(posterW * 0.092, 24, 44),
    {
      maxWidth: posterW * 0.76,
      tracking: mobile ? 1 : 2,
    },
  );
  drawOrbit(ctx, cx, cy, frameW * 0.66, frameH * 0.6, 0.06);
}

function drawContact(d: DrawContext): void {
  const { ctx, width: w, height: h, mobile } = d;
  const title = stageTitle("contact");
  if (mobile) {
    drawTracked(ctx, title, w * 0.5, h * 0.17, clamp(w * 0.115, 26, 58), { maxWidth: w * 0.86 });
    drawArtwork(ctx, artworks.laughTaleX, w * 0.5, h * 0.42, w * 0.5, h * 0.3);
    return;
  }
  const titleSize = clamp(w * 0.047, 48, 82);
  drawTracked(ctx, title, w * 0.31, h * 0.235, titleSize, { maxWidth: w * 0.44 });
  const artSize = Math.min(w * 0.27, h * 0.4);
  drawArtwork(ctx, artworks.laughTaleX, w * 0.305, h * 0.59, artSize, artSize);
  drawOrbit(ctx, w * 0.305, h * 0.59, artSize * 0.66, artSize * 0.52, -0.12);
  drawOrbit(ctx, w * 0.305, h * 0.59, artSize * 0.78, artSize * 0.63, 0.28);
  drawMicroType(ctx, content.sceneLabels.contactFoot, w * 0.305, h * 0.85, 11, "center");
}

function drawOnePiece(d: DrawContext): void {
  const { ctx, width: w, height: h, mobile } = d;
  const size = mobile ? clamp(w * 0.08, 22, 46) : clamp(w * 0.045, 44, 82);
  drawTracked(ctx, content.sceneLabels.onePieceTitle, w / 2, h * 0.44, size, { maxWidth: w * 0.8 });
  drawTracked(ctx, content.sceneLabels.onePieceLine, w / 2, h * 0.44 + size * 1.08, size, { maxWidth: w * 0.4 });
  drawOrbit(ctx, w / 2, h * 0.48, Math.min(w * 0.28, 450), Math.min(h * 0.24, 230), 0.08);
  drawOrbit(ctx, w / 2, h * 0.48, Math.min(w * 0.34, 540), Math.min(h * 0.29, 280), -0.2);
}

function drawComposition(id: TargetId, d: DrawContext): void {
  if (id === "loader") return drawLoader(d);
  if (id === "home") return drawHome(d);
  if (id === "about") return drawAbout(d);
  if (id === "skills") return drawSkills(d);
  if (id === "projects") return drawProjects(d);
  if (id === "education") return drawEducation(d);
  if (id === "experience") return drawExperience(d);
  if (id === "resume") return drawResume(d);
  if (id === "contact") return drawContact(d);
  if (id === "one-piece") return drawOnePiece(d);
  if (id.startsWith("project-")) {
    const project = PROJECTS.get(id.slice(8));
    if (project) return drawProject(d, project);
  }
  drawLoader(d);
}

async function waitForFonts(): Promise<void> {
  if (!("fonts" in document)) return;
  await Promise.all([
    document.fonts.load('830 100px "Anybody Variable"'),
    document.fonts.load('500 20px "Doto Variable"'),
    document.fonts.load('400 20px "Hanken Grotesk Variable"'),
    document.fonts.ready,
  ]);
}

function makeCanvas(width: number, height: number, scale: number): {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
} {
  const canvas = document.createElement("canvas");
  canvas.width = Math.ceil(width * scale);
  canvas.height = Math.ceil(height * scale);
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("2D canvas is unavailable");
  return { canvas, ctx };
}

interface CandidatePools {
  edge: Uint32Array;
  fill: Uint32Array;
}

/**
 * Split lit pixels into outline and interior pools. Each encoded candidate
 * keeps the pixel index in the low 24 bits and an edge weight in the top byte,
 * so one pass can decide where a point sits and how bright its outline should
 * burn in the render shader.
 */
function collectCandidates(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  step: number,
): CandidatePools {
  const image = ctx.getImageData(0, 0, canvasWidth, canvasHeight).data;
  const edge: number[] = [];
  const fill: number[] = [];
  const reach = step * 2;

  const alphaAt = (x: number, y: number): number => {
    const cx = x < 0 ? 0 : x >= canvasWidth ? canvasWidth - 1 : x;
    const cy = y < 0 ? 0 : y >= canvasHeight ? canvasHeight - 1 : y;
    return image[(cy * canvasWidth + cx) * 4 + 3];
  };

  for (let y = 0; y < canvasHeight; y += step) {
    const row = y * canvasWidth;
    for (let x = 0; x < canvasWidth; x += step) {
      const alpha = image[(row + x) * 4 + 3];
      if (alpha <= 44) continue;

      const edgeScore = Math.max(
        Math.abs(alphaAt(x + reach, y) - alpha),
        Math.abs(alphaAt(x - reach, y) - alpha),
        Math.abs(alphaAt(x, y + reach) - alpha),
        Math.abs(alphaAt(x, y - reach) - alpha),
      );
      const pixel = (row + x) >>> 0;

      if (edgeScore > 30) {
        const weight = clamp(0.72 + (edgeScore / 255) * 0.34, 0.72, 1);
        edge.push(pixel | ((Math.round(weight * 255) & 0xff) << 24));
      } else {
        const weight = clamp(0.28 + (alpha / 255) * 0.16, 0.28, 0.46);
        fill.push(pixel | ((Math.round(weight * 255) & 0xff) << 24));
      }
    }
  }

  return {
    edge: Uint32Array.from(edge),
    fill: Uint32Array.from(fill),
  };
}

/**
 * Paint a composition to an offscreen canvas, then turn its lit pixels into a
 * 150k-point target cloud. Sampled data is flat and GPU-ready: xyz + phase.
 */
export async function makeTargetCloud(id: TargetId, reducedMotion = false): Promise<TargetCloud> {
  await waitForFonts();
  await ensureReferences();
  const width = Math.max(320, window.innerWidth);
  const height = Math.max(480, window.innerHeight);
  const mobile = width < 880;
  const scale = width > 1800 ? 1.3 : width > 1000 ? 1.5 : 1.55;
  const { canvas, ctx } = makeCanvas(width, height, scale);
  const drawContext: DrawContext = { ctx, width, height, scale, mobile, reducedMotion };
  applyCtxTransform(ctx, drawContext);
  drawSparseDust(ctx, width, height, id.length * 997 + width, mobile);
  drawComposition(id, drawContext);

  const step = 2;
  const pools = collectCandidates(ctx, canvas.width, canvas.height, step);
  const random = makeRandom(0x1ed + id.length * 1907 + width);
  const data = new Float32Array(MAX_POINTS * TARGET_STRIDE);
  const edgeCount = pools.edge.length;
  const fillCount = pools.fill.length;
  const fallback = edgeCount === 0 && fillCount === 0;
  const useEdges = edgeCount > 0;

  for (let i = 0; i < MAX_POINTS; i += 1) {
    let px: number;
    let py: number;
    let weight = 0.4;
    if (fallback) {
      px = random() * canvas.width;
      py = random() * canvas.height;
    } else {
      const fromEdge = useEdges && (fillCount === 0 || random() < 0.8);
      const pool = fromEdge ? pools.edge : pools.fill;
      const encoded = pool[Math.floor(random() * pool.length)] || 0;
      const pixel = encoded & 0xffffff;
      weight = ((encoded >>> 24) & 0xff) / 255;
      px = (pixel % canvas.width) + (random() - 0.5) * step * 0.98;
      py = Math.floor(pixel / canvas.width) + (random() - 0.5) * step * 0.98;
    }
    const x = px / scale - width / 2;
    const y = height / 2 - py / scale;
    const z = (random() * 2 - 1) * 34 + Math.sin(x * 0.008) * 8;
    data[i * 4] = x;
    data[i * 4 + 1] = y;
    data[i * 4 + 2] = z;
    data[i * 4 + 3] = weight;
  }

  canvas.width = 1;
  canvas.height = 1;

  return {
    id,
    data,
    width,
    height,
    meta: { mobile, title: TITLES.get(id), motion: motionFor(id, width, height, mobile) },
  };
}

export async function makeProjectTarget(
  projectId: string,
  reducedMotion = false,
): Promise<TargetCloud> {
  return makeTargetCloud(`project-${projectId}` as TargetId, reducedMotion);
}
