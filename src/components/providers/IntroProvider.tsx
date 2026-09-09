"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { PRELOADER_STORAGE_KEY, type IntroPhase } from "@/lib/motion";

type IntroContextValue = {
  phase: IntroPhase;
  isIntroComplete: boolean;
  heroReady: boolean;
  beginHeroReveal: () => void;
  markDone: () => void;
};

const IntroContext = createContext<IntroContextValue | null>(null);

function readShown() {
  try {
    return sessionStorage.getItem(PRELOADER_STORAGE_KEY) === "1";
  } catch {
    return true;
  }
}

export function IntroProvider({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<IntroPhase>("booting");
  const [heroReady, setHeroReady] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.innerWidth <= 768;
    const shown = readShown();

    if (reduce) {
      setPhase("done");
      setHeroReady(true);
      return;
    }

    if (shown || mobile) {
      if (mobile && !shown) {
        try {
          sessionStorage.setItem(PRELOADER_STORAGE_KEY, "1");
        } catch {
          /* ignore */
        }
      }
      setPhase("fast");
      return;
    }

    setPhase("full");
  }, []);

  const beginHeroReveal = useCallback(() => {
    setHeroReady(true);
  }, []);

  const markDone = useCallback(() => {
    try {
      sessionStorage.setItem(PRELOADER_STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    setHeroReady(true);
    setPhase("done");
  }, []);

  useEffect(() => {
    if (phase === "done") return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (phase !== "booting") {
      document.documentElement.classList.add("show-intro");
    }
    return () => {
      document.body.style.overflow = previous;
      document.documentElement.classList.remove("show-intro");
    };
  }, [phase]);

  const value = useMemo<IntroContextValue>(
    () => ({
      phase,
      isIntroComplete: phase === "done",
      heroReady,
      beginHeroReveal,
      markDone,
    }),
    [phase, heroReady, beginHeroReveal, markDone],
  );

  return <IntroContext.Provider value={value}>{children}</IntroContext.Provider>;
}

export function useIntro() {
  const ctx = useContext(IntroContext);
  if (!ctx) {
    return {
      phase: "done" as IntroPhase,
      isIntroComplete: true,
      heroReady: true,
      beginHeroReveal: () => undefined,
      markDone: () => undefined,
    };
  }
  return ctx;
}

export default IntroProvider;
