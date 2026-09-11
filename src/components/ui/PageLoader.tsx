"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useIntro } from "@/components/providers/IntroProvider";
import { EASE } from "@/lib/motion";

const LETTERS = ["D", "E", "R", "A", "K", "H", "S", "H", "A", "N", " ", "P", "R", "O"] as const;

type Stage = "idle" | "brand" | "progress" | "exit" | "wipe" | "gone";

/**
 * Forensic recreation of RIO Property preloader.
 * Timeline translated from GSAP in animations/downloaded-assets/main.js.
 */
export default function PageLoader() {
  const { phase, markDone, beginHeroReveal } = useIntro();
  const [stage, setStage] = useState<Stage>("idle");
  const runId = useRef(0);

  useEffect(() => {
    if (phase === "booting" || phase === "done") return;

    const id = ++runId.current;
    const timers: number[] = [];
    const after = (ms: number, fn: () => void) => {
      timers.push(window.setTimeout(() => {
        if (runId.current === id) fn();
      }, ms));
    };

    if (phase === "fast") {
      setStage("wipe");
      beginHeroReveal();
      after(1100, () => {
        setStage("gone");
        markDone();
      });
      return () => {
        runId.current += 1;
        timers.forEach((t) => window.clearTimeout(t));
      };
    }

    // Full intro — forensic delay 0.5s then staged timeline
    after(500, () => setStage("brand"));
    // Stage 1 settles ~2.5s (logo scale + letter stagger)
    after(500 + 2500, () => setStage("progress"));
    // Stage 2 progress bar ~2.5s (overlap with settle)
    after(500 + 2500 + 2500, () => {
      setStage("exit");
      beginHeroReveal();
    });
    // Stage 3 logo exit starts; curtain wipe delayed ~1.25s (forensic at≈4 relative to exit cluster)
    after(500 + 2500 + 2500 + 1250, () => setStage("wipe"));
    // Wipe duration 1.75s
    after(500 + 2500 + 2500 + 1250 + 1750, () => {
      setStage("gone");
      markDone();
    });

    return () => {
      runId.current += 1;
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [phase, markDone, beginHeroReveal]);

  if (phase === "booting") {
    return (
      <div
        className="pointer-events-auto fixed inset-0 z-[100] bg-brand-800"
        aria-hidden
        style={{ willChange: "opacity" }}
      />
    );
  }

  if (phase === "done" || stage === "gone") return null;

  const showFullChrome = phase === "full";
  const inExit = stage === "exit" || stage === "wipe";
  const wiping = stage === "wipe";

  return (
    <AnimatePresence>
      <motion.div
        key="rio-page-loader"
        className="preloader_wrap pointer-events-auto fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-brand-800 text-beige"
        data-preloader-wrap
        style={{ willChange: "transform, opacity, clip-path" }}
        initial={{ clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
        animate={{
          clipPath: wiping
            ? "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)"
            : "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        }}
        transition={{ duration: phase === "fast" ? 1.1 : 1.75, ease: EASE.expoInOut }}
        role="status"
        aria-live="polite"
        aria-label="در حال بارگذاری Derakhshan Properties"
      >
        <div className="absolute inset-0 bg-brand-800" data-preloader-bg />

        <div className="relative z-10 flex flex-col items-center gap-8">
          {showFullChrome ? (
            <motion.div
              className="flex origin-center items-center will-change-transform"
              data-preloader-logo
              initial={{ x: 0, scale: 2 }}
              animate={
                stage === "idle"
                  ? { x: 0, scale: 2 }
                  : stage === "brand"
                    ? { x: "6vw", scale: 1 }
                    : stage === "progress"
                      ? { x: 0, scale: 1 }
                      : { x: "-300%", scale: 1 }
              }
              transition={
                inExit
                  ? { duration: 2.5, ease: EASE.expoIn }
                  : stage === "progress"
                    ? { duration: 2, ease: EASE.expoInOut }
                    : { duration: 2.5, ease: EASE.expoOut }
              }
            >
              <div className="flex overflow-hidden">
                {LETTERS.map((letter, index) =>
                  letter === " " ? (
                    <span key={`space-${index}`} className="inline-block w-[0.35em]">
                      {" "}
                    </span>
                  ) : (
                    <motion.span
                      key={`${letter}-${index}`}
                      className="inline-block font-display text-[clamp(1.75rem,4vw,2.75rem)] uppercase tracking-[0.08em] will-change-transform"
                      initial={{ x: "125%" }}
                      animate={{ x: inExit ? "-125%" : stage === "idle" ? "125%" : "0%" }}
                      transition={
                        inExit
                          ? { duration: 1.5, ease: EASE.expoIn, delay: index * 0.05 }
                          : { duration: 1.5, ease: EASE.expoOut, delay: index * 0.1 }
                      }
                    >
                      {letter}
                    </motion.span>
                  ),
                )}
              </div>
            </motion.div>
          ) : null}

          {showFullChrome ? (
            <motion.div
              className="h-px w-[33vw] origin-left overflow-hidden bg-beige/25 will-change-transform md:w-[12vw]"
              data-preloader-bar-wrap
              initial={{ scaleX: 0 }}
              animate={
                inExit
                  ? { scaleX: 0, x: "-300%" }
                  : stage === "progress" || stage === "brand"
                    ? { scaleX: stage === "progress" ? 1 : 0, x: 0 }
                    : { scaleX: 0, x: 0 }
              }
              transition={
                inExit
                  ? { duration: 2.5, ease: EASE.expoIn }
                  : { duration: 2, ease: EASE.expoInOut }
              }
            >
              <motion.div
                className="h-px w-full origin-left bg-beige will-change-transform"
                data-preloader-bar
                initial={{ scaleX: 0 }}
                animate={{ scaleX: stage === "progress" || inExit ? 1 : 0 }}
                transition={{ duration: 2.5, ease: EASE.site, delay: stage === "progress" ? 0.15 : 0 }}
              />
            </motion.div>
          ) : null}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
