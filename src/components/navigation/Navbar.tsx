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
import { LogIn } from "lucide-react";
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
          "bg-cyan-400 px-5 py-2.5",
          "font-vazirmatn text-sm font-semibold text-slate-950",
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
          className="absolute inset-x-0 -bottom-1 h-px bg-cyan-400"
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
      className="ios-tap-target relative z-50 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-md"
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
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [session, setSession] = useState<AuthSession | null>(null);
  const { scrollYProgress, scrollY } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.35 });

  useEffect(() => {
    setSession(readClientSession());
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
        initial={reduceMotion ? false : { y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={IOS_PAGE_SPRING}
        className={cn(
          "fixed inset-x-0 top-0 z-50",
          scrolled || open ? "border-b border-white/10" : "border-b border-transparent",
        )}
      >
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-slate-950/80 backdrop-blur-xl"
          initial={false}
          animate={{ opacity: scrolled || open ? 1 : 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        />

        <div className="rio-container relative flex h-16 items-center justify-between gap-4 md:h-20">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...IOS_PAGE_SPRING, delay: 0.05 }}
          >
            <Logo />
          </motion.div>

          <nav className="hidden items-center gap-6 xl:gap-8 lg:flex" aria-label="اصلی">
            {NAV.map((item, index) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <motion.div
                  key={item.href}
                  initial={reduceMotion ? false : { opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...IOS_PAGE_SPRING, delay: 0.08 + index * 0.04 }}
                >
                  <DesktopNavLink href={item.href} label={item.label} active={active} />
                </motion.div>
              );
            })}
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...IOS_PAGE_SPRING, delay: 0.35 }}
              className="ms-1"
            >
              {session ? <UserAccountMenu tone="dark" /> : <LoginButton />}
            </motion.div>
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

        {/* نوار پیشرفت اسکرول صفحه — مینیمال و لوکس */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-right bg-cyan-400/90"
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
