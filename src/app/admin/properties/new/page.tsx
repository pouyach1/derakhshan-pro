"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Sparkles } from "lucide-react";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import {
  PROPERTY_CATEGORIES,
  getPropertyCategory,
  mapCategoryFieldsToProperty,
  type CategoryFieldId,
  type PropertyCategoryId,
} from "@/config/property-categories";
import { siteConfig } from "@/config/siteConfig";
import type { PropertyRecord } from "@/server/db/store";

const STEPS = [
  { id: 1, title: "نوع ملک", subtitle: "دسته‌بندی مناسب را انتخاب کنید" },
  { id: 2, title: "اطلاعات کلی", subtitle: "عنوان، قیمت و موقعیت" },
  { id: 3, title: "مشخصات تخصصی", subtitle: "فیلدهای مخصوص همین نوع ملک" },
  { id: 4, title: "رسانه و انتشار", subtitle: "تصاویر، مشاور و وضعیت" },
] as const;

type Draft = {
  title: string;
  category: PropertyCategoryId;
  listingType: "sale" | "rent";
  status: PropertyRecord["status"];
  price: string;
  location: string;
  neighborhood: string;
  description: string;
  imageUrl: string;
  galleryText: string;
  features: string[];
  fieldValues: Partial<Record<CategoryFieldId, string>>;
};

function emptyDraft(): Draft {
  const cat = getPropertyCategory("residential");
  return {
    title: "",
    category: "residential",
    listingType: "sale",
    status: "published",
    price: "",
    location: siteConfig.contact.address.line1 as string,
    neighborhood: siteConfig.contact.address.city as string,
    description: "",
    imageUrl: "/images/landing/hero/banner.jpg",
    galleryText: "/images/landing/hero/banner.jpg",
    features: [],
    fieldValues: { ...cat.defaults },
  };
}

export default function NewPropertyPage() {
  return (
    <Suspense fallback={<p className="p-6 text-sm text-slate-500">در حال بارگذاری فرم...</p>}>
      <NewPropertyForm />
    </Suspense>
  );
}

function NewPropertyForm() {
  const router = useRouter();
  const search = useSearchParams();
  const editingId = search.get("id");
  const reduceMotion = useReducedMotion();
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [agents, setAgents] = useState<Array<{ id: string; name: string; avatarUrl: string | null }>>([]);
  const [agentId, setAgentId] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const category = useMemo(() => getPropertyCategory(draft.category), [draft.category]);
  const progress = (step / STEPS.length) * 100;

  useEffect(() => {
    void (async () => {
      const res = await api<{ items: Array<{ id: string; name: string; avatarUrl: string | null }> }>("/api/agents");
      if (res.ok) {
        setAgents(res.data.items);
        setAgentId((current) => current || res.data.items[0]?.id || "");
      }
    })();
  }, []);

  useEffect(() => {
    if (!editingId) return;
    void (async () => {
      const res = await api<PropertyRecord>(`/api/properties/${editingId}`);
      if (!res.ok) return;
      const item = res.data;
      const cat = getPropertyCategory(item.category);
      const fieldValues: Partial<Record<CategoryFieldId, string>> = { ...cat.defaults };
      for (const field of cat.fields) {
        if (field.mapsTo === "bedrooms") fieldValues[field.id] = String(item.bedrooms);
        if (field.mapsTo === "bathrooms") fieldValues[field.id] = String(item.bathrooms);
        if (field.mapsTo === "areaSqm") fieldValues[field.id] = String(item.areaSqm);
      }
      setDraft({
        title: item.title,
        category: (PROPERTY_CATEGORIES.some((c) => c.id === item.category)
          ? item.category
          : "residential") as PropertyCategoryId,
        listingType: item.listingType,
        status: item.status,
        price: String(item.price),
        location: item.location,
        neighborhood: item.neighborhood,
        description: item.description,
        imageUrl: item.imageUrl,
        galleryText: (item.gallery?.length ? item.gallery : [item.imageUrl]).filter(Boolean).join("\n"),
        features: item.features.filter((f) => cat.features.includes(f)),
        fieldValues,
      });
      setAgentId(item.agentId || "");
    })();
  }, [editingId]);

  function selectCategory(id: PropertyCategoryId) {
    const next = getPropertyCategory(id);
    setDraft((prev) => ({
      ...prev,
      category: id,
      fieldValues: { ...next.defaults },
      features: prev.features.filter((f) => next.features.includes(f)),
    }));
  }

  function toggleFeature(feature: string) {
    setDraft((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((item) => item !== feature)
        : [...prev.features, feature],
    }));
  }

  function setField(id: CategoryFieldId, value: string) {
    setDraft((prev) => ({
      ...prev,
      fieldValues: { ...prev.fieldValues, [id]: value },
    }));
  }

  async function save() {
    setSaving(true);
    setError("");
    const gallery = draft.galleryText
      .split(/\n|,/)
      .map((item) => item.trim())
      .filter(Boolean);
    const cover = draft.imageUrl || gallery[0] || "/images/landing/hero/banner.jpg";
    const mapped = mapCategoryFieldsToProperty({
      category: draft.category,
      values: draft.fieldValues,
      selectedFeatures: draft.features,
    });
    const payload = {
      title: draft.title || "ملک جدید",
      category: draft.category,
      listingType: draft.listingType,
      status: draft.status,
      price: Number(draft.price) || 0,
      location: draft.location,
      neighborhood: draft.neighborhood,
      description: draft.description,
      bedrooms: mapped.bedrooms,
      bathrooms: mapped.bathrooms,
      areaSqm: mapped.areaSqm,
      imageUrl: cover,
      gallery: gallery.length ? gallery : [cover],
      features: mapped.features,
      agentId: agentId || undefined,
    };
    const res = editingId
      ? await api(`/api/properties/${editingId}`, { method: "PATCH", body: JSON.stringify(payload) })
      : await api("/api/properties", { method: "POST", body: JSON.stringify(payload) });
    setSaving(false);
    if (!res.ok) {
      setError(res.error.message);
      return;
    }
    router.push("/admin/properties");
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <motion.section
        initial={reduceMotion ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[1.85rem] bg-admin-card p-5 shadow-[0_24px_60px_-40px_rgba(11,58,92,0.3)] ring-1 ring-slate-200/70 sm:p-6"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(14,165,233,0.14),transparent_50%)]"
        />
        <div className="relative">
          <p className="text-sm text-slate-500">
            <Link href="/admin/properties" className="hover:text-admin-sky">مدیریت املاک</Link>
            <span className="mx-2 text-slate-300">/</span>
            {editingId ? "ویرایش ملک" : "ملک جدید"}
          </p>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="font-vazirmatn text-2xl font-bold text-admin-navy">
                {editingId ? "ویرایش فایل" : "افزودن ملک هوشمند"}
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                فیلدها بر اساس نوع ملک تغییر می‌کنند — مثلاً زمین زراعی خواب و سرویس ندارد.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-admin-soft px-3 py-1.5 text-xs font-semibold text-admin-navy">
              <Sparkles className="h-3.5 w-3.5 text-admin-sky" />
              {category.label}
            </span>
          </div>

          <div className="mt-5 h-2 overflow-hidden rounded-full bg-admin-soft">
            <motion.div
              className="h-full rounded-full bg-gradient-to-l from-admin-sky to-sky-400"
              animate={{ width: `${progress}%` }}
              transition={{ type: "spring", stiffness: 160, damping: 24 }}
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {STEPS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setStep(item.id)}
                className={cn(
                  "relative rounded-full px-3.5 py-2 text-xs font-semibold transition sm:text-sm",
                  step === item.id ? "text-white" : "bg-admin-soft text-slate-500 hover:text-admin-navy",
                )}
              >
                {step === item.id ? (
                  <motion.span
                    layoutId="property-step-pill"
                    className="absolute inset-0 rounded-full bg-admin-navy"
                    transition={{ type: "spring", stiffness: 280, damping: 28 }}
                  />
                ) : null}
                <span className="relative">{item.id}. {item.title}</span>
              </button>
            ))}
          </div>
        </div>
      </motion.section>

      <div className="rounded-[1.85rem] bg-admin-card p-4 shadow-sm ring-1 ring-slate-200/70 sm:p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${step}-${draft.category}`}
            initial={reduceMotion ? false : { opacity: 0, y: 18, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -12, filter: "blur(4px)" }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-5"
          >
            <div>
              <h2 className="font-vazirmatn text-lg font-bold text-admin-navy">{STEPS[step - 1].title}</h2>
              <p className="mt-1 text-sm text-slate-500">{STEPS[step - 1].subtitle}</p>
            </div>

            {step === 1 ? (
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {PROPERTY_CATEGORIES.map((item, index) => {
                  const Icon = item.icon;
                  const active = draft.category === item.id;
                  return (
                    <motion.button
                      key={item.id}
                      type="button"
                      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.04 }}
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => selectCategory(item.id)}
                      className={cn(
                        "relative overflow-hidden rounded-[1.4rem] p-4 text-start transition",
                        active
                          ? "bg-admin-navy text-white shadow-[0_20px_50px_-28px_rgba(11,58,92,0.7)]"
                          : "bg-admin-soft text-admin-navy ring-1 ring-slate-200/80 hover:bg-white",
                      )}
                    >
                      {active ? (
                        <motion.span
                          layoutId="category-check"
                          className="absolute end-3 top-3 inline-flex h-6 w-6 items-center justify-center rounded-full bg-admin-sky text-white"
                        >
                          <Check className="h-3.5 w-3.5" />
                        </motion.span>
                      ) : null}
                      <span
                        className={cn(
                          "inline-flex h-11 w-11 items-center justify-center rounded-2xl",
                          active ? "bg-white/10" : "bg-white",
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <p className="mt-3 font-vazirmatn text-sm font-bold">{item.label}</p>
                      <p className={cn("mt-1 text-xs leading-6", active ? "text-white/70" : "text-slate-500")}>
                        {item.description}
                      </p>
                    </motion.button>
                  );
                })}
              </div>
            ) : null}

            {step === 2 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="عنوان ملک">
                  <input className={inputClass} value={draft.title} onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))} placeholder={`مثلاً ${category.label} زعفرانیه`} />
                </Field>
                <Field label="وضعیت معامله">
                  <select className={inputClass} value={draft.listingType} onChange={(e) => setDraft((d) => ({ ...d, listingType: e.target.value as "sale" | "rent" }))}>
                    <option value="sale">فروش</option>
                    <option value="rent">اجاره</option>
                  </select>
                </Field>
                <Field label="قیمت (تومان)">
                  <input className={inputClass} type="number" value={draft.price} onChange={(e) => setDraft((d) => ({ ...d, price: e.target.value }))} />
                </Field>
                <Field label="محله">
                  <input className={inputClass} value={draft.neighborhood} onChange={(e) => setDraft((d) => ({ ...d, neighborhood: e.target.value }))} />
                </Field>
                <Field label="موقعیت" className="sm:col-span-2">
                  <input className={inputClass} value={draft.location} onChange={(e) => setDraft((d) => ({ ...d, location: e.target.value }))} />
                </Field>
                <Field label="توضیح" className="sm:col-span-2">
                  <textarea className={`${inputClass} min-h-28 py-3`} value={draft.description} onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))} />
                </Field>
              </div>
            ) : null}

            {step === 3 ? (
              <div className="space-y-5">
                <div className="rounded-[1.35rem] border border-admin-sky/20 bg-sky-50/70 px-4 py-3 text-sm text-admin-navy">
                  مشخصات نمایش‌داده‌شده مخصوص <strong>{category.label}</strong> است.
                  {draft.category === "land" ? " برای زمین، خواب و سرویس لازم نیست — متراژ و کاربری زمین ثبت می‌شود." : null}
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <AnimatePresence mode="popLayout">
                    {category.fields.map((field, index) => (
                      <motion.div
                        key={`${draft.category}-${field.id}`}
                        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        transition={{ delay: index * 0.03 }}
                      >
                        <Field label={field.label} hint={field.hint}>
                          {field.type === "select" ? (
                            <select
                              className={inputClass}
                              value={draft.fieldValues[field.id] ?? ""}
                              onChange={(e) => setField(field.id, e.target.value)}
                            >
                              {(field.options ?? []).map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                              ))}
                            </select>
                          ) : (
                            <input
                              className={inputClass}
                              type={field.type}
                              value={draft.fieldValues[field.id] ?? ""}
                              onChange={(e) => setField(field.id, e.target.value)}
                            />
                          )}
                        </Field>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium text-admin-navy">امکانات {category.label}</p>
                  <div className="flex flex-wrap gap-2">
                    {category.features.map((feature) => (
                      <motion.button
                        key={feature}
                        type="button"
                        whileTap={{ scale: 0.96 }}
                        onClick={() => toggleFeature(feature)}
                        className={cn(
                          "rounded-full px-3 py-2 text-sm ring-1 transition",
                          draft.features.includes(feature)
                            ? "bg-admin-sky text-white ring-admin-sky shadow-[0_10px_28px_-16px_rgba(14,165,233,0.9)]"
                            : "bg-white text-slate-600 ring-slate-200 hover:ring-admin-sky/40",
                        )}
                      >
                        {feature}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}

            {step === 4 ? (
              <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="space-y-4">
                  <Field label="تصویر شاخص">
                    <input className={inputClass} value={draft.imageUrl} onChange={(e) => setDraft((d) => ({ ...d, imageUrl: e.target.value }))} />
                  </Field>
                  <Field label="گالری تصاویر (هر خط یک مسیر)">
                    <textarea
                      className={`${inputClass} min-h-28 py-3`}
                      value={draft.galleryText}
                      onChange={(e) => setDraft((d) => ({ ...d, galleryText: e.target.value }))}
                    />
                  </Field>
                  <Field label="وضعیت انتشار">
                    <select className={inputClass} value={draft.status} onChange={(e) => setDraft((d) => ({ ...d, status: e.target.value as PropertyRecord["status"] }))}>
                      <option value="published">منتشرشده</option>
                      <option value="draft">پیش‌نویس</option>
                      <option value="negotiation">مذاکره</option>
                      <option value="sold">واگذار شده</option>
                    </select>
                  </Field>
                  <p className="text-sm text-slate-500">مشاور مسئول</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {agents.map((agent) => (
                      <button
                        key={agent.id}
                        type="button"
                        onClick={() => setAgentId(agent.id)}
                        className={cn(
                          "rounded-2xl px-3 py-3 text-start text-sm font-semibold transition",
                          agentId === agent.id ? "bg-admin-sky text-white" : "bg-admin-soft text-admin-navy",
                        )}
                      >
                        {agent.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="relative h-56 overflow-hidden rounded-[1.5rem] bg-admin-soft ring-1 ring-slate-200/70">
                    <Image src={draft.imageUrl || "/images/landing/hero/banner.jpg"} alt="" fill className="object-cover" />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-admin-navy/80 to-transparent p-4 text-white">
                      <p className="text-xs text-white/70">{category.label}</p>
                      <p className="mt-1 font-vazirmatn text-sm font-bold">{draft.title || "پیش‌نمایش عنوان"}</p>
                    </div>
                  </div>
                  <div className="rounded-[1.35rem] bg-admin-soft p-4 text-sm text-admin-navy">
                    <p>
                      متراژ اصلی:{" "}
                      {draft.fieldValues.areaSqm ||
                        draft.fieldValues.builtArea ||
                        draft.fieldValues.landArea ||
                        "—"}{" "}
                      متر
                    </p>
                    <p className="mt-1">امکانات انتخابی: {draft.features.length.toLocaleString("fa-IR")}</p>
                  </div>
                </div>
              </div>
            ) : null}
          </motion.div>
        </AnimatePresence>

        {error ? <p className="mt-4 text-sm text-rose-500">{error}</p> : null}

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
          <button
            type="button"
            disabled={step === 1}
            onClick={() => setStep((prev) => Math.max(1, prev - 1))}
            className="inline-flex items-center gap-1.5 rounded-full bg-admin-soft px-4 py-2.5 text-sm disabled:opacity-40"
          >
            <ArrowRight className="h-4 w-4" />
            مرحله قبل
          </button>
          {step < 4 ? (
            <motion.button
              type="button"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setStep((prev) => Math.min(4, prev + 1))}
              className="inline-flex items-center gap-1.5 rounded-full bg-admin-sky px-5 py-2.5 text-sm font-semibold text-white shadow-[0_14px_36px_-16px_rgba(14,165,233,0.9)]"
            >
              مرحله بعد
              <ArrowLeft className="h-4 w-4" />
            </motion.button>
          ) : (
            <motion.button
              type="button"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => void save()}
              disabled={saving}
              className="rounded-full bg-admin-navy px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
            >
              {saving ? "در حال ذخیره..." : "ذخیره ملک"}
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}

const inputClass =
  "h-11 w-full rounded-2xl bg-admin-soft px-4 text-sm text-admin-navy outline-none ring-1 ring-transparent transition focus:bg-white focus:ring-admin-sky/50";

function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block space-y-1.5", className)}>
      <span className="text-sm font-medium text-admin-navy">{label}</span>
      {children}
      {hint ? <span className="block text-[11px] text-slate-400">{hint}</span> : null}
    </label>
  );
}
