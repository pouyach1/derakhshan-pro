"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { Play } from "lucide-react";

const VIDEO_SRC = "/videos/hero-video.mp4";

export default function VideoTourSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Small → visible peak → fade away
  const scale = useTransform(
    scrollYProgress,
    [0, 0.35, 0.55, 0.85],
    reduceMotion ? [1, 1, 1, 1] : [0.55, 0.92, 1, 0.88],
  );
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.55, 0.78, 1],
    reduceMotion ? [1, 1, 1, 1, 1] : [0.35, 1, 1, 0.35, 0],
  );

  return (
    <section
      ref={sectionRef}
      aria-labelledby="video-tour-heading"
      className="relative overflow-hidden bg-[#F8FAFC] py-16 md:py-24"
    >
      <div className="rio-container relative">
        <div className="mb-8 flex flex-col items-center text-center md:mb-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-sky-200/70 bg-white/70 px-4 py-2 font-vazirmatn text-sm text-slate-800 shadow-sm backdrop-blur-xl">
            <span className="h-2 w-2 rounded-full bg-[#00F0FF]" />
            تور سینمایی املاک درخشان
          </span>
          <h2
            id="video-tour-heading"
            className="mt-4 max-w-2xl font-vazirmatn text-3xl font-black tracking-tight text-[#0B132B] md:text-4xl"
          >
            تجربه بصری ملک، هم‌زمان با حرکت شما
          </h2>
        </div>

        <motion.div
          style={{ scale, opacity }}
          className="relative mx-auto aspect-[16/10] w-full max-w-3xl overflow-hidden rounded-2xl bg-[#0B132B] shadow-[0_32px_80px_-40px_rgba(11,19,43,0.55)] will-change-transform md:aspect-video md:max-w-4xl md:rounded-3xl"
        >
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src={VIDEO_SRC}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            poster="/assets/images/hero-mobile.webp"
          />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0B132B]/75 via-transparent to-[#0B132B]/20" />

          <div className="absolute inset-x-0 bottom-0 p-5 md:p-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold text-[#00F0FF] backdrop-blur-md">
              <Play className="h-3.5 w-3.5 fill-current" />
              پخش زنده تور اختصاصی
            </div>
            <p className="mt-3 max-w-md font-vazirmatn text-base font-semibold text-white md:text-lg">
              از نقطه کوچک تا قاب کامل — فقط با اسکرول.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
