"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  BadgeCheck,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileCheck2,
  Landmark,
  Quote,
  Scale,
  Sparkles,
  Trophy,
} from "lucide-react";
import { SITE } from "@/config/site";

type DealCategory =
  | "all"
  | "penthouse"
  | "villa"
  | "commercial"
  | "diplomatic";

const spring = { type: "spring" as const, stiffness: 90, damping: 20 };

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0 },
};

const glass =
  "rounded-[2rem] border border-sky-100/60 bg-white/60 shadow-2xl shadow-sky-500/5 backdrop-blur-2xl";

const TICKER_ITEMS = [
  "حجم کل معاملات موفق: ۲.۴ میلیارد دلار",
  "بیش از ۸۵۰ معامله موفق",
  "۱۰۰٪ رضایت خریداران",
  "میانگین زمان فروش: ۱۴ روز",
  "۰٪ پرونده حقوقی / مناقشه",
];

const FILTERS: { id: DealCategory; label: string }[] = [
  { id: "all", label: "همه معاملات" },
  { id: "penthouse", label: "پنت‌هاوس و برج‌ها" },
  { id: "villa", label: "ویلایی و مستغلات" },
  { id: "commercial", label: "املاک اداری/تجاری" },
  { id: "diplomatic", label: "معاملات دیپلماتیک" },
];

const DEALS = [
  {
    id: "fershteh-duplex",
    category: "penthouse" as DealCategory,
    title: "پنت‌هاوس دوبلکس ۸۰۰ متری فرشته",
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=80",
    details: ["۶ خواب", "استخر اختصاصی", "معامله‌شده در ۱۴۰۲"],
    location: "فرشته",
    valueLabel: "پرونده فوق‌سنگین",
  },
  {
    id: "niavaran-tower",
    category: "penthouse" as DealCategory,
    title: "برج‌باغ لوکس ۱۲ طبقه نیاوران",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80",
    details: ["۳۵۰ متر", "تراس گاردن", "معامله‌شده در ۱۴۰۲"],
    location: "نیاوران",
    valueLabel: "برج‌باغ خصوصی",
  },
  {
    id: "lavasan-villa",
    category: "villa" as DealCategory,
    title: "ویلای مدرن ۱۰۰۰ متری لواسان",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=80",
    details: ["فرنیش کامل", "دید ۳۶۰ درجه", "معامله‌شده در ۱۴۰۳"],
    location: "لواسان",
    valueLabel: "ویلای کلیدآماده",
  },
  {
    id: "elahieh-commercial",
    category: "commercial" as DealCategory,
    title: "مجتمع تجاری اداری الهیه",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=80",
    details: ["۲۰ واحد تجاری", "معامله یکجا", "معامله‌شده در ۱۴۰۳"],
    location: "الهیه",
    valueLabel: "پکیج سرمایه‌گذاری",
  },
  {
    id: "zaferanieh-minimal",
    category: "penthouse" as DealCategory,
    title: "پنت‌هاوس مینیمال ۴۵۰ متری زعفرانیه",
    image:
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1400&q=80",
    details: ["پاگرد اختصاصی", "۴ پارکینگ", "معامله‌شده در ۱۴۰۳"],
    location: "زعفرانیه",
    valueLabel: "مینیمال لوکس",
  },
  {
    id: "mahmoudieh-mansion",
    category: "diplomatic" as DealCategory,
    title: "عمارت کلاسیک ۵۰۰ متری محمودیه",
    image:
      "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1400&q=80",
    details: ["معماری اصیل", "حیاط مشجر", "معامله‌شده در ۱۴۰۳"],
    location: "محمودیه",
    valueLabel: "عمارت دیپلماتیک",
  },
] as const;

const TIMELINE = [
  {
    year: "۱۴۰۱",
    title: "افتتاح مسیر معاملات محرمانه VIP",
    body: "راه‌اندازی پروتکل انتقال خصوصی برای پرونده‌های بالای سقف عمومی بازار.",
  },
  {
    year: "۱۴۰۲",
    title: "رکورد گران‌ترین پنت‌هاوس فرشته",
    body: "بستن معامله دوبلکس ۸۰۰ متری با کارشناسی کامل سند و تحویل بدون حاشیه.",
  },
  {
    year: "۱۴۰۲",
    title: "پورتفوی برج‌باغ نیاوران",
    body: "انتقال مالکیت واحدهای منتخب برج‌باغ با ساختار حقوقی چندلایه.",
  },
  {
    year: "۱۴۰۳",
    title: "معامله یکجای مجتمع الهیه",
    body: "خرید یکجای ۲۰ واحد تجاری برای سرمایه‌گذار نهادی در کمتر از سه هفته.",
  },
  {
    year: "۱۴۰۳",
    title: "پرونده‌های دیپلماتیک محمودیه",
    body: "تکمیل عمارت کلاسیک با قرارداد دوزبانه و محرمانگی کامل هویت طرفین.",
  },
] as const;

const METRICS = [
  { icon: Clock3, value: "۱۴ روز", label: "میانگین زمان فروش" },
  { icon: FileCheck2, value: "۱۰۰٪", label: "اصالت سند و کارشناسی" },
  { icon: Trophy, value: "۸۵۰+", label: "معامله موفق" },
  { icon: Scale, value: "۰٪", label: "پرونده حقوقی / مناقشه" },
] as const;

const TESTIMONIALS = [
  {
    quote:
      "سرعت بستن معامله شگفت‌انگیز بود؛ بدون افشای هویت و با دقت حقوقی کامل.",
    name: "مالک پنت‌هاوس فرشته",
    role: "فروشنده · پرونده ۱۴۰۲",
  },
  {
    quote:
      "برای خرید ویلای لواسان همه چیز محرمانه و حرفه‌ای پیش رفت؛ از کارشناسی تا انتقال سند.",
    name: "خریدار بین‌المللی",
    role: "خریدار · پرونده ۱۴۰۳",
  },
  {
    quote:
      "معامله یکجای مجتمع اداری را در زمانی بستیم که بازار هنوز در حال مذاکره بود.",
    name: "مدیر سرمایه‌گذاری",
    role: "خریدار نهادی · الهیه",
  },
] as const;

function AmbientOrbs({ reduceMotion }: { reduceMotion: boolean | null }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute -right-24 -top-10 h-[26rem] w-[26rem] rounded-full bg-[#00F0FF]/20 blur-3xl"
        animate={
          reduceMotion
            ? undefined
            : { x: [0, 30, -18, 0], y: [0, 24, -12, 0], scale: [1, 1.08, 0.96, 1] }
        }
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-[-7rem] top-[28%] h-[30rem] w-[30rem] rounded-full bg-sky-400/15 blur-3xl"
        animate={
          reduceMotion
            ? undefined
            : { x: [0, -28, 16, 0], y: [0, 34, 10, 0], scale: [1, 0.94, 1.06, 1] }
        }
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

function Ticker() {
  const loop = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="relative overflow-hidden border-b border-sky-400/20 bg-[#0B132B] text-sky-100">
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#0B132B] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#0B132B] to-transparent" />
      <motion.div
        className="flex w-max gap-10 whitespace-nowrap py-3 text-xs font-semibold tracking-wide md:text-sm"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 28, ease: "linear", repeat: Infinity }}
      >
        {loop.map((item, index) => (
          <span key={`${item}-${index}`} className="inline-flex items-center gap-3">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#00F0FF] shadow-[0_0_12px_#00F0FF]" />
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export function LuxuryDoneDealsView() {
  const reduceMotion = useReducedMotion();
  const [filter, setFilter] = useState<DealCategory>("all");

  const filteredDeals = useMemo(() => {
    if (filter === "all") return DEALS;
    return DEALS.filter((deal) => deal.category === filter);
  }, [filter]);

  return (
    <div
      dir="rtl"
      className="relative min-h-screen overflow-hidden bg-[#F8FAFC] font-vazirmatn text-[#0B132B]"
    >
      <AmbientOrbs reduceMotion={reduceMotion} />
      <Ticker />

      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=80"
            alt="نمای معماری معاملات موفق"
            fill
            priority
            className="object-cover scale-105"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B132B] via-[#0B132B]/75 to-[#0B132B]/35" />
          <div className="absolute inset-0 bg-gradient-to-l from-sky-500/15 via-transparent to-[#00F0FF]/10" />
        </div>

        <div className="rio-container relative z-10 flex min-h-[78vh] flex-col justify-end pb-20 pt-32 md:pb-28 md:pt-40">
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: {
                transition: { staggerChildren: reduceMotion ? 0 : 0.12 },
              },
            }}
            className="max-w-4xl"
          >
            <motion.div
              variants={fadeUp}
              transition={spring}
              className="mb-7 inline-flex items-center gap-2 rounded-full border border-sky-300/30 bg-white/10 px-4 py-2 text-sm text-sky-100 backdrop-blur-2xl"
            >
              <Trophy className="h-4 w-4 text-[#00F0FF]" />
              ثبت رکورد گران‌ترین پنت‌هاوس معامله‌شده سال
            </motion.div>

            <motion.h1
              variants={fadeUp}
              transition={spring}
              className="text-4xl font-black leading-[1.15] tracking-tight text-white md:text-6xl lg:text-7xl"
            >
              کارنامه درخشان؛ گزیده‌ای از برترین معاملات انجام‌شده
            </motion.h1>

            <motion.p
              variants={fadeUp}
              transition={spring}
              className="mt-6 max-w-2xl text-base leading-8 tracking-wide text-sky-50/85 md:text-lg"
            >
              پرونده‌هایی که با محرمانگی کامل، سرعت بالا و استاندارد حقوقی سخت‌گیرانه
              به نتیجه رسیده‌اند — از پنت‌هاوس‌های فرشته تا پورتفوی‌های تجاری الهیه.
            </motion.p>

            <motion.div
              variants={fadeUp}
              transition={spring}
              className="mt-10 flex flex-wrap gap-3"
            >
              <motion.a
                href="#portfolio"
                whileHover={reduceMotion ? undefined : { y: -4, scale: 1.02 }}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-l from-sky-500 to-[#00F0FF] px-7 py-3.5 text-sm font-bold text-[#0B132B] shadow-[0_20px_50px_-20px_rgba(0,240,255,0.75)]"
              >
                <Sparkles className="h-4 w-4" />
                مشاهده پرونده‌ها
              </motion.a>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-7 py-3.5 text-sm font-bold text-white backdrop-blur-2xl transition hover:bg-white/20"
              >
                مشاوره فروش محرمانه
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <div className="rio-container relative z-10 space-y-24 py-20 md:space-y-32 md:py-28">
        {/* Filters */}
        <section>
          <div className="mb-8 max-w-2xl">
            <p className="text-sm font-semibold tracking-[0.2em] text-sky-500">
              فیلتر هوشمند
            </p>
            <h2 className="mt-3 text-3xl font-black text-[#0B132B] md:text-4xl">
              انتخاب دسته معامله
            </h2>
          </div>

          <div className="flex flex-wrap gap-2 rounded-[1.75rem] border border-sky-100/60 bg-white/50 p-2 backdrop-blur-2xl">
            {FILTERS.map((item) => {
              const active = filter === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setFilter(item.id)}
                  className={`relative rounded-full px-4 py-2.5 text-sm font-bold transition ${
                    active
                      ? "text-[#0B132B]"
                      : "text-slate-600 hover:text-[#0B132B]"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="dealFilter"
                      className="absolute inset-0 rounded-full bg-gradient-to-l from-sky-300 to-[#00F0FF] shadow-lg shadow-sky-300/40"
                      transition={spring}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Portfolio grid */}
        <section id="portfolio">
          <motion.div
            layout
            className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {filteredDeals.map((deal, index) => (
                <motion.article
                  key={deal.id}
                  layout
                  initial={reduceMotion ? false : { opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, scale: 0.96 }}
                  transition={{ ...spring, delay: reduceMotion ? 0 : index * 0.05 }}
                  whileHover={
                    reduceMotion ? undefined : { y: -8, scale: 1.02 }
                  }
                  className={`${glass} group overflow-hidden`}
                >
                  <div className="relative h-56 overflow-hidden md:h-64">
                    <Image
                      src={deal.image}
                      alt={deal.title}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B132B]/85 via-[#0B132B]/20 to-transparent" />
                    <div className="absolute left-4 top-4 rounded-full border border-sky-100/40 bg-white/15 px-3 py-1.5 text-[11px] font-bold text-white backdrop-blur-2xl">
                      {deal.location}
                    </div>
                    <div className="absolute inset-x-0 bottom-0 translate-y-3 p-5 opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                      <span className="inline-flex items-center gap-2 rounded-full border border-sky-100/40 bg-white/20 px-4 py-2 text-xs font-bold text-white backdrop-blur-2xl">
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#00F0FF]" />
                        تکمیل موفقیت‌آمیز معامله
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4 p-6">
                    <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-[11px] font-bold text-sky-600">
                      <BadgeCheck className="h-3.5 w-3.5" />
                      {deal.valueLabel}
                    </div>
                    <h3 className="text-xl font-black leading-8 text-[#0B132B]">
                      {deal.title}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {deal.details.map((detail) => (
                        <span
                          key={detail}
                          className="rounded-full border border-sky-100 bg-white/80 px-3 py-1 text-xs font-semibold text-slate-600"
                        >
                          {detail}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        </section>

        {/* Timeline */}
        <section>
          <div className="mb-12 max-w-2xl">
            <p className="inline-flex items-center gap-2 text-sm font-semibold tracking-[0.18em] text-sky-500">
              <CalendarDays className="h-4 w-4" />
              تایم‌لاین بزرگ‌ترین رکوردها
            </p>
            <h2 className="mt-3 text-3xl font-black text-[#0B132B] md:text-5xl">
              نقاط عطف معاملات محرمانه
            </h2>
          </div>

          <div className="relative space-y-6 border-r-2 border-sky-200 pr-6 md:pr-10">
            {TIMELINE.map((item, index) => (
              <motion.div
                key={`${item.year}-${item.title}`}
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ ...spring, delay: reduceMotion ? 0 : index * 0.06 }}
                className={`${glass} relative p-6`}
              >
                <span className="absolute -right-[2.05rem] top-8 flex h-5 w-5 items-center justify-center rounded-full bg-[#0B132B] ring-4 ring-[#F8FAFC] md:-right-[2.55rem]">
                  <span className="h-2 w-2 rounded-full bg-[#00F0FF] shadow-[0_0_12px_#00F0FF]" />
                </span>
                <p className="text-sm font-black text-sky-500">{item.year}</p>
                <h3 className="mt-2 text-xl font-black text-[#0B132B]">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.body}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      {/* Metrics */}
      <section className="relative overflow-hidden bg-[#0B132B] py-20 md:py-28">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/4 top-0 h-64 w-64 rounded-full bg-[#00F0FF]/15 blur-3xl" />
          <div className="absolute bottom-0 right-1/5 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />
        </div>
        <div className="rio-container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={spring}
            className="mb-12 max-w-2xl"
          >
            <p className="text-sm font-semibold tracking-[0.2em] text-[#00F0FF]">
              شاخص عملکرد
            </p>
            <h2 className="mt-3 text-3xl font-black text-white md:text-5xl">
              اعدادی که اعتماد می‌سازند
            </h2>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {METRICS.map((metric) => {
              const Icon = metric.icon;
              return (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={spring}
                  whileHover={
                    reduceMotion ? undefined : { y: -6, scale: 1.02 }
                  }
                  className="rounded-[1.75rem] border border-sky-400/25 bg-white/5 p-6 text-center backdrop-blur-2xl"
                >
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#00F0FF]/10 text-[#00F0FF]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="text-3xl font-black text-[#00F0FF]">
                    {metric.value}
                  </p>
                  <p className="mt-2 text-sm text-sky-100/80">{metric.label}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="rio-container relative z-10 space-y-24 py-20 md:space-y-32 md:py-28">
        {/* Testimonials */}
        <section>
          <div className="mb-10 max-w-2xl">
            <p className="text-sm font-semibold tracking-[0.18em] text-sky-500">
              روایت اعتماد
            </p>
            <h2 className="mt-3 text-3xl font-black text-[#0B132B] md:text-4xl">
              خریداران و فروشندگان درباره سرعت و محرمانگی
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {TESTIMONIALS.map((item, index) => (
              <motion.blockquote
                key={item.name}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.25 }}
                transition={{ ...spring, delay: reduceMotion ? 0 : index * 0.06 }}
                whileHover={
                  reduceMotion ? undefined : { y: -6, scale: 1.02 }
                }
                className={`${glass} p-6`}
              >
                <Quote className="mb-4 h-5 w-5 text-sky-500" />
                <p className="text-sm leading-8 text-slate-700">«{item.quote}»</p>
                <footer className="mt-6">
                  <p className="font-black text-[#0B132B]">{item.name}</p>
                  <p className="text-xs text-sky-600">{item.role}</p>
                </footer>
              </motion.blockquote>
            ))}
          </div>
        </section>

        {/* CTA */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={spring}
          className="relative overflow-hidden rounded-[2.5rem] border border-sky-300/40 bg-[#0B132B] px-6 py-14 text-center shadow-[0_0_80px_-30px_rgba(0,240,255,0.55)] md:px-12 md:py-20"
        >
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-0 h-56 w-56 -translate-x-1/2 rounded-full bg-[#00F0FF]/25 blur-3xl" />
            <div className="absolute bottom-0 right-10 h-40 w-40 rounded-full bg-sky-500/20 blur-3xl" />
          </div>
          <div className="relative z-10 mx-auto max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-[#00F0FF]/30 bg-white/5 px-4 py-2 text-sm text-[#00F0FF] backdrop-blur-xl">
              <Landmark className="h-4 w-4" />
              مسیر فروش محرمانه و پرسرعت
            </p>
            <h2 className="mt-6 text-3xl font-black text-white md:text-5xl">
              شما هم می‌خواهید ملک خود را به بهترین قیمت معامله کنید؟
            </h2>
            <p className="mt-4 text-sm leading-8 text-sky-100/80 md:text-base">
              پرونده فروش یا خرید خود را به تیم معاملات ویژه بسپارید — با همان
              استانداردی که ۸۵۰+ معامله موفق را بسته است.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-l from-sky-400 to-[#00F0FF] px-7 py-3.5 text-sm font-bold text-[#0B132B] shadow-[0_20px_50px_-18px_rgba(0,240,255,0.85)]"
              >
                شروع پرونده معامله
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <a
                href={`tel:${SITE.phone.replace(/\s/g, "")}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-7 py-3.5 text-sm font-bold text-white backdrop-blur-xl"
              >
                <Building2 className="h-4 w-4" />
                تماس مستقیم: {SITE.phone}
              </a>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
