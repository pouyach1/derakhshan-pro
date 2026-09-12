"use client";

import Image from "next/image";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Building2,
  CalendarClock,
  CheckCircle2,
  ChevronDown,
  Clock3,
  FileSearch,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  Scale,
  Send,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { SITE } from "@/config/site";

type FormTab = "vip" | "appraisal" | "legal";
type FormStatus = "idle" | "loading" | "success";

const spring = { type: "spring" as const, stiffness: 100, damping: 20 };

const fadeUp = {
  hidden: { opacity: 0, y: 48 },
  show: { opacity: 1, y: 0 },
};

const glass =
  "rounded-[2rem] border border-sky-100/50 bg-white/40 shadow-[0_30px_80px_-40px_rgba(11,19,43,0.35)] backdrop-blur-2xl";

const GALLERY = [
  {
    src: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80",
    alt: "معماری پنت‌هاوس مدرن",
    tag: "دفتر مرکزی مشکین دشت",
    className: "md:col-span-2 md:row-span-2 min-h-[280px] md:min-h-[520px]",
  },
  {
    src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
    alt: "طراحی داخلی مینیمال",
    tag: "سالن کنفرانس VIP",
    className: "min-h-[220px] md:min-h-[250px]",
  },
  {
    src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    alt: "فضای مشاوره اجرایی",
    tag: "لانژ مشاوره اختصاصی",
    className: "min-h-[220px] md:min-h-[250px]",
  },
] as const;

const FORM_TABS: { id: FormTab; label: string; icon: typeof CalendarClock }[] = [
  { id: "vip", label: "جلسه حضوری VIP", icon: CalendarClock },
  { id: "appraisal", label: "کارشناسی برج و ملک", icon: FileSearch },
  { id: "legal", label: "مشاوره حقوقی", icon: Scale },
];

const BUDGET_OPTIONS = [
  "کمتر از ۲۰ میلیارد تومان",
  "۲۰ تا ۵۰ میلیارد تومان",
  "۵۰ تا ۱۰۰ میلیارد تومان",
  "بیش از ۱۰۰ میلیارد تومان",
  "پورتفوی سرمایه‌گذاری بدون سقف",
];

const HUB_CARDS = [
  {
    id: "phone",
    title: "خط مستقیم VIP",
    detail: SITE.phone,
    href: `tel:${SITE.phone.replace(/\s/g, "")}`,
    icon: Phone,
    meta: "پاسخگویی فوری در ساعات کاری",
  },
  {
    id: "maps",
    title: "مسیریابی دفتر مرکزی",
    detail: `${SITE.address.line1} · ${SITE.address.city}`,
    href: "https://www.google.com/maps/search/?api=1&query=%D9%86%DB%8C%D8%A7%D9%88%D8%B1%D8%A7%D9%86%20%D8%AE%DB%8C%D8%A7%D8%A8%D8%A7%D9%86%20%DB%8C%D8%A7%D8%B3%D8%B1",
    icon: Navigation,
    meta: "Google Maps · Waze · نشان",
  },
  {
    id: "telegram",
    title: "ارتباط تلگرام",
    detail: "@derakhshanpro",
    href: "https://t.me/derakhshanpro",
    icon: MessageCircle,
    meta: "پیام‌رسانی امن برای مشتریان خاص",
  },
  {
    id: "hours",
    title: "ساعات پذیرش",
    detail: "شنبه تا پنجشنبه · ۹ تا ۱۸",
    href: "#branch",
    icon: Clock3,
    meta: "جلسات مدیریتی با هماهنگی قبلی",
  },
] as const;

const NAV_LINKS = [
  {
    label: "Waze",
    href: "https://waze.com/ul?q=%D9%86%DB%8C%D8%A7%D9%88%D8%B1%D8%A7%D9%86%20%DB%8C%D8%A7%D8%B3%D8%B1&navigate=yes",
  },
  {
    label: "Google Maps",
    href: "https://www.google.com/maps/search/?api=1&query=%D9%86%DB%8C%D8%A7%D9%88%D8%B1%D8%A7%D9%86%20%D8%AE%DB%8C%D8%A7%D8%A8%D8%A7%D9%86%20%DB%8C%D8%A7%D8%B3%D8%B1",
  },
  {
    label: "نشان",
    href: "https://neshan.org/maps/@35.8048,51.4321,16.0z",
  },
  {
    label: "تماس",
    href: `tel:${SITE.phone.replace(/\s/g, "")}`,
  },
  {
    label: "تلگرام",
    href: "https://t.me/derakhshanpro",
  },
] as const;

const ROUTE_STEPS = [
  "ورود از خیابان هدایتکار، جنب فروشگاه افق کوروش",
  "استفاده از پارکینگ VIP در طبقه منفی یک",
  "ورود به لابی و اعلام نام به پذیرش اختصاصی",
  "هدایت به سالن کنفرانس یا اتاق مشاوره",
];

const STATS = [
  {
    value: 1.5,
    decimals: 1,
    suffix: "",
    label: "میلیارد دلار ارزش سبد گردانی",
    display: "۱.۵",
  },
  {
    value: 100,
    decimals: 0,
    suffix: "٪",
    label: "محرمانه بودن معاملات",
    display: "۱۰۰٪",
  },
  {
    value: 50,
    decimals: 0,
    suffix: "+",
    label: "مشاور تراز اول کشوری",
    display: "۵۰+",
  },
  {
    value: 24,
    decimals: 0,
    suffix: "/۷",
    label: "پاسخگویی اختصاصی",
    display: "۲۴/۷",
  },
];

const FAQS = [
  {
    q: "فرآیند خریدهای غیرحضوری چگونه است؟",
    a: "پس از احراز هویت دیجیتال، تور مجازی اختصاصی، بررسی حقوقی آنلاین و امضای قرارداد در بستر امن انجام می‌شود. نماینده حقوقی شما در تمام مراحل حضور دارد.",
  },
  {
    q: "شرایط رزرو جلسه با مدیریت ارشد چیست؟",
    a: "جلسات مدیریت ارشد برای پرتفوی‌های خاص و معاملات استراتژیک رزرو می‌شود. از طریق تب «جلسه حضوری VIP» درخواست دهید تا هماهنگ‌کننده زمان را تأیید کند.",
  },
  {
    q: "آیا کارشناسی برج و ملک شامل گزارش رسمی است؟",
    a: "بله. گزارش کارشناسی شامل تحلیل مقایسه‌ای منطقه، کیفیت ساخت، نقدشوندگی و بازه قیمت پیشنهادی است و ظرف ۴۸ ساعت کاری ارائه می‌شود.",
  },
  {
    q: "محرمانگی اطلاعات مشتریان چگونه تضمین می‌شود؟",
    a: "تمام پرونده‌ها در فضای امن داخلی نگه‌داری می‌شوند؛ دسترسی فقط برای تیم اختصاصی معامله فعال است و هیچ اطلاعات هویتی بدون مجوز شما منتشر نمی‌شود.",
  },
];

function AmbientOrbs({ reduceMotion }: { reduceMotion: boolean | null }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute -right-24 -top-10 h-[28rem] w-[28rem] rounded-full bg-[#00F0FF]/25 blur-3xl"
        animate={
          reduceMotion
            ? undefined
            : {
                x: [0, 40, -20, 0],
                y: [0, 30, -10, 0],
                scale: [1, 1.08, 0.96, 1],
              }
        }
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-[-8rem] top-[18%] h-[32rem] w-[32rem] rounded-full bg-sky-400/20 blur-3xl"
        animate={
          reduceMotion
            ? undefined
            : {
                x: [0, -30, 20, 0],
                y: [0, 40, 10, 0],
                scale: [1, 0.94, 1.06, 1],
              }
        }
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[10%] right-[20%] h-72 w-72 rounded-full bg-blue-600/15 blur-3xl"
        animate={
          reduceMotion
            ? undefined
            : { opacity: [0.45, 0.8, 0.45], scale: [1, 1.12, 1] }
        }
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

function AnimatedStat({
  target,
  decimals,
  suffix,
  display,
  reduceMotion,
}: {
  target: number;
  decimals: number;
  suffix: string;
  display: string;
  reduceMotion: boolean | null;
}) {
  const [value, setValue] = useState(reduceMotion ? target : 0);

  useEffect(() => {
    if (reduceMotion) {
      setValue(target);
      return;
    }
    let frame = 0;
    const frames = 52;
    const id = window.setInterval(() => {
      frame += 1;
      const progress = Math.min(1, frame / frames);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Number((target * eased).toFixed(decimals)));
      if (progress >= 1) window.clearInterval(id);
    }, 28);
    return () => window.clearInterval(id);
  }, [target, decimals, reduceMotion]);

  if (reduceMotion) return <>{display}</>;

  const formatted =
    decimals > 0
      ? value.toLocaleString("fa-IR", {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })
      : Math.round(value).toLocaleString("fa-IR");

  return (
    <>
      {formatted}
      {suffix}
    </>
  );
}

export function LuxuryContactView() {
  const reduceMotion = useReducedMotion();
  const [activeTab, setActiveTab] = useState<FormTab>("vip");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [openFaq, setOpenFaq] = useState(0);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    budget: BUDGET_OPTIONS[1],
    datetime: "",
    message: "",
  });

  const tabHint = useMemo(() => {
    if (activeTab === "appraisal") {
      return "جزئیات برج یا ملک را بنویسید؛ کارشناس ارشد ظرف ۴۸ ساعت گزارش اولیه می‌دهد.";
    }
    if (activeTab === "legal") {
      return "موضوع حقوقی را شرح دهید تا تیم قراردادها زمان مشاوره اختصاصی را هماهنگ کند.";
    }
    return "زمان پیشنهادی جلسه حضوری VIP را مشخص کنید تا هماهنگ‌کننده تأیید کند.";
  }, [activeTab]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    await new Promise((resolve) => setTimeout(resolve, 1100));
    setStatus("success");
    setForm({
      name: "",
      phone: "",
      budget: BUDGET_OPTIONS[1],
      datetime: "",
      message: "",
    });
    window.setTimeout(() => setStatus("idle"), 3200);
  }

  return (
    <div
      dir="rtl"
      className="relative min-h-screen overflow-hidden bg-[#F4F7F9] font-vazirmatn text-[#0B132B]"
    >
      <AmbientOrbs reduceMotion={reduceMotion} />

      {/* Section 1 — Cinematic Hero */}
      <section className="relative isolate min-h-[88vh] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=80"
            alt="نما معماری لوکس"
            fill
            priority
            className="object-cover scale-105"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B132B] via-[#0B132B]/75 to-[#0B132B]/35" />
          <div className="absolute inset-0 bg-gradient-to-l from-sky-500/20 via-transparent to-[#00F0FF]/10" />
        </div>

        <div className="rio-container relative z-10 flex min-h-[88vh] flex-col justify-end pb-20 pt-36 md:pb-28 md:pt-44">
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
              className="mb-7 inline-flex items-center gap-3 rounded-full border border-sky-300/30 bg-white/10 px-4 py-2 text-sm text-sky-100 backdrop-blur-2xl"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00F0FF] opacity-70" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#00F0FF] shadow-[0_0_18px_#00F0FF]" />
              </span>
              تیم پشتیبانی VIP - فعال و پاسخگوی آنلاین
            </motion.div>

            <motion.h1
              variants={fadeUp}
              transition={spring}
              className="text-4xl font-black leading-[1.15] tracking-tight text-white md:text-6xl lg:text-7xl"
            >
              ارتباط با سرآغاز معمارانه‌ای نو در املاک درخشان
            </motion.h1>

            <motion.p
              variants={fadeUp}
              transition={spring}
              className="mt-6 max-w-2xl text-base leading-8 tracking-wide text-sky-50/85 md:text-lg"
            >
              تجربه‌ای سینمایی از ارتباط با دپارتمان لوکس؛ از مشاوره معماری و
              سرمایه‌گذاری تا هماهنگی جلسات VIP و پشتیبانی حقوقی اختصاصی.
            </motion.p>

            <motion.div
              variants={fadeUp}
              transition={spring}
              className="mt-10 flex flex-wrap gap-3"
            >
              <motion.a
                href="#split-contact"
                whileHover={
                  reduceMotion ? undefined : { scale: 1.03, rotate: 0.5 }
                }
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-l from-sky-500 to-[#00F0FF] px-7 py-3.5 text-sm font-bold text-[#0B132B] shadow-[0_20px_50px_-20px_rgba(0,240,255,0.8)]"
              >
                <Sparkles className="h-4 w-4" />
                شروع ارتباط VIP
              </motion.a>
              <motion.a
                href={`tel:${SITE.phone.replace(/\s/g, "")}`}
                whileHover={
                  reduceMotion ? undefined : { scale: 1.03, rotate: -0.5 }
                }
                className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-7 py-3.5 text-sm font-bold text-white backdrop-blur-2xl"
              >
                <Phone className="h-4 w-4" />
                {SITE.phone}
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <div className="rio-container relative z-10 space-y-24 py-20 md:space-y-32 md:py-28">
        {/* Section 2 — Gallery */}
        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.2 }}
          variants={{
            hidden: {},
            show: {
              transition: { staggerChildren: reduceMotion ? 0 : 0.1 },
            },
          }}
        >
          <motion.div
            variants={fadeUp}
            transition={spring}
            className="mb-10 max-w-2xl"
          >
            <p className="text-sm font-semibold tracking-[0.2em] text-sky-500">
              گالری معماری
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#0B132B] md:text-5xl">
              فضاهایی که برای ملاقات‌های خاص طراحی شده‌اند
            </h2>
          </motion.div>

          <div className="grid gap-4 md:grid-cols-3 md:grid-rows-2">
            {GALLERY.map((item) => (
              <motion.article
                key={item.src}
                variants={fadeUp}
                transition={spring}
                whileHover={
                  reduceMotion ? undefined : { scale: 1.03, rotate: 0.5 }
                }
                className={`group relative overflow-hidden rounded-[2rem] border border-sky-100/50 shadow-[0_30px_80px_-40px_rgba(11,19,43,0.4)] ${item.className}`}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B132B]/80 via-[#0B132B]/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 opacity-0 transition duration-500 group-hover:opacity-100 md:p-6">
                  <span className="inline-flex rounded-full border border-sky-100/40 bg-white/20 px-4 py-2 text-sm font-bold text-white backdrop-blur-2xl">
                    {item.tag}
                  </span>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.section>

        {/* Section 3 — Split Contact */}
        <motion.section
          id="split-contact"
          initial={{ opacity: 0, y: 48 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={spring}
          className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]"
        >
          <div className={`${glass} relative overflow-hidden p-6 md:p-9`}>
            <div className="pointer-events-none absolute -left-20 top-0 h-56 w-56 rounded-full bg-[#00F0FF]/20 blur-3xl" />
            <div className="pointer-events-none absolute -right-10 bottom-0 h-48 w-48 rounded-full bg-sky-400/20 blur-3xl" />

            <div className="relative">
              <p className="text-sm font-semibold tracking-[0.18em] text-sky-500">
                فرم ارتباط آیس‌بلو
              </p>
              <h2 className="mt-2 text-3xl font-black text-[#0B132B] md:text-4xl">
                درخواست جلسه و مشاوره اختصاصی
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600 md:text-base">
                فرم شیشه‌ای با فوکوس نئون آسمانی — درخواست شما مستقیم به تیم VIP
                ارجاع می‌شود.
              </p>

              <div className="mt-8 flex flex-col gap-2 rounded-2xl bg-[#0B132B]/5 p-2 md:flex-row">
                {FORM_TABS.map((tab) => {
                  const Icon = tab.icon;
                  const active = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-bold transition ${
                        active
                          ? "text-[#0B132B]"
                          : "text-slate-500 hover:text-[#0B132B]"
                      }`}
                    >
                      {active && (
                        <motion.span
                          layoutId="activeTab"
                          className="absolute inset-0 rounded-xl bg-gradient-to-l from-sky-300/90 to-[#00F0FF] shadow-lg shadow-sky-300/40"
                          transition={spring}
                        />
                      )}
                      <span className="relative z-10 flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        {tab.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              <AnimatePresence mode="wait">
                <motion.form
                  key={activeTab}
                  initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, y: -12 }}
                  transition={spring}
                  onSubmit={onSubmit}
                  className="mt-6 grid gap-5 md:grid-cols-2"
                >
                  <p className="md:col-span-2 rounded-2xl border border-sky-200/70 bg-sky-50/70 px-4 py-3 text-sm text-sky-900">
                    {tabHint}
                  </p>

                  <label className="block space-y-2">
                    <span className="text-sm font-bold text-slate-700">
                      نام و نام خانوادگی
                    </span>
                    <input
                      required
                      value={form.name}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, name: e.target.value }))
                      }
                      placeholder="مثلاً: آریا درخشان"
                      className="w-full rounded-2xl border border-sky-100 bg-white/70 px-4 py-3.5 text-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-400/30"
                    />
                  </label>

                  <label className="block space-y-2">
                    <span className="text-sm font-bold text-slate-700">
                      شماره تماس
                    </span>
                    <input
                      required
                      inputMode="tel"
                      value={form.phone}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, phone: e.target.value }))
                      }
                      placeholder="۰۹۱۲xxxxxxx"
                      dir="ltr"
                      className="w-full rounded-2xl border border-sky-100 bg-white/70 px-4 py-3.5 text-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-400/30"
                    />
                  </label>

                  <label className="block space-y-2">
                    <span className="text-sm font-bold text-slate-700">
                      بازه بودجه
                    </span>
                    <select
                      value={form.budget}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, budget: e.target.value }))
                      }
                      className="w-full rounded-2xl border border-sky-100 bg-white/70 px-4 py-3.5 text-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-400/30"
                    >
                      {BUDGET_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block space-y-2">
                    <span className="text-sm font-bold text-slate-700">
                      تاریخ و ساعت ترجیحی
                    </span>
                    <input
                      type="datetime-local"
                      required
                      value={form.datetime}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          datetime: e.target.value,
                        }))
                      }
                      dir="ltr"
                      className="w-full rounded-2xl border border-sky-100 bg-white/70 px-4 py-3.5 text-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-400/30"
                    />
                  </label>

                  <label className="block space-y-2 md:col-span-2">
                    <span className="text-sm font-bold text-slate-700">
                      پیام تفصیلی
                    </span>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          message: e.target.value,
                        }))
                      }
                      placeholder="جزئیات جلسه، ملک، یا موضوع حقوقی را بنویسید..."
                      className="w-full resize-none rounded-2xl border border-sky-100 bg-white/70 px-4 py-3.5 text-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-400/30"
                    />
                  </label>

                  <div className="md:col-span-2">
                    <motion.button
                      type="submit"
                      disabled={status === "loading"}
                      whileHover={
                        reduceMotion ? undefined : { scale: 1.03, rotate: 0.5 }
                      }
                      whileTap={{ scale: 0.98 }}
                      className="inline-flex min-w-[220px] items-center justify-center gap-2 rounded-full bg-[#0B132B] px-8 py-4 text-sm font-bold text-white shadow-[0_20px_50px_-24px_rgba(0,240,255,0.9)] transition hover:bg-sky-600 disabled:cursor-wait disabled:opacity-80"
                    >
                      {status === "loading" ? (
                        <>
                          <motion.span
                            className="h-4 w-4 rounded-full border-2 border-white/30 border-t-[#00F0FF]"
                            animate={{ rotate: 360 }}
                            transition={{
                              repeat: Infinity,
                              duration: 0.8,
                              ease: "linear",
                            }}
                          />
                          در حال ارسال...
                        </>
                      ) : status === "success" ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 text-[#00F0FF]" />
                          درخواست ثبت شد
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          ارسال درخواست
                        </>
                      )}
                    </motion.button>

                    <AnimatePresence>
                      {status === "success" && (
                        <motion.p
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="mt-4 text-sm font-semibold text-sky-600"
                        >
                          درخواست شما ثبت شد. هماهنگ‌کننده VIP به‌زودی تماس
                          می‌گیرد.
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.form>
              </AnimatePresence>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {HUB_CARDS.map((card) => {
              const Icon = card.icon;
              return (
                <motion.a
                  key={card.id}
                  href={card.href}
                  target={card.href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    card.href.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  initial={{ opacity: 0, y: 36 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.2 }}
                  transition={spring}
                  whileHover={
                    reduceMotion ? undefined : { scale: 1.03, rotate: 0.5 }
                  }
                  className={`${glass} group block p-5 transition`}
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0B132B] text-[#00F0FF] shadow-[0_0_30px_-8px_#00F0FF] transition group-hover:bg-sky-500 group-hover:text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-black text-[#0B132B]">
                    {card.title}
                  </h3>
                  <p className="mt-1 text-sm font-semibold text-sky-600">
                    {card.detail}
                  </p>
                  <p className="mt-2 text-xs leading-6 text-slate-500">
                    {card.meta}
                  </p>
                </motion.a>
              );
            })}
          </div>
        </motion.section>
      </div>

      {/* Section 4 — Dark Stats */}
      <section className="relative overflow-hidden bg-slate-950 py-20 md:py-28">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/4 top-0 h-64 w-64 rounded-full bg-[#00F0FF]/20 blur-3xl" />
          <div className="absolute bottom-0 right-1/5 h-72 w-72 rounded-full bg-sky-500/15 blur-3xl" />
        </div>
        <div className="rio-container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={spring}
            className="mb-12 max-w-2xl"
          >
            <p className="text-sm font-semibold tracking-[0.22em] text-[#00F0FF]">
              استانداردهای جهانی
            </p>
            <h2 className="mt-3 text-3xl font-black text-white md:text-5xl">
              مقیاس اعتماد در معاملات تراز اول
            </h2>
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STATS.map((stat) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={spring}
                whileHover={
                  reduceMotion ? undefined : { scale: 1.03, rotate: 0.5 }
                }
                className="rounded-[1.75rem] border border-sky-400/20 bg-white/5 px-6 py-8 text-center backdrop-blur-2xl"
              >
                <p className="text-3xl font-black text-[#00F0FF] md:text-4xl">
                  <AnimatedStat
                    target={stat.value}
                    decimals={stat.decimals}
                    suffix={stat.suffix}
                    display={stat.display}
                    reduceMotion={reduceMotion}
                  />
                </p>
                <p className="mt-3 text-sm leading-7 text-sky-100/80">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="rio-container relative z-10 space-y-24 py-20 md:space-y-32 md:py-28">
        {/* Section 5 — Branch Showcase */}
        <motion.section
          id="branch"
          initial={{ opacity: 0, y: 48 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={spring}
          className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]"
        >
          <div className={`${glass} overflow-hidden`}>
            <div className="relative h-64 md:h-80">
              <Image
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
                alt="دفتر مرکزی درخشان"
                fill
                className="object-cover transition duration-700 hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B132B] via-[#0B132B]/40 to-transparent" />
              <div className="absolute bottom-6 right-6 left-6 text-white">
                <p className="text-sm text-[#00F0FF]">دفتر مرکزی</p>
                <h3 className="mt-1 text-2xl font-black md:text-3xl">
                  {SITE.address.line1}
                </h3>
                <p className="mt-2 text-sm text-sky-100/85">
                  {SITE.address.line2} · {SITE.address.city} · کد پستی{" "}
                  {SITE.address.postal}
                </p>
              </div>
            </div>

            <div className="space-y-5 p-6 md:p-8">
              <div className="flex flex-wrap gap-2">
                {NAV_LINKS.map((link) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      link.href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    whileHover={
                      reduceMotion ? undefined : { scale: 1.03, rotate: 0.5 }
                    }
                    className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-white/70 px-4 py-2.5 text-xs font-bold text-[#0B132B] transition hover:border-sky-300 hover:text-sky-600"
                  >
                    {link.label === "تماس" ? (
                      <Phone className="h-3.5 w-3.5" />
                    ) : link.label === "تلگرام" ? (
                      <MessageCircle className="h-3.5 w-3.5" />
                    ) : (
                      <Navigation className="h-3.5 w-3.5" />
                    )}
                    {link.label}
                  </motion.a>
                ))}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  "پارکینگ اختصاصی مشتریان VIP",
                  "سالن کنفرانس و نشست خصوصی",
                  "پذیرش لابی ۲۴ ساعته برای جلسات رزروشده",
                  "اتاق نمایش فایل‌های منتخب",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-2xl border border-sky-100/60 bg-white/50 px-4 py-3"
                  >
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-sky-500" />
                    <span className="text-sm leading-6 text-slate-700">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={`${glass} flex flex-col p-7 md:p-8`}>
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500 text-white shadow-[0_0_28px_-6px_#38bdf8]">
              <MapPin className="h-5 w-5" />
            </div>
            <h3 className="text-2xl font-black text-[#0B132B]">
              راهنمای مسیر و پارکینگ
            </h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              مسیر گام‌به‌گام از ورود تا سالن مشاوره؛ برای مشتریان VIP بدون
              انتظار در لابی عمومی.
            </p>
            <ol className="mt-6 space-y-4">
              {ROUTE_STEPS.map((step, index) => (
                <li key={step} className="flex gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0B132B] text-xs font-bold text-[#00F0FF]">
                    {(index + 1).toLocaleString("fa-IR")}
                  </span>
                  <span className="pt-1 text-sm leading-7 text-slate-700">
                    {step}
                  </span>
                </li>
              ))}
            </ol>
            <div className="mt-auto pt-8">
              <div className="flex items-start gap-3 rounded-2xl border border-sky-100 bg-sky-50/60 px-4 py-3">
                <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />
                <p className="text-sm leading-6 text-slate-700">
                  برای ورود با خودرو، پلاک را حداقل ۳۰ دقیقه قبل از جلسه به
                  پذیرش اعلام کنید.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Section 6 — FAQ */}
        <motion.section
          initial={{ opacity: 0, y: 48 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={spring}
          className="mx-auto max-w-3xl"
        >
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold tracking-[0.2em] text-sky-500">
              سوالات متداول
            </p>
            <h2 className="mt-3 text-3xl font-black text-[#0B132B] md:text-5xl">
              پاسخ‌هایی برای مشتریان خاص
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((item, index) => {
              const open = openFaq === index;
              return (
                <div key={item.q} className={`${glass} overflow-hidden`}>
                  <button
                    type="button"
                    onClick={() => setOpenFaq(open ? -1 : index)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-right md:px-6"
                  >
                    <span className="text-sm font-bold text-[#0B132B] md:text-base">
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
                        <p className="border-t border-sky-100/70 px-5 pb-5 pt-3 text-sm leading-7 text-slate-600 md:px-6">
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
    </div>
  );
}
