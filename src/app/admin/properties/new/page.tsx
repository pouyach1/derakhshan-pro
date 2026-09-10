"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ADMIN_CONTACTS, PROPERTY_AMENITIES } from "@/config/admin";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: 1, title: "اطلاعات کلی" },
  { id: 2, title: "مشخصات" },
  { id: 3, title: "رسانه" },
  { id: 4, title: "مشاور" },
] as const;

export default function NewPropertyPage() {
  const [step, setStep] = useState(1);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [previews, setPreviews] = useState<string[]>([
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=400&q=80",
  ]);
  const [agentId, setAgentId] = useState(ADMIN_CONTACTS.find((c) => c.role === "Realtor")?.id ?? "");

  const realtors = ADMIN_CONTACTS.filter((contact) => contact.role === "Realtor");

  const toggleAmenity = (item: string) => {
    setAmenities((prev) => (prev.includes(item) ? prev.filter((value) => value !== item) : [...prev, item]));
  };

  return (
    <div className="space-y-4">
      <div className="rounded-[1.75rem] bg-admin-card p-4 shadow-sm ring-1 ring-slate-200/70 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-slate-500">
              <Link href="/admin/properties" className="hover:text-admin-sky">
                مدیریت املاک
              </Link>
              <span className="mx-2 text-slate-300">/</span>
              ملک جدید
            </p>
            <h1 className="mt-1 text-xl font-semibold text-admin-navy sm:text-2xl">افزودن / ویرایش ملک</h1>
          </div>
          <div className="flex items-center gap-2">
            {STEPS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setStep(item.id)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-medium transition sm:text-sm",
                  step === item.id
                    ? "bg-admin-navy text-white"
                    : step > item.id
                      ? "bg-sky-50 text-admin-sky"
                      : "bg-admin-soft text-slate-500",
                )}
              >
                {item.id}. {item.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-[1.75rem] bg-admin-card p-4 shadow-sm ring-1 ring-slate-200/70 sm:p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.25 }}
            className="space-y-5"
          >
            {step === 1 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="عنوان ملک">
                  <input className={inputClass} placeholder="مثلاً آپارتمان ۵۲ اسکله" defaultValue="آپارتمان جدید" />
                </Field>
                <Field label="دسته‌بندی">
                  <select className={inputClass} defaultValue="apartment">
                    <option value="apartment">آپارتمان</option>
                    <option value="villa">ویلا</option>
                    <option value="commercial">تجاری</option>
                  </select>
                </Field>
                <Field label="وضعیت معامله">
                  <select className={inputClass} defaultValue="sale">
                    <option value="sale">فروش</option>
                    <option value="rent">اجاره</option>
                  </select>
                </Field>
                <Field label="قیمت">
                  <input className={inputClass} placeholder="مثلاً ۳۲٬۰۰۰ دلار" />
                </Field>
                <Field label="موقعیت" className="sm:col-span-2">
                  <input className={inputClass} placeholder="شهر، محله، آدرس" />
                </Field>
              </div>
            ) : null}

            {step === 2 ? (
              <div className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <Field label="تعداد اتاق">
                    <input className={inputClass} type="number" min={0} defaultValue={3} />
                  </Field>
                  <Field label="متراژ (متر)">
                    <input className={inputClass} type="number" min={0} defaultValue={110} />
                  </Field>
                  <Field label="سرویس بهداشتی">
                    <input className={inputClass} type="number" min={0} defaultValue={2} />
                  </Field>
                  <Field label="وضعیت مبله">
                    <select className={inputClass} defaultValue="furnished">
                      <option value="furnished">مبله</option>
                      <option value="semi">نیمه‌مبله</option>
                      <option value="empty">غیرمبله</option>
                    </select>
                  </Field>
                </div>
                <div>
                  <p className="mb-3 text-sm font-medium text-admin-navy">امکانات</p>
                  <div className="flex flex-wrap gap-2">
                    {PROPERTY_AMENITIES.map((item) => {
                      const active = amenities.includes(item);
                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() => toggleAmenity(item)}
                          className={cn(
                            "rounded-full px-3.5 py-2 text-sm transition",
                            active
                              ? "bg-admin-sky text-white shadow-sm shadow-sky-500/20"
                              : "bg-admin-soft text-slate-600 hover:bg-slate-200/80",
                          )}
                        >
                          {item}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : null}

            {step === 3 ? (
              <div className="space-y-4">
                <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-[1.5rem] border-2 border-dashed border-admin-sky/50 bg-sky-50/60 px-6 py-12 text-center transition hover:border-admin-sky hover:bg-sky-50">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-admin-sky text-white shadow-lg shadow-sky-500/30">
                    <UploadIcon />
                  </span>
                  <span className="text-sm font-medium text-admin-navy">تصاویر را بکشید و رها کنید</span>
                  <span className="text-xs text-slate-500">یا برای انتخاب فایل کلیک کنید · PNG, JPG</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={() =>
                      setPreviews((prev) => [
                        ...prev,
                        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=400&q=80",
                      ])
                    }
                  />
                </label>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {previews.map((src, index) => (
                    <div key={`${src}-${index}`} className="relative aspect-[4/3] overflow-hidden rounded-2xl ring-1 ring-slate-200">
                      <Image src={src} alt={`پیش‌نمایش ${index + 1}`} fill className="object-cover" sizes="200px" />
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {step === 4 ? (
              <div className="space-y-3">
                <p className="text-sm text-slate-500">مشاور مسئول این آگهی را انتخاب کنید</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {realtors.map((agent) => {
                    const active = agent.id === agentId;
                    return (
                      <button
                        key={agent.id}
                        type="button"
                        onClick={() => setAgentId(agent.id)}
                        className={cn(
                          "flex items-center gap-3 rounded-2xl p-3 text-start transition",
                          active
                            ? "bg-admin-sky text-white shadow-lg shadow-sky-500/25"
                            : "bg-admin-soft text-admin-navy hover:bg-slate-200/70",
                        )}
                      >
                        <Image
                          src={agent.avatar}
                          alt={agent.name}
                          width={48}
                          height={48}
                          className="h-12 w-12 rounded-full object-cover ring-2 ring-white/70"
                        />
                        <span>
                          <span className="block text-sm font-semibold">{agent.name}</span>
                          <span className={cn("text-xs", active ? "text-white/85" : "text-slate-500")}>
                            مشاور املاک · {agent.city}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
          <button
            type="button"
            disabled={step === 1}
            onClick={() => setStep((prev) => Math.max(1, prev - 1))}
            className="rounded-full bg-admin-soft px-4 py-2.5 text-sm font-medium text-admin-navy disabled:opacity-40"
          >
            مرحله قبل
          </button>
          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep((prev) => Math.min(4, prev + 1))}
              className="rounded-full bg-admin-sky px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-sky-500/25"
            >
              مرحله بعد
            </button>
          ) : (
            <button
              type="button"
              className="rounded-full bg-admin-navy px-5 py-2.5 text-sm font-medium text-white"
            >
              ذخیره ملک
            </button>
          )}
        </div>
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

function UploadIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 16V7M8 10l4-4 4 4" />
      <path d="M5 16v3h14v-3" />
    </svg>
  );
}
