"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { useIntro } from "@/components/providers/IntroProvider";
import { EASE } from "@/lib/motion";
import { siteConfig } from "@/config/siteConfig";

const BRAND_FA = siteConfig.brand.nameFa;
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
 * اینتروی سینمایی فشرده (~۸ ثانیه):
 * درخشش → خط → برند حرف‌به‌حرف → مکث → شعار → نوار → پردهٔ خروج
 */
const TIMELINE = {
  start: 150,
  ambient: 550,
  line: 600,
  brand: 1500,
  hold: 900,
  tagline: 1000,
  progress: 1400,
  exit: 800,
  wipe: 1100,
} as const;

const TOTAL_MS =
  TIMELINE.start +
  TIMELINE.ambient +
  TIMELINE.line +
  TIMELINE.brand +
  TIMELINE.hold +
  TIMELINE.tagline +
  TIMELINE.progress +
  TIMELINE.exit +
  TIMELINE.wipe;

export default function PageLoader() {
  const { phase, markDone, beginHeroReveal } = useIntro();
  const [stage, setStage] = useState<Stage>("idle");
  const runId = useRef(0);

  const letters = useMemo(() => Array.from(BRAND_FA), []);

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
      after(480, () => {
        setStage("gone");
        markDone();
      });
      return () => {
        runId.current += 1;
        timers.forEach((t) => window.clearTimeout(t));
      };
    }

    // Full cinematic timeline (~8s)
    let t = TIMELINE.start;
    after(t, () => setStage("ambient"));
    t += TIMELINE.ambient;
    after(t, () => setStage("line"));
    t += TIMELINE.line;
    after(t, () => setStage("brand"));
    t += TIMELINE.brand;
    after(t, () => setStage("hold"));
    t += TIMELINE.hold;
    after(t, () => setStage("tagline"));
    t += TIMELINE.tagline;
    after(t, () => setStage("progress"));
    t += TIMELINE.progress;
    after(t, () => {
      setStage("exit");
      beginHeroReveal();
    });
    t += TIMELINE.exit;
    after(t, () => setStage("wipe"));
    t += TIMELINE.wipe;
    after(t, () => {
      setStage("gone");
      markDone();
    });

    return () => {
      runId.current += 1;
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [phase, markDone, beginHeroReveal]);

  if (phase === "booting") return null;
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
  const ringsOn = ambientOn && !inExit;

  return (
    <AnimatePresence>
      <motion.div
        key="derakhshan-page-loader"
        className="preloader_wrap pointer-events-auto fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#040D18] text-beige"
        data-preloader-wrap
        data-intro-ms={TOTAL_MS}
        style={{ willChange: "transform, opacity, clip-path" }}
        initial={{ clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
        animate={{
          clipPath: wiping
            ? "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)"
            : "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        }}
        transition={{ duration: phase === "fast" ? 0.48 : 0.9, ease: EASE.expoInOut }}
        role="status"
        aria-live="polite"
        aria-label={`در حال بارگذاری ${BRAND_FA}`}
      >
        <div className="absolute inset-0 bg-[#040D18]" data-preloader-bg />

        {showFullChrome ? (
          <>
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{
                opacity: ambientOn && !inExit ? 1 : 0,
                scale: ambientOn && !inExit ? 1 : 1.06,
              }}
              transition={{ duration: 0.85, ease: EASE.expoOut }}
              style={{
                background:
                  "radial-gradient(ellipse 70% 52% at 50% 46%, rgba(0,163,255,0.32), transparent 62%)",
              }}
            />
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{
                opacity: ambientOn && !inExit ? [0.35, 0.7, 0.42] : 0,
              }}
              transition={{
                duration: ambientOn && !inExit ? 2.4 : 0.5,
                repeat: ambientOn && !inExit ? Infinity : 0,
                ease: "easeInOut",
              }}
              style={{
                background:
                  "radial-gradient(circle at 18% 30%, rgba(0,240,255,0.18), transparent 34%), radial-gradient(circle at 82% 68%, rgba(0,163,255,0.16), transparent 38%)",
              }}
            />

            {/* orbital rings */}
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-1/2 rounded-full border border-cyan-300/20"
                style={{
                  width: `${18 + i * 12}rem`,
                  height: `${18 + i * 12}rem`,
                  marginLeft: `-${(18 + i * 12) / 2}rem`,
                  marginTop: `-${(18 + i * 12) / 2}rem`,
                }}
                initial={{ opacity: 0, scale: 0.72, rotate: 0 }}
                animate={
                  ringsOn
                    ? {
                        opacity: [0.08, 0.28, 0.1],
                        scale: [0.92, 1.04, 0.96],
                        rotate: i % 2 === 0 ? [0, 18, 0] : [0, -14, 0],
                      }
                    : { opacity: 0, scale: 0.8 }
                }
                transition={{
                  duration: 2.8 + i * 0.35,
                  repeat: ringsOn ? Infinity : 0,
                  ease: "easeInOut",
                  delay: i * 0.12,
                }}
              />
            ))}

            {/* light sweep */}
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 w-[42%] bg-gradient-to-l from-transparent via-white/[0.12] to-transparent"
              initial={{ x: "140%", opacity: 0 }}
              animate={
                ambientOn && !inExit
                  ? { x: ["140%", "-160%"], opacity: [0, 1, 0] }
                  : { opacity: 0 }
              }
              transition={{ duration: 2.1, delay: 0.35, ease: EASE.expoInOut }}
            />

            {/* floating particles */}
            {!inExit &&
              [0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                <motion.span
                  key={`p-${i}`}
                  aria-hidden
                  className="pointer-events-none absolute h-1 w-1 rounded-full bg-cyan-300/80"
                  style={{
                    left: `${12 + (i * 11) % 76}%`,
                    top: `${18 + (i * 9) % 62}%`,
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={
                    ambientOn
                      ? {
                          opacity: [0, 0.9, 0.15, 0.8, 0],
                          y: [0, -18 - (i % 3) * 8, -8, -28, -12],
                          scale: [0.4, 1.4, 0.8, 1.2, 0.3],
                        }
                      : { opacity: 0 }
                  }
                  transition={{
                    duration: 2.6 + (i % 3) * 0.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.2 + i * 0.1,
                  }}
                />
              ))}
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
                className="mb-10 h-px w-[min(46vw,15rem)] origin-center overflow-hidden bg-beige/15"
                initial={{ scaleX: 0, opacity: 0 }}
                animate={
                  inExit
                    ? { scaleX: 0, opacity: 0 }
                    : lineVisible
                      ? { scaleX: 1, opacity: 1 }
                      : { scaleX: 0, opacity: 0 }
                }
                transition={{ duration: 0.7, ease: EASE.expoInOut }}
              >
                <motion.div
                  className="h-px w-full origin-center bg-gradient-to-l from-transparent via-sky-300 to-transparent"
                  animate={
                    lineVisible && !inExit
                      ? { opacity: [0.4, 1, 0.4], scaleX: [0.85, 1, 0.9] }
                      : { opacity: 0 }
                  }
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.div>

              <motion.div
                className="overflow-visible"
                dir="rtl"
                data-preloader-logo
                initial={{ opacity: 0, y: 18, filter: "blur(10px)", scale: 1.06 }}
                animate={
                  inExit
                    ? { opacity: 0, y: -36, filter: "blur(12px)", scale: 0.92 }
                    : brandVisible
                      ? { opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }
                      : { opacity: 0, y: 18, filter: "blur(10px)", scale: 1.06 }
                }
                transition={
                  inExit
                    ? { duration: 0.65, ease: EASE.expoIn }
                    : { duration: 0.75, ease: EASE.expoOut }
                }
              >
                <h1
                  className="flex flex-wrap items-center justify-center gap-x-[0.08em] whitespace-nowrap font-vazirmatn text-[clamp(2.15rem,7.4vw,4rem)] font-semibold leading-none tracking-normal will-change-transform"
                  style={{
                    textShadow:
                      "0 0 48px rgba(0,163,255,0.28), 0 0 80px rgba(0,240,255,0.12)",
                  }}
                >
                  {letters.map((ch, index) => (
                    <motion.span
                      key={`${ch}-${index}`}
                      className="inline-block bg-gradient-to-b from-white via-[#E8F7FF] to-sky-200 bg-clip-text text-transparent"
                      initial={{ y: "110%", opacity: 0, rotateX: 40, filter: "blur(8px)" }}
                      animate={
                        inExit
                          ? { y: "-120%", opacity: 0, filter: "blur(10px)" }
                          : brandVisible
                            ? { y: "0%", opacity: 1, rotateX: 0, filter: "blur(0px)" }
                            : { y: "110%", opacity: 0 }
                      }
                      transition={
                        inExit
                          ? { duration: 0.45, ease: EASE.expoIn, delay: index * 0.018 }
                          : {
                              duration: 0.55,
                              ease: EASE.expoOut,
                              delay: brandVisible ? 0.04 + index * 0.045 : 0,
                            }
                      }
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      {ch === " " ? "\u00A0" : ch}
                    </motion.span>
                  ))}
                </h1>
              </motion.div>

              <motion.p
                dir="rtl"
                className="mt-6 max-w-lg text-center font-vazirmatn text-sm tracking-[0.12em] text-sky-100/75 md:text-[0.95rem]"
                initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
                animate={
                  inExit
                    ? { opacity: 0, y: -14, filter: "blur(8px)" }
                    : taglineVisible
                      ? { opacity: 1, y: 0, filter: "blur(0px)" }
                      : { opacity: 0, y: 12, filter: "blur(6px)" }
                }
                transition={{ duration: 0.55, ease: EASE.expoOut }}
              >
                {TAGLINE_FA}
              </motion.p>

              <motion.div
                className="mt-12 h-px w-[min(52vw,17rem)] origin-center overflow-hidden bg-beige/15 will-change-transform"
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
                    ? { duration: 0.45, ease: EASE.expoIn }
                    : { duration: 0.55, ease: EASE.expoInOut }
                }
              >
                <motion.div
                  className="relative h-px w-full origin-right bg-gradient-to-l from-sky-300 via-[#FFFEFC] to-cyan-200 will-change-transform"
                  data-preloader-bar
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: progressVisible || inExit ? 1 : 0 }}
                  transition={{
                    duration: 1.15,
                    ease: EASE.site,
                    delay: stage === "progress" ? 0.08 : 0,
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
