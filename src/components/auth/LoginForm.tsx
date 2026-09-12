"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { AuthField, PasswordField } from "@/components/auth/AuthFields";
import SocialButtons from "@/components/auth/SocialButtons";
import {
  ROLE_LABELS,
  isValidIdentifier,
  lookupRole,
  postAuthPath,
  setClientSession,
  toSession,
  verifyCredentials,
} from "@/lib/auth";
import { cn } from "@/lib/utils";

const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0 },
};

export default function LoginForm() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const [loading, setLoading] = useState(false);

  const detectedRole = identifier.trim() ? lookupRole(identifier) : null;

  function fail(message: string) {
    setError(message);
    setShake(true);
    window.setTimeout(() => setShake(false), 450);
    setLoading(false);
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
    window.setTimeout(() => {
      const user = verifyCredentials(identifier, password);
      if (!user) {
        fail(
          detectedRole === "client"
            ? "کد یک‌بارمصرف نادرست است. کد آزمایشی: ۱۲۳۴"
            : "اطلاعات ورود نادرست است. رمز آزمایشی: ۱۲۳۴۵۶",
        );
        return;
      }
      const session = toSession(user);
      setClientSession(session);
      void remember;
      router.replace(postAuthPath(session));
      router.refresh();
    }, 700);
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
        <div className="mb-6 flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1E3A8A] text-white shadow-lg shadow-blue-900/20">
            <BrandMark />
          </span>
          <span className="text-lg font-bold tracking-tight text-slate-900">
            درخشان<span className="text-blue-600">پرو</span>
          </span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          خوش آمدید
        </h1>
        <p className="mt-2 text-sm text-slate-500 sm:text-base">
          برای دسترسی به پیشنهادهای ویژه وارد شوید
        </p>
      </motion.div>

      <motion.div variants={item}>
        <SocialButtons />
      </motion.div>

      <motion.div variants={item} className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-xs font-medium text-slate-400">یا</span>
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
          placeholder="۰۹۱۲۱۲۳۴۵۶۷ یا admin@derakhshan.pro"
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
              {detectedRole === "client" ? " · کد: ۱۲۳۴" : " · رمز: ۱۲۳۴۵۶"}
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
          disabled={loading}
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

      <motion.p variants={item} className="mt-4 text-center text-[11px] leading-relaxed text-slate-400">
        نسخه آزمایشی: admin@derakhshan.pro / agent@derakhshan.pro (۱۲۳۴۵۶) · سایر کاربران کد
        یک‌بارمصرف ۱۲۳۴
      </motion.p>
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
