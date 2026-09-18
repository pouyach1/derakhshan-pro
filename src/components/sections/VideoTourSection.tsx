"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { siteConfig } from "@/config/siteConfig";
import { HERO } from "@/config/home";
import { IOS_PAGE_SPRING } from "@/lib/motion/ios";

/**
 * قاب بصری زیر هیرو — فقط عکس (بدون ویدیو).
 */
export default function VideoTourSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const tour = siteConfig.videoTour;

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
          style={{ scale, opacity, y, rotate }}
          className="relative mx-auto aspect-[16/10] w-full max-w-4xl overflow-hidden rounded-[1.5rem] bg-[#0B132B] shadow-[0_40px_100px_-48px_rgba(11,19,43,0.65)] will-change-transform md:aspect-video md:rounded-[2rem]"
        >
          <Image
            src={HERO.image}
            alt={tour.title}
            fill
            sizes="(max-width: 768px) 100vw, 896px"
            className="object-cover object-center"
            priority={false}
          />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0B132B]/80 via-transparent to-[#0B132B]/25" />
        </motion.div>
      </div>
    </section>
  );
}
