"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { FEATURED_PROPERTIES } from "@/config/admin";

const AUTO_MS = 5000;
const SPRING = { stiffness: 150, damping: 15 };

const textContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const textItem = {
  hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring" as const, stiffness: 120, damping: 18 },
  },
  exit: { opacity: 0, y: -12, filter: "blur(4px)", transition: { duration: 0.25 } },
};

export default function FeaturedPropertyHero() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progressKey, setProgressKey] = useState(0);
  const cardRef = useRef<HTMLElement>(null);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, SPRING);
  const springY = useSpring(rotateY, SPRING);
  const parallaxX = useTransform(springY, [-3, 3], [10, -10]);
  const parallaxY = useTransform(springX, [-3, 3], [-8, 8]);

  const property = FEATURED_PROPERTIES[index];
  const count = FEATURED_PROPERTIES.length;

  const goTo = useCallback(
    (next: number) => {
      setIndex((next + count) % count);
      setProgressKey((key) => key + 1);
    },
    [count],
  );

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => goTo(index + 1), AUTO_MS);
    return () => window.clearInterval(timer);
  }, [paused, index, goTo]);

  const onMove = (event: React.MouseEvent<HTMLElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    rotateY.set((px - 0.5) * 6);
    rotateX.set((0.5 - py) * 6);
  };

  const onLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    setPaused(false);
  };

  return (
    <motion.section
      ref={cardRef}
      onMouseMove={onMove}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={onLeave}
      style={{
        rotateX: springX,
        rotateY: springY,
        transformPerspective: 1200,
        willChange: "transform",
      }}
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="relative overflow-hidden rounded-[1.75rem] bg-admin-sky text-white shadow-2xl shadow-sky-500/25"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={property.id}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          style={{ x: parallaxX, y: parallaxY, willChange: "transform, opacity" }}
        >
          <Image
            src={property.image}
            alt={property.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 70vw"
            className="object-cover object-center opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-admin-sky/30 via-admin-sky/75 to-admin-sky" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.18),transparent_45%)]" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 grid gap-6 p-5 sm:p-7 lg:grid-cols-[1.15fr_0.85fr] lg:p-8">
        <div className="flex min-h-[18rem] flex-col justify-between sm:min-h-[22rem]">
          <div className="flex items-start justify-between gap-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={`agent-${property.id}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 backdrop-blur-xl ring-1 ring-white/30"
              >
                <Image
                  src={property.agent.avatar}
                  alt={property.agent.name}
                  width={28}
                  height={28}
                  className="h-7 w-7 rounded-full object-cover"
                />
                <span className="text-xs font-medium sm:text-sm">
                  {property.agent.name} · {property.agent.roleLabel}
                </span>
              </motion.div>
            </AnimatePresence>

            <div className="flex gap-2">
              <GlassButton label="نشان‌کردن">
                <BookmarkIcon />
              </GlassButton>
              <GlassButton label="اشتراک‌گذاری">
                <ShareIcon />
              </GlassButton>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`copy-${property.id}`}
              variants={textContainer}
              initial="hidden"
              animate="show"
              exit="exit"
              className="space-y-3"
            >
              <motion.span
                variants={textItem}
                className="inline-flex rounded-full bg-admin-navy/80 px-3 py-1 text-[11px] font-semibold backdrop-blur-md"
              >
                {property.badge}
              </motion.span>
              <motion.h1
                variants={textItem}
                className="max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl"
              >
                {property.title}
              </motion.h1>
              <motion.p variants={textItem} className="max-w-lg text-sm leading-relaxed text-white/90 sm:text-base">
                {property.address}
              </motion.p>
              <motion.p variants={textItem} className="text-lg font-semibold text-white sm:text-xl">
                {property.price}
              </motion.p>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-end justify-between gap-4">
            <div className="flex items-center gap-2">
              <NavArrow
                label="قبلی"
                onClick={() => goTo(index - 1)}
                icon={<ChevronRight />}
              />
              <NavArrow
                label="بعدی"
                onClick={() => goTo(index + 1)}
                icon={<ChevronLeft />}
              />
            </div>
            <span className="rounded-full bg-admin-navy px-3.5 py-2 text-xs font-semibold text-white shadow-lg sm:text-sm">
              {property.area}
            </span>
          </div>
        </div>

        <div className="relative hidden min-h-[22rem] overflow-hidden rounded-[1.35rem] ring-1 ring-white/35 lg:block">
          <AnimatePresence mode="wait">
            <motion.div
              key={`side-${property.id}`}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              style={{ willChange: "transform, opacity" }}
            >
              <Image src={property.image} alt={property.title} fill sizes="40vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-admin-navy/50 to-transparent" />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-20 h-1 bg-white/15">
        <motion.div
          key={progressKey}
          className="h-full origin-right bg-white"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: paused ? undefined : 1 }}
          transition={paused ? { duration: 0 } : { duration: AUTO_MS / 1000, ease: "linear" }}
          style={{ willChange: "transform" }}
        />
      </div>
    </motion.section>
  );
}

function NavArrow({
  label,
  onClick,
  icon,
}: {
  label: string;
  onClick: () => void;
  icon: React.ReactNode;
}) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-xl ring-1 ring-white/30"
      style={{ willChange: "transform" }}
    >
      {icon}
    </motion.button>
  );
}

function GlassButton({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-xl ring-1 ring-white/25"
      style={{ willChange: "transform" }}
    >
      {children}
    </motion.button>
  );
}

function BookmarkIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M7 4h10v17l-5-3-5 3V4Z" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="18" cy="5" r="2.5" />
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="19" r="2.5" />
      <path d="m8.2 13.2 7.5 4.3M15.7 6.5l-7.5 4.3" />
    </svg>
  );
}

function ChevronLeft() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="m15 6-6 6 6 6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}
