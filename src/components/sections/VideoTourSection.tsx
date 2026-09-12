"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { Play, Sparkles } from "lucide-react";

const VIDEO_SRC = "/videos/hero-video.mp4";

const spring = { type: "spring" as const, stiffness: 80, damping: 18 };

export default function VideoTourSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    reduceMotion ? [1, 1, 1, 1, 1] : [0.78, 0.94, 1.06, 0.92, 0.82],
  );
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.55, 0.85, 1],
    reduceMotion ? [1, 1, 1, 1, 1] : [0.4, 1, 1, 0.65, 0.2],
  );
  const radius = useTransform(
    scrollYProgress,
    [0, 0.4, 0.7, 1],
    reduceMotion ? [28, 28, 28, 28] : [36, 18, 28, 36],
  );
  const y = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    reduceMotion ? [0, 0, 0] : [56, 0, -36],
  );
  const glow = useTransform(
    scrollYProgress,
    [0, 0.45, 1],
    reduceMotion ? [0.2, 0.2, 0.2] : [0.15, 0.55, 0.2],
  );
  const titleY = useTransform(
    scrollYProgress,
    [0.2, 0.55, 0.9],
    reduceMotion ? [0, 0, 0] : [40, 0, -20],
  );

  return (
    <section
      ref={sectionRef}
      aria-labelledby="video-tour-heading"
      className="relative overflow-hidden bg-[#F8FAFC] py-20 md:py-28"
    >
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute -right-24 top-10 h-80 w-80 rounded-full bg-[#00F0FF]/20 blur-3xl"
          animate={
            reduceMotion
              ? undefined
              : { x: [0, 30, -16, 0], y: [0, 24, -12, 0], opacity: [0.3, 0.55, 0.3] }
          }
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -left-20 bottom-10 h-96 w-96 rounded-full bg-sky-400/15 blur-3xl"
          animate={
            reduceMotion
              ? undefined
              : { x: [0, -24, 18, 0], y: [0, -20, 14, 0], opacity: [0.25, 0.45, 0.25] }
          }
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="rio-container relative">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={spring}
          className="mb-10 flex flex-col items-center text-center md:mb-12"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-sky-200/70 bg-white/70 px-4 py-2 font-vazirmatn text-sm text-slate-800 shadow-lg shadow-sky-500/10 backdrop-blur-xl">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00F0FF] opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00F0FF]" />
            </span>
            تور سینمایی املاک درخشان
          </span>
          <h2
            id="video-tour-heading"
            className="mt-5 max-w-2xl font-vazirmatn text-3xl font-black tracking-tight text-[#0B132B] md:text-5xl"
          >
            تجربه بصری ملک، هم‌زمان با حرکت شما
          </h2>
          <p className="mt-3 max-w-xl font-vazirmatn text-sm leading-7 text-slate-600 md:text-base">
            ویدیوی اختصاصی هیرو با عمق پارالاکس، درخشش یخ‌آبی و حرکت فیزیکی اسکرول.
          </p>
        </motion.div>

        <motion.div
          style={{ scale, opacity, y, borderRadius: radius }}
          className="relative mx-auto aspect-[16/10] w-full max-w-6xl overflow-hidden bg-[#0B132B] shadow-[0_50px_120px_-48px_rgba(11,19,43,0.65)] will-change-transform md:aspect-[16/9]"
        >
          <motion.div
            style={{ opacity: glow }}
            className="pointer-events-none absolute -inset-10 rounded-[3rem] bg-[#00F0FF]/25 blur-3xl"
          />

          <video
            className="absolute inset-0 h-full w-full scale-[1.02] object-cover"
            src={VIDEO_SRC}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            poster="/images/landing/hero/banner.jpg"
          />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0B132B]/80 via-[#0B132B]/15 to-[#0B132B]/25" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-sky-500/15 via-transparent to-[#00F0FF]/10" />

          <motion.div
            style={{ y: titleY }}
            className="absolute inset-x-0 bottom-0 p-6 md:p-10"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold text-[#00F0FF] backdrop-blur-xl">
              <Play className="h-3.5 w-3.5 fill-current" />
              پخش زنده تور اختصاصی
            </div>
            <p className="mt-4 max-w-xl font-vazirmatn text-lg font-semibold text-white md:text-2xl">
              از قاب فشرده تا تمام‌عرض سینمایی — حرکت نرم همراه اسکرول شماست.
            </p>
            <p className="mt-2 inline-flex items-center gap-2 font-vazirmatn text-xs text-sky-100/80 md:text-sm">
              <Sparkles className="h-3.5 w-3.5 text-[#00F0FF]" />
              طراحی‌شده برای تجربه لوکس روی دسکتاپ و موبایل
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
