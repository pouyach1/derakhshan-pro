"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useIntro } from "@/components/providers/IntroProvider";
import { EASE } from "@/lib/motion";
import { siteConfig } from "@/config/siteConfig";

const BRAND_FA = siteConfig.brand.nameFa; // دپارتمان درخشان
const TAGLINE_FA = siteConfig.brand.taglineFa;

type Stage =
  | "idle"
  | "ambient"
  | "line"
  | "brand"
  | "tagline"
  | "progress"
  | "exit"
  | "wipe"
  | "gone";

const CHARACTERS = Array.from(BRAND_FA);

/**
 * اینتروی سینمایی برند — طولانی‌تر و فارسی:
 * درخشش محیط → خط طلایی → «دپارتمان درخشان» حرف‌به‌حرف → شعار → نوار → پردهٔ خروج
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
      timers.push(
        window.setTimeout(() => {
          if (runId.current === id) fn();
        }, ms),
      );
    };

    if (phase === "fast") {
      setStage("wipe");
      beginHeroReveal();
      after(1200, () => {
        setStage("gone");
        markDone();
      });
      return () => {
        runId.current += 1;
        timers.forEach((t) => window.clearTimeout(t));
      };
    }

    // Full cinematic timeline (~14s)
    after(400, () => setStage("ambient"));
    after(400 + 1100, () => setStage("line"));
    after(400 + 1100 + 1400, () => setStage("brand"));
    after(400 + 1100 + 1400 + 3200, () => setStage("tagline"));
    after(400 + 1100 + 1400 + 3200 + 1800, () => setStage("progress"));
    after(400 + 1100 + 1400 + 3200 + 1800 + 2800, () => {
      setStage("exit");
      beginHeroReveal();
    });
    after(400 + 1100 + 1400 + 3200 + 1800 + 2800 + 1600, () => setStage("wipe"));
    after(400 + 1100 + 1400 + 3200 + 1800 + 2800 + 1600 + 2000, () => {
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
  const brandVisible =
    stage === "brand" || stage === "tagline" || stage === "progress" || inExit;
  const taglineVisible = stage === "tagline" || stage === "progress" || inExit;
  const lineVisible =
    stage === "line" ||
    stage === "brand" ||
    stage === "tagline" ||
    stage === "progress" ||
    inExit;
  const progressVisible = stage === "progress" || inExit;
  const ambientOn = stage !== "idle";

  return (
    <AnimatePresence>
      <motion.div
        key="derakhshan-page-loader"
        className="preloader_wrap pointer-events-auto fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#061A2E] text-beige"
        data-preloader-wrap
        style={{ willChange: "transform, opacity, clip-path" }}
        initial={{ clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
        animate={{
          clipPath: wiping
            ? "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)"
            : "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        }}
        transition={{ duration: phase === "fast" ? 1.2 : 2, ease: EASE.expoInOut }}
        role="status"
        aria-live="polite"
        aria-label={`در حال بارگذاری ${BRAND_FA}`}
      >
        {/* Deep navy field */}
        <div className="absolute inset-0 bg-[#061A2E]" data-preloader-bg />

        {/* Soft aurora / atmospheric light */}
        {showFullChrome ? (
          <>
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{
                opacity: ambientOn && !inExit ? 1 : inExit ? 0 : 0,
              }}
              transition={{ duration: 1.4, ease: EASE.expoOut }}
              style={{
                background:
                  "radial-gradient(ellipse 70% 55% at 50% 42%, rgba(0,163,255,0.22), transparent 62%)",
              }}
            />
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{
                opacity: ambientOn && !inExit ? [0.35, 0.55, 0.4] : 0,
              }}
              transition={{
                duration: ambientOn && !inExit ? 5.5 : 1.2,
                repeat: ambientOn && !inExit ? Infinity : 0,
                ease: "easeInOut",
              }}
              style={{
                background:
                  "radial-gradient(circle at 28% 30%, rgba(0,240,255,0.12), transparent 38%), radial-gradient(circle at 72% 68%, rgba(0,163,255,0.1), transparent 42%)",
              }}
            />
            {/* Slow sheen sweep */}
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 w-1/3 bg-gradient-to-l from-transparent via-white/[0.06] to-transparent"
              initial={{ x: "120%", opacity: 0 }}
              animate={
                ambientOn && !inExit
                  ? { x: ["120%", "-140%"], opacity: [0, 0.7, 0] }
                  : { opacity: 0 }
              }
              transition={{ duration: 4.2, delay: 0.6, ease: EASE.expoInOut }}
            />
          </>
        ) : null}

        <div className="relative z-10 flex w-full max-w-3xl flex-col items-center px-6">
          {showFullChrome ? (
            <>
              {/* Hairline draw */}
              <motion.div
                className="mb-10 h-px w-[min(42vw,14rem)] origin-center overflow-hidden bg-beige/20"
                initial={{ scaleX: 0, opacity: 0 }}
                animate={
                  inExit
                    ? { scaleX: 0, opacity: 0 }
                    : lineVisible
                      ? { scaleX: 1, opacity: 1 }
                      : { scaleX: 0, opacity: 0 }
                }
                transition={{ duration: 1.35, ease: EASE.expoInOut }}
              >
                <motion.div
                  className="h-px w-full origin-center bg-gradient-to-l from-transparent via-sky-300 to-transparent"
                  animate={
                    lineVisible && !inExit
                      ? { opacity: [0.55, 1, 0.55] }
                      : { opacity: 0 }
                  }
                  transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.div>

              {/* Brand — دپارتمان درخشان */}
              <motion.div
                className="flex flex-wrap items-center justify-center gap-x-[0.12em] overflow-hidden"
                dir="rtl"
                data-preloader-logo
                initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
                animate={
                  inExit
                    ? { opacity: 0, y: -36, filter: "blur(12px)", scale: 0.96 }
                    : brandVisible
                      ? { opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }
                      : { opacity: 0, y: 18, filter: "blur(10px)", scale: 1.02 }
                }
                transition={
                  inExit
                    ? { duration: 1.5, ease: EASE.expoIn }
                    : { duration: 1.6, ease: EASE.expoOut }
                }
              >
                {CHARACTERS.map((char, index) =>
                  char === " " ? (
                    <span
                      key={`space-${index}`}
                      className="inline-block w-[0.45em]"
                      aria-hidden
                    />
                  ) : (
                    <motion.span
                      key={`${char}-${index}`}
                      className="inline-block font-vazirmatn text-[clamp(2rem,7vw,3.75rem)] font-semibold leading-none tracking-tight text-[#FFFEFC] will-change-transform"
                      initial={{ y: "110%", opacity: 0 }}
                      animate={{
                        y: inExit ? "-120%" : brandVisible ? "0%" : "110%",
                        opacity: inExit ? 0 : brandVisible ? 1 : 0,
                      }}
                      transition={
                        inExit
                          ? {
                              duration: 1.15,
                              ease: EASE.expoIn,
                              delay: (CHARACTERS.length - index) * 0.045,
                            }
                          : {
                              duration: 1.25,
                              ease: EASE.expoOut,
                              delay: index * 0.09,
                            }
                      }
                    >
                      {char}
                    </motion.span>
                  ),
                )}
              </motion.div>

              {/* Tagline */}
              <motion.p
                dir="rtl"
                className="mt-6 max-w-md text-center font-vazirmatn text-sm tracking-[0.08em] text-sky-100/75 md:text-base"
                initial={{ opacity: 0, y: 12 }}
                animate={
                  inExit
                    ? { opacity: 0, y: -16 }
                    : taglineVisible
                      ? { opacity: 1, y: 0 }
                      : { opacity: 0, y: 12 }
                }
                transition={{ duration: 1.1, ease: EASE.expoOut }}
              >
                {TAGLINE_FA}
              </motion.p>

              {/* Progress bar */}
              <motion.div
                className="mt-12 h-px w-[min(48vw,16rem)] origin-center overflow-hidden bg-beige/20 will-change-transform"
                data-preloader-bar-wrap
                initial={{ scaleX: 0, opacity: 0 }}
                animate={
                  inExit
                    ? { scaleX: 0, opacity: 0 }
                    : progressVisible || stage === "tagline"
                      ? { scaleX: 1, opacity: 1 }
                      : { scaleX: 0, opacity: 0 }
                }
                transition={
                  inExit
                    ? { duration: 1.2, ease: EASE.expoIn }
                    : { duration: 1.1, ease: EASE.expoInOut }
                }
              >
                <motion.div
                  className="h-px w-full origin-right bg-gradient-to-l from-sky-300 via-beige to-beige will-change-transform"
                  data-preloader-bar
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: progressVisible || inExit ? 1 : 0 }}
                  transition={{
                    duration: 2.6,
                    ease: EASE.site,
                    delay: stage === "progress" ? 0.1 : 0,
                  }}
                />
              </motion.div>
            </>
          ) : null}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
