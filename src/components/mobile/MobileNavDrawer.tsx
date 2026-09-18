"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import type { ReactNode } from "react";
import { IOS_PAGE_SPRING, IOS_TAP_SPRING } from "@/lib/motion/ios";
import { useHaptic } from "@/hooks/useHaptic";
import { siteConfig } from "@/config/siteConfig";
import { cn } from "@/lib/utils";

type NavItem = { href: string; label: string };

type MobileNavDrawerProps = {
  open: boolean;
  onClose: () => void;
  items: readonly NavItem[];
  activeHref?: string;
  footer?: ReactNode;
};

/**
 * منوی تمام‌صفحه موبایل — لوکس، مینیمال، با ورود staggered و شاخص فعال.
 */
export default function MobileNavDrawer({
  open,
  onClose,
  items,
  activeHref = "/",
  footer,
}: MobileNavDrawerProps) {
  const vibrate = useHaptic();
  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            aria-hidden
            className="pointer-events-none fixed inset-0 z-30 bg-slate-950/40 backdrop-blur-md lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          />

          <motion.div
            id="mobile-nav"
            className="fixed inset-0 z-40 overflow-hidden bg-[#070C18] lg:hidden"
            initial={reduceMotion ? { opacity: 0 } : { y: "-10%", opacity: 0.7, scale: 1.03 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { y: "-8%", opacity: 0.85, scale: 1.02 }}
            transition={IOS_PAGE_SPRING}
            style={{ willChange: "transform, opacity" }}
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(0,240,255,0.12),_transparent_55%)]" />

            <nav
              className="rio-container relative flex h-full flex-col justify-center gap-1 pt-16"
              aria-label="موبایل"
            >
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...IOS_PAGE_SPRING, delay: 0.05 }}
                className="mb-6 text-[11px] font-semibold tracking-[0.28em] text-cyan-300/80"
              >
                {siteConfig.brand.shortNameFa}
              </motion.p>

              {items.map((item, index) => {
                const active =
                  item.href === "/"
                    ? activeHref === "/"
                    : activeHref === item.href || activeHref.startsWith(`${item.href}/`);
                return (
                  <motion.div
                    key={item.href}
                    initial={reduceMotion ? false : { opacity: 0, y: 22 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...IOS_PAGE_SPRING, delay: 0.06 + index * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => {
                        vibrate(8);
                        onClose();
                      }}
                      className={cn(
                        "ios-tap-target group flex items-baseline justify-between gap-4 border-b border-white/5 py-3.5",
                        active ? "text-cyan-200" : "text-beige",
                      )}
                    >
                      <motion.span
                        className="font-vazirmatn text-[1.85rem] font-semibold leading-none tracking-tight md:text-4xl"
                        whileTap={{ scale: 0.98, x: -2 }}
                        transition={IOS_TAP_SPRING}
                      >
                        {item.label}
                      </motion.span>
                      <span className="font-mono text-[11px] tracking-[0.18em] text-slate-500 transition group-hover:text-cyan-400/80">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </Link>
                  </motion.div>
                );
              })}

              {footer ? (
                <motion.div
                  className="mt-8 max-w-xs"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...IOS_PAGE_SPRING, delay: 0.4 }}
                >
                  {footer}
                </motion.div>
              ) : null}
            </nav>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
