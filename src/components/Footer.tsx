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

const SOCIAL_LINKS = siteConfig.footer.socialLinks.map((item) => ({
  ...item,
  icon: FOOTER_ICONS[item.icon as SiteIconKey] ?? MessageCircle,
}));

const MARQUEE_ITEMS = [
  siteConfig.brand.taglineFa,
  "پنت‌هاوس · زعفرانیه",
  "ویلا · فرمانیه",
  "آف‌مارکت VIP",
  "الهیه · فرشته",
  siteConfig.brand.brandEn,
  "مشاوره محرمانه",
  "نیاوران · جماران",
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

/** پس‌زمینه اورورا — فقط transform/opacity */
function AuroraField({ reduce }: { reduce: boolean | null }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <motion.div
        className="absolute -end-[20%] -top-[30%] h-[70vmax] w-[70vmax] rounded-full bg-cyan-400/20 blur-[100px]"
        animate={reduce ? undefined : { x: [0, 80, -40, 0], y: [0, 50, -30, 0], scale: [1, 1.12, 0.94, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -start-[15%] top-[40%] h-[55vmax] w-[55vmax] rounded-full bg-sky-600/15 blur-[110px]"
        animate={reduce ? undefined : { x: [0, -60, 30, 0], y: [0, -40, 20, 0], scale: [1, 0.9, 1.08, 1] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-l from-transparent via-cyan-400/50 to-transparent"
        animate={reduce ? undefined : { opacity: [0.25, 0.7, 0.25] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_transparent_30%,_#070C18_78%)]" />
    </div>
  );
}

function MarqueeRibbon({ reverse = false }: { reverse?: boolean }) {
  const row = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div className="relative overflow-hidden border-y border-white/10 bg-white/[0.02] py-3.5">
      <div
        className={cn(
          "flex w-max gap-10 whitespace-nowrap will-change-transform",
          reverse ? "animate-marquee-reverse" : "animate-marquee",
        )}
        style={{ animationDuration: reverse ? "42s" : "36s" }}
      >
        {row.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="inline-flex items-center gap-10 text-[11px] font-semibold tracking-[0.22em] text-slate-400 md:text-xs"
          >
            <span className="text-cyan-300/80">{item}</span>
            <span className="h-1 w-1 rounded-full bg-cyan-400/60" />
          </span>
        ))}
      </div>
    </div>
  );
}

/** برند غول‌پیکر با واکنش به موس روی دسکتاپ */
function BrandBillboard({ reduce }: { reduce: boolean | null }) {
  const word = siteConfig.brand.watermark || "DERAKHSHAN";
  const letters = word.split("");
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const sx = useSpring(mx, { stiffness: 120, damping: 22 });
  const sy = useSpring(my, { stiffness: 120, damping: 22 });
  const glareX = useTransform(sx, (v) => `${v * 100}%`);
  const glareY = useTransform(sy, (v) => `${v * 100}%`);
  const glare = useMotionTemplate`radial-gradient(520px circle at ${glareX} ${glareY}, rgba(0,240,255,0.22), transparent 55%)`;

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
      className="relative overflow-hidden py-6 md:py-10"
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{ background: glare }}
      />
      <motion.p
        className="relative z-10 select-none text-center font-black leading-[0.85] tracking-[-0.04em] text-white"
        style={{ fontSize: "clamp(2.8rem, 12vw, 9.5rem)" }}
        initial={reduce ? false : { opacity: 0, y: 40 }}
        whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={IOS_PAGE_SPRING}
      >
        {letters.map((ch, i) => (
          <motion.span
            key={`${ch}-${i}`}
            className="inline-block"
            initial={reduce ? false : { opacity: 0, y: 36, rotateX: 40 }}
            whileInView={
              reduce
                ? undefined
                : { opacity: 1, y: 0, rotateX: 0 }
            }
            viewport={{ once: true, amount: 0.5 }}
            transition={{ ...IOS_PAGE_SPRING, delay: i * 0.035 }}
            whileHover={
              reduce
                ? undefined
                : {
                    y: -10,
                    color: "#67E8F9",
                    textShadow: "0 0 40px rgba(0,240,255,0.45)",
                    transition: IOS_TAP_SPRING,
                  }
            }
            style={{ transformStyle: "preserve-3d" }}
          >
            {ch === " " ? "\u00A0" : ch}
          </motion.span>
        ))}
      </motion.p>
      <p className="relative z-10 mt-4 text-center text-sm tracking-[0.28em] text-cyan-300/90 md:text-base">
        {siteConfig.brand.nameFa}
      </p>
    </div>
  );
}

function SpotlightCta({ reduce }: { reduce: boolean | null }) {
  const footer = siteConfig.footer;
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(50);
  const my = useMotionValue(40);
  const sx = useSpring(mx, { stiffness: 80, damping: 20 });
  const sy = useSpring(my, { stiffness: 80, damping: 20 });
  const spotlight = useMotionTemplate`radial-gradient(520px circle at ${sx}% ${sy}%, rgba(0,240,255,0.18), transparent 50%)`;

  return (
    <motion.div
      ref={ref}
      onMouseMove={(e) => {
        if (reduce || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        mx.set(((e.clientX - r.left) / r.width) * 100);
        my.set(((e.clientY - r.top) / r.height) * 100);
      }}
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={IOS_PAGE_SPRING}
      className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-7 md:rounded-[2rem] md:p-12"
    >
      <motion.div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: spotlight }} />
      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <motion.p
          className="text-[11px] font-semibold tracking-[0.3em] text-cyan-300 md:text-xs"
          animate={reduce ? undefined : { opacity: [0.55, 1, 0.55] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        >
          {siteConfig.brand.shortNameFa}
        </motion.p>
        <h2 className="mt-4 font-vazirmatn text-2xl font-black leading-tight tracking-tight md:text-4xl lg:text-5xl">
          {footer.ctaTitle}
        </h2>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <motion.div whileHover={reduce ? undefined : { y: -4, scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={IOS_TAP_SPRING}>
            <Link
              href={footer.ctaPrimary.href}
              className="ios-tap-target inline-flex items-center gap-2 rounded-full bg-cyan-400 px-6 py-3.5 text-sm font-bold text-slate-950"
            >
              <Sparkles className="h-4 w-4" />
              {footer.ctaPrimary.label}
            </Link>
          </motion.div>
          <motion.div whileHover={reduce ? undefined : { y: -4, scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={IOS_TAP_SPRING}>
            <a
              href={`tel:${SITE.phone.replace(/\s/g, "")}`}
              className="ios-tap-target inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-6 py-3.5 text-sm font-bold text-white backdrop-blur-md transition hover:border-cyan-400/40 hover:text-cyan-200"
            >
              <Phone className="h-4 w-4 text-cyan-300" />
              {footer.ctaSecondaryLabel}
            </a>
          </motion.div>
        </div>
      </div>
    </motion.div>
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
      className="grid gap-4 md:grid-cols-[auto_1fr] md:items-center"
    >
      <div className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-black/25 px-4 py-3 backdrop-blur-md">
        <motion.span
          animate={{ rotate: [0, 8, -8, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <Clock3 className="h-4 w-4 text-cyan-300" />
        </motion.span>
        <div>
          <p className="text-[11px] text-slate-400">{footer.clockLabel}</p>
          <p className="font-mono text-lg tracking-[0.14em] text-cyan-300 tabular-nums">
            {time || "\u00a0\u00a0:\u00a0\u00a0:\u00a0\u00a0"}
          </p>
        </div>
      </div>
      <div className="space-y-2">
        <p className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-200">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
          </span>
          {footer.statusBadge}
        </p>
        <p className="inline-flex items-start gap-2 text-sm leading-7 text-slate-300">
          <MapPin className="mt-1 h-4 w-4 shrink-0 text-cyan-300" />
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
      transition={{ ...IOS_PAGE_SPRING, delay: Math.min(index, 8) * 0.04 }}
    >
      <Link
        href={href}
        className="group relative inline-flex text-sm text-slate-300 transition-colors hover:text-cyan-200"
      >
        <span>{label}</span>
        <motion.span
          aria-hidden
          className="absolute inset-x-0 -bottom-0.5 h-px origin-right scale-x-0 bg-cyan-400/80 transition-transform duration-300 group-hover:origin-left group-hover:scale-x-100"
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
    x.set((e.clientX - r.left - r.width / 2) * 0.35);
    y.set((e.clientY - r.top - r.height / 2) * 0.35);
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
      className="ios-tap-target inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-cyan-300 transition hover:border-cyan-400/40 hover:bg-cyan-400/10 hover:text-cyan-100"
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
  const ring = useTransform(
    borderOpacity,
    (v) => `0 0 0 ${v * 4}px rgba(0, 240, 255, 0.18)`,
  );

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
      className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-gradient-to-br from-white/[0.06] to-transparent p-6 md:p-8"
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -end-10 -top-10 h-40 w-40 rounded-full bg-cyan-400/20 blur-3xl"
        animate={reduce ? undefined : { scale: [1, 1.2, 1], opacity: [0.25, 0.45, 0.25] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="relative z-10 grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.22em] text-cyan-300 md:text-xs">
            {footer.newsletterEyebrow}
          </p>
          <h3 className="mt-3 font-vazirmatn text-2xl font-black md:text-3xl">{footer.newsletterTitle}</h3>
          <p className="mt-3 max-w-xl text-sm leading-7 text-slate-400">{footer.newsletterBody}</p>
        </div>

        <form onSubmit={onNewsletter} className="space-y-3">
          <label className="block text-xs font-semibold text-slate-400">{footer.newsletterLabel}</label>
          <motion.div
            className="flex gap-2 rounded-2xl border border-white/10 bg-black/30 p-1.5"
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
              whileHover={reduce ? undefined : { scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={IOS_TAP_SPRING}
              className="ios-tap-target inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-400 text-slate-950 disabled:opacity-60"
              aria-label="عضویت در خبرنامه"
            >
              <ArrowLeft className="h-5 w-5" />
            </motion.button>
          </motion.div>
          <AnimatePresence>
            {status === "success" ? (
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-xs font-semibold text-cyan-300"
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
  const rise = useTransform(scrollYProgress, [0, 1], [40, 0]);
  const fade = useTransform(scrollYProgress, [0, 0.35], [0.65, 1]);

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
      className="relative overflow-hidden bg-[#070C18] font-vazirmatn text-white"
    >
      <AuroraField reduce={reduceMotion} />

      <motion.div
        className="relative z-10"
        style={reduceMotion ? undefined : { y: rise, opacity: fade }}
      >
        <MarqueeRibbon />
        <MarqueeRibbon reverse />

        <div className="rio-container space-y-12 py-12 md:space-y-16 md:py-20 lg:space-y-20 lg:py-24">
          <BrandBillboard reduce={reduceMotion} />
          <SpotlightCta reduce={reduceMotion} />
          <LiveStatus time={time} />
          <NewsletterBlock reduce={reduceMotion} />

          <section className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="mb-4 text-sm font-bold tracking-wide text-cyan-300">
                {footer.columns.brand.title}
              </p>
              <ul className="space-y-3">
                {PROPERTY_LINKS.map((item, i) => (
                  <FooterLink key={item.label} href={item.href} label={item.label} index={i} />
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-4 text-sm font-bold tracking-wide text-cyan-300">
                {footer.columns.services.title}
              </p>
              <ul className="space-y-3">
                {SERVICE_LINKS.map((item, i) => (
                  <FooterLink key={item.label} href={item.href} label={item.label} index={i} />
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-4 text-sm font-bold tracking-wide text-cyan-300">
                {footer.columns.panels.title}
              </p>
              <ul className="space-y-3">
                {PANEL_LINKS.map((item, i) => (
                  <FooterLink key={item.label} href={item.href} label={item.label} index={i} />
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-4 text-sm font-bold tracking-wide text-cyan-300">
                {footer.columns.socialTitle}
              </p>
              <div className="flex flex-wrap gap-2.5">
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
              className="pointer-events-none absolute inset-x-0 top-0 h-px origin-center bg-gradient-to-l from-transparent via-cyan-400/70 to-transparent"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            />
            <div className="space-y-2">
              <p className="text-xs leading-6 text-slate-400 md:text-sm">{footer.copyright}</p>
              <p className="inline-flex items-center gap-2 text-[11px] text-slate-500">
                <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
                {footer.privacyNote}
              </p>
            </div>
            <div className="flex flex-wrap gap-4 text-xs text-slate-500">
              {NAV.slice(0, 4).map((item) => (
                <Link key={item.href} href={item.href} className="transition hover:text-cyan-300">
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
            className="ios-tap-target fixed bottom-5 start-5 z-50 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-[#070C18]/85 px-4 py-3 text-xs font-bold text-cyan-100 backdrop-blur-xl md:bottom-8 md:start-8"
          >
            <ArrowUp className="h-4 w-4 text-cyan-300" />
            {footer.backToTop}
          </motion.button>
        ) : null}
      </AnimatePresence>
    </footer>
  );
}
