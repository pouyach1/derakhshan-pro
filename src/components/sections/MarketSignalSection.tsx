"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import {
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ArrowUpLeft } from "lucide-react";
import { INTRO_CTA, SIGNAL_NEIGHBORHOODS, TRUST_STATS } from "@/config/home";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * سیگنال بازار خصوصی — جایگزین بنر «نسخه نمایشی» و نوار آمار تخت.
 * یک صحنهٔ سینمایی با امواج رادار، محله‌های شناور، خط جوهر و نشان‌های اعتماد.
 */
export default function MarketSignalSection() {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.28 });
  const pointerX = useMotionValue(0.5);
  const pointerY = useMotionValue(0.35);
  const smoothX = useSpring(pointerX, { stiffness: 90, damping: 22, mass: 0.55 });
  const smoothY = useSpring(pointerY, { stiffness: 90, damping: 22, mass: 0.55 });
  const glowX = useTransform(smoothX, (v) => `${v * 100}%`);
  const glowY = useTransform(smoothY, (v) => `${v * 100}%`);
  const glow = useMotionTemplate`radial-gradient(34rem 24rem at ${glowX} ${glowY}, rgba(0,163,255,0.28), transparent 58%)`;
  const hotGlow = useMotionTemplate`radial-gradient(12rem 10rem at ${glowX} ${glowY}, rgba(186,230,253,0.35), transparent 70%)`;
  const px = useTransform(smoothX, (v) => `${v * 100}%`);
  const py = useTransform(smoothY, (v) => `${v * 100}%`);

  function onPointerMove(event: ReactPointerEvent<HTMLElement>) {
    if (reduceMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width);
    pointerY.set((event.clientY - rect.top) / rect.height);
  }

  return (
    <section
      ref={sectionRef}
      onPointerMove={onPointerMove}
      aria-label="سیگنال اعتماد دفتر"
      className="relative overflow-hidden bg-[#071520] text-white"
    >
      {/* Atmosphere */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(0,163,255,0.18),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_80%,rgba(11,58,92,0.55),transparent_45%)]" />
        <motion.div className="absolute inset-0" style={{ backgroundImage: glow }} />
        <motion.div className="absolute inset-0 mix-blend-screen" style={{ backgroundImage: hotGlow }} />
        <PointerConstellation x={px} y={py} active={inView && !reduceMotion} />
        <div
          className="absolute inset-0 opacity-[0.07] mix-blend-soft-light"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />
        <RadarRings active={inView && !reduceMotion} />
        <FloatingNeighborhoods active={inView && !reduceMotion} />
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
              <Link
                href={INTRO_CTA.cta.href}
                data-cursor="ورود"
                className="ios-tap-target group inline-flex min-h-12 items-center gap-2.5 rounded-full bg-sky-500 px-6 py-3 font-vazirmatn text-sm font-semibold text-white shadow-[0_18px_50px_-18px_rgba(0,163,255,0.85)] transition hover:bg-sky-400"
              >
                {INTRO_CTA.cta.label}
                <ArrowUpLeft className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </motion.div>
          </div>

          <ProofMarks active={inView} reduceMotion={!!reduceMotion} />
        </div>
      </div>
    </section>
  );
}

function PointerConstellation({
  x,
  y,
  active,
}: {
  x: MotionValue<string>;
  y: MotionValue<string>;
  active: boolean;
}) {
  if (!active) return null;
  const nodes = [
    { left: 18, top: 12 },
    { left: 82, top: 20 },
    { left: 88, top: 62 },
    { left: 22, top: 78 },
    { left: 50, top: 8 },
    { left: 62, top: 88 },
    { left: 8, top: 48 },
  ];
  return (
    <motion.div
      className="absolute h-52 w-52 -translate-x-1/2 -translate-y-1/2"
      style={{ left: x, top: y }}
    >
      <motion.div
        className="absolute inset-0 rounded-full border border-sky-300/20"
        animate={{ scale: [0.7, 1.18, 0.7], opacity: [0.45, 0.08, 0.45] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute inset-[18%] rounded-full border border-dashed border-cyan-200/25"
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute inset-[34%] rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.35),transparent_70%)] blur-sm"
        animate={{ scale: [0.85, 1.2, 0.85], opacity: [0.35, 0.7, 0.35] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      />
      <svg className="absolute inset-0 h-full w-full overflow-visible" viewBox="0 0 100 100">
        {nodes.map((node, index) => {
          const next = nodes[(index + 1) % nodes.length];
          return (
            <motion.line
              key={`line-${index}`}
              x1={node.left}
              y1={node.top}
              x2={next.left}
              y2={next.top}
              stroke="rgba(125,211,252,0.22)"
              strokeWidth="0.4"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: [0.15, 0.45, 0.15] }}
              transition={{
                duration: 2.8,
                repeat: Infinity,
                delay: index * 0.12,
                ease: "easeInOut",
              }}
            />
          );
        })}
      </svg>
      {nodes.map((node, index) => (
        <motion.span
          key={index}
          className="absolute h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-200/90 shadow-[0_0_14px_rgba(125,211,252,0.95)]"
          style={{ left: `${node.left}%`, top: `${node.top}%` }}
          animate={{
            opacity: [0.25, 1, 0.3],
            scale: [0.75, 1.55, 0.85],
          }}
          transition={{
            duration: 2 + index * 0.18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.14,
          }}
        />
      ))}
    </motion.div>
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

function RadarRings({ active }: { active: boolean }) {
  return (
    <div className="absolute start-1/2 top-[42%] h-[140vw] w-[140vw] -translate-x-1/2 -translate-y-1/2 md:start-auto md:end-[-18%] md:top-1/2 md:h-[58rem] md:w-[58rem] md:translate-x-0">
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full border border-sky-400/15"
          style={{ scale: 0.28 + i * 0.2 }}
          initial={{ opacity: 0 }}
          animate={
            active
              ? {
                  opacity: [0.08, 0.28, 0.08],
                  scale: [0.28 + i * 0.2, 0.32 + i * 0.2, 0.28 + i * 0.2],
                }
              : undefined
          }
          transition={{
            duration: 5.5 + i * 0.7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.35,
          }}
        />
      ))}
      <motion.div
        className="absolute start-1/2 top-1/2 h-px w-1/2 origin-left bg-gradient-to-l from-sky-400/50 to-transparent"
        animate={active ? { rotate: 360 } : undefined}
        transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
        style={{ translateY: "-50%" }}
      />
    </div>
  );
}

function FloatingNeighborhoods({ active }: { active: boolean }) {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      {SIGNAL_NEIGHBORHOODS.map((name, index) => {
        const top = 12 + ((index * 11) % 70);
        const side = index % 2 === 0 ? "start" : "end";
        const inset = 4 + ((index * 7) % 28);
        return (
          <motion.span
            key={name}
            className="absolute font-vazirmatn text-[11px] font-medium tracking-[0.18em] text-sky-100/25 md:text-xs"
            style={{
              top: `${top}%`,
              ...(side === "start" ? { right: `${inset}%` } : { left: `${inset}%` }),
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={
              active
                ? {
                    opacity: [0.12, 0.38, 0.16],
                    y: [0, -10, 0],
                  }
                : undefined
            }
            transition={{
              duration: 7 + (index % 4),
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.45,
            }}
          >
            {name}
          </motion.span>
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
              <motion.span
                className="absolute inset-1 rounded-full border border-sky-300/40"
                animate={
                  active && !reduceMotion
                    ? { scale: [1, 1.18, 1], opacity: [0.55, 0.15, 0.55] }
                    : undefined
                }
                transition={{ duration: 2.8, repeat: Infinity, delay: index * 0.35 }}
              />
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
