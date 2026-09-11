"use client";

import { useRef, useState } from "react";
import {
  motion,
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
  return (
    <section className="relative overflow-hidden bg-slate-950 py-section-md text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(0,163,255,0.12),_transparent_55%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl"
      />

      <div className="rio-container relative">
        <div className="mb-12 max-w-4xl">
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.22em] text-sky-400">
            Investment Principles
          </p>
          <h2 className="mt-3 font-vazirmatn text-2xl font-semibold leading-relaxed md:text-4xl">
            ۱۲ اصل کلیدی سرمایه‌گذاری ملکی
          </h2>
          <p className="mt-4 font-vazirmatn text-sm leading-relaxed text-slate-300 md:text-base">
            وقتی معاملات زیادی انجام می‌دهید، الگوها خودشان را نشان می‌دهند.
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
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
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(0,163,255,0.35), transparent 55%)`;

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
          "relative h-full overflow-hidden rounded-2xl border border-white/10 bg-slate-900/40 p-6 backdrop-blur-xl",
          "transition-colors duration-500 hover:border-sky-500/40",
        )}
        style={{ transformStyle: "preserve-3d" }}
      >
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 transition-opacity duration-500"
          style={{
            background: glare,
            opacity: hovered ? 1 : 0,
          }}
        />

        <span
          aria-hidden
          className="pointer-events-none absolute -left-1 -top-1 font-mono text-4xl font-bold text-sky-500/20 transition-colors duration-500 group-hover:text-sky-400/40 md:text-5xl"
          style={{ transform: "translateZ(8px)" }}
        >
          {indexLabel}
        </span>

        <div
          className="relative z-10 flex h-full flex-col justify-end pt-10"
          style={{ transform: "translateZ(24px)" }}
        >
          <p
            className={cn(
              "font-vazirmatn text-base font-medium leading-relaxed md:text-lg",
              "bg-gradient-to-l from-white via-white to-white bg-clip-text text-transparent",
              "transition-all duration-500",
              "group-hover:from-sky-200 group-hover:via-white group-hover:to-sky-300",
            )}
          >
            {law.statement}
          </p>
        </div>
      </div>
    </motion.article>
  );
}
