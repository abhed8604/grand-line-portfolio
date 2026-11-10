import "./styles.css";
import { content, type SectionId } from "./content";
import {
  buildUI,
  setEngineReadout,
  setLoaderProgress,
  showToast,
  type BuiltUI,
} from "./ui/build";
import { initCursor, type CursorController } from "./ui/cursor";
import { initSeaChart } from "./ui/sea-chart";
import { initQuickView, type QuickViewController } from "./ui/quickview";
import { initAnalytics, trackEvent } from "./ui/analytics";
import { initVignettes } from "./ui/vignettes";
import {
  isCoarsePointer,
  prefersReducedMotion,
  type QualityName,
} from "./engine/constants";
import type { EngineStats, LEDEngine } from "./engine/engine";
import type { StoryController } from "./scroll/story";
import type { TargetCloud } from "./targets/target-factory";

const MAX_LOADER_WAIT = 1750;

const ui: BuiltUI = buildUI();
const reducedMotion = prefersReducedMotion();
const narrow =
  window.matchMedia("(max-width: 879px)").matches || isCoarsePointer();
const app = document.querySelector<HTMLElement>("#app");
app?.setAttribute("aria-busy", "true");
document.body.dataset.mode = narrow ? "mobile" : "desktop";

let engine: LEDEngine | null = null;
let story: StoryController | null = null;
let quickView: QuickViewController | null = null;
let cursor: CursorController | null = null;
let bootComplete = false;
let failed = false;

const stageClouds = new Map<SectionId, TargetCloud>();
const targetCache = new Map<string, TargetCloud>();
let finalWordTimer = 0;
const particleEffects = !reducedMotion && !narrow;

initAnalytics(content.analytics);
initVignettes();
initSeaChart(reducedMotion);

cursor = initCursor({
  reducedMotion,
  onMove: (x, y) => engine?.setPointer(x, y),
  onLeave: () => engine?.clearPointer(),
  onPress: (x, y) => {
    if (particleEffects && !quickView?.isOpen()) engine?.burstAtScreen(x, y, 1900);
  },
  onRipple: (x, y, strength) => {
    if (!reducedMotion && !quickView?.isOpen()) engine?.addRipple(x, y, strength);
  },
});

let slowToast: HTMLElement | null = null;
let slowFpsSeconds = 0;
const SLOW_TOAST_KEY = "led-slow-toast-seen";
const slowToastSeen = (): boolean => {
  try {
    return window.sessionStorage.getItem(SLOW_TOAST_KEY) === "1";
  } catch {
    return false;
  }
};
const markSlowToastSeen = (): void => {
  try {
    window.sessionStorage.setItem(SLOW_TOAST_KEY, "1");
  } catch {
    // Session storage is optional; the in-memory flag still limits repeats.
  }
};
let slowToastDismissed = slowToastSeen();
let slowToastVisible = false;
let slowToastTimer = 0;

const ensureSlowToast = (): HTMLElement => {
  if (slowToast) return slowToast;
  const root = document.createElement("aside");
  root.className = "slow-toast";
  root.hidden = true;
  root.setAttribute("role", "status");
  root.setAttribute("aria-live", "polite");

  const copy = document.createElement("p");
  copy.className = "slow-toast__copy";
  copy.textContent = content.ui.slowToast;

  const actions = document.createElement("div");
  actions.className = "slow-toast__actions";

  const quick = document.createElement("button");
  quick.type = "button";
  quick.className = "slow-toast__action";
  quick.dataset.quickView = "";
  quick.dataset.event = "quick_view_open";
  quick.textContent = content.ui.slowToastAction;
  quick.addEventListener("click", () => hideSlowToast());

  const dismiss = document.createElement("button");
  dismiss.type = "button";
  dismiss.className = "slow-toast__dismiss";
  dismiss.textContent = "×";
  dismiss.setAttribute("aria-label", content.ui.close);
  dismiss.addEventListener("click", () => {
    slowToastDismissed = true;
    slowFpsSeconds = 0;
    markSlowToastSeen();
    hideSlowToast();
  });

  actions.append(quick, dismiss);
  root.append(copy, actions);
  document.body.append(root);
  slowToast = root;
  return root;
};

const hideSlowToast = (): void => {
  if (!slowToast) return;
  window.clearTimeout(slowToastTimer);
  slowToastTimer = 0;
  slowToast.classList.remove("is-visible");
  slowToast.hidden = true;
  slowToastVisible = false;
};

const showSlowToast = (): void => {
  if (slowToastDismissed || slowToastVisible) return;
  slowToastDismissed = true;
  markSlowToastSeen();
  const element = ensureSlowToast();
  slowToastVisible = true;
  element.hidden = false;
  window.requestAnimationFrame(() => element.classList.add("is-visible"));
  window.clearTimeout(slowToastTimer);
  slowToastTimer = window.setTimeout(() => hideSlowToast(), 12000);
};

const handleLowFps = (fps: number): void => {
  if (!bootComplete || failed || slowToastDismissed || slowToastVisible) return;
  if (fps > 0 && fps < 24) {
    slowFpsSeconds += 1;
    if (slowFpsSeconds >= 3) showSlowToast();
  } else {
    slowFpsSeconds = 0;
  }
};

const onQuickOpen = (): void => {
  hideSlowToast();
  cursor?.setActive(false);
  story?.pause();
  engine?.pause("quickview");
};

const onQuickClose = (): void => {
  cursor?.setActive(true);
  story?.resume();
  engine?.resume("quickview");
};

quickView = initQuickView(ui, {
  reducedMotion,
  onOpen: onQuickOpen,
  onClose: onQuickClose,
});

const sectionIds = new Set<SectionId>(content.nav.map((section) => section.id));

const isSection = (value: string | null | undefined): value is SectionId =>
  Boolean(value && sectionIds.has(value as SectionId));

const requestedSection = (): SectionId | null => {
  const param = new URLSearchParams(window.location.search).get("stage");
  if (isSection(param)) return param;
  const hash = window.location.hash.replace(/^#/, "");
  return isSection(hash) ? hash : null;
};

const setStageHash = (id: SectionId): void => {
  try {
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${window.location.search}#${id}`,
    );
  } catch {
    // file:// previews can block history writes.
  }
};

const scrollToStaticSection = (id: SectionId): void => {
  const target = document.getElementById(`flow-${id}`);
  if (!target) return;
  const top = target.getBoundingClientRect().top + window.scrollY - 66;
  window.scrollTo({ top, behavior: reducedMotion ? "auto" : "smooth" });
  setStageHash(id);
};

const navigate = (id: SectionId): void => {
  if (story) {
    story.goTo(id);
  } else {
    scrollToStaticSection(id);
  }
};

const copyEmail = async (): Promise<void> => {
  const emailLink = content.contact.links.find((link) =>
    link.href.startsWith("mailto:"),
  );
  const value =
    emailLink?.href.replace(/^mailto:/, "") ??
    content.contact.links[0]?.value ??
    "";
  try {
    await navigator.clipboard.writeText(value);
  } catch {
    const field = document.createElement("textarea");
    field.value = value;
    field.setAttribute("readonly", "");
    field.style.cssText = "position:fixed;left:-9999px;top:0;opacity:0";
    document.body.appendChild(field);
    field.select();
    try {
      document.execCommand("copy");
    } catch {
      // The visible address remains available if the clipboard is locked.
    }
    field.remove();
  }
  showToast(ui, content.ui.copied);
};

const getProjectCloud = async (id: string): Promise<TargetCloud | null> => {
  const key = `project-${id}`;
  const cached = targetCache.get(key);
  if (cached) return cached;
  const factory = await import("./targets/target-factory");
  const cloud = await factory.makeProjectTarget(id, reducedMotion);
  targetCache.set(key, cloud);
  return cloud;
};

const getOnePieceCloud = async (): Promise<TargetCloud | null> => {
  const cached = targetCache.get("one-piece");
  if (cached) return cached;
  const factory = await import("./targets/target-factory");
  const cloud = await factory.makeTargetCloud("one-piece", reducedMotion);
  targetCache.set("one-piece", cloud);
  return cloud;
};

const markContactCloud = (): void => {
  const cloud = stageClouds.get("contact");
  if (cloud && story?.currentSection() === "contact") engine?.morphTo(cloud);
};

const triggerEgg = async (egg: string, element: HTMLElement): Promise<void> => {
  if (egg === "hat") {
    if (particleEffects) {
      const bounds = element.getBoundingClientRect();
      engine?.burstAtScreen(
        bounds.left + bounds.width / 2,
        bounds.top + bounds.height / 2,
        7600,
      );
    }
    showToast(ui, content.easterEggs.hatToast);
    return;
  }
  if (egg === "ship") {
    if (particleEffects) engine?.surge(760);
    showToast(ui, content.easterEggs.shipToast);
    return;
  }
  if (egg === "mark") {
    const contactScene = document.getElementById("scene-contact");
    contactScene?.classList.add("is-final-word");
    window.clearTimeout(finalWordTimer);
    finalWordTimer = window.setTimeout(() => {
      contactScene?.classList.remove("is-final-word");
      if (particleEffects) markContactCloud();
    }, 5600);
    showToast(ui, content.easterEggs.markToast);
    if (particleEffects) {
      const cloud = await getOnePieceCloud();
      if (cloud) engine?.morphTo(cloud);
    }
    showToast(ui, content.easterEggs.finalWord, 5600);
  }
};

const showFallback = (error?: unknown): void => {
  if (failed) return;
  failed = true;
  console.warn("LED Grand Line is showing the readable edition.", error);
  document.documentElement.classList.add("no-webgl");
  document.body.classList.remove("is-loading");
  document.body.dataset.mode = "fallback";
  document.body.dataset.stage = "home";
  document.body.dataset.ledState = "settled";
  app?.setAttribute("aria-busy", "false");
  ui.loader.setAttribute("aria-hidden", "true");
  ui.loader.classList.add("is-leaving");
  window.setTimeout(() => {
    ui.loader.style.display = "none";
  }, 950);
  ui.fallbackNote.hidden = false;
  ui.fallbackNote.setAttribute("role", "status");
  ui.fallbackNote.innerHTML = `<strong>${content.ui.fallbackTitle}</strong> ${content.ui.fallbackBody}`;
  story?.destroy();
  story = null;
  engine?.pause("fallback");
};

const finishLoader = (): void => {
  if (loaderFinished) return;
  loaderFinished = true;
  setLoaderProgress(ui, 100, content.ui.enter);
  app?.setAttribute("aria-busy", "false");
  window.setTimeout(() => {
    document.body.classList.remove("is-loading");
    ui.loader.classList.add("is-leaving");
    ui.loader.setAttribute("aria-hidden", "true");
    window.setTimeout(() => {
      ui.loader.style.display = "none";
    }, 950);
    bootComplete = true;
    // Start adaptive quality only after the loader and cloud generation are
    // done. Those startup stalls used to poison the first measurement window
    // and permanently cost the artwork a third of its LEDs.
    engine?.enableAutoQuality();
    if (!narrow) {
      window.requestAnimationFrame(() => story?.refresh());
    }
  }, 240);
};

let loaderFinished = false;
let loaderSkipRequested = reducedMotion;
let loaderWaitResolve: (() => void) | null = null;

const requestLoaderSkip = (): void => {
  if (failed || loaderFinished) return;
  loaderSkipRequested = true;
  setLoaderProgress(ui, 100, content.ui.enter);
  loaderWaitResolve?.();
  loaderWaitResolve = null;
};

const boot = async (): Promise<void> => {
  const started = performance.now();
  setLoaderProgress(ui, 2, content.loader.statuses[0]);

  let quality: QualityName = narrow ? "lite" : "medium";
  try {
    const { chooseQualityTier } = await import("./engine/quality");
    quality = await chooseQualityTier();
  } catch {
    quality = narrow ? "lite" : "medium";
  }
  setLoaderProgress(ui, 7, content.loader.statuses[0]);

  try {
    const [{ LEDEngine }, factory] = await Promise.all([
      import("./engine/engine"),
      import("./targets/target-factory"),
    ]);

    const canvas = document.querySelector<HTMLCanvasElement>("#led-canvas");
    if (!canvas) throw new Error("The LED canvas is missing.");

    engine = new LEDEngine(
      canvas,
      { quality, reducedMotion },
      {
        onStats: (stats: EngineStats) => {
          setEngineReadout(ui, {
            quality: stats.label,
            points: stats.points,
            fps: stats.fps,
          });
          handleLowFps(stats.fps);
        },
        onQuality: (stats: EngineStats) => {
          setEngineReadout(ui, {
            quality: stats.label,
            points: stats.points,
            fps: stats.fps,
          });
        },
      },
    );
    setEngineReadout(ui, {
      quality: quality.toUpperCase(),
      points: engine.activePoints,
      fps: 0,
    });
    canvas.addEventListener("webglcontextlost", (event) => {
      event.preventDefault();
      showFallback(new Error("WebGL context lost."));
    });

    if (narrow) {
      const hero = document.getElementById("flow-home");
      if (hero) engine.observeVisibility(hero);
    } else {
      const stage = document.getElementById("stage-root");
      if (stage) engine.observeVisibility(stage);
    }

    const loaderCloud = await factory.makeTargetCloud("loader", reducedMotion);
    engine.morphTo(loaderCloud);
    setLoaderProgress(ui, 14, content.loader.statuses[1]);

    const initial = requestedSection() ?? "home";

    if (narrow) {
      const home = await factory.makeTargetCloud("home", reducedMotion);
      stageClouds.set("home", home);
      engine.morphTo(home);
      setLoaderProgress(ui, 76, content.loader.statuses[3]);
    } else {
      for (let index = 0; index < content.nav.length; index += 1) {
        const section = content.nav[index];
        const cloud = await factory.makeTargetCloud(section.id, reducedMotion);
        stageClouds.set(section.id, cloud);
        const progress = 14 + ((index + 1) / content.nav.length) * 68;
        const status =
          content.loader.statuses[(index + 1) % content.loader.statuses.length];
        setLoaderProgress(ui, progress, `${status} · ${section.title}`);
        await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
      }
    }

    if (!loaderSkipRequested) {
      const wait = Math.max(0, MAX_LOADER_WAIT - (performance.now() - started));
      if (wait > 0) {
        await new Promise<void>((resolve) => {
          loaderWaitResolve = resolve;
          window.setTimeout(resolve, wait);
        });
        loaderWaitResolve = null;
      }
    }

    if (!narrow) {
      const { initStory } = await import("./scroll/story");
      story = initStory({
        ui,
        engine,
        stageClouds,
        getProjectCloud,
        reducedMotion,
        initialSection: initial,
        onStageChange: (id) => {
          document.body.dataset.stage = id;
        },
      });
    } else {
      if (initial !== "home") {
        window.setTimeout(() => scrollToStaticSection(initial), 80);
      }
    }

    setLoaderProgress(ui, 94, content.loader.statuses[content.loader.statuses.length - 1]);
    finishLoader();
  } catch (error) {
    showFallback(error);
  }
};

document.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof Element)) return;

  const tracked = target.closest<HTMLElement>("[data-event]");
  if (tracked?.dataset.event) trackEvent(tracked.dataset.event);

  if (target.closest("[data-skip-intro]")) {
    event.preventDefault();
    requestLoaderSkip();
    return;
  }

  const goto = target.closest<HTMLElement>("[data-goto], [data-goto-nav]");
  if (goto) {
    const id = goto.dataset.goto ?? goto.dataset.gotoNav;
    if (isSection(id)) {
      event.preventDefault();
      navigate(id);
      return;
    }
  }

  const project = target.closest<HTMLElement>("[data-project]");
  if (project?.dataset.project && story) {
    event.preventDefault();
    void story.selectProject(project.dataset.project);
    return;
  }

  if (target.closest("[data-project-back]") && story) {
    event.preventDefault();
    story.closeProject();
    return;
  }

  if (target.closest("[data-experience-project]") && story) {
    event.preventDefault();
    story.selectExperience();
    return;
  }

  if (target.closest("[data-experience-back]") && story) {
    event.preventDefault();
    story.closeExperience();
    return;
  }

  const egg = target.closest<HTMLElement>("[data-egg]");
  if (egg?.dataset.egg) {
    event.preventDefault();
    void triggerEgg(egg.dataset.egg, egg);
    return;
  }

  if (target.closest("[data-copy-email]")) {
    event.preventDefault();
    void copyEmail();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape" || loaderFinished || failed) return;
  if (quickView?.isOpen()) return;
  requestLoaderSkip();
});

const modeQuery = window.matchMedia("(max-width: 879px)");
const onModeChange = (): void => {
  if (bootComplete) window.location.reload();
};
modeQuery.addEventListener("change", onModeChange);

let resizeTimer = 0;
let cloudGeneration = 0;
const onResize = (): void => {
  engine?.resize(window.innerWidth, window.innerHeight);
  window.clearTimeout(resizeTimer);
  resizeTimer = window.setTimeout(async () => {
    if (!engine || !bootComplete || failed) return;
    const generation = ++cloudGeneration;
    targetCache.clear();
    story?.refresh();
    const mobileNow = window.innerWidth < 880 || isCoarsePointer();
    const chapterIds: SectionId[] = mobileNow
      ? ["home"]
      : content.nav.map((section) => section.id);
    const active = story?.currentSection() ?? "home";
    const ordered = [active, ...chapterIds.filter((id) => id !== active)];
    try {
      const factory = await import("./targets/target-factory");
      for (const id of ordered) {
        if (generation !== cloudGeneration) return;
        const cloud = await factory.makeTargetCloud(id, reducedMotion);
        if (generation !== cloudGeneration) return;
        stageClouds.set(id, cloud);
        if (!story?.selectedProjectId() && story?.currentSection() === id) {
          engine.morphTo(cloud);
        }
      }
      const projectId = story?.selectedProjectId();
      if (!projectId || generation !== cloudGeneration) return;
      const projectCloud = await factory.makeProjectTarget(projectId, reducedMotion);
      if (generation !== cloudGeneration) return;
      targetCache.set(`project-${projectId}`, projectCloud);
      if (story?.selectedProjectId() === projectId) engine.morphTo(projectCloud);
    } catch {
      // The existing clouds remain valid if a resize redraw cannot complete.
    }
  }, 360);
};
window.addEventListener("resize", onResize, { passive: true });

const debug = {
  get engine() {
    return engine;
  },
  get story() {
    return story;
  },
  get quickView() {
    return quickView;
  },
  ui,
  targetCache,
  goTo(id: SectionId) {
    if (isSection(id)) navigate(id);
  },
  openQuickView() {
    quickView?.open();
  },
  closeQuickView() {
    quickView?.close();
  },
  triggerEgg(egg: string) {
    const element = document.querySelector<HTMLElement>(`[data-egg="${egg}"]`);
    if (element) void triggerEgg(egg, element);
  },
  get mode() {
    return document.body.dataset.mode;
  },
};

(window as unknown as { __led: typeof debug }).__led = debug;

void boot();
