"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
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
import { siteConfig } from "@/config/siteConfig";
import { useIntro } from "@/components/providers/IntroProvider";
import { IOS_TAP_SPRING } from "@/lib/motion/ios";
import { EASE } from "@/lib/motion";

const VIDEO_SRC = siteConfig.videoTour?.videoSrc ?? "/videos/hero-video.mp4";

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.11,
      delayChildren: 0.18,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.95, ease: EASE.expoOut },
  },
};

/**
 * هیرو زنده: عکس زیبا حفظ می‌شود (پوستر/fallback)، ویدیو و موشن سینمایی
 * برای قفل کردن توجه در اولین viewport.
 */
export default function HeroSection() {
  const { heroReady } = useIntro();
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18, mass: 0.4 });
  const sy = useSpring(my, { stiffness: 60, damping: 18, mass: 0.4 });
  const bgX = useTransform(sx, [-0.5, 0.5], ["-2.5%", "2.5%"]);
  const bgY = useTransform(sy, [-0.5, 0.5], ["-2%", "2%"]);
  const contentX = useTransform(sx, [-0.5, 0.5], ["1.2%", "-1.2%"]);
  const glareX = useTransform(sx, (v) => `${50 + v * 40}%`);
  const glareY = useTransform(sy, (v) => `${42 + v * 30}%`);
  const glare = useMotionTemplate`radial-gradient(680px circle at ${glareX} ${glareY}, rgba(0,240,255,0.16), transparent 55%)`;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const mediaScale = useTransform(scrollYProgress, [0, 1], reduceMotion ? [1, 1] : [1.08, 1.18]);
  const mediaOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.35]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 80]);
  const contentFade = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  useEffect(() => {
    if (reduceMotion) return;
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.playsInline = true;
    const play = () => {
      void video.play().then(() => setVideoReady(true)).catch(() => setVideoReady(false));
    };
    if (video.readyState >= 2) play();
    else video.addEventListener("loadeddata", play, { once: true });
    return () => video.removeEventListener("loadeddata", play);
  }, [reduceMotion]);

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
      {/* رسانه تمام‌عرض — عکس حفظ می‌شود، ویدیو روی آن زنده می‌شود */}
      <motion.div
        className="absolute inset-[-4%] will-change-transform"
        style={{
          x: reduceMotion ? 0 : bgX,
          y: reduceMotion ? 0 : bgY,
          scale: mediaScale,
          opacity: mediaOpacity,
        }}
      >
        <Image
          src={HERO.image}
          alt={HERO.title}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {!reduceMotion ? (
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-[1.4s]"
            style={{ opacity: videoReady ? 1 : 0 }}
            src={VIDEO_SRC}
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden
          />
        ) : null}
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-slate-950/25" />
      <div className="absolute inset-0 bg-gradient-to-l from-slate-950/55 via-transparent to-slate-950/20" />
      <motion.div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: glare }} />

      {/* خط نور سینمایی */}
      {!reduceMotion ? (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 w-1/3 bg-gradient-to-l from-transparent via-white/10 to-transparent"
          initial={{ x: "120%", opacity: 0 }}
          animate={heroReady ? { x: ["120%", "-140%"], opacity: [0, 0.55, 0] } : undefined}
          transition={{ duration: 2.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        />
      ) : null}

      <motion.div
        className="rio-container relative z-10 flex min-h-[100dvh] flex-col justify-end pb-20 pt-28 md:pb-28"
        style={{ y: contentY, opacity: contentFade, x: reduceMotion ? 0 : contentX }}
        variants={container}
        initial="hidden"
        animate={heroReady ? "show" : "hidden"}
      >
        {/* برند — سیگنال هیرو، نه eyebrow ضعیف */}
        <motion.p
          variants={fadeUp}
          className="mb-4 font-sans text-[clamp(0.95rem,2.4vw,1.35rem)] font-semibold uppercase tracking-[0.32em] text-cyan-300"
        >
          {SITE.brandEn}
        </motion.p>
        <motion.p
          variants={fadeUp}
          className="mb-6 font-vazirmatn text-sm text-white/70 md:text-base"
        >
          {SITE.nameFa}
          <span className="mx-2 text-cyan-400/70">·</span>
          {HERO.badge}
        </motion.p>

        <motion.h1
          variants={fadeUp}
          className="max-w-4xl font-vazirmatn text-[clamp(2.1rem,6vw,4.4rem)] font-black leading-[1.15] tracking-tight text-white"
        >
          {HERO.title}
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mt-5 max-w-2xl font-vazirmatn text-base leading-8 text-white/85 md:text-lg md:leading-9"
        >
          {HERO.subtitle}
        </motion.p>

        <motion.div variants={fadeUp} className="mt-9 flex flex-wrap items-center gap-3">
          <motion.div whileHover={{ y: -3, scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={IOS_TAP_SPRING}>
            <Link
              href={HERO.primaryCta.href}
              className="ios-tap-target group inline-flex items-center gap-2 rounded-full bg-cyan-400 px-7 py-3.5 font-vazirmatn text-sm font-bold text-slate-950"
            >
              {HERO.primaryCta.label}
              <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            </Link>
          </motion.div>
          <motion.div whileHover={{ y: -3, scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={IOS_TAP_SPRING}>
            <Link
              href={HERO.secondaryCta.href}
              className="ios-tap-target inline-flex items-center justify-center rounded-full border border-white/25 bg-white/10 px-7 py-3.5 font-vazirmatn text-sm font-semibold text-white backdrop-blur-md transition hover:border-cyan-300/50 hover:bg-white/15"
            >
              {HERO.secondaryCta.label}
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* دعوت به اسکرول — مینیمال، بدون بج شناور روی عکس */}
      <motion.div
        className="pointer-events-none absolute inset-x-0 bottom-5 z-10 flex justify-center md:bottom-7"
        initial={{ opacity: 0 }}
        animate={heroReady ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 1.1, duration: 0.6 }}
      >
        <motion.div
          className="flex flex-col items-center gap-2 text-[10px] tracking-[0.28em] text-white/55"
          animate={reduceMotion ? undefined : { y: [0, 6, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <span>کشف ادامه</span>
          <ArrowDown className="h-3.5 w-3.5 text-cyan-300/80" />
        </motion.div>
      </motion.div>
    </section>
  );
}
