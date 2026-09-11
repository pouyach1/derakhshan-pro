"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  KeyRound,
  Loader2,
  Phone,
  ShieldCheck,
  Smartphone,
  UserRound,
} from "lucide-react";
import {
  ROLE_LABELS,
  homeForRole,
  isValidIranMobile,
  lookupRole,
  normalizePhone,
  resolveUser,
  setClientSession,
  toSession,
  verifyCredentials,
  type UserRole,
} from "@/lib/auth";
import { cn } from "@/lib/utils";

type Step = "phone" | "auth";

const roleMeta: Record<UserRole, { icon: typeof ShieldCheck; badge: string; hint: string }> = {
  admin: {
    icon: ShieldCheck,
    badge: "bg-slate-900 text-white",
    hint: "ورود با رمز عبور مدیریت",
  },
  agent: {
    icon: Building2,
    badge: "bg-sky-700 text-white",
    hint: "ورود با رمز عبور مشاور",
  },
  client: {
    icon: UserRound,
    badge: "bg-amber-800/90 text-white",
    hint: "کد یک‌بارمصرف پیامک‌شده را وارد کنید",
  },
};

const ease = [0.22, 1, 0.36, 1] as const;

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [secret, setSecret] = useState("");
  const [role, setRole] = useState<UserRole | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const normalized = useMemo(() => normalizePhone(phone), [phone]);
  const RoleIcon = role ? roleMeta[role].icon : Phone;

  function handlePhoneContinue(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    if (!isValidIranMobile(normalized)) {
      setError("شماره موبایل معتبر وارد کنید (مثال: ۰۹۱۲۱۱۱۱۱۱۱)");
      return;
    }
    setRole(lookupRole(normalized));
    setSecret("");
    setStep("auth");
  }

  function handleAuthSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);

    window.setTimeout(() => {
      const user = verifyCredentials(normalized, secret);
      if (!user) {
        setError(role === "client" ? "کد تأیید نادرست است" : "رمز عبور نادرست است");
        setLoading(false);
        return;
      }
      setClientSession(toSession(user));
      router.replace(homeForRole(user.role));
      router.refresh();
    }, 420);
  }

  function goBack() {
    setStep("phone");
    setSecret("");
    setError("");
  }

  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden px-4 py-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(15,23,42,0.05),_transparent_55%),radial-gradient(ellipse_at_bottom_left,_rgba(14,165,233,0.07),_transparent_45%)]"
      />

      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-900/15">
            <Building2 className="h-6 w-6" strokeWidth={1.6} />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">درخشان پرو</h1>
          <p className="mt-2 text-sm text-slate-500">ورود هوشمند چندنقشی به پلتفرم املاک</p>
        </div>

        <div className="rounded-[1.75rem] bg-white/85 p-6 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.4)] ring-1 ring-slate-900/5 backdrop-blur-sm sm:p-8">
          <div className="mb-6 flex items-center justify-center gap-2">
            {(["phone", "auth"] as Step[]).map((item, index) => (
              <div key={item} className="flex items-center gap-2">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition",
                    step === item || (step === "auth" && item === "phone")
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-400",
                  )}
                >
                  {index + 1}
                </div>
                {index === 0 ? <div className="h-px w-8 bg-slate-200" /> : null}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === "phone" ? (
              <motion.form
                key="phone"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.3, ease }}
                onSubmit={handlePhoneContinue}
                className="space-y-5"
              >
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">شماره موبایل</h2>
                  <p className="mt-1 text-sm text-slate-500">نقش شما از روی شماره شناسایی می‌شود</p>
                </div>

                <label className="block space-y-2">
                  <span className="text-xs font-medium text-slate-500">موبایل</span>
                  <div className="relative">
                    <Phone className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      dir="ltr"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="09121111111"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="h-12 w-full rounded-2xl border-0 bg-[#F1EFEA] pe-4 ps-10 text-sm text-slate-900 outline-none ring-1 ring-transparent transition placeholder:text-slate-400 focus:bg-white focus:ring-sky-500/35"
                    />
                  </div>
                </label>

                {error ? <p className="text-sm text-rose-600">{error}</p> : null}

                <button
                  type="submit"
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 text-sm font-medium text-white transition hover:bg-slate-800"
                >
                  ادامه
                  <ArrowLeft className="h-4 w-4" />
                </button>

                <p className="text-center text-[11px] leading-relaxed text-slate-400">
                  نمونه: مدیر ۰۹۱۲۱۱۱۱۱۱۱ · مشاور ۰۹۱۲۲۲۲۲۲۲۲ · سایر شماره‌ها کاربر
                </p>
              </motion.form>
            ) : (
              <motion.form
                key="auth"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.3, ease }}
                onSubmit={handleAuthSubmit}
                className="space-y-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">تأیید هویت</h2>
                    <p className="mt-1 text-sm text-slate-500" dir="ltr">
                      {normalized}
                    </p>
                  </div>
                  {role ? (
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium",
                        roleMeta[role].badge,
                      )}
                    >
                      <RoleIcon className="h-3.5 w-3.5" />
                      {ROLE_LABELS[role]}
                    </span>
                  ) : null}
                </div>

                <p className="rounded-2xl bg-[#F1EFEA] px-4 py-3 text-sm text-slate-600">
                  {role ? roleMeta[role].hint : ""}
                  {role === "client" ? " — کد نمونه: ۱۲۳۴" : " — رمز نمونه: ۱۲۳۴۵۶"}
                </p>

                <label className="block space-y-2">
                  <span className="text-xs font-medium text-slate-500">
                    {role === "client" ? "کد یک‌بارمصرف" : "رمز عبور"}
                  </span>
                  <div className="relative">
                    {role === "client" ? (
                      <Smartphone className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    ) : (
                      <KeyRound className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    )}
                    <input
                      dir="ltr"
                      type={role === "client" ? "text" : "password"}
                      inputMode={role === "client" ? "numeric" : "text"}
                      autoComplete={role === "client" ? "one-time-code" : "current-password"}
                      placeholder={role === "client" ? "1234" : "••••••"}
                      value={secret}
                      onChange={(e) => setSecret(e.target.value)}
                      className="h-12 w-full rounded-2xl border-0 bg-[#F1EFEA] pe-4 ps-10 text-sm tracking-widest text-slate-900 outline-none ring-1 ring-transparent transition placeholder:text-slate-400 placeholder:tracking-normal focus:bg-white focus:ring-sky-500/35"
                    />
                  </div>
                </label>

                {error ? <p className="text-sm text-rose-600">{error}</p> : null}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={goBack}
                    className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-slate-100 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
                  >
                    <ArrowRight className="h-4 w-4" />
                    بازگشت
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex h-12 flex-[1.4] items-center justify-center gap-2 rounded-2xl bg-slate-900 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-70"
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "ورود"}
                  </button>
                </div>

                <p className="text-center text-[11px] text-slate-400">
                  ورود به‌عنوان {role ? resolveUser(normalized).name : "کاربر"}
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
