"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BedDouble,
  Calculator,
  CheckCircle2,
  ClipboardPen,
  FileText,
  MapPin,
  Phone,
  Ruler,
  Sparkles,
} from "lucide-react";
import {
  PROPERTY_STATUS_LABEL,
  TASK_KIND_LABEL,
  URGENCY_LABEL,
  bestMatchForClient,
  calcCommission,
  formatBillion,
  type AgentClient,
  type AgentClientNote,
  type AgentProperty,
  type AgentPropertyStatus,
  type AgentTask,
  type AgentTaskKind,
} from "@/config/agent-crm";
import { EASE, glass } from "@/components/agent/dashboard/shared";
import { cn } from "@/lib/utils";

type TabId = "today" | "properties" | "crm" | "toolkit";

const TABS: { id: TabId; label: string }[] = [
  { id: "today", label: "امروز و پیگیری‌ها" },
  { id: "properties", label: "مدیریت فایل‌ها و املاک من" },
  { id: "crm", label: "CRM مشتریان تخصیص‌یافته" },
  { id: "toolkit", label: "ابزارهای هوشمند مشاور" },
];

const STATUS_TONE: Record<AgentPropertyStatus, string> = {
  active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  negotiation: "bg-amber-50 text-amber-800 ring-amber-200",
  sold: "bg-slate-100 text-slate-600 ring-slate-200",
};

const URGENCY_TONE: Record<AgentClient["urgency"], string> = {
  low: "bg-slate-100 text-slate-600 ring-slate-200",
  medium: "bg-amber-50 text-amber-800 ring-amber-200",
  high: "bg-rose-50 text-rose-700 ring-rose-200",
};

const TASK_TONE: Record<AgentTaskKind, string> = {
  visit: "bg-sky-500",
  callback: "bg-amber-500",
  contract: "bg-emerald-500",
  note: "bg-violet-500",
};

type Props = {
  agentId: string;
  properties: AgentProperty[];
  clients: AgentClient[];
  tasks: AgentTask[];
  commissionRate: number;
};

export default function WorkspaceTabs({
  agentId,
  properties,
  clients,
  tasks,
  commissionRate,
}: Props) {
  const [tab, setTab] = useState<TabId>("today");

  return (
    <section className={`${glass} overflow-hidden`}>
      <div className="border-b border-slate-200/70 bg-white/50 px-3 py-3 sm:px-5">
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={cn(
                "shrink-0 rounded-full px-3.5 py-2 text-sm transition",
                tab === item.id
                  ? "bg-slate-900 text-white shadow-md shadow-slate-900/20"
                  : "bg-white/80 text-slate-600 ring-1 ring-slate-200/70 hover:bg-white",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 sm:p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.32, ease: EASE }}
          >
            {tab === "today" ? <TodayPanel tasks={tasks} /> : null}
            {tab === "properties" ? <PropertiesPanel properties={properties} /> : null}
            {tab === "crm" ? <ClientsPanel agentId={agentId} clients={clients} /> : null}
            {tab === "toolkit" ? <ToolsPanel commissionRate={commissionRate} /> : null}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

function TodayPanel({ tasks }: { tasks: AgentTask[] }) {
  const [notes, setNotes] = useState<AgentClientNote[]>([
    {
      id: "seed-note",
      at: "امروز · ۰۹:۱۵",
      text: "تماس صبحگاهی با مالک دپارتمان درخشان — آمادگی بازدید ساعت ۱۰:۳۰ تأیید شد.",
    },
  ]);
  const [draft, setDraft] = useState("");

  const today = tasks.filter((t) => t.dayLabel === "امروز");
  const later = tasks.filter((t) => t.dayLabel !== "امروز");

  function addNote() {
    if (!draft.trim()) return;
    const now = new Intl.DateTimeFormat("fa-IR", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date());
    setNotes((prev) => [
      { id: `note-${Date.now()}`, at: `امروز · ${now}`, text: draft.trim() },
      ...prev,
    ]);
    setDraft("");
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
      <div>
        <h3 className="text-base font-semibold text-slate-900">تایم‌لاین امروز</h3>
        <p className="mt-1 text-xs text-slate-500">بازدیدها، تماس با مالک و جلسات قرارداد</p>
        <ol className="relative mt-5 space-y-3 border-s-2 border-slate-200/80 ps-5">
          {today.map((task, index) => (
            <motion.li
              key={task.id}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3, ease: EASE }}
              whileHover={{ scale: 1.015, y: -2 }}
              className="relative"
            >
              <span
                className={cn(
                  "absolute -start-[1.6rem] top-4 h-3 w-3 rounded-full ring-4 ring-white",
                  TASK_TONE[task.kind],
                )}
              />
              <div
                className={cn(
                  "rounded-2xl bg-[#F1EFEA]/80 p-4 ring-1 ring-slate-200/60",
                  task.done && "opacity-60",
                )}
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-slate-900">{task.title}</p>
                    <p className="mt-1 text-sm text-slate-500">{task.detail}</p>
                  </div>
                  <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-slate-600 ring-1 ring-slate-200">
                    {TASK_KIND_LABEL[task.kind]} · {task.time}
                  </span>
                </div>
                {task.done ? (
                  <p className="mt-2 inline-flex items-center gap-1 text-xs text-emerald-700">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    انجام‌شده
                  </p>
                ) : null}
              </div>
            </motion.li>
          ))}
        </ol>

        {later.length > 0 ? (
          <div className="mt-6">
            <h4 className="text-sm font-semibold text-slate-800">ادامه هفته</h4>
            <div className="mt-3 space-y-2">
              {later.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between gap-3 rounded-2xl bg-white/80 px-3.5 py-3 ring-1 ring-slate-200/70"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-900">{task.title}</p>
                    <p className="text-xs text-slate-500">{task.detail}</p>
                  </div>
                  <span className="shrink-0 text-xs tabular-nums text-emerald-700">
                    {task.dayLabel} · {task.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <div className="rounded-[1.5rem] border border-slate-200/70 bg-white/80 p-4 sm:p-5">
        <div className="mb-3 flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
            <ClipboardPen className="h-4 w-4" />
          </span>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">یادداشت تماس سریع</h3>
            <p className="text-[11px] text-slate-500">لاگ تماس و پیگیری مشتریان</p>
          </div>
        </div>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={4}
          placeholder="مثلاً: تماس با خریدار دپارتمان درخشان — درخواست تخفیف ۳٪ و بازدید مجدد..."
          className="w-full resize-none rounded-2xl border border-slate-200 bg-[#F1EFEA]/60 px-3.5 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
        />
        <button
          type="button"
          onClick={addNote}
          className="mt-3 w-full rounded-full bg-slate-900 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          افزودن به لاگ تماس
        </button>
        <ul className="mt-4 max-h-64 space-y-2 overflow-y-auto">
          {notes.map((note) => (
            <li
              key={note.id}
              className="rounded-2xl bg-[#F1EFEA]/80 px-3.5 py-3 ring-1 ring-slate-200/50"
            >
              <p className="text-[11px] text-slate-400">{note.at}</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-700">{note.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function PropertiesPanel({ properties }: { properties: AgentProperty[] }) {
  const [filter, setFilter] = useState<"all" | AgentPropertyStatus>("all");
  const [drawer, setDrawer] = useState<AgentProperty | null>(null);

  const filtered = useMemo(
    () => (filter === "all" ? properties : properties.filter((p) => p.status === filter)),
    [filter, properties],
  );

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-900">املاک تحت مدیریت شما</h3>
          <p className="mt-1 text-xs text-slate-500">فقط فایل‌های اختصاص‌یافته به این مشاور</p>
        </div>
        <div className="flex flex-wrap gap-1.5 rounded-full bg-white/80 p-1 ring-1 ring-slate-200/70">
          {(
            [
              ["all", "همه"],
              ["active", "فعال"],
              ["negotiation", "در حال مذاکره"],
              ["sold", "واگذار شد"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setFilter(id)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs transition",
                filter === id ? "bg-emerald-600 text-white" : "text-slate-600 hover:bg-slate-50",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((property, index) => (
          <motion.article
            key={property.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.35, ease: EASE }}
            whileHover={{ scale: 1.015, y: -2 }}
            className="group overflow-hidden rounded-[1.5rem] border border-slate-200/70 bg-white/85 shadow-lg shadow-slate-200/40"
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-110"
                style={{ backgroundImage: `url(${property.image})` }}
              />
              <span className="absolute start-3 top-3 rounded-full bg-slate-900/85 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
                {property.priceLabel}
              </span>
            </div>
            <div className="space-y-3 p-4">
              <div>
                <h4 className="font-semibold text-slate-900">{property.title}</h4>
                <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                  <MapPin className="h-3.5 w-3.5" />
                  {property.location}
                </p>
              </div>
              <div className="flex flex-wrap gap-3 text-xs text-slate-600">
                {property.bedrooms > 0 ? (
                  <span className="inline-flex items-center gap-1">
                    <BedDouble className="h-3.5 w-3.5" />
                    {property.bedrooms.toLocaleString("fa-IR")} خواب
                  </span>
                ) : null}
                <span className="inline-flex items-center gap-1">
                  <Ruler className="h-3.5 w-3.5" />
                  {property.area.toLocaleString("fa-IR")} متر
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
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
                  onClick={() => setDrawer(property)}
                  className="text-xs font-medium text-emerald-700 hover:text-emerald-800"
                >
                  ویرایش سریع
                </button>
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      <AnimatePresence>
        {drawer ? (
          <motion.div
            className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDrawer(null)}
          >
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              onClick={(e) => e.stopPropagation()}
              className="flex h-full w-full max-w-md flex-col border-s border-slate-200/60 bg-[#F1EFEA] shadow-2xl"
            >
              <div className="border-b border-slate-200/60 bg-white/80 px-5 py-4 backdrop-blur-md">
                <h3 className="font-semibold text-slate-900">ویرایش سریع فایل</h3>
                <p className="mt-1 text-sm text-slate-500">{drawer.title}</p>
              </div>
              <div className="flex-1 space-y-3 overflow-y-auto p-5 text-sm text-slate-600">
                <p>موقعیت: {drawer.location}</p>
                <p>قیمت: {drawer.priceLabel}</p>
                <p>متراژ: {drawer.area.toLocaleString("fa-IR")} متر</p>
                <p>امکانات: {drawer.features.join(" · ")}</p>
                <p className="rounded-2xl bg-white/80 p-3 text-xs leading-relaxed text-slate-500 ring-1 ring-slate-200/70">
                  برای تغییر وضعیت کامل، از صفحه «املاک من» استفاده کنید. این کشو برای مرور سریع
                  جزئیات فایل است.
                </p>
              </div>
              <div className="border-t border-slate-200/60 bg-white/80 p-4 backdrop-blur-md">
                <button
                  type="button"
                  onClick={() => setDrawer(null)}
                  className="w-full rounded-full bg-slate-900 py-2.5 text-sm font-medium text-white"
                >
                  بستن
                </button>
              </div>
            </motion.aside>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function ClientsPanel({
  agentId,
  clients,
}: {
  agentId: string;
  clients: AgentClient[];
}) {
  return (
    <div>
      <div className="mb-4">
        <h3 className="text-base font-semibold text-slate-900">مشتریان تخصیص‌یافته</h3>
        <p className="mt-1 text-xs text-slate-500">
          تطبیق هوشمند بودجه و مشخصات با موجودی فایل‌های شما
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {clients.map((client, index) => {
          const best = bestMatchForClient(agentId, client);
          return (
            <motion.article
              key={client.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.35, ease: EASE }}
              whileHover={{ scale: 1.015, y: -2 }}
              className="rounded-[1.5rem] border border-slate-200/70 bg-white/85 p-5 shadow-lg shadow-slate-200/40"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="text-lg font-semibold text-slate-900">{client.name}</h4>
                  <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-slate-500">
                    <Phone className="h-3.5 w-3.5" />
                    {client.phone}
                  </p>
                </div>
                <span
                  className={cn(
                    "rounded-full px-2.5 py-1 text-xs font-medium ring-1",
                    URGENCY_TONE[client.urgency],
                  )}
                >
                  {URGENCY_LABEL[client.urgency]}
                </span>
              </div>

              <div className="mt-4 space-y-1.5 text-sm text-slate-600">
                <p>بودجه: {client.budgetLabel}</p>
                <p>محله ترجیحی: {client.preferredNeighborhood}</p>
              </div>

              {best ? (
                <div className="mt-4 rounded-2xl bg-gradient-to-l from-emerald-50 to-amber-50 px-3.5 py-3 ring-1 ring-emerald-200/70">
                  <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
                    <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                    {best.score.toLocaleString("fa-IR")}٪ تطابق با فایل {best.property.title}
                  </p>
                  <p className="mt-1 text-[11px] text-slate-500">
                    {best.property.priceLabel} · {best.property.location}
                  </p>
                </div>
              ) : (
                <p className="mt-4 text-xs text-slate-400">فعلاً فایل منطبقی در موجودی نیست.</p>
              )}
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}

function ToolsPanel({ commissionRate }: { commissionRate: number }) {
  const [priceInput, setPriceInput] = useState("18000000000");
  const [dealTitle, setDealTitle] = useState("دپارتمان درخشان");
  const [buyer, setBuyer] = useState("علی رضایی");
  const [seller, setSeller] = useState("مالک محترم");
  const [generated, setGenerated] = useState("");

  const price = Number(priceInput) || 0;
  const commission = calcCommission(price, commissionRate);

  function generateNote() {
    setGenerated(
      `پیش‌نویس یادداشت پیش‌قرارداد\n\nموضوع: ${dealTitle}\nخریدار: ${buyer}\nفروشنده: ${seller}\nقیمت توافقی: ${formatBillion(price)}\nحق‌الزحمه تخمینی مشاور (${commissionRate.toLocaleString("fa-IR")}٪): ${formatBillion(commission)}\n\nشرایط: بازدید انجام شده، تمایل طرفین به ادامه مذاکره، نیاز به استعلام مدارک مالکیت و هماهنگی زمان تنظیم مبایعه‌نامه.\n\nتهیه‌کننده: پنل مشاور درخشان پرو`,
    );
  }

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <div className="rounded-[1.5rem] border border-slate-200/70 bg-white/85 p-5 shadow-lg shadow-slate-200/40">
        <div className="mb-4 flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            <Calculator className="h-4 w-4" />
          </span>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">ماشین‌حساب کمیسیون</h3>
            <p className="text-[11px] text-slate-500">
              نرخ توافقی {commissionRate.toLocaleString("fa-IR")}٪
            </p>
          </div>
        </div>
        <label className="block text-sm text-slate-600">
          قیمت ملک (تومان)
          <input
            type="number"
            min={0}
            value={priceInput}
            onChange={(e) => setPriceInput(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-[#F1EFEA]/60 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          />
        </label>
        <div className="mt-4 rounded-2xl bg-slate-900 px-4 py-4 text-white">
          <p className="text-xs text-white/60">حق‌الزحمه تخمینی</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">{formatBillion(commission)}</p>
        </div>
      </div>

      <div className="rounded-[1.5rem] border border-slate-200/70 bg-white/85 p-5 shadow-lg shadow-slate-200/40">
        <div className="mb-4 flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-800">
            <FileText className="h-4 w-4" />
          </span>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">مولد یادداشت پیش‌قرارداد</h3>
            <p className="text-[11px] text-slate-500">پیش‌نویس سریع برای پرونده معامله</p>
          </div>
        </div>
        <div className="space-y-3">
          <input
            value={dealTitle}
            onChange={(e) => setDealTitle(e.target.value)}
            placeholder="عنوان معامله"
            className="w-full rounded-2xl border border-slate-200 bg-[#F1EFEA]/60 px-4 py-2.5 text-sm outline-none focus:border-emerald-500"
          />
          <input
            value={buyer}
            onChange={(e) => setBuyer(e.target.value)}
            placeholder="نام خریدار"
            className="w-full rounded-2xl border border-slate-200 bg-[#F1EFEA]/60 px-4 py-2.5 text-sm outline-none focus:border-emerald-500"
          />
          <input
            value={seller}
            onChange={(e) => setSeller(e.target.value)}
            placeholder="نام فروشنده"
            className="w-full rounded-2xl border border-slate-200 bg-[#F1EFEA]/60 px-4 py-2.5 text-sm outline-none focus:border-emerald-500"
          />
          <button
            type="button"
            onClick={generateNote}
            className="w-full rounded-full bg-emerald-600 py-2.5 text-sm font-medium text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700"
          >
            تولید یادداشت
          </button>
        </div>
        {generated ? (
          <pre className="mt-4 whitespace-pre-wrap rounded-2xl bg-slate-900/95 p-4 text-xs leading-relaxed text-emerald-100">
            {generated}
          </pre>
        ) : null}
      </div>
    </div>
  );
}
