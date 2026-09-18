"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { Bath, BedDouble, MapPin, Ruler, ShieldCheck } from "lucide-react";
import PropertyGallery from "@/components/mobile/PropertyGallery";
import IosTap from "@/components/mobile/IosTap";
import PublicLoadError from "@/components/listings/PublicLoadError";
import { siteConfig } from "@/config/siteConfig";
import { useHaptic } from "@/hooks/useHaptic";
import { api } from "@/lib/api";
import { formatToman, listingTypeLabel, propertyStatusLabel } from "@/lib/money";
import type { PropertyRecord } from "@/server/db/store";

type MobilePropertyDetailProps = {
  item: PropertyRecord | null;
  failed: boolean;
  onRetry: () => void;
};

/**
 * جزئیات ملک موبایل با گالری swipe/pinch و فرم بازدید.
 */
export default function MobilePropertyDetail({ item, failed, onRetry }: MobilePropertyDetailProps) {
  const vibrate = useHaptic();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("مایل به بازدید و مشاوره برای این فایل هستم.");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [formError, setFormError] = useState("");

  const gallery = useMemo(() => {
    if (!item) return [];
    const list = item.gallery?.length ? item.gallery : [item.imageUrl];
    return list.filter(Boolean);
  }, [item]);

  if (failed) {
    return (
      <div className="bg-[#070C18] px-4 py-28 text-white lg:hidden">
        <PublicLoadError
          onRetry={onRetry}
          title="این فایل در حال حاضر در دسترس نیست"
          message="دوباره تلاش کنید یا به آرشیو برگردید."
        />
        <div className="mt-4 text-center">
          <Link href="/listings" className="text-sm text-cyan-300">
            بازگشت به آرشیو
          </Link>
        </div>
      </div>
    );
  }

  if (!item) {
    return <div className="bg-[#070C18] px-4 py-32 text-center text-slate-400 lg:hidden">در حال بارگذاری فایل...</div>;
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!item) return;
    setStatus("loading");
    setFormError("");
    try {
      const res = await api("/api/inquiries", {
        method: "POST",
        body: JSON.stringify({
          name,
          phone,
          propertyId: item.id,
          message,
        }),
      });
      if (!res.ok) {
        if (process.env.NODE_ENV === "development") console.error("[mobile-detail]", res.error);
        setStatus("error");
        setFormError("ثبت درخواست انجام نشد. لطفاً دوباره تلاش کنید.");
        return;
      }
      vibrate([12, 40, 12]);
      setStatus("success");
      setName("");
      setPhone("");
    } catch (error) {
      if (process.env.NODE_ENV === "development") console.error("[mobile-detail]", error);
      setStatus("error");
      setFormError("ارتباط با سرور برقرار نشد. لطفاً دوباره تلاش کنید.");
    }
  }

  return (
    <div className="bg-[#070C18] pb-24 text-white lg:hidden">
      <div className="px-4 pt-24">
        <PropertyGallery images={gallery} alt={item.title} />
      </div>

      <section className="space-y-4 px-4 pt-5">
        <p className="text-[11px] tracking-[0.16em] text-cyan-300">
          {item.code} · {listingTypeLabel(item.listingType)} · {propertyStatusLabel(item.status)}
        </p>
        <h1 className="font-vazirmatn text-2xl font-black leading-9">{item.title}</h1>
        <p className="inline-flex items-center gap-2 text-sm text-slate-400">
          <MapPin className="h-4 w-4 text-cyan-300" />
          {item.location}
        </p>
        <p className="text-xl font-semibold text-cyan-300">{formatToman(item.price, item.listingType)}</p>
        <p className="text-sm leading-8 text-slate-300">{item.description}</p>

        <div className="grid grid-cols-3 gap-2">
          <Spec icon={BedDouble} label={`${item.bedrooms.toLocaleString("fa-IR")} خواب`} />
          <Spec icon={Bath} label={`${item.bathrooms.toLocaleString("fa-IR")} سرویس`} />
          <Spec icon={Ruler} label={`${item.areaSqm.toLocaleString("fa-IR")} متر`} />
        </div>

        {item.features.length > 0 ? (
          <div className="flex flex-wrap gap-2 pt-1">
            {item.features.map((feature) => (
              <span key={feature} className="rounded-full bg-white/5 px-3 py-1.5 text-xs text-slate-300 ring-1 ring-white/10">
                {feature}
              </span>
            ))}
          </div>
        ) : null}
      </section>

      <form
        onSubmit={onSubmit}
        className="mx-4 mt-8 rounded-[1.5rem] border border-cyan-400/20 bg-white/[0.04] p-5"
      >
        <p className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-200">
          <ShieldCheck className="h-4 w-4" />
          درخواست بازدید
        </p>
        <label className="mt-4 block text-xs text-slate-400">
          نام
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1.5 h-11 w-full rounded-2xl border border-white/10 bg-black/30 px-4 text-sm outline-none focus:border-cyan-400"
          />
        </label>
        <label className="mt-3 block text-xs text-slate-400">
          موبایل
          <input
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1.5 h-11 w-full rounded-2xl border border-white/10 bg-black/30 px-4 text-sm outline-none focus:border-cyan-400"
          />
        </label>
        <label className="mt-3 block text-xs text-slate-400">
          پیام
          <textarea
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            className="mt-1.5 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none focus:border-cyan-400"
          />
        </label>
        <IosTap
          haptic
          type="submit"
          disabled={status === "loading"}
          className="mt-5 w-full rounded-full bg-cyan-400 py-3 text-sm font-semibold text-slate-950 disabled:opacity-60"
        >
          {status === "loading" ? "در حال ارسال..." : "ثبت درخواست بازدید"}
        </IosTap>
        {status === "success" ? (
          <p className="mt-3 text-sm text-cyan-300">درخواست ثبت شد. مشاور دفتر به‌زودی تماس می‌گیرد.</p>
        ) : null}
        {formError ? <p className="mt-3 text-sm text-rose-300">{formError}</p> : null}
        <p className="mt-4 text-xs text-slate-500">تماس مستقیم: {siteConfig.contact.phone}</p>
      </form>
    </div>
  );
}

function Spec({ icon: Icon, label }: { icon: typeof BedDouble; label: string }) {
  return (
    <div className="rounded-2xl bg-white/5 px-2 py-3 text-center text-xs text-slate-200">
      <Icon className="mx-auto mb-1.5 h-4 w-4 text-cyan-300" />
      {label}
    </div>
  );
}
