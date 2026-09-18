"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type TouchEvent as ReactTouchEvent,
} from "react";
import { IOS_PAGE_SPRING, IOS_SHEET_SPRING } from "@/lib/motion/ios";
import { useHaptic } from "@/hooks/useHaptic";
import { cn } from "@/lib/utils";

const PULL_THRESHOLD = 72;
const MAX_PULL = 128;

type PullToRefreshProps = {
  children: ReactNode;
  onRefresh: () => Promise<void> | void;
  className?: string;
  scrollerClassName?: string;
  disabled?: boolean;
};

/**
 * Pull-to-refresh کشسان شبیه iOS — محتوا با اسپرینگ پایین می‌آید، نه فقط اسپینر ثابت.
 * ref به عنصر اسکرول اشاره می‌کند (برای virtualizer).
 */
const PullToRefresh = forwardRef<HTMLDivElement, PullToRefreshProps>(function PullToRefresh(
  { children, onRefresh, className, scrollerClassName, disabled = false },
  ref,
) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const pulling = useRef(false);
  const [refreshing, setRefreshing] = useState(false);
  const vibrate = useHaptic();

  const setScrollerRef = useCallback(
    (node: HTMLDivElement | null) => {
      scrollerRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  const rawY = useMotionValue(0);
  const y = useSpring(rawY, IOS_SHEET_SPRING);
  const indicatorOpacity = useTransform(y, [0, 24, PULL_THRESHOLD], [0, 0.45, 1]);
  const indicatorScale = useTransform(y, [0, PULL_THRESHOLD, MAX_PULL], [0.55, 1, 1.08]);
  const indicatorRotate = useTransform(y, [0, PULL_THRESHOLD], [-90, 0]);

  const reset = useCallback(() => {
    pulling.current = false;
    rawY.set(0);
  }, [rawY]);

  const runRefresh = useCallback(async () => {
    if (refreshing) return;
    setRefreshing(true);
    vibrate(12);
    rawY.set(56);
    try {
      await onRefresh();
    } finally {
      setRefreshing(false);
      rawY.set(0);
    }
  }, [onRefresh, rawY, refreshing, vibrate]);

  useEffect(() => {
    if (disabled) reset();
  }, [disabled, reset]);

  function onTouchStart(e: ReactTouchEvent) {
    if (disabled || refreshing) return;
    const el = scrollerRef.current;
    if (!el || el.scrollTop > 0) {
      pulling.current = false;
      return;
    }
    startY.current = e.touches[0].clientY;
    pulling.current = true;
  }

  function onTouchMove(e: ReactTouchEvent) {
    if (!pulling.current || disabled || refreshing) return;
    const el = scrollerRef.current;
    if (!el || el.scrollTop > 0) {
      reset();
      return;
    }
    const dy = e.touches[0].clientY - startY.current;
    if (dy <= 0) {
      rawY.set(0);
      return;
    }
    const dampened = Math.min(MAX_PULL, dy * (1 - dy / (MAX_PULL * 3.2)));
    rawY.set(dampened);
    if (dy > 8) e.preventDefault();
  }

  function onTouchEnd() {
    if (!pulling.current) return;
    const current = rawY.get();
    pulling.current = false;
    if (current >= PULL_THRESHOLD) {
      void runRefresh();
    } else {
      rawY.set(0);
    }
  }

  return (
    <div className={cn("relative", className)}>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-10 flex justify-center pt-1"
        style={{ opacity: indicatorOpacity, y }}
      >
        <motion.div
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15 backdrop-blur-md"
          style={{ scale: indicatorScale, rotate: indicatorRotate }}
          animate={refreshing ? { rotate: 360 } : undefined}
          transition={
            refreshing
              ? { repeat: Infinity, duration: 0.85, ease: "linear" }
              : IOS_PAGE_SPRING
          }
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-cyan-300">
            <path
              d="M12 4v4m0 8v4M4 12h4m8 0h4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M12 4a8 8 0 1 1-5.66 2.34"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.55"
            />
          </svg>
        </motion.div>
      </motion.div>

      <motion.div
        ref={setScrollerRef}
        className={cn("ios-scroll-y overflow-y-auto overscroll-y-contain", scrollerClassName)}
        style={{ y }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchEnd}
      >
        {children}
      </motion.div>
    </div>
  );
});

export default PullToRefresh;
