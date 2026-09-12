"use client";

import Image from "next/image";
import Link from "next/link";
import {
  MouseEvent,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
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

const spring = { type: "spring" as const, stiffness: 80, damping: 18 };

const fadeUp = {
  hidden: { opacity: 0, y: 48 },
  show: { opacity: 1, y: 0 },
};

const glass =
  "rounded-[2rem] border border-sky-100/60 bg-white/60 shadow-2xl shadow-sky-500/5 backdrop-blur-2xl";

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
    title: "دپارتمان درخشان",
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80",
    details: ["۶ خواب", "استخر اختصاصی", "معامله‌شده در ۱۴۰۲"],
    location: "مشکین دشت خیابان هدایتکار جنب فروشگاه افق کوروش",
    valueLabel: "Luxury Penthouse",
  },
  {
    id: "niavaran-tower",
    category: "penthouse" as DealCategory,
    title: "دپارتمان درخشان",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
    details: ["۳۵۰ متر", "تراس گاردن", "معامله‌شده در ۱۴۰۲"],
    location: "مشکین دشت خیابان هدایتکار جنب فروشگاه افق کوروش",
    valueLabel: "Modern Glass Tower",
  },
  {
    id: "lavasan-villa",
    category: "villa" as DealCategory,
    title: "دپارتمان درخشان",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80",
    details: ["فرنیش کامل", "دید ۳۶۰ درجه", "معامله‌شده در ۱۴۰۳"],
    location: "مشکین دشت خیابان هدایتکار جنب فروشگاه افق کوروش",
    valueLabel: "Forest Villa Architecture",
  },
  {
    id: "elahieh-commercial",
    category: "commercial" as DealCategory,
    title: "دپارتمان درخشان",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80",
    details: ["۲۰ واحد تجاری", "معامله یکجا", "معامله‌شده در ۱۴۰۳"],
    location: "مشکین دشت خیابان هدایتکار جنب فروشگاه افق کوروش",
    valueLabel: "Executive Commercial Complex",
  },
  {
    id: "zaferanieh-minimal",
    category: "penthouse" as DealCategory,
    title: "دپارتمان درخشان",
    image:
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1600&q=80",
    details: ["پاگرد اختصاصی", "۴ پارکینگ", "معامله‌شده در ۱۴۰۳"],
    location: "مشکین دشت خیابان هدایتکار جنب فروشگاه افق کوروش",
    valueLabel: "Minimalist Interior Lounge",
  },
  {
    id: "mahmoudieh-mansion",
    category: "diplomatic" as DealCategory,
    title: "دپارتمان درخشان",
    image:
      "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1600&q=80",
    details: ["معماری اصیل", "حیاط مشجر", "معامله‌شده در ۱۴۰۳"],
    location: "مشکین دشت خیابان هدایتکار جنب فروشگاه افق کوروش",
    valueLabel: "Classical Estate",
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
    title: "دپارتمان درخشان",
    body: "بستن معامله دوبلکس ۸۰۰ متری با کارشناسی کامل سند و تحویل بدون حاشیه.",
  },
  {
    year: "۱۴۰۲",
    title: "دپارتمان درخشان",
    body: "انتقال مالکیت واحدهای منتخب برج‌باغ با ساختار حقوقی چندلایه.",
  },
  {
    year: "۱۴۰۳",
    title: "دپارتمان درخشان",
    body: "خرید یکجای ۲۰ واحد تجاری برای سرمایه‌گذار نهادی در کمتر از سه هفته.",
  },
  {
    year: "۱۴۰۳",
    title: "دپارتمان درخشان",
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
    name: "مالک دپارتمان درخشان",
    role: "فروشنده · پرونده ۱۴۰۲",
  },
  {
    quote:
      "برای خرید دپارتمان درخشان همه چیز محرمانه و حرفه‌ای پیش رفت؛ از کارشناسی تا انتقال سند.",
    name: "خریدار بین‌المللی",
    role: "خریدار · پرونده ۱۴۰۳",
  },
  {
    quote:
      "معامله یکجای مجتمع اداری را در زمانی بستیم که بازار هنوز در حال مذاکره بود.",
    name: "مدیر سرمایه‌گذاری",
    role: "خریدار نهادی · مشکین دشت",
  },
] as const;

function AmbientLights({ reduceMotion }: { reduceMotion: boolean | null }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute -right-24 top-10 h-[28rem] w-[28rem] rounded-full bg-[#00F0FF]/18 blur-3xl"
        animate={
          reduceMotion
            ? undefined
            : {
                x: [0, 40, -20, 0],
                y: [0, 30, -15, 0],
                scale: [1, 1.12, 0.94, 1],
              }
        }
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -left-28 top-[35%] h-[32rem] w-[32rem] rounded-full bg-sky-400/14 blur-3xl"
        animate={
          reduceMotion
            ? undefined
            : {
                x: [0, -35, 22, 0],
                y: [0, 40, 8, 0],
                scale: [1, 0.92, 1.08, 1],
              }
        }
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[12%] right-[22%] h-72 w-72 rounded-full bg-blue-500/10 blur-3xl"
        animate={
          reduceMotion
            ? undefined
            : { opacity: [0.35, 0.75, 0.35], scale: [1, 1.15, 1] }
        }
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

function ParallaxHero({ reduceMotion }: { reduceMotion: boolean | null }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const midY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0.15]);
  const glowScale = useTransform(scrollYProgress, [0, 1], [1, 1.35]);

  return (
    <section ref={ref} className="relative isolate min-h-[92vh] overflow-hidden">
      <motion.div style={{ y: bgY }} className="absolute inset-0 scale-110">
        <Image
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2200&q=80"
          alt="پوشش معماری معاملات موفق"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      </motion.div>

      <motion.div
        style={{ y: midY }}
        className="absolute inset-0 bg-gradient-to-t from-[#0B132B] via-[#0B132B]/70 to-[#0B132B]/25"
      />
      <motion.div
        style={{ scale: glowScale }}
        className="absolute -left-20 top-24 h-80 w-80 rounded-full bg-[#00F0FF]/25 blur-3xl"
      />
      <div className="absolute inset-0 bg-gradient-to-l from-sky-500/20 via-transparent to-[#00F0FF]/10" />

      <motion.div
        style={
          reduceMotion
            ? undefined
            : { y: contentY, opacity: contentOpacity }
        }
        className="rio-container relative z-10 flex min-h-[92vh] flex-col justify-end pb-20 pt-36 md:pb-28 md:pt-44"
      >
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
            className="text-4xl font-black leading-[1.12] tracking-tight text-white md:text-6xl lg:text-7xl"
          >
            کارنامه درخشان؛ گزیده‌ای از برترین معاملات انجام‌شده
          </motion.h1>

          <motion.p
            variants={fadeUp}
            transition={spring}
            className="mt-6 max-w-2xl text-base leading-8 tracking-wide text-sky-50/85 md:text-lg"
          >
            تجربه‌ای سینمایی از پرونده‌های بسته‌شده؛ با عمق بصری پارالاکس،
            محرمانگی کامل و استاندارد حقوقی سخت‌گیرانه.
          </motion.p>

          <motion.div
            variants={fadeUp}
            transition={spring}
            className="mt-10 flex flex-wrap gap-3"
          >
            <motion.a
              href="#portfolio"
              whileHover={reduceMotion ? undefined : { y: -4, scale: 1.03 }}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-l from-sky-500 to-[#00F0FF] px-7 py-3.5 text-sm font-bold text-[#0B132B] shadow-[0_20px_50px_-18px_rgba(0,240,255,0.8)]"
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
      </motion.div>
    </section>
  );
}

function TiltDealCard({
  deal,
  index,
  reduceMotion,
}: {
  deal: (typeof DEALS)[number];
  index: number;
  reduceMotion: boolean | null;
}) {
  const cardRef = useRef<HTMLElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 180, damping: 18 });
  const springY = useSpring(rotateY, { stiffness: 180, damping: 18 });
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);
  const glare = useMotionTemplate`radial-gradient(420px circle at ${glareX}% ${glareY}%, rgba(0,240,255,0.28), transparent 55%)`;

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });
  const imageScale = useTransform(scrollYProgress, [0, 0.45, 1], [0.9, 1.05, 0.96]);
  const imageY = useTransform(scrollYProgress, [0, 1], [28, -28]);

  function onMove(event: MouseEvent<HTMLElement>) {
    if (reduceMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    rotateX.set((0.5 - py) * 12);
    rotateY.set((px - 0.5) * 14);
    glareX.set(px * 100);
    glareY.set(py * 100);
  }

  function onLeave() {
    rotateX.set(0);
    rotateY.set(0);
    glareX.set(50);
    glareY.set(50);
  }

  return (
    <motion.article
      ref={cardRef}
      layout
      initial={reduceMotion ? false : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      exit={reduceMotion ? undefined : { opacity: 0, scale: 0.96 }}
      transition={{ ...spring, delay: reduceMotion ? 0 : index * 0.05 }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        rotateX: reduceMotion ? 0 : springX,
        rotateY: reduceMotion ? 0 : springY,
        transformPerspective: 1100,
      }}
      className={`${glass} group relative overflow-hidden will-change-transform`}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20 opacity-0 transition duration-300 group-hover:opacity-100"
        style={{ background: glare }}
      />

      <div className="relative h-60 overflow-hidden md:h-72">
        <motion.div
          style={
            reduceMotion
              ? undefined
              : { scale: imageScale, y: imageY }
          }
          className="absolute inset-0"
        >
          <Image
            src={deal.image}
            alt={deal.title}
            fill
            className="object-cover transition duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B132B]/90 via-[#0B132B]/25 to-transparent" />
        <div className="absolute left-4 top-4 rounded-full border border-sky-100/40 bg-white/15 px-3 py-1.5 text-[11px] font-bold text-white backdrop-blur-2xl">
          {deal.location}
        </div>
        <div className="absolute inset-x-0 bottom-0 translate-y-4 p-5 opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <div className="rounded-2xl border border-sky-100/40 bg-white/15 p-4 backdrop-blur-2xl">
            <p className="inline-flex items-center gap-2 text-xs font-bold text-[#00F0FF]">
              <CheckCircle2 className="h-3.5 w-3.5" />
              تکمیل موفقیت‌آمیز معامله
            </p>
            <p className="mt-2 text-sm font-semibold text-white">
              {deal.valueLabel}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {deal.details.map((detail) => (
                <span
                  key={detail}
                  className="rounded-full bg-white/15 px-2.5 py-1 text-[11px] text-sky-50"
                >
                  {detail}
                </span>
              ))}
            </div>
          </div>
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
      <AmbientLights reduceMotion={reduceMotion} />
      <ParallaxHero reduceMotion={reduceMotion} />

      <div className="rio-container relative z-10 space-y-24 py-20 md:space-y-32 md:py-28">
        {/* Filters */}
        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.25 }}
          variants={{
            hidden: {},
            show: {
              transition: { staggerChildren: reduceMotion ? 0 : 0.08 },
            },
          }}
        >
          <motion.div variants={fadeUp} transition={spring} className="mb-8 max-w-2xl">
            <p className="text-sm font-semibold tracking-[0.2em] text-sky-500">
              فیلتر هوشمند
            </p>
            <h2 className="mt-3 text-3xl font-black text-[#0B132B] md:text-4xl">
              انتخاب دسته معامله
            </h2>
          </motion.div>

          <motion.div
            variants={fadeUp}
            transition={spring}
            className="flex flex-wrap gap-2 rounded-[1.75rem] border border-sky-100/60 bg-white/50 p-2 backdrop-blur-2xl"
          >
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
          </motion.div>
        </motion.section>

        {/* Portfolio */}
        <section id="portfolio">
          <motion.div
            layout
            className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
            style={{ perspective: 1400 }}
          >
            <AnimatePresence mode="popLayout">
              {filteredDeals.map((deal, index) => (
                <TiltDealCard
                  key={deal.id}
                  deal={deal}
                  index={index}
                  reduceMotion={reduceMotion}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        </section>

        {/* Timeline */}
        <motion.section
          initial={{ opacity: 0, y: 48 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={spring}
        >
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
                initial={{ opacity: 0, x: 28 }}
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
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {item.body}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>

      {/* Metrics */}
      <section className="relative overflow-hidden bg-slate-950 py-20 md:py-28">
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
            {METRICS.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{
                    ...spring,
                    delay: reduceMotion ? 0 : index * 0.06,
                  }}
                  whileHover={
                    reduceMotion ? undefined : { y: -8, scale: 1.03 }
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
        <section>
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.25 }}
            transition={spring}
            className="mb-10 max-w-2xl"
          >
            <p className="text-sm font-semibold tracking-[0.18em] text-sky-500">
              روایت اعتماد
            </p>
            <h2 className="mt-3 text-3xl font-black text-[#0B132B] md:text-4xl">
              خریداران و فروشندگان درباره سرعت و محرمانگی
            </h2>
          </motion.div>

          <div className="grid gap-5 md:grid-cols-3">
            {TESTIMONIALS.map((item, index) => (
              <motion.blockquote
                key={item.name}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.25 }}
                transition={{
                  ...spring,
                  delay: reduceMotion ? 0 : index * 0.06,
                }}
                whileHover={
                  reduceMotion ? undefined : { y: -8, scale: 1.02 }
                }
                className={`${glass} p-6`}
              >
                <Quote className="mb-4 h-5 w-5 text-sky-500" />
                <p className="text-sm leading-8 text-slate-700">
                  «{item.quote}»
                </p>
                <footer className="mt-6">
                  <p className="font-black text-[#0B132B]">{item.name}</p>
                  <p className="text-xs text-sky-600">{item.role}</p>
                </footer>
              </motion.blockquote>
            ))}
          </div>
        </section>

        <motion.section
          initial={{ opacity: 0, y: 48 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={spring}
          className="relative overflow-hidden rounded-[2.5rem] border border-sky-300/40 bg-slate-950 px-6 py-14 text-center shadow-[0_0_80px_-30px_rgba(0,240,255,0.55)] md:px-12 md:py-20"
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
