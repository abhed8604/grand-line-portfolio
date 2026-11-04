export const SIM_WIDTH = 512;
export const SIM_HEIGHT = 293;
export const MAX_POINTS = SIM_WIDTH * SIM_HEIGHT;
export const TARGET_STRIDE = 4;

export const QUALITY_TIERS = {
  high: {
    name: "high" as const,
    label: "HIGH",
    points: 150016,
    rows: 293,
    dpr: 1.5,
    targetFps: 60,
  },
  medium: {
    name: "medium" as const,
    label: "MED",
    points: 65024,
    rows: 127,
    dpr: 1.5,
    targetFps: 60,
  },
  low: {
    name: "low" as const,
    label: "LOW",
    points: 16384,
    rows: 32,
    dpr: 1,
    targetFps: 30,
  },
  lite: {
    name: "lite" as const,
    label: "LITE",
    points: 4096,
    rows: 8,
    dpr: 1,
    targetFps: 30,
  },
} as const;

export type QualityName = keyof typeof QUALITY_TIERS;
export type QualityTier = (typeof QUALITY_TIERS)[QualityName];

export const MIN_POINTS = QUALITY_TIERS.lite.points;

export const isCoarsePointer = (): boolean =>
  typeof window !== "undefined" &&
  window.matchMedia("(pointer: coarse)").matches;

export const prefersReducedMotion = (): boolean =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
