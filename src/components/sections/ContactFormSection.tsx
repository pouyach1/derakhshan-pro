"use client";

import { FormEvent, MouseEvent, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import {
  ArrowUpLeft,
  Building2,
  CheckCircle2,
  Home,
  Landmark,
  Mail,
  Send,
  Sparkles,
  Trees,
} from "lucide-react";
import { SITE } from "@/config/site";

const spring = { type: "spring" as const, stiffness: 90, damping: 16 };
const softSpring = { type: "spring" as const, stiffness: 60, damping: 18 };

const INTERESTS = [
  "اجاره فضای لوکس",
  "خرید ملک VIP",
  "فروش یا معرفی دارایی",
  "مشاوره استراتژیک سرمایه‌گذاری",
] as const;

const CATEGORIES = [
  { id: "residential", label: "مسکونی لوکس", icon: Home },
  { id: "villa", label: "ویلا و باغ", icon: Trees },
  { id: "office", label: "اداری", icon: Building2 },
  { id: "mixed", label: "تجاری و مختلط", icon: Landmark },
] as const;

const fieldClass =
  "w-full rounded-2xl border border-sky-100/60 bg-white/70 px-4 py-3.5 font-vazirmatn text-sm text-[#0B132B] outline-none transition placeholder:text-slate-400 focus:border-[#00F0FF] focus:bg-white focus:shadow-[0_0_0_4px_rgba(0,240,255,0.16)]";

const fieldVariants = {
  hidden: { opacity: 0, y: 22, filter: "blur(6px)" },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { ...spring, delay: 0.08 + i * 0.07 },
  }),
};

export default function ContactFormSection() {
  const reduceMotion = useReducedMotion();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const cardRef = useRef<HTMLDivElement>(null);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 170, damping: 18 });
  const springY = useSpring(rotateY, { stiffness: 170, damping: 18 });
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(30);
  const glare = useMotionTemplate`radial-gradient(480px circle at ${glareX}% ${glareY}%, rgba(0,240,255,0.28), transparent 55%)`;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 900));
    setLoading(false);
    setSubmitted(true);
  }

  function toggleCategory(value: string) {
    setCategories((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value],
    );
  }

  function onCardMove(event: MouseEvent<HTMLDivElement>) {
    if (reduceMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    rotateX.set((0.5 - py) * 8);
    rotateY.set((px - 0.5) * 10);
    glareX.set(px * 100);
    glareY.set(py * 100);
  }

  function onCardLeave() {
    rotateX.set(0);
    rotateY.set(0);
    glareX.set(50);
    glareY.set(30);
  }

  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-[#F8FAFC] py-20 text-[#0B132B] md:py-28"
    >
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute -right-24 top-10 h-80 w-80 rounded-full bg-[#00F0FF]/22 blur-3xl"
          animate={
            reduceMotion
              ? undefined
              : {
                  x: [0, 32, -18, 0],
                  y: [0, 26, -14, 0],
                  scale: [1, 1.18, 0.94, 1],
                  opacity: [0.28, 0.6, 0.3, 0.28],
                }
          }
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -left-24 bottom-10 h-96 w-96 rounded-full bg-sky-400/18 blur-3xl"
          animate={
            reduceMotion
              ? undefined
              : {
                  x: [0, -26, 18, 0],
                  y: [0, -22, 14, 0],
                  scale: [1, 1.12, 0.9, 1],
                  opacity: [0.22, 0.48, 0.26, 0.22],
                }
          }
          transition={{ duration: 19, repeat: Infinity, ease: "easeInOut" }}
        />
        {!reduceMotion &&
          [0, 1, 2, 3, 4, 5].map((i) => (
            <motion.span
              key={i}
              className="absolute h-1 w-1 rounded-full bg-sky-400"
              style={{
                left: `${8 + i * 14}%`,
                top: `${20 + (i % 4) * 18}%`,
              }}
              animate={{
                y: [0, -36, 0],
                opacity: [0.1, 0.85, 0.1],
                scale: [0.5, 1.6, 0.5],
              }}
              transition={{
                duration: 5 + i * 0.45,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.28,
              }}
            />
          ))}
      </div>

      <div className="rio-container relative z-10 grid gap-10 lg:grid-cols-12 lg:gap-14">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, x: 48, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          viewport={{ once: false, amount: 0.3 }}
          transition={softSpring}
          className="lg:col-span-5"
        >
          <motion.span
            whileHover={reduceMotion ? undefined : { scale: 1.04, y: -2 }}
            transition={spring}
            className="inline-flex items-center gap-2 rounded-full border border-sky-200/70 bg-white/70 px-4 py-2 text-sm font-semibold text-sky-700 shadow-lg shadow-sky-500/10 backdrop-blur-xl"
          >
            <motion.span
              animate={reduceMotion ? undefined : { rotate: [0, 18, -12, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles className="h-3.5 w-3.5 text-[#00F0FF]" />
            </motion.span>
            گفت‌وگوی اختصاصی
          </motion.span>

          <h2 className="mt-5 font-vazirmatn text-4xl font-black leading-[1.2] tracking-tight text-[#0B132B] md:text-5xl lg:text-6xl">
            {"بگویید دقیقاً دنبال چه ملکی هستید"
              .split(" ")
              .map((word, index) => (
                <motion.span
                  key={`${word}-${index}`}
                  initial={
                    reduceMotion ? false : { opacity: 0, y: 24, filter: "blur(8px)" }
                  }
                  whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  viewport={{ once: false, amount: 0.5 }}
                  transition={{ ...spring, delay: reduceMotion ? 0 : index * 0.05 }}
                  className="ml-1 inline-block"
                >
                  {word}
                </motion.span>
              ))}
          </h2>

          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ ...softSpring, delay: 0.25 }}
            className="mt-4 max-w-md font-vazirmatn text-base leading-8 text-slate-600"
          >
            فرم خصوصی برای موکلان خاص — جزئیات را بنویسید تا مسیر درست را با دقت و
            محرمانگی کامل باز کنیم.
          </motion.p>

          <motion.a
            href={`mailto:${SITE.email}`}
            whileHover={reduceMotion ? undefined : { x: -6, scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={spring}
            className="group relative mt-8 inline-flex items-center gap-3 overflow-hidden rounded-[1.5rem] border border-sky-100/70 bg-white/60 px-5 py-4 shadow-xl shadow-sky-500/10 backdrop-blur-2xl"
          >
            {!reduceMotion && (
              <motion.span
                aria-hidden
                className="pointer-events-none absolute inset-y-0 w-1/3 skew-x-12 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                animate={{ x: ["-120%", "220%"] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.4 }}
              />
            )}
            <motion.span
              whileHover={reduceMotion ? undefined : { rotate: -8, scale: 1.08 }}
              className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0B132B] text-[#00F0FF]"
            >
              <Mail className="h-4 w-4" />
            </motion.span>
            <span className="relative">
              <span className="block text-xs font-semibold text-slate-500">
                اطلاعات تماس
              </span>
              <span className="mt-0.5 inline-flex items-center gap-2 font-sans text-lg font-bold tracking-wide text-[#0B132B]">
                {SITE.email}
                <ArrowUpLeft className="h-4 w-4 text-sky-500 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </span>
          </motion.a>
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 48, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={softSpring}
          className="lg:col-span-7"
          style={{ perspective: 1200 }}
        >
          <motion.div
            ref={cardRef}
            onMouseMove={onCardMove}
            onMouseLeave={onCardLeave}
            style={{
              rotateX: reduceMotion ? 0 : springX,
              rotateY: reduceMotion ? 0 : springY,
              transformPerspective: 1200,
            }}
            className="relative overflow-hidden rounded-[2rem] border border-sky-100/70 bg-white/55 p-6 shadow-2xl shadow-sky-500/10 backdrop-blur-2xl will-change-transform md:p-8"
          >
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-60"
              style={{ background: glare }}
            />
            <div className="pointer-events-none absolute -left-16 top-0 h-40 w-40 rounded-full bg-[#00F0FF]/18 blur-3xl" />
            {!reduceMotion && (
              <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-y-0 w-1/4 skew-x-12 bg-gradient-to-r from-transparent via-[#00F0FF]/12 to-transparent"
                animate={{ x: ["-40%", "420%"] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.2 }}
              />
            )}

            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.92, filter: "blur(8px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={spring}
                  className="relative flex min-h-[320px] flex-col items-center justify-center text-center"
                >
                  {!reduceMotion &&
                    [0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                      <motion.span
                        key={i}
                        className="absolute h-1.5 w-1.5 rounded-full bg-[#00F0FF]"
                        initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                        animate={{
                          opacity: [0, 1, 0],
                          x: Math.cos((i / 8) * Math.PI * 2) * 70,
                          y: Math.sin((i / 8) * Math.PI * 2) * 70,
                          scale: [0, 1.4, 0],
                        }}
                        transition={{ duration: 1.1, delay: 0.1 + i * 0.04, ease: "easeOut" }}
                      />
                    ))}
                  <motion.div
                    initial={{ scale: 0.4, opacity: 0, rotate: -20 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    transition={{ ...spring, delay: 0.05 }}
                    className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#00F0FF]/15 shadow-[0_0_40px_rgba(0,240,255,0.35)]"
                  >
                    <CheckCircle2 className="h-8 w-8 text-sky-500" />
                  </motion.div>
                  <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...spring, delay: 0.15 }}
                    className="font-vazirmatn text-2xl font-black text-[#0B132B] md:text-3xl"
                  >
                    پیام شما دریافت شد
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...softSpring, delay: 0.25 }}
                    className="mt-3 max-w-sm font-vazirmatn text-sm leading-7 text-slate-600"
                  >
                    به‌زودی هماهنگ‌کننده VIP برای ادامه گفت‌وگو با شما تماس می‌گیرد.
                  </motion.p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  dir="rtl"
                  onSubmit={onSubmit}
                  className="relative space-y-6 font-vazirmatn"
                  initial="hidden"
                  animate="show"
                >
                  <motion.p
                    custom={0}
                    variants={reduceMotion ? undefined : fieldVariants}
                    className="text-sm font-semibold tracking-[0.16em] text-sky-500"
                  >
                    اطلاعات تماس
                  </motion.p>

                  <motion.div
                    custom={1}
                    variants={reduceMotion ? undefined : fieldVariants}
                    className="grid gap-4 md:grid-cols-2"
                  >
                    <label className="block space-y-2">
                      <span className="text-sm font-bold text-slate-700">
                        نام و نام خانوادگی
                      </span>
                      <motion.input
                        required
                        name="name"
                        placeholder="نام کامل شما"
                        whileFocus={reduceMotion ? undefined : { scale: 1.01 }}
                        transition={spring}
                        className={fieldClass}
                      />
                    </label>
                    <label className="block space-y-2">
                      <span className="text-sm font-bold text-slate-700">ایمیل</span>
                      <motion.input
                        required
                        name="email"
                        type="email"
                        placeholder="you@company.com"
                        dir="ltr"
                        whileFocus={reduceMotion ? undefined : { scale: 1.01 }}
                        transition={spring}
                        className={fieldClass}
                      />
                    </label>
                  </motion.div>

                  <motion.label
                    custom={2}
                    variants={reduceMotion ? undefined : fieldVariants}
                    className="block space-y-2"
                  >
                    <span className="text-sm font-bold text-slate-700">شماره تماس</span>
                    <motion.input
                      name="phone"
                      type="tel"
                      placeholder="۰۹۱۲..."
                      dir="ltr"
                      whileFocus={reduceMotion ? undefined : { scale: 1.01 }}
                      transition={spring}
                      className={fieldClass}
                    />
                  </motion.label>

                  <motion.label
                    custom={3}
                    variants={reduceMotion ? undefined : fieldVariants}
                    className="block space-y-2"
                  >
                    <span className="text-sm font-bold text-slate-700">
                      موضوع درخواست
                    </span>
                    <select name="interest" className={fieldClass} defaultValue="">
                      <option value="">در حال بررسی گزینه‌ها هستم...</option>
                      {INTERESTS.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </motion.label>

                  <motion.fieldset
                    custom={4}
                    variants={reduceMotion ? undefined : fieldVariants}
                  >
                    <legend className="text-sm font-bold text-slate-700">
                      دسته‌بندی‌های موردنظر (چند گزینه)
                    </legend>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {CATEGORIES.map((category) => {
                        const active = categories.includes(category.label);
                        const Icon = category.icon;
                        return (
                          <motion.button
                            key={category.id}
                            type="button"
                            layout
                            onClick={() => toggleCategory(category.label)}
                            whileHover={
                              reduceMotion ? undefined : { y: -4, scale: 1.05 }
                            }
                            whileTap={{ scale: 0.95 }}
                            transition={spring}
                            className={`relative inline-flex items-center gap-2 overflow-hidden rounded-full border px-4 py-2.5 text-sm font-bold transition ${
                              active
                                ? "border-transparent bg-[#0B132B] text-white shadow-lg shadow-sky-500/25"
                                : "border-sky-100 bg-white/70 text-slate-700 hover:border-sky-300"
                            }`}
                          >
                            <AnimatePresence>
                              {active && !reduceMotion && (
                                <motion.span
                                  key="glow"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                  className="absolute inset-0 bg-gradient-to-l from-sky-500/30 to-[#00F0FF]/20"
                                />
                              )}
                            </AnimatePresence>
                            <Icon
                              className={`relative h-3.5 w-3.5 ${
                                active ? "text-[#00F0FF]" : "text-sky-500"
                              }`}
                            />
                            <span className="relative">{category.label}</span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.fieldset>

                  <motion.label
                    custom={5}
                    variants={reduceMotion ? undefined : fieldVariants}
                    className="block space-y-2"
                  >
                    <span className="text-sm font-bold text-slate-700">پیام</span>
                    <motion.textarea
                      name="message"
                      rows={4}
                      placeholder="جزئیات بیشتری که باید بدانیم..."
                      whileFocus={reduceMotion ? undefined : { scale: 1.01 }}
                      transition={spring}
                      className={`${fieldClass} min-h-28 resize-y`}
                    />
                  </motion.label>

                  <motion.button
                    custom={6}
                    variants={reduceMotion ? undefined : fieldVariants}
                    type="submit"
                    disabled={loading}
                    whileHover={
                      reduceMotion ? undefined : { y: -4, scale: 1.03 }
                    }
                    whileTap={{ scale: 0.97 }}
                    transition={spring}
                    className="relative inline-flex min-w-[180px] items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-l from-sky-500 to-[#00F0FF] px-7 py-3.5 text-sm font-bold text-[#0B132B] shadow-[0_20px_50px_-18px_rgba(0,240,255,0.75)] disabled:opacity-70"
                  >
                    {!reduceMotion && (
                      <motion.span
                        aria-hidden
                        className="pointer-events-none absolute inset-y-0 w-1/3 skew-x-12 bg-gradient-to-r from-transparent via-white/55 to-transparent"
                        animate={{ x: ["-140%", "240%"] }}
                        transition={{
                          duration: 1.8,
                          repeat: Infinity,
                          ease: "easeInOut",
                          repeatDelay: 1.1,
                        }}
                      />
                    )}
                    <span className="relative inline-flex items-center gap-2">
                      {loading ? (
                        <>
                          <motion.span
                            className="h-4 w-4 rounded-full border-2 border-[#0B132B]/30 border-t-[#0B132B]"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
                          />
                          در حال ارسال...
                        </>
                      ) : (
                        <>
                          ارسال درخواست
                          <Send className="h-4 w-4" />
                        </>
                      )}
                    </span>
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
