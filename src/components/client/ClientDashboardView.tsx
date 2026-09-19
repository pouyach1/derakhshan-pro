"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Building2,
  Headphones,
  LogOut,
  Sparkles,
  UserRound,
} from "lucide-react";
import CompactPropertyCard from "@/components/mobile/CompactPropertyCard";
import FreeScrollCarousel from "@/components/mobile/carousel/FreeScrollCarousel";
import PagingCarousel from "@/components/mobile/carousel/PagingCarousel";
import { clearClientSession } from "@/lib/auth";
import { IOS_PAGE_SPRING, IOS_TAP_SPRING } from "@/lib/motion/ios";
import { siteConfig } from "@/config/siteConfig";
import { cn } from "@/lib/utils";
import type { PropertyRecord } from "@/server/db/store";

type ClientDashboardViewProps = {
  name: string;
  items: PropertyRecord[];
};

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: IOS_PAGE_SPRING },
};

/**
 * داشبورد مشتری — فضای خصوصی روشن و لوکس، دکمه‌های کامل، کاروسل فایل‌ها.
 */
export default function ClientDashboardView({ name, items }: ClientDashboardViewProps) {
  const router = useRouter();

  const featured = useMemo(() => {
    const flagged = items.filter((p) => p.isFeatured);
    return (flagged.length ? flagged : items).slice(0, 8);
  }, [items]);

  const recent = useMemo(() => {
    return [...items]
      .sort((a, b) => (b.updatedAt ?? "").localeCompare(a.updatedAt ?? ""))
      .slice(0, 8);
  }, [items]);

  async function logout() {
    clearClientSession();
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      /* ignore */
    }
    router.replace("/login");
    router.refresh();
  }

  return (
    <div className="relative min-h-dvh overflow-hidden bg-[#F3F7FB] text-[#0B3A5C]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_100%_0%,rgba(0,163,255,0.14),transparent_55%),radial-gradient(ellipse_60%_40%_at_0%_20%,rgba(11,58,92,0.08),transparent_50%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-white/80 to-transparent" />

      {/* Header — لوکس و مینیمال */}
      <motion.header
        className="relative z-20 border-b border-[#0B3A5C]/8 bg-white/75 shadow-[0_12px_40px_-28px_rgba(11,58,92,0.35)] backdrop-blur-2xl"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={IOS_PAGE_SPRING}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-sky-400/60 to-transparent"
        />
        <div className="rio-container flex items-center justify-between gap-3 py-4 md:py-5">
          <Link href="/" className="group relative min-w-0">
            <span
              aria-hidden
              className="pointer-events-none absolute -inset-2 -z-10 rounded-full bg-sky-400/10 opacity-0 blur-xl transition group-hover:opacity-100"
            />
            <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.28em] text-sky-600 md:text-[11px]">
              {siteConfig.brand.brandEn}
            </p>
            <p className="truncate font-vazirmatn text-base font-bold text-[#0B3A5C] transition group-hover:text-sky-700 md:text-lg">
              {siteConfig.brand.shortNameFa}
            </p>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/listings"
              className="hidden items-center gap-1.5 rounded-full border border-[#0B3A5C]/10 bg-white/80 px-4 py-2 text-sm font-semibold text-[#0B3A5C]/80 shadow-sm transition hover:border-sky-300/50 hover:text-sky-800 sm:inline-flex"
            >
              <Building2 className="h-3.5 w-3.5" />
              آرشیو
            </Link>
            <Link
              href="/contact"
              className="hidden rounded-full bg-gradient-to-l from-sky-500 to-cyan-400 px-4 py-2 text-sm font-bold text-white shadow-[0_10px_28px_-14px_rgba(0,163,255,0.9)] transition hover:brightness-105 md:inline-flex"
            >
              مشاوره
            </Link>
            <motion.button
              type="button"
              onClick={logout}
              whileTap={{ scale: 0.97 }}
              transition={IOS_TAP_SPRING}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#0B3A5C]/12 bg-white px-3.5 py-2 text-sm font-semibold text-[#0B3A5C] shadow-sm transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">خروج</span>
            </motion.button>
          </div>
        </div>
      </motion.header>

      <main className="relative z-10 pb-20 pt-8 md:pt-12">
        {/* Welcome */}
        <motion.section
          className="rio-container"
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
          }}
        >
          <motion.div
            variants={fadeUp}
            className="relative overflow-hidden rounded-[1.75rem] bg-[#0B3A5C] px-6 py-8 text-white shadow-[0_28px_80px_-40px_rgba(11,58,92,0.65)] md:px-10 md:py-12"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgba(0,163,255,0.35),transparent_42%),linear-gradient(135deg,transparent_40%,rgba(255,255,255,0.06))]" />
            <div className="pointer-events-none absolute -start-16 -top-16 h-48 w-48 rounded-full bg-sky-400/20 blur-3xl" />

            <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold tracking-[0.14em] text-sky-200 backdrop-blur">
                  <Sparkles className="h-3.5 w-3.5" />
                  پنل اختصاصی موکل
                </p>
                <h1 className="mt-5 font-vazirmatn text-[clamp(1.85rem,4.5vw,3rem)] font-bold leading-relaxed tracking-tight">
                  سلام {name}
                </h1>
                <p className="mt-3 max-w-xl font-vazirmatn text-sm leading-8 text-white/75 md:text-base">
                  فایل‌های منتخب {siteConfig.brand.nameFa} بر اساس پروفایل شما آماده‌اند. آرشیو را ببینید یا برای بازدید
                  خصوصی با تیم مشاوره هماهنگ کنید.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <DashButton href="/listings" tone="primary" icon={<Building2 className="h-4 w-4" />}>
                    مشاهده آرشیو املاک
                  </DashButton>
                  <DashButton href="/contact" tone="glass" icon={<Headphones className="h-4 w-4" />}>
                    درخواست مشاوره
                  </DashButton>
                  <DashButton href="/client/onboarding" tone="ghost" icon={<UserRound className="h-4 w-4" />}>
                    تکمیل پروفایل
                  </DashButton>
                </div>
              </div>

              <motion.div
                variants={fadeUp}
                className="relative hidden overflow-hidden rounded-2xl border border-white/15 bg-white/5 lg:block"
              >
                <div className="relative aspect-[5/4]">
                  <Image
                    src="/images/landing/hero/banner.jpg"
                    alt=""
                    fill
                    sizes="360px"
                    className="object-cover opacity-90"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B3A5C] via-[#0B3A5C]/25 to-transparent" />
                  <p className="absolute inset-x-0 bottom-0 p-5 font-vazirmatn text-sm font-medium text-white/90">
                    پیشنهادهای زنده شمال تهران
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.section>

        {/* Quick actions — full buttons */}
        <motion.section
          className="rio-container mt-8 grid gap-3 sm:grid-cols-3"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...IOS_PAGE_SPRING, delay: 0.15 }}
        >
          <QuickAction
            href="/listings"
            title="آرشیو کامل"
            desc="همه فایل‌های فعال"
            icon={<Building2 className="h-5 w-5" />}
          />
          <QuickAction
            href="/contact"
            title="مشاوره VIP"
            desc="هماهنگی بازدید خصوصی"
            icon={<Headphones className="h-5 w-5" />}
          />
          <QuickAction
            href="/client/onboarding"
            title="پروفایل ملکی"
            desc="بودجه و محله‌های هدف"
            icon={<UserRound className="h-5 w-5" />}
          />
        </motion.section>

        {/* Featured properties */}
        <section className="mt-12 md:mt-16">
          <div className="rio-container mb-5 flex items-end justify-between gap-4 md:mb-7">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.18em] text-sky-600">ویژه شما</p>
              <h2 className="mt-1 font-vazirmatn text-xl font-bold text-[#0B3A5C] md:text-2xl">
                ملک‌های منتخب
              </h2>
            </div>
            <Link
              href="/listings"
              className="inline-flex items-center gap-1 text-sm font-semibold text-sky-700 transition hover:text-sky-900"
            >
              همه
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>

          <div className="overflow-hidden rounded-[1.75rem] border border-[#0B3A5C]/8 bg-white py-8 shadow-[0_28px_80px_-48px_rgba(11,58,92,0.3)] md:py-10">
            {featured.length === 0 ? (
              <p className="rio-container text-sm text-[#0B3A5C]/50">هنوز فایلی برای نمایش نیست.</p>
            ) : (
              <FreeScrollCarousel slideWidthRatio={{ mobile: 0.78, desktop: 0.34 }} gapPx={16}>
                {featured.map((item, index) => (
                  <CompactPropertyCard
                    key={item.id}
                    item={item}
                    variant="featured"
                    priority={index === 0}
                  />
                ))}
              </FreeScrollCarousel>
            )}
          </div>
        </section>

        {/* Recent */}
        <section className="mt-12 md:mt-16">
          <div className="rio-container mb-5 md:mb-7">
            <p className="text-[11px] font-semibold tracking-[0.18em] text-sky-600">تازه‌ها</p>
            <h2 className="mt-1 font-vazirmatn text-xl font-bold text-[#0B3A5C] md:text-2xl">
              جدیدترین فایل‌ها
            </h2>
          </div>

          <div className="overflow-hidden rounded-[1.75rem] border border-[#0B3A5C]/8 bg-[#EAF3FA] py-8 md:py-10">
            {recent.length === 0 ? (
              <p className="rio-container text-sm text-[#0B3A5C]/50">فایلی برای نمایش نیست.</p>
            ) : (
              <PagingCarousel slideWidthRatio={{ mobile: 0.88, desktop: 0.5 }} gapPx={16}>
                {recent.map((item, index) => (
                  <CompactPropertyCard
                    key={item.id}
                    item={item}
                    variant="paging"
                    priority={index === 0}
                  />
                ))}
              </PagingCarousel>
            )}
          </div>
        </section>

        {/* Bottom CTA */}
        <motion.section
          className="rio-container mt-12 md:mt-16"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={IOS_PAGE_SPRING}
        >
          <div className="flex flex-col items-start justify-between gap-6 rounded-[1.75rem] border border-[#0B3A5C]/10 bg-white px-6 py-8 shadow-[0_20px_60px_-40px_rgba(11,58,92,0.35)] md:flex-row md:items-center md:px-10">
            <div>
              <h2 className="font-vazirmatn text-xl font-bold text-[#0B3A5C]">آماده‌اید برای بازدید؟</h2>
              <p className="mt-2 max-w-lg text-sm leading-7 text-[#0B3A5C]/65">
                تیم {siteConfig.brand.shortNameFa} بازدید خصوصی و پیگیری تا معامله را برای شما هماهنگ می‌کند.
              </p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <DashButton href="/contact" tone="primary" icon={<Headphones className="h-4 w-4" />}>
                شروع مشاوره
              </DashButton>
              <DashButton href="/listings" tone="secondary" icon={<Building2 className="h-4 w-4" />}>
                ادامه جستجو
              </DashButton>
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  );
}

function DashButton({
  href,
  children,
  tone,
  icon,
}: {
  href: string;
  children: React.ReactNode;
  tone: "primary" | "glass" | "ghost" | "secondary";
  icon?: React.ReactNode;
}) {
  return (
    <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} transition={IOS_TAP_SPRING}>
      <Link
        href={href}
        className={cn(
          "inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl px-5 text-sm font-bold transition sm:w-auto",
          tone === "primary" &&
            "bg-sky-500 text-white shadow-[0_14px_40px_-16px_rgba(0,163,255,0.9)] hover:bg-sky-400",
          tone === "glass" &&
            "border border-white/25 bg-white/10 text-white backdrop-blur hover:bg-white/15",
          tone === "ghost" &&
            "border border-white/20 bg-transparent text-white/90 hover:bg-white/10",
          tone === "secondary" &&
            "border border-[#0B3A5C]/15 bg-[#0B3A5C]/[0.04] text-[#0B3A5C] hover:bg-[#0B3A5C]/[0.08]",
        )}
      >
        {icon}
        {children}
      </Link>
    </motion.div>
  );
}

function QuickAction({
  href,
  title,
  desc,
  icon,
}: {
  href: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
}) {
  return (
    <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.985 }} transition={IOS_TAP_SPRING}>
      <Link
        href={href}
        className="flex h-full items-start gap-3 rounded-2xl border border-[#0B3A5C]/8 bg-white/90 p-4 shadow-[0_12px_40px_-28px_rgba(11,58,92,0.45)] transition hover:border-sky-300/60 hover:shadow-[0_18px_50px_-28px_rgba(0,163,255,0.35)]"
      >
        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600 ring-1 ring-sky-100">
          {icon}
        </span>
        <span className="min-w-0">
          <span className="block font-vazirmatn text-sm font-bold text-[#0B3A5C]">{title}</span>
          <span className="mt-0.5 block text-xs leading-6 text-[#0B3A5C]/55">{desc}</span>
        </span>
        <ArrowLeft className="ms-auto mt-1 h-4 w-4 shrink-0 text-[#0B3A5C]/35" />
      </Link>
    </motion.div>
  );
}
