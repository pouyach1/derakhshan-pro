"use client";

import Link from "next/link";
import {
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
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
  ArrowUp,
  Clock3,
  Instagram,
  Linkedin,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { NAV, SITE } from "@/config/site";
import { siteConfig, type SiteIconKey } from "@/config/siteConfig";
import { IOS_PAGE_SPRING, IOS_TAP_SPRING } from "@/lib/motion/ios";
import { cn } from "@/lib/utils";

const FOOTER_ICONS: Record<string, LucideIcon> = {
  instagram: Instagram,
  send: Send,
  "message-circle": MessageCircle,
  linkedin: Linkedin,
};

const PROPERTY_LINKS = siteConfig.footer.columns.brand.links;
const SERVICE_LINKS = siteConfig.footer.columns.services.links;
const PANEL_LINKS = siteConfig.footer.columns.panels.links;
const LEGAL_LINKS = siteConfig.footer.columns.legal.links;

const SOCIAL_LINKS = siteConfig.footer.socialLinks.map((item) => ({
  ...item,
  icon: FOOTER_ICONS[item.icon as SiteIconKey] ?? MessageCircle,
}));

const MARQUEE_ITEMS = [
  "DERAKHSHAN",
  "گوهردشت",
  "عظیمیه",
  "مهرشهر",
  "ماهدشت",
  "کمال‌شهر",
  "فردیس",
  siteConfig.brand.taglineFa,
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

/** پس‌زمینه معماری یخ‌نمایی — بدون اورورای عمومی */
function IceField({ reduce }: { reduce: boolean | null }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-[linear-gradient(165deg,#071A2C_0%,#0B3A5C_42%,#0E4A72_72%,#082338_100%)]" />
      <div className="absolute inset-0 opacity-[0.14] [background-image:linear-gradient(rgba(255,255,255,0.11)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.11)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_78%)]" />
      <motion.div
        className="absolute -start-[18%] top-[-20%] h-[55vmax] w-[55vmax] rounded-full bg-sky-400/15 blur-[90px]"
        animate={reduce ? undefined : { x: [0, 50, -20, 0], y: [0, 30, -15, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -end-[12%] bottom-[-10%] h-[45vmax] w-[45vmax] rounded-full bg-[#7DD3FC]/12 blur-[100px]"
        animate={reduce ? undefined : { x: [0, -40, 25, 0], y: [0, -25, 20, 0] }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-sky-300/50 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#041018] to-transparent" />
    </div>
  );
}

function NeighborhoodRibbon() {
  const row = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div className="relative overflow-hidden border-y border-white/10 bg-white/[0.03] py-3">
      <div
        className="flex w-max animate-marquee gap-8 whitespace-nowrap will-change-transform"
        style={{ animationDuration: "38s" }}
      >
        {row.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="inline-flex items-center gap-8 text-[11px] font-semibold tracking-[0.18em] text-sky-100/70 md:text-xs"
          >
            <span className={item === "DERAKHSHAN" ? "rio-display tracking-[0.28em] text-white" : ""}>
              {item}
            </span>
            <span className="h-1 w-1 rounded-full bg-sky-300/70" />
          </span>
        ))}
      </div>
    </div>
  );
}

/** بیلبورد انگلیسی برند — حرف‌به‌حرف با درخشش اسکای */
function BrandBillboard({ reduce }: { reduce: boolean | null }) {
  const word = (siteConfig.brand.watermark || "DERAKHSHAN").toUpperCase();
  const letters = word.split("");
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const sx = useSpring(mx, { stiffness: 110, damping: 22 });
  const sy = useSpring(my, { stiffness: 110, damping: 22 });
  const glareX = useTransform(sx, (v) => `${v * 100}%`);
  const glareY = useTransform(sy, (v) => `${v * 100}%`);
  const glare = useMotionTemplate`radial-gradient(420px circle at ${glareX} ${glareY}, rgba(125,211,252,0.28), transparent 58%)`;

  const onMove = (e: ReactMouseEvent) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => {
        mx.set(0.5);
        my.set(0.5);
      }}
      className="relative overflow-hidden py-4 md:py-8"
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: glare }}
      />

      {/* نور عبوری روی کلمه انگلیسی */}
      {!reduce ? (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-y-[12%] start-0 z-20 w-1/3 skew-x-[-18deg] bg-gradient-to-l from-transparent via-white/25 to-transparent blur-md"
          animate={{ x: ["-40%", "140%"] }}
          transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut", repeatDelay: 2.4 }}
        />
      ) : null}

      <p className="relative z-10 mb-4 text-center text-[11px] font-semibold tracking-[0.42em] text-sky-200/80 md:text-xs">
        PRIVATE BROKERAGE · KARAJ
      </p>

      <motion.h2
        className="rio-display relative z-10 select-none text-center font-semibold leading-[0.86] tracking-[-0.04em] text-white"
        style={{ fontSize: "clamp(2.6rem, 11.5vw, 8.75rem)" }}
        initial={reduce ? false : { opacity: 0, y: 36 }}
        whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={IOS_PAGE_SPRING}
        aria-label={word}
      >
        {letters.map((ch, i) => (
          <motion.span
            key={`${ch}-${i}`}
            className="inline-block"
            initial={reduce ? false : { opacity: 0, y: 42, rotateX: 48 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ ...IOS_PAGE_SPRING, delay: i * 0.04 }}
            whileHover={
              reduce
                ? undefined
                : {
                    y: -8,
                    color: "#7DD3FC",
                    transition: IOS_TAP_SPRING,
                  }
            }
            style={{
              transformStyle: "preserve-3d",
              perspective: 800,
            }}
          >
            {ch === " " ? "\u00A0" : ch}
          </motion.span>
        ))}
      </motion.h2>

      <div className="relative z-10 mx-auto mt-6 flex max-w-2xl flex-col items-center gap-2 text-center">
        <p className="rio-display text-sm tracking-[0.28em] text-sky-100/90 md:text-base">
          Derakhshan Properties
        </p>
        <p className="font-vazirmatn text-lg font-bold text-white md:text-xl">
          {siteConfig.brand.nameFa}
        </p>
        <p className="font-vazirmatn text-sm leading-7 text-sky-100/75 md:text-base">
          {siteConfig.brand.taglineFa}
        </p>
      </div>
    </div>
  );
}

function SpotlightCta({ reduce }: { reduce: boolean | null }) {
  const footer = siteConfig.footer;
  return (
    <motion.section
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={IOS_PAGE_SPRING}
      className="relative overflow-hidden border-y border-white/10 py-10 md:py-14"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,163,255,0.16),transparent_62%)]"
      />
      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <p className="text-[11px] font-semibold tracking-[0.32em] text-sky-300 md:text-xs">
          DERAKHSHAN · VIP DESK
        </p>
        <h3 className="mt-4 font-vazirmatn text-2xl font-black leading-tight tracking-tight text-white md:text-4xl lg:text-[2.75rem]">
          {footer.ctaTitle}
        </h3>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <motion.div
            whileHover={reduce ? undefined : { y: -3, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={IOS_TAP_SPRING}
          >
            <Link
              href={footer.ctaPrimary.href}
              className="ios-tap-target inline-flex items-center gap-2 rounded-full bg-sky-400 px-6 py-3.5 text-sm font-bold text-[#071A2C]"
            >
              <Sparkles className="h-4 w-4" />
              {footer.ctaPrimary.label}
            </Link>
          </motion.div>
          <motion.div
            whileHover={reduce ? undefined : { y: -3, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={IOS_TAP_SPRING}
          >
            <a
              href={`tel:${SITE.phone.replace(/\s/g, "")}`}
              className="ios-tap-target inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.04] px-6 py-3.5 text-sm font-bold text-white transition hover:border-sky-300/50 hover:text-sky-100"
            >
              <Phone className="h-4 w-4 text-sky-300" />
              {footer.ctaSecondaryLabel}
            </a>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

function LiveStatus({ time }: { time: string }) {
  const footer = siteConfig.footer;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={IOS_PAGE_SPRING}
      className="grid gap-5 md:grid-cols-[auto_1fr] md:items-center"
    >
      <div className="inline-flex items-center gap-3 rounded-2xl border border-white/12 bg-black/20 px-4 py-3 backdrop-blur-md">
        <Clock3 className="h-4 w-4 text-sky-300" />
        <div>
          <p className="text-[11px] text-slate-400">{footer.clockLabel}</p>
          <p className="font-mono text-lg tracking-[0.14em] text-sky-200 tabular-nums">
            {time || "\u00a0\u00a0:\u00a0\u00a0:\u00a0\u00a0"}
          </p>
        </div>
      </div>
      <div className="space-y-2">
        <p className="inline-flex items-center gap-2 text-xs font-semibold text-sky-100">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-400" />
          </span>
          {footer.statusBadge}
        </p>
        <p className="inline-flex items-start gap-2 text-sm leading-7 text-slate-300">
          <MapPin className="mt-1 h-4 w-4 shrink-0 text-sky-300" />
          <span>
            {SITE.address.line1}
            <span className="mt-1 block text-xs text-slate-500">
              {SITE.phone} · {SITE.email}
            </span>
          </span>
        </p>
      </div>
    </motion.div>
  );
}

function FooterLink({ href, label, index }: { href: string; label: string; index: number }) {
  return (
    <motion.li
      initial={{ opacity: 0, x: 12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ ...IOS_PAGE_SPRING, delay: Math.min(index, 8) * 0.035 }}
    >
      <Link
        href={href}
        className="group relative inline-flex text-sm text-slate-300 transition-colors hover:text-sky-200"
      >
        <span>{label}</span>
        <span
          aria-hidden
          className="absolute inset-x-0 -bottom-0.5 h-px origin-right scale-x-0 bg-sky-300/80 transition-transform duration-300 group-hover:origin-left group-hover:scale-x-100"
        />
      </Link>
    </motion.li>
  );
}

function MagneticSocial({
  href,
  label,
  icon: Icon,
  reduce,
}: {
  href: string;
  label: string;
  icon: LucideIcon;
  reduce: boolean | null;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, IOS_TAP_SPRING);
  const sy = useSpring(y, IOS_TAP_SPRING);

  const onMove = (e: ReactMouseEvent) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * 0.32);
    y.set((e.clientY - r.top - r.height / 2) * 0.32);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      onMouseMove={onMove}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      style={{ x: sx, y: sy }}
      whileTap={{ scale: 0.94 }}
      className="ios-tap-target inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/12 bg-white/[0.04] text-sky-200 transition hover:border-sky-300/45 hover:bg-sky-400/10 hover:text-white"
    >
      <Icon className="h-5 w-5" />
    </motion.a>
  );
}

function NewsletterBlock({ reduce }: { reduce: boolean | null }) {
  const footer = siteConfig.footer;
  const [contact, setContact] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const focused = useMotionValue(0);
  const borderOpacity = useSpring(focused, { stiffness: 200, damping: 24 });
  const ring = useTransform(borderOpacity, (v) => `0 0 0 ${v * 3}px rgba(125, 211, 252, 0.22)`);

  async function onNewsletter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!contact.trim() || status === "loading") return;
    setStatus("loading");
    const looksEmail = contact.includes("@");
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "عضویت خبرنامه",
        email: looksEmail ? contact.trim() : "",
        phone: looksEmail ? "" : contact.trim(),
        message: "درخواست عضویت در خبرنامه فایل‌های محرمانه",
        tab: "newsletter",
      }),
    });
    setStatus(res.ok ? "success" : "idle");
    if (res.ok) {
      setContact("");
      window.setTimeout(() => setStatus("idle"), 2800);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={IOS_PAGE_SPRING}
      className="relative overflow-hidden rounded-[1.6rem] border border-white/12 bg-white/[0.04] p-6 md:p-8"
    >
      <div className="relative z-10 grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.22em] text-sky-300 md:text-xs">
            {footer.newsletterEyebrow}
          </p>
          <h3 className="mt-3 font-vazirmatn text-2xl font-black text-white md:text-3xl">
            {footer.newsletterTitle}
          </h3>
          <p className="mt-3 max-w-xl text-sm leading-7 text-slate-400">{footer.newsletterBody}</p>
        </div>

        <form onSubmit={onNewsletter} className="space-y-3">
          <label className="block text-xs font-semibold text-slate-400">{footer.newsletterLabel}</label>
          <motion.div
            className="flex gap-2 rounded-2xl border border-white/12 bg-[#071A2C]/55 p-1.5"
            style={{ boxShadow: ring }}
          >
            <input
              required
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              onFocus={() => focused.set(1)}
              onBlur={() => focused.set(0)}
              placeholder={footer.newsletterPlaceholder}
              className="w-full bg-transparent px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-500"
            />
            <motion.button
              type="submit"
              disabled={status === "loading"}
              whileHover={reduce ? undefined : { scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              transition={IOS_TAP_SPRING}
              className="ios-tap-target inline-flex h-11 shrink-0 items-center justify-center gap-1.5 rounded-xl bg-sky-400 px-4 text-sm font-bold text-[#071A2C] disabled:opacity-60"
              aria-label="عضویت در خبرنامه"
            >
              عضویت
              <ArrowLeft className="h-4 w-4" />
            </motion.button>
          </motion.div>
          <AnimatePresence>
            {status === "success" ? (
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-xs font-semibold text-sky-300"
              >
                {footer.newsletterSuccess}
              </motion.p>
            ) : null}
          </AnimatePresence>
        </form>
      </div>
    </motion.div>
  );
}

export default function Footer() {
  const reduceMotion = useReducedMotion();
  const footer = siteConfig.footer;
  const [time, setTime] = useState("");
  const [showTop, setShowTop] = useState(false);
  const rootRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: ["start end", "end end"],
  });
  const rise = useTransform(scrollYProgress, [0, 1], [36, 0]);
  const fade = useTransform(scrollYProgress, [0, 0.35], [0.7, 1]);

  useEffect(() => {
    const tick = () => setTime(formatTehranTime(new Date()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  }, [reduceMotion]);

  return (
    <footer
      ref={rootRef}
      dir="rtl"
      className="relative overflow-hidden font-vazirmatn text-white"
    >
      <IceField reduce={reduceMotion} />

      <motion.div
        className="relative z-10"
        style={reduceMotion ? undefined : { y: rise, opacity: fade }}
      >
        <NeighborhoodRibbon />

        <div className="rio-container space-y-12 py-12 md:space-y-16 md:py-20 lg:py-24">
          <BrandBillboard reduce={reduceMotion} />
          <SpotlightCta reduce={reduceMotion} />
          <LiveStatus time={time} />
          <NewsletterBlock reduce={reduceMotion} />

          <section className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="mb-4 text-sm font-bold tracking-wide text-sky-300">
                {footer.columns.brand.title}
              </p>
              <ul className="space-y-3">
                {PROPERTY_LINKS.map((item, i) => (
                  <FooterLink key={item.label} href={item.href} label={item.label} index={i} />
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-4 text-sm font-bold tracking-wide text-sky-300">
                {footer.columns.services.title}
              </p>
              <ul className="space-y-3">
                {SERVICE_LINKS.map((item, i) => (
                  <FooterLink key={item.label} href={item.href} label={item.label} index={i} />
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-4 text-sm font-bold tracking-wide text-sky-300">
                {footer.columns.panels.title}
              </p>
              <ul className="space-y-3">
                {PANEL_LINKS.map((item, i) => (
                  <FooterLink key={item.label} href={item.href} label={item.label} index={i} />
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-4 text-sm font-bold tracking-wide text-sky-300">
                {footer.columns.legal.title}
              </p>
              <ul className="space-y-3">
                {LEGAL_LINKS.map((item, i) => (
                  <FooterLink key={item.label} href={item.href} label={item.label} index={i} />
                ))}
              </ul>
              <div className="mt-5 flex flex-wrap gap-2.5">
                {SOCIAL_LINKS.map((item) => (
                  <MagneticSocial
                    key={item.label}
                    href={item.href}
                    label={item.label}
                    icon={item.icon}
                    reduce={reduceMotion}
                  />
                ))}
                <MagneticSocial
                  href={`tel:${SITE.phone.replace(/\s/g, "")}`}
                  label={SITE.phone}
                  icon={Phone}
                  reduce={reduceMotion}
                />
              </div>
            </div>
          </section>

          <section className="relative flex flex-col gap-5 border-t border-white/10 pt-8 md:flex-row md:items-center md:justify-between">
            <motion.span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-px origin-center bg-gradient-to-l from-transparent via-sky-300/70 to-transparent"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1] }}
            />
            <div className="space-y-2">
              <p className="rio-display text-xs tracking-[0.2em] text-sky-100/80">
                DERAKHSHAN PROPERTIES
              </p>
              <p className="text-xs leading-6 text-slate-400 md:text-sm">{footer.copyright}</p>
              <p className="inline-flex items-center gap-2 text-[11px] text-slate-500">
                <ShieldCheck className="h-3.5 w-3.5 text-sky-400" />
                {footer.privacyNote}
              </p>
            </div>
            <div className="flex flex-wrap gap-4 text-xs text-slate-500">
              {NAV.slice(0, 4).map((item) => (
                <Link key={item.href} href={item.href} className="transition hover:text-sky-300">
                  {item.label}
                </Link>
              ))}
            </div>
          </section>
        </div>
      </motion.div>

      <AnimatePresence>
        {showTop ? (
          <motion.button
            type="button"
            aria-label={footer.backToTop}
            onClick={scrollTop}
            initial={{ opacity: 0, y: 18, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.9 }}
            whileHover={reduceMotion ? undefined : { y: -5, scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={IOS_PAGE_SPRING}
            className={cn(
              "ios-tap-target fixed bottom-5 start-5 z-50 inline-flex items-center gap-2 rounded-full border border-sky-300/30 bg-[#071A2C]/88 px-4 py-3 text-xs font-bold text-sky-50 backdrop-blur-xl md:bottom-8 md:start-8",
            )}
          >
            <ArrowUp className="h-4 w-4 text-sky-300" />
            {footer.backToTop}
          </motion.button>
        ) : null}
      </AnimatePresence>
    </footer>
  );
}
