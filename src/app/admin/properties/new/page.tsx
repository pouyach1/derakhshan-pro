"use client";

import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { PROPERTY_FEATURE_OPTIONS } from "@/config/agent-crm";
import { siteConfig } from "@/config/siteConfig";
import type { PropertyRecord } from "@/server/db/store";

const STEPS = [
  { id: 1, title: "اطلاعات کلی" },
  { id: 2, title: "مشخصات" },
  { id: 3, title: "رسانه" },
  { id: 4, title: "انتشار" },
] as const;

const emptyDraft = {
  title: "",
  category: "residential",
  listingType: "sale" as "sale" | "rent",
  status: "published" as PropertyRecord["status"],
  price: "",
  location: siteConfig.contact.address.line1 as string,
  neighborhood: siteConfig.contact.address.city as string,
  description: "",
  bedrooms: "3",
  bathrooms: "2",
  areaSqm: "120",
  imageUrl: "/images/landing/hero/banner.jpg",
  galleryText: "/images/landing/hero/banner.jpg",
  features: [] as string[],
};

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
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState(emptyDraft);
  const [agents, setAgents] = useState<Array<{ id: string; name: string; avatarUrl: string | null }>>([]);
  const [agentId, setAgentId] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

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
      setDraft({
        title: item.title,
        category: item.category,
        listingType: item.listingType,
        status: item.status,
        price: String(item.price),
        location: item.location,
        neighborhood: item.neighborhood,
        description: item.description,
        bedrooms: String(item.bedrooms),
        bathrooms: String(item.bathrooms),
        areaSqm: String(item.areaSqm),
        imageUrl: item.imageUrl,
        galleryText: (item.gallery?.length ? item.gallery : [item.imageUrl]).filter(Boolean).join("\n"),
        features: item.features,
      });
      setAgentId(item.agentId || "");
    })();
  }, [editingId]);

  function toggleFeature(feature: string) {
    setDraft((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((item) => item !== feature)
        : [...prev.features, feature],
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
    const payload = {
      title: draft.title || "ملک جدید",
      category: draft.category,
      listingType: draft.listingType,
      status: draft.status,
      price: Number(draft.price) || 0,
      location: draft.location,
      neighborhood: draft.neighborhood,
      description: draft.description,
      bedrooms: Number(draft.bedrooms) || 0,
      bathrooms: Number(draft.bathrooms) || 0,
      areaSqm: Number(draft.areaSqm) || 0,
      imageUrl: cover,
      gallery: gallery.length ? gallery : [cover],
      features: draft.features,
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
      <div className="rounded-[1.75rem] bg-admin-card p-4 shadow-sm ring-1 ring-slate-200/70 sm:p-5">
        <p className="text-sm text-slate-500">
          <Link href="/admin/properties" className="hover:text-admin-sky">مدیریت املاک</Link>
          <span className="mx-2 text-slate-300">/</span>
          {editingId ? "ویرایش ملک" : "ملک جدید"}
        </p>
        <h1 className="mt-1 text-xl font-semibold text-admin-navy sm:text-2xl">
          {editingId ? "ویرایش فایل" : "افزودن ملک"}
        </h1>
        <div className="mt-4 flex flex-wrap gap-2">
          {STEPS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setStep(item.id)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-medium sm:text-sm",
                step === item.id ? "bg-admin-navy text-white" : "bg-admin-soft text-slate-500",
              )}
            >
              {item.id}. {item.title}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-[1.75rem] bg-admin-card p-4 shadow-sm ring-1 ring-slate-200/70 sm:p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            className="space-y-5"
          >
            {step === 1 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="عنوان ملک">
                  <input className={inputClass} value={draft.title} onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))} />
                </Field>
                <Field label="دسته‌بندی">
                  <select className={inputClass} value={draft.category} onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value }))}>
                    <option value="residential">آپارتمان</option>
                    <option value="penthouse">پنت‌هاوس</option>
                    <option value="villa">ویلا</option>
                    <option value="commercial">تجاری</option>
                  </select>
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
                <Field label="موقعیت" className="sm:col-span-2">
                  <input className={inputClass} value={draft.location} onChange={(e) => setDraft((d) => ({ ...d, location: e.target.value }))} />
                </Field>
                <Field label="محله">
                  <input className={inputClass} value={draft.neighborhood} onChange={(e) => setDraft((d) => ({ ...d, neighborhood: e.target.value }))} />
                </Field>
                <Field label="توضیح" className="sm:col-span-2">
                  <textarea className={`${inputClass} min-h-24 py-3`} value={draft.description} onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))} />
                </Field>
              </div>
            ) : null}

            {step === 2 ? (
              <div className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-3">
                  <Field label="خواب">
                    <input className={inputClass} type="number" value={draft.bedrooms} onChange={(e) => setDraft((d) => ({ ...d, bedrooms: e.target.value }))} />
                  </Field>
                  <Field label="سرویس">
                    <input className={inputClass} type="number" value={draft.bathrooms} onChange={(e) => setDraft((d) => ({ ...d, bathrooms: e.target.value }))} />
                  </Field>
                  <Field label="متراژ">
                    <input className={inputClass} type="number" value={draft.areaSqm} onChange={(e) => setDraft((d) => ({ ...d, areaSqm: e.target.value }))} />
                  </Field>
                </div>
                <div className="flex flex-wrap gap-2">
                  {PROPERTY_FEATURE_OPTIONS.map((feature) => (
                    <button
                      key={feature}
                      type="button"
                      onClick={() => toggleFeature(feature)}
                      className={cn(
                        "rounded-full px-3 py-2 text-sm ring-1",
                        draft.features.includes(feature)
                          ? "bg-admin-sky text-white ring-admin-sky"
                          : "bg-white text-slate-600 ring-slate-200",
                      )}
                    >
                      {feature}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {step === 3 ? (
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
                <p className="text-xs text-slate-500">
                  فایل‌ها را در `public/images` بگذارید؛ مثلاً `/images/landing/hero/banner.jpg`
                </p>
                <div className="relative h-48 overflow-hidden rounded-2xl bg-admin-soft">
                  <Image src={draft.imageUrl || "/images/landing/hero/banner.jpg"} alt="" fill className="object-cover" />
                </div>
              </div>
            ) : null}

            {step === 4 ? (
              <div className="space-y-4">
                <Field label="وضعیت انتشار">
                  <select className={inputClass} value={draft.status} onChange={(e) => setDraft((d) => ({ ...d, status: e.target.value as PropertyRecord["status"] }))}>
                    <option value="published">منتشرشده</option>
                    <option value="draft">پیش‌نویس</option>
                    <option value="negotiation">مذاکره</option>
                    <option value="sold">واگذار شده</option>
                  </select>
                </Field>
                <p className="text-sm text-slate-500">مشاور مسئول این آگهی</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {agents.map((agent) => (
                    <button
                      key={agent.id}
                      type="button"
                      onClick={() => setAgentId(agent.id)}
                      className={cn(
                        "flex items-center gap-3 rounded-2xl p-3 text-start",
                        agentId === agent.id ? "bg-admin-sky text-white" : "bg-admin-soft text-admin-navy",
                      )}
                    >
                      <span className="text-sm font-semibold">{agent.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </motion.div>
        </AnimatePresence>

        {error ? <p className="mt-4 text-sm text-rose-500">{error}</p> : null}

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
          <button type="button" disabled={step === 1} onClick={() => setStep((prev) => Math.max(1, prev - 1))} className="rounded-full bg-admin-soft px-4 py-2.5 text-sm disabled:opacity-40">
            مرحله قبل
          </button>
          {step < 4 ? (
            <button type="button" onClick={() => setStep((prev) => Math.min(4, prev + 1))} className="rounded-full bg-admin-sky px-5 py-2.5 text-sm text-white">
              مرحله بعد
            </button>
          ) : (
            <button type="button" onClick={() => void save()} disabled={saving} className="rounded-full bg-admin-navy px-5 py-2.5 text-sm text-white disabled:opacity-60">
              {saving ? "در حال ذخیره..." : "ذخیره ملک"}
            </button>
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
