import { rippleLifetime } from "../engine/motion";

export interface CursorOptions {
  reducedMotion: boolean;
  onMove?: (clientX: number, clientY: number) => void;
  onLeave?: () => void;
  onPress?: (clientX: number, clientY: number) => void;
  onRipple?: (clientX: number, clientY: number, strength: number) => void;
}

export interface CursorController {
  setActive(active: boolean): void;
  destroy(): void;
}

const INTERACTIVE_SELECTOR =
  "a, button, summary, label, select, input, textarea, [role='button'], [data-cursor='hover']";

const RIPPLE_COUNT = 18;

interface Ripple {
  element: HTMLElement;
  x: number;
  y: number;
  age: number;
  life: number;
  strength: number;
  active: boolean;
}

function isFinePointer(): boolean {
  return (
    window.matchMedia("(pointer: fine)").matches &&
    window.matchMedia("(hover: hover)").matches
  );
}

/**
 * A DOM cursor head that leaves expanding rings of light on the dark water.
 * The rings are mirrored into the GPGPU field through onRipple(), so the
 * same wave that you see on screen also stirs the particles underneath it.
 */
export function initCursor(options: CursorOptions): CursorController {
  const finePointer = isFinePointer();
  const root = document.createElement("div");
  root.className = "cursor is-hidden";
  root.setAttribute("aria-hidden", "true");
  root.innerHTML = '<span class="cursor__head"></span>';
  document.body.appendChild(root);

  const layer = document.createElement("div");
  layer.className = "cursor-ripples";
  layer.setAttribute("aria-hidden", "true");
  document.body.appendChild(layer);

  const ripples: Ripple[] = [];
  if (finePointer && !options.reducedMotion) {
    for (let i = 0; i < RIPPLE_COUNT; i += 1) {
      const element = document.createElement("span");
      element.className = "cursor__ripple";
      element.style.opacity = "0";
      layer.appendChild(element);
      ripples.push({
        element,
        x: 0,
        y: 0,
        age: rippleLifetime,
        life: rippleLifetime,
        strength: 1,
        active: false,
      });
    }
  }

  const reducedMotion = options.reducedMotion;
  let active = finePointer;
  let visible = false;
  let raf = 0;
  let pointerX = window.innerWidth / 2;
  let pointerY = window.innerHeight / 2;
  let headX = pointerX;
  let headY = pointerY;
  let interactive = false;
  let lastX = pointerX;
  let lastY = pointerY;
  let lastSpawnX = pointerX;
  let lastSpawnY = pointerY;
  let lastSpawnAt = 0;
  let rippleCursor = 0;
  let lastFrame = 0;

  if (finePointer) document.documentElement.classList.add("has-custom-cursor");

  const setVisible = (next: boolean): void => {
    if (visible === next) return;
    visible = next;
    root.classList.toggle("is-hidden", !next);
  };

  const setActive = (next: boolean): void => {
    active = next && finePointer;
    root.classList.toggle("is-hidden", !active || !visible || !finePointer);
    document.documentElement.classList.toggle("has-custom-cursor", active);
    if (!active) options.onLeave?.();
  };

  const updateInteractive = (target: EventTarget | null): void => {
    const next =
      target instanceof Element && Boolean(target.closest(INTERACTIVE_SELECTOR));
    if (next === interactive) return;
    interactive = next;
    root.classList.toggle("is-interactive", interactive);
  };

  const spawnRipple = (x: number, y: number, strength = 1): void => {
    if (ripples.length === 0) {
      options.onRipple?.(x, y, strength);
      return;
    }
    const ripple = ripples[rippleCursor];
    rippleCursor = (rippleCursor + 1) % ripples.length;
    ripple.x = x;
    ripple.y = y;
    ripple.age = 0;
    ripple.life = rippleLifetime * (0.9 + strength * 0.12);
    ripple.strength = strength;
    ripple.active = true;
    ripple.element.style.left = `${x.toFixed(1)}px`;
    ripple.element.style.top = `${y.toFixed(1)}px`;
    ripple.element.style.opacity = "0";
    options.onRipple?.(x, y, strength);
  };

  const onPointerMove = (event: PointerEvent): void => {
    if (event.pointerType === "touch") {
      setVisible(false);
      return;
    }
    if (!active) return;
    pointerX = event.clientX;
    pointerY = event.clientY;
    setVisible(true);
    updateInteractive(event.target);
    options.onMove?.(pointerX, pointerY);

    const now = event.timeStamp || performance.now();
    const traveled = Math.hypot(pointerX - lastSpawnX, pointerY - lastSpawnY);
    if (traveled > 24 && now - lastSpawnAt > 54) {
      const speed = Math.hypot(pointerX - lastX, pointerY - lastY);
      const strength = Math.min(1.7, 0.7 + speed / 42);
      spawnRipple(pointerX, pointerY, strength);
      lastSpawnX = pointerX;
      lastSpawnY = pointerY;
      lastSpawnAt = now;
    }
    lastX = pointerX;
    lastY = pointerY;
  };

  const onPointerOver = (event: PointerEvent): void => {
    if (event.pointerType === "touch") return;
    updateInteractive(event.target);
  };

  const onPointerDown = (event: PointerEvent): void => {
    if (event.pointerType === "touch" || event.pointerType === "pen") {
      const ripple = document.createElement("span");
      ripple.className = "tap-ripple";
      ripple.style.left = `${event.clientX}px`;
      ripple.style.top = `${event.clientY}px`;
      (document.querySelector("#tap-layer") ?? document.body).appendChild(ripple);
      window.setTimeout(() => ripple.remove(), 700);
      options.onPress?.(event.clientX, event.clientY);
      options.onRipple?.(event.clientX, event.clientY, 1.4);
      return;
    }
    root.classList.add("is-pressing");
    spawnRipple(event.clientX, event.clientY, 1.8);
    options.onPress?.(event.clientX, event.clientY);
  };

  const onPointerUp = (): void => {
    root.classList.remove("is-pressing");
  };

  const onPointerLeave = (): void => {
    if (!active) return;
    setVisible(false);
    options.onLeave?.();
  };

  const onWindowBlur = (): void => {
    setVisible(false);
    options.onLeave?.();
  };

  const animate = (now: number): void => {
    const dt = lastFrame === 0 ? 1 / 60 : Math.min(0.05, (now - lastFrame) / 1000);
    lastFrame = now;

    if (active) {
      headX += (pointerX - headX) * (reducedMotion ? 1 : 0.55);
      headY += (pointerY - headY) * (reducedMotion ? 1 : 0.55);
      root.style.transform = `translate3d(${headX.toFixed(2)}px, ${headY.toFixed(2)}px, 0)`;
    }

    for (let index = 0; index < ripples.length; index += 1) {
      const ripple = ripples[index];
      if (!ripple.active) continue;
      ripple.age += dt;
      const progress = ripple.age / ripple.life;
      if (progress >= 1) {
        ripple.active = false;
        ripple.element.style.opacity = "0";
        continue;
      }
      const eased = 1 - (1 - progress) ** 2.6;
      const scale = 0.18 + eased * (3.0 + ripple.strength * 0.7);
      const fade = (1 - progress) ** 1.85;
      ripple.element.style.transform = `translate(-50%, -50%) scale(${scale.toFixed(3)})`;
      ripple.element.style.opacity = (
        Math.min(0.5, fade * (0.22 + ripple.strength * 0.16))
      ).toFixed(3);
    }

    raf = window.requestAnimationFrame(animate);
  };

  if (finePointer) {
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerover", onPointerOver, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("blur", onWindowBlur);
    raf = window.requestAnimationFrame(animate);
  } else {
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
  }

  return {
    setActive,
    destroy() {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerover", onPointerOver);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("blur", onWindowBlur);
      document.documentElement.classList.remove("has-custom-cursor");
      root.remove();
      layer.remove();
    },
  };
}
