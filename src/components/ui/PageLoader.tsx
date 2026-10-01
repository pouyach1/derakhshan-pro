"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
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
 * درخشش → خط → برند یکپارچه (بدون شکستن اتصال حروف فارسی) → شعار → نوار → خروج
 */
const TIMELINE = {
  start: 150,
  ambient: 650,
  line: 550,
  brand: 1500,
  hold: 850,
  tagline: 1000,
  progress: 1350,
  exit: 800,
  wipe: 1150,
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
  const markVisible = lineVisible || brandVisible;

  return (
    <AnimatePresence>
      <motion.div
        key="derakhshan-page-loader"
        className="preloader_wrap pointer-events-auto fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#030B14] text-beige"
        data-preloader-wrap
        data-intro-ms={TOTAL_MS}
        style={{ willChange: "transform, opacity, clip-path" }}
        initial={{ clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
        animate={{
          clipPath: wiping
            ? "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)"
            : "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        }}
        transition={{ duration: phase === "fast" ? 0.48 : 0.95, ease: EASE.expoInOut }}
        role="status"
        aria-live="polite"
        aria-label={`در حال بارگذاری ${BRAND_FA}`}
      >
        <div className="absolute inset-0 bg-[#030B14]" data-preloader-bg />

        {showFullChrome ? (
          <>
            {/* deep vignette */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 85% 70% at 50% 50%, transparent 35%, rgba(3,11,20,0.85) 100%)",
              }}
            />

            {/* soft bloom open */}
            <motion.div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 h-[38vmax] w-[38vmax] -translate-x-1/2 -translate-y-1/2 rounded-full"
              initial={{ opacity: 0, scale: 0.35 }}
              animate={{
                opacity: ambientOn && !inExit ? [0.35, 0.7, 0.45] : 0,
                scale: ambientOn && !inExit ? [0.55, 1.05, 0.9] : 0.4,
              }}
              transition={{
                duration: ambientOn && !inExit ? 2.8 : 0.6,
                repeat: ambientOn && !inExit ? Infinity : 0,
                ease: "easeInOut",
              }}
              style={{
                background:
                  "radial-gradient(circle, rgba(0,200,255,0.28) 0%, rgba(0,120,200,0.12) 42%, transparent 70%)",
                filter: "blur(8px)",
              }}
            />

            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: ambientOn && !inExit ? 1 : 0 }}
              transition={{ duration: 1.1, ease: EASE.expoOut }}
              style={{
                background:
                  "radial-gradient(ellipse 72% 54% at 50% 46%, rgba(0,163,255,0.22), transparent 64%)",
              }}
            />

            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{
                opacity: ambientOn && !inExit ? [0.25, 0.55, 0.3] : 0,
              }}
              transition={{
                duration: 3.2,
                repeat: ambientOn && !inExit ? Infinity : 0,
                ease: "easeInOut",
              }}
              style={{
                background:
                  "radial-gradient(circle at 20% 28%, rgba(0,240,255,0.16), transparent 32%), radial-gradient(circle at 80% 72%, rgba(56,189,248,0.14), transparent 36%)",
              }}
            />

            {/* orbital rings */}
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-1/2 rounded-full border"
                style={{
                  width: `${16 + i * 11}rem`,
                  height: `${16 + i * 11}rem`,
                  marginLeft: `-${(16 + i * 11) / 2}rem`,
                  marginTop: `-${(16 + i * 11) / 2}rem`,
                  borderColor: `rgba(125,211,252,${0.1 + i * 0.04})`,
                }}
                initial={{ opacity: 0, scale: 0.55 }}
                animate={
                  ringsOn
                    ? {
                        opacity: [0.05, 0.32, 0.08],
                        scale: [0.88, 1.03, 0.95],
                        rotate: i % 2 === 0 ? [0, 12, 0] : [0, -10, 0],
                      }
                    : { opacity: 0, scale: 0.7 }
                }
                transition={{
                  duration: 3 + i * 0.4,
                  repeat: ringsOn ? Infinity : 0,
                  ease: "easeInOut",
                  delay: 0.15 + i * 0.1,
                }}
              />
            ))}

            {/* light sweep */}
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 w-[46%] skew-x-12 bg-gradient-to-l from-transparent via-white/[0.14] to-transparent"
              initial={{ x: "150%", opacity: 0 }}
              animate={
                ambientOn && !inExit
                  ? { x: ["150%", "-170%"], opacity: [0, 0.95, 0] }
                  : { opacity: 0 }
              }
              transition={{ duration: 2.35, delay: 0.25, ease: EASE.expoInOut }}
            />

            {/* second soft sweep later */}
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 w-[28%] bg-gradient-to-l from-transparent via-cyan-200/20 to-transparent"
              initial={{ x: "160%", opacity: 0 }}
              animate={
                brandVisible && !inExit
                  ? { x: ["160%", "-180%"], opacity: [0, 0.7, 0] }
                  : { opacity: 0 }
              }
              transition={{ duration: 1.8, delay: 0.15, ease: EASE.expoInOut }}
            />

            {/* floating particles */}
            {!inExit &&
              [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                <motion.span
                  key={`p-${i}`}
                  aria-hidden
                  className="pointer-events-none absolute rounded-full bg-cyan-200/90"
                  style={{
                    width: i % 3 === 0 ? 3 : 2,
                    height: i % 3 === 0 ? 3 : 2,
                    left: `${8 + ((i * 13) % 84)}%`,
                    top: `${14 + ((i * 11) % 70)}%`,
                    boxShadow: "0 0 10px rgba(0,240,255,0.45)",
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={
                    ambientOn
                      ? {
                          opacity: [0, 0.95, 0.2, 0.75, 0],
                          y: [0, -22 - (i % 4) * 6, -10, -32, -14],
                          scale: [0.3, 1.35, 0.7, 1.15, 0.25],
                        }
                      : { opacity: 0 }
                  }
                  transition={{
                    duration: 2.8 + (i % 4) * 0.35,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.15 + i * 0.08,
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
              {/* diamond mark */}
              <motion.div
                aria-hidden
                className="mb-7 flex h-3 w-3 items-center justify-center"
                initial={{ opacity: 0, scale: 0, rotate: 45 }}
                animate={
                  inExit
                    ? { opacity: 0, scale: 0 }
                    : markVisible
                      ? { opacity: 1, scale: 1, rotate: 45 }
                      : { opacity: 0, scale: 0, rotate: 45 }
                }
                transition={{ duration: 0.65, ease: EASE.expoOut }}
              >
                <span className="block h-2.5 w-2.5 rounded-[2px] bg-gradient-to-br from-cyan-200 via-sky-400 to-sky-600 shadow-[0_0_18px_rgba(56,189,248,0.65)]" />
              </motion.div>

              <motion.div
                className="mb-9 h-px w-[min(42vw,13rem)] origin-center overflow-hidden bg-beige/10"
                initial={{ scaleX: 0, opacity: 0 }}
                animate={
                  inExit
                    ? { scaleX: 0, opacity: 0 }
                    : lineVisible
                      ? { scaleX: 1, opacity: 1 }
                      : { scaleX: 0, opacity: 0 }
                }
                transition={{ duration: 0.75, ease: EASE.expoInOut }}
              >
                <motion.div
                  className="h-px w-full origin-center bg-gradient-to-l from-transparent via-sky-300 to-transparent"
                  animate={
                    lineVisible && !inExit
                      ? { opacity: [0.35, 1, 0.35] }
                      : { opacity: 0 }
                  }
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.div>

              {/* Brand as ONE connected Persian string — never split letters / no bg-clip */}
              <motion.div
                className="overflow-hidden py-2"
                dir="rtl"
                data-preloader-logo
                initial={{ opacity: 0, y: 28, scale: 1.04 }}
                animate={
                  inExit
                    ? { opacity: 0, y: -36, scale: 0.96 }
                    : brandVisible
                      ? { opacity: 1, y: 0, scale: 1 }
                      : { opacity: 0, y: 28, scale: 1.04 }
                }
                transition={
                  inExit
                    ? { duration: 0.6, ease: EASE.expoIn }
                    : { duration: 0.95, ease: EASE.expoOut }
                }
              >
                <motion.h1
                  className="whitespace-nowrap text-center font-vazirmatn text-[clamp(2.2rem,7.6vw,4.1rem)] font-semibold leading-[1.35] tracking-normal text-[#FFFEFC] will-change-transform"
                  style={{
                    textShadow:
                      "0 0 40px rgba(56,189,248,0.35), 0 0 80px rgba(0,163,255,0.18)",
                  }}
                  initial={{ y: "110%" }}
                  animate={
                    inExit
                      ? { y: "-115%" }
                      : brandVisible
                        ? { y: "0%" }
                        : { y: "110%" }
                  }
                  transition={
                    inExit
                      ? { duration: 0.55, ease: EASE.expoIn }
                      : { duration: 0.95, ease: EASE.expoOut }
                  }
                >
                  {BRAND_FA}
                </motion.h1>
              </motion.div>

              {/* soft glow under brand */}
              <motion.div
                aria-hidden
                className="mt-1 h-8 w-[min(55vw,16rem)] rounded-full bg-sky-400/25 blur-2xl"
                initial={{ opacity: 0, scaleX: 0.4 }}
                animate={
                  inExit
                    ? { opacity: 0 }
                    : brandVisible
                      ? { opacity: [0.25, 0.55, 0.3], scaleX: 1 }
                      : { opacity: 0, scaleX: 0.4 }
                }
                transition={{
                  duration: brandVisible && !inExit ? 2.2 : 0.4,
                  repeat: brandVisible && !inExit ? Infinity : 0,
                  ease: "easeInOut",
                }}
              />

              <motion.p
                dir="rtl"
                className="mt-5 max-w-lg text-center font-vazirmatn text-sm leading-8 tracking-normal text-sky-100/80 md:text-[0.95rem]"
                initial={{ opacity: 0, y: 14, filter: "blur(8px)" }}
                animate={
                  inExit
                    ? { opacity: 0, y: -12, filter: "blur(8px)" }
                    : taglineVisible
                      ? { opacity: 1, y: 0, filter: "blur(0px)" }
                      : { opacity: 0, y: 14, filter: "blur(8px)" }
                }
                transition={{ duration: 0.7, ease: EASE.expoOut }}
              >
                {TAGLINE_FA}
              </motion.p>

              <motion.div
                className="mt-11 h-px w-[min(52vw,17rem)] origin-center overflow-hidden bg-beige/10 will-change-transform"
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
                    : { duration: 0.6, ease: EASE.expoInOut }
                }
              >
                <motion.div
                  className="relative h-px w-full origin-right bg-gradient-to-l from-sky-300 via-white to-cyan-200 will-change-transform"
                  data-preloader-bar
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: progressVisible || inExit ? 1 : 0 }}
                  transition={{
                    duration: 1.2,
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
