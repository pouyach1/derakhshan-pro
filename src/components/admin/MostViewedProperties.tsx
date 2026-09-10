"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useSpring,
  type PanInfo,
} from "framer-motion";
import { MOST_VIEWED_PROPERTIES } from "@/config/admin";
import { cn } from "@/lib/utils";

const CARD_WIDTH = 300;
const GAP = 18;
const STEP = CARD_WIDTH + GAP;
const VELOCITY = 38;

export default function MostViewedProperties() {
  const trackRef = useRef<HTMLDivElement>(null);
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
    const next = x.get() - (VELOCITY * delta) / 1000;
    x.set(wrapOffset(next, loopWidth));
  });

  useEffect(() => {
    x.set(0);
  }, [x]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    setDragging(false);
    // Soft inertia settle toward nearest card rhythm
    const projected = x.get() + info.velocity.x * 0.12;
    x.set(wrapOffset(projected, loopWidth));
  };

  return (
    <section className="rounded-[1.75rem] bg-admin-card p-4 shadow-sm ring-1 ring-slate-200/70 sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-admin-navy sm:text-xl">املاک پربازدید</h2>
          <p className="text-sm text-slate-500">داغ‌ترین آگهی‌های امروز در تهران و حومه</p>
        </div>
        <Link
          href="/admin/properties"
          className="inline-flex items-center gap-1.5 rounded-full bg-admin-soft px-3.5 py-2 text-sm font-medium text-admin-navy transition hover:bg-admin-sky hover:text-white"
        >
          مشاهده همه
          <span aria-hidden>↗</span>
        </Link>
      </div>

      <div
        ref={trackRef}
        className="overflow-hidden"
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
          style={{ x, gap: GAP, willChange: "transform" }}
          onDragStart={() => setDragging(true)}
          onDragEnd={onDragEnd}
        >
          {gallery.map((property, i) => (
            <PropertyCard key={`${property.id}-${i}`} property={property} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function wrapOffset(value: number, width: number) {
  let next = value;
  while (next <= -width) next += width;
  while (next > 0) next -= width;
  return next;
}

function PropertyCard({
  property,
  index,
}: {
  property: (typeof MOST_VIEWED_PROPERTIES)[number];
  index: number;
}) {
  const [hovered, setHovered] = useState(false);
  const lift = useSpring(0, { stiffness: 180, damping: 18 });

  useEffect(() => {
    lift.set(hovered ? -10 : 0);
  }, [hovered, lift]);

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20, delay: Math.min(index, 6) * 0.06 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ scale: 1.02 }}
      style={{ y: lift, width: CARD_WIDTH, willChange: "transform" }}
      className={cn(
        "group relative shrink-0 overflow-hidden rounded-[1.35rem] bg-white ring-1 ring-slate-200/80",
        "transition-shadow duration-300",
        hovered && "shadow-[0_24px_50px_-18px_rgba(0,163,255,0.45)] ring-admin-sky/55",
      )}
    >
      <div className="relative h-44 overflow-hidden">
        <motion.div
          className="absolute inset-0"
          animate={{ scale: hovered ? 1.08 : 1 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          style={{ willChange: "transform" }}
        >
          <Image src={property.image} alt={property.title} fill sizes="320px" className="object-cover" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-admin-navy/55 via-transparent to-transparent" />
        <span className="absolute bottom-3 start-3 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-admin-navy">
          {property.planning}
        </span>
      </div>

      <div className="space-y-3 p-4">
        <div>
          <h3 className="text-base font-semibold text-admin-navy">{property.title}</h3>
          <p className="text-xs text-slate-500">{property.location}</p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {[property.rooms, property.size, property.finish].map((badge, badgeIndex) => (
            <motion.span
              key={badge}
              initial={false}
              animate={hovered ? { opacity: 1, y: 0 } : { opacity: 0.9, y: 6 }}
              transition={{
                type: "spring",
                stiffness: 160,
                damping: 18,
                delay: hovered ? badgeIndex * 0.06 : 0,
              }}
              className="rounded-full bg-admin-soft px-2.5 py-1 text-[11px] font-medium text-slate-600"
              style={{ willChange: "transform, opacity" }}
            >
              {badge}
            </motion.span>
          ))}
        </div>

        <p className="text-sm font-semibold text-admin-sky">{property.price}</p>

        <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-3 text-[11px]">
          <Stat label="هر متر" value={property.pricePerSqft} />
          <Stat label="میانگین بازار" value={property.averageValue} />
          <Stat label="نوع" value={property.planning} accent />
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
