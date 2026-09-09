export const EASE = {
  expoOut: [0.16, 1, 0.3, 1] as const,
  expoIn: [0.7, 0, 0.84, 0] as const,
  expoInOut: [0.87, 0, 0.13, 1] as const,
  site: [0.625, 0.05, 0, 1] as const,
};

export const PRELOADER_STORAGE_KEY = "preloader-shown";

export type IntroPhase = "booting" | "full" | "fast" | "done";
