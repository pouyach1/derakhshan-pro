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
import { resolveSlideWidthRatio, type SlideWidthRatio } from "@/components/mobile/carousel/slideWidth";

type PagingCarouselProps = {
  children: ReactNode[];
  className?: string;
  /** نسبت عرض اسلاید به viewport — نزدیک به تمام‌عرض برای حس «یکی‌یکی» */
  slideWidthRatio?: SlideWidthRatio;
  gapPx?: number;
  showCounter?: boolean;
  showDots?: boolean;
  onIndexChange?: (index: number) => void;
};

/**
 * کاروسل با پیجینگ اجباری: هر سوایپ دقیقاً یک کارت جلو/عقب.
 */
export default function PagingCarousel({
  children,
  className,
  slideWidthRatio = { mobile: 0.88, desktop: 0.52 },
  gapPx = 12,
  showCounter = true,
  showDots = true,
  onIndexChange,
}: PagingCarouselProps) {
  const count = children.length;
  const viewportRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [viewportW, setViewportW] = useState(0);
  const [dragging, setDragging] = useState(false);
  const x = useMotionValue(0);
  const indexRef = useRef(0);
  const startXRef = useRef(0);

  const ratio = resolveSlideWidthRatio(slideWidthRatio, viewportW);
  const slideW = viewportW > 0 ? viewportW * ratio : 0;
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

  const goTo = useCallback(
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
        // محدود به همسایه‌های فوری — پیجینگ سخت
        const min = offsetForIndex(Math.min(count - 1, indexRef.current + 1));
        const max = offsetForIndex(Math.max(0, indexRef.current - 1));
        let next = base + mx;
        if (next > max) next = max + (next - max) * 0.22;
        if (next < min) next = min + (next - min) * 0.22;
        x.set(next);
        return base;
      },
      onDragEnd: ({ movement: [mx], velocity: [vx] }) => {
        setDragging(false);
        const current = indexRef.current;
        const distanceThreshold = step * 0.18;
        const velocityThreshold = 0.35;

        let target = current;
        if (Math.abs(vx) > velocityThreshold) {
          target = vx > 0 || mx > 0 ? current - 1 : current + 1;
        } else if (Math.abs(mx) > distanceThreshold) {
          target = mx > 0 ? current - 1 : current + 1;
        }
        // همیشه کامل — هرگز روی حالت میانی نمان
        goTo(target);
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
        className="ios-contain relative overflow-hidden"
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
              style={{ width: slideW || undefined }}
            >
              {child}
            </div>
          ))}
        </motion.div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 px-4">
        {showCounter ? (
          <p className="text-xs text-slate-400" aria-live="polite">
            {(index + 1).toLocaleString("fa-IR")} از {count.toLocaleString("fa-IR")}
          </p>
        ) : (
          <span />
        )}
        {showDots && count > 1 ? (
          <div className="flex items-center gap-1.5" aria-hidden>
            {children.map((_, i) => (
              <button
                key={i}
                type="button"
                className={cn(
                  "h-1.5 rounded-full bg-cyan-400 transition-all duration-200",
                  i === index ? "w-5 opacity-100" : "w-1.5 opacity-35",
                )}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
