"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowDown, ArrowLeft } from "lucide-react";
import { HERO } from "@/config/home";
import { SITE } from "@/config/site";
import { useIntro } from "@/components/providers/IntroProvider";
import { IOS_TAP_SPRING } from "@/lib/motion/ios";
import { EASE } from "@/lib/motion";

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.14,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: EASE.expoOut },
  },
};

/**
 * هیرو با همان عکس اصلی — بدون ویدیو.
 * زنده بودن از پارالاکس نرم + Ken Burns خفیف + ورود متن می‌آید.
 * ویدیو فقط در بخش VideoTourSection است.
 */
export default function HeroSection() {
  const { heroReady } = useIntro();
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 55, damping: 20, mass: 0.45 });
  const sy = useSpring(my, { stiffness: 55, damping: 20, mass: 0.45 });
  const bgX = useTransform(sx, [-0.5, 0.5], ["-1.8%", "1.8%"]);
  const bgY = useTransform(sy, [-0.5, 0.5], ["-1.4%", "1.4%"]);
  const contentX = useTransform(sx, [-0.5, 0.5], ["0.8%", "-0.8%"]);
  const glareX = useTransform(sx, (v) => `${50 + v * 36}%`);
  const glareY = useTransform(sy, (v) => `${40 + v * 28}%`);
  const glare = useMotionTemplate`radial-gradient(640px circle at ${glareX} ${glareY}, rgba(0,240,255,0.14), transparent 55%)`;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const mediaScale = useTransform(scrollYProgress, [0, 1], reduceMotion ? [1, 1] : [1.05, 1.14]);
  const mediaOpacity = useTransform(scrollYProgress, [0, 0.9], [1, 0.45]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 64]);
  const contentFade = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={sectionRef}
      data-home-hero
      className="relative min-h-[100dvh] overflow-hidden bg-slate-950 text-white"
      onMouseMove={(e) => {
        if (reduceMotion) return;
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onMouseLeave={() => {
        mx.set(0);
        my.set(0);
      }}
    >
      <motion.div
        className="absolute inset-[-3%] will-change-transform"
        style={{
          x: reduceMotion ? 0 : bgX,
          y: reduceMotion ? 0 : bgY,
          scale: mediaScale,
          opacity: mediaOpacity,
        }}
      >
        <motion.div
          className="absolute inset-0"
          animate={reduceMotion ? undefined : { scale: [1, 1.045, 1] }}
          transition={reduceMotion ? undefined : { duration: 22, repeat: Infinity, ease: "easeInOut" }}
        >
          <Image
            src={HERO.image}
            alt={HERO.title}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </motion.div>
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/55 to-slate-900/30" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,163,255,0.2),transparent_42%)]" />
      <motion.div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: glare }} />

      <motion.div
        className="rio-container relative z-10 flex min-h-[100dvh] flex-col justify-end pb-20 pt-28 md:pb-24"
        style={{ y: contentY, opacity: contentFade, x: reduceMotion ? 0 : contentX }}
        variants={container}
        initial="hidden"
        animate={heroReady ? "show" : "hidden"}
      >
        <motion.p
          variants={fadeUp}
          className="mb-5 font-sans text-xs font-semibold uppercase tracking-[0.28em] text-sky-400 md:text-sm"
        >
          {SITE.brandEn}
        </motion.p>

        <motion.p
          variants={fadeUp}
          className="mb-5 font-vazirmatn text-xs text-white/80 md:text-sm"
        >
          {HERO.badge}
        </motion.p>

        <motion.h1
          variants={fadeUp}
          className="max-w-4xl font-vazirmatn text-[clamp(1.85rem,5.2vw,3.6rem)] font-semibold leading-relaxed tracking-tight text-white"
        >
          {HERO.title}
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mt-5 max-w-2xl font-vazirmatn text-sm leading-relaxed text-white/85 md:text-base"
        >
          {HERO.subtitle}
        </motion.p>

        <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center gap-3">
          <motion.div whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.97 }} transition={IOS_TAP_SPRING}>
            <Link
              href={HERO.primaryCta.href}
              className="ios-tap-target group inline-flex items-center gap-2 rounded-full bg-sky-500 px-6 py-3 font-vazirmatn text-sm font-semibold text-white shadow-[0_12px_40px_-12px_rgba(0,163,255,0.8)] transition hover:bg-sky-400"
            >
              {HERO.primaryCta.label}
              <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
            </Link>
          </motion.div>
          <motion.div whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.97 }} transition={IOS_TAP_SPRING}>
            <Link
              href={HERO.secondaryCta.href}
              className="ios-tap-target inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-6 py-3 font-vazirmatn text-sm font-medium text-white backdrop-blur-md transition hover:border-sky-400/50 hover:bg-white/15"
            >
              {HERO.secondaryCta.label}
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        className="pointer-events-none absolute inset-x-0 bottom-5 z-10 flex justify-center md:bottom-7"
        initial={{ opacity: 0 }}
        animate={heroReady ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 1, duration: 0.55 }}
      >
        <motion.div
          className="flex flex-col items-center gap-2 text-[10px] tracking-[0.24em] text-white/50"
          animate={reduceMotion ? undefined : { y: [0, 5, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <span>ادامه</span>
          <ArrowDown className="h-3.5 w-3.5 text-cyan-300/70" />
        </motion.div>
      </motion.div>
    </section>
  );
}
