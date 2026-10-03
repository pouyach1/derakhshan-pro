"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowUpLeft } from "lucide-react";
import { INTRO_CTA, SIGNAL_NEIGHBORHOODS, TRUST_STATS } from "@/config/home";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * سیگنال بازار خصوصی.
 * تعامل: «برگ پرونده» — با hover روی CTA، یک برگهٔ محرمانه از زیر دکمه بیرون می‌آید.
 * استعارهٔ املاک واقعی (پرونده)، نه خط/نقطه/پالس تمپلیت AI.
 */
export default function MarketSignalSection() {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.28 });

  return (
    <section
      ref={sectionRef}
      aria-label="سیگنال اعتماد دفتر"
      className="relative overflow-hidden bg-[#0A1622] text-white"
    >
      {/* فضای آرام تحریری — بدون رادار، بدون برچسب‌های شناور */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_70%_0%,rgba(148,180,204,0.12),transparent_58%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),transparent_40%,rgba(0,0,0,0.18))]" />
        <div
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-white/20 to-transparent"
        />
      </div>

      <div className="rio-container relative z-10 py-16 md:py-24 lg:py-28">
        <div className="grid items-end gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div>
            <motion.p
              initial={reduceMotion ? false : { opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.65, ease: EASE.expoOut }}
              className="font-vazirmatn text-[11px] font-semibold tracking-[0.28em] text-sky-200/80"
            >
              {INTRO_CTA.eyebrow}
            </motion.p>

            <motion.h2
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.8, delay: 0.06, ease: EASE.expoOut }}
              className="mt-4 max-w-3xl font-vazirmatn text-[clamp(1.85rem,4.6vw,3.35rem)] font-bold leading-[1.35] tracking-tight text-white"
            >
              {INTRO_CTA.title}
            </motion.h2>

            {/* خط تحریری ساده — نه موج نئونی */}
            <motion.span
              aria-hidden
              className="mt-6 block h-px max-w-[12rem] origin-right bg-white/35"
              initial={reduceMotion ? false : { scaleX: 0, opacity: 0 }}
              animate={inView ? { scaleX: 1, opacity: 1 } : undefined}
              transition={{ duration: 0.7, delay: 0.16, ease: EASE.expoOut }}
            />

            <motion.p
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.7, delay: 0.2, ease: EASE.expoOut }}
              className="mt-6 max-w-xl font-vazirmatn text-sm leading-8 text-white/68 md:text-base md:leading-8"
            >
              {INTRO_CTA.body}
            </motion.p>

            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.65, delay: 0.3, ease: EASE.expoOut }}
              className="mt-8"
            >
              <PrivateDossierCta
                href={INTRO_CTA.cta.href}
                label={INTRO_CTA.cta.label}
                neighborhood={SIGNAL_NEIGHBORHOODS[0] ?? "گوهردشت"}
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
 * برگ پروندهٔ خصوصی:
 * با hover دسکتاپ، یک برگه از زیر دکمه بیرون می‌آید — تب محرمانه، محله، شبح نمای خانه.
 * فقط transform/opacity؛ بدون حلقهٔ دائمی؛ روی لمس فقط خود دکمه می‌ماند.
 */
function PrivateDossierCta({
  href,
  label,
  neighborhood,
}: {
  href: string;
  label: string;
  neighborhood: string;
}) {
  return (
    <div className="signal-dossier group relative inline-block">
      <Link
        href={href}
        className="signal-dossier-trigger ios-tap-target relative z-10 inline-flex min-h-12 items-center gap-2.5 rounded-full bg-[#E8F1F7] px-6 py-3 font-vazirmatn text-sm font-semibold text-[#0A1622] transition-colors duration-300 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A1622]"
      >
        {label}
        <ArrowUpLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </Link>

      {/* برگه زیر دکمه — فقط opacity/transform؛ فضا از قبل روی lg رزرو شده */}
      <div
        className="signal-dossier-sheet pointer-events-none absolute start-0 top-[3.15rem] z-0 hidden w-[min(100%,17.5rem)] rounded-b-xl rounded-t-sm border border-white/12 bg-[#132333] lg:block"
        aria-hidden
      >
        <div className="flex items-start justify-between gap-3 px-4 pb-3.5 pt-5">
          <div className="min-w-0">
            <span className="signal-dossier-tab inline-block rounded-sm bg-white/10 px-2 py-0.5 font-vazirmatn text-[10px] font-bold tracking-[0.18em] text-sky-100/90">
              محرمانه
            </span>
            <p className="signal-dossier-meta mt-2.5 truncate font-vazirmatn text-xs font-medium text-white/75">
              {neighborhood}
              <span className="mx-1.5 text-white/25">·</span>
              ویلای خصوصی
            </p>
            <p className="signal-dossier-ref mt-1 font-vazirmatn text-[10px] tracking-[0.2em] text-white/35">
              DR—۰۴۱
            </p>
          </div>
          <HouseElevation className="signal-dossier-house mt-0.5 h-9 w-11 shrink-0 text-sky-100/70" />
        </div>
        <div className="h-px w-full bg-gradient-to-l from-transparent via-white/15 to-transparent" />
      </div>
    </div>
  );
}

/** نمای سادهٔ خانه — پر، نه خط‌کشی انیمیشنی تمپلیت */
function HouseElevation({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 44 36" fill="currentColor" className={className}>
      <path
        d="M22 3.5 4.5 16.2h4.2V31h10.2v-8.2h6.2V31h10.2V16.2h4.2L22 3.5Z"
        fillOpacity="0.18"
      />
      <path
        d="M22 5.2 7.2 16.1h3.4V29.2h8.4v-7.4h6V29.2h8.4V16.1h3.4L22 5.2Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
      <rect x="19.4" y="19.2" width="5.2" height="5.2" rx="0.6" fillOpacity="0.55" />
    </svg>
  );
}

function ProofMarks({ active, reduceMotion }: { active: boolean; reduceMotion: boolean }) {
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
      animate={active ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.75, delay: 0.16, ease: EASE.expoOut }}
      className="relative"
    >
      <ol className="relative grid gap-0 overflow-hidden rounded-2xl border border-white/12 bg-white/[0.035]">
        {TRUST_STATS.map((stat, index) => (
          <motion.li
            key={stat.label}
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={active ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.55, delay: 0.22 + index * 0.08, ease: EASE.expoOut }}
            className={cn(
              "group relative grid grid-cols-[auto_1fr] gap-4 px-5 py-5 sm:px-6 sm:py-6",
              index < TRUST_STATS.length - 1 ? "border-b border-white/10" : "",
            )}
          >
            <span className="relative mt-1 flex h-9 w-9 items-center justify-center border border-white/15 font-vazirmatn text-[11px] font-bold tabular-nums text-sky-100/85">
              {(index + 1).toLocaleString("fa-IR")}
            </span>
            <div className="min-w-0">
              <p className="font-vazirmatn text-2xl font-bold tracking-tight text-white sm:text-[1.65rem]">
                {stat.value}
              </p>
              <p className="mt-1 font-vazirmatn text-sm font-semibold text-white/80">{stat.label}</p>
              {"hint" in stat && stat.hint ? (
                <p className="mt-1 font-vazirmatn text-xs leading-6 text-white/40">{stat.hint}</p>
              ) : null}
            </div>
            <span className="pointer-events-none absolute inset-y-0 start-0 w-px origin-top scale-y-0 bg-white/50 transition duration-500 group-hover:scale-y-100" />
          </motion.li>
        ))}
      </ol>
    </motion.div>
  );
}
