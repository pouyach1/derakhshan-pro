"use client";

import { AnimatePresence, motion, useAnimationControls } from "framer-motion";
import { useEffect, useState } from "react";
import { useIntro } from "@/components/providers/IntroProvider";
import { EASE } from "@/lib/motion";

const LETTERS = ["R", "I", "O", " ", "P", "R", "O", "P", "E", "R", "T", "Y"] as const;

/**
 * Forensic recreation of RIO Property preloader.
 * Timeline translated from GSAP in animations/downloaded-assets/main.js.
 */
export default function PageLoader() {
  const { phase, markDone, beginHeroReveal } = useIntro();
  const [visible, setVisible] = useState(true);
  const logoControls = useAnimationControls();
  const letterControls = useAnimationControls();
  const barWrapControls = useAnimationControls();
  const barControls = useAnimationControls();
  const curtainControls = useAnimationControls();

  useEffect(() => {
    if (phase === "booting" || phase === "done") return;

    let cancelled = false;
    const runFull = phase === "full";

    async function play() {
      if (!runFull) {
        beginHeroReveal();
        await curtainControls.start({
          clipPath: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
          transition: { duration: 1.1, ease: EASE.expoInOut },
        });
        if (!cancelled) {
          setVisible(false);
          markDone();
        }
        return;
      }

      // Stage 1 — Initial brand reveal
      await Promise.all([
        logoControls.start({
          x: "6vw",
          scale: 1,
          transition: { duration: 2.5, ease: EASE.expoOut },
        }),
        letterControls.start((i) => ({
          x: "0%",
          transition: { duration: 1.5, ease: EASE.expoOut, delay: i * 0.1 },
        })),
      ]);
      if (cancelled) return;

      // Stage 2 — Progress / settle
      await Promise.all([
        logoControls.start({
          x: 0,
          transition: { duration: 2, ease: EASE.expoInOut },
        }),
        barWrapControls.start({
          scaleX: 1,
          transition: { duration: 2, ease: EASE.expoInOut },
        }),
        barControls.start({
          scaleX: 1,
          transition: { duration: 2.5, ease: EASE.site, delay: 0.15 },
        }),
      ]);
      if (cancelled) return;

      // Stage 3 — Exit + curtain wipe (hero starts with curtain; forensic at≈4s)
      beginHeroReveal();
      await Promise.all([
        logoControls.start({
          x: "-300%",
          transition: { duration: 2.5, ease: EASE.expoIn },
        }),
        barWrapControls.start({
          x: "-300%",
          transition: { duration: 2.5, ease: EASE.expoIn },
        }),
        barControls.start({
          scaleX: 0,
          transition: { duration: 1.5, ease: EASE.expoIn, delay: 0.25 },
        }),
        letterControls.start((i) => ({
          x: "-125%",
          transition: { duration: 1.5, ease: EASE.expoIn, delay: i * 0.05 },
        })),
        curtainControls.start({
          clipPath: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
          transition: { duration: 1.75, ease: EASE.expoInOut, delay: 1.25 },
        }),
      ]);

      if (!cancelled) {
        setVisible(false);
        markDone();
      }
    }

    const timer = window.setTimeout(() => {
      void play();
    }, 500);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [
    phase,
    logoControls,
    letterControls,
    barWrapControls,
    barControls,
    curtainControls,
    markDone,
    beginHeroReveal,
  ]);

  // Opaque brand veil until session decision — prevents hero flash
  if (phase === "booting") {
    return (
      <div
        className="pointer-events-auto fixed inset-0 z-[100] bg-brand-800"
        aria-hidden
        style={{ willChange: "opacity" }}
      />
    );
  }

  if (phase === "done") return null;

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          key="rio-page-loader"
          className="preloader_wrap pointer-events-auto fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-brand-800 text-beige"
          data-preloader-wrap
          style={{
            willChange: "transform, opacity, clip-path",
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          }}
          initial={false}
          animate={curtainControls}
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
          role="status"
          aria-live="polite"
          aria-label="Loading RIO Property"
        >
          <div className="absolute inset-0 bg-brand-800" data-preloader-bg />

          <div className="relative z-10 flex flex-col items-center gap-8">
            <motion.div
              className="flex origin-center items-center will-change-transform"
              initial={{ x: 0, scale: phase === "full" ? 2 : 1 }}
              animate={logoControls}
              data-preloader-logo
            >
              <div className="flex overflow-hidden">
                {LETTERS.map((letter, index) =>
                  letter === " " ? (
                    <span key={`space-${index}`} className="inline-block w-[0.35em]" />
                  ) : (
                    <motion.span
                      key={`${letter}-${index}`}
                      className="inline-block font-display text-[clamp(1.75rem,4vw,2.75rem)] uppercase tracking-[0.08em] will-change-transform"
                      custom={index}
                      initial={{ x: "125%" }}
                      animate={letterControls}
                    >
                      {letter}
                    </motion.span>
                  ),
                )}
              </div>
            </motion.div>

            {phase === "full" ? (
              <motion.div
                className="h-px w-[33vw] origin-left overflow-hidden bg-beige/25 will-change-transform md:w-[12vw]"
                initial={{ scaleX: 0 }}
                animate={barWrapControls}
                data-preloader-bar-wrap
              >
                <motion.div
                  className="h-px w-full origin-left bg-beige will-change-transform"
                  initial={{ scaleX: 0 }}
                  animate={barControls}
                  data-preloader-bar
                />
              </motion.div>
            ) : null}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
