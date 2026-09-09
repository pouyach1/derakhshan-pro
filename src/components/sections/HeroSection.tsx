"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { HERO } from "@/config/home";
import { useIntro } from "@/components/providers/IntroProvider";
import { EASE } from "@/lib/motion";

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, x: "40%", scale: 0.5 },
  show: {
    opacity: 1,
    x: "0%",
    scale: 1,
    transition: { duration: 1.35, ease: EASE.expoOut },
  },
};

const titleWord = {
  hidden: { x: "100%", opacity: 0 },
  show: {
    x: "0%",
    opacity: 1,
    transition: { duration: 1.5, ease: EASE.expoOut },
  },
};

export default function HeroSection() {
  const { heroReady } = useIntro();

  return (
    <section
      data-home-hero
      className="relative min-h-[100dvh] overflow-hidden bg-brand-800 text-beige"
    >
      <Image
        src={HERO.image}
        alt="Cape Town commercial property skyline"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center opacity-90"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-800/80 via-brand-800/25 to-brand-800/40" />

      <motion.div
        className="rio-container relative z-10 flex min-h-[100dvh] flex-col justify-end pb-16 pt-page-top md:pb-24"
        variants={container}
        initial="hidden"
        animate={heroReady ? "show" : "hidden"}
      >
        <div className="mb-10 grid max-w-3xl gap-6 md:grid-cols-[auto_1fr] md:items-end">
          <motion.p
            variants={fadeUp}
            className="text-sm uppercase tracking-[0.18em] text-beige/85"
            data-paragraph="left"
          >
            {HERO.eyebrow.join(" / ")}
          </motion.p>
          <motion.p
            variants={fadeUp}
            className="max-w-md text-sm leading-relaxed text-beige/85 md:text-base"
            data-paragraph="right"
          >
            {HERO.support}
          </motion.p>
        </div>

        <h1 className="max-w-5xl font-display text-[clamp(3.2rem,9vw,7rem)] uppercase leading-[0.92] tracking-tight text-beige">
          {HERO.title.split(" ").map((word) => (
            <span key={word} className="mr-[0.25em] inline-block overflow-hidden align-bottom">
              <motion.span
                className="inline-block will-change-transform"
                variants={titleWord}
                transition={{ duration: 1.5, ease: EASE.expoOut }}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </h1>
      </motion.div>
    </section>
  );
}
