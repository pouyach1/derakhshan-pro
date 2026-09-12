"use client";

import Image from "next/image";
import Link from "next/link";
import {
  FormEvent,
  MouseEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import {
  ArrowLeft,
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  CalendarCheck2,
  CheckCircle2,
  Clock3,
  MessageCircle,
  Phone,
  Scale,
  ShieldCheck,
  Sparkles,
  Trophy,
  UserRound,
  X,
} from "lucide-react";
import { SITE } from "@/config/site";

type Dept =
  | "all"
  | "leadership"
  | "penthouse"
  | "villa"
  | "legal";

type Agent = {
  id: string;
  name: string;
  role: string;
  department: Exclude<Dept, "all">;
  image: string;
  badge: string;
  bio: string;
  philosophy: string;
  stats: { label: string; value: string }[];
  phone: string;
  whatsapp: string;
};

const spring = { type: "spring" as const, stiffness: 90, damping: 18 };

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0 },
};

const glass =
  "rounded-[2rem] border border-sky-100/60 bg-white/50 shadow-2xl shadow-sky-500/10 backdrop-blur-2xl";

const FILTERS: { id: Dept; label: string }[] = [
  { id: "all", label: "همه اعضا" },
  { id: "leadership", label: "مدیریت ارشد" },
  { id: "penthouse", label: "مشاوران پنت‌هاوس و برج" },
  { id: "villa", label: "کارشناسان ویلا و مستغلات" },
  { id: "legal", label: "امور حقوقی و ثبتی" },
];

const AGENTS: Agent[] = [
  {
    id: "arsham",
    name: "دکتر آرشام درخشان",
    role: "مدیریت ارشد و استراتژیست کلان املاک",
    department: "leadership",
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=1200&q=80",
    badge: "۲ میلیارد دلار حجم مدیریت سرمایه • ۱۵ سال سابقه",
    bio: "معمار استراتژی معاملات فوق‌سنگین در نوار شمالی تهران؛ با تمرکز بر ساختاردهی پورتفوی‌های خصوصی و مذاکرات سطح هیئت‌مدیره.",
    philosophy:
      "هر معامله باید مثل یک اثر معماری دقیق باشد: شفاف در سازه حقوقی، محرمانه در هویت، و بی‌نقص در اجرا.",
    stats: [
      { label: "حجم معاملات هدایت‌شده", value: "$۲B+" },
      { label: "میانگین زمان جمع‌بندی", value: "۱۲ روز" },
      { label: "رضایت موکلان VIP", value: "۹۹٪" },
    ],
    phone: SITE.phone,
    whatsapp: "989121000000",
  },
  {
    id: "sara",
    name: "مهندس سارا رادمن",
    role: "سرپرست مشاوران پنت‌هاوس و برج‌های الهیه",
    department: "penthouse",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80",
    badge: "مشاور برتر سال ۱۴۰۲ • متخصص منطقه فرشته",
    bio: "متخصص اسکای‌لاین الهیه و فرشته؛ از کشف فایل‌های آف‌مارکت تا بستن پنت‌هاوس‌های دوبلکس با استاندارد بازدید خصوصی.",
    philosophy:
      "پنت‌هاوس فقط متراژ نیست؛ ترکیب نور، حریم و نقدشوندگی است که باید دقیق قیمت‌گذاری شود.",
    stats: [
      { label: "پنت‌هاوس بسته‌شده", value: "۱۲۰+" },
      { label: "میانگین کلوزینگ", value: "۱۰ روز" },
      { label: "فایل‌های آف‌مارکت", value: "۶۵٪" },
    ],
    phone: SITE.phone,
    whatsapp: "989121000001",
  },
  {
    id: "kamran",
    name: "کامران شریفی",
    role: "متخصص ویلاهای فاخر لواسان و شمال",
    department: "villa",
    image:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=1200&q=80",
    badge: "رکورددار فروش ۵ ویلای سوپرلوکس",
    bio: "کارشناس ویلاهای مشرف و مستغلات خاص در لواسان و نوار ساحلی؛ با شبکه مالکین خصوصی و مسیر فروش محرمانه.",
    philosophy:
      "ویلای فاخر را باید با داستان مکان فروخت؛ نه فقط با لیست امکانات.",
    stats: [
      { label: "ویلای سوپرلوکس", value: "۵ رکورد" },
      { label: "میانگین بازدید تا پیشنهاد", value: "۴۸ ساعت" },
      { label: "نرخ بستن معامله", value: "۹۲٪" },
    ],
    phone: SITE.phone,
    whatsapp: "989121000002",
  },
  {
    id: "niloufar",
    name: "دکتر نیلوفر سپهری",
    role: "رئیس دپارتمان حقوقی و استعلامات ثبتی",
    department: "legal",
    image:
      "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=1200&q=80",
    badge: "وکیل پایه یک دادگستری • ۰٪ ریسک حقوقی",
    bio: "مسئول پالایش حقوقی پرونده‌ها پیش از هر تعهد مالی؛ از استعلام ثبت تا بازبینی بندهای قرارداد و همراهی تا سند رسمی.",
    philosophy:
      "زیباترین معامله، معامله‌ای است که هیچ سایه حقوقی باقی نگذارد.",
    stats: [
      { label: "پرونده بدون مناقشه", value: "۰٪ ریسک" },
      { label: "استعلام تا تأیید", value: "۲۴ ساعت" },
      { label: "قراردادهای دوزبانه", value: "۸۰+" },
    ],
    phone: SITE.phone,
    whatsapp: "989121000003",
  },
  {
    id: "reza",
    name: "رضا محمدی",
    role: "مشاور ارشد آپارتمان‌های VIP نیاوران",
    department: "penthouse",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80",
    badge: "نرخ رضایت ۹۹٪ مشتریان",
    bio: "تمرکز روی واحدهای VIP نیاوران و پاسداران با رویکرد خدمات پس از معامله و هماهنگی کامل تحویل.",
    philosophy:
      "اعتماد مشتری در جزئیات ساخته می‌شود؛ از اولین تماس تا کلیدسپاری.",
    stats: [
      { label: "رضایت مشتری", value: "۹۹٪" },
      { label: "معاملات سال جاری", value: "۴۵+" },
      { label: "میانگین کلوزینگ", value: "۹ روز" },
    ],
    phone: SITE.phone,
    whatsapp: "989121000004",
  },
  {
    id: "maryam",
    name: "مریم کاظمی",
    role: "استراتژیست تهاتر و معاملات دیپلماتیک",
    department: "leadership",
    image:
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1200&q=80",
    badge: "متخصص مذاکرات بین‌المللی",
    bio: "طراح ساختار تهاتر و معاملات چندطرفه برای موکلان دیپلماتیک و سرمایه‌گذاران بین‌المللی با پروتکل محرمانگی سخت.",
    philosophy:
      "در معاملات پیچیده، زبان مشترک همان شفافیت حقوقی و احترام به حریم طرفین است.",
    stats: [
      { label: "معاملات دیپلماتیک", value: "۳۰+" },
      { label: "تهاترهای ساختاریافته", value: "۱۸" },
      { label: "محرمانگی پرونده", value: "۱۰۰٪" },
    ],
    phone: SITE.phone,
    whatsapp: "989121000005",
  },
];

const STANDARDS = [
  {
    icon: BadgeCheck,
    title: "۱۰۰٪ اصالت و احراز هویت مشاوران",
    body: "هر عضو تیم با مدارک حرفه‌ای و سابقه قابل‌استعلام وارد پرونده موکل می‌شود.",
  },
  {
    icon: ShieldCheck,
    title: "تعهد به محرمانگی خریدار و فروشنده",
    body: "هویت، بودجه و جزئیات مذاکره فقط در حلقه اختصاصی پرونده در گردش است.",
  },
  {
    icon: BriefcaseBusiness,
    title: "داده‌های هوشمند بازار",
    body: "تصمیم‌ها بر پایه معاملات اخیر، نقدشوندگی محله و ظرفیت سرمایه‌ای ملک گرفته می‌شود.",
  },
];

function AmbientOrbs({ reduceMotion }: { reduceMotion: boolean | null }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute -right-24 top-16 h-[26rem] w-[26rem] rounded-full bg-[#00F0FF]/25 blur-3xl opacity-40"
        animate={
          reduceMotion
            ? undefined
            : { x: [0, 36, -18, 0], y: [0, 28, -12, 0], scale: [1, 1.1, 0.95, 1] }
        }
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -left-28 top-[40%] h-[30rem] w-[30rem] rounded-full bg-sky-400/20 blur-3xl opacity-40"
        animate={
          reduceMotion
            ? undefined
            : { x: [0, -30, 20, 0], y: [0, 34, 8, 0], scale: [1, 0.92, 1.08, 1] }
        }
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

function TiltCard({
  children,
  reduceMotion,
  className = "",
}: {
  children: React.ReactNode;
  reduceMotion: boolean | null;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 180, damping: 16 });
  const springY = useSpring(rotateY, { stiffness: 180, damping: 16 });

  function onMove(event: MouseEvent<HTMLDivElement>) {
    if (reduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    rotateX.set((0.5 - py) * 10);
    rotateY.set((px - 0.5) * 12);
  }

  function onLeave() {
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        rotateX: reduceMotion ? 0 : springX,
        rotateY: reduceMotion ? 0 : springY,
        transformPerspective: 1000,
      }}
      whileHover={reduceMotion ? undefined : { scale: 1.03 }}
      transition={spring}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function AgentModal({
  agent,
  onClose,
  reduceMotion,
}: {
  agent: Agent;
  onClose: () => void;
  reduceMotion: boolean | null;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    datetime: "",
    note: "",
  });

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    await new Promise((r) => setTimeout(r, 900));
    setStatus("success");
    setForm({ name: "", phone: "", datetime: "", note: "" });
    window.setTimeout(() => setStatus("idle"), 2500);
  }

  return (
    <motion.div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-[#0B132B]/55 p-3 backdrop-blur-md sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={`پرونده ${agent.name}`}
        initial={reduceMotion ? false : { opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={reduceMotion ? undefined : { opacity: 0, y: 24, scale: 0.97 }}
        transition={spring}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-[2rem] border border-sky-100/60 bg-white/80 shadow-2xl shadow-sky-500/20 backdrop-blur-2xl"
      >
        <div className="grid md:grid-cols-[0.9fr_1.1fr]">
          <div className="relative min-h-[280px] md:min-h-full">
            <Image
              src={agent.image}
              alt={agent.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 40vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B132B] via-[#0B132B]/30 to-transparent" />
            <div className="absolute bottom-5 right-5 left-5 text-white">
              <p className="text-sm text-[#00F0FF]">{agent.role}</p>
              <h3 className="mt-1 text-2xl font-black">{agent.name}</h3>
            </div>
          </div>

          <div className="space-y-6 p-6 md:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold tracking-[0.16em] text-sky-500">
                  پرونده اختصاصی مشاور
                </p>
                <p className="mt-3 text-sm leading-7 text-slate-600">{agent.bio}</p>
                <p className="mt-3 rounded-2xl border border-sky-100 bg-sky-50/70 px-4 py-3 text-sm leading-7 text-sky-900">
                  {agent.philosophy}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0B132B] text-white"
                aria-label="بستن"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {agent.stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-sky-100 bg-white/80 px-4 py-3 text-center"
                >
                  <p className="text-lg font-black text-[#0B132B]">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-[11px] text-slate-500">{stat.label}</p>
                </div>
              ))}
            </div>

            <form onSubmit={onSubmit} className="space-y-3">
              <p className="text-sm font-bold text-[#0B132B]">
                درخواست جلسه خصوصی با این مشاور
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="نام و نام خانوادگی"
                  className="rounded-2xl border border-sky-100 bg-white/90 px-4 py-3 text-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-400/20"
                />
                <input
                  required
                  value={form.phone}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  placeholder="شماره تماس"
                  dir="ltr"
                  className="rounded-2xl border border-sky-100 bg-white/90 px-4 py-3 text-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-400/20"
                />
              </div>
              <input
                required
                type="datetime-local"
                value={form.datetime}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, datetime: e.target.value }))
                }
                dir="ltr"
                className="w-full rounded-2xl border border-sky-100 bg-white/90 px-4 py-3 text-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-400/20"
              />
              <textarea
                required
                rows={3}
                value={form.note}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, note: e.target.value }))
                }
                placeholder="موضوع جلسه یا محدوده ملک موردنظر..."
                className="w-full resize-none rounded-2xl border border-sky-100 bg-white/90 px-4 py-3 text-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-400/20"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="inline-flex items-center gap-2 rounded-full bg-[#0B132B] px-6 py-3 text-sm font-bold text-white transition hover:bg-sky-600 disabled:opacity-70"
              >
                {status === "loading" ? (
                  "در حال ثبت..."
                ) : status === "success" ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-[#00F0FF]" />
                    درخواست ثبت شد
                  </>
                ) : (
                  <>
                    <CalendarCheck2 className="h-4 w-4" />
                    رزرو جلسه خصوصی
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function LuxuryMeetTeamView() {
  const reduceMotion = useReducedMotion();
  const [filter, setFilter] = useState<Dept>("all");
  const [selected, setSelected] = useState<Agent | null>(null);

  const agents = useMemo(() => {
    if (filter === "all") return AGENTS;
    return AGENTS.filter((agent) => agent.department === filter);
  }, [filter]);

  return (
    <div
      dir="rtl"
      className="relative min-h-screen overflow-hidden bg-[#F8FAFC] font-vazirmatn text-[#0B132B]"
    >
      <AmbientOrbs reduceMotion={reduceMotion} />

      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2200&q=80"
            alt="تیم نخبگان درخشان"
            fill
            priority
            className="object-cover scale-105"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B132B] via-[#0B132B]/75 to-[#0B132B]/35" />
          <div className="absolute inset-0 bg-gradient-to-l from-sky-500/20 via-transparent to-[#00F0FF]/10" />
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
              <Trophy className="h-4 w-4 text-[#00F0FF]" />
              اعضای تاییدشده انجمن بین‌المللی مشاوران VIP
            </motion.div>

            <motion.h1
              variants={fadeUp}
              transition={spring}
              className="text-4xl font-black leading-[1.15] tracking-tight text-white md:text-6xl lg:text-7xl"
            >
              معماران اعتماد؛ زبده‌ترین نخبگان صنعت املاک کشور
            </motion.h1>

            <motion.p
              variants={fadeUp}
              transition={spring}
              className="mt-6 max-w-2xl text-base leading-8 tracking-wide text-sky-50/85 md:text-lg"
            >
              تیمی از استراتژیست‌ها، مشاوران پنت‌هاوس و حقوقدانان ثبتی که مذاکره
              سخت، حریم خصوصی و تسلط معماری را در یک استاندارد واحد جمع کرده‌اند.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <div className="rio-container relative z-10 space-y-20 py-20 md:space-y-28 md:py-28">
        {/* Filters */}
        <section>
          <div className="mb-8 max-w-2xl">
            <p className="text-sm font-semibold tracking-[0.2em] text-sky-500">
              دپارتمان‌ها
            </p>
            <h2 className="mt-3 text-3xl font-black text-[#0B132B] md:text-4xl">
              فیلتر اعضای تیم
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
                      layoutId="activeFilter"
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

        {/* Team grid */}
        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.12 }}
          variants={{
            hidden: {},
            show: {
              transition: { staggerChildren: reduceMotion ? 0 : 0.1 },
            },
          }}
          className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
          style={{ perspective: 1200 }}
        >
          <AnimatePresence mode="popLayout">
            {agents.map((agent) => (
              <motion.div
                key={agent.id}
                layout
                variants={fadeUp}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0, scale: 0.96 }}
                transition={spring}
              >
                <TiltCard reduceMotion={reduceMotion} className={`${glass} overflow-hidden`}>
                  <div className="relative h-72 overflow-hidden">
                    <Image
                      src={agent.image}
                      alt={agent.name}
                      fill
                      className="object-cover transition duration-700 hover:scale-110"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B132B]/90 via-[#0B132B]/25 to-transparent" />
                    <div className="absolute bottom-4 right-4 left-4">
                      <p className="text-xs font-semibold text-[#00F0FF]">
                        {agent.role}
                      </p>
                      <h3 className="mt-1 text-xl font-black text-white">
                        {agent.name}
                      </h3>
                    </div>
                  </div>

                  <div className="space-y-4 p-6">
                    <p className="inline-flex items-start gap-2 rounded-2xl border border-sky-100 bg-sky-50/70 px-3 py-2 text-xs leading-6 text-sky-800">
                      <BadgeCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                      {agent.badge}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      <a
                        href={`https://wa.me/${agent.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#0B132B] px-3.5 py-2 text-[11px] font-bold text-white transition hover:bg-sky-600"
                      >
                        <MessageCircle className="h-3.5 w-3.5" />
                        واتس‌اپ
                      </a>
                      <a
                        href={`tel:${agent.phone.replace(/\s/g, "")}`}
                        className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-white/80 px-3.5 py-2 text-[11px] font-bold text-[#0B132B] transition hover:border-sky-400"
                      >
                        <Phone className="h-3.5 w-3.5" />
                        تماس مستقیم
                      </a>
                      <button
                        type="button"
                        onClick={() => setSelected(agent)}
                        className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-l from-sky-400 to-[#00F0FF] px-3.5 py-2 text-[11px] font-bold text-[#0B132B] shadow-lg shadow-sky-300/40"
                      >
                        <UserRound className="h-3.5 w-3.5" />
                        مشاهده پرونده کامل
                      </button>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.section>
      </div>

      {/* Standards */}
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
              استاندارد اعتماد
            </p>
            <h2 className="mt-3 text-3xl font-black text-white md:text-5xl">
              معیارهایی که تیم را متمایز می‌کند
            </h2>
          </motion.div>

          <div className="grid gap-4 md:grid-cols-3">
            {STANDARDS.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{
                    ...spring,
                    delay: reduceMotion ? 0 : index * 0.08,
                  }}
                  whileHover={
                    reduceMotion ? undefined : { y: -8, scale: 1.02 }
                  }
                  className="rounded-[1.75rem] border border-sky-400/25 bg-white/5 p-6 backdrop-blur-2xl"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#00F0FF]/10 text-[#00F0FF]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-black text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-sky-100/80">
                    {item.body}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Recruitment CTA */}
      <div className="rio-container relative z-10 py-20 md:py-28">
        <motion.section
          initial={{ opacity: 0, y: 48 }}
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
              <Building2 className="h-4 w-4" />
              دعوت به همکاری از نخبگان
            </p>
            <h2 className="mt-6 text-3xl font-black text-white md:text-5xl">
              آیا شما هم یک مشاور تراز اول هستید؟ به تیم نخبگان درخشان بپیوندید.
            </h2>
            <p className="mt-4 text-sm leading-8 text-sky-100/80 md:text-base">
              اگر در مذاکره، تحلیل بازار یا ساختار حقوقی معاملات لوکس تراز اول
              هستید، پرونده همکاری خود را ارسال کنید.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-l from-sky-400 to-[#00F0FF] px-7 py-3.5 text-sm font-bold text-[#0B132B] shadow-[0_20px_50px_-18px_rgba(0,240,255,0.85)]"
              >
                ارسال درخواست همکاری
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <a
                href={`mailto:${SITE.email}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-7 py-3.5 text-sm font-bold text-white backdrop-blur-xl"
              >
                <Scale className="h-4 w-4" />
                ایمیل جذب استعداد: {SITE.email}
              </a>
            </div>
          </div>
        </motion.section>
      </div>

      <AnimatePresence>
        {selected && (
          <AgentModal
            agent={selected}
            onClose={() => setSelected(null)}
            reduceMotion={reduceMotion}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
