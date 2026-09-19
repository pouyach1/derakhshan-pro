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
  | "hold"
  | "tagline"
  | "progress"
  | "exit"
  | "wipe"
  | "gone";

/**
 * اینتروی سینمایی برند (~20 ثانیه):
 * درخشش → خط → «دپارتمان درخشان» حرف‌به‌حرف → مکث → شعار → نوار → پردهٔ خروج
 */
export default function PageLoader() {
  const { phase, markDone, beginHeroReveal } = useIntro();
  const [stage, setStage] = useState<Stage>("idle");
  const runId = useRef(0);

  const skipIntro = () => {
    beginHeroReveal();
    setStage("gone");
    markDone();
  };

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
      after(700, () => {
        setStage("gone");
        markDone();
      });
      return () => {
        runId.current += 1;
        timers.forEach((t) => window.clearTimeout(t));
      };
    }

    // Full cinematic timeline (~20s)
    const t0 = 600;
    after(t0, () => setStage("ambient")); // +1.4s glow
    after(t0 + 1400, () => setStage("line")); // +1.6s line
    after(t0 + 1400 + 1600, () => setStage("brand")); // +4.2s letters
    after(t0 + 1400 + 1600 + 4200, () => setStage("hold")); // +2.2s breathe
    after(t0 + 1400 + 1600 + 4200 + 2200, () => setStage("tagline")); // +2.4s
    after(t0 + 1400 + 1600 + 4200 + 2200 + 2400, () => setStage("progress")); // +3.2s
    after(t0 + 1400 + 1600 + 4200 + 2200 + 2400 + 3200, () => {
      setStage("exit");
      beginHeroReveal();
    }); // +1.8s exit
    after(t0 + 1400 + 1600 + 4200 + 2200 + 2400 + 3200 + 1800, () => setStage("wipe")); // +2.2s wipe
    after(t0 + 1400 + 1600 + 4200 + 2200 + 2400 + 3200 + 1800 + 2200, () => {
      setStage("gone");
      markDone();
    });

    return () => {
      runId.current += 1;
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [phase, markDone, beginHeroReveal]);

  // Booting flash only on home — other routes must stay interactive immediately.
  if (phase === "booting") {
    return null;
  }

  if (phase === "done" || stage === "gone") return null;

  const showFullChrome = phase === "full";
  const inExit = stage === "exit" || stage === "wipe";
  const wiping = stage === "wipe";
  const brandVisible =
    stage === "brand" ||
    stage === "hold" ||
    stage === "tagline" ||
    stage === "progress" ||
    inExit;
  const taglineVisible = stage === "tagline" || stage === "progress" || inExit;
  const lineVisible =
    stage === "line" ||
    stage === "brand" ||
    stage === "hold" ||
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
        transition={{ duration: phase === "fast" ? 1.2 : 2.2, ease: EASE.expoInOut }}
        role="status"
        aria-live="polite"
        aria-label={`در حال بارگذاری ${BRAND_FA}`}
      >
        <div className="absolute inset-0 bg-[#061A2E]" data-preloader-bg />

        {showFullChrome ? (
          <>
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: ambientOn && !inExit ? 1 : 0 }}
              transition={{ duration: 1.8, ease: EASE.expoOut }}
              style={{
                background:
                  "radial-gradient(ellipse 75% 58% at 50% 44%, rgba(0,163,255,0.26), transparent 64%)",
              }}
            />
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{
                opacity: ambientOn && !inExit ? [0.3, 0.55, 0.38] : 0,
              }}
              transition={{
                duration: ambientOn && !inExit ? 6.5 : 1.4,
                repeat: ambientOn && !inExit ? Infinity : 0,
                ease: "easeInOut",
              }}
              style={{
                background:
                  "radial-gradient(circle at 22% 28%, rgba(0,240,255,0.14), transparent 36%), radial-gradient(circle at 78% 70%, rgba(0,163,255,0.12), transparent 40%)",
              }}
            />
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 w-[38%] bg-gradient-to-l from-transparent via-white/[0.07] to-transparent"
              initial={{ x: "130%", opacity: 0 }}
              animate={
                ambientOn && !inExit
                  ? { x: ["130%", "-150%"], opacity: [0, 0.85, 0] }
                  : { opacity: 0 }
              }
              transition={{ duration: 5.2, delay: 0.8, ease: EASE.expoInOut }}
            />
          </>
        ) : null}

        <button
          type="button"
          onClick={skipIntro}
          className="absolute bottom-8 start-1/2 z-20 -translate-x-1/2 rounded-full border border-white/20 bg-white/5 px-5 py-2.5 font-vazirmatn text-sm text-beige/90 backdrop-blur-md transition hover:border-cyan-300/50 hover:bg-white/10 hover:text-white"
        >
          ورود به سایت
        </button>

        <div className="relative z-10 flex w-full max-w-3xl flex-col items-center px-6">
          {showFullChrome ? (
            <>
              <motion.div
                className="mb-12 h-px w-[min(46vw,15rem)] origin-center overflow-hidden bg-beige/15"
                initial={{ scaleX: 0, opacity: 0 }}
                animate={
                  inExit
                    ? { scaleX: 0, opacity: 0 }
                    : lineVisible
                      ? { scaleX: 1, opacity: 1 }
                      : { scaleX: 0, opacity: 0 }
                }
                transition={{ duration: 1.55, ease: EASE.expoInOut }}
              >
                <motion.div
                  className="h-px w-full origin-center bg-gradient-to-l from-transparent via-sky-300 to-transparent"
                  animate={
                    lineVisible && !inExit
                      ? { opacity: [0.45, 1, 0.45] }
                      : { opacity: 0 }
                  }
                  transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.div>

              <motion.div
                className="overflow-hidden"
                dir="rtl"
                data-preloader-logo
                initial={{ opacity: 0, y: 22, filter: "blur(12px)", scale: 1.04 }}
                animate={
                  inExit
                    ? { opacity: 0, y: -42, filter: "blur(14px)", scale: 0.94 }
                    : brandVisible
                      ? {
                          opacity: 1,
                          y: 0,
                          filter: "blur(0px)",
                          scale: 1,
                        }
                      : { opacity: 0, y: 22, filter: "blur(12px)", scale: 1.04 }
                }
                transition={
                  inExit
                    ? { duration: 1.7, ease: EASE.expoIn }
                    : { duration: 1.85, ease: EASE.expoOut }
                }
              >
                <motion.span
                  className="inline-block whitespace-nowrap font-vazirmatn text-[clamp(2.15rem,7.4vw,4rem)] font-semibold leading-none tracking-normal text-[#FFFEFC] will-change-transform"
                  style={{
                    textShadow: "0 0 40px rgba(0,163,255,0.18)",
                    wordSpacing: "0",
                    letterSpacing: "0",
                  }}
                  initial={{ y: "115%", opacity: 0 }}
                  animate={{
                    y: inExit ? "-125%" : brandVisible ? "0%" : "115%",
                    opacity: inExit ? 0 : brandVisible ? 1 : 0,
                  }}
                  transition={
                    inExit
                      ? { duration: 1.25, ease: EASE.expoIn }
                      : { duration: 1.45, ease: EASE.expoOut, delay: 0.08 }
                  }
                >
                  {"دپارتمان\u200Cدرخشان"}
                </motion.span>
              </motion.div>

              <motion.p
                dir="rtl"
                className="mt-7 max-w-lg text-center font-vazirmatn text-sm tracking-[0.12em] text-sky-100/70 md:text-[0.95rem]"
                initial={{ opacity: 0, y: 14 }}
                animate={
                  inExit
                    ? { opacity: 0, y: -18 }
                    : taglineVisible
                      ? { opacity: 1, y: 0 }
                      : { opacity: 0, y: 14 }
                }
                transition={{ duration: 1.35, ease: EASE.expoOut }}
              >
                {TAGLINE_FA}
              </motion.p>

              <motion.div
                className="mt-14 h-px w-[min(52vw,17rem)] origin-center overflow-hidden bg-beige/15 will-change-transform"
                data-preloader-bar-wrap
                initial={{ scaleX: 0, opacity: 0 }}
                animate={
                  inExit
                    ? { scaleX: 0, opacity: 0 }
                    : progressVisible
                      ? { scaleX: 1, opacity: 1 }
                      : { scaleX: 0, opacity: 0 }
                }
                transition={
                  inExit
                    ? { duration: 1.3, ease: EASE.expoIn }
                    : { duration: 1.2, ease: EASE.expoInOut }
                }
              >
                <motion.div
                  className="h-px w-full origin-right bg-gradient-to-l from-sky-300 via-[#FFFEFC] to-[#FFFEFC] will-change-transform"
                  data-preloader-bar
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: progressVisible || inExit ? 1 : 0 }}
                  transition={{
                    duration: 3,
                    ease: EASE.site,
                    delay: stage === "progress" ? 0.15 : 0,
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
