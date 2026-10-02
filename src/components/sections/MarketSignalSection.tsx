"use client";

import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowUpLeft } from "lucide-react";
import { INTRO_CTA, SIGNAL_NEIGHBORHOODS, TRUST_STATS } from "@/config/home";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * سیگنال بازار خصوصی — جایگزین بنر «نسخه نمایشی» و نوار آمار تخت.
 * افکت موس فقط داخل همین بخش: رادار سونار (متفاوت از glare فوتر).
 */
export default function MarketSignalSection() {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.28 });
  const [hovering, setHovering] = useState(false);
  const [finePointer, setFinePointer] = useState(false);

  const pointerX = useMotionValue(0.5);
  const pointerY = useMotionValue(0.35);
  const smoothX = useSpring(pointerX, { stiffness: 140, damping: 24, mass: 0.45 });
  const smoothY = useSpring(pointerY, { stiffness: 140, damping: 24, mass: 0.45 });

  // موقعیت پیکسلی برای رتیکل — فقط وقتی موس داخل بخش است
  const reticuleX = useSpring(0, { stiffness: 220, damping: 28, mass: 0.4 });
  const reticuleY = useSpring(0, { stiffness: 220, damping: 28, mass: 0.4 });

  const glowX = useTransform(smoothX, (v) => `${v * 100}%`);
  const glowY = useTransform(smoothY, (v) => `${v * 100}%`);
  // لکهٔ سیگنال باریک و تیز — نه glare پهن فوتر
  const sonarGlow = useMotionTemplate`radial-gradient(18rem 18rem at ${glowX} ${glowY}, rgba(56,189,248,0.22), rgba(0,163,255,0.08) 42%, transparent 68%)`;
  const scanBeam = useMotionTemplate`conic-gradient(from 0deg at ${glowX} ${glowY}, transparent 0deg, rgba(125,211,252,0.18) 28deg, transparent 55deg, transparent 360deg)`;

  useEffect(() => {
    if (reduceMotion) return;
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setFinePointer(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [reduceMotion]);

  function onPointerMove(event: ReactPointerEvent<HTMLElement>) {
    if (reduceMotion || !finePointer) return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width);
    pointerY.set((event.clientY - rect.top) / rect.height);
    reticuleX.set(event.clientX - rect.left);
    reticuleY.set(event.clientY - rect.top);
  }

  return (
    <section
      ref={sectionRef}
      onPointerMove={onPointerMove}
      onPointerEnter={() => setHovering(true)}
      onPointerLeave={() => {
        setHovering(false);
        pointerX.set(0.5);
        pointerY.set(0.35);
      }}
      aria-label="سیگنال اعتماد دفتر"
      className="relative overflow-hidden bg-[#071520] text-white"
    >
      {/* Atmosphere */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(0,163,255,0.18),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_80%,rgba(11,58,92,0.55),transparent_45%)]" />

        {/* افکت موس اختصاصی سیگنال — فقط دسکتاپ و وقتی موس داخل بخش است */}
        {finePointer && !reduceMotion ? (
          <>
            <motion.div
              className="absolute inset-0 transition-opacity duration-300"
              style={{
                backgroundImage: sonarGlow,
                opacity: hovering ? 1 : 0.35,
              }}
            />
            <motion.div
              className="absolute inset-0 mix-blend-screen transition-opacity duration-300"
              style={{
                backgroundImage: scanBeam,
                opacity: hovering ? 0.85 : 0,
              }}
            />
            <SonarReticule
              x={reticuleX}
              y={reticuleY}
              active={hovering && inView}
            />
          </>
        ) : null}

        <div
          className="absolute inset-0 opacity-[0.07] mix-blend-soft-light"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />
        <RadarRings active={inView && !reduceMotion} />
        <FloatingNeighborhoods
          active={inView && !reduceMotion}
          pointerX={smoothX}
          pointerY={smoothY}
          reactToPointer={finePointer && hovering && !reduceMotion}
        />
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

/** رتیکل رادار سبک — فقط داخل بخش سیگنال، بدون مخفی کردن کرسر سیستم */
function SonarReticule({
  x,
  y,
  active,
}: {
  x: ReturnType<typeof useSpring>;
  y: ReturnType<typeof useSpring>;
  active: boolean;
}) {
  return (
    <motion.div
      className="absolute z-[1] h-24 w-24 -translate-x-1/2 -translate-y-1/2"
      style={{ left: x, top: y, opacity: active ? 1 : 0 }}
      transition={{ opacity: { duration: 0.25 } }}
    >
      {/* حلقهٔ پینگ */}
      <motion.span
        className="absolute inset-0 rounded-full border border-sky-300/50"
        animate={
          active
            ? { scale: [0.55, 1.35], opacity: [0.55, 0] }
            : { scale: 0.55, opacity: 0 }
        }
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
      />
      <motion.span
        className="absolute inset-[18%] rounded-full border border-dashed border-cyan-200/40"
        animate={active ? { rotate: 360 } : undefined}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />
      {/* کراس‌هیر */}
      <span className="absolute inset-x-[22%] top-1/2 h-px -translate-y-1/2 bg-gradient-to-l from-transparent via-sky-200/70 to-transparent" />
      <span className="absolute inset-y-[22%] start-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-sky-200/70 to-transparent" />
      <span className="absolute start-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-200 shadow-[0_0_12px_rgba(125,211,252,0.9)]" />
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

function FloatingNeighborhoods({
  active,
  pointerX,
  pointerY,
  reactToPointer,
}: {
  active: boolean;
  pointerX: ReturnType<typeof useSpring>;
  pointerY: ReturnType<typeof useSpring>;
  reactToPointer: boolean;
}) {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      {SIGNAL_NEIGHBORHOODS.map((name, index) => {
        const top = 12 + ((index * 11) % 70);
        const side = index % 2 === 0 ? "start" : "end";
        const inset = 4 + ((index * 7) % 28);
        // موقعیت تقریبی نرمال‌شده برای روشن‌شدن نزدیک موس
        const nx = side === "start" ? 1 - inset / 100 : inset / 100;
        const ny = top / 100;

        return (
          <NeighborhoodChip
            key={name}
            name={name}
            top={top}
            side={side}
            inset={inset}
            nx={nx}
            ny={ny}
            active={active}
            index={index}
            pointerX={pointerX}
            pointerY={pointerY}
            reactToPointer={reactToPointer}
          />
        );
      })}
    </div>
  );
}

function NeighborhoodChip({
  name,
  top,
  side,
  inset,
  nx,
  ny,
  active,
  index,
  pointerX,
  pointerY,
  reactToPointer,
}: {
  name: string;
  top: number;
  side: string;
  inset: number;
  nx: number;
  ny: number;
  active: boolean;
  index: number;
  pointerX: ReturnType<typeof useSpring>;
  pointerY: ReturnType<typeof useSpring>;
  reactToPointer: boolean;
}) {
  const proximity = useTransform([pointerX, pointerY], ([px, py]) => {
    if (!reactToPointer) return 0;
    const dx = (px as number) - nx;
    const dy = (py as number) - ny;
    const dist = Math.hypot(dx, dy);
    return Math.max(0, 1 - dist / 0.32);
  });
  const opacity = useTransform(proximity, (p) => 0.18 + p * 0.72);
  const color = useTransform(proximity, (p) =>
    p > 0.45 ? "rgba(186,230,253,0.95)" : "rgba(224,242,254,0.28)",
  );

  return (
    <motion.span
      className="absolute font-vazirmatn text-[11px] font-medium tracking-[0.18em] md:text-xs"
      style={{
        top: `${top}%`,
        ...(side === "start" ? { right: `${inset}%` } : { left: `${inset}%` }),
        opacity: reactToPointer ? opacity : undefined,
        color: reactToPointer ? color : undefined,
      }}
      initial={{ opacity: 0, y: 10 }}
      animate={
        active && !reactToPointer
          ? {
              opacity: [0.12, 0.38, 0.16],
              y: [0, -10, 0],
            }
          : active
            ? { y: [0, -8, 0] }
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
