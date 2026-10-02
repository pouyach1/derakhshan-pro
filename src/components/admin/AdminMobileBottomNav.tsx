"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { ADMIN_MORE_NAV, ADMIN_PRIMARY_NAV } from "@/config/admin-nav";
import { IOS_PAGE_SPRING, IOS_TAP_SPRING } from "@/lib/motion/ios";
import { useHaptic } from "@/hooks/useHaptic";
import { cn } from "@/lib/utils";
import BottomSheet from "@/components/mobile/BottomSheet";
import ContactsSidebar from "@/components/admin/ContactsSidebar";

type AdminMobileBottomNavProps = {
  isDark?: boolean;
};

/**
 * نوار پایین موبایل ادمین — مسیرهای اصلی + «بیشتر» برای بقیه و دفترچه تماس.
 */
export default function AdminMobileBottomNav({ isDark = true }: AdminMobileBottomNavProps) {
  const pathname = usePathname();
  const vibrate = useHaptic();
  const reduceMotion = useReducedMotion();
  const [moreOpen, setMoreOpen] = useState(false);
  const [contactsOpen, setContactsOpen] = useState(false);

  useEffect(() => {
    setMoreOpen(false);
    setContactsOpen(false);
  }, [pathname]);

  const moreActive = ADMIN_MORE_NAV.some(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
  );

  return (
    <>
      <nav
        aria-label="ناوبری موبایل ادمین"
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 border-t lg:hidden",
          "pb-[max(0.55rem,env(safe-area-inset-bottom))]",
          isDark
            ? "border-white/10 bg-[#121821]/94 text-ws-text backdrop-blur-xl"
            : "border-slate-200/80 bg-white/94 text-admin-navy backdrop-blur-xl",
        )}
      >
        <div className="mx-auto grid max-w-lg grid-cols-5 gap-0.5 px-1.5 pt-1.5">
          {ADMIN_PRIMARY_NAV.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => vibrate(8)}
                className={cn(
                  "ios-tap-target relative flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-2xl px-1 py-1.5 text-[10px] font-semibold transition",
                  active
                    ? isDark
                      ? "text-sky-300"
                      : "text-admin-sky"
                    : isDark
                      ? "text-ws-muted"
                      : "text-slate-500",
                )}
              >
                {active ? (
                  <motion.span
                    layoutId="admin-mobile-tab"
                    className={cn(
                      "absolute inset-x-1 inset-y-0.5 rounded-2xl",
                      isDark ? "bg-sky-500/15 ring-1 ring-sky-400/30" : "bg-sky-50 ring-1 ring-sky-200/80",
                    )}
                    transition={reduceMotion ? { duration: 0 } : IOS_PAGE_SPRING}
                  />
                ) : null}
                <Icon className="relative h-5 w-5" strokeWidth={active ? 2.2 : 1.8} />
                <span className="relative">{item.shortLabel}</span>
              </Link>
            );
          })}

          <button
            type="button"
            onClick={() => {
              vibrate(10);
              setMoreOpen(true);
            }}
            className={cn(
              "ios-tap-target relative flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-2xl px-1 py-1.5 text-[10px] font-semibold transition",
              moreActive || moreOpen
                ? isDark
                  ? "text-sky-300"
                  : "text-admin-sky"
                : isDark
                  ? "text-ws-muted"
                  : "text-slate-500",
            )}
          >
            <Menu className="relative h-5 w-5" strokeWidth={1.8} />
            <span className="relative">بیشتر</span>
          </button>
        </div>
      </nav>

      <BottomSheet
        open={moreOpen}
        onClose={() => setMoreOpen(false)}
        title="بخش‌های بیشتر"
        className={cn(
          isDark
            ? "border-white/10 bg-[#121821] text-ws-text"
            : "!bg-white !text-admin-navy border-slate-200",
        )}
      >
        <div className="space-y-2 px-1 pb-4">
          <p className={cn("px-2 text-xs", isDark ? "text-ws-muted" : "text-slate-500")}>
            مسیرهای تکمیلی پنل مدیریت
          </p>
          <div className="grid grid-cols-2 gap-2">
            {ADMIN_MORE_NAV.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => {
                    vibrate(8);
                    setMoreOpen(false);
                  }}
                  className={cn(
                    "ios-tap-target flex min-h-[4.5rem] flex-col items-start justify-center gap-2 rounded-2xl px-3.5 py-3 transition",
                    active
                      ? isDark
                        ? "bg-sky-500/15 text-sky-200 ring-1 ring-sky-400/35"
                        : "bg-sky-50 text-admin-navy ring-1 ring-sky-200"
                      : isDark
                        ? "bg-white/5 text-ws-text ring-1 ring-white/10"
                        : "bg-admin-soft text-admin-navy ring-1 ring-slate-200/70",
                  )}
                >
                  <Icon className="h-5 w-5" strokeWidth={1.9} />
                  <span className="text-sm font-semibold">{item.label}</span>
                </Link>
              );
            })}
          </div>

          <motion.button
            type="button"
            whileTap={{ scale: 0.98 }}
            transition={IOS_TAP_SPRING}
            onClick={() => {
              vibrate(10);
              setMoreOpen(false);
              setContactsOpen(true);
            }}
            className={cn(
              "ios-tap-target mt-2 flex w-full items-center justify-between rounded-2xl px-4 py-3.5 text-sm font-semibold",
              isDark
                ? "bg-white/5 text-ws-text ring-1 ring-white/10"
                : "bg-admin-soft text-admin-navy ring-1 ring-slate-200/70",
            )}
          >
            دفترچه تماس
            <span className={cn("text-xs font-medium", isDark ? "text-ws-muted" : "text-slate-500")}>
              باز کردن
            </span>
          </motion.button>
        </div>
      </BottomSheet>

      <AnimatePresence>
        {contactsOpen ? (
          <motion.div
            className="fixed inset-0 z-[80] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              aria-label="بستن دفترچه تماس"
              className="absolute inset-0 bg-slate-950/50 backdrop-blur-md"
              onClick={() => setContactsOpen(false)}
            />
            <motion.div
              initial={reduceMotion ? { opacity: 0 } : { y: "100%" }}
              animate={{ y: 0, opacity: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { y: "100%" }}
              transition={IOS_PAGE_SPRING}
              className={cn(
                "absolute inset-x-0 bottom-0 max-h-[90dvh] overflow-hidden rounded-t-[1.75rem] pb-[env(safe-area-inset-bottom)]",
                isDark ? "bg-[#121821]" : "bg-admin-canvas",
              )}
            >
              <div className="flex items-center justify-between px-4 pb-2 pt-4">
                <p className={cn("text-sm font-bold", isDark ? "text-ws-text" : "text-admin-navy")}>
                  دفترچه تماس
                </p>
                <button
                  type="button"
                  aria-label="بستن"
                  onClick={() => setContactsOpen(false)}
                  className={cn(
                    "ios-tap-target inline-flex h-10 w-10 items-center justify-center rounded-full",
                    isDark ? "bg-white/10 text-ws-text" : "bg-white text-slate-600 shadow-sm",
                  )}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="max-h-[calc(90dvh-4rem)] overflow-y-auto overscroll-contain px-3 pb-4">
                <ContactsSidebar />
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
