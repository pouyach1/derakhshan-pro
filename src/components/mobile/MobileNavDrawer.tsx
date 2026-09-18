"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import type { ReactNode } from "react";
import { IOS_PAGE_SPRING } from "@/lib/motion/ios";
import { useHaptic } from "@/hooks/useHaptic";
import { cn } from "@/lib/utils";

type NavItem = { href: string; label: string };

type MobileNavDrawerProps = {
  open: boolean;
  onClose: () => void;
  items: readonly NavItem[];
  footer?: ReactNode;
};

/**
 * دراور موبایل شبیه App Switcher: پس‌زمینه مقیاس کوچک + تار، easing غیرخطی قوی در ابتدا.
 */
export default function MobileNavDrawer({ open, onClose, items, footer }: MobileNavDrawerProps) {
  const vibrate = useHaptic();

  return (
    <AnimatePresence>
      {open ? (
        <>
          {/* لایه مقیاس صفحه پشت منو */}
          <motion.div
            aria-hidden
            className="pointer-events-none fixed inset-0 z-30 bg-slate-950/30 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.2, 0.9, 0.2, 1] }}
          />

          <motion.div
            id="mobile-nav"
            className="fixed inset-0 z-40 overflow-hidden bg-slate-950 lg:hidden"
            initial={{ y: "-8%", opacity: 0.85, scale: 1.02 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: "-6%", opacity: 0.9, scale: 1.015 }}
            transition={{
              ...IOS_PAGE_SPRING,
              // ease-out قوی در ابتدا برای حس iOS
              opacity: { duration: 0.22, ease: [0.16, 1, 0.3, 1] },
            }}
            style={{ willChange: "transform, opacity" }}
          >
            <nav
              className="rio-container flex h-full flex-col justify-center gap-5 pt-20"
              aria-label="موبایل"
            >
              {items.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...IOS_PAGE_SPRING, delay: 0.04 + index * 0.04 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => {
                      vibrate(8);
                      onClose();
                    }}
                    className={cn(
                      "ios-tap-target block font-vazirmatn text-3xl text-beige",
                      "transition-colors duration-300 hover:text-sky-400",
                    )}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              {footer ? <div className="mt-4 max-w-xs">{footer}</div> : null}
            </nav>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
