"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/utils";

type HoverMode = "default" | "link" | "press";

type TrailDot = {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  speed: number;
};

type Ripple = {
  id: number;
  x: number;
  y: number;
};

type Spark = {
  id: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
};

/**
 * کرسر سینمایی دسکتاپ:
 * هستهٔ درخشان + قاب شش‌ضلعی چرخان + دنبالهٔ دنباله‌دار سرعتی
 * + موج کلیک + جرقه‌های حرکت سریع + کشش مغناطیسی روی لینک/دکمه.
 */
export default function LuxuryCursor() {
  const reduceMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState<HoverMode>("default");
  const [label, setLabel] = useState("");
  const [trail, setTrail] = useState<TrailDot[]>([]);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [sparks, setSparks] = useState<Spark[]>([]);

  const lastPos = useRef({ x: -100, y: -100, t: 0 });

  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);
  const speedMV = useMotionValue(0);

  const coreX = useSpring(rawX, { stiffness: 720, damping: 38, mass: 0.28 });
  const coreY = useSpring(rawY, { stiffness: 720, damping: 38, mass: 0.28 });
  const ringX = useSpring(rawX, { stiffness: 260, damping: 26, mass: 0.55 });
  const ringY = useSpring(rawY, { stiffness: 260, damping: 26, mass: 0.55 });
  const orbitX = useSpring(rawX, { stiffness: 120, damping: 22, mass: 0.8 });
  const orbitY = useSpring(rawY, { stiffness: 120, damping: 22, mass: 0.8 });
  const bloomX = useSpring(rawX, { stiffness: 60, damping: 18, mass: 1.1 });
  const bloomY = useSpring(rawY, { stiffness: 60, damping: 18, mass: 1.1 });

  const bloomScale = useTransform(speedMV, [0, 40, 90], [0.7, 1.15, 1.55]);
  const bloomOpacity = useTransform(speedMV, [0, 25, 80], [0.22, 0.45, 0.7]);
  const trailStretch = useTransform(speedMV, [0, 50, 100], [1, 1.8, 2.8]);

  useEffect(() => {
    if (reduceMotion) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const hover = window.matchMedia("(hover: hover)").matches;
    if (!fine || !hover) return;
    setEnabled(true);
  }, [reduceMotion]);

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("luxury-cursor-on");
    return () => document.documentElement.classList.remove("luxury-cursor-on");
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    let trailId = 0;
    let rippleId = 0;
    let sparkId = 0;
    let lastTrail = 0;
    let lastSpark = 0;

    const interactiveSelector =
      'a, button, [role="button"], input, textarea, select, label, summary, [data-cursor]';

    function resolveTarget(node: EventTarget | null): HTMLElement | null {
      if (!(node instanceof Element)) return null;
      return node.closest(interactiveSelector) as HTMLElement | null;
    }

    function onMove(event: PointerEvent) {
      let x = event.clientX;
      let y = event.clientY;
      const now = performance.now();
      const prev = lastPos.current;
      const dt = Math.max(now - (prev.t || now), 8);
      let vx = ((x - prev.x) / dt) * 16;
      let vy = ((y - prev.y) / dt) * 16;
      const speed = Math.min(Math.hypot(vx, vy), 120);
      speedMV.set(speed);
      lastPos.current = { x, y, t: now };

      const target = resolveTarget(event.target);

      if (target) {
        const rect = target.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = cx - x;
        const dy = cy - y;
        const dist = Math.hypot(dx, dy);
        if (dist < 140) {
          const pull = (1 - dist / 140) * 0.38;
          x += dx * pull;
          y += dy * pull;
        }
        const custom = target.getAttribute("data-cursor")?.trim() || "";
        const tag = target.tagName.toLowerCase();
        setMode(event.buttons > 0 ? "press" : "link");
        setLabel(
          custom ||
            (tag === "button" || target.getAttribute("role") === "button"
              ? "اقدام"
              : tag === "a"
                ? "کاوش"
                : "انتخاب"),
        );
      } else {
        setMode(event.buttons > 0 ? "press" : "default");
        setLabel("");
      }

      rawX.set(x);
      rawY.set(y);
      setVisible(true);

      if (now - lastTrail > 18) {
        lastTrail = now;
        trailId += 1;
        const id = trailId;
        setTrail((prevTrail) => [
          ...prevTrail.slice(-16),
          { x, y, id, vx, vy, speed },
        ]);
      }

      // جرقه هنگام حرکت سریع
      if (speed > 38 && now - lastSpark > 42) {
        lastSpark = now;
        const angle = Math.atan2(vy, vx) + Math.PI;
        const burst = Array.from({ length: 3 }, (_, i) => {
          sparkId += 1;
          const spread = (i - 1) * 0.55;
          return {
            id: sparkId,
            x,
            y,
            dx: Math.cos(angle + spread) * (14 + Math.random() * 22),
            dy: Math.sin(angle + spread) * (14 + Math.random() * 22),
          };
        });
        setSparks((prevSparks) => [...prevSparks.slice(-18), ...burst]);
      }
    }

    function spawnRipple(x: number, y: number) {
      rippleId += 1;
      const id = rippleId;
      setRipples((prevRipples) => [...prevRipples.slice(-4), { id, x, y }]);
    }

    function onDown(event: PointerEvent) {
      setMode("press");
      spawnRipple(event.clientX, event.clientY);
    }

    function onUp(event: PointerEvent) {
      setMode(resolveTarget(event.target) ? "link" : "default");
    }

    function onLeave() {
      setVisible(false);
      setMode("default");
      setLabel("");
      speedMV.set(0);
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, [enabled, rawX, rawY, speedMV]);

  if (!enabled) return null;

  const expanded = mode === "link" || mode === "press";
  const orbitSize = mode === "press" ? 44 : expanded ? 84 : 58;
  const ringSize = mode === "press" ? 22 : expanded ? 62 : 38;

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none fixed inset-0 z-[200] hidden lg:block",
        !visible && "opacity-0",
      )}
    >
      {/* شکوفهٔ نرم عقب‌مانده */}
      <motion.div
        className="absolute"
        style={{
          left: bloomX,
          top: bloomY,
          x: "-50%",
          y: "-50%",
          scale: bloomScale,
          opacity: bloomOpacity,
        }}
      >
        <div className="h-28 w-28 rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.45)_0%,rgba(0,163,255,0.18)_40%,transparent_70%)] blur-md" />
      </motion.div>

      {/* دنبالهٔ دنباله‌دار سرعتی */}
      <AnimatePresence>
        {trail.map((dot, index) => {
          const age = index / Math.max(trail.length - 1, 1);
          const angle = Math.atan2(dot.vy, dot.vx) * (180 / Math.PI);
          const length = 6 + (dot.speed / 100) * 22;
          return (
            <motion.span
              key={dot.id}
              className="absolute origin-center rounded-full"
              style={{
                left: dot.x,
                top: dot.y,
                width: length,
                height: 2 + age * 1.5,
                background:
                  "linear-gradient(90deg, rgba(186,230,253,0.95), rgba(0,163,255,0.15))",
                boxShadow: "0 0 10px rgba(56,189,248,0.55)",
                rotate: angle,
                scaleX: trailStretch,
              }}
              initial={{ opacity: 0.85, scale: 1 }}
              animate={{ opacity: 0, scale: 0.2 }}
              transition={{ duration: 0.55 + (1 - age) * 0.15, ease: "easeOut" }}
            />
          );
        })}
      </AnimatePresence>

      {/* جرقه‌های سرعت */}
      <AnimatePresence>
        {sparks.map((spark) => (
          <motion.span
            key={spark.id}
            className="absolute h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-200"
            style={{ left: spark.x, top: spark.y }}
            initial={{ opacity: 0.95, x: 0, y: 0, scale: 1 }}
            animate={{
              opacity: 0,
              x: spark.dx,
              y: spark.dy,
              scale: 0,
            }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            onAnimationComplete={() => {
              setSparks((prev) => prev.filter((s) => s.id !== spark.id));
            }}
          />
        ))}
      </AnimatePresence>

      {/* موج کلیک */}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            className="absolute rounded-full border border-sky-300/70"
            style={{ left: ripple.x, top: ripple.y, x: "-50%", y: "-50%" }}
            initial={{ width: 12, height: 12, opacity: 0.85 }}
            animate={{ width: 120, height: 120, opacity: 0 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            onAnimationComplete={() => {
              setRipples((prev) => prev.filter((r) => r.id !== ripple.id));
            }}
          />
        ))}
      </AnimatePresence>

      {/* مدار شش‌ضلعی + ماهواره‌ها */}
      <motion.div
        className="absolute"
        style={{
          left: orbitX,
          top: orbitY,
          width: orbitSize,
          height: orbitSize,
          x: "-50%",
          y: "-50%",
        }}
      >
        <motion.div
          className="absolute inset-0"
          animate={{ rotate: 360 }}
          transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
        >
          <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible">
            <polygon
              points="50,4 93,27 93,73 50,96 7,73 7,27"
              fill="none"
              stroke="rgba(125,211,252,0.4)"
              strokeWidth="1"
              strokeDasharray={expanded ? "0" : "4 6"}
            />
          </svg>
        </motion.div>

        <motion.div
          className="absolute inset-[-6px]"
          animate={{ rotate: -360 }}
          transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
        >
          <span className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-300 shadow-[0_0_14px_rgba(56,189,248,1)]" />
          <span className="absolute bottom-[10%] left-[10%] h-1 w-1 rounded-full bg-white/90 shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
          <span className="absolute bottom-[10%] right-[10%] h-1 w-1 rounded-full bg-cyan-200/90 shadow-[0_0_10px_rgba(165,243,252,0.85)]" />
        </motion.div>

        {/* ضربان بیرونی روی لینک */}
        {expanded ? (
          <motion.div
            className="absolute inset-[-10px] rounded-full border border-sky-400/30"
            animate={{ scale: [0.92, 1.08, 0.92], opacity: [0.55, 0.15, 0.55] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
        ) : null}
      </motion.div>

      {/* حلقهٔ میانی + کراس‌هیر */}
      <motion.div
        className="absolute"
        style={{
          left: ringX,
          top: ringY,
          width: ringSize,
          height: ringSize,
          x: "-50%",
          y: "-50%",
        }}
      >
        <motion.div
          className={cn(
            "relative h-full w-full overflow-hidden rounded-full border backdrop-blur-[1px]",
            expanded
              ? "border-sky-300/80 bg-sky-400/[0.12]"
              : "border-sky-400/70 bg-sky-400/[0.06]",
          )}
          animate={
            mode === "press"
              ? { scale: 0.82 }
              : expanded
                ? {
                    boxShadow: [
                      "0 0 0 0 rgba(0,163,255,0.45)",
                      "0 0 0 18px rgba(0,163,255,0)",
                    ],
                    scale: 1,
                  }
                : { boxShadow: "0 0 22px rgba(0,163,255,0.18)", scale: 1 }
          }
          transition={
            expanded && mode !== "press"
              ? { duration: 1.05, repeat: Infinity }
              : { type: "spring", stiffness: 420, damping: 28 }
          }
        >
          {/* کراس‌هیر ظریف */}
          <span className="absolute inset-x-[28%] top-1/2 h-px -translate-y-1/2 bg-sky-200/50" />
          <span className="absolute inset-y-[28%] start-1/2 w-px -translate-x-1/2 bg-sky-200/50" />
        </motion.div>
      </motion.div>

      {/* هسته + لیبل */}
      <motion.div
        className="absolute"
        style={{ left: coreX, top: coreY, x: "-50%", y: "-50%" }}
      >
        <motion.div
          className="relative"
          animate={mode === "press" ? { scale: 0.55 } : { scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          <span className="absolute inset-[-6px] rounded-full bg-sky-400/35 blur-[6px]" />
          <motion.span
            className={cn(
              "relative block rounded-full bg-white",
              mode === "press" ? "h-1.5 w-1.5" : "h-2.5 w-2.5",
            )}
            style={{
              boxShadow:
                "0 0 0 2px rgba(14,165,233,0.35), 0 0 24px rgba(125,211,252,0.95)",
            }}
            animate={
              mode === "default"
                ? { scale: [1, 1.15, 1] }
                : { scale: 1 }
            }
            transition={
              mode === "default"
                ? { duration: 2.2, repeat: Infinity, ease: "easeInOut" }
                : { duration: 0.2 }
            }
          />
        </motion.div>

        <AnimatePresence>
          {label ? (
            <motion.span
              key={label}
              initial={{ opacity: 0, y: 8, scale: 0.88, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 20, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: 10, scale: 0.94, filter: "blur(2px)" }}
              transition={{ type: "spring", stiffness: 380, damping: 26 }}
              className="absolute start-1/2 top-full -translate-x-1/2 whitespace-nowrap rounded-full bg-[#071520]/92 px-3 py-1 font-vazirmatn text-[10px] font-bold tracking-[0.18em] text-sky-100 shadow-[0_10px_30px_-10px_rgba(0,163,255,0.75)] ring-1 ring-sky-300/40"
            >
              {label}
            </motion.span>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
