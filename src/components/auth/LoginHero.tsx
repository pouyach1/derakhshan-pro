"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

export default function LoginHero() {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 90, damping: 18 });
  const y = useSpring(my, { stiffness: 90, damping: 18 });
  const shiftX = useTransform(x, [-0.5, 0.5], [-16, 16]);
  const shiftY = useTransform(y, [-0.5, 0.5], [-12, 12]);
  const glareX = useTransform(x, [-0.5, 0.5], [18, 82]);
  const glareY = useTransform(y, [-0.5, 0.5], [18, 82]);
  const glare = useMotionTemplate`radial-gradient(420px circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.25), transparent 55%)`;

  function onMove(event: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((event.clientX - rect.left) / rect.width - 0.5);
    my.set((event.clientY - rect.top) / rect.height - 0.5);
  }

  function onLeave() {
    mx.set(0);
    my.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      initial={{ opacity: 0, x: 28 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="relative hidden h-full min-h-[560px] lg:block"
    >
      <div
        className="absolute inset-3 overflow-hidden shadow-2xl shadow-slate-900/20"
        style={{
          borderRadius: "2rem 2.75rem 2rem 6rem",
        }}
      >
        <motion.div style={{ x: shiftX, y: shiftY }} className="absolute -inset-8">
          <Image
            src="/images/landing/hero/banner.jpg"
            alt="Architectural city skyline"
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 0px, 55vw"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1B3A]/85 via-[#0B1B3A]/30 to-[#0B1B3A]/10" />
        <motion.div style={{ background: glare }} className="absolute inset-0 mix-blend-soft-light" />

        {/* Organic notch accent */}
        <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-10 -left-6 h-32 w-32 rounded-full bg-sky-300/20 blur-2xl" />

        <div className="absolute inset-0 flex items-start justify-end p-8 xl:p-10">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.55 }}
            className="max-w-[15.5rem] text-right text-lg font-semibold leading-snug text-white drop-shadow-[0_10px_28px_rgba(0,0,0,0.45)] xl:max-w-[17.5rem] xl:text-xl"
          >
            Browse thousands of properties to buy, sell, or rent with trusted agents.
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
}
