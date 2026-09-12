"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "profile", label: "پروفایل ادمین" },
  { id: "site", label: "تنظیمات سایت" },
  { id: "notifications", label: "اعلان‌ها" },
] as const;

export default function SettingsPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("profile");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);

  return (
    <div className="space-y-4">
      <div className="rounded-[1.75rem] bg-admin-card p-4 shadow-sm ring-1 ring-slate-200/70 sm:p-5">
        <h1 className="text-xl font-semibold text-admin-navy sm:text-2xl">تنظیمات و پروفایل</h1>
        <p className="mt-1 text-sm text-slate-500">مدیریت حساب، ظاهر سایت و کانال‌های اطلاع‌رسانی</p>

        <div className="mt-4 flex flex-wrap gap-1.5 rounded-full bg-admin-soft p-1">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition",
                tab === item.id
                  ? "bg-admin-navy text-white shadow-sm"
                  : "text-slate-600 hover:text-admin-navy",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-[1.75rem] bg-admin-card p-4 shadow-sm ring-1 ring-slate-200/70 sm:p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            className="space-y-4"
          >
            {tab === "profile" ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="نام نمایشی">
                  <input className={inputClass} defaultValue="مدیر دفتر درخشان" />
                </Field>
                <Field label="ایمیل">
                  <input className={inputClass} type="email" defaultValue="manager@derakhshan.ir" />
                </Field>
                <Field label="شماره تماس">
                  <input className={inputClass} defaultValue="۰۲۱-۹۱۰۰۰۰۰۰" />
                </Field>
                <Field label="نقش">
                  <input className={inputClass} defaultValue="مدیر ارشد" readOnly />
                </Field>
                <Field label="بیوگرافی کوتاه" className="sm:col-span-2">
                  <textarea
                    className={`${inputClass} min-h-28 resize-y py-3`}
                    defaultValue="مدیریت عملیات فروش و اجاره املاک تجاری و مسکونی."
                  />
                </Field>
              </div>
            ) : null}

            {tab === "site" ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="نام برند">
                  <input className={inputClass} defaultValue="دپارتمان درخشان" />
                </Field>
                <Field label="دامنه عمومی">
                  <input className={inputClass} defaultValue="https://derakhshan.ir" />
                </Field>
                <Field label="واحد پول پیش‌فرض">
                  <select className={inputClass} defaultValue="irr">
                    <option value="irr">تومان</option>
                    <option value="usd">دلار</option>
                    <option value="eur">یورو</option>
                  </select>
                </Field>
                <Field label="زبان پنل">
                  <select className={inputClass} defaultValue="fa">
                    <option value="fa">فارسی</option>
                    <option value="en">انگلیسی</option>
                  </select>
                </Field>
                <Field label="آدرس دفتر" className="sm:col-span-2">
                  <input className={inputClass} defaultValue="مشکین دشت خیابان هدایتکار جنب فروشگاه افق کوروش" />
                </Field>
              </div>
            ) : null}

            {tab === "notifications" ? (
              <div className="space-y-3">
                <ToggleRow
                  title="ایمیل برای مشتری تازه"
                  description="هر درخواست جدید همان لحظه به ایمیل دفتر برود"
                  checked={emailAlerts}
                  onChange={setEmailAlerts}
                />
                <ToggleRow
                  title="پیامک تغییر وضعیت"
                  description="وقتی نوبت بازدید یا معامله جابه‌جا شد، پیامک بفرست"
                  checked={smsAlerts}
                  onChange={setSmsAlerts}
                />
                <Field label="ایمیل اعلان‌ها">
                  <input className={inputClass} type="email" defaultValue="office@derakhshan.ir" />
                </Field>
              </div>
            ) : null}

            <div className="flex justify-end pt-2">
              <button
                type="button"
                className="rounded-full bg-admin-sky px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-sky-500/25"
              >
                ذخیره تغییرات
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

const inputClass =
  "h-11 w-full rounded-2xl bg-admin-soft px-4 text-sm text-admin-navy outline-none ring-1 ring-transparent transition placeholder:text-slate-400 focus:bg-white focus:ring-admin-sky/50";

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block space-y-1.5", className)}>
      <span className="text-sm font-medium text-admin-navy">{label}</span>
      {children}
    </label>
  );
}

function ToggleRow({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-admin-soft px-4 py-3">
      <div>
        <p className="text-sm font-medium text-admin-navy">{title}</p>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-7 w-12 rounded-full transition",
          checked ? "bg-admin-sky" : "bg-slate-300",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition",
            checked ? "start-5" : "start-0.5",
          )}
        />
      </button>
    </div>
  );
}
