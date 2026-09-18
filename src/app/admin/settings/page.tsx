"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { siteConfig } from "@/config/siteConfig";

const TABS = [
  { id: "profile", label: "پروفایل ادمین" },
  { id: "site", label: "تنظیمات سایت" },
  { id: "notifications", label: "اعلان‌ها" },
] as const;

type Settings = {
  managerNameFa: string;
  notifyEmail: string;
  emailAlerts: boolean;
  smsAlerts: boolean;
  phone: string;
  address: string;
  publicDomain: string;
};

export default function SettingsPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("profile");
  const [form, setForm] = useState<Settings>({
    managerNameFa: siteConfig.brand.managerNameFa,
    notifyEmail: siteConfig.contact.email,
    emailAlerts: true,
    smsAlerts: false,
    phone: siteConfig.contact.phone,
    address: siteConfig.contact.address.line1,
    publicDomain: siteConfig.panels.publicDomain,
  });
  const [status, setStatus] = useState("");

  useEffect(() => {
    void (async () => {
      const res = await api<Settings>("/api/settings");
      if (res.ok) setForm(res.data);
    })();
  }, []);

  async function save() {
    const res = await api("/api/settings", { method: "PATCH", body: JSON.stringify(form) });
    setStatus(res.ok ? "ذخیره شد. هویت عمومی سایت را در siteConfig.ts عوض کنید." : res.error.message);
  }

  return (
    <div className="space-y-4">
      <div className="rounded-[1.75rem] bg-admin-card p-4 shadow-sm ring-1 ring-slate-200/70 sm:p-5">
        <h1 className="text-xl font-semibold text-admin-navy sm:text-2xl">تنظیمات و پروفایل</h1>
        <p className="mt-1 text-sm text-slate-500">
          تنظیمات عملیاتی دفتر. نام برند و شبکه‌های اجتماعی همچنان از فایل OWNER_FILL می‌آید.
        </p>
        <div className="mt-4 flex flex-wrap gap-1.5 rounded-full bg-admin-soft p-1">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium",
                tab === item.id ? "bg-admin-navy text-white" : "text-slate-600",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-[1.75rem] bg-admin-card p-4 shadow-sm ring-1 ring-slate-200/70 sm:p-6">
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            {tab === "profile" ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="نام نمایشی">
                  <input className={inputClass} value={form.managerNameFa} onChange={(e) => setForm((f) => ({ ...f, managerNameFa: e.target.value }))} />
                </Field>
                <Field label="ایمیل اعلان">
                  <input className={inputClass} value={form.notifyEmail} onChange={(e) => setForm((f) => ({ ...f, notifyEmail: e.target.value }))} />
                </Field>
                <Field label="شماره تماس">
                  <input className={inputClass} value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
                </Field>
                <Field label="آدرس دفتر" className="sm:col-span-2">
                  <input className={inputClass} value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} />
                </Field>
              </div>
            ) : null}
            {tab === "site" ? (
              <Field label="دامنه عمومی">
                <input className={inputClass} value={form.publicDomain} onChange={(e) => setForm((f) => ({ ...f, publicDomain: e.target.value }))} />
              </Field>
            ) : null}
            {tab === "notifications" ? (
              <div className="space-y-3">
                <label className="flex items-center justify-between rounded-2xl bg-admin-soft px-4 py-3 text-sm">
                  ایمیل برای مشتری تازه
                  <input type="checkbox" checked={form.emailAlerts} onChange={(e) => setForm((f) => ({ ...f, emailAlerts: e.target.checked }))} />
                </label>
                <label className="flex items-center justify-between rounded-2xl bg-admin-soft px-4 py-3 text-sm">
                  پیامک تغییر وضعیت
                  <input type="checkbox" checked={form.smsAlerts} onChange={(e) => setForm((f) => ({ ...f, smsAlerts: e.target.checked }))} />
                </label>
              </div>
            ) : null}
            <div className="flex justify-end pt-2">
              <button type="button" onClick={() => void save()} className="rounded-full bg-admin-sky px-5 py-2.5 text-sm font-medium text-white">
                ذخیره تغییرات
              </button>
            </div>
            {status ? <p className="text-sm text-slate-500">{status}</p> : null}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

const inputClass =
  "h-11 w-full rounded-2xl bg-admin-soft px-4 text-sm text-admin-navy outline-none focus:bg-white focus:ring-2 focus:ring-admin-sky/40";

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
