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
import { MOST_VIEWED_PROPERTIES, type ViewedProperty } from "@/config/admin";
import { cn } from "@/lib/utils";

const CARD_WIDTH = 320;
const GAP = 20;
const STEP = CARD_WIDTH + GAP;
const VELOCITY = 34;
const TILT_SPRING = { stiffness: 160, damping: 16 };

export default function MostViewedProperties() {
  const [paused, setPaused] = useState(false);
  const [dragging, setDragging] = useState(false);
  const x = useMotionValue(0);
  const loopWidth = useMemo(() => MOST_VIEWED_PROPERTIES.length * STEP, []);
  const gallery = useMemo(
    () => [...MOST_VIEWED_PROPERTIES, ...MOST_VIEWED_PROPERTIES, ...MOST_VIEWED_PROPERTIES],
    [],
  );

  useAnimationFrame((_, delta) => {
    if (paused || dragging) return;
    const next = x.get() + (VELOCITY * delta) / 1000;
    x.set(wrapOffsetRtl(next, loopWidth));
  });

  useEffect(() => {
    x.set(-loopWidth);
  }, [x, loopWidth]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    setDragging(false);
    const projected = x.get() + info.velocity.x * 0.14;
    x.set(wrapOffsetRtl(projected, loopWidth));
  };

  return (
    <section className="relative overflow-hidden rounded-[1.75rem] bg-admin-card/90 p-4 shadow-xl shadow-sky-500/5 ring-1 ring-slate-200/70 backdrop-blur-sm sm:p-6">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_20%,rgba(0,163,255,0.12),transparent_42%),radial-gradient(circle_at_88%_80%,rgba(15,23,42,0.06),transparent_40%)]"
      />

      <div className="relative mb-5 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-admin-navy sm:text-xl">پربازدیدهای امروز</h2>
          <p className="text-sm text-slate-500">ویترین سه‌بعدی آگهی‌هایی که امروز بیشتر دیده شده‌اند</p>
        </div>
        <Link
          href="/admin/properties"
          className="inline-flex items-center gap-1.5 rounded-full bg-admin-soft px-3.5 py-2 text-sm font-medium text-admin-navy transition hover:bg-admin-sky hover:text-white"
        >
          همه آگهی‌ها
          <span aria-hidden>←</span>
        </Link>
      </div>

      <div
        className="relative overflow-hidden py-2"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => {
          setPaused(false);
          setDragging(false);
        }}
      >
        <motion.div
          className="flex cursor-grab active:cursor-grabbing"
          drag="x"
          dragConstraints={{ left: -loopWidth * 2, right: 0 }}
          dragElastic={0.08}
          style={{ x, gap: GAP, willChange: "transform", perspective: 1200 }}
          onDragStart={() => setDragging(true)}
          onDragEnd={onDragEnd}
        >
          {gallery.map((property, i) => (
            <PropertyCard3D key={`${property.id}-${i}`} property={property} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function wrapOffsetRtl(value: number, width: number) {
  let next = value;
  while (next > 0) next -= width;
  while (next <= -width * 2) next += width;
  return next;
}

function PropertyCard3D({ property, index }: { property: ViewedProperty; index: number }) {
  const cardRef = useRef<HTMLElement>(null);
  const [hovered, setHovered] = useState(false);
  const [saved, setSaved] = useState(false);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, TILT_SPRING);
  const springY = useSpring(rotateY, TILT_SPRING);
  const elevateY = useSpring(0, { stiffness: 180, damping: 18 });
  const glareX = useTransform(springY, [-10, 10], [80, 20]);
  const glareY = useTransform(springX, [-8, 8], [20, 80]);
  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.8), transparent 55%)`;

  useEffect(() => {
    elevateY.set(hovered ? -12 : 0);
  }, [hovered, elevateY]);

  const onMove = (event: React.MouseEvent<HTMLElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    rotateY.set((0.5 - px) * 14);
    rotateX.set((0.5 - py) * 10);
  };

  const onLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    setHovered(false);
  };

  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20, delay: Math.min(index, 6) * 0.07 }}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={onLeave}
      style={{
        width: CARD_WIDTH,
        rotateX: springX,
        rotateY: springY,
        y: elevateY,
        transformPerspective: 1100,
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
      className="group relative shrink-0 transform-gpu"
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-[1.45rem] border border-white/70 bg-white/85 p-[1px]",
          "shadow-xl shadow-sky-500/5 backdrop-blur-xl transition-shadow duration-500",
          hovered && "shadow-[0_28px_60px_-20px_rgba(0,163,255,0.45)]",
        )}
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="absolute inset-0 rounded-[1.45rem] bg-gradient-to-br from-admin-sky/35 via-white/40 to-admin-navy/20 opacity-80" />

        <div className="relative overflow-hidden rounded-[1.4rem] bg-white/90 backdrop-blur-md">
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-20 mix-blend-soft-light"
            style={{ background: glareBackground, opacity: hovered ? 0.55 : 0 }}
          />

          <div className="relative h-48 overflow-hidden" style={{ transform: "translateZ(24px)" }}>
            <div
              className={cn(
                "absolute inset-0 origin-center transition-transform duration-500",
                hovered ? "scale-105" : "scale-100",
              )}
            >
              <Image src={property.image} alt={property.title} fill sizes="340px" className="object-cover" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-admin-navy/65 via-admin-navy/10 to-transparent" />

            <span className="absolute start-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-admin-sky px-2.5 py-1 text-[11px] font-semibold text-white shadow-[0_0_18px_rgba(0,163,255,0.55)]">
              <FlameIcon />
              {property.views}
            </span>

            <div
              className={cn(
                "absolute end-3 top-3 flex gap-2 transition-all duration-300",
                hovered ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0",
              )}
            >
              <ActionButton label="بازدید سریع">
                <EyeIcon />
              </ActionButton>
              <ActionButton
                label={saved ? "حذف از علاقه‌مندی" : "ذخیره آگهی"}
                active={saved}
                onClick={() => setSaved((value) => !value)}
              >
                <BookmarkIcon filled={saved} />
              </ActionButton>
            </div>

            <span className="absolute bottom-3 start-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-admin-navy backdrop-blur-md">
              {property.usage}
            </span>
          </div>

          <div className="relative space-y-3 p-4" style={{ transform: "translateZ(36px)" }}>
            <div>
              <h3 className="text-base font-semibold text-admin-navy">{property.title}</h3>
              <p className="text-xs text-slate-500">{property.location}</p>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {[property.rooms, property.size, property.finish].map((badge, badgeIndex) => (
                <motion.span
                  key={badge}
                  initial={false}
                  animate={hovered ? { opacity: 1, y: 0 } : { opacity: 0.92, y: 5 }}
                  transition={{
                    type: "spring",
                    stiffness: 170,
                    damping: 18,
                    delay: hovered ? badgeIndex * 0.05 : 0,
                  }}
                  className="rounded-full bg-white/70 px-2.5 py-1 text-[11px] font-medium text-slate-600 ring-1 ring-slate-200/80 backdrop-blur-md"
                  style={{ willChange: "transform, opacity" }}
                >
                  {badge}
                </motion.span>
              ))}
            </div>

            <motion.p
              animate={
                hovered
                  ? { textShadow: "0 0 18px rgba(0,163,255,0.45)" }
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
  onClick,
  active,
}: {
  label: string;
  children: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      onClick={(event) => {
        event.stopPropagation();
        onClick?.();
      }}
      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 0.92 }}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-xl ring-1 transition",
        active
          ? "bg-admin-sky text-white ring-admin-sky/40"
          : "bg-white/85 text-admin-navy ring-white/70 hover:bg-admin-sky hover:text-white",
      )}
      style={{ willChange: "transform" }}
    >
      {children}
    </motion.button>
  );
}

function FlameIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
      <path d="M12 2s4 4.2 4 8.2c0 1.7-.6 3.2-1.6 4.3.9-.3 1.8-1.1 2.3-2.2.3 3.4-2 6.7-4.7 7.7-2.7-1-5-4.3-4.7-7.7.5 1.1 1.4 1.9 2.3 2.2C8.6 13.4 8 11.9 8 10.2 8 6.2 12 2 12 2Z" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M2.5 12s3.5-6.5 9.5-6.5S21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="2.6" />
    </svg>
  );
}

function BookmarkIcon({ filled }: { filled?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M7 4h10v16l-5-3-5 3V4Z" />
    </svg>
  );
}
