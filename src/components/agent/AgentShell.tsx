"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Building2,
  CalendarDays,
  LayoutDashboard,
  LogOut,
  Home,
  Users,
} from "lucide-react";
import AuthToast from "@/components/auth/AuthToast";
import UserAccountMenu from "@/components/auth/UserAccountMenu";
import {
  clearClientSession,
  displayNameForSession,
  readClientSession,
  type AuthSession,
} from "@/lib/auth";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/agent/dashboard", label: "داشبورد", icon: LayoutDashboard },
  { href: "/agent/properties", label: "املاک من", icon: Home },
  { href: "/agent/clients", label: "مشتریان", icon: Users },
  { href: "/agent/schedule", label: "بازدیدها", icon: CalendarDays },
];

export default function AgentShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState<AuthSession | null>(null);
  const [toast, setToast] = useState(false);

  useEffect(() => {
    setSession(readClientSession());
  }, []);

  function logout() {
    clearClientSession();
    setToast(true);
    window.setTimeout(() => {
      router.replace("/login");
      router.refresh();
    }, 900);
  }

  return (
    <div
      dir="rtl"
      lang="fa"
      className="min-h-dvh bg-[#F1EFEA] font-vazirmatn text-slate-900 antialiased"
    >
      <header className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm">
              <Building2 className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-900">پنل مشاور</p>
              <p className="text-xs text-slate-500">
                {session ? `${displayNameForSession(session)} · مشاور` : "CRM اختصاصی · درخشان پرو"}
              </p>
            </div>
          </div>

          <nav className="flex flex-wrap items-center gap-1.5">
            {nav.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm transition",
                    active
                      ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/25"
                      : "bg-white/80 text-slate-600 ring-1 ring-slate-200/60 hover:bg-white hover:text-slate-900",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}
            {session ? <UserAccountMenu tone="light" /> : null}
            {!session ? (
              <button
                type="button"
                onClick={logout}
                className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3.5 py-2 text-sm text-slate-600 ring-1 ring-slate-200/60 transition hover:bg-rose-50 hover:text-rose-700 hover:ring-rose-200"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">خروج از حساب</span>
              </button>
            ) : null}
          </nav>
        </div>
      </header>

      <AnimatePresence mode="wait">
        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-[1200px] px-4 py-6 sm:px-6"
        >
          {children}
        </motion.main>
      </AnimatePresence>

      <AuthToast open={toast} message="با موفقیت از حساب کاربری خارج شدید" />
    </div>
  );
}
