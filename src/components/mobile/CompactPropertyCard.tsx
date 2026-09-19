"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { Bath, BedDouble, MapPin, Ruler } from "lucide-react";
import { fallbackImage, formatToman, listingTypeLabel } from "@/lib/money";
import { IOS_TAP_SPRING } from "@/lib/motion/ios";
import { cn } from "@/lib/utils";
import type { PropertyRecord } from "@/server/db/store";

export type CompactPropertyCardVariant = "grid" | "featured" | "paging";

type CompactPropertyCardProps = {
  item: PropertyRecord;
  variant?: CompactPropertyCardVariant;
  className?: string;
  priority?: boolean;
};

const VARIANT_STYLES: Record<
  CompactPropertyCardVariant,
  { wrap: string; media: string; title: string; sizes: string; pad: string; price: string }
> = {
  grid: {
    wrap: "rounded-[1.4rem]",
    media: "aspect-[4/3]",
    title: "text-sm leading-6 lg:text-[0.95rem]",
    sizes: "(max-width: 1023px) 45vw, 280px",
    pad: "px-3 py-3",
    price: "text-xs lg:text-sm",
  },
  featured: {
    wrap: "rounded-[1.65rem]",
    media: "aspect-[5/4]",
    title: "text-base leading-7 lg:text-lg",
    sizes: "(max-width: 1023px) 78vw, 420px",
    pad: "px-4 py-3.5",
    price: "text-sm lg:text-base",
  },
  paging: {
    wrap: "rounded-[1.85rem]",
    media: "aspect-[4/3] lg:aspect-[16/10]",
    title: "text-lg leading-8 lg:text-xl",
    sizes: "(max-width: 1023px) 88vw, 560px",
    pad: "px-4 py-4 lg:px-5 lg:py-5",
    price: "text-base lg:text-lg",
  },
};

/**
 * کارت لوکس ملک — تصویر سینمایی، مشخصات حرفه‌ای، موشن هاور.
 */
export default function CompactPropertyCard({
  item,
  variant = "grid",
  className,
  priority = false,
}: CompactPropertyCardProps) {
  const [pressed, setPressed] = useState(false);
  const [hovered, setHovered] = useState(false);
  const reduceMotion = useReducedMotion();
  const styles = VARIANT_STYLES[variant];

  return (
    <motion.article
      className={cn(
        "ios-contain group relative overflow-hidden border border-white/12 bg-[#070F1C]/90",
        "shadow-[0_36px_90px_-48px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.06)]",
        "backdrop-blur-sm",
        styles.wrap,
        className,
      )}
      animate={{ scale: pressed ? 0.975 : 1, y: hovered && !reduceMotion ? -6 : 0 }}
      transition={IOS_TAP_SPRING}
      style={{ willChange: pressed || hovered ? "transform" : "auto" }}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerCancel={() => setPressed(false)}
      onPointerLeave={() => {
        setPressed(false);
        setHovered(false);
      }}
      onPointerEnter={() => setHovered(true)}
    >
      {/* Soft rim light on hover */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] ring-1 ring-cyan-300/0"
        animate={{
          boxShadow: hovered && !reduceMotion
            ? "0 0 0 1px rgba(125,211,252,0.28), 0 28px 60px -28px rgba(0,163,255,0.35)"
            : "0 0 0 0 rgba(0,0,0,0)",
        }}
        transition={{ duration: 0.45 }}
      />

      <Link href={`/listings/${item.id}`} className="ios-tap-target block" scroll={false}>
        <div className={cn("relative overflow-hidden bg-slate-950", styles.media)}>
          <motion.div
            className="absolute inset-0"
            animate={
              reduceMotion
                ? undefined
                : hovered
                  ? { scale: 1.1 }
                  : { scale: 1 }
            }
            transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
          >
            <Image
              src={fallbackImage(item.imageUrl)}
              alt={item.title}
              fill
              priority={priority}
              sizes={styles.sizes}
              className="object-cover"
            />
          </motion.div>

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050B16] via-[#050B16]/40 to-transparent" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(0,163,255,0.22),transparent_42%)] opacity-80" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/45 to-transparent" />

          <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3">
            <span className="rounded-full border border-white/15 bg-black/50 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-sky-200 backdrop-blur-md">
              {listingTypeLabel(item.listingType)}
            </span>
            <div className="flex flex-col items-end gap-1.5">
              {item.isFeatured ? (
                <span className="rounded-full border border-sky-300/35 bg-sky-400/20 px-2.5 py-1 text-[10px] font-bold text-sky-100 backdrop-blur-md shadow-[0_0_20px_-6px_rgba(0,163,255,0.8)]">
                  ویژه
                </span>
              ) : null}
              <span className="rounded-full border border-white/10 bg-black/40 px-2.5 py-1 font-mono text-[10px] tracking-wider text-white/65 backdrop-blur-md">
                {item.code}
              </span>
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 p-3.5 pt-12">
            <p className="mb-1.5 inline-flex items-center gap-1.5 text-[11px] text-white/70">
              <MapPin className="h-3 w-3 shrink-0 text-sky-300" />
              <span className="line-clamp-1">{item.neighborhood || item.location}</span>
            </p>
            <h3 className={cn("line-clamp-2 font-vazirmatn font-bold text-white drop-shadow-sm", styles.title)}>
              {item.title}
            </h3>
            <p className={cn("mt-2.5 font-semibold tracking-tight text-sky-300", styles.price)}>
              {formatToman(item.price, item.listingType)}
            </p>
          </div>
        </div>

        {/* مشخصات حرفه‌ای — سه ستون لوکس با جداکننده */}
        <div
          className={cn(
            "grid grid-cols-3 divide-x divide-x-reverse divide-white/8 border-t border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.02]",
            styles.pad,
          )}
        >
          <Spec icon={BedDouble} value={item.bedrooms} unit="خواب" compact={variant === "grid"} />
          <Spec icon={Bath} value={item.bathrooms} unit="سرویس" compact={variant === "grid"} />
          <Spec icon={Ruler} value={item.areaSqm} unit="متر" compact={variant === "grid"} />
        </div>
      </Link>
    </motion.article>
  );
}

function Spec({
  icon: Icon,
  value,
  unit,
  compact,
}: {
  icon: typeof BedDouble;
  value: number;
  unit: string;
  compact?: boolean;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 text-center">
      <Icon className={cn("text-sky-300/95", compact ? "h-3.5 w-3.5" : "h-4 w-4")} strokeWidth={1.75} />
      <p className={cn("font-vazirmatn font-bold tabular-nums text-white", compact ? "text-xs" : "text-sm")}>
        {value.toLocaleString("fa-IR")}
      </p>
      <p className={cn("font-medium tracking-wide text-white/45", compact ? "text-[9px]" : "text-[10px]")}>
        {unit}
      </p>
    </div>
  );
}
