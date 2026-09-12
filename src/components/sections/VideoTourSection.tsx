"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

const VIDEO_SRC = "/videos/derakhshan-tour.mp4";

export default function VideoTourSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(
    scrollYProgress,
    [0, 0.28, 0.5, 0.72, 1],
    reduceMotion ? [1, 1, 1, 1, 1] : [0.75, 0.96, 1.05, 0.9, 0.8],
  );
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.18, 0.55, 0.82, 1],
    reduceMotion ? [1, 1, 1, 1, 1] : [0.55, 1, 1, 0.55, 0],
  );
  const radius = useTransform(
    scrollYProgress,
    [0, 0.45, 0.7, 1],
    reduceMotion ? [24, 24, 24, 24] : [28, 18, 24, 28],
  );
  const y = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    reduceMotion ? [0, 0, 0] : [40, 0, -24],
  );

  return (
    <section
      ref={sectionRef}
      aria-labelledby="video-tour-heading"
      className="relative bg-[#F1EFEA] py-16 md:py-24"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-slate-950/5 to-transparent" />

      <div className="rio-container relative">
        <div className="mb-8 flex justify-center md:mb-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/70 px-4 py-2 font-vazirmatn text-sm text-slate-800 shadow-sm backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
            تور ویدئویی املاک درخشان
          </span>
        </div>

        <motion.div
          style={{ scale, opacity, y, borderRadius: radius }}
          className="relative mx-auto aspect-[16/10] w-full max-w-6xl overflow-hidden bg-slate-900 shadow-[0_40px_100px_-40px_rgba(15,23,42,0.55)] will-change-transform md:aspect-[16/9]"
        >
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src={VIDEO_SRC}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            poster="/images/landing/hero/banner.jpg"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-slate-950/15" />

          <div className="absolute inset-x-0 bottom-0 p-5 md:p-8">
            <h2
              id="video-tour-heading"
              className="max-w-xl font-vazirmatn text-lg font-semibold text-white md:text-2xl"
            >
              تجربه بصری املاک منتخب، هم‌زمان با اسکرول
            </h2>
            <p className="mt-2 max-w-lg font-vazirmatn text-xs text-white/75 md:text-sm">
              از نمای فشرده تا تمام‌عرض — تور ویدئویی با حرکت نرم همراه شماست.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
