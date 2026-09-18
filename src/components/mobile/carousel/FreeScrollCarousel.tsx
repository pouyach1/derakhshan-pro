"use client";

import { motion, useMotionValue, animate } from "framer-motion";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useGesture } from "@use-gesture/react";
import { IOS_PAGE_SPRING } from "@/lib/motion/ios";
import { cn } from "@/lib/utils";

type FreeScrollCarouselProps = {
  children: ReactNode[];
  className?: string;
  /** عرض هر اسلاید به‌صورت کسری از عرض کانتینر (مثلاً 0.78 برای کارت ویژه) */
  slideWidthRatio?: number;
  gapPx?: number;
  showDots?: boolean;
  onIndexChange?: (index: number) => void;
};

/**
 * کاروسل افقی آزاد با اسنپ spring به نزدیک‌ترین کارت هنگام رها کردن.
 * اسکرول خام مرورگر نیست — drag آزاد + قفل نرم با framer-motion.
 */
export default function FreeScrollCarousel({
  children,
  className,
  slideWidthRatio = 0.78,
  gapPx = 14,
  showDots = true,
  onIndexChange,
}: FreeScrollCarouselProps) {
  const count = children.length;
  const viewportRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [viewportW, setViewportW] = useState(0);
  const [dragging, setDragging] = useState(false);
  const x = useMotionValue(0);
  const indexRef = useRef(0);
  const startXRef = useRef(0);

  const slideW = viewportW > 0 ? viewportW * slideWidthRatio : 0;
  const step = slideW + gapPx;
  const sidePad = viewportW > 0 ? (viewportW - slideW) / 2 : 0;

  const clampIndex = useCallback(
    (i: number) => Math.max(0, Math.min(count - 1, i)),
    [count],
  );

  const offsetForIndex = useCallback(
    (i: number) => -clampIndex(i) * step,
    [clampIndex, step],
  );

  const snapTo = useCallback(
    (i: number) => {
      const next = clampIndex(i);
      indexRef.current = next;
      setIndex(next);
      onIndexChange?.(next);
      void animate(x, offsetForIndex(next), IOS_PAGE_SPRING);
    },
    [clampIndex, offsetForIndex, onIndexChange, x],
  );

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const measure = () => setViewportW(el.clientWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (step <= 0) return;
    x.set(offsetForIndex(indexRef.current));
  }, [offsetForIndex, step, x]);

  useGesture(
    {
      onDragStart: () => {
        setDragging(true);
        startXRef.current = x.get();
      },
      onDrag: ({ movement: [mx], memo, first }) => {
        if (first) return startXRef.current;
        const base = typeof memo === "number" ? memo : startXRef.current;
        const min = offsetForIndex(count - 1);
        const max = 0;
        // مقاومت نرم در لبه‌ها
        let next = base + mx;
        if (next > max) next = max + (next - max) * 0.28;
        if (next < min) next = min + (next - min) * 0.28;
        x.set(next);
        return base;
      },
      onDragEnd: ({ movement: [mx], velocity: [vx] }) => {
        setDragging(false);
        const current = indexRef.current;
        const distanceThreshold = step * 0.22;
        let target = current;
        if (Math.abs(vx) > 0.45) {
          // در RTL، کشیدن به راست (mx مثبت) معمولاً به کارت قبلی می‌رود
          target = vx > 0 || mx > 0 ? current - 1 : current + 1;
        } else if (Math.abs(mx) > distanceThreshold) {
          target = mx > 0 ? current - 1 : current + 1;
        } else {
          // نزدیک‌ترین بر اساس موقعیت فعلی
          const raw = -x.get() / step;
          target = Math.round(raw);
        }
        snapTo(target);
      },
    },
    {
      target: viewportRef,
      eventOptions: { passive: false },
      drag: {
        filterTaps: true,
        axis: "x",
        preventScroll: true,
      },
    },
  );

  if (count === 0) return null;

  return (
    <div className={cn("relative", className)}>
      <div
        ref={viewportRef}
        className="ios-contain relative touch-pan-y overflow-hidden"
        style={{ touchAction: "pan-y" }}
      >
        <motion.div
          className="flex"
          style={{
            x,
            gap: gapPx,
            paddingInline: sidePad,
            willChange: dragging ? "transform" : "auto",
          }}
        >
          {children.map((child, i) => (
            <div
              key={i}
              className="shrink-0"
              style={{
                width: slideW || undefined,
                scrollSnapAlign: "center",
              }}
            >
              {child}
            </div>
          ))}
        </motion.div>
      </div>

      {showDots && count > 1 ? (
        <div className="mt-3 flex items-center justify-center gap-1.5" aria-hidden>
          {children.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`اسلاید ${(i + 1).toLocaleString("fa-IR")}`}
              className={cn(
                "h-1.5 rounded-full bg-cyan-400 transition-all duration-200",
                i === index ? "w-5 opacity-100" : "w-1.5 opacity-35",
              )}
              onClick={() => snapTo(i)}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
