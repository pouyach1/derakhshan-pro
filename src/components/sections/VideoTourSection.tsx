"use client";

import { MouseEvent, useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
<<<<<<< HEAD
import { Play } from "lucide-react";

const VIDEO_SRC = "/videos/hero-video.mp4";
=======
import { Play, Sparkles } from "lucide-react";

const VIDEO_SRC = "/videos/hero-video.mp4";

const spring = { type: "spring" as const, stiffness: 70, damping: 16 };
const softSpring = { type: "spring" as const, stiffness: 50, damping: 20 };

const HEADLINE = ["تجربه", "بصری", "ملک،", "هم‌زمان", "با", "حرکت", "شما"];
>>>>>>> origin/main

export default function VideoTourSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

<<<<<<< HEAD
  // Small → visible peak → fade away
  const scale = useTransform(
    scrollYProgress,
    [0, 0.35, 0.55, 0.85],
    reduceMotion ? [1, 1, 1, 1] : [0.55, 0.92, 1, 0.88],
=======
  const rawScale = useTransform(
    scrollYProgress,
    [0, 0.22, 0.5, 0.78, 1],
    reduceMotion ? [1, 1, 1, 1, 1] : [0.72, 0.92, 1.08, 0.9, 0.78],
>>>>>>> origin/main
  );
  const rawOpacity = useTransform(
    scrollYProgress,
<<<<<<< HEAD
    [0, 0.2, 0.55, 0.78, 1],
    reduceMotion ? [1, 1, 1, 1, 1] : [0.35, 1, 1, 0.35, 0],
=======
    [0, 0.12, 0.5, 0.88, 1],
    reduceMotion ? [1, 1, 1, 1, 1] : [0.25, 1, 1, 0.55, 0.15],
  );
  const rawY = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    reduceMotion ? [0, 0, 0] : [80, 0, -48],
>>>>>>> origin/main
  );
  const rawRotateX = useTransform(
    scrollYProgress,
    [0, 0.35, 0.55, 1],
    reduceMotion ? [0, 0, 0, 0] : [14, 2, 0, -6],
  );
  const rawRadius = useTransform(
    scrollYProgress,
    [0, 0.4, 0.7, 1],
    reduceMotion ? [28, 28, 28, 28] : [42, 16, 24, 40],
  );
  const rawGlow = useTransform(
    scrollYProgress,
    [0, 0.45, 1],
    reduceMotion ? [0.2, 0.2, 0.2] : [0.12, 0.7, 0.18],
  );
  const videoScale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    reduceMotion ? [1, 1, 1] : [1.18, 1.04, 1.12],
  );
  const titleY = useTransform(
    scrollYProgress,
    [0.2, 0.55, 0.9],
    reduceMotion ? [0, 0, 0] : [56, 0, -28],
  );
  const titleOpacity = useTransform(
    scrollYProgress,
    [0.15, 0.35, 0.75, 0.95],
    reduceMotion ? [1, 1, 1, 1] : [0, 1, 1, 0.2],
  );
  const scanX = useTransform(
    scrollYProgress,
    [0, 1],
    reduceMotion ? ["-20%", "-20%"] : ["-30%", "130%"],
  );

  const scale = useSpring(rawScale, { stiffness: 90, damping: 22 });
  const opacity = useSpring(rawOpacity, { stiffness: 90, damping: 22 });
  const y = useSpring(rawY, { stiffness: 90, damping: 22 });
  const rotateX = useSpring(rawRotateX, { stiffness: 80, damping: 20 });
  const radius = useSpring(rawRadius, { stiffness: 80, damping: 20 });
  const glow = useSpring(rawGlow, { stiffness: 70, damping: 18 });

  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const springTiltX = useSpring(tiltX, { stiffness: 160, damping: 18 });
  const springTiltY = useSpring(tiltY, { stiffness: 160, damping: 18 });
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(40);
  const glare = useMotionTemplate`radial-gradient(520px circle at ${glareX}% ${glareY}%, rgba(0,240,255,0.35), transparent 55%)`;

  function onMove(event: MouseEvent<HTMLDivElement>) {
    if (reduceMotion || !frameRef.current) return;
    const rect = frameRef.current.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    tiltX.set((0.5 - py) * 8);
    tiltY.set((px - 0.5) * 10);
    glareX.set(px * 100);
    glareY.set(py * 100);
  }

  function onLeave() {
    tiltX.set(0);
    tiltY.set(0);
    glareX.set(50);
    glareY.set(40);
  }

  return (
    <section
      ref={sectionRef}
      aria-labelledby="video-tour-heading"
<<<<<<< HEAD
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
=======
      className="relative overflow-hidden bg-[#F8FAFC] py-20 md:py-28"
    >
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute -right-24 top-10 h-80 w-80 rounded-full bg-[#00F0FF]/25 blur-3xl"
          animate={
            reduceMotion
              ? undefined
              : {
                  x: [0, 40, -20, 0],
                  y: [0, 30, -16, 0],
                  scale: [1, 1.15, 0.95, 1],
                  opacity: [0.28, 0.62, 0.32, 0.28],
                }
          }
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -left-20 bottom-10 h-96 w-96 rounded-full bg-sky-400/20 blur-3xl"
          animate={
            reduceMotion
              ? undefined
              : {
                  x: [0, -30, 22, 0],
                  y: [0, -26, 18, 0],
                  scale: [1, 1.1, 0.92, 1],
                  opacity: [0.22, 0.5, 0.28, 0.22],
                }
          }
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        {!reduceMotion &&
          [0, 1, 2, 3, 4].map((i) => (
            <motion.span
              key={i}
              className="absolute h-1.5 w-1.5 rounded-full bg-[#00F0FF]/70"
              style={{
                right: `${12 + i * 16}%`,
                top: `${18 + (i % 3) * 22}%`,
              }}
              animate={{
                y: [0, -28, 0],
                opacity: [0.15, 0.9, 0.15],
                scale: [0.6, 1.4, 0.6],
              }}
              transition={{
                duration: 4.5 + i * 0.6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.35,
              }}
            />
          ))}
      </div>

      <div className="rio-container relative">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.35 }}
          transition={softSpring}
          className="mb-10 flex flex-col items-center text-center md:mb-14"
        >
          <motion.span
            whileHover={reduceMotion ? undefined : { scale: 1.04, y: -2 }}
            transition={spring}
            className="inline-flex items-center gap-2 rounded-full border border-sky-200/70 bg-white/70 px-4 py-2 font-vazirmatn text-sm text-slate-800 shadow-lg shadow-sky-500/10 backdrop-blur-xl"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00F0FF] opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00F0FF]" />
            </span>
            تور سینمایی املاک درخشان
          </motion.span>

          <h2
            id="video-tour-heading"
            className="mt-5 flex max-w-3xl flex-wrap justify-center gap-x-2 gap-y-1 font-vazirmatn text-3xl font-black tracking-tight text-[#0B132B] md:text-5xl"
          >
            {HEADLINE.map((word, index) => (
              <motion.span
                key={`${word}-${index}`}
                initial={reduceMotion ? false : { opacity: 0, y: 28, filter: "blur(8px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: false, amount: 0.6 }}
                transition={{ ...spring, delay: reduceMotion ? 0 : index * 0.06 }}
                className="inline-block"
              >
                {word}
              </motion.span>
            ))}
          </h2>

          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.6 }}
            transition={{ ...softSpring, delay: 0.35 }}
            className="mt-4 max-w-xl font-vazirmatn text-sm leading-7 text-slate-600 md:text-base"
          >
            ویدیوی اختصاصی هیرو با عمق سه‌بعدی، درخشش یخ‌آبی و فیزیک اسکرول سینمایی.
          </motion.p>
>>>>>>> origin/main
        </motion.div>

        <div style={{ perspective: 1400 }} className="relative mx-auto w-full max-w-6xl">
          <motion.div
            ref={frameRef}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            style={{
              scale,
              opacity,
              y,
              borderRadius: radius,
              rotateX: reduceMotion ? 0 : rotateX,
            }}
            className="relative aspect-[16/10] w-full overflow-hidden bg-[#0B132B] shadow-[0_60px_140px_-48px_rgba(11,19,43,0.75)] will-change-transform md:aspect-[16/9]"
          >
            <motion.div
              style={{
                rotateX: reduceMotion ? 0 : springTiltX,
                rotateY: reduceMotion ? 0 : springTiltY,
                transformStyle: "preserve-3d",
              }}
              className="absolute inset-0"
            >
              <motion.div
                style={{ opacity: glow }}
                className="pointer-events-none absolute -inset-12 rounded-[3.5rem] bg-[#00F0FF]/30 blur-3xl"
              />

              <motion.video
                className="absolute inset-0 h-full w-full object-cover"
                style={{ scale: videoScale }}
                src={VIDEO_SRC}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                poster="/assets/images/hero-mobile.webp"
              />

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0B132B]/85 via-[#0B132B]/18 to-[#0B132B]/30" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-sky-500/20 via-transparent to-[#00F0FF]/12" />

              <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 hover:opacity-100 md:opacity-70"
                style={{ background: glare }}
              />

              {!reduceMotion && (
                <motion.div
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 w-1/3 skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent"
                  style={{ x: scanX }}
                />
              )}

              {!reduceMotion && (
                <motion.div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:100%_4px] opacity-30"
                  animate={{ backgroundPositionY: ["0px", "8px"] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
                />
              )}

              <motion.div
                style={{ y: titleY, opacity: titleOpacity }}
                className="absolute inset-x-0 bottom-0 p-6 md:p-10"
              >
                <motion.div
                  animate={
                    reduceMotion
                      ? undefined
                      : { scale: [1, 1.04, 1], boxShadow: ["0 0 0 0 rgba(0,240,255,0.0)", "0 0 28px 4px rgba(0,240,255,0.35)", "0 0 0 0 rgba(0,240,255,0.0)"] }
                  }
                  transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                  className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-xs font-bold text-[#00F0FF] backdrop-blur-xl"
                >
                  <motion.span
                    animate={reduceMotion ? undefined : { rotate: [0, 12, -8, 0] }}
                    transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Play className="h-3.5 w-3.5 fill-current" />
                  </motion.span>
                  پخش زنده تور اختصاصی
                </motion.div>

                <p className="mt-4 max-w-xl font-vazirmatn text-lg font-semibold text-white md:text-2xl">
                  از قاب فشرده تا تمام‌عرض سینمایی — حرکت نرم همراه اسکرول شماست.
                </p>
                <p className="mt-2 inline-flex items-center gap-2 font-vazirmatn text-xs text-sky-100/85 md:text-sm">
                  <Sparkles className="h-3.5 w-3.5 text-[#00F0FF]" />
                  طراحی‌شده برای تجربه لوکس روی دسکتاپ و موبایل
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
