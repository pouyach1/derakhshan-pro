"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";
import { IOS_PAGE_SPRING } from "@/lib/motion/ios";

type MobilePageTransitionProps = {
  children: ReactNode;
};

/**
 * انتقال صفحه موبایل با AnimatePresence + spring.
 * mode پیش‌فرض (sync) تا shared-element layoutId با morph هم‌زمان کار کند — نه mode="wait".
 * روی دسکتاپ فقط children بدون انیمیشن.
 */
export default function MobilePageTransition({ children }: MobilePageTransitionProps) {
  const pathname = usePathname();
  const isMobile = useIsMobile();

  if (!isMobile) {
    return <>{children}</>;
  }

  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.div
        key={pathname}
        className="ios-contain min-h-[100dvh]"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={IOS_PAGE_SPRING}
        style={{ willChange: "transform, opacity" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
