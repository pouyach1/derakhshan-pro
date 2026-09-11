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
  homeForRole,
  isValidIdentifier,
  lookupRole,
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
      fail("Enter a valid email or Iranian mobile number.");
      return;
    }
    if (!password.trim()) {
      fail("Password / OTP is required.");
      return;
    }

    setLoading(true);
    window.setTimeout(() => {
      const user = verifyCredentials(identifier, password);
      if (!user) {
        fail(
          detectedRole === "client"
            ? "Invalid OTP. Try demo code 1234."
            : "Invalid credentials. Try password 123456.",
        );
        return;
      }
      setClientSession(toSession(user));
      void remember;
      router.replace(homeForRole(user.role));
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
      className="flex h-full flex-col justify-center px-6 py-8 sm:px-10 lg:px-12"
    >
      <motion.div variants={item} className="mb-8">
        <div className="mb-6 flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1E3A8A] text-white shadow-lg shadow-blue-900/20">
            <BrandMark />
          </span>
          <span className="text-lg font-bold tracking-tight text-slate-900">
            Havenix<span className="text-blue-600">.</span>
          </span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Welcome Back</h1>
        <p className="mt-2 text-sm text-slate-500 sm:text-base">
          Let&apos;s login to grab amazing deals
        </p>
      </motion.div>

      <motion.div variants={item}>
        <SocialButtons />
      </motion.div>

      <motion.div variants={item} className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-xs font-medium uppercase tracking-wide text-slate-400">Or</span>
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
          label="Email / Phone"
          value={identifier}
          onChange={setIdentifier}
          placeholder="admin@derakhshan.pro"
          autoComplete="username"
          error={Boolean(error)}
        />

        <PasswordField
          id="password"
          label="Password"
          value={password}
          onChange={setPassword}
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
              Detected role: {ROLE_LABELS[detectedRole]}
              {detectedRole === "client" ? " · use OTP 1234" : " · use password 123456"}
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
            Remember me
          </label>
          <button
            type="button"
            className="text-sm font-medium text-slate-500 transition hover:text-blue-700 hover:underline"
          >
            Forgot Password?
          </button>
        </div>

        {error ? <p className="text-sm text-rose-600">{error}</p> : null}

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
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Login"}
        </motion.button>
      </motion.form>

      <motion.p variants={item} className="mt-6 text-center text-sm text-slate-500">
        Don&apos;t have an account?{" "}
        <Link href="/contact" className="font-semibold text-[#1E3A8A] transition hover:underline">
          Sign Up
        </Link>
      </motion.p>

      <motion.p variants={item} className="mt-4 text-center text-[11px] leading-relaxed text-slate-400">
        Demo: admin@derakhshan.pro / agent@derakhshan.pro (123456) · any other email OTP 1234
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
