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
  Newspaper,
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
import { siteConfig } from "@/config/siteConfig";

const nav = [
  { href: "/agent/dashboard", label: "داشبورد", icon: LayoutDashboard },
  { href: "/agent/properties", label: "املاک من", icon: Home },
  { href: "/agent/clients", label: "مشتریان", icon: Users },
  { href: "/agent/schedule", label: "بازدیدها", icon: CalendarDays },
  { href: "/agent/blog", label: "وبلاگ", icon: Newspaper },
];

export default function AgentShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState<AuthSession | null>(null);
  const [toast, setToast] = useState(false);

  useEffect(() => {
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

  function logout() {
    clearClientSession();
    setToast(true);
    void fetch("/api/auth/logout", { method: "POST" }).finally(() => {
      window.setTimeout(() => {
        router.replace("/login");
        router.refresh();
      }, 500);
    });
  }

  return (
    <div
      dir="rtl"
      lang="fa"
      className="workspace-dark min-h-dvh bg-admin-canvas font-vazirmatn text-ws-text antialiased"
    >
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#121821]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-500/15 text-sky-300 ring-1 ring-sky-400/25">
              <Building2 className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-ws-text">پنل مشاور</p>
              <p className="text-xs text-ws-muted">
                {session
                  ? `${displayNameForSession(session)} · مشاور`
                  : `${siteConfig.panels.agentShellFallback} · ${siteConfig.brand.productNameFa}`}
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
                    "inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm transition duration-200",
                    active
                      ? "bg-sky-500/20 text-sky-100 ring-1 ring-sky-400/40"
                      : "bg-white/5 text-ws-muted ring-1 ring-white/10 hover:bg-white/10 hover:text-ws-text",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}
            {session ? <UserAccountMenu tone="dark" /> : null}
            {!session ? (
              <button
                type="button"
                onClick={logout}
                className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3.5 py-2 text-sm text-ws-muted ring-1 ring-white/10 transition hover:bg-rose-500/10 hover:text-rose-300 hover:ring-rose-400/30"
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
