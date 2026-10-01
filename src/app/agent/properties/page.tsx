"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bath,
  BedDouble,
  Eye,
  LayoutGrid,
  List,
  MapPin,
  Pencil,
  Plus,
  Ruler,
  Search,
  X,
} from "lucide-react";
import {
  PROPERTY_FEATURE_OPTIONS,
  PROPERTY_STATUS_LABEL,
  type AgentProperty,
  type AgentPropertyStatus,
} from "@/config/agent-crm";
import { useAgentScope } from "@/hooks/useAgentScope";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/siteConfig";
import { api } from "@/lib/api";
import { fallbackImage } from "@/lib/money";
import { agentStatusToProperty, mapPropertyToAgent } from "@/lib/mappers";
import type { PropertyRecord } from "@/server/db/store";

const ease = [0.22, 1, 0.36, 1] as const;
const NEIGHBORHOODS = siteConfig.panels.neighborhoods;
const DEFAULT_IMAGE = "/images/landing/hero/banner.jpg";

type FilterTab = "all" | AgentPropertyStatus;
type ViewMode = "grid" | "list";
type DrawerMode = "add" | "edit" | null;

const FILTERS: { id: FilterTab; label: string }[] = [
  { id: "all", label: "همه" },
  { id: "active", label: "فعال" },
  { id: "negotiation", label: "مذاکره" },
  { id: "sold", label: "واگذار شده" },
];

const STATUS_TONE: Record<AgentPropertyStatus, string> = {
  active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  negotiation: "bg-amber-50 text-amber-800 ring-amber-200",
  sold: "bg-slate-100 text-slate-600 ring-slate-200",
};

type Draft = {
  title: string;
  dealType: "sale" | "rent";
  price: string;
  location: string;
  neighborhood: string;
  bedrooms: string;
  bathrooms: string;
  area: string;
  imageUrl: string;
  features: string[];
  status: AgentPropertyStatus;
};

const emptyDraft = (): Draft => ({
  title: "",
  dealType: "sale",
  price: "",
  location: siteConfig.contact.address.line1,
  neighborhood: NEIGHBORHOODS[0] || siteConfig.contact.address.city,
  bedrooms: "3",
  bathrooms: "2",
  area: "150",
  imageUrl: DEFAULT_IMAGE,
  features: [],
  status: "active",
});

function draftFromRecord(item: PropertyRecord): Draft {
  const status: AgentPropertyStatus =
    item.status === "negotiation"
      ? "negotiation"
      : item.status === "sold" || item.status === "archived"
        ? "sold"
        : "active";
  return {
    title: item.title,
    dealType: item.listingType,
    price: String(item.price || ""),
    location: item.location,
    neighborhood: item.neighborhood || item.location,
    bedrooms: String(item.bedrooms || 0),
    bathrooms: String(item.bathrooms || 0),
    area: String(item.areaSqm || 0),
    imageUrl: item.imageUrl || DEFAULT_IMAGE,
    features: [...item.features],
    status,
  };
}

function draftFromProperty(p: AgentProperty): Draft {
  return {
    title: p.title,
    dealType: p.dealType,
    price: String(p.price || ""),
    location: p.location,
    neighborhood: p.neighborhood || p.location,
    bedrooms: String(p.bedrooms || 0),
    bathrooms: "0",
    area: String(p.area || 0),
    imageUrl: p.image || DEFAULT_IMAGE,
    features: [...p.features],
    status: p.status,
  };
}

const fieldClass =
  "mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 font-vazirmatn text-sm text-[#0B3A5C] outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20";

export default function AgentPropertiesPage() {
  const agentId = useAgentScope();
  const [filter, setFilter] = useState<FilterTab>("all");
  const [view, setView] = useState<ViewMode>("grid");
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<AgentProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [statusTarget, setStatusTarget] = useState<AgentProperty | null>(null);
  const [drawer, setDrawer] = useState<DrawerMode>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Draft>(emptyDraft);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await api<{ items: PropertyRecord[] }>("/api/properties?pageSize=80");
    if (res.ok) {
      setItems(res.data.items.map(mapPropertyToAgent));
      setError("");
    } else {
      setError(res.error.message || "بارگذاری فایل‌ها ناموفق بود");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [agentId, load]);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("add") === "1") {
      openAdd();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const counts = useMemo(() => {
    return {
      all: items.length,
      active: items.filter((p) => p.status === "active").length,
      negotiation: items.filter((p) => p.status === "negotiation").length,
      sold: items.filter((p) => p.status === "sold").length,
    };
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((p) => {
      if (filter !== "all" && p.status !== filter) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.neighborhood.toLowerCase().includes(q)
      );
    });
  }, [filter, items, query]);

  function openAdd() {
    setEditingId(null);
    setDraft(emptyDraft());
    setStep(0);
    setDrawer("add");
    setError("");
  }

  async function openEdit(property: AgentProperty) {
    setEditingId(property.id);
    setDraft(draftFromProperty(property));
    setStep(0);
    setDrawer("edit");
    setError("");
    const res = await api<PropertyRecord>(`/api/properties/${property.id}`);
    if (res.ok) setDraft(draftFromRecord(res.data));
  }

  function closeDrawer() {
    setDrawer(null);
    setEditingId(null);
    setStep(0);
    setDraft(emptyDraft());
  }

  function toggleFeature(feature: string) {
    setDraft((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }));
  }

  async function updateStatus(status: AgentPropertyStatus) {
    if (!statusTarget) return;
    const id = statusTarget.id;
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
    setStatusTarget(null);
    const res = await api(`/api/properties/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status: agentStatusToProperty(status) }),
    });
    if (!res.ok) void load();
  }

  async function submitProperty() {
    if (!draft.title.trim()) {
      setError("عنوان فایل را وارد کنید");
      setStep(0);
      return;
    }
    setSaving(true);
    setError("");
    const payload = {
      title: draft.title.trim(),
      location: draft.location.trim() || siteConfig.contact.address.city,
      neighborhood: draft.neighborhood.trim() || draft.location.trim(),
      price: Number(draft.price) || 1,
      listingType: draft.dealType,
      status: agentStatusToProperty(draft.status),
      bedrooms: Number(draft.bedrooms) || 0,
      bathrooms: Number(draft.bathrooms) || 0,
      areaSqm: Number(draft.area) || 0,
      features: draft.features,
      imageUrl: draft.imageUrl.trim() || DEFAULT_IMAGE,
      gallery: [draft.imageUrl.trim() || DEFAULT_IMAGE],
    };

    const res = editingId
      ? await api<PropertyRecord>(`/api/properties/${editingId}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        })
      : await api<PropertyRecord>("/api/properties", {
          method: "POST",
          body: JSON.stringify(payload),
        });

    setSaving(false);
    if (!res.ok) {
      setError(res.error.message || "ذخیره ناموفق بود");
      return;
    }

    const mapped = mapPropertyToAgent(res.data);
    setItems((prev) => {
      if (editingId) return prev.map((p) => (p.id === editingId ? mapped : p));
      return [mapped, ...prev];
    });
    closeDrawer();
  }

  const previewImage = fallbackImage(draft.imageUrl || DEFAULT_IMAGE);

  return (
    <div className="space-y-5 font-vazirmatn" dir="rtl">
      {/* Header */}
      <section className="overflow-hidden rounded-[1.75rem] border border-sky-100/80 bg-white p-5 shadow-[0_18px_50px_-36px_rgba(11,58,92,0.35)] sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.14em] text-sky-600">آرشیو شخصی مشاور</p>
            <h1 className="mt-1 text-xl font-semibold text-[#0B3A5C] sm:text-2xl">املاک من</h1>
            <p className="mt-1.5 max-w-xl text-sm leading-7 text-slate-500">
              فایل‌های خودتان را سریع ثبت، ویرایش و وضعیت‌گذاری کنید — بدون شلوغی اضافه.
            </p>
          </div>
          <button
            type="button"
            onClick={openAdd}
            className="inline-flex items-center gap-2 rounded-full bg-[#0B3A5C] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_14px_36px_-18px_rgba(11,58,92,0.7)] transition hover:bg-sky-600"
          >
            <Plus className="h-4 w-4" />
            ثبت فایل جدید
          </button>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {(
            [
              { id: "all" as const, label: "کل فایل‌ها", value: counts.all },
              { id: "active" as const, label: "فعال", value: counts.active },
              { id: "negotiation" as const, label: "مذاکره", value: counts.negotiation },
              { id: "sold" as const, label: "واگذار شده", value: counts.sold },
            ] as const
          ).map((stat) => (
            <button
              key={stat.id}
              type="button"
              onClick={() => setFilter(stat.id)}
              className={cn(
                "rounded-2xl px-3 py-3 text-start transition ring-1",
                filter === stat.id
                  ? "bg-sky-50 ring-sky-200"
                  : "bg-[#F3F7FB] ring-transparent hover:bg-sky-50/70",
              )}
            >
              <p className="text-lg font-semibold tabular-nums text-[#0B3A5C]">
                {stat.value.toLocaleString("fa-IR")}
              </p>
              <p className="mt-0.5 text-xs text-slate-500">{stat.label}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <label className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جستجو عنوان، محله یا آدرس..."
            className="h-11 w-full rounded-full border border-slate-200/80 bg-white pe-4 ps-10 text-sm text-[#0B3A5C] outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
          />
        </label>

        <div className="flex flex-wrap gap-1.5 rounded-full border border-slate-200/70 bg-white p-1">
          {FILTERS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-sm transition",
                filter === tab.id
                  ? "bg-[#0B3A5C] text-white"
                  : "text-slate-600 hover:bg-slate-50",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="ms-auto inline-flex rounded-full border border-slate-200/70 bg-white p-1">
          <button
            type="button"
            onClick={() => setView("grid")}
            className={cn(
              "rounded-full p-2 transition",
              view === "grid" ? "bg-sky-500 text-white" : "text-slate-500",
            )}
            aria-label="نمای شبکه‌ای"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setView("list")}
            className={cn(
              "rounded-full p-2 transition",
              view === "list" ? "bg-sky-500 text-white" : "text-slate-500",
            )}
            aria-label="نمای لیستی"
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {error && !drawer ? (
        <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</p>
      ) : null}

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-72 animate-pulse rounded-[1.5rem] bg-white ring-1 ring-slate-200/70"
            />
          ))}
        </div>
      ) : (
        <motion.div
          layout
          className={cn(
            "grid gap-4",
            view === "grid" ? "sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1",
          )}
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((property, index) => (
              <motion.article
                key={property.id}
                layout
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ delay: Math.min(index, 8) * 0.03, duration: 0.28, ease }}
                className={cn(
                  "overflow-hidden rounded-[1.5rem] border border-slate-200/70 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-[0_22px_50px_-32px_rgba(11,58,92,0.35)]",
                  view === "list" && "sm:flex",
                )}
              >
                <div
                  className={cn(
                    "relative bg-[#E8F1F8]",
                    view === "grid"
                      ? "aspect-[16/10]"
                      : "aspect-[16/10] sm:aspect-auto sm:w-52 sm:shrink-0",
                  )}
                >
                  <Image
                    src={property.image}
                    alt={property.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover"
                  />
                  <span className="absolute start-3 top-3 rounded-full bg-[#0B3A5C]/90 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
                    {property.priceLabel}
                  </span>
                  <span className="absolute end-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-[#0B3A5C]">
                    {property.dealType === "sale" ? "فروش" : "اجاره"}
                  </span>
                </div>

                <div className="flex flex-1 flex-col gap-3 p-4">
                  <div>
                    <h2 className="line-clamp-2 font-semibold leading-7 text-[#0B3A5C]">
                      {property.title}
                    </h2>
                    <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                      <MapPin className="h-3.5 w-3.5 text-sky-500" />
                      {property.neighborhood || property.location}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3 text-xs text-slate-600">
                    {property.bedrooms > 0 ? (
                      <span className="inline-flex items-center gap-1">
                        <BedDouble className="h-3.5 w-3.5 text-sky-500" />
                        {property.bedrooms.toLocaleString("fa-IR")} خواب
                      </span>
                    ) : null}
                    {property.area > 0 ? (
                      <span className="inline-flex items-center gap-1">
                        <Ruler className="h-3.5 w-3.5 text-sky-500" />
                        {property.area.toLocaleString("fa-IR")} متر
                      </span>
                    ) : null}
                    <span className="inline-flex items-center gap-1 text-slate-400">
                      <Bath className="h-3.5 w-3.5" />
                      {property.views.toLocaleString("fa-IR")} بازدید
                    </span>
                  </div>

                  <div className="mt-auto flex flex-wrap items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setStatusTarget(property)}
                      className={cn(
                        "inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 transition hover:opacity-90",
                        STATUS_TONE[property.status],
                      )}
                    >
                      {PROPERTY_STATUS_LABEL[property.status]}
                    </button>
                    <div className="flex items-center gap-1.5">
                      <Link
                        href={`/listings/${property.id}`}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-sky-600 transition hover:bg-sky-50"
                        aria-label="مشاهده عمومی"
                        title="مشاهده"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => openEdit(property)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-[#0B3A5C] transition hover:bg-slate-50"
                        aria-label="ویرایش"
                        title="ویرایش"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {!loading && filtered.length === 0 ? (
        <div className="rounded-[1.5rem] border border-dashed border-sky-200 bg-white px-6 py-14 text-center">
          <p className="text-sm font-medium text-[#0B3A5C]">فایلی در این فیلتر نیست</p>
          <p className="mt-1 text-xs text-slate-500">یک فایل تازه ثبت کنید یا جستجو را عوض کنید.</p>
          <button
            type="button"
            onClick={openAdd}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white"
          >
            <Plus className="h-4 w-4" />
            ثبت فایل جدید
          </button>
        </div>
      ) : null}

      {/* Status switcher */}
      <AnimatePresence>
        {statusTarget ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center bg-[#0B3A5C]/35 p-4 backdrop-blur-sm sm:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setStatusTarget(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.28, ease }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-[1.75rem] border border-slate-200/70 bg-white p-5 shadow-xl"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-[#0B3A5C]">تغییر وضعیت فایل</h3>
                  <p className="mt-1 text-sm text-slate-500">{statusTarget.title}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setStatusTarget(null)}
                  className="rounded-full p-1.5 hover:bg-slate-100"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="grid gap-2">
                {(Object.keys(PROPERTY_STATUS_LABEL) as AgentPropertyStatus[]).map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => void updateStatus(status)}
                    className={cn(
                      "rounded-2xl px-4 py-3 text-start text-sm font-medium ring-1 transition hover:scale-[1.01]",
                      STATUS_TONE[status],
                      statusTarget.status === status && "ring-2 ring-sky-400 ring-offset-2",
                    )}
                  >
                    {PROPERTY_STATUS_LABEL[status]}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Add / Edit drawer */}
      <AnimatePresence>
        {drawer ? (
          <motion.div
            className="fixed inset-0 z-50 flex justify-end bg-[#0B3A5C]/35 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
          >
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              onClick={(e) => e.stopPropagation()}
              className="flex h-full w-full max-w-md flex-col border-s border-slate-200/70 bg-[#F3F7FB] shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-slate-200/70 bg-white/90 px-5 py-4 backdrop-blur-md">
                <div>
                  <h3 className="font-semibold text-[#0B3A5C]">
                    {drawer === "edit" ? "ویرایش فایل" : "ثبت فایل جدید"}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {drawer === "edit"
                      ? "تغییرات همین‌جا ذخیره می‌شود"
                      : `مرحله ${(step + 1).toLocaleString("fa-IR")} از ۳`}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeDrawer}
                  className="rounded-full p-1.5 hover:bg-slate-100"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {drawer === "add" ? (
                <div className="px-5 pt-3">
                  <div className="flex gap-1.5">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className={cn(
                          "h-1.5 flex-1 rounded-full transition",
                          i <= step ? "bg-sky-500" : "bg-slate-200",
                        )}
                      />
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="flex-1 overflow-y-auto p-5">
                {error && drawer ? (
                  <p className="mb-4 rounded-2xl bg-rose-50 px-3 py-2 text-xs text-rose-600">
                    {error}
                  </p>
                ) : null}

                <AnimatePresence mode="wait">
                  <motion.div
                    key={drawer === "edit" ? "edit" : step}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.22, ease }}
                    className="space-y-4"
                  >
                    {(drawer === "edit" || step === 0) && (
                      <>
                        <label className="block text-sm text-slate-600">
                          عنوان فایل
                          <input
                            value={draft.title}
                            onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                            className={fieldClass}
                            placeholder="مثلاً دوبلکس بازسازی‌شده گوهردشت"
                          />
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <label className="block text-sm text-slate-600">
                            نوع معامله
                            <select
                              value={draft.dealType}
                              onChange={(e) =>
                                setDraft((d) => ({
                                  ...d,
                                  dealType: e.target.value as "sale" | "rent",
                                }))
                              }
                              className={fieldClass}
                            >
                              <option value="sale">فروش</option>
                              <option value="rent">اجاره</option>
                            </select>
                          </label>
                          <label className="block text-sm text-slate-600">
                            وضعیت
                            <select
                              value={draft.status}
                              onChange={(e) =>
                                setDraft((d) => ({
                                  ...d,
                                  status: e.target.value as AgentPropertyStatus,
                                }))
                              }
                              className={fieldClass}
                            >
                              <option value="active">فعال</option>
                              <option value="negotiation">مذاکره</option>
                              <option value="sold">واگذار شده</option>
                            </select>
                          </label>
                        </div>
                        <div>
                          <p className="text-sm text-slate-600">محله</p>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {NEIGHBORHOODS.map((n) => (
                              <button
                                key={n}
                                type="button"
                                onClick={() =>
                                  setDraft((d) => ({
                                    ...d,
                                    neighborhood: n,
                                    location: d.location.includes(n) ? d.location : `کرج، ${n}`,
                                  }))
                                }
                                className={cn(
                                  "rounded-full px-3 py-1.5 text-xs ring-1 transition",
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
                        <label className="block text-sm text-slate-600">
                          آدرس / موقعیت
                          <input
                            value={draft.location}
                            onChange={(e) => setDraft((d) => ({ ...d, location: e.target.value }))}
                            className={fieldClass}
                            placeholder="کرج، ..."
                          />
                        </label>
                      </>
                    )}

                    {(drawer === "edit" || step === 1) && (
                      <>
                        <label className="block text-sm text-slate-600">
                          قیمت (تومان)
                          <input
                            type="number"
                            value={draft.price}
                            onChange={(e) => setDraft((d) => ({ ...d, price: e.target.value }))}
                            className={fieldClass}
                            placeholder="۸۹۰۰۰۰۰۰۰۰"
                          />
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          <label className="block text-sm text-slate-600">
                            خواب
                            <input
                              type="number"
                              value={draft.bedrooms}
                              onChange={(e) =>
                                setDraft((d) => ({ ...d, bedrooms: e.target.value }))
                              }
                              className={fieldClass}
                            />
                          </label>
                          <label className="block text-sm text-slate-600">
                            سرویس
                            <input
                              type="number"
                              value={draft.bathrooms}
                              onChange={(e) =>
                                setDraft((d) => ({ ...d, bathrooms: e.target.value }))
                              }
                              className={fieldClass}
                            />
                          </label>
                          <label className="block text-sm text-slate-600">
                            متراژ
                            <input
                              type="number"
                              value={draft.area}
                              onChange={(e) => setDraft((d) => ({ ...d, area: e.target.value }))}
                              className={fieldClass}
                            />
                          </label>
                        </div>
                        <label className="block text-sm text-slate-600">
                          آدرس تصویر کاور
                          <input
                            value={draft.imageUrl}
                            onChange={(e) => setDraft((d) => ({ ...d, imageUrl: e.target.value }))}
                            className={fieldClass}
                            placeholder="/images/... یا لینک تصویر"
                            dir="ltr"
                          />
                        </label>
                        <div className="relative mt-2 aspect-[16/10] overflow-hidden rounded-2xl bg-[#E8F1F8] ring-1 ring-slate-200">
                          <Image
                            src={previewImage}
                            alt="پیش‌نمایش"
                            fill
                            className="object-cover"
                            sizes="400px"
                          />
                        </div>
                      </>
                    )}

                    {(drawer === "edit" || step === 2) && (
                      <div>
                        <p className="mb-3 text-sm text-slate-600">امکانات</p>
                        <div className="flex flex-wrap gap-2">
                          {PROPERTY_FEATURE_OPTIONS.map((feature) => {
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
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="flex gap-2 border-t border-slate-200/70 bg-white/90 p-4 backdrop-blur-md">
                {drawer === "add" && step > 0 ? (
                  <button
                    type="button"
                    onClick={() => setStep((s) => s - 1)}
                    className="rounded-full px-4 py-2.5 text-sm text-slate-600 ring-1 ring-slate-200"
                  >
                    قبلی
                  </button>
                ) : null}

                {drawer === "add" && step < 2 ? (
                  <button
                    type="button"
                    onClick={() => setStep((s) => s + 1)}
                    className="ms-auto rounded-full bg-[#0B3A5C] px-5 py-2.5 text-sm font-semibold text-white"
                  >
                    بعدی
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => void submitProperty()}
                    className="ms-auto rounded-full bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
                  >
                    {saving ? "در حال ذخیره..." : drawer === "edit" ? "ذخیره تغییرات" : "ثبت فایل"}
                  </button>
                )}
              </div>
            </motion.aside>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
