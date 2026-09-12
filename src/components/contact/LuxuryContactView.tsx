"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Building2,
  CalendarClock,
  CheckCircle2,
  ChevronDown,
  ClipboardPen,
  Clock3,
  FileText,
  Headphones,
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

type FormTab = "consult" | "visit" | "appraisal";
type FormStatus = "idle" | "loading" | "success";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0 },
};

const glass =
  "rounded-[2rem] border border-slate-200/80 bg-white/70 shadow-2xl shadow-slate-200/50 backdrop-blur-xl";

const CONTACT_CARDS = [
  {
    id: "sales",
    title: "مشاوره و فروش",
    subtitle: "Sales & Investment",
    description:
      "مشاوره سرمایه‌گذاری و خرید/فروش املاک لوکس با تضمین پاسخگویی VIP در کمتر از ۱۵ دقیقه.",
    icon: Headphones,
    href: `tel:${SITE.phone.replace(/\s/g, "")}`,
    cta: "تماس مستقیم با مشاور ارشد",
    meta: "پاسخگویی VIP · کمتر از ۱۵ دقیقه",
  },
  {
    id: "legal",
    title: "امور حقوقی و قراردادها",
    subtitle: "Legal & Contracts",
    description:
      "دسترسی مستقیم به کارشناسان حقوقی برای بررسی قرارداد، استعلام سند و تأیید مدارک معامله.",
    icon: Scale,
    href: `mailto:${SITE.email}`,
    cta: "ارتباط با تیم حقوقی",
    meta: "بررسی تخصصی قرارداد و سند",
  },
  {
    id: "hq",
    title: "دفتر مرکزی و مدیریت",
    subtitle: "Headquarters & Admin",
    description:
      "هماهنگی جلسات مدیریتی، پیگیری پرونده‌های ویژه و ارتباط مستقیم با دفتر مرکزی.",
    icon: Building2,
    href: `tel:${SITE.phone.replace(/\s/g, "")}`,
    cta: "تماس با دفتر مرکزی",
    meta: "شنبه تا پنجشنبه · ۹ تا ۱۸",
  },
] as const;

const FORM_TABS: { id: FormTab; label: string; icon: typeof ClipboardPen }[] = [
  { id: "consult", label: "درخواست مشاوره خرید/فروش", icon: ClipboardPen },
  { id: "visit", label: "رزرو جلسات حضوری", icon: CalendarClock },
  { id: "appraisal", label: "درخواست کارشناسی ملک", icon: FileText },
];

const BUDGET_OPTIONS = [
  "کمتر از ۲۰ میلیارد تومان",
  "۲۰ تا ۵۰ میلیارد تومان",
  "۵۰ تا ۱۰۰ میلیارد تومان",
  "بیش از ۱۰۰ میلیارد تومان",
  "مشاوره سرمایه‌گذاری بدون محدودیت بودجه",
];

const NAV_ACTIONS = [
  {
    id: "waze",
    label: "Waze",
    href: "https://waze.com/ul?q=%D9%86%DB%8C%D8%A7%D9%88%D8%B1%D8%A7%D9%86%20%D8%AE%DB%8C%D8%A7%D8%A8%D8%A7%D9%86%20%D9%81%D8%B1%D8%B4%D8%AA%D9%87&navigate=yes",
  },
  {
    id: "gmaps",
    label: "Google Maps",
    href: "https://www.google.com/maps/search/?api=1&query=%D9%86%DB%8C%D8%A7%D9%88%D8%B1%D8%A7%D9%86%20%D8%AE%DB%8C%D8%A7%D8%A8%D8%A7%D9%86%20%D9%81%D8%B1%D8%B4%D8%AA%D9%87%20%D8%AA%D9%87%D8%B1%D8%A7%D9%86",
  },
  {
    id: "neshan",
    label: "نشان",
    href: "https://neshan.org/maps/@35.8048,51.4321,16.0z",
  },
  {
    id: "call",
    label: "تماس مستقیم",
    href: `tel:${SITE.phone.replace(/\s/g, "")}`,
  },
  {
    id: "telegram",
    label: "تلگرام",
    href: "https://t.me/derakhshanpro",
  },
] as const;

const FACILITIES = [
  "پارکینگ اختصاصی مشتریان VIP",
  "سالن کنفرانس و نشست‌های اختصاصی",
  "پذیرایی لوکس و فضای انتظار خصوصی",
  "اتاق نمایش فایل‌های منتخب",
];

const STATS = [
  { value: 1500, suffix: "+", label: "معامله موفق", display: "۱,۵۰۰+" },
  { value: 99, suffix: "٪", label: "رضایت مشتریان", display: "۹۹٪" },
  { value: 40, suffix: "+", label: "مشاور متخصص مناطق لوکس", display: "۴۰+" },
  { value: 18, suffix: "", label: "سال تجربه در بازار تهران", display: "۱۸" },
];

const FAQS = [
  {
    q: "کارشناسی و ارزش‌گذاری ملک چگونه انجام می‌شود؟",
    a: "پس از ثبت درخواست، کارشناس ارشد با هماهنگی شما از ملک بازدید می‌کند و گزارش قیمت‌گذاری مبتنی بر معاملات اخیر منطقه، موقعیت، و کیفیت ساخت ارائه می‌دهد.",
  },
  {
    q: "هزینه مشاوره حقوقی و بررسی قرارداد چقدر است؟",
    a: "مشاوره اولیه حقوقی برای مشتریان VIP رایگان است. در صورت نیاز به بررسی کامل سند و قرارداد، تعرفه شفاف پیش از شروع کار اعلام می‌شود.",
  },
  {
    q: "ساعات بازدید حضوری از دفتر مرکزی چیست؟",
    a: "دفتر مرکزی نیاوران از شنبه تا پنجشنبه ۹ تا ۱۸ پاسخگو است. رزرو جلسه حضوری از طریق فرم همین صفحه یا تماس تلفنی امکان‌پذیر است.",
  },
  {
    q: "زمان پاسخگویی به درخواست‌های VIP چقدر است؟",
    a: "درخواست‌های مشاوره خرید/فروش در ساعات کاری معمولاً کمتر از ۱۵ دقیقه و خارج از ساعات اداری در اولین فرصت روز بعد پیگیری می‌شوند.",
  },
];

function AnimatedStat({
  target,
  suffix,
  display,
  reduceMotion,
}: {
  target: number;
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
    const frames = 48;
    const id = window.setInterval(() => {
      frame += 1;
      const progress = Math.min(1, frame / frames);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress >= 1) window.clearInterval(id);
    }, 28);

    return () => window.clearInterval(id);
  }, [target, reduceMotion]);

  if (reduceMotion) return <>{display}</>;
  return (
    <>
      {value.toLocaleString("fa-IR")}
      {suffix}
    </>
  );
}

export function LuxuryContactView() {
  const reduceMotion = useReducedMotion();
  const [activeTab, setActiveTab] = useState<FormTab>("consult");
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
    if (activeTab === "visit") {
      return "زمان پیشنهادی جلسه حضوری را مشخص کنید تا هماهنگ‌کننده VIP با شما تماس بگیرد.";
    }
    if (activeTab === "appraisal") {
      return "جزئیات ملک و محل را در پیام بنویسید تا کارشناس ارزیابی زمان بازدید را اعلام کند.";
    }
    return "مشاور ارشد سرمایه‌گذاری ظرف کمتر از ۱۵ دقیقه با شما تماس خواهد گرفت.";
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
      className="relative min-h-screen overflow-hidden bg-[#F1EFEA] font-vazirmatn text-slate-900"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-24 top-10 h-80 w-80 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="absolute left-[-6rem] top-[28%] h-96 w-96 rounded-full bg-amber-300/25 blur-3xl" />
        <div className="absolute bottom-20 right-1/3 h-72 w-72 rounded-full bg-emerald-600/10 blur-3xl" />
      </div>

      <div className="rio-container relative z-10 space-y-16 pb-24 pt-28 md:space-y-24 md:pb-32 md:pt-36">
        {/* A. Hero */}
        <motion.section
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: {
              transition: { staggerChildren: reduceMotion ? 0 : 0.12 },
            },
          }}
          className="mx-auto max-w-4xl text-center"
        >
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.55 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-white/70 px-4 py-2 text-sm text-emerald-800 shadow-lg shadow-emerald-100/60 backdrop-blur-xl"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>
            دفتر مرکزی هم‌اکنون فعال و پاسخگو است
          </motion.div>

          <motion.h1
            variants={fadeUp}
            transition={{ duration: 0.6 }}
            className="text-4xl font-black leading-tight tracking-tight text-slate-900 md:text-6xl"
          >
            ارتباط با دپارتمان املاک درخشان
          </motion.h1>

          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.6 }}
            className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-600 md:text-lg"
          >
            پشتیبانی اختصاصی مشتریان VIP و مشاوره معماری–سرمایه‌گذاری برای املاک
            لوکس تهران؛ از اولین تماس تا امضای قرارداد، در کنار شما هستیم.
          </motion.p>

          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.55 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <a
              href={`tel:${SITE.phone.replace(/\s/g, "")}`}
              className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-xl shadow-emerald-600/25 transition hover:bg-emerald-500"
            >
              <Phone className="h-4 w-4" />
              تماس فوری: {SITE.phone}
            </a>
            <a
              href="#vip-form"
              className="inline-flex items-center gap-2 rounded-full border border-slate-300/80 bg-white/80 px-6 py-3 text-sm font-bold text-slate-800 backdrop-blur-xl transition hover:border-emerald-300 hover:text-emerald-700"
            >
              <Sparkles className="h-4 w-4" />
              رزرو مشاوره VIP
            </a>
          </motion.div>
        </motion.section>

        {/* B. Quick Contact Grid */}
        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: {},
            show: {
              transition: { staggerChildren: reduceMotion ? 0 : 0.1 },
            },
          }}
          className="grid gap-5 md:grid-cols-3"
        >
          {CONTACT_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <motion.a
                key={card.id}
                href={card.href}
                variants={fadeUp}
                transition={{ duration: 0.5 }}
                whileHover={reduceMotion ? undefined : { y: -8, scale: 1.015 }}
                className={`${glass} group block p-7 transition`}
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-emerald-300 shadow-lg shadow-slate-900/20 transition group-hover:bg-emerald-600 group-hover:text-white">
                  <Icon className="h-6 w-6" />
                </div>
                <p className="text-xs font-semibold tracking-wide text-emerald-700">
                  {card.subtitle}
                </p>
                <h2 className="mt-1 text-xl font-black text-slate-900">
                  {card.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {card.description}
                </p>
                <div className="mt-6 flex items-center justify-between gap-3 border-t border-slate-200/80 pt-4">
                  <span className="text-sm font-bold text-emerald-700">
                    {card.cta}
                  </span>
                  <span className="text-[11px] text-slate-500">{card.meta}</span>
                </div>
              </motion.a>
            );
          })}
        </motion.section>

        {/* C. VIP Form */}
        <motion.section
          id="vip-form"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.55 }}
          className={`${glass} relative overflow-hidden p-6 md:p-10`}
        >
          <div className="pointer-events-none absolute -left-16 top-0 h-56 w-56 rounded-full bg-emerald-400/15 blur-3xl" />
          <div className="pointer-events-none absolute -right-10 bottom-0 h-48 w-48 rounded-full bg-amber-300/20 blur-3xl" />

          <div className="relative">
            <div className="mb-8 max-w-2xl">
              <p className="text-sm font-semibold text-emerald-700">
                فرم ارتباط VIP
              </p>
              <h2 className="mt-2 text-3xl font-black text-slate-900 md:text-4xl">
                درخواست مشاوره و رزرو جلسه
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600 md:text-base">
                مسیر ارتباطی اختصاصی برای مشتریان ویژه؛ درخواست شما مستقیماً به
                تیم مربوطه ارجاع می‌شود.
              </p>
            </div>

            <div className="mb-8 flex flex-col gap-2 rounded-2xl bg-slate-900/5 p-2 md:flex-row">
              {FORM_TABS.map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition ${
                      active
                        ? "text-white"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="contact-tab-pill"
                        className="absolute inset-0 rounded-xl bg-slate-900 shadow-lg"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30,
                        }}
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
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -12 }}
                transition={{ duration: 0.28 }}
                onSubmit={onSubmit}
                className="relative grid gap-5 md:grid-cols-2"
              >
                <p className="md:col-span-2 rounded-2xl border border-emerald-100 bg-emerald-50/70 px-4 py-3 text-sm text-emerald-900">
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
                    className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3.5 text-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
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
                    className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3.5 text-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                    dir="ltr"
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
                    className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3.5 text-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
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
                    تاریخ و ساعت ترجیحی تماس
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
                    className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3.5 text-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                    dir="ltr"
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
                      setForm((prev) => ({ ...prev, message: e.target.value }))
                    }
                    placeholder="نوع ملک، محله موردنظر، زمان بازدید یا جزئیات کارشناسی را بنویسید..."
                    className="w-full resize-none rounded-2xl border border-slate-200 bg-white/90 px-4 py-3.5 text-sm outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                  />
                </label>

                <div className="md:col-span-2">
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="inline-flex min-w-[220px] items-center justify-center gap-2 rounded-full bg-emerald-600 px-8 py-4 text-sm font-bold text-white shadow-xl shadow-emerald-600/25 transition hover:bg-emerald-500 disabled:cursor-wait disabled:opacity-80"
                  >
                    {status === "loading" ? (
                      <>
                        <motion.span
                          className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white"
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
                        <CheckCircle2 className="h-4 w-4" />
                        درخواست ثبت شد
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        ارسال درخواست VIP
                      </>
                    )}
                  </button>

                  <AnimatePresence>
                    {status === "success" && (
                      <motion.p
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mt-4 text-sm font-semibold text-emerald-700"
                      >
                        درخواست شما با موفقیت ثبت شد. هماهنگ‌کننده VIP به‌زودی
                        تماس می‌گیرد.
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </motion.form>
            </AnimatePresence>
          </div>
        </motion.section>

        {/* D. Location & Branch */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55 }}
          className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]"
        >
          <div className={`${glass} overflow-hidden`}>
            <div className="relative h-56 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 md:h-72">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(16,185,129,0.35),transparent_55%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(251,191,36,0.2),transparent_45%)]" />
              <div className="absolute bottom-6 right-6 left-6 text-white">
                <p className="text-sm text-emerald-200">دفتر مرکزی</p>
                <h3 className="mt-1 text-2xl font-black md:text-3xl">
                  {SITE.address.line1}
                </h3>
                <p className="mt-2 max-w-xl text-sm leading-7 text-white/80">
                  {SITE.address.line2} · {SITE.address.city} · کد پستی{" "}
                  {SITE.address.postal}
                </p>
              </div>
            </div>

            <div className="space-y-5 p-6 md:p-8">
              <div className="flex flex-wrap gap-2">
                {NAV_ACTIONS.map((action) => (
                  <a
                    key={action.id}
                    href={action.href}
                    target={action.id === "call" ? undefined : "_blank"}
                    rel={
                      action.id === "call" ? undefined : "noopener noreferrer"
                    }
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:text-emerald-700"
                  >
                    {action.id === "call" ? (
                      <Phone className="h-3.5 w-3.5" />
                    ) : action.id === "telegram" ? (
                      <MessageCircle className="h-3.5 w-3.5" />
                    ) : (
                      <Navigation className="h-3.5 w-3.5" />
                    )}
                    {action.label}
                  </a>
                ))}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {FACILITIES.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-white/60 px-4 py-3"
                  >
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    <span className="text-sm leading-6 text-slate-700">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={`${glass} flex flex-col justify-between p-7 md:p-8`}>
            <div>
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white">
                <MapPin className="h-5 w-5" />
              </div>
              <h3 className="text-2xl font-black text-slate-900">
                اطلاعات دفتر و ساعات کاری
              </h3>
              <ul className="mt-6 space-y-4 text-sm leading-7 text-slate-600">
                <li className="flex items-start gap-3">
                  <Clock3 className="mt-1 h-4 w-4 shrink-0 text-emerald-600" />
                  <span>
                    شنبه تا پنجشنبه · ۹:۰۰ تا ۱۸:۰۰
                    <br />
                    جمعه‌ها با هماهنگی قبلی
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="mt-1 h-4 w-4 shrink-0 text-emerald-600" />
                  <span>
                    تلفن: {SITE.phone}
                    <br />
                    ایمیل: {SITE.email}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Building2 className="mt-1 h-4 w-4 shrink-0 text-emerald-600" />
                  <span>
                    پذیرش مشتریان VIP با هماهنگی قبلی — فضای اختصاصی مذاکره و
                    امضای قرارداد.
                  </span>
                </li>
              </ul>
            </div>

            <a
              href={`tel:${SITE.phone.replace(/\s/g, "")}`}
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-emerald-700"
            >
              <Phone className="h-4 w-4" />
              تماس با دفتر مرکزی
            </a>
          </div>
        </motion.section>

        {/* E. Trust metrics */}
        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={{
            hidden: {},
            show: {
              transition: { staggerChildren: reduceMotion ? 0 : 0.1 },
            },
          }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {STATS.map((stat) => (
            <motion.div
              key={stat.label}
              variants={fadeUp}
              transition={{ duration: 0.45 }}
              whileHover={reduceMotion ? undefined : { y: -6 }}
              className={`${glass} px-6 py-7 text-center`}
            >
              <p className="text-3xl font-black text-slate-900 md:text-4xl">
                <AnimatedStat
                  target={stat.value}
                  suffix={stat.suffix}
                  display={stat.display}
                  reduceMotion={reduceMotion}
                />
              </p>
              <p className="mt-2 text-sm text-slate-600">{stat.label}</p>
            </motion.div>
          ))}
        </motion.section>

        {/* F. FAQ */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55 }}
          className="mx-auto max-w-3xl"
        >
          <div className="mb-8 text-center">
            <p className="text-sm font-semibold text-emerald-700">
              سوالات متداول
            </p>
            <h2 className="mt-2 text-3xl font-black text-slate-900 md:text-4xl">
              پیش از تماس، این‌ها را بدانید
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
                    <span className="text-sm font-bold text-slate-900 md:text-base">
                      {item.q}
                    </span>
                    <motion.span
                      animate={{ rotate: open ? 180 : 0 }}
                      transition={{ duration: 0.25 }}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900/5 text-slate-700"
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
                        transition={{ duration: 0.28 }}
                      >
                        <p className="border-t border-slate-200/80 px-5 pb-5 pt-3 text-sm leading-7 text-slate-600 md:px-6">
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
