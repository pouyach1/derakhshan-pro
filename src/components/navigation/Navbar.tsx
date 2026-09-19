"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";
import { LogIn, Sparkles } from "lucide-react";
import UserAccountMenu from "@/components/auth/UserAccountMenu";
import Logo from "@/components/ui/Logo";
import MobileNavDrawer from "@/components/mobile/MobileNavDrawer";
import { NAV } from "@/config/site";
import { readClientSession, type AuthSession } from "@/lib/auth";
import { IOS_PAGE_SPRING, IOS_TAP_SPRING } from "@/lib/motion/ios";
import { cn } from "@/lib/utils";

function LoginButton({
  className,
  onClick,
}: {
  className?: string;
  onClick?: () => void;
}) {
  return (
    <motion.div whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.97 }} transition={IOS_TAP_SPRING}>
      <Link
        href="/login"
        onClick={onClick}
        className={cn(
          "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full",
          "bg-gradient-to-l from-cyan-300 via-sky-400 to-cyan-400 px-5 py-2.5",
          "font-vazirmatn text-sm font-semibold text-slate-950",
          "shadow-[0_12px_40px_-16px_rgba(0,163,255,0.85)]",
          "ios-tap-target",
          className,
        )}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 translate-x-[120%] bg-[linear-gradient(120deg,transparent_30%,rgba(255,255,255,0.55)_50%,transparent_70%)] opacity-0 transition duration-700 group-hover:translate-x-[-120%] group-hover:opacity-100"
        />
        <LogIn className="relative h-4 w-4" strokeWidth={2.1} />
        <span className="relative">ورود</span>
      </Link>
    </motion.div>
  );
}

function DesktopNavLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative px-1 py-1 font-vazirmatn text-sm transition-colors duration-300",
        active ? "text-cyan-200" : "text-beige/85 hover:text-white",
      )}
    >
      <motion.span className="inline-block" whileHover={{ y: -1 }} transition={IOS_TAP_SPRING}>
        {label}
      </motion.span>
      {active ? (
        <motion.span
          layoutId="nav-active-underline"
          className="absolute inset-x-0 -bottom-1 h-px bg-gradient-to-l from-transparent via-cyan-300 to-transparent"
          transition={IOS_PAGE_SPRING}
          style={{ willChange: "transform" }}
        />
      ) : (
        <span
          aria-hidden
          className="absolute inset-x-0 -bottom-1 h-px origin-center scale-x-0 bg-white/40 transition-transform duration-300 group-hover:scale-x-100"
        />
      )}
    </Link>
  );
}

function MenuToggle({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  return (
    <motion.button
      type="button"
      className="ios-tap-target relative z-50 flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/[0.06] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md"
      aria-expanded={open}
      aria-controls="mobile-nav"
      aria-label={open ? "بستن منو" : "باز کردن منو"}
      onClick={onToggle}
      whileTap={{ scale: 0.92 }}
      transition={IOS_TAP_SPRING}
    >
      <span className="relative block h-3.5 w-5">
        <motion.span
          className="absolute inset-x-0 top-0 h-px bg-beige"
          animate={open ? { y: 6.5, rotate: 45 } : { y: 0, rotate: 0 }}
          transition={IOS_PAGE_SPRING}
        />
        <motion.span
          className="absolute inset-x-0 top-[6.5px] h-px bg-beige"
          animate={open ? { opacity: 0, scaleX: 0.4 } : { opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.2 }}
        />
        <motion.span
          className="absolute inset-x-0 bottom-0 h-px bg-beige"
          animate={open ? { y: -6.5, rotate: -45 } : { y: 0, rotate: 0 }}
          transition={IOS_PAGE_SPRING}
        />
      </span>
    </motion.button>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [session, setSession] = useState<AuthSession | null>(null);
  const { scrollYProgress, scrollY } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.35 });
  const motionReady = mounted && !reduceMotion;

  useEffect(() => {
    setMounted(true);
    setSession(readClientSession());
    void fetch("/api/auth/me")
      .then((r) => r.json())
      .then((payload) => {
        if (payload?.ok && payload.data?.session) {
          setSession(payload.data.session);
        }
      })
      .catch(() => {
        /* ignore */
      });
  }, []);

  useMotionValueEvent(scrollY, "change", (value) => {
    setScrolled(value > 18);
  });

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    document.documentElement.classList.toggle("ios-nav-open", open);
    return () => {
      document.body.style.overflow = "";
      document.documentElement.classList.remove("ios-nav-open");
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <motion.header
        initial={false}
        animate={motionReady ? { y: 0, opacity: 1 } : { y: 0, opacity: 1 }}
        transition={IOS_PAGE_SPRING}
        className={cn(
          "fixed inset-x-0 top-0 z-50",
          scrolled || open ? "border-b border-white/10" : "border-b border-transparent",
        )}
      >
        {/* Ambient luxury glow along the top edge */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-cyan-300/70 to-transparent"
          animate={
            motionReady
              ? { opacity: [0.35, 0.85, 0.35] }
              : { opacity: 0.55 }
          }
          transition={motionReady ? { duration: 6, repeat: Infinity, ease: "easeInOut" } : undefined}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-[12%] top-0 h-16 bg-[radial-gradient(ellipse_at_top,rgba(0,163,255,0.22),transparent_70%)] opacity-80"
        />

        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-slate-950/82 backdrop-blur-2xl"
          initial={false}
          animate={{ opacity: scrolled || open ? 1 : 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-950/55 via-slate-950/20 to-transparent"
          initial={false}
          animate={{ opacity: scrolled || open ? 0 : 1 }}
          transition={{ duration: 0.4 }}
        />

        <div className="rio-container relative flex h-[4.25rem] items-center justify-between gap-4 md:h-[5.25rem]">
          <div className="relative">
            <Logo />
            {motionReady ? (
              <motion.span
                aria-hidden
                className="pointer-events-none absolute -inset-3 -z-10 rounded-full bg-cyan-400/10 blur-xl"
                animate={{ opacity: [0.25, 0.55, 0.25], scale: [0.95, 1.05, 0.95] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              />
            ) : null}
          </div>

          <nav className="hidden items-center gap-6 xl:gap-9 lg:flex" aria-label="اصلی">
            {NAV.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <div key={item.href}>
                  <DesktopNavLink href={item.href} label={item.label} active={active} />
                </div>
              );
            })}
            <div className="ms-1 flex items-center gap-3">
              <span className="hidden items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[10px] font-semibold tracking-[0.16em] text-cyan-200/90 xl:inline-flex">
                <Sparkles className="h-3 w-3" />
                VIP
              </span>
              {session ? <UserAccountMenu tone="dark" /> : <LoginButton />}
            </div>
          </nav>

          <div className="flex items-center gap-2 lg:hidden">
            {session ? (
              <UserAccountMenu tone="dark" onNavigated={() => setOpen(false)} />
            ) : (
              <LoginButton className="px-4 py-2 text-xs" />
            )}
            <MenuToggle open={open} onToggle={() => setOpen((value) => !value)} />
          </div>
        </div>

        {/* نوار پیشرفت اسکرول — خط نورانی لوکس */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] origin-right bg-gradient-to-l from-transparent via-cyan-300 to-sky-400/80"
          style={{ scaleX: progress, willChange: "transform" }}
        />
      </motion.header>

      <MobileNavDrawer
        open={open}
        onClose={() => setOpen(false)}
        items={NAV}
        activeHref={pathname}
        footer={
          !session ? (
            <LoginButton
              className="mt-4 w-full max-w-xs py-3.5 text-base"
              onClick={() => setOpen(false)}
            />
          ) : null
        }
      />
    </>
  );
}
