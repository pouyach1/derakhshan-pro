"use client";

import Image from "next/image";
import { AnimatePresence, motion, useMotionValue, useTransform } from "framer-motion";
import { useGesture } from "@use-gesture/react";
import { useCallback, useRef, useState } from "react";
import { fallbackImage } from "@/lib/money";
import { IOS_PAGE_SPRING } from "@/lib/motion/ios";
import { cn } from "@/lib/utils";

type PropertyGalleryProps = {
  images: string[];
  alt: string;
  className?: string;
};

/**
 * گالری افقی با paging + rubber-band؛ pinch-to-zoom با محدودیت نرم.
 */
export default function PropertyGallery({ images, alt, className }: PropertyGalleryProps) {
  const slides = images.length ? images : [fallbackImage(null)];
  const [index, setIndex] = useState(0);
  const [zooming, setZooming] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const scale = useMotionValue(1);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const opacityHint = useTransform(scale, [1, 1.4], [1, 0.35]);

  const go = useCallback(
    (next: number) => {
      const clamped = Math.max(0, Math.min(slides.length - 1, next));
      setIndex(clamped);
      scale.set(1);
      x.set(0);
      y.set(0);
      setZooming(false);
    },
    [scale, slides.length, x, y],
  );

  useGesture(
    {
      onDrag: ({ movement: [mx], direction: [dx], velocity: [vx], last, cancel, pinching }) => {
        if (pinching || zooming || scale.get() > 1.05) return;
        if (!last) {
          x.set(mx * 0.35);
          return;
        }
        // آستانه فاصله یا سرعت برای paging
        if (Math.abs(mx) > 56 || vx > 0.45) {
          go(index + (dx > 0 ? -1 : 1));
        } else {
          x.set(0);
        }
        cancel?.();
      },
      onPinch: ({ offset: [s], origin: [ox, oy], first, last, memo }) => {
        if (first) {
          setZooming(true);
          const rect = containerRef.current?.getBoundingClientRect();
          return {
            ox: ox - (rect?.left ?? 0),
            oy: oy - (rect?.top ?? 0),
          };
        }
        // محدودیت نرم زوم ۱ تا ۲.۶
        const soft = Math.min(2.6, Math.max(1, s));
        scale.set(soft);
        if (memo) {
          x.set((ox - memo.ox) * 0.15);
          y.set((oy - memo.oy) * 0.15);
        }
        if (last) {
          if (soft < 1.08) {
            scale.set(1);
            x.set(0);
            y.set(0);
            setZooming(false);
          }
        }
        return memo;
      },
    },
    {
      target: containerRef,
      eventOptions: { passive: false },
      drag: { filterTaps: true, axis: "x" },
      pinch: { scaleBounds: { min: 1, max: 2.6 }, rubberband: true },
    },
  );

  return (
    <div className={cn("relative ios-contain", className)}>
      <div
        ref={containerRef}
        className="ios-media-frame relative w-full touch-none overflow-hidden rounded-[1.5rem] bg-slate-950"
        style={{ touchAction: "none" }}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={slides[index]}
            className="absolute inset-0"
            initial={{ opacity: 0.6, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0.5, scale: 0.985 }}
            transition={IOS_PAGE_SPRING}
            style={{ x, y, scale, willChange: "transform" }}
          >
            <Image
              src={fallbackImage(slides[index])}
              alt={`${alt} — تصویر ${(index + 1).toLocaleString("fa-IR")}`}
              fill
              className="object-cover"
              sizes="(max-width: 428px) 100vw, 428px"
              priority={index === 0}
            />
          </motion.div>
        </AnimatePresence>

        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/55 to-transparent"
          style={{ opacity: opacityHint }}
        />
      </div>

      {slides.length > 1 ? (
        <div className="mt-3 flex items-center justify-center gap-1.5">
          {slides.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              aria-label={`رفتن به تصویر ${(i + 1).toLocaleString("fa-IR")}`}
              className={cn(
                "h-1.5 w-1.5 rounded-full bg-cyan-400 transition-transform duration-200",
                i === index ? "scale-x-[2.4] opacity-100" : "scale-x-100 opacity-35",
              )}
              onClick={() => go(i)}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
