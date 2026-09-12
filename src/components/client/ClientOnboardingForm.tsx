"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import {
  BUDGET_PRESETS,
  DEAL_INTENT_LABELS,
  NEIGHBORHOOD_OPTIONS,
  completeClientOnboarding,
  readClientSession,
  setClientSession,
  type ClientProfile,
  type DealIntent,
} from "@/lib/auth";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: "name", title: "نام و نام خانوادگی" },
  { id: "intent", title: "قصد معاملاتی" },
  { id: "areas", title: "مناطق مدنظر" },
  { id: "budget", title: "بازه بودجه" },
  { id: "features", title: "ویژگی‌های ملک" },
] as const;

const ease = [0.22, 1, 0.36, 1] as const;

export default function ClientOnboardingForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [fullName, setFullName] = useState("");
  const [intent, setIntent] = useState<DealIntent>("buy");
  const [neighborhoods, setNeighborhoods] = useState<string[]>([]);
  const [budgetIndex, setBudgetIndex] = useState(1);
  const [areaMin, setAreaMin] = useState("80");
  const [areaMax, setAreaMax] = useState("180");
  const [bedrooms, setBedrooms] = useState(2);
  const [hasElevator, setHasElevator] = useState(true);
  const [hasParking, setHasParking] = useState(true);

  const progress = useMemo(() => ((step + 1) / STEPS.length) * 100, [step]);

  function toggleNeighborhood(value: string) {
    setNeighborhoods((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value],
    );
  }

  function validateStep(): boolean {
    setError("");
    if (step === 0 && fullName.trim().length < 3) {
      setError("لطفاً نام و نام خانوادگی را کامل وارد کنید.");
      return false;
    }
    if (step === 2 && neighborhoods.length === 0) {
      setError("حداقل یک محله یا منطقه را انتخاب کنید.");
      return false;
    }
    if (step === 4) {
      const min = Number(areaMin);
      const max = Number(areaMax);
      if (!min || !max || min > max) {
        setError("بازه متراژ را به‌درستی وارد کنید.");
        return false;
      }
    }
    return true;
  }

  function goNext() {
    if (!validateStep()) return;
    if (step < STEPS.length - 1) {
      setStep((value) => value + 1);
      return;
    }
    finish();
  }

  function goBack() {
    setError("");
    setStep((value) => Math.max(0, value - 1));
  }

  function finish() {
    const session = readClientSession();
    if (!session || session.role !== "client") {
      router.replace("/login");
      return;
    }

    const budget = BUDGET_PRESETS[budgetIndex] ?? BUDGET_PRESETS[1];
    const profile: ClientProfile = {
      fullName: fullName.trim(),
      intent,
      neighborhoods,
      budgetMin: budget.min,
      budgetMax: budget.max,
      areaMin: Number(areaMin) || 0,
      areaMax: Number(areaMax) || 0,
      bedrooms,
      hasElevator,
      hasParking,
    };

    setSaving(true);
    setClientSession(completeClientOnboarding(session, profile));
    window.setTimeout(() => {
      router.replace("/");
      router.refresh();
    }, 450);
  }

  return (
    <div
      dir="rtl"
      className="mx-auto w-full max-w-xl rounded-[1.75rem] border border-slate-200/60 bg-white/85 p-5 shadow-xl shadow-slate-900/5 backdrop-blur-md sm:p-7"
    >
      <div className="mb-6">
        <p className="font-vazirmatn text-xs text-slate-500">پروفایل مشتری · درخشان پرو</p>
        <h1 className="mt-1 font-vazirmatn text-xl font-semibold text-slate-900 sm:text-2xl">
          تکمیل پروفایل ملکی
        </h1>
        <p className="mt-1 font-vazirmatn text-sm text-slate-500">
          چند گام کوتاه برای پیشنهادهای دقیق‌تر
        </p>
      </div>

      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between font-vazirmatn text-xs text-slate-500">
          <span>
            مرحله {(step + 1).toLocaleString("fa-IR")} از {STEPS.length.toLocaleString("fa-IR")}
          </span>
          <span>{STEPS[step].title}</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <motion.div
            className="h-full rounded-full bg-emerald-600"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.35, ease }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 18 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -14 }}
          transition={{ duration: 0.28, ease }}
          className="min-h-[14rem]"
        >
          {step === 0 ? (
            <label className="block font-vazirmatn text-sm text-slate-600">
              نام و نام خانوادگی
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="مثلاً محمد رضایی"
                className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-[#F1EFEA]/70 px-4 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </label>
          ) : null}

          {step === 1 ? (
            <div className="grid gap-2">
              {(Object.keys(DEAL_INTENT_LABELS) as DealIntent[]).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setIntent(value)}
                  className={cn(
                    "rounded-2xl px-4 py-3 text-start font-vazirmatn text-sm ring-1 transition",
                    intent === value
                      ? "bg-emerald-600 text-white ring-emerald-600"
                      : "bg-[#F1EFEA]/70 text-slate-700 ring-slate-200 hover:bg-white",
                  )}
                >
                  {DEAL_INTENT_LABELS[value]}
                </button>
              ))}
            </div>
          ) : null}

          {step === 2 ? (
            <div className="flex flex-wrap gap-2">
              {NEIGHBORHOOD_OPTIONS.map((area) => {
                const active = neighborhoods.includes(area);
                return (
                  <button
                    key={area}
                    type="button"
                    onClick={() => toggleNeighborhood(area)}
                    className={cn(
                      "rounded-full px-3.5 py-2 font-vazirmatn text-sm ring-1 transition",
                      active
                        ? "bg-emerald-600 text-white ring-emerald-600"
                        : "bg-white text-slate-600 ring-slate-200 hover:bg-slate-50",
                    )}
                  >
                    {area}
                  </button>
                );
              })}
            </div>
          ) : null}

          {step === 3 ? (
            <div className="grid gap-2">
              {BUDGET_PRESETS.map((preset, index) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setBudgetIndex(index)}
                  className={cn(
                    "rounded-2xl px-4 py-3 text-start font-vazirmatn text-sm ring-1 transition",
                    budgetIndex === index
                      ? "bg-slate-900 text-white ring-slate-900"
                      : "bg-[#F1EFEA]/70 text-slate-700 ring-slate-200 hover:bg-white",
                  )}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          ) : null}

          {step === 4 ? (
            <div className="space-y-4 font-vazirmatn">
              <div className="grid grid-cols-2 gap-3">
                <label className="text-sm text-slate-600">
                  حداقل متراژ
                  <input
                    type="number"
                    min={20}
                    value={areaMin}
                    onChange={(e) => setAreaMin(e.target.value)}
                    className="mt-2 h-11 w-full rounded-2xl border border-slate-200 bg-[#F1EFEA]/70 px-3 text-sm outline-none focus:border-emerald-500"
                  />
                </label>
                <label className="text-sm text-slate-600">
                  حداکثر متراژ
                  <input
                    type="number"
                    min={20}
                    value={areaMax}
                    onChange={(e) => setAreaMax(e.target.value)}
                    className="mt-2 h-11 w-full rounded-2xl border border-slate-200 bg-[#F1EFEA]/70 px-3 text-sm outline-none focus:border-emerald-500"
                  />
                </label>
              </div>

              <div>
                <p className="mb-2 text-sm text-slate-600">تعداد خواب</p>
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5].map((count) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => setBedrooms(count)}
                      className={cn(
                        "h-10 w-10 rounded-full text-sm ring-1 transition",
                        bedrooms === count
                          ? "bg-emerald-600 text-white ring-emerald-600"
                          : "bg-white text-slate-600 ring-slate-200",
                      )}
                    >
                      {count.toLocaleString("fa-IR")}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setHasElevator((value) => !value)}
                  className={cn(
                    "rounded-full px-3.5 py-2 text-sm ring-1 transition",
                    hasElevator
                      ? "bg-emerald-600 text-white ring-emerald-600"
                      : "bg-white text-slate-600 ring-slate-200",
                  )}
                >
                  آسانسور
                </button>
                <button
                  type="button"
                  onClick={() => setHasParking((value) => !value)}
                  className={cn(
                    "rounded-full px-3.5 py-2 text-sm ring-1 transition",
                    hasParking
                      ? "bg-emerald-600 text-white ring-emerald-600"
                      : "bg-white text-slate-600 ring-slate-200",
                  )}
                >
                  پارکینگ
                </button>
              </div>
            </div>
          ) : null}
        </motion.div>
      </AnimatePresence>

      {error ? (
        <p
          role="alert"
          className="mt-4 rounded-xl bg-rose-50 px-3 py-2 font-vazirmatn text-sm text-rose-700 ring-1 ring-rose-100"
        >
          {error}
        </p>
      ) : null}

      <div className="mt-6 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={goBack}
          disabled={step === 0 || saving}
          className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 font-vazirmatn text-sm text-slate-600 ring-1 ring-slate-200 transition hover:bg-white disabled:opacity-40"
        >
          <ArrowRight className="h-4 w-4" />
          قبلی
        </button>
        <button
          type="button"
          onClick={goNext}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-2.5 font-vazirmatn text-sm font-medium text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:opacity-70"
        >
          {step === STEPS.length - 1 ? (saving ? "در حال ذخیره…" : "ثبت و ادامه") : "بعدی"}
          {step < STEPS.length - 1 ? <ArrowLeft className="h-4 w-4" /> : <Check className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
