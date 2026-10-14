"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Briefcase, Building2, Loader2, UserRound } from "lucide-react";
import { useState } from "react";
import { AuthField, PasswordField } from "@/components/auth/AuthFields";
import SocialButtons from "@/components/auth/SocialButtons";
import {
  ROLE_HOME,
  ROLE_LABELS,
  isValidIdentifier,
  lookupRole,
  mirrorAuthSession,
  normalizeSecret,
  postAuthPath,
  type UserRole,
} from "@/lib/auth";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/siteConfig";
import BackButton from "@/components/navigation/BackButton";

const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0 },
};

/** فقط اگر صریحاً در env پابلیک شده باشد روی فرم نشان داده می‌شود — هیچ fallback دمو در production */
const DEMO_STAFF_PASSWORD = process.env.NEXT_PUBLIC_DEMO_STAFF_PASSWORD?.trim() || "";
const DEMO_OTP_HINT = process.env.NEXT_PUBLIC_DEMO_OTP?.trim() || "";
const SHOW_DEMO_HINTS =
  process.env.NODE_ENV !== "production" || Boolean(DEMO_STAFF_PASSWORD || DEMO_OTP_HINT);

/** یک‌کلیکی مدیر/مشاور/مشتری — در dev همیشه؛ در prod با NEXT_PUBLIC_DEMO_QUICK_LOGIN */
const SHOW_QUICK_LOGIN =
  process.env.NODE_ENV !== "production" ||
  process.env.NEXT_PUBLIC_DEMO_QUICK_LOGIN === "1" ||
  process.env.NEXT_PUBLIC_DEMO_QUICK_LOGIN === "true" ||
  Boolean(DEMO_STAFF_PASSWORD || DEMO_OTP_HINT);

const QUICK_ROLES: {
  role: UserRole;
  label: string;
  hint: string;
  icon: typeof Building2;
  accent: string;
}[] = [
  {
    role: "admin",
    label: "مدیر",
    hint: "پنل مدیریت",
    icon: Building2,
    accent: "from-slate-900 to-slate-700",
  },
  {
    role: "agent",
    label: "مشاور",
    hint: "پنل مشاور",
    icon: Briefcase,
    accent: "from-blue-800 to-blue-600",
  },
  {
    role: "client",
    label: "مشتری",
    hint: "پنل مشتری",
    icon: UserRound,
    accent: "from-sky-700 to-cyan-600",
  },
];

export default function LoginForm() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(false);
  const [quickRole, setQuickRole] = useState<UserRole | null>(null);

  const detectedRole = identifier.trim() ? lookupRole(identifier) : null;
  const busy = loading || quickRole !== null;

  function fail(message: string) {
    setError(message);
    setShake(true);
    window.setTimeout(() => setShake(false), 450);
    setLoading(false);
    setQuickRole(null);
  }

  function finishLogin(payload: {
    data?: { session?: Parameters<typeof mirrorAuthSession>[0]; redirectTo?: string };
  }) {
    const session = payload.data?.session;
    const nextParam =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("next")
        : null;
    const safeNext =
      nextParam &&
      nextParam.startsWith("/") &&
      !nextParam.startsWith("//") &&
      !nextParam.startsWith("/login")
        ? nextParam
        : null;
    const redirectTo =
      safeNext ||
      payload.data?.redirectTo ||
      (session ? postAuthPath(session) : ROLE_HOME.client);
    if (session) mirrorAuthSession(session);
    router.replace(redirectTo);
    router.refresh();
  }

  async function quickLogin(role: UserRole) {
    setError("");
    setQuickRole(role);
    try {
      const res = await fetch("/api/auth/demo-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      const payload = await res.json();
      if (!res.ok || !payload.ok) {
        fail(payload?.error?.message || `ورود ${ROLE_LABELS[role]} انجام نشد.`);
        return;
      }
      finishLogin(payload);
    } catch {
      fail("ارتباط با سرور برقرار نشد. دوباره تلاش کنید.");
    } finally {
      setQuickRole(null);
    }
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    if (!isValidIdentifier(identifier)) {
      fail("ایمیل یا شماره موبایل معتبر وارد کنید.");
      return;
    }
    if (!password.trim()) {
      fail("رمز عبور یا کد یک‌بارمصرف الزامی است.");
      return;
    }

    setLoading(true);
    void (async () => {
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            identifier,
            secret: normalizeSecret(password),
          }),
        });
        const payload = await res.json();
        if (!res.ok || !payload.ok) {
          const fallback =
            detectedRole === "client"
              ? "ایمیل/موبایل یا رمز عبور نادرست است."
              : DEMO_STAFF_PASSWORD
                ? `اطلاعات ورود نادرست است. رمز آزمایشی: ${DEMO_STAFF_PASSWORD}`
                : "اطلاعات ورود نادرست است.";
          fail(payload?.error?.message || fallback);
          return;
        }
        void remember;
        finishLogin(payload);
      } catch {
        fail("ارتباط با سرور برقرار نشد. دوباره تلاش کنید.");
      } finally {
        setLoading(false);
      }
    })();
  }

  return (
    <motion.div
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.06, delayChildren: 0.08 } },
      }}
      initial="hidden"
      animate="show"
      className="flex h-full flex-col justify-center px-6 py-8 font-vazirmatn sm:px-10 lg:px-12"
      dir="rtl"
    >
      <motion.div variants={item} className="mb-8">
        <div className="mb-5">
          <BackButton fallbackHref="/" label="بازگشت به سایت" tone="light" preferHistory={false} />
        </div>
        <div className="mb-6 flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1E3A8A] text-white shadow-lg shadow-blue-900/20">
            <BrandMark />
          </span>
          <span className="text-lg font-bold tracking-tight text-slate-900">
            {siteConfig.brand.shortNameFa}
          </span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          خوش آمدید
        </h1>
        <p className="mt-2 text-sm text-slate-600 sm:text-base">
          نقش خود را انتخاب کنید و با یک دکمه وارد شوید — یا ایمیل/موبایل را دستی وارد کنید
        </p>
      </motion.div>

      {SHOW_QUICK_LOGIN ? (
        <motion.div variants={item} className="mb-6 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-slate-800">ورود سریع نمایشی</p>
            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700 ring-1 ring-emerald-100">
              بدون تایپ رمز
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2.5">
            {QUICK_ROLES.map(({ role, label, hint, icon: Icon, accent }) => {
              const active = quickRole === role;
              return (
                <button
                  key={role}
                  type="button"
                  disabled={busy}
                  onClick={() => void quickLogin(role)}
                  className={cn(
                    "group relative flex flex-col items-center gap-1.5 rounded-2xl px-2 py-3.5 text-white shadow-md transition",
                    "bg-gradient-to-br disabled:opacity-60",
                    accent,
                    "hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500",
                  )}
                >
                  {active ? (
                    <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
                  ) : (
                    <Icon className="h-5 w-5 opacity-95" aria-hidden />
                  )}
                  <span className="text-sm font-bold">{label}</span>
                  <span className="text-[10px] font-medium text-white/80">{hint}</span>
                </button>
              );
            })}
          </div>
          <p className="text-center text-[11px] text-slate-400">
            مناسب بازاریاب و دمو — مدیر · مشاور · مشتری
          </p>
        </motion.div>
      ) : null}

      <motion.div variants={item}>
        <SocialButtons />
      </motion.div>

      <motion.div variants={item} className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-xs font-medium text-slate-400">یا ورود دستی</span>
        <div className="h-px flex-1 bg-slate-200" />
      </motion.div>

      <motion.form
        variants={item}
        onSubmit={handleSubmit}
        animate={shake ? { x: [0, -8, 8, -6, 6, -2, 2, 0] } : { x: 0 }}
        transition={{ duration: 0.42 }}
        className="space-y-4"
      >
        <AuthField
          id="identifier"
          label="ایمیل / موبایل"
          value={identifier}
          onChange={setIdentifier}
          placeholder={`۰۹۱۲۱۲۳۴۵۶۷ یا ${siteConfig.panels.demoAdminEmail}`}
          autoComplete="username"
          dir="rtl"
          error={Boolean(error)}
        />

        <PasswordField
          id="password"
          label="رمز عبور / کد یک‌بارمصرف"
          value={password}
          onChange={setPassword}
          placeholder="رمز یا کد را وارد کنید"
          error={Boolean(error)}
        />

        <AnimatePresence>
          {detectedRole ? (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-100"
            >
              نقش تشخیص‌داده‌شده: {ROLE_LABELS[detectedRole]}
              {detectedRole === "client"
                ? ` · مسیر: پنل مشتری${DEMO_OTP_HINT ? ` · کد دمو: ${DEMO_OTP_HINT}` : ""}`
                : detectedRole === "admin"
                  ? ` · مسیر: پنل مدیر${DEMO_STAFF_PASSWORD ? ` · رمز: ${DEMO_STAFF_PASSWORD}` : ""}`
                  : ` · مسیر: پنل مشاور${DEMO_STAFF_PASSWORD ? ` · رمز: ${DEMO_STAFF_PASSWORD}` : ""}`}
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div className="flex items-center justify-between gap-3 pt-1">
          <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            مرا به خاطر بسپار
          </label>
          <button
            type="button"
            className="text-sm font-medium text-slate-500 transition hover:text-blue-700 hover:underline"
          >
            فراموشی رمز عبور؟
          </button>
        </div>

        {error ? (
          <p
            role="alert"
            className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700 ring-1 ring-rose-100"
          >
            {error}
          </p>
        ) : null}

        <motion.button
          type="submit"
          disabled={busy}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#1E3A8A] text-sm font-semibold text-white",
            "shadow-lg shadow-blue-900/20 transition hover:bg-blue-800 disabled:opacity-70",
          )}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              در حال ورود…
            </>
          ) : (
            "ورود"
          )}
        </motion.button>
      </motion.form>

      <motion.p variants={item} className="mt-6 text-center text-sm text-slate-500">
        حساب کاربری ندارید؟{" "}
        <Link href="/contact" className="font-semibold text-[#1E3A8A] transition hover:underline">
          ثبت‌نام
        </Link>
      </motion.p>

      {SHOW_DEMO_HINTS ? (
        <motion.p variants={item} className="mt-4 text-center text-[11px] leading-relaxed text-slate-400">
          نسخه آزمایشی: {siteConfig.panels.demoAdminEmail} / {siteConfig.panels.demoAgentEmail}
          {DEMO_STAFF_PASSWORD ? ` · رمز پنل: ${DEMO_STAFF_PASSWORD}` : ""}
          {DEMO_OTP_HINT ? ` · کد مشتری: ${DEMO_OTP_HINT}` : ""}
        </motion.p>
      ) : null}
    </motion.div>
  );
}

function BrandMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 18V8.8L12 4l8 4.8V18a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M9 19v-6h6v6" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}
