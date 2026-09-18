"use client";

import { AnimatePresence, motion, useMotionValue, useTransform, type PanInfo } from "framer-motion";
import { useCallback, useEffect, type ReactNode } from "react";
import { IOS_DISMISS_DISTANCE_RATIO, IOS_DISMISS_VELOCITY, IOS_SHEET_SPRING } from "@/lib/motion/ios";
import { useHaptic } from "@/hooks/useHaptic";
import { cn } from "@/lib/utils";

type BottomSheetProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
};

/**
 * Bottom sheet با drag-to-dismiss مبتنی بر velocity + فاصله، backdrop-blur واقعی.
 */
export default function BottomSheet({ open, onClose, title, children, className }: BottomSheetProps) {
  const y = useMotionValue(0);
  const backdropOpacity = useTransform(y, [0, 320], [1, 0.35]);
  const vibrate = useHaptic();

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const handleDragEnd = useCallback(
    (_: unknown, info: PanInfo) => {
      const height = typeof window !== "undefined" ? window.innerHeight : 800;
      const shouldClose =
        info.velocity.y > IOS_DISMISS_VELOCITY || info.offset.y > height * IOS_DISMISS_DISTANCE_RATIO;
      if (shouldClose) {
        vibrate(12);
        onClose();
        return;
      }
      // برگشت فنری به موقعیت باز
      y.set(0);
    },
    [onClose, vibrate, y],
  );

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[70] lg:hidden" role="dialog" aria-modal="true" aria-label={title}>
          <motion.button
            type="button"
            aria-label="بستن"
            className="absolute inset-0 bg-slate-950/45 backdrop-blur-md"
            style={{ opacity: backdropOpacity }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={onClose}
          />

          <motion.div
            className={cn(
              "absolute inset-x-0 bottom-0 max-h-[88dvh] overflow-hidden rounded-t-[1.75rem]",
              "border border-white/10 bg-[#0B1220] text-white shadow-[0_-20px_60px_-20px_rgba(0,0,0,0.65)]",
              "ios-contain",
              className,
            )}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={IOS_SHEET_SPRING}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0.06, bottom: 0.55 }}
            style={{ y, willChange: "transform" }}
            onDragEnd={handleDragEnd}
            onAnimationComplete={() => {
              /* پاک‌سازی will-change پس از settle */
            }}
          >
            <div className="flex justify-center pb-2 pt-3">
              <div className="h-1.5 w-12 rounded-full bg-white/25" />
            </div>
            <div className="border-b border-white/10 px-5 pb-3">
              <h2 className="font-vazirmatn text-base font-semibold">{title}</h2>
            </div>
            <div className="ios-scroll-y max-h-[min(72dvh,640px)] overflow-y-auto px-5 py-4">{children}</div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
