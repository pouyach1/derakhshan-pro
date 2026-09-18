"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { Play } from "lucide-react";
import { siteConfig } from "@/config/siteConfig";
import { IOS_PAGE_SPRING } from "@/lib/motion/ios";

/**
 * تور ویدیویی — جای درست ویدیو در سایت، با انیمیشن اسکرول قوی.
 * هیرو عمداً ویدیو ندارد؛ فقط عکس.
 */
export default function VideoTourSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduceMotion = useReducedMotion();
  const tour = siteConfig.videoTour;
  const inView = useInView(sectionRef, { amount: 0.35 });
  const [ready, setReady] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const rawScale = useTransform(
    scrollYProgress,
    [0, 0.28, 0.5, 0.78, 1],
    reduceMotion ? [1, 1, 1, 1, 1] : [0.72, 0.94, 1, 0.96, 0.9],
  );
  const rawOpacity = useTransform(
    scrollYProgress,
    [0, 0.18, 0.45, 0.8, 1],
    reduceMotion ? [1, 1, 1, 1, 1] : [0.25, 0.85, 1, 0.75, 0.2],
  );
  const rawY = useTransform(scrollYProgress, [0, 0.5, 1], reduceMotion ? [0, 0, 0] : [48, 0, -24]);
  const rawRotate = useTransform(scrollYProgress, [0, 0.5, 1], reduceMotion ? [0, 0, 0] : [1.2, 0, -0.6]);

  const scale = useSpring(rawScale, { stiffness: 90, damping: 22, mass: 0.5 });
  const opacity = useSpring(rawOpacity, { stiffness: 100, damping: 24 });
  const y = useSpring(rawY, { stiffness: 90, damping: 22 });
  const rotate = useSpring(rawRotate, { stiffness: 80, damping: 20 });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (inView && !reduceMotion) {
      void video.play().then(() => setReady(true)).catch(() => undefined);
    } else {
      video.pause();
    }
  }, [inView, reduceMotion]);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="video-tour-heading"
      className="relative overflow-hidden bg-[#F8FAFC] py-16 md:py-24"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(0,163,255,0.08),_transparent_55%)]" />

      <div className="rio-container relative">
        <motion.div
          className="mb-8 flex flex-col items-center text-center md:mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={IOS_PAGE_SPRING}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-sky-200/70 bg-white/70 px-4 py-2 font-vazirmatn text-sm text-slate-800 shadow-sm backdrop-blur-xl">
            <motion.span
              className="h-2 w-2 rounded-full bg-[#00F0FF]"
              animate={reduceMotion ? undefined : { scale: [1, 1.35, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
            {tour.badge}
          </span>
          <h2
            id="video-tour-heading"
            className="mt-4 max-w-2xl font-vazirmatn text-3xl font-black tracking-tight text-[#0B132B] md:text-4xl"
          >
            {tour.title}
          </h2>
          <p className="mt-3 max-w-lg font-vazirmatn text-sm leading-7 text-slate-600 md:text-base">
            {tour.caption}
          </p>
        </motion.div>

        <motion.div
          ref={frameRef}
          style={{ scale, opacity, y, rotate }}
          className="relative mx-auto aspect-[16/10] w-full max-w-4xl overflow-hidden rounded-[1.5rem] bg-[#0B132B] shadow-[0_40px_100px_-48px_rgba(11,19,43,0.65)] will-change-transform md:aspect-video md:rounded-[2rem]"
        >
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
            style={{ opacity: ready || reduceMotion ? 1 : 0.85 }}
            src={tour.videoSrc}
            loop
            muted
            playsInline
            preload="metadata"
            poster={tour.poster}
          />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0B132B]/80 via-transparent to-[#0B132B]/25" />

          {/* قاب نور هنگام ورود به ویوپورت */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-cyan-300/30"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: [0, 1, 0.35] } : { opacity: 0 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          />

          {!reduceMotion ? (
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 w-1/4 bg-gradient-to-l from-transparent via-white/15 to-transparent"
              animate={inView ? { x: ["-40%", "160%"] } : { x: "-40%" }}
              transition={{ duration: 2.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            />
          ) : null}

          <div className="absolute inset-x-0 bottom-0 p-5 md:p-7">
            <motion.div
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold text-[#00F0FF] backdrop-blur-md"
              animate={
                reduceMotion || !inView
                  ? undefined
                  : { boxShadow: ["0 0 0 0 rgba(0,240,255,0)", "0 0 24px 0 rgba(0,240,255,0.35)", "0 0 0 0 rgba(0,240,255,0)"] }
              }
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              {tour.liveBadge}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
