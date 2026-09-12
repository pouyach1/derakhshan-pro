"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  Calculator,
  CalendarCheck2,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileSearch,
  Gavel,
  KeyRound,
  Paintbrush,
  Phone,
  Scale,
  ShieldCheck,
  Sparkles,
  Workflow,
  X,
} from "lucide-react";
import { SITE } from "@/config/site";

const spring = { type: "spring" as const, stiffness: 90, damping: 20 };

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0 },
};

const glass =
  "rounded-[2rem] border border-sky-100/60 bg-white/50 shadow-xl shadow-sky-500/5 backdrop-blur-2xl";

const SERVICES = [
  {
    id: "sales",
    title: "خرید و فروش پنت‌هاوس و برج‌های ساختمانی",
    summary:
      "معاملات فاخر در نوار شمالی تهران با دسترسی خصوصی به فایل‌های محدود و مذاکره سطح مدیریتی.",
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=80",
    icon: Building2,
    features: [
      "بانک فایل اختصاصی پنت‌هاوس و اسکای‌ویو",
      "تحلیل مقایسه‌ای قیمت و نقدشوندگی",
      "هماهنگی بازدید خصوصی خارج از ساعات عمومی",
    ],
  },
  {
    id: "lease",
    title: "رهن و اجاره اختصاصی دیپلماتیک و VIP",
    summary:
      "اجاره و رهن برای سفارت‌ها، مدیران ارشد و خانواده‌های خاص با بررسی اعتبار و قرارداد امن.",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
    icon: KeyRound,
    features: [
      "غربالگری مستأجر و تضمین اعتبار",
      "قرارداد دو زبانه برای پرونده‌های بین‌المللی",
      "مدیریت تحویل و صورت‌جلسه دارایی‌ها",
    ],
  },
  {
    id: "invest",
    title: "مدیریت سرمایه‌گذاری و تهاتر املاک کلان",
    summary:
      "طراحی پرتفوی ملکی، تهاتر دارایی‌های بزرگ و سناریوهای خروج با نگاه سرمایه‌گذاری نهادی.",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    icon: BriefcaseBusiness,
    features: [
      "مدل‌سازی بازده و ریسک نقدینگی",
      "تهاتر ملک با ملک / ملک با پروژه",
      "گزارش تصمیم‌گیری برای هیئت سرمایه‌گذاری",
    ],
  },
  {
    id: "legal",
    title: "مشاوره حقوقی تخصصی و استعلامات ثبتی",
    summary:
      "بررسی سند، بازداشت، رهن و تعارضات ثبتی پیش از هر تعهد مالی برای حذف ریسک حقوقی پنهان.",
    image:
      "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80",
    icon: Scale,
    features: [
      "استعلام ثبت و وضعیت مالکیت",
      "بازبینی بندهای قرارداد پیش از امضا",
      "همراهی تا تنظیم سند رسمی",
    ],
  },
  {
    id: "appraisal",
    title: "ارزیابی و کارشناسی دقیق قیمت (هوشمند)",
    summary:
      "قیمت‌گذاری مبتنی بر معاملات اخیر، کیفیت ساخت، موقعیت و ظرفیت سرمایه‌ای ملک.",
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80",
    icon: FileSearch,
    features: [
      "گزارش کارشناسی ۴۸ ساعته",
      "تحلیل حساسیت قیمت و زمان فروش",
      "پیشنهاد استراتژی مذاکره",
    ],
  },
  {
    id: "design",
    title: "بازسازی لوکس و دیزاین اختصاصی ملک",
    summary:
      "ارتقای ارزش ملک با طراحی داخلی سطح بالا، مدیریت پیمان و نظارت زیبایی‌شناختی.",
    image:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80",
    icon: Paintbrush,
    features: [
      "کانسپت معماری داخلی اختصاصی",
      "بودجه‌بندی شفاف و کنترل هزینه",
      "تحویل کلیدآماده با استاندارد VIP",
    ],
  },
] as const;

const STEPS = [
  {
    title: "مشاوره و نیازسنجی اولیه",
    body: "جلسه کشف اهداف، بودجه، افق زمانی و ترجیحات سبک زندگی یا سرمایه‌گذاری.",
    icon: Sparkles,
  },
  {
    title: "کارشناسی فنی و حقوقی",
    body: "بازدید تخصصی، ارزیابی قیمت و استعلامات ثبتی پیش از هر پیشنهاد جدی.",
    icon: FileSearch,
  },
  {
    title: "برگزاری نشست VIP",
    body: "نشست خصوصی مذاکره، تطبیق پیشنهادات و تصمیم‌گیری در فضای اختصاصی دفتر.",
    icon: CalendarCheck2,
  },
  {
    title: "پشتیبانی و انتقال سند",
    body: "هماهنگی محضر، انتقال امن مالکیت و پیگیری پس از معامله تا تحویل نهایی.",
    icon: ShieldCheck,
  },
] as const;

const COMPARISON = [
  {
    feature: "دسترسی به فایل‌های محدود و آف‌مارکت",
    standard: false,
    vip: true,
  },
  {
    feature: "پشتیبانی حقوقی ۲۴/۷ در معاملات فعال",
    standard: false,
    vip: true,
  },
  {
    feature: "تضمین قرارداد بدون ریسک بندهای مبهم",
    standard: false,
    vip: true,
  },
  {
    feature: "لانژ خصوصی برای امضا و انتقال",
    standard: false,
    vip: true,
  },
  {
    feature: "گزارش کارشناسی ظرف ۴۸ ساعت",
    standard: "محدود",
    vip: true,
  },
  {
    feature: "مدیر اختصاصی پرونده تا پایان معامله",
    standard: false,
    vip: true,
  },
  {
    feature: "بازدید عمومی در ساعات اداری",
    standard: true,
    vip: true,
  },
] as const;

const CALCULATOR_SERVICES = [
  { id: "sales", label: "خرید / فروش", rate: 0.015 },
  { id: "lease", label: "رهن و اجاره VIP", rate: 0.01 },
  { id: "appraisal", label: "کارشناسی قیمت", rate: 0.004 },
  { id: "legal", label: "مشاوره حقوقی", rate: 0.006 },
  { id: "invest", label: "سرمایه‌گذاری / تهاتر", rate: 0.012 },
  { id: "design", label: "بازسازی لوکس", rate: 0.08 },
] as const;

const TESTIMONIALS = [
  {
    quote:
      "از نیازسنجی تا انتقال سند، همه چیز مثل یک پروتکل خصوصی پیش رفت؛ بدون هیاهوی بازار و با دقت حقوقی کامل.",
    name: "آریا ک.",
    role: "سرمایه‌گذار پنت‌هاوس · فرشته",
  },
  {
    quote:
      "برای اجاره دیپلماتیک به قرارداد دو زبانه و غربالگری اعتبار نیاز داشتیم. تیم درخشان دقیق و محرمانه عمل کرد.",
    name: "سارا م.",
    role: "مدیر روابط بین‌الملل",
  },
  {
    quote:
      "گزارش کارشناسی‌شان مبنای مذاکره ما شد؛ اختلاف قیمت را با داده بستیم، نه حدس.",
    name: "نیما ر.",
    role: "خانواده مالک · نیاوران",
  },
] as const;

const FAQS = [
  {
    q: "ضمانت خدمات و پیگیری پس از معامله چگونه است؟",
    a: "تا تحویل نهایی و رفع نواقص قراردادی همراه شما می‌مانیم. برای پرونده‌های VIP پشتیبانی حقوقی پس از امضا نیز فعال می‌ماند.",
  },
  {
    q: "مسئولیت حقوقی قراردادها با چه کسی است؟",
    a: "تیم حقوقی داخلی پیش‌نویس و بندها را بررسی می‌کند؛ مسئولیت امضا با طرفین است، اما هیچ بندی بدون تأیید شفافیت حقوقی پیش نمی‌رود.",
  },
  {
    q: "پروتکل محرمانگی اطلاعات چگونه اجرا می‌شود؟",
    a: "پرونده‌ها فقط در دسترس تیم اختصاصی معامله است. هویت، آدرس و جزئیات مالی بدون مجوز کتبی شما منتشر نمی‌شود.",
  },
  {
    q: "آیا امکان دریافت چند خدمت به‌صورت یکپارچه وجود دارد؟",
    a: "بله. خرید، کارشناسی، حقوقی و بازسازی می‌توانند در یک پرونده واحد با مدیر اختصاصی هماهنگ شوند.",
  },
] as const;

function AmbientOrbs({ reduceMotion }: { reduceMotion: boolean | null }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute -right-20 -top-16 h-[26rem] w-[26rem] rounded-full bg-[#00F0FF]/20 blur-3xl"
        animate={
          reduceMotion
            ? undefined
            : { x: [0, 30, -15, 0], y: [0, 25, -10, 0], scale: [1, 1.08, 0.96, 1] }
        }
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-[-6rem] top-[30%] h-[28rem] w-[28rem] rounded-full bg-sky-400/15 blur-3xl"
        animate={
          reduceMotion
            ? undefined
            : { x: [0, -25, 18, 0], y: [0, 35, 8, 0], scale: [1, 0.94, 1.05, 1] }
        }
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[8%] right-[25%] h-64 w-64 rounded-full bg-blue-500/10 blur-3xl"
        animate={
          reduceMotion
            ? undefined
            : { opacity: [0.4, 0.75, 0.4], scale: [1, 1.12, 1] }
        }
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

function formatToman(value: number) {
  return new Intl.NumberFormat("fa-IR").format(Math.round(value));
}

export function LuxuryServicesView() {
  const reduceMotion = useReducedMotion();
  const [calcService, setCalcService] = useState<string>("sales");
  const [propertyValue, setPropertyValue] = useState(45000000000);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [openFaq, setOpenFaq] = useState(0);

  const selectedRate =
    CALCULATOR_SERVICES.find((item) => item.id === calcService)?.rate ?? 0.015;

  const fee = useMemo(
    () => propertyValue * selectedRate,
    [propertyValue, selectedRate],
  );

  const feePercent = Math.min(100, selectedRate * 1000);

  const activeTestimonial = TESTIMONIALS[testimonialIndex];

  return (
    <div
      dir="rtl"
      className="relative min-h-screen overflow-hidden bg-[#F8FAFC] font-vazirmatn text-[#0B132B]"
    >
      <AmbientOrbs reduceMotion={reduceMotion} />

      {/* Section 1 — Hero */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=80"
            alt="معماری لوکس خدمات درخشان"
            fill
            priority
            className="object-cover scale-105"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B132B] via-[#0B132B]/70 to-[#0B132B]/30" />
          <div className="absolute inset-0 bg-gradient-to-l from-sky-500/15 via-transparent to-[#00F0FF]/10" />
        </div>

        <div className="rio-container relative z-10 flex min-h-[82vh] flex-col justify-end pb-20 pt-36 md:pb-28 md:pt-44">
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
              <BadgeCheck className="h-4 w-4 text-[#00F0FF]" />
              ارائه‌دهنده خدمات سطح الف (Class-A Standards)
            </motion.div>

            <motion.h1
              variants={fadeUp}
              transition={spring}
              className="text-4xl font-black leading-[1.15] tracking-tight text-white md:text-6xl lg:text-7xl"
            >
              خدمات جامع و متمایز در والاترین سطح املاک کشور
            </motion.h1>

            <motion.p
              variants={fadeUp}
              transition={spring}
              className="mt-6 max-w-2xl text-base leading-8 tracking-wide text-sky-50/85 md:text-lg"
            >
              مدیریت VIP املاک، ایمنی سرمایه‌گذاری و تعالی معماری — از اولین
              مشاوره تا انتقال سند، در یک مسیر یکپارچه و محرمانه.
            </motion.p>

            <motion.div
              variants={fadeUp}
              transition={spring}
              className="mt-10 flex flex-wrap gap-3"
            >
              <motion.a
                href="#service-grid"
                whileHover={
                  reduceMotion ? undefined : { y: -4, scale: 1.02 }
                }
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-l from-sky-500 to-[#00F0FF] px-7 py-3.5 text-sm font-bold text-[#0B132B] shadow-[0_20px_50px_-20px_rgba(0,240,255,0.75)]"
              >
                <Sparkles className="h-4 w-4" />
                مشاهده خدمات
              </motion.a>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-7 py-3.5 text-sm font-bold text-white backdrop-blur-2xl transition hover:bg-white/20"
              >
                <Phone className="h-4 w-4" />
                درخواست مشاوره VIP
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <div className="rio-container relative z-10 space-y-24 py-20 md:space-y-32 md:py-28">
        {/* Section 2 — Service Grid */}
        <motion.section
          id="service-grid"
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.15 }}
          variants={{
            hidden: {},
            show: {
              transition: { staggerChildren: reduceMotion ? 0 : 0.08 },
            },
          }}
        >
          <motion.div
            variants={fadeUp}
            transition={spring}
            className="mb-12 max-w-2xl"
          >
            <p className="text-sm font-semibold tracking-[0.2em] text-sky-500">
              شش ستون خدمات
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#0B132B] md:text-5xl">
              خدمات تخصصی برای معاملات و دارایی‌های خاص
            </h2>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {SERVICES.map((service) => {
              const Icon = service.icon;
              return (
                <motion.article
                  key={service.id}
                  variants={fadeUp}
                  transition={spring}
                  whileHover={
                    reduceMotion
                      ? undefined
                      : { y: -8, scale: 1.02, rotateX: 1.5 }
                  }
                  className={`${glass} group overflow-hidden`}
                >
                  <div className="relative h-52 overflow-hidden">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B132B]/80 via-[#0B132B]/20 to-transparent" />
                    <div className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#00F0FF] text-[#0B132B] shadow-[0_0_24px_-4px_#00F0FF]">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="space-y-4 p-6">
                    <h3 className="text-xl font-black leading-8 text-[#0B132B]">
                      {service.title}
                    </h3>
                    <p className="text-sm leading-7 text-slate-600">
                      {service.summary}
                    </p>
                    <ul className="space-y-2">
                      {service.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-2 text-sm text-slate-700"
                        >
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-sky-500" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 rounded-full bg-[#0B132B] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-sky-600"
                    >
                      درخواست این خدمت
                      <ArrowLeft className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </motion.section>

        {/* Section 3 — Workflow */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={spring}
        >
          <div className="mb-12 max-w-2xl">
            <p className="inline-flex items-center gap-2 text-sm font-semibold tracking-[0.18em] text-sky-500">
              <Workflow className="h-4 w-4" />
              نقشه راه دریافت خدمات
            </p>
            <h2 className="mt-3 text-3xl font-black text-[#0B132B] md:text-5xl">
              چهار گام تا تجربه خدمات سطح الف
            </h2>
          </div>

          <div className="relative grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <div className="pointer-events-none absolute left-8 right-8 top-10 hidden h-px bg-gradient-to-l from-transparent via-sky-300 to-transparent xl:block" />
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{ ...spring, delay: reduceMotion ? 0 : index * 0.08 }}
                  whileHover={
                    reduceMotion ? undefined : { y: -8, scale: 1.02 }
                  }
                  className={`${glass} relative p-6`}
                >
                  <div className="mb-5 flex items-center justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0B132B] text-[#00F0FF]">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="text-sm font-black text-sky-500">
                      {(index + 1).toLocaleString("fa-IR")}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-[#0B132B]">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {step.body}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.section>
      </div>

      {/* Section 4 — Comparison */}
      <section className="relative overflow-hidden bg-[#0B132B] py-20 md:py-28">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/4 top-0 h-64 w-64 rounded-full bg-[#00F0FF]/15 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />
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
              مقایسه خدمات
            </p>
            <h2 className="mt-3 text-3xl font-black text-white md:text-5xl">
              استاندارد بازار در برابر خدمات VIP درخشان
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={spring}
            className="overflow-hidden rounded-[2rem] border border-sky-400/25 bg-white/5 backdrop-blur-2xl"
          >
            <div className="grid grid-cols-[1.4fr_0.8fr_0.8fr] border-b border-sky-400/20 bg-white/5 px-5 py-4 text-sm font-bold text-sky-100 md:px-8">
              <span>ویژگی</span>
              <span className="text-center">بازار استاندارد</span>
              <span className="text-center text-[#00F0FF]">درخشان VIP</span>
            </div>
            {COMPARISON.map((row) => (
              <div
                key={row.feature}
                className="grid grid-cols-[1.4fr_0.8fr_0.8fr] items-center border-b border-sky-400/10 px-5 py-4 text-sm last:border-b-0 md:px-8"
              >
                <span className="leading-7 text-sky-50/90">{row.feature}</span>
                <span className="flex justify-center text-sky-200/70">
                  {row.standard === true ? (
                    <Check className="h-4 w-4 text-sky-300" />
                  ) : row.standard === false ? (
                    <X className="h-4 w-4 text-slate-500" />
                  ) : (
                    row.standard
                  )}
                </span>
                <span className="flex justify-center">
                  {row.vip === true ? (
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#00F0FF]/15 text-[#00F0FF] ring-1 ring-[#00F0FF]/40">
                      <Check className="h-4 w-4" />
                    </span>
                  ) : (
                    <X className="h-4 w-4 text-slate-500" />
                  )}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <div className="rio-container relative z-10 space-y-24 py-20 md:space-y-32 md:py-28">
        {/* Section 5 — Calculator */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={spring}
          className={`${glass} relative overflow-hidden p-6 md:p-10`}
        >
          <div className="pointer-events-none absolute -left-16 top-0 h-48 w-48 rounded-full bg-[#00F0FF]/15 blur-3xl" />
          <div className="relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="inline-flex items-center gap-2 text-sm font-semibold tracking-[0.18em] text-sky-500">
                <Calculator className="h-4 w-4" />
                ماشین‌حساب تعرفه
              </p>
              <h2 className="mt-3 text-3xl font-black text-[#0B132B] md:text-4xl">
                برآورد شفاف کارمزد خدمات
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600">
                نوع خدمت و ارزش تقریبی ملک را انتخاب کنید تا تعرفه تخمینی با
                نوار بصری پویا نمایش داده شود.
              </p>

              <div className="mt-8 flex flex-wrap gap-2">
                {CALCULATOR_SERVICES.map((item) => {
                  const active = calcService === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setCalcService(item.id)}
                      className={`relative rounded-full px-4 py-2.5 text-xs font-bold transition ${
                        active
                          ? "text-[#0B132B]"
                          : "bg-white/70 text-slate-600 ring-1 ring-sky-100 hover:text-[#0B132B]"
                      }`}
                    >
                      {active && (
                        <motion.span
                          layoutId="calcService"
                          className="absolute inset-0 rounded-full bg-gradient-to-l from-sky-300 to-[#00F0FF]"
                          transition={spring}
                        />
                      )}
                      <span className="relative z-10">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              <label className="mt-8 block space-y-3">
                <div className="flex items-center justify-between text-sm font-bold text-slate-700">
                  <span>ارزش تقریبی ملک (تومان)</span>
                  <span className="text-sky-600">
                    {formatToman(propertyValue)}
                  </span>
                </div>
                <input
                  type="range"
                  min={5000000000}
                  max={200000000000}
                  step={1000000000}
                  value={propertyValue}
                  onChange={(e) => setPropertyValue(Number(e.target.value))}
                  className="w-full accent-sky-500"
                />
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>۵ میلیارد</span>
                  <span>۲۰۰ میلیارد</span>
                </div>
              </label>
            </div>

            <div className="rounded-[1.75rem] border border-sky-100 bg-[#0B132B] p-6 text-white md:p-8">
              <p className="text-sm text-sky-200">برآورد کارمزد خدمات</p>
              <p className="mt-3 text-3xl font-black text-[#00F0FF] md:text-4xl">
                {formatToman(fee)}
                <span className="mr-2 text-base font-bold text-sky-200">
                  تومان
                </span>
              </p>
              <p className="mt-2 text-sm text-sky-100/70">
                نرخ پایه: {(selectedRate * 100).toLocaleString("fa-IR")}٪ از ارزش
                ملک (تخمینی و قابل تنظیم در قرارداد)
              </p>

              <div className="mt-8 space-y-3">
                <div className="flex items-center justify-between text-xs text-sky-200">
                  <span>شدت تعرفه نسبی</span>
                  <span>{feePercent.toLocaleString("fa-IR")}٪</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-l from-sky-400 to-[#00F0FF]"
                    animate={{ width: `${feePercent}%` }}
                    transition={spring}
                  />
                </div>
              </div>

              <Link
                href="/contact"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#00F0FF] px-5 py-3 text-sm font-bold text-[#0B132B] transition hover:bg-sky-300"
              >
                دریافت پیشنهاد دقیق
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </motion.section>

        {/* Section 6 — Testimonials + FAQ */}
        <div className="grid gap-8 lg:grid-cols-2">
          <motion.section
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={spring}
            className={`${glass} p-6 md:p-8`}
          >
            <p className="text-sm font-semibold tracking-[0.18em] text-sky-500">
              روایت مشتریان خاص
            </p>
            <h2 className="mt-3 text-2xl font-black text-[#0B132B] md:text-3xl">
              تجربه خدمات VIP از نگاه موکلان
            </h2>

            <div className="relative mt-8 min-h-[220px]">
              <AnimatePresence mode="wait">
                <motion.blockquote
                  key={activeTestimonial.name}
                  initial={reduceMotion ? false : { opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, x: -24 }}
                  transition={spring}
                  className="rounded-[1.5rem] border border-sky-100 bg-white/70 p-6"
                >
                  <p className="text-sm leading-8 text-slate-700 md:text-base">
                    «{activeTestimonial.quote}»
                  </p>
                  <footer className="mt-6">
                    <p className="font-black text-[#0B132B]">
                      {activeTestimonial.name}
                    </p>
                    <p className="text-xs text-sky-600">
                      {activeTestimonial.role}
                    </p>
                  </footer>
                </motion.blockquote>
              </AnimatePresence>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                aria-label="قبلی"
                onClick={() =>
                  setTestimonialIndex(
                    (prev) =>
                      (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length,
                  )
                }
                className="flex h-10 w-10 items-center justify-center rounded-full border border-sky-100 bg-white text-[#0B132B] transition hover:border-sky-300"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="بعدی"
                onClick={() =>
                  setTestimonialIndex((prev) => (prev + 1) % TESTIMONIALS.length)
                }
                className="flex h-10 w-10 items-center justify-center rounded-full border border-sky-100 bg-white text-[#0B132B] transition hover:border-sky-300"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="mr-auto flex gap-2">
                {TESTIMONIALS.map((item, index) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setTestimonialIndex(index)}
                    className={`h-2.5 rounded-full transition ${
                      index === testimonialIndex
                        ? "w-8 bg-[#00F0FF]"
                        : "w-2.5 bg-sky-200"
                    }`}
                    aria-label={`نظر ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={spring}
          >
            <p className="text-sm font-semibold tracking-[0.18em] text-sky-500">
              سوالات متداول خدمات
            </p>
            <h2 className="mt-3 text-2xl font-black text-[#0B132B] md:text-3xl">
              ضمانت، مسئولیت و محرمانگی
            </h2>

            <div className="mt-8 space-y-3">
              {FAQS.map((item, index) => {
                const open = openFaq === index;
                return (
                  <div key={item.q} className={`${glass} overflow-hidden`}>
                    <button
                      type="button"
                      onClick={() => setOpenFaq(open ? -1 : index)}
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-right"
                    >
                      <span className="text-sm font-bold text-[#0B132B]">
                        {item.q}
                      </span>
                      <motion.span
                        animate={{ rotate: open ? 180 : 0 }}
                        transition={spring}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-500/10 text-sky-600"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {open && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={spring}
                        >
                          <p className="border-t border-sky-100/70 px-5 pb-5 pt-3 text-sm leading-7 text-slate-600">
                            {item.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </motion.section>
        </div>

        {/* Section 7 — CTA */}
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
          <div className="relative z-10 mx-auto max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-[#00F0FF]/30 bg-white/5 px-4 py-2 text-sm text-[#00F0FF] backdrop-blur-xl">
              <Gavel className="h-4 w-4" />
              مسیر اختصاصی موکلان خاص
            </p>
            <h2 className="mt-6 text-3xl font-black text-white md:text-5xl">
              آماده تجربه خدماتی متمایز هستید؟
            </h2>
            <p className="mt-4 text-sm leading-8 text-sky-100/80 md:text-base">
              همین حالا جلسه VIP رزرو کنید یا مستقیم با دفتر مرکزی در ارتباط
              باشید.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-l from-sky-400 to-[#00F0FF] px-7 py-3.5 text-sm font-bold text-[#0B132B] shadow-[0_20px_50px_-18px_rgba(0,240,255,0.85)]"
              >
                <CalendarCheck2 className="h-4 w-4" />
                رزرو جلسه و درخواست خدمت
              </Link>
              <a
                href={`tel:${SITE.phone.replace(/\s/g, "")}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-7 py-3.5 text-sm font-bold text-white backdrop-blur-xl"
              >
                <Phone className="h-4 w-4" />
                تماس مستقیم: {SITE.phone}
              </a>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
