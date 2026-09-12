"use client";

import { FormEvent, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
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

const spring = { type: "spring" as const, stiffness: 90, damping: 18 };

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

export default function ContactFormSection() {
  const reduceMotion = useReducedMotion();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);

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

  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-[#F8FAFC] py-20 text-[#0B132B] md:py-28"
    >
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute -right-24 top-10 h-80 w-80 rounded-full bg-[#00F0FF]/20 blur-3xl"
          animate={
            reduceMotion
              ? undefined
              : {
                  x: [0, 28, -14, 0],
                  y: [0, 22, -10, 0],
                  opacity: [0.3, 0.55, 0.3],
                }
          }
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -left-24 bottom-10 h-96 w-96 rounded-full bg-sky-400/15 blur-3xl"
          animate={
            reduceMotion
              ? undefined
              : {
                  x: [0, -22, 16, 0],
                  y: [0, -18, 12, 0],
                  opacity: [0.25, 0.45, 0.25],
                }
          }
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="rio-container relative z-10 grid gap-10 lg:grid-cols-12 lg:gap-14">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, x: 36 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={spring}
          className="lg:col-span-5"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-sky-200/70 bg-white/70 px-4 py-2 text-sm font-semibold text-sky-700 shadow-lg shadow-sky-500/10 backdrop-blur-xl">
            <Sparkles className="h-3.5 w-3.5 text-[#00F0FF]" />
            گفت‌وگوی اختصاصی
          </span>

          <h2 className="mt-5 font-vazirmatn text-4xl font-black leading-[1.2] tracking-tight text-[#0B132B] md:text-5xl lg:text-6xl">
            بگویید دقیقاً دنبال چه ملکی هستید
          </h2>

          <p className="mt-4 max-w-md font-vazirmatn text-base leading-8 text-slate-600">
            فرم خصوصی برای موکلان خاص — جزئیات را بنویسید تا مسیر درست را با دقت و
            محرمانگی کامل باز کنیم.
          </p>

          <motion.a
            href={`mailto:${SITE.email}`}
            whileHover={reduceMotion ? undefined : { x: -4, scale: 1.02 }}
            transition={spring}
            className="mt-8 inline-flex items-center gap-3 rounded-[1.5rem] border border-sky-100/70 bg-white/60 px-5 py-4 shadow-xl shadow-sky-500/10 backdrop-blur-2xl"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#0B132B] text-[#00F0FF]">
              <Mail className="h-4 w-4" />
            </span>
            <span>
              <span className="block text-xs font-semibold text-slate-500">
                اطلاعات تماس
              </span>
              <span className="mt-0.5 inline-flex items-center gap-2 font-sans text-lg font-bold tracking-wide text-[#0B132B]">
                {SITE.email}
                <ArrowUpLeft className="h-4 w-4 text-sky-500" />
              </span>
            </span>
          </motion.a>
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={spring}
          className="lg:col-span-7"
        >
          <div className="relative overflow-hidden rounded-[2rem] border border-sky-100/70 bg-white/55 p-6 shadow-2xl shadow-sky-500/10 backdrop-blur-2xl md:p-8">
            <div className="pointer-events-none absolute -left-16 top-0 h-40 w-40 rounded-full bg-[#00F0FF]/15 blur-3xl" />

            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={spring}
                  className="flex min-h-[320px] flex-col items-center justify-center text-center"
                >
                  <motion.div
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ ...spring, delay: 0.05 }}
                    className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#00F0FF]/15"
                  >
                    <CheckCircle2 className="h-8 w-8 text-sky-500" />
                  </motion.div>
                  <p className="font-vazirmatn text-2xl font-black text-[#0B132B] md:text-3xl">
                    پیام شما دریافت شد
                  </p>
                  <p className="mt-3 max-w-sm font-vazirmatn text-sm leading-7 text-slate-600">
                    به‌زودی هماهنگ‌کننده VIP برای ادامه گفت‌وگو با شما تماس می‌گیرد.
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  dir="rtl"
                  onSubmit={onSubmit}
                  className="relative space-y-6 font-vazirmatn"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <p className="text-sm font-semibold tracking-[0.16em] text-sky-500">
                    اطلاعات تماس
                  </p>

                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="block space-y-2">
                      <span className="text-sm font-bold text-slate-700">
                        نام و نام خانوادگی
                      </span>
                      <input
                        required
                        name="name"
                        placeholder="نام کامل شما"
                        className={fieldClass}
                      />
                    </label>
                    <label className="block space-y-2">
                      <span className="text-sm font-bold text-slate-700">ایمیل</span>
                      <input
                        required
                        name="email"
                        type="email"
                        placeholder="you@company.com"
                        dir="ltr"
                        className={fieldClass}
                      />
                    </label>
                  </div>

                  <label className="block space-y-2">
                    <span className="text-sm font-bold text-slate-700">شماره تماس</span>
                    <input
                      name="phone"
                      type="tel"
                      placeholder="۰۹۱۲..."
                      dir="ltr"
                      className={fieldClass}
                    />
                  </label>

                  <label className="block space-y-2">
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
                  </label>

                  <fieldset>
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
                            onClick={() => toggleCategory(category.label)}
                            whileHover={
                              reduceMotion ? undefined : { y: -3, scale: 1.03 }
                            }
                            whileTap={{ scale: 0.97 }}
                            transition={spring}
                            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-bold transition ${
                              active
                                ? "border-transparent bg-[#0B132B] text-white shadow-lg shadow-sky-500/20"
                                : "border-sky-100 bg-white/70 text-slate-700 hover:border-sky-300"
                            }`}
                          >
                            <Icon
                              className={`h-3.5 w-3.5 ${
                                active ? "text-[#00F0FF]" : "text-sky-500"
                              }`}
                            />
                            {category.label}
                          </motion.button>
                        );
                      })}
                    </div>
                  </fieldset>

                  <label className="block space-y-2">
                    <span className="text-sm font-bold text-slate-700">پیام</span>
                    <textarea
                      name="message"
                      rows={4}
                      placeholder="جزئیات بیشتری که باید بدانیم..."
                      className={`${fieldClass} min-h-28 resize-y`}
                    />
                  </label>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={
                      reduceMotion ? undefined : { y: -3, scale: 1.02 }
                    }
                    whileTap={{ scale: 0.98 }}
                    transition={spring}
                    className="inline-flex min-w-[180px] items-center justify-center gap-2 rounded-full bg-gradient-to-l from-sky-500 to-[#00F0FF] px-7 py-3.5 text-sm font-bold text-[#0B132B] shadow-[0_20px_50px_-18px_rgba(0,240,255,0.75)] disabled:opacity-70"
                  >
                    {loading ? (
                      "در حال ارسال..."
                    ) : (
                      <>
                        ارسال درخواست
                        <Send className="h-4 w-4" />
                      </>
                    )}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
