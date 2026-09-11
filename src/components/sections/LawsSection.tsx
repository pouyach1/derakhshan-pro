"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import { LAWS } from "@/config/home";
import type { Law } from "@/types";
import { cn } from "@/lib/utils";

const TILT = { stiffness: 220, damping: 22, mass: 0.55 };

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
    scale: 0.95,
    filter: "blur(10px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
    },
  },
};

export default function LawsSection() {
  const gridRef = useRef<HTMLDivElement>(null);
  const inView = useInView(gridRef, { once: true, amount: 0.15 });
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (inView) setRevealed(true);
  }, [inView]);

  // Safety net if IntersectionObserver misses (e.g. overlays / headless)
  useEffect(() => {
    const timer = window.setTimeout(() => setRevealed(true), 1800);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <section
      className="relative overflow-hidden py-section-md text-slate-900"
      style={{ backgroundColor: "#EAF6FF" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at top, rgba(0,163,255,0.18), transparent 55%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 top-10 h-72 w-72 rounded-full bg-sky-400/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-sky-300/25 blur-3xl"
      />

      <div className="rio-container relative">
        <div className="mb-12 max-w-4xl">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.22em] text-sky-500">
            Investment Principles
          </p>
          <h2 className="mt-3 font-vazirmatn text-2xl font-semibold leading-relaxed text-slate-900 md:text-4xl">
            ۱۲ اصل کلیدی سرمایه‌گذاری ملکی
          </h2>
          <p className="mt-4 font-vazirmatn text-sm leading-relaxed text-slate-600 md:text-base">
            وقتی معاملات زیادی انجام می‌دهید، الگوها خودشان را نشان می‌دهند.
          </p>
        </div>

        <motion.div
          ref={gridRef}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate={revealed ? "visible" : "hidden"}
        >
          {LAWS.map((law, index) => (
            <motion.div key={law.statement} variants={cardVariants} className="h-full">
              <PrincipleCard law={law} index={index} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function PrincipleCard({ law, index }: { law: Law; index: number }) {
  const cardRef = useRef<HTMLElement>(null);
  const [hovered, setHovered] = useState(false);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, TILT);
  const springY = useSpring(rotateY, TILT);
  const lift = useSpring(0, { stiffness: 200, damping: 20 });
  const depth = useSpring(0, { stiffness: 200, damping: 20 });

  const glareX = useTransform(springY, [-14, 14], [78, 22]);
  const glareY = useTransform(springX, [-12, 12], [22, 78]);
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(56,189,248,0.45), transparent 55%)`;

  const indexLabel = String(index + 1).padStart(2, "0");

  const onMove = (event: React.MouseEvent<HTMLElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    rotateY.set((0.5 - px) * 18);
    rotateX.set((py - 0.5) * -14);
  };

  const onEnter = () => {
    setHovered(true);
    lift.set(-6);
    depth.set(20);
  };

  const onLeave = () => {
    setHovered(false);
    rotateX.set(0);
    rotateY.set(0);
    lift.set(0);
    depth.set(0);
  };

  return (
    <motion.article
      ref={cardRef}
      whileHover={{ scale: 1.02 }}
      onMouseMove={onMove}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{
        rotateX: springX,
        rotateY: springY,
        y: lift,
        z: depth,
        transformPerspective: 1000,
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
      className="group relative h-full min-h-[14rem] transform-gpu"
    >
      <div
        className={cn(
          "relative h-full overflow-hidden rounded-2xl border border-sky-200/70 bg-white/55 p-6 shadow-[0_18px_50px_-28px_rgba(0,163,255,0.45)] backdrop-blur-xl",
          "transition-colors duration-500 hover:border-sky-400/70 hover:bg-white/75",
        )}
        style={{ transformStyle: "preserve-3d" }}
      >
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 transition-opacity duration-500"
          style={{
            background: glare,
            opacity: hovered ? 1 : 0.35,
          }}
        />

        <span
          aria-hidden
          className="pointer-events-none absolute -left-1 -top-1 font-mono text-4xl font-bold text-sky-400/25 transition-colors duration-500 group-hover:text-sky-500/45 md:text-5xl"
          style={{ transform: "translateZ(8px)" }}
        >
          {indexLabel}
        </span>

        <div
          className="relative z-10 flex h-full flex-col justify-end pt-10"
          style={{ transform: "translateZ(24px)" }}
        >
          <p className="font-vazirmatn text-base font-medium leading-relaxed text-slate-800 transition-colors duration-500 group-hover:text-sky-700 md:text-lg">
            {law.statement}
          </p>
        </div>
      </div>
    </motion.article>
  );
}
