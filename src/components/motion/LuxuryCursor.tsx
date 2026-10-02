"use client";

import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { cn } from "@/lib/utils";

type HoverMode = "default" | "link" | "press";

/**
 * کرسر لوکس دسکتاپ برای سایت عمومی:
 * حلقهٔ دوگانه + مدار چرخان + دنبالهٔ ستاره‌ای + تغییر شکل روی لینک/دکمه.
 */
export default function LuxuryCursor() {
  const reduceMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState<HoverMode>("default");
  const [label, setLabel] = useState("");
  const [trail, setTrail] = useState<Array<{ x: number; y: number; id: number }>>([]);

  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);
  const coreX = useSpring(rawX, { stiffness: 560, damping: 36, mass: 0.4 });
  const coreY = useSpring(rawY, { stiffness: 560, damping: 36, mass: 0.4 });
  const ringX = useSpring(rawX, { stiffness: 200, damping: 24, mass: 0.65 });
  const ringY = useSpring(rawY, { stiffness: 200, damping: 24, mass: 0.65 });
  const orbitX = useSpring(rawX, { stiffness: 100, damping: 20, mass: 0.85 });
  const orbitY = useSpring(rawY, { stiffness: 100, damping: 20, mass: 0.85 });

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
    let lastTrail = 0;
    const interactiveSelector =
      'a, button, [role="button"], input, textarea, select, label, summary, [data-cursor]';

    function resolveTarget(node: EventTarget | null): HTMLElement | null {
      if (!(node instanceof Element)) return null;
      return node.closest(interactiveSelector) as HTMLElement | null;
    }

    function onMove(event: PointerEvent) {
      let x = event.clientX;
      let y = event.clientY;
      const target = resolveTarget(event.target);

      if (target) {
        const rect = target.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = cx - x;
        const dy = cy - y;
        const dist = Math.hypot(dx, dy);
        if (dist < 130) {
          const pull = (1 - dist / 130) * 0.32;
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

      const now = performance.now();
      if (now - lastTrail > 26) {
        lastTrail = now;
        trailId += 1;
        const id = trailId;
        setTrail((prev) => [...prev.slice(-12), { x, y, id }]);
      }
    }

    function onDown() {
      setMode("press");
    }
    function onUp(event: PointerEvent) {
      setMode(resolveTarget(event.target) ? "link" : "default");
    }
    function onLeave() {
      setVisible(false);
      setMode("default");
      setLabel("");
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
  }, [enabled, rawX, rawY]);

  if (!enabled) return null;

  const expanded = mode === "link" || mode === "press";
  const orbitSize = expanded ? 72 : 52;
  const ringSize = mode === "press" ? 28 : expanded ? 56 : 36;

  return (
    <div aria-hidden className={cn("pointer-events-none fixed inset-0 z-[200] hidden lg:block", !visible && "opacity-0")}>
      <AnimatePresence>
        {trail.map((dot) => (
          <motion.span
            key={dot.id}
            className="absolute h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-300"
            style={{ left: dot.x, top: dot.y }}
            initial={{ opacity: 0.6, scale: 0.85 }}
            animate={{ opacity: 0, scale: 0.1 }}
            transition={{ duration: 0.5 }}
          />
        ))}
      </AnimatePresence>

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
          className="absolute inset-0 rounded-full border border-dashed border-sky-300/45"
          animate={{ rotate: 360 }}
          transition={{ duration: 7.5, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-0"
          animate={{ rotate: -360 }}
          transition={{ duration: 11, repeat: Infinity, ease: "linear" }}
        >
          <span className="absolute start-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-300 shadow-[0_0_14px_rgba(56,189,248,0.95)]" />
          <span className="absolute bottom-0 start-1/2 h-1 w-1 -translate-x-1/2 translate-y-1/2 rounded-full bg-white/80" />
        </motion.div>
      </motion.div>

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
          className="h-full w-full rounded-full border border-sky-400/75 bg-sky-400/[0.07] backdrop-blur-[1px]"
          animate={
            expanded
              ? {
                  boxShadow: [
                    "0 0 0 0 rgba(0,163,255,0.4)",
                    "0 0 0 16px rgba(0,163,255,0)",
                  ],
                }
              : { boxShadow: "0 0 18px rgba(0,163,255,0.15)" }
          }
          transition={expanded ? { duration: 1.15, repeat: Infinity } : { duration: 0.25 }}
        />
      </motion.div>

      <motion.div
        className="absolute"
        style={{ left: coreX, top: coreY, x: "-50%", y: "-50%" }}
      >
        <motion.div
          className={cn(
            "rounded-full bg-white shadow-[0_0_22px_rgba(125,211,252,0.7)]",
            mode === "press" ? "h-1.5 w-1.5" : "h-2.5 w-2.5",
          )}
        />
        <AnimatePresence>
          {label ? (
            <motion.span
              key={label}
              initial={{ opacity: 0, y: 6, scale: 0.92 }}
              animate={{ opacity: 1, y: 16, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              className="absolute start-1/2 top-full -translate-x-1/2 whitespace-nowrap rounded-full bg-[#0B3A5C] px-2.5 py-1 font-vazirmatn text-[10px] font-bold tracking-wide text-sky-100 shadow-lg ring-1 ring-sky-300/35"
            >
              {label}
            </motion.span>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
