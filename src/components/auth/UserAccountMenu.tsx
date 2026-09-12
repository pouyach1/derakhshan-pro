"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, LogOut, UserRound } from "lucide-react";
import AuthToast from "@/components/auth/AuthToast";
import {
  ROLE_LABELS,
  clearClientSession,
  displayNameForSession,
  readClientSession,
  type AuthSession,
} from "@/lib/auth";
import { cn } from "@/lib/utils";

type UserAccountMenuProps = {
  className?: string;
  /** Compact pill for dark marketing header */
  tone?: "light" | "dark";
  onNavigated?: () => void;
};

export default function UserAccountMenu({
  className,
  tone = "light",
  onNavigated,
}: UserAccountMenuProps) {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState(false);

  useEffect(() => {
    setSession(readClientSession());
  }, []);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("mousedown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (!session) return null;

  const name = displayNameForSession(session);
  const roleLabel = ROLE_LABELS[session.role];

  function logout() {
    clearClientSession();
    setOpen(false);
    setToast(true);
    onNavigated?.();
    window.setTimeout(() => {
      router.replace("/login");
      router.refresh();
    }, 900);
  }

  return (
    <>
      <div ref={rootRef} className={cn("relative", className)}>
        <button
          type="button"
          aria-expanded={open}
          aria-haspopup="menu"
          onClick={() => setOpen((value) => !value)}
          className={cn(
            "inline-flex max-w-[16rem] items-center gap-2 rounded-full px-2.5 py-1.5 text-sm transition",
            tone === "dark"
              ? "bg-white/10 text-beige ring-1 ring-white/15 hover:bg-white/15"
              : "bg-white text-slate-700 ring-1 ring-slate-200/80 hover:ring-slate-300",
          )}
        >
          <span
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
              tone === "dark" ? "bg-sky-400/20 text-sky-300" : "bg-emerald-50 text-emerald-700",
            )}
          >
            <UserRound className="h-4 w-4" strokeWidth={1.9} />
          </span>
          <span className="min-w-0 text-start">
            <span className="block truncate font-vazirmatn text-xs font-semibold sm:text-sm">
              {name}
            </span>
            <span
              className={cn(
                "block truncate font-vazirmatn text-[10px]",
                tone === "dark" ? "text-beige/60" : "text-slate-400",
              )}
            >
              {roleLabel}
            </span>
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 opacity-60 transition",
              open && "rotate-180",
              tone === "dark" ? "text-beige" : "text-slate-400",
            )}
          />
        </button>

        <AnimatePresence>
          {open ? (
            <motion.div
              role="menu"
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className="absolute end-0 top-[calc(100%+0.5rem)] z-50 w-56 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xl shadow-slate-900/10"
            >
              <div className="border-b border-slate-100 px-3.5 py-3">
                <p className="truncate font-vazirmatn text-sm font-semibold text-slate-900">
                  {name} - {roleLabel}
                </p>
                <p className="mt-0.5 truncate font-vazirmatn text-[11px] text-slate-400" dir="ltr">
                  {session.phone}
                </p>
              </div>
              <button
                type="button"
                role="menuitem"
                onClick={logout}
                className="flex w-full items-center gap-2 px-3.5 py-3 font-vazirmatn text-sm text-rose-700 transition hover:bg-rose-50"
              >
                <LogOut className="h-4 w-4" />
                خروج از حساب
              </button>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <AuthToast open={toast} message="با موفقیت از حساب کاربری خارج شدید" />
    </>
  );
}
