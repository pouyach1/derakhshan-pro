"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowUpLeft } from "lucide-react";
import { INTRO_CTA, SIGNAL_NEIGHBORHOODS, TRUST_STATS } from "@/config/home";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * سیگنال بازار خصوصی — جایگزین بنر «نسخه نمایشی» و نوار آمار تخت.
 * تعامل موس: Architectural Pulse (خط معماری → نقطه اتصال → پالس آرام).
 * بدون رادار/سونار/دنبال‌کردن موس؛ فوتر تعامل جداگانه دارد.
 */
export default function MarketSignalSection() {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.28 });

  return (
    <section
      ref={sectionRef}
      aria-label="سیگنال اعتماد دفتر"
      className="relative overflow-hidden bg-[#071520] text-white"
    >
      {/* Atmosphere — کاملاً ایستا در حالت idle */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(0,163,255,0.14),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_80%,rgba(11,58,92,0.45),transparent_45%)]" />
        <StaticNeighborhoods />
      </div>

      <div className="rio-container relative z-10 py-16 md:py-24 lg:py-28">
        <div className="grid items-end gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div>
            <motion.p
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.7, ease: EASE.expoOut }}
              className="font-vazirmatn text-[11px] font-semibold tracking-[0.28em] text-sky-300/90"
            >
              {INTRO_CTA.eyebrow}
            </motion.p>

            <motion.h2
              initial={reduceMotion ? false : { opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.85, delay: 0.08, ease: EASE.expoOut }}
              className="mt-4 max-w-3xl font-vazirmatn text-[clamp(1.85rem,4.6vw,3.35rem)] font-bold leading-[1.35] tracking-tight text-white"
            >
              {INTRO_CTA.title}
            </motion.h2>

            <InkLine active={inView && !reduceMotion} />

            <motion.p
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.75, delay: 0.22, ease: EASE.expoOut }}
              className="mt-6 max-w-xl font-vazirmatn text-sm leading-8 text-white/70 md:text-base md:leading-8"
            >
              {INTRO_CTA.body}
            </motion.p>

            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.7, delay: 0.34, ease: EASE.expoOut }}
              className="mt-8"
            >
              <ArchitecturalPulseCta
                href={INTRO_CTA.cta.href}
                label={INTRO_CTA.cta.label}
              />
            </motion.div>
          </div>

          <ProofMarks active={inView} reduceMotion={!!reduceMotion} />
        </div>
      </div>
    </section>
  );
}

/**
 * خط معماری → گوشه → نقطه اتصال → پالس یک‌باره روی hover دسکتاپ.
 * پیاده‌سازی با CSS (transform/opacity/stroke)؛ بدون حلقهٔ دائمی.
 */
function ArchitecturalPulseCta({ href, label }: { href: string; label: string }) {
  return (
    <div className="relative inline-block">
      {/*
        ترتیب DOM مهم است: .arch-pulse + .arch-pulse-mark
        تا hover/focus فقط با CSS sibling فعال شود — بدون state ری‌اکت.
      */}
      <Link
        href={href}
        className="arch-pulse ios-tap-target group inline-flex min-h-12 items-center gap-2.5 rounded-full bg-sky-500 px-6 py-3 font-vazirmatn text-sm font-semibold text-white shadow-[0_18px_50px_-18px_rgba(0,163,255,0.85)] transition-colors duration-300 hover:bg-sky-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-200/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#071520]"
      >
        {label}
        <ArrowUpLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </Link>

      <span
        className="arch-pulse-mark pointer-events-none absolute start-3 top-[calc(100%+0.65rem)] hidden h-[52px] w-[92px] lg:block"
        aria-hidden
      >
        <svg viewBox="0 0 92 52" fill="none" className="h-full w-full overflow-visible">
          <path
            className="arch-pulse-line"
            d="M4 2 H74 V38"
            stroke="rgba(186,230,253,0.55)"
            strokeWidth="1"
            strokeLinecap="square"
            strokeLinejoin="miter"
          />
          <circle
            className="arch-pulse-point"
            cx="74"
            cy="38"
            r="2.25"
            fill="rgba(224,242,254,0.55)"
          />
          <circle
            className="arch-pulse-ring"
            cx="74"
            cy="38"
            r="2.25"
            fill="none"
            stroke="rgba(186,230,253,0.45)"
            strokeWidth="1"
          />
        </svg>
      </span>
    </div>
  );
}

function InkLine({ active }: { active: boolean }) {
  return (
    <svg
      className="mt-6 h-3 w-full max-w-md overflow-visible"
      viewBox="0 0 420 12"
      fill="none"
      aria-hidden
    >
      <motion.path
        d="M2 8 C 70 2, 140 14, 210 7 S 350 2, 418 8"
        stroke="url(#signal-ink)"
        strokeWidth="2.2"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0.2 }}
        animate={active ? { pathLength: 1, opacity: 1 } : undefined}
        transition={{ duration: 1.35, ease: EASE.expoOut, delay: 0.18 }}
      />
      <defs>
        <linearGradient id="signal-ink" x1="0" y1="0" x2="420" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="#38BDF8" />
          <stop offset="0.55" stopColor="#00A3FF" />
          <stop offset="1" stopColor="#0B3A5C" stopOpacity="0.2" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/** نام محله‌ها — ایستا، بدون حلقهٔ شناور یا واکنش به موس */
function StaticNeighborhoods() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      {SIGNAL_NEIGHBORHOODS.map((name, index) => {
        const top = 12 + ((index * 11) % 70);
        const side = index % 2 === 0 ? "start" : "end";
        const inset = 4 + ((index * 7) % 28);
        return (
          <span
            key={name}
            className="absolute font-vazirmatn text-[11px] font-medium tracking-[0.18em] text-sky-100/20 md:text-xs"
            style={{
              top: `${top}%`,
              ...(side === "start" ? { right: `${inset}%` } : { left: `${inset}%` }),
            }}
          >
            {name}
          </span>
        );
      })}
    </div>
  );
}

function ProofMarks({ active, reduceMotion }: { active: boolean; reduceMotion: boolean }) {
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      animate={active ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.8, delay: 0.2, ease: EASE.expoOut }}
      className="relative"
    >
      <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-white/[0.07] via-transparent to-sky-400/10 blur-xl" />
      <ol className="relative grid gap-0 overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.04] backdrop-blur-xl">
        {TRUST_STATS.map((stat, index) => (
          <motion.li
            key={stat.label}
            initial={reduceMotion ? false : { opacity: 0, x: 18 }}
            animate={active ? { opacity: 1, x: 0 } : undefined}
            transition={{ duration: 0.65, delay: 0.28 + index * 0.1, ease: EASE.expoOut }}
            className={cn(
              "group relative grid grid-cols-[auto_1fr] gap-4 px-5 py-5 sm:px-6 sm:py-6",
              index < TRUST_STATS.length - 1 ? "border-b border-white/10" : "",
            )}
          >
            <span className="relative mt-1 flex h-10 w-10 items-center justify-center">
              <span className="absolute inset-0 rounded-full bg-sky-400/10 ring-1 ring-sky-300/25 transition group-hover:bg-sky-400/20" />
              <span className="absolute inset-1 rounded-full border border-sky-300/35" />
              <span className="relative font-vazirmatn text-[11px] font-bold tabular-nums text-sky-300">
                {(index + 1).toLocaleString("fa-IR")}
              </span>
            </span>
            <div className="min-w-0">
              <p className="font-vazirmatn text-2xl font-bold tracking-tight text-white sm:text-[1.65rem]">
                <RevealValue value={stat.value} active={active} reduceMotion={reduceMotion} />
              </p>
              <p className="mt-1 font-vazirmatn text-sm font-semibold text-sky-200/90">{stat.label}</p>
              {"hint" in stat && stat.hint ? (
                <p className="mt-1 font-vazirmatn text-xs leading-6 text-white/45">{stat.hint}</p>
              ) : null}
            </div>
            <span className="pointer-events-none absolute inset-y-0 start-0 w-0.5 origin-top scale-y-0 bg-gradient-to-b from-sky-300 to-sky-500 transition duration-500 group-hover:scale-y-100" />
          </motion.li>
        ))}
      </ol>
    </motion.div>
  );
}

function RevealValue({
  value,
  active,
  reduceMotion,
}: {
  value: string;
  active: boolean;
  reduceMotion: boolean;
}) {
  const [shown, setShown] = useState(reduceMotion ? value : "");

  useEffect(() => {
    if (!active) return;
    if (reduceMotion) {
      setShown(value);
      return;
    }
    let frame = 0;
    const glyphs = "۰۱۲۳۴۵۶۷۸۹+٪میلیارد ";
    const ticks = 14;
    const id = window.setInterval(() => {
      frame += 1;
      if (frame >= ticks) {
        setShown(value);
        window.clearInterval(id);
        return;
      }
      setShown(
        value
          .split("")
          .map((ch, i) => {
            if (ch === " " || ch === "+" || ch === "٪" || /[آ-ی]/.test(ch)) return ch;
            if (frame / ticks > i / Math.max(value.length, 1)) return ch;
            return glyphs[Math.floor(Math.random() * 10)] ?? ch;
          })
          .join(""),
      );
    }, 38);
    return () => window.clearInterval(id);
  }, [active, reduceMotion, value]);

  return <span className="tabular-nums">{shown || "···"}</span>;
}
