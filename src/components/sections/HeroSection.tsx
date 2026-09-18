"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { HERO } from "@/config/home";
import { SITE } from "@/config/site";
import { useIntro } from "@/components/providers/IntroProvider";
import { EASE } from "@/lib/motion";

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.12,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 28, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: EASE.expoOut },
  },
};

export default function HeroSection() {
  const { heroReady } = useIntro();

  return (
    <section
      data-home-hero
      className="relative min-h-[100dvh] overflow-hidden bg-slate-950 text-white"
    >
      <Image
        src={HERO.image}
        alt={HERO.title}
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/55 to-slate-900/30" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,163,255,0.22),transparent_42%)]" />

      <motion.div
        className="rio-container relative z-10 flex min-h-[100dvh] flex-col justify-end pb-16 pt-28 md:pb-24"
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

        <motion.span
          variants={fadeUp}
          className="mb-5 inline-flex w-fit items-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 font-vazirmatn text-xs text-white/90 backdrop-blur-md md:text-sm"
        >
          {HERO.badge}
        </motion.span>

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
          <Link
            href={HERO.primaryCta.href}
            className="inline-flex items-center justify-center rounded-full bg-sky-500 px-6 py-3 font-vazirmatn text-sm font-semibold text-white shadow-[0_12px_40px_-12px_rgba(0,163,255,0.8)] transition hover:bg-sky-400"
          >
            {HERO.primaryCta.label}
          </Link>
          <Link
            href={HERO.secondaryCta.href}
            className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-6 py-3 font-vazirmatn text-sm font-medium text-white backdrop-blur-md transition hover:border-sky-400/50 hover:bg-white/15"
          >
            {HERO.secondaryCta.label}
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
