"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { MOST_VIEWED_PROPERTIES } from "@/config/admin";
import { cn } from "@/lib/utils";

const AUTOPLAY_MS = 4200;
const CARD_WIDTH = 320;
const GAP = 18;

export default function MostViewedProperties() {
  const constraintsRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const maxIndex = Math.max(0, MOST_VIEWED_PROPERTIES.length - 1);

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => {
      setIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [paused, maxIndex]);

  return (
    <section className="rounded-[1.75rem] bg-admin-card p-4 shadow-sm ring-1 ring-slate-200/70 sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-admin-navy sm:text-xl">Most Viewed Properties</h2>
          <p className="text-sm text-slate-500">املاک پربازدید · live demand across active listings</p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 rounded-full bg-admin-soft px-3.5 py-2 text-sm font-medium text-admin-navy transition hover:bg-admin-sky hover:text-white"
        >
          Show More
          <span aria-hidden>↗</span>
        </button>
      </div>

      <div
        ref={constraintsRef}
        className="overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <motion.div
          className="flex cursor-grab active:cursor-grabbing"
          drag="x"
          dragConstraints={constraintsRef}
          dragElastic={0.12}
          style={{ gap: GAP }}
          animate={{ x: -(index * (CARD_WIDTH + GAP)) }}
          transition={{ type: "spring", stiffness: 260, damping: 32 }}
          onDragEnd={(_, info) => {
            const delta = info.offset.x;
            if (delta < -80) setIndex((prev) => Math.min(maxIndex, prev + 1));
            else if (delta > 80) setIndex((prev) => Math.max(0, prev - 1));
          }}
        >
          {MOST_VIEWED_PROPERTIES.map((property, i) => (
            <motion.article
              key={property.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * i, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6 }}
              className="group relative w-[min(100%,320px)] shrink-0 overflow-hidden rounded-[1.35rem] bg-white ring-1 ring-slate-200/80 transition hover:shadow-xl hover:shadow-sky-500/15 hover:ring-admin-sky/50"
              style={{ width: CARD_WIDTH }}
            >
              <div className="relative h-44 overflow-hidden">
                <Image
                  src={property.image}
                  alt={property.title}
                  fill
                  sizes="320px"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-admin-navy/55 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-admin-navy">
                  {property.planning}
                </span>
              </div>

              <div className="space-y-3 p-4">
                <div>
                  <h3 className="text-base font-semibold text-admin-navy">{property.title}</h3>
                  <p className="text-xs text-slate-500">{property.location}</p>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {[property.rooms, property.size, property.finish].map((badge) => (
                    <span
                      key={badge}
                      className="rounded-full bg-admin-soft px-2.5 py-1 text-[11px] font-medium text-slate-600"
                    >
                      {badge}
                    </span>
                  ))}
                </div>

                <p className="text-sm font-semibold text-admin-sky">{property.price}</p>

                <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-3 text-[11px]">
                  <Stat label="Per sq ft" value={property.pricePerSqft} />
                  <Stat label="Avg value" value={property.averageValue} />
                  <Stat label="Planning" value={property.planning} accent />
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>

      <div className="mt-5 flex items-center justify-center gap-2">
        {MOST_VIEWED_PROPERTIES.map((property, i) => (
          <button
            key={property.id}
            type="button"
            aria-label={`Go to ${property.title}`}
            onClick={() => setIndex(i)}
            className={cn(
              "h-2 rounded-full transition-all",
              i === index ? "w-6 bg-admin-sky" : "w-2 bg-slate-300 hover:bg-slate-400",
            )}
          />
        ))}
      </div>
    </section>
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
