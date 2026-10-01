"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Sparkles,
} from "lucide-react";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { fallbackImage, formatToman } from "@/lib/money";
import { isValidAparatUrl } from "@/lib/aparat";
import {
  PROPERTY_CATEGORIES,
  getPropertyCategory,
  mapCategoryFieldsToProperty,
  type CategoryFieldId,
  type PropertyCategoryId,
} from "@/config/property-categories";
import { siteConfig } from "@/config/siteConfig";
import PropertyMediaFields from "@/components/agent/PropertyMediaFields";
import type { PropertyRecord } from "@/server/db/store";

const NEIGHBORHOODS = siteConfig.panels.neighborhoods;
const DEFAULT_IMAGE = "/images/landing/hero/banner.jpg";

const STEPS = [
  { id: 1, title: "نوع فایل", subtitle: "چه ملکی می‌خواهید ثبت کنید؟" },
  { id: 2, title: "اطلاعات اصلی", subtitle: "عنوان، قیمت و محله — همین سه تا کافی است برای شروع" },
  { id: 3, title: "مشخصات", subtitle: "فقط فیلدهای لازم همین نوع ملک" },
  { id: 4, title: "عکس و ویدیو", subtitle: "عکس آپلود کنید؛ ویدیو اختیاری از آپارات" },
] as const;

type Draft = {
  title: string;
  category: PropertyCategoryId;
  listingType: "sale" | "rent";
  status: "published" | "draft" | "negotiation";
  price: string;
  location: string;
  neighborhood: string;
  description: string;
  gallery: string[];
  videos: string[];
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
    location: `کرج، ${NEIGHBORHOODS[0] || siteConfig.contact.address.city}`,
    neighborhood: NEIGHBORHOODS[0] || siteConfig.contact.address.city,
    description: "",
    gallery: [],
    videos: [],
    features: [],
    fieldValues: { ...cat.defaults },
  };
}

const inputClass =
  "h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 font-vazirmatn text-sm text-[#0B3A5C] outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20";

export default function AgentNewPropertyPage() {
  return (
    <Suspense
      fallback={
        <p className="p-6 font-vazirmatn text-sm text-slate-500">در حال آماده‌سازی فرم...</p>
      }
    >
      <AgentNewPropertyForm />
    </Suspense>
  );
}

function AgentNewPropertyForm() {
  const router = useRouter();
  const search = useSearchParams();
  const editingId = search.get("id");
  const reduceMotion = useReducedMotion();
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const category = useMemo(() => getPropertyCategory(draft.category), [draft.category]);
  const progress = (step / STEPS.length) * 100;
  const mappedPreview = useMemo(
    () =>
      mapCategoryFieldsToProperty({
        category: draft.category,
        values: draft.fieldValues,
        selectedFeatures: draft.features,
      }),
    [draft.category, draft.fieldValues, draft.features],
  );

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
      const gallery = (item.gallery?.length ? item.gallery : [item.imageUrl]).filter(Boolean);
      setDraft({
        title: item.title,
        category: (PROPERTY_CATEGORIES.some((c) => c.id === item.category)
          ? item.category
          : "residential") as PropertyCategoryId,
        listingType: item.listingType,
        status:
          item.status === "negotiation"
            ? "negotiation"
            : item.status === "draft"
              ? "draft"
              : "published",
        price: String(item.price),
        location: item.location,
        neighborhood: item.neighborhood,
        description: item.description,
        gallery,
        videos: (item.videos ?? []).filter(Boolean).slice(0, 3),
        features: item.features.filter((f) => cat.features.includes(f)),
        fieldValues,
      });
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

  function canGoNext() {
    if (step === 2 && !draft.title.trim()) {
      setError("عنوان فایل را بنویسید");
      return false;
    }
    if (step === 2 && !draft.price.trim()) {
      setError("قیمت را وارد کنید");
      return false;
    }
    setError("");
    return true;
  }

  async function save() {
    if (!draft.title.trim()) {
      setError("عنوان فایل را بنویسید");
      setStep(2);
      return;
    }
    if (draft.gallery.length < 1) {
      setError("حداقل یک عکس آپلود کنید");
      setStep(4);
      return;
    }
    const videos = draft.videos.map((item) => item.trim()).filter(Boolean);
    if (videos.some((item) => !isValidAparatUrl(item))) {
      setError("لینک ویدیو باید از آپارات باشد");
      setStep(4);
      return;
    }
    setSaving(true);
    setError("");
    const gallery = draft.gallery.slice(0, 15);
    const cover = gallery[0];
    const mapped = mapCategoryFieldsToProperty({
      category: draft.category,
      values: draft.fieldValues,
      selectedFeatures: draft.features,
    });
    const payload = {
      title: draft.title.trim(),
      category: draft.category,
      listingType: draft.listingType,
      status: draft.status,
      price: Number(draft.price) || 0,
      location: draft.location.trim() || `کرج، ${draft.neighborhood}`,
      neighborhood: draft.neighborhood,
      description: draft.description.trim(),
      bedrooms: mapped.bedrooms,
      bathrooms: mapped.bathrooms,
      areaSqm: mapped.areaSqm,
      imageUrl: cover,
      gallery,
      videos: videos.slice(0, 3),
      features: mapped.features,
    };
    const res = editingId
      ? await api(`/api/properties/${editingId}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        })
      : await api("/api/properties", {
          method: "POST",
          body: JSON.stringify(payload),
        });
    setSaving(false);
    if (!res.ok) {
      setError(res.error.message || "ذخیره ناموفق بود");
      return;
    }
    router.push("/agent/properties");
    router.refresh();
  }

  const coverPreview = fallbackImage(draft.gallery[0] || DEFAULT_IMAGE);

  return (
    <div className="space-y-5 font-vazirmatn" dir="rtl">
      {/* Hero header */}
      <motion.section
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[1.85rem] border border-sky-100/80 bg-white p-5 shadow-[0_24px_60px_-40px_rgba(11,58,92,0.28)] sm:p-7"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(14,165,233,0.16),transparent_55%)]"
        />
        <div className="relative">
          <p className="text-sm text-slate-500">
            <Link href="/agent/properties" className="hover:text-sky-600">
              املاک من
            </Link>
            <span className="mx-2 text-slate-300">/</span>
            {editingId ? "ویرایش فایل" : "ثبت فایل جدید"}
          </p>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-[#0B3A5C] sm:text-3xl">
                {editingId ? "ویرایش فایل" : "ثبت فایل جدید"}
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-7 text-slate-500">
                چهار قدم کوتاه. هر مرحله فقط یک کار دارد تا سریع و بدون سردرگمی فایل بگذارید.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-700 ring-1 ring-sky-100">
              <Sparkles className="h-3.5 w-3.5" />
              {category.label}
            </span>
          </div>

          <div className="mt-6 h-2 overflow-hidden rounded-full bg-[#F3F7FB]">
            <motion.div
              className="h-full rounded-full bg-gradient-to-l from-[#0B3A5C] to-sky-400"
              animate={{ width: `${progress}%` }}
              transition={{ type: "spring", stiffness: 160, damping: 24 }}
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {STEPS.map((item) => {
              const done = step > item.id;
              const active = step === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setStep(item.id)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-xs font-semibold transition sm:text-sm",
                    active
                      ? "bg-[#0B3A5C] text-white shadow-sm"
                      : done
                        ? "bg-sky-50 text-sky-700 ring-1 ring-sky-100"
                        : "bg-[#F3F7FB] text-slate-500 hover:text-[#0B3A5C]",
                  )}
                >
                  <span
                    className={cn(
                      "inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px]",
                      active ? "bg-white/15" : done ? "bg-sky-500 text-white" : "bg-white text-slate-400",
                    )}
                  >
                    {done ? <Check className="h-3 w-3" /> : item.id.toLocaleString("fa-IR")}
                  </span>
                  {item.title}
                </button>
              );
            })}
          </div>
        </div>
      </motion.section>

      <div className="grid gap-5 lg:grid-cols-[1.35fr_0.85fr]">
        {/* Main form card */}
        <section className="rounded-[1.85rem] border border-slate-200/70 bg-white p-5 shadow-sm sm:p-7">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${step}-${draft.category}`}
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-5"
            >
              <div>
                <h2 className="text-lg font-bold text-[#0B3A5C]">{STEPS[step - 1].title}</h2>
                <p className="mt-1 text-sm leading-7 text-slate-500">{STEPS[step - 1].subtitle}</p>
              </div>

              {step === 1 ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {PROPERTY_CATEGORIES.map((item, index) => {
                    const Icon = item.icon;
                    const active = draft.category === item.id;
                    return (
                      <motion.button
                        key={item.id}
                        type="button"
                        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => selectCategory(item.id)}
                        className={cn(
                          "relative overflow-hidden rounded-[1.4rem] p-4 text-start transition",
                          active
                            ? "bg-[#0B3A5C] text-white shadow-[0_20px_50px_-28px_rgba(11,58,92,0.65)]"
                            : "bg-[#F3F7FB] text-[#0B3A5C] ring-1 ring-slate-200/80 hover:bg-white",
                        )}
                      >
                        {active ? (
                          <span className="absolute end-3 top-3 inline-flex h-6 w-6 items-center justify-center rounded-full bg-sky-400 text-white">
                            <Check className="h-3.5 w-3.5" />
                          </span>
                        ) : null}
                        <span
                          className={cn(
                            "inline-flex h-11 w-11 items-center justify-center rounded-2xl",
                            active ? "bg-white/10" : "bg-white",
                          )}
                        >
                          <Icon className="h-5 w-5" />
                        </span>
                        <p className="mt-3 text-sm font-bold">{item.label}</p>
                        <p className={cn("mt-1 text-xs leading-6", active ? "text-white/70" : "text-slate-500")}>
                          {item.description}
                        </p>
                      </motion.button>
                    );
                  })}
                </div>
              ) : null}

              {step === 2 ? (
                <div className="space-y-4">
                  <Field label="عنوان فایل">
                    <input
                      className={inputClass}
                      value={draft.title}
                      onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                      placeholder={`مثلاً ${category.label} در گوهردشت`}
                      autoFocus
                    />
                  </Field>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="نوع معامله">
                      <div className="mt-0 grid grid-cols-2 gap-2">
                        {(
                          [
                            { id: "sale", label: "فروش" },
                            { id: "rent", label: "اجاره" },
                          ] as const
                        ).map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setDraft((d) => ({ ...d, listingType: opt.id }))}
                            className={cn(
                              "h-12 rounded-2xl text-sm font-semibold ring-1 transition",
                              draft.listingType === opt.id
                                ? "bg-sky-500 text-white ring-sky-500"
                                : "bg-white text-slate-600 ring-slate-200 hover:bg-sky-50",
                            )}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </Field>
                    <Field label="قیمت (تومان)">
                      <input
                        className={inputClass}
                        type="number"
                        value={draft.price}
                        onChange={(e) => setDraft((d) => ({ ...d, price: e.target.value }))}
                        placeholder="۸۹۰۰۰۰۰۰۰۰"
                      />
                    </Field>
                  </div>

                  <div>
                    <p className="mb-2 text-sm font-medium text-[#0B3A5C]">محله</p>
                    <div className="flex flex-wrap gap-1.5">
                      {NEIGHBORHOODS.map((n) => (
                        <button
                          key={n}
                          type="button"
                          onClick={() =>
                            setDraft((d) => ({
                              ...d,
                              neighborhood: n,
                              location: `کرج، ${n}`,
                            }))
                          }
                          className={cn(
                            "rounded-full px-3.5 py-2 text-xs font-medium ring-1 transition",
                            draft.neighborhood === n
                              ? "bg-[#0B3A5C] text-white ring-[#0B3A5C]"
                              : "bg-white text-slate-600 ring-slate-200 hover:bg-sky-50",
                          )}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Field label="آدرس دقیق‌تر (اختیاری)">
                    <input
                      className={inputClass}
                      value={draft.location}
                      onChange={(e) => setDraft((d) => ({ ...d, location: e.target.value }))}
                      placeholder="کرج، ..."
                    />
                  </Field>

                  <Field label="توضیح کوتاه (اختیاری)">
                    <textarea
                      className={`${inputClass} min-h-28 py-3`}
                      value={draft.description}
                      onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
                      placeholder="نورگیر، بازسازی، دسترسی و هر نکته‌ای که خریدار باید بداند..."
                    />
                  </Field>
                </div>
              ) : null}

              {step === 3 ? (
                <div className="space-y-5">
                  <div className="rounded-[1.35rem] border border-sky-100 bg-sky-50/80 px-4 py-3 text-sm text-[#0B3A5C]">
                    مشخصات مخصوص <strong>{category.label}</strong> است — فقط همین‌ها را پر کنید.
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {category.fields.map((field) => (
                      <Field key={field.id} label={field.label} hint={field.hint}>
                        {field.type === "select" ? (
                          <select
                            className={inputClass}
                            value={draft.fieldValues[field.id] ?? ""}
                            onChange={(e) => setField(field.id, e.target.value)}
                          >
                            {(field.options ?? []).map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
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
                    ))}
                  </div>
                  <div>
                    <p className="mb-2 text-sm font-medium text-[#0B3A5C]">امکانات</p>
                    <div className="flex flex-wrap gap-2">
                      {category.features.map((feature) => {
                        const on = draft.features.includes(feature);
                        return (
                          <button
                            key={feature}
                            type="button"
                            onClick={() => toggleFeature(feature)}
                            className={cn(
                              "rounded-full px-3.5 py-2 text-sm ring-1 transition",
                              on
                                ? "bg-sky-500 text-white ring-sky-500"
                                : "bg-white text-slate-600 ring-slate-200 hover:bg-sky-50",
                            )}
                          >
                            {feature}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : null}

              {step === 4 ? (
                <div className="space-y-6">
                  <PropertyMediaFields
                    images={draft.gallery}
                    videos={draft.videos}
                    onImagesChange={(gallery) => setDraft((d) => ({ ...d, gallery }))}
                    onVideosChange={(videos) => setDraft((d) => ({ ...d, videos }))}
                  />
                  <Field label="وضعیت انتشار">
                    <div className="grid grid-cols-3 gap-2">
                      {(
                        [
                          { id: "published", label: "فعال" },
                          { id: "draft", label: "پیش‌نویس" },
                          { id: "negotiation", label: "مذاکره" },
                        ] as const
                      ).map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setDraft((d) => ({ ...d, status: opt.id }))}
                          className={cn(
                            "h-12 rounded-2xl text-sm font-semibold ring-1 transition",
                            draft.status === opt.id
                              ? "bg-[#0B3A5C] text-white ring-[#0B3A5C]"
                              : "bg-white text-slate-600 ring-slate-200 hover:bg-sky-50",
                          )}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </Field>
                </div>
              ) : null}
            </motion.div>
          </AnimatePresence>

          {error ? (
            <p className="mt-5 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</p>
          ) : null}

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => Math.max(1, s - 1))}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#F3F7FB] px-4 py-2.5 text-sm font-medium text-[#0B3A5C]"
              >
                <ArrowRight className="h-4 w-4" />
                مرحله قبل
              </button>
            ) : (
              <Link
                href="/agent/properties"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#F3F7FB] px-4 py-2.5 text-sm font-medium text-slate-500"
              >
                انصراف
              </Link>
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={() => {
                  if (!canGoNext()) return;
                  setStep((s) => Math.min(4, s + 1));
                }}
                className="inline-flex items-center gap-1.5 rounded-full bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_14px_36px_-16px_rgba(14,165,233,0.85)]"
              >
                مرحله بعد
                <ArrowLeft className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={saving}
                onClick={() => void save()}
                className="rounded-full bg-[#0B3A5C] px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
              >
                {saving ? "در حال ذخیره..." : editingId ? "ذخیره تغییرات" : "ثبت فایل"}
              </button>
            )}
          </div>
        </section>

        {/* Sticky live preview */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="overflow-hidden rounded-[1.85rem] border border-slate-200/70 bg-white shadow-sm">
            <div className="relative aspect-[16/11] bg-[#E8F1F8]">
              <Image src={coverPreview} alt="" fill className="object-cover" sizes="400px" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0B3A5C]/85 to-transparent p-4 text-white">
                <p className="text-[11px] text-white/70">
                  {draft.listingType === "sale" ? "فروش" : "اجاره"} · {category.label}
                </p>
                <p className="mt-1 text-base font-bold leading-7">
                  {draft.title || "عنوان فایل اینجا دیده می‌شود"}
                </p>
              </div>
            </div>
            <div className="space-y-3 p-5 text-sm text-[#0B3A5C]">
              <p className="font-semibold text-sky-600">
                {draft.price
                  ? formatToman(Number(draft.price) || 0, draft.listingType)
                  : "قیمت هنوز وارد نشده"}
              </p>
              <p className="text-slate-500">{draft.neighborhood || "محله"}</p>
              <div className="flex flex-wrap gap-2 text-xs text-slate-600">
                {mappedPreview.areaSqm > 0 ? (
                  <span className="rounded-full bg-[#F3F7FB] px-2.5 py-1">
                    {mappedPreview.areaSqm.toLocaleString("fa-IR")} متر
                  </span>
                ) : null}
                {mappedPreview.bedrooms > 0 ? (
                  <span className="rounded-full bg-[#F3F7FB] px-2.5 py-1">
                    {mappedPreview.bedrooms.toLocaleString("fa-IR")} خواب
                  </span>
                ) : null}
                {mappedPreview.bathrooms > 0 ? (
                  <span className="rounded-full bg-[#F3F7FB] px-2.5 py-1">
                    {mappedPreview.bathrooms.toLocaleString("fa-IR")} سرویس
                  </span>
                ) : null}
                <span className="rounded-full bg-[#F3F7FB] px-2.5 py-1">
                  {draft.features.length.toLocaleString("fa-IR")} امکان
                </span>
              </div>
              <p className="pt-1 text-xs leading-6 text-slate-400">
                پیش‌نمایش زنده — همان چیزی که بعد از ثبت در آرشیو می‌بینید.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-[#0B3A5C]">{label}</span>
      {children}
      {hint ? <span className="block text-[11px] text-slate-400">{hint}</span> : null}
    </label>
  );
}
