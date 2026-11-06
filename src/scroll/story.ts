import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { content, type SectionId } from "../content";
import type { LEDEngine } from "../engine/engine";
import type { TargetCloud } from "../targets/target-factory";
import { setExperiencePanel, setProjectPanel, type BuiltUI } from "../ui/build";

gsap.registerPlugin(ScrollTrigger);

export interface StoryOptions {
  ui: BuiltUI;
  engine: LEDEngine;
  stageClouds: ReadonlyMap<SectionId, TargetCloud>;
  getProjectCloud: (id: string) => Promise<TargetCloud | null>;
  reducedMotion: boolean;
  initialSection?: SectionId | null;
  onStageChange?: (section: SectionId, index: number) => void;
}

export interface StoryController {
  goTo(id: SectionId, immediate?: boolean): void;
  selectProject(id: string): Promise<void>;
  closeProject(): void;
  selectExperience(): void;
  closeExperience(): void;
  selectedProjectId(): string | null;
  currentSection(): SectionId;
  pause(): void;
  resume(): void;
  refresh(): void;
  destroy(): void;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function sectionFromHash(): SectionId | null {
  const id = window.location.hash.replace(/^#/, "");
  return content.nav.some((item) => item.id === id) ? (id as SectionId) : null;
}

export function initStory(options: StoryOptions): StoryController {
  const { ui, engine, reducedMotion } = options;
  const sections = content.nav;
  const total = sections.length;
  const projectsScene = ui.scenes.find((scene) => scene.id === "projects")?.element;
  const experienceScene = ui.scenes.find((scene) => scene.id === "experience")?.element;

  const lenis = new Lenis({
    duration: 1.15,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: !reducedMotion,
    syncTouch: false,
    wheelMultiplier: 0.92,
    touchMultiplier: 1.05,
    autoRaf: false,
    respectReducedMotion: true,
  });

  let paused = false;
  let currentIndex = -1;
  let currentId: SectionId = "home";
  let navigatingTo: number | null = null;
  let navigationTimeout = 0;
  let projectId: string | null = null;
  let projectRequest = 0;
  let experienceOpen = false;

  const setExternalHash = (id: SectionId): void => {
    if (document.body.classList.contains("quickview-open")) return;
    const next = `${window.location.pathname}${window.location.search}#${id}`;
    if (`${window.location.pathname}${window.location.search}${window.location.hash}` === next) {
      return;
    }
    try {
      window.history.replaceState(null, "", next);
    } catch {
      // A file:// preview can refuse history writes; the story still works.
    }
  };

  const activate = (index: number, immediate = false): void => {
    const clamped = clamp(index, 0, total - 1);
    if (clamped === currentIndex) return;
    const next = ui.scenes[clamped];
    if (!next) return;
    const previous = currentIndex >= 0 ? ui.scenes[currentIndex] : null;

    if (previous) {
      gsap.killTweensOf(previous.element);
      previous.element.classList.remove("is-active");
      previous.element.setAttribute("aria-hidden", "true");
      previous.element.inert = true;
      gsap.set(previous.element, { clearProps: "opacity" });
    }

    currentIndex = clamped;
    currentId = next.id;
    next.element.inert = false;
    next.element.removeAttribute("aria-hidden");
    next.element.classList.add("is-active");
    document.body.dataset.stage = next.id;
    setExternalHash(next.id);

    ui.navButtons.forEach((button, buttonIndex) => {
      if (buttonIndex === clamped) button.setAttribute("aria-current", "true");
      else button.setAttribute("aria-current", "false");
    });

    if (projectId && next.id !== "projects") {
      closeProject(false);
    }
    if (experienceOpen && next.id !== "experience") {
      closeExperience(false);
    }

    const cloud = options.stageClouds.get(next.id);
    if (cloud) engine.morphTo(cloud);

    if (immediate || reducedMotion) {
      gsap.set(next.element, { clearProps: "opacity" });
    } else {
      gsap.fromTo(
        next.element,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.5,
          ease: "power2.out",
          onComplete: () => gsap.set(next.element, { clearProps: "opacity" }),
        },
      );
      const reveals = next.element.querySelectorAll<HTMLElement>("[data-reveal]");
      if (reveals.length > 0) {
        gsap.fromTo(
          reveals,
          { opacity: 0, y: 17 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.065,
            delay: 0.07,
            ease: "power3.out",
            overwrite: "auto",
            clearProps: "opacity,transform",
          },
        );
      }
    }

    options.onStageChange?.(next.id, clamped);
  };

  const targetScrollFor = (index: number): number => {
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    if (index <= 0) return 0;
    return maxScroll * ((index + 0.18) / total);
  };

  const clearNavigation = (): void => {
    navigatingTo = null;
    window.clearTimeout(navigationTimeout);
  };

  const goTo = (id: SectionId, immediate = false): void => {
    const index = sections.findIndex((section) => section.id === id);
    if (index < 0) return;
    const target = targetScrollFor(index);
    navigatingTo = index;
    window.clearTimeout(navigationTimeout);
    activate(index, immediate || reducedMotion);

    if (immediate || reducedMotion) {
      lenis.scrollTo(target, { immediate: true, force: true });
      window.scrollTo(0, target);
      window.requestAnimationFrame(() => {
        clearNavigation();
        activate(index, true);
        ScrollTrigger.update();
      });
      return;
    }

    lenis.scrollTo(target, {
      duration: 1.2,
      easing: (t: number) => 1 - Math.pow(1 - t, 4),
      onComplete: () => {
        clearNavigation();
        activate(index, false);
        ScrollTrigger.update();
      },
    });
    navigationTimeout = window.setTimeout(() => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = window.scrollY / maxScroll;
      navigatingTo = null;
      activate(Math.min(total - 1, Math.floor(progress * total)), true);
    }, 1800);
  };

  const onProgress = (progress: number): void => {
    if (navigatingTo !== null) {
      const crossed = Math.min(total - 1, Math.floor(progress * total));
      if (crossed === navigatingTo) {
        clearNavigation();
        activate(crossed);
      }
      return;
    }
    const nextIndex = Math.min(total - 1, Math.floor(progress * total));
    activate(nextIndex);
  };

  const trigger = ScrollTrigger.create({
    trigger: ui.scrollTrack,
    start: "top top",
    end: "bottom bottom",
    onUpdate: (self) => onProgress(self.progress),
  });

  const onLenisScroll = (): void => {
    ScrollTrigger.update();
  };
  lenis.on("scroll", onLenisScroll);

  const tick = (time: number): void => {
    lenis.raf(time * 1000);
  };
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  const interruptNavigation = (): void => {
    if (navigatingTo === null) return;
    clearNavigation();
  };
  const interruptEvents = ["wheel", "touchstart", "keydown", "pointerdown"] as const;
  for (const eventName of interruptEvents) {
    window.addEventListener(eventName, interruptNavigation, { passive: true });
  }

  const closeProject = (restoreMap = true): void => {
    if (!projectId) return;
    const closingId = projectId;
    projectId = null;
    projectRequest += 1;
    if (projectsScene) {
      setProjectPanel(projectsScene, null, content.projects.entries);
    }
    if (restoreMap && currentId === "projects") {
      const cloud = options.stageClouds.get("projects");
      if (cloud) engine.morphTo(cloud);
    }
    if (restoreMap && projectsScene) {
      const row = projectsScene.querySelector<HTMLButtonElement>(
        `[data-project="${CSS.escape(closingId)}"]`,
      );
      row?.focus({ preventScroll: true });
    }
  };

  const closeExperience = (restoreFocus = true): void => {
    if (!experienceOpen) return;
    experienceOpen = false;
    if (experienceScene) setExperiencePanel(experienceScene, false);
    if (restoreFocus) {
      const trigger = experienceScene?.querySelector<HTMLButtonElement>("[data-experience-project]");
      trigger?.focus({ preventScroll: true });
    }
  };

  const selectExperience = (): void => {
    if (!experienceScene || currentId !== "experience") return;
    experienceOpen = true;
    setExperiencePanel(experienceScene, true);
  };

  const selectProject = async (id: string): Promise<void> => {
    const project = content.projects.entries.find((entry) => entry.id === id);
    if (!project || !projectsScene) return;
    if (currentId !== "projects") {
      goTo("projects", reducedMotion);
      return;
    }
    projectId = id;
    const request = ++projectRequest;
    setProjectPanel(projectsScene, id, content.projects.entries);
    const heading = projectsScene.querySelector<HTMLElement>(
      `[data-project-panel="${CSS.escape(id)}"] h3`,
    );
    heading?.focus({ preventScroll: true });
    try {
      const cloud = await options.getProjectCloud(id);
      if (!cloud) return;
      if (request !== projectRequest || projectId !== id || currentId !== "projects") return;
      engine.morphTo(cloud);
    } catch {
      // The DOM panel remains readable even if a project cloud cannot be drawn.
    }
  };

  const onKeyDown = (event: KeyboardEvent): void => {
    if (event.key !== "Escape") return;
    if (projectId) {
      event.preventDefault();
      closeProject();
    } else if (experienceOpen) {
      event.preventDefault();
      closeExperience();
    }
  };
  window.addEventListener("keydown", onKeyDown);

  const onHashChange = (): void => {
    const id = sectionFromHash();
    if (id) goTo(id);
  };
  window.addEventListener("hashchange", onHashChange);

  const onResize = (): void => {
    lenis.resize();
    ScrollTrigger.refresh();
  };
  window.addEventListener("resize", onResize, { passive: true });

  const initialId = options.initialSection ?? sectionFromHash() ?? "home";
  const initialIndex = Math.max(
    0,
    sections.findIndex((section) => section.id === initialId),
  );
  if (initialIndex > 0) {
    goTo(initialId, true);
  } else {
    activate(0, true);
    lenis.scrollTo(0, { immediate: true, force: true });
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      activate(0, true);
    });
  }

  return {
    goTo(id: SectionId, immediate = false) {
      goTo(id, immediate);
    },
    selectProject,
    closeProject() {
      closeProject();
    },
    selectExperience,
    closeExperience() {
      closeExperience();
    },
    selectedProjectId() {
      return projectId;
    },
    currentSection() {
      return currentId;
    },
    pause() {
      if (paused) return;
      paused = true;
      lenis.stop();
    },
    resume() {
      if (!paused) return;
      paused = false;
      lenis.start();
    },
    refresh() {
      lenis.resize();
      ScrollTrigger.refresh();
    },
    destroy() {
      window.removeEventListener("hashchange", onHashChange);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
      for (const eventName of interruptEvents) {
        window.removeEventListener(eventName, interruptNavigation);
      }
      window.clearTimeout(navigationTimeout);
      trigger.kill();
      lenis.off("scroll", onLenisScroll);
      lenis.destroy();
      gsap.ticker.remove(tick);
    },
  };
}
