"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bath,
  BedDouble,
  LayoutGrid,
  List,
  MapPin,
  Plus,
  Ruler,
  X,
} from "lucide-react";
import {
  PROPERTY_FEATURE_OPTIONS,
  PROPERTY_STATUS_LABEL,
  type AgentProperty,
  type AgentPropertyStatus,
  getAgentProperties,
} from "@/config/agent-crm";
import { useAgentScope } from "@/hooks/useAgentScope";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

type FilterTab = "all" | AgentPropertyStatus;
type ViewMode = "grid" | "list";

const FILTERS: { id: FilterTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "negotiation", label: "در حال مذاکره" },
  { id: "sold", label: "واگذار شده" },
];

const STATUS_TONE: Record<AgentPropertyStatus, string> = {
  active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  negotiation: "bg-amber-50 text-amber-800 ring-amber-200",
  sold: "bg-slate-100 text-slate-600 ring-slate-200",
};

const emptyDraft = {
  title: "",
  dealType: "sale" as "sale" | "rent",
  price: "",
  location: "",
  features: [] as string[],
};

export default function AgentPropertiesPage() {
  const agentId = useAgentScope();
  const [filter, setFilter] = useState<FilterTab>("all");
  const [view, setView] = useState<ViewMode>("grid");
  const [items, setItems] = useState(() => getAgentProperties(agentId));
  const [statusTarget, setStatusTarget] = useState<AgentProperty | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState(emptyDraft);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("add") === "1") {
      setAddOpen(true);
    }
  }, []);

  const filtered = useMemo(
    () => (filter === "all" ? items : items.filter((p) => p.status === filter)),
    [filter, items],
  );

  function updateStatus(status: AgentPropertyStatus) {
    if (!statusTarget) return;
    setItems((prev) =>
      prev.map((p) => (p.id === statusTarget.id ? { ...p, status } : p)),
    );
    setStatusTarget(null);
  }

  function toggleFeature(feature: string) {
    setDraft((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }));
  }

  function submitProperty() {
    const priceNum = Number(draft.price) || 0;
    const next: AgentProperty = {
      id: `ap-${Date.now()}`,
      agentId,
      title: draft.title || "ملک جدید",
      location: draft.location || "تهران",
      neighborhood: draft.location || "تهران",
      price: priceNum,
      priceLabel: priceNum
        ? `${(priceNum / 1_000_000_000).toLocaleString("fa-IR", { maximumFractionDigits: 1 })} میلیارد`
        : "—",
      image: "/images/admin/properties/fereshteh-apt.jpg",
      bedrooms: 2,
      area: 120,
      dealType: draft.dealType,
      status: "active",
      features: draft.features,
      views: 0,
    };
    setItems((prev) => [next, ...prev]);
    setDraft(emptyDraft);
    setStep(0);
    setAddOpen(false);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">املاک من</h1>
          <p className="mt-1 text-sm text-slate-500">
            فقط املاک اختصاص‌یافته یا ثبت‌شده توسط شما
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setAddOpen(true);
            setStep(0);
          }}
          className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4" />
          Add Property
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5 rounded-full border border-slate-200/60 bg-white/80 p-1 backdrop-blur-md">
          {FILTERS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-sm transition",
                filter === tab.id
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-50",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="inline-flex rounded-full border border-slate-200/60 bg-white/80 p-1 backdrop-blur-md">
          <button
            type="button"
            onClick={() => setView("grid")}
            className={cn(
              "rounded-full p-2 transition",
              view === "grid" ? "bg-emerald-600 text-white" : "text-slate-500",
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
              view === "list" ? "bg-emerald-600 text-white" : "text-slate-500",
            )}
            aria-label="نمای لیستی"
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

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
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ delay: index * 0.04, duration: 0.3, ease }}
              whileHover={{ scale: 1.02 }}
              className={cn(
                "overflow-hidden rounded-[1.5rem] border border-slate-200/60 bg-white/80 shadow-sm backdrop-blur-md",
                view === "list" && "sm:flex",
              )}
            >
              <div
                className={cn(
                  "relative bg-cover bg-center",
                  view === "grid" ? "aspect-[16/10]" : "sm:w-48 sm:shrink-0 aspect-[16/10] sm:aspect-auto",
                )}
                style={{ backgroundImage: `url(${property.image})` }}
              >
                <span className="absolute start-3 top-3 rounded-full bg-slate-900/85 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
                  {property.priceLabel}
                </span>
              </div>
              <div className="flex flex-1 flex-col gap-3 p-4">
                <div>
                  <h2 className="font-semibold text-slate-900">{property.title}</h2>
                  <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                    <MapPin className="h-3.5 w-3.5" />
                    {property.location}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-slate-600">
                  {property.bedrooms > 0 && (
                    <span className="inline-flex items-center gap-1">
                      <BedDouble className="h-3.5 w-3.5" />
                      {property.bedrooms.toLocaleString("fa-IR")} خواب
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1">
                    <Ruler className="h-3.5 w-3.5" />
                    {property.area.toLocaleString("fa-IR")} متر
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Bath className="h-3.5 w-3.5" />
                    {property.dealType === "sale" ? "فروش" : "اجاره"}
                  </span>
                </div>
                <div className="mt-auto flex items-center justify-between gap-2">
                  <span
                    className={cn(
                      "inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1",
                      STATUS_TONE[property.status],
                    )}
                  >
                    {PROPERTY_STATUS_LABEL[property.status]}
                  </span>
                  <button
                    type="button"
                    onClick={() => setStatusTarget(property)}
                    className="text-xs font-medium text-emerald-700 hover:text-emerald-800"
                  >
                    تغییر وضعیت
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <p className="rounded-2xl border border-dashed border-slate-300 bg-white/50 px-4 py-10 text-center text-sm text-slate-500">
          ملکی در این فیلتر یافت نشد.
        </p>
      )}

      {/* Status switcher */}
      <AnimatePresence>
        {statusTarget && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-4 backdrop-blur-sm sm:items-center"
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
              className="w-full max-w-md rounded-[1.75rem] border border-slate-200/60 bg-white/95 p-5 shadow-xl backdrop-blur-md"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-slate-900">تغییر وضعیت ملک</h3>
                  <p className="mt-1 text-sm text-slate-500">{statusTarget.title}</p>
                </div>
                <button type="button" onClick={() => setStatusTarget(null)} className="rounded-full p-1.5 hover:bg-slate-100">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="grid gap-2">
                {(Object.keys(PROPERTY_STATUS_LABEL) as AgentPropertyStatus[]).map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => updateStatus(status)}
                    className={cn(
                      "rounded-2xl px-4 py-3 text-start text-sm font-medium ring-1 transition hover:scale-[1.01]",
                      STATUS_TONE[status],
                      statusTarget.status === status && "ring-2 ring-offset-2 ring-offset-white",
                    )}
                  >
                    {PROPERTY_STATUS_LABEL[status]}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add property multi-step drawer */}
      <AnimatePresence>
        {addOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setAddOpen(false)}
          >
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              onClick={(e) => e.stopPropagation()}
              className="flex h-full w-full max-w-md flex-col border-s border-slate-200/60 bg-[#F1EFEA] shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-slate-200/60 bg-white/80 px-5 py-4 backdrop-blur-md">
                <div>
                  <h3 className="font-semibold text-slate-900">ثبت ملک جدید</h3>
                  <p className="text-xs text-slate-500">مرحله {(step + 1).toLocaleString("fa-IR")} از ۳</p>
                </div>
                <button type="button" onClick={() => setAddOpen(false)} className="rounded-full p-1.5 hover:bg-slate-100">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.25, ease }}
                    className="space-y-4"
                  >
                    {step === 0 && (
                      <>
                        <label className="block text-sm text-slate-600">
                          عنوان
                          <input
                            value={draft.title}
                            onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                            placeholder="مثلاً دپارتمان درخشان"
                          />
                        </label>
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
                            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-500"
                          >
                            <option value="sale">فروش</option>
                            <option value="rent">اجاره</option>
                          </select>
                        </label>
                        <label className="block text-sm text-slate-600">
                          موقعیت
                          <input
                            value={draft.location}
                            onChange={(e) => setDraft((d) => ({ ...d, location: e.target.value }))}
                            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                            placeholder="محله / منطقه"
                          />
                        </label>
                      </>
                    )}

                    {step === 1 && (
                      <>
                        <label className="block text-sm text-slate-600">
                          قیمت (تومان)
                          <input
                            type="number"
                            value={draft.price}
                            onChange={(e) => setDraft((d) => ({ ...d, price: e.target.value }))}
                            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                            placeholder="۱۸۰۰۰۰۰۰۰۰۰"
                          />
                        </label>
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 px-4 py-10 text-center text-sm text-slate-500">
                          Photos upload placeholder
                          <p className="mt-1 text-xs text-slate-400">آپلود تصاویر در نسخه بعدی</p>
                        </div>
                      </>
                    )}

                    {step === 2 && (
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
                                    ? "bg-emerald-600 text-white ring-emerald-600"
                                    : "bg-white text-slate-600 ring-slate-200 hover:bg-slate-50",
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

              <div className="flex gap-2 border-t border-slate-200/60 bg-white/80 p-4 backdrop-blur-md">
                {step > 0 && (
                  <button
                    type="button"
                    onClick={() => setStep((s) => s - 1)}
                    className="rounded-full px-4 py-2.5 text-sm text-slate-600 ring-1 ring-slate-200"
                  >
                    قبلی
                  </button>
                )}
                {step < 2 ? (
                  <button
                    type="button"
                    onClick={() => setStep((s) => s + 1)}
                    className="ms-auto rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white"
                  >
                    بعدی
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={submitProperty}
                    className="ms-auto rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white"
                  >
                    ثبت ملک
                  </button>
                )}
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
