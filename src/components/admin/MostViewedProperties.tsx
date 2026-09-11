"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
  type PanInfo,
} from "framer-motion";
import {
  ArrowUpRight,
  BedDouble,
  Eye,
  Layers,
  Maximize2,
  Pencil,
  Sparkles,
  Trash2,
} from "lucide-react";
import { MOST_VIEWED_PROPERTIES, type ViewedProperty } from "@/config/admin";
import { cn } from "@/lib/utils";

const CARD_WIDTH = 328;
const GAP = 22;
const STEP = CARD_WIDTH + GAP;
const VELOCITY = 32;
const TILT = { stiffness: 170, damping: 18, mass: 0.35 };

export default function MostViewedProperties() {
  const [paused, setPaused] = useState(false);
  const [dragging, setDragging] = useState(false);
  const x = useMotionValue(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const loopWidthRef = useRef(MOST_VIEWED_PROPERTIES.length * STEP);

  const properties = MOST_VIEWED_PROPERTIES;
  // Triple the list so one full set can slide off while an identical set fills the viewport.
  const duplicatedProperties = useMemo(
    () => [...properties, ...properties, ...properties],
    [properties],
  );

  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      if (!track) return;
      const cards = track.querySelectorAll<HTMLElement>("[data-carousel-card]");
      if (cards.length < properties.length + 1) return;
      // Exact distance from card[0] to card[n] (= one set), avoids gap/subpixel drift.
      const first = cards[0].offsetLeft;
      const nextSet = cards[properties.length].offsetLeft;
      const width = Math.abs(nextSet - first);
      if (width > 0) loopWidthRef.current = width;
    };
    measure();
    const timer = window.setTimeout(measure, 700);
    window.addEventListener("resize", measure);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("resize", measure);
    };
  }, [properties.length, duplicatedProperties]);

  useAnimationFrame((_, delta) => {
    if (paused || dragging) return;
    const loopWidth = loopWidthRef.current;
    // Continuous leftward marquee; jump forward by exactly one set when it clears.
    let next = x.get() - (VELOCITY * delta) / 1000;
    if (next <= -loopWidth) next += loopWidth;
    x.set(next);
  });

  const wrapX = (value: number) => {
    const loopWidth = loopWidthRef.current;
    if (loopWidth <= 0) return value;
    let next = value % loopWidth;
    // JS % can be negative; normalize into (-loopWidth, 0]
    if (next > 0) next -= loopWidth;
    if (next <= -loopWidth) next += loopWidth;
    return next;
  };

  const onDrag = () => {
    // Live wrap while dragging so the track never hits a hard "end".
    x.set(wrapX(x.get()));
  };

  const onDragEnd = (_: unknown, info: PanInfo) => {
    setDragging(false);
    const projected = x.get() + info.velocity.x * 0.12;
    x.set(wrapX(projected));
  };

  return (
    <section className="relative overflow-hidden rounded-[1.85rem] border border-sky-500/15 bg-admin-card/80 p-4 shadow-[0_24px_60px_-28px_rgba(0,163,255,0.28)] backdrop-blur-md sm:p-6">
      <div
        aria-hidden
        className="pointer-events-none absolute -start-16 top-0 h-56 w-56 rounded-full bg-gradient-to-tr from-sky-500/20 to-transparent blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -end-10 bottom-0 h-48 w-48 rounded-full bg-gradient-to-bl from-admin-navy/10 to-transparent blur-3xl"
      />

      <div className="relative mb-6 flex items-end justify-between gap-3">
        <div>
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-sky-500/10 px-2.5 py-1 text-[11px] font-semibold text-admin-sky ring-1 ring-sky-500/20">
            <Sparkles className="h-3.5 w-3.5" strokeWidth={2} />
            ویترین VIP
          </div>
          <h2 className="text-lg font-semibold tracking-tight text-admin-navy sm:text-xl">پربازدیدترین املاک امروز</h2>
          <p className="mt-1 text-sm text-slate-500">ویترین VIP آگهی‌های برجسته با بیشترین آمار بازدید و تقاضا</p>
        </div>
        <Link
          href="/admin/properties"
          className="group inline-flex items-center gap-1.5 rounded-full bg-admin-soft px-3.5 py-2 text-sm font-medium text-admin-navy transition hover:bg-admin-sky hover:text-white"
        >
          مشاهده آرشیو کامل املاک
          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 rtl:rotate-180" />
        </Link>
      </div>

      <div
        data-wheel-self
        dir="ltr"
        className="relative overflow-x-hidden overflow-y-visible px-1 pt-4 pb-8"
        style={{ perspective: 1000 }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => {
          setPaused(false);
          setDragging(false);
        }}
      >
        <motion.div
          ref={trackRef}
          className="flex w-max cursor-grab active:cursor-grabbing"
          drag="x"
          dragElastic={0.04}
          dragMomentum={false}
          style={{ x, gap: GAP, willChange: "transform", direction: "ltr" }}
          onDragStart={() => setDragging(true)}
          onDrag={onDrag}
          onDragEnd={onDragEnd}
        >
          {duplicatedProperties.map((property, i) => (
            <PropertyCard3D key={`${property.id}-${i}`} property={property} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function PropertyCard3D({ property, index }: { property: ViewedProperty; index: number }) {
  const cardRef = useRef<HTMLElement>(null);
  const [hovered, setHovered] = useState(false);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, TILT);
  const springY = useSpring(rotateY, TILT);
  const lift = useSpring(0, { stiffness: 200, damping: 20 });
  const depth = useSpring(0, { stiffness: 200, damping: 20 });
  const glareX = useTransform(springY, [-12, 12], [78, 22]);
  const glareY = useTransform(springX, [-10, 10], [22, 78]);
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.85), transparent 58%)`;

  useEffect(() => {
    lift.set(hovered ? -14 : 0);
    depth.set(hovered ? 28 : 0);
  }, [hovered, lift, depth]);

  const onMove = (event: React.MouseEvent<HTMLElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    rotateY.set((0.5 - px) * 16);
    rotateX.set((py - 0.5) * -12);
  };

  const reset = () => {
    rotateX.set(0);
    rotateY.set(0);
    setHovered(false);
  };

  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, y: 36, rotateX: 8 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20, delay: Math.min(index, 5) * 0.06 }}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={reset}
      style={{
        width: CARD_WIDTH,
        rotateX: springX,
        rotateY: springY,
        y: lift,
        z: depth,
        transformPerspective: 1000,
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
      className="group relative shrink-0 transform-gpu"
      data-carousel-card
    >
      <motion.div
        aria-hidden
        animate={{ opacity: hovered ? 1 : 0.35, scale: hovered ? 1.08 : 0.92 }}
        transition={{ duration: 0.45 }}
        className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-tr from-sky-500/20 via-sky-400/5 to-transparent blur-2xl"
      />

      <div
        className={cn(
          "relative overflow-hidden rounded-[1.5rem] border border-sky-500/20 bg-white/80 p-[1px]",
          "shadow-xl shadow-sky-500/10 backdrop-blur-md transition-shadow duration-500",
          hovered && "border-sky-500/35 shadow-[0_30px_70px_-24px_rgba(0,163,255,0.55)]",
        )}
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="absolute inset-0 rounded-[1.5rem] bg-gradient-to-br from-sky-400/25 via-white/30 to-admin-navy/15" />

        <div className="relative overflow-hidden rounded-[1.45rem] bg-white/90 backdrop-blur-md">
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-20 mix-blend-soft-light"
            style={{ background: glare, opacity: hovered ? 0.6 : 0 }}
          />

          <div className="relative h-48 overflow-hidden" style={{ transform: "translateZ(26px)" }}>
            <motion.div
              className="absolute inset-0"
              animate={{ scale: hovered ? 1.08 : 1 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              style={{ willChange: "transform" }}
            >
              <Image src={property.image} alt={property.title} fill sizes="340px" className="object-cover" />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-admin-navy/70 via-admin-navy/15 to-transparent" />

            <span className="absolute start-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-admin-sky/95 px-2.5 py-1 text-[11px] font-semibold text-white shadow-[0_0_20px_rgba(0,163,255,0.45)] backdrop-blur-md">
              <Eye className="h-3.5 w-3.5 text-sky-100" strokeWidth={2.2} />
              {property.views}
            </span>

            <div
              className={cn(
                "absolute end-3 top-3 flex gap-2 transition-all duration-300",
                hovered ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0",
              )}
            >
              <ActionButton label="مشاهده">
                <Eye className="h-4 w-4 text-sky-500" strokeWidth={1.9} />
              </ActionButton>
              <ActionButton label="ویرایش">
                <Pencil className="h-4 w-4 text-slate-600 dark:text-slate-300" strokeWidth={1.9} />
              </ActionButton>
              <ActionButton label="حذف">
                <Trash2 className="h-4 w-4 text-rose-500/80 transition-colors group-hover/action:text-rose-600" strokeWidth={1.9} />
              </ActionButton>
            </div>

            <span className="absolute bottom-3 start-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-admin-navy backdrop-blur-md">
              <Sparkles className="h-3 w-3 text-admin-sky" strokeWidth={2} />
              {property.usage}
            </span>
          </div>

          <div className="relative space-y-3 p-4" style={{ transform: "translateZ(40px)" }}>
            <div>
              <h3 className="text-base font-semibold text-admin-navy">{property.title}</h3>
              <p className="text-xs text-slate-500">{property.location}</p>
            </div>

            <div className="flex flex-wrap gap-1.5">
              <SpecPill
                hovered={hovered}
                delay={0}
                icon={<BedDouble className="h-3 w-3" strokeWidth={1.8} />}
                label={property.rooms}
              />
              <SpecPill
                hovered={hovered}
                delay={0.05}
                icon={<Maximize2 className="h-3 w-3" strokeWidth={1.8} />}
                label={property.size}
              />
              <SpecPill
                hovered={hovered}
                delay={0.1}
                icon={<Layers className="h-3 w-3" strokeWidth={1.8} />}
                label={property.finish}
              />
            </div>

            <motion.p
              animate={
                hovered
                  ? { textShadow: "0 0 20px rgba(0,163,255,0.5)" }
                  : { textShadow: "0 0 0 rgba(0,163,255,0)" }
              }
              className="text-sm font-semibold text-admin-sky"
            >
              {property.price}
            </motion.p>

            <div className="grid grid-cols-3 gap-2 border-t border-slate-100/90 pt-3 text-[11px]">
              <Stat label="متری" value={property.pricePerMeter} />
              <Stat label="میانگین محله" value={property.neighborhoodAvg} />
              <Stat label="کاربری" value={property.usage} accent />
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function SpecPill({
  icon,
  label,
  hovered,
  delay,
}: {
  icon: React.ReactNode;
  label: string;
  hovered: boolean;
  delay: number;
}) {
  return (
    <motion.span
      initial={false}
      animate={hovered ? { opacity: 1, y: 0 } : { opacity: 0.92, y: 5 }}
      transition={{ type: "spring", stiffness: 170, damping: 18, delay: hovered ? delay : 0 }}
      className="inline-flex items-center gap-1 rounded-full bg-white/75 px-2.5 py-1 text-[11px] font-medium text-slate-600 ring-1 ring-slate-200/80 backdrop-blur-md"
      style={{ willChange: "transform, opacity" }}
    >
      <span className="text-admin-sky">{icon}</span>
      {label}
    </motion.span>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <p className="text-slate-400">{label}</p>
      <p className={cn("mt-0.5 font-semibold", accent ? "text-admin-sky" : "text-admin-navy")}>{value}</p>
    </div>
  );
}

function ActionButton({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      onClick={(event) => event.stopPropagation()}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="group/action inline-flex items-center justify-center rounded-xl border border-slate-200/50 bg-white/60 p-2 shadow-sm backdrop-blur-md transition-all duration-200 hover:bg-white dark:border-white/10 dark:bg-slate-800/60 dark:hover:bg-slate-800"
      style={{ willChange: "transform" }}
    >
      {children}
    </motion.button>
  );
}
