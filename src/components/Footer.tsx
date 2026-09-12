"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUp,
  Building2,
  Clock3,
  Instagram,
  Linkedin,
  MessageCircle,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { NAV, SITE } from "@/config/site";

const spring = { type: "spring" as const, stiffness: 90, damping: 18 };

const PROPERTY_LINKS = [
  { href: "/", label: "صفحه اصلی" },
  { href: "/contact", label: "درباره ما / مشاوره" },
  { href: "/meet-the-team", label: "تیم مشاوران" },
  { href: "/done-deals", label: "معاملات انجام‌شده" },
];

const SERVICE_LINKS = [
  { href: "/services", label: "خرید و فروش پنت‌هاوس" },
  { href: "/services", label: "رهن دیپلماتیک" },
  { href: "/services", label: "مشاوره حقوقی" },
  { href: "/services", label: "ارزیابی هوشمند" },
];

const PANEL_LINKS = [
  { href: "/login", label: "ورود مشاوران" },
  { href: "/admin/dashboard", label: "ورود مدیر" },
  { href: "/admin/properties/new", label: "ثبت ملک جدید" },
  { href: "/contact", label: "قوانین محرمانگی" },
];

const SOCIAL_LINKS = [
  {
    href: "https://instagram.com/derakhshan.pro",
    label: "اینستاگرام لوکس",
    icon: Instagram,
  },
  {
    href: "https://t.me/derakhshanpro",
    label: "تلگرام فایل‌های VIP",
    icon: Send,
  },
  {
    href: `https://wa.me/989121000000`,
    label: "واتس‌اپ",
    icon: MessageCircle,
  },
  {
    href: SITE.social.linkedin,
    label: "لینکدین",
    icon: Linkedin,
  },
];

function formatTehranTime(date: Date) {
  return new Intl.DateTimeFormat("fa-IR", {
    timeZone: "Asia/Tehran",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);
}

function AmbientGlow() {
  const reduceMotion = useReducedMotion();
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute -right-24 -top-16 h-80 w-80 rounded-full bg-[#00F0FF]/15 blur-3xl"
        animate={
          reduceMotion
            ? undefined
            : { x: [0, 30, -20, 0], y: [0, 24, -10, 0], opacity: [0.35, 0.6, 0.35] }
        }
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -left-20 bottom-10 h-96 w-96 rounded-full bg-sky-500/10 blur-3xl"
        animate={
          reduceMotion
            ? undefined
            : { x: [0, -24, 16, 0], y: [0, -20, 12, 0], opacity: [0.25, 0.5, 0.25] }
        }
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <motion.div whileHover={{ x: -4 }} transition={spring}>
      <Link
        href={href}
        className="inline-flex text-sm text-slate-300 transition-colors hover:text-sky-400"
      >
        {label}
      </Link>
    </motion.div>
  );
}

export default function Footer() {
  const reduceMotion = useReducedMotion();
  const [time, setTime] = useState(() => formatTehranTime(new Date()));
  const [contact, setContact] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const id = window.setInterval(() => {
      setTime(formatTehranTime(new Date()));
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  async function onNewsletter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!contact.trim() || status === "loading") return;
    setStatus("loading");
    await new Promise((resolve) => setTimeout(resolve, 900));
    setStatus("success");
    setContact("");
    window.setTimeout(() => setStatus("idle"), 2800);
  }

  function scrollTop() {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  }

  return (
    <footer
      dir="rtl"
      className="relative overflow-hidden bg-[#070C18] font-vazirmatn text-white"
    >
      <AmbientGlow />

      <div className="rio-container relative z-10 space-y-16 py-16 md:space-y-20 md:py-24">
        {/* Part 1 — Billboard CTA */}
        <section className="relative overflow-hidden rounded-[2rem] border border-sky-500/20 bg-white/[0.03] p-8 backdrop-blur-2xl md:p-12">
          <p
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-4 select-none text-center text-[14vw] font-black leading-none tracking-[0.08em] text-transparent opacity-30 md:top-2 md:text-[9vw]"
            style={{
              backgroundImage:
                "linear-gradient(90deg, rgba(0,240,255,0.15), rgba(56,189,248,0.55), rgba(0,240,255,0.15))",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
            }}
          >
            DERAKHSHAN
          </p>

          <div className="relative z-10 mx-auto max-w-3xl pt-10 text-center md:pt-16">
            <p className="text-sm font-semibold tracking-[0.28em] text-sky-400">
              املاک درخشان
            </p>
            <h2 className="mt-4 text-3xl font-black leading-tight tracking-tight md:text-5xl">
              آماده آغاز یک تجربه متفاوت در معاملات املاک لوکس هستید؟
            </h2>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <motion.div whileHover={{ y: -3, scale: 1.03 }} transition={spring}>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-l from-sky-500 to-[#00F0FF] px-6 py-3.5 text-sm font-bold text-[#070C18] shadow-[0_20px_50px_-18px_rgba(0,240,255,0.75)]"
                >
                  <Sparkles className="h-4 w-4" />
                  رزرو جلسه مشاوره VIP
                </Link>
              </motion.div>
              <motion.div whileHover={{ y: -3, scale: 1.03 }} transition={spring}>
                <a
                  href={`tel:${SITE.phone.replace(/\s/g, "")}`}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-6 py-3.5 text-sm font-bold text-white backdrop-blur-2xl transition hover:border-sky-400/50 hover:text-sky-300"
                >
                  <Building2 className="h-4 w-4" />
                  ارتباط مستقیم با مدیریت
                </a>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Part 2 — Live status & location */}
        <section className="grid gap-4 rounded-[1.75rem] border border-sky-500/20 bg-white/[0.03] p-5 backdrop-blur-2xl md:grid-cols-[auto_1fr] md:items-center md:p-6">
          <div className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
            <Clock3 className="h-4 w-4 text-[#00F0FF]" />
            <div>
              <p className="text-[11px] text-slate-400">ساعت تهران</p>
              <p className="font-mono text-lg tracking-wider text-[#00F0FF]">
                {time}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-400/10 px-3 py-1.5 text-xs font-semibold text-sky-200">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00F0FF] opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00F0FF]" />
              </span>
              دفتر مرکزی نیاوران • آماده پاسخگویی به متقاضیان VIP
            </div>
            <p className="text-sm leading-7 text-slate-300">
              تهران، نیاوران، خیابان فرشته، برج اداری درخشان، طبقه اختصاصی ۱۲
            </p>
            <p className="text-xs text-slate-500">
              {SITE.address.line1} · {SITE.phone} · {SITE.email}
            </p>
          </div>
        </section>

        {/* Part 3 — Newsletter */}
        <section className="rounded-[1.75rem] border border-sky-500/20 bg-white/[0.03] p-6 backdrop-blur-2xl md:p-8">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold tracking-[0.18em] text-sky-400">
                خبرنامه فایل‌های محرمانه
              </p>
              <h3 className="mt-3 text-2xl font-black md:text-3xl">
                دریافت فایل‌های اختصاصی و محرمانه (Off-Market)
              </h3>
              <p className="mt-3 max-w-xl text-sm leading-7 text-slate-400">
                فقط برای موکلان تاییدشده؛ اعلان پروژه‌های آف‌مارکت، پنت‌هاوس‌های
                محدود و فرصت‌های سرمایه‌گذاری خصوصی.
              </p>
            </div>

            <form onSubmit={onNewsletter} className="space-y-3">
              <label className="block text-xs font-semibold text-slate-400">
                ایمیل یا شماره موبایل
              </label>
              <div className="flex gap-2">
                <input
                  required
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="hello@... یا ۰۹۱۲..."
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-[#00F0FF] focus:shadow-[0_0_0_4px_rgba(0,240,255,0.15)]"
                />
                <motion.button
                  type="submit"
                  disabled={status === "loading"}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  transition={spring}
                  className="inline-flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl bg-gradient-to-l from-sky-500 to-[#00F0FF] text-[#070C18] shadow-[0_0_30px_-8px_#00F0FF] disabled:opacity-70"
                  aria-label="عضویت در خبرنامه"
                >
                  <ArrowLeft className="h-5 w-5" />
                </motion.button>
              </div>
              <AnimatePresence>
                {status === "success" && (
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-xs font-semibold text-[#00F0FF]"
                  >
                    درخواست شما ثبت شد. فایل‌های محرمانه به‌زودی ارسال می‌شود.
                  </motion.p>
                )}
              </AnimatePresence>
            </form>
          </div>
        </section>

        {/* Part 4 — Link matrix */}
        <section className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="mb-4 text-sm font-bold tracking-wide text-sky-300">
              دپارتمان املاک
            </p>
            <ul className="space-y-3">
              {PROPERTY_LINKS.map((item) => (
                <li key={item.label}>
                  <FooterLink href={item.href} label={item.label} />
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 text-sm font-bold tracking-wide text-sky-300">
              خدمات اختصاصی
            </p>
            <ul className="space-y-3">
              {SERVICE_LINKS.map((item) => (
                <li key={item.label}>
                  <FooterLink href={item.href} label={item.label} />
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 text-sm font-bold tracking-wide text-sky-300">
              دسترسی سریع و پنل‌ها
            </p>
            <ul className="space-y-3">
              {PANEL_LINKS.map((item) => (
                <li key={item.label}>
                  <FooterLink href={item.href} label={item.label} />
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 text-sm font-bold tracking-wide text-sky-300">
              شبکه‌ها و ارتباطات
            </p>
            <ul className="space-y-3">
              {SOCIAL_LINKS.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.label}>
                    <motion.a
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      whileHover={{ x: -4, color: "#38BDF8" }}
                      transition={spring}
                      className="inline-flex items-center gap-2 text-sm text-slate-300"
                    >
                      <Icon className="h-4 w-4 text-[#00F0FF]" />
                      {item.label}
                    </motion.a>
                  </li>
                );
              })}
              <li>
                <motion.a
                  href={`tel:${SITE.phone.replace(/\s/g, "")}`}
                  whileHover={{ x: -4, color: "#38BDF8" }}
                  transition={spring}
                  className="inline-flex items-center gap-2 text-sm text-slate-300"
                >
                  <Phone className="h-4 w-4 text-[#00F0FF]" />
                  {SITE.phone}
                </motion.a>
              </li>
            </ul>
          </div>
        </section>

        {/* Part 5 — Bottom bar */}
        <section className="flex flex-col gap-4 border-t border-white/10 pt-8 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <p className="text-xs leading-6 text-slate-400 md:text-sm">
              تمامی حقوق مادی و معنوی متعلق به دپارتمان املاک درخشان است © ۲۰۲۶
            </p>
            <p className="inline-flex items-center gap-2 text-[11px] text-slate-500">
              <ShieldCheck className="h-3.5 w-3.5 text-sky-400" />
              پروتکل محرمانگی VIP برای تمام پرونده‌ها فعال است
            </p>
          </div>

          <div className="flex flex-wrap gap-4 text-xs text-slate-500">
            {NAV.slice(0, 4).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition hover:text-sky-400"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </section>
      </div>

      <AnimatePresence>
        {showTop && (
          <motion.button
            type="button"
            aria-label="بازگشت به بالا"
            onClick={scrollTop}
            initial={{ opacity: 0, y: 16, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.9 }}
            whileHover={{ y: -4, scale: 1.06 }}
            transition={spring}
            className="fixed bottom-6 left-6 z-50 inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-[#070C18]/80 px-4 py-3 text-xs font-bold text-sky-200 shadow-[0_0_40px_-12px_#00F0FF] backdrop-blur-2xl md:bottom-8 md:left-8"
          >
            <ArrowUp className="h-4 w-4 text-[#00F0FF]" />
            بازگشت به بالا
          </motion.button>
        )}
      </AnimatePresence>
    </footer>
  );
}
