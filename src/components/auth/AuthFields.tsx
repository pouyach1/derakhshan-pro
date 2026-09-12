"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type AuthFieldProps = {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
  dir?: "ltr" | "rtl";
  error?: boolean;
};

export function AuthField({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  autoComplete,
  dir = "ltr",
  error,
}: AuthFieldProps) {
  return (
    <label htmlFor={id} className="block space-y-2">
      <span className="text-sm font-medium text-slate-500">{label}</span>
      <input
        id={id}
        type={type}
        value={value}
        dir={dir}
        autoComplete={autoComplete}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "h-12 w-full rounded-xl border-0 bg-sky-50/70 px-4 text-sm text-slate-900 outline-none transition",
          "placeholder:text-slate-400",
          "focus:bg-white focus:ring-2 focus:ring-blue-500/35",
          error && "ring-2 ring-rose-400/70 focus:ring-rose-400/70",
        )}
      />
    </label>
  );
}

type PasswordFieldProps = Omit<AuthFieldProps, "type">;

export function PasswordField({
  id,
  label,
  value,
  onChange,
  placeholder = "••••••••",
  autoComplete = "current-password",
  error,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <label htmlFor={id} className="block space-y-2">
      <span className="text-sm font-medium text-slate-500">{label}</span>
      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          dir="ltr"
          autoComplete={autoComplete}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "h-12 w-full rounded-xl border-0 bg-sky-50/70 pe-12 ps-4 text-sm tracking-widest text-slate-900 outline-none transition",
            "placeholder:text-slate-400 placeholder:tracking-normal",
            "focus:bg-white focus:ring-2 focus:ring-blue-500/35",
            error && "ring-2 ring-rose-400/70 focus:ring-rose-400/70",
          )}
        />
        <button
          type="button"
          aria-label={visible ? "مخفی کردن رمز عبور" : "نمایش رمز عبور"}
          onClick={() => setVisible((v) => !v)}
          className="absolute end-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white hover:text-slate-700"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={visible ? "off" : "on"}
              initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotate: 10 }}
              transition={{ duration: 0.16 }}
              className="flex"
            >
              {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </motion.span>
          </AnimatePresence>
        </button>
      </div>
    </label>
  );
}
