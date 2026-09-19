"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Bath, BedDouble, MapPin, Ruler, ShieldCheck, Sparkles } from "lucide-react";
import PropertyGallery from "@/components/mobile/PropertyGallery";
import IosTap from "@/components/mobile/IosTap";
import LikeButton from "@/components/mobile/LikeButton";
import { PropertyDetailSkeleton } from "@/components/mobile/PropertySkeletons";
import { SharedPropertyTitle } from "@/components/mobile/SharedPropertyHero";
import PublicLoadError from "@/components/listings/PublicLoadError";
import { siteConfig } from "@/config/siteConfig";
import { useHaptic } from "@/hooks/useHaptic";
import { api } from "@/lib/api";
import { formatToman, listingTypeLabel, propertyStatusLabel } from "@/lib/money";
import { IOS_PAGE_SPRING, IOS_TAP_SPRING } from "@/lib/motion/ios";
import type { PropertyRecord } from "@/server/db/store";

type MobilePropertyDetailProps = {
  item: PropertyRecord | null;
  failed: boolean;
  onRetry: () => void;
};

/**
 * جزئیات ملک موبایل — گالری سینمایی، مشخصات لوکس، فرم بازدید.
 */
export default function MobilePropertyDetail({ item, failed, onRetry }: MobilePropertyDetailProps) {
  const vibrate = useHaptic();
  const reduceMotion = useReducedMotion();
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
      <div className="bg-[#050B14] px-4 py-28 text-white lg:hidden">
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
    return <PropertyDetailSkeleton />;
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
    <div className="bg-[#050B14] pb-24 text-white lg:hidden">
      <div className="relative px-4 pt-24">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(ellipse_at_top,rgba(0,163,255,0.2),transparent_70%)]"
        />
        <PropertyGallery images={gallery} alt={item.title} propertyId={item.id} />
        <LikeButton propertyId={item.id} className="absolute end-7 top-28 z-10" />
      </div>

      <motion.section
        className="space-y-4 px-4 pt-5"
        initial={reduceMotion ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={IOS_PAGE_SPRING}
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-cyan-200">
            {listingTypeLabel(item.listingType)}
          </span>
          <span className="rounded-full border border-white/10 bg-black/30 px-2.5 py-1 font-mono text-[10px] text-white/65">
            {item.code}
          </span>
          <span className="rounded-full border border-sky-300/25 bg-sky-400/10 px-2.5 py-1 text-[10px] text-sky-100">
            {propertyStatusLabel(item.status)}
          </span>
          {item.isFeatured ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-cyan-300/30 bg-cyan-400/15 px-2.5 py-1 text-[10px] font-bold text-cyan-100">
              <Sparkles className="h-3 w-3" />
              ویژه
            </span>
          ) : null}
        </div>

        <SharedPropertyTitle
          id={item.id}
          title={item.title}
          as="h1"
          className="text-2xl font-black leading-9"
        />
        <p className="inline-flex items-center gap-2 text-sm text-slate-400">
          <MapPin className="h-4 w-4 text-cyan-300" />
          {item.location}
        </p>
        <p className="font-vazirmatn text-xl font-bold text-cyan-300">
          {formatToman(item.price, item.listingType)}
        </p>
        <p className="text-sm leading-8 text-slate-300">{item.description}</p>

        <div className="grid grid-cols-3 gap-2 pt-1">
          <Spec icon={BedDouble} value={item.bedrooms.toLocaleString("fa-IR")} label="خواب" />
          <Spec icon={Bath} value={item.bathrooms.toLocaleString("fa-IR")} label="سرویس" />
          <Spec icon={Ruler} value={item.areaSqm.toLocaleString("fa-IR")} label="متر" />
        </div>

        {item.features.length > 0 ? (
          <div className="flex flex-wrap gap-2 pt-2">
            {item.features.map((feature) => (
              <span
                key={feature}
                className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-slate-300"
              >
                {feature}
              </span>
            ))}
          </div>
        ) : null}
      </motion.section>

      <motion.form
        onSubmit={onSubmit}
        className="mx-4 mt-8 rounded-[1.65rem] border border-cyan-400/25 bg-gradient-to-b from-white/[0.07] to-white/[0.02] p-5 shadow-[0_0_40px_-18px_rgba(0,163,255,0.45)]"
        initial={reduceMotion ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...IOS_PAGE_SPRING, delay: 0.1 }}
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
          className="mt-5 w-full rounded-full bg-gradient-to-l from-cyan-300 via-sky-400 to-cyan-400 py-3 text-sm font-bold text-slate-950 shadow-[0_14px_36px_-16px_rgba(0,163,255,0.9)] disabled:opacity-60"
        >
          {status === "loading" ? "در حال ارسال..." : "ثبت درخواست بازدید"}
        </IosTap>
        {status === "success" ? (
          <p className="mt-3 text-sm text-cyan-300">درخواست ثبت شد. مشاور دفتر به‌زودی تماس می‌گیرد.</p>
        ) : null}
        {formError ? <p className="mt-3 text-sm text-rose-300">{formError}</p> : null}
        <p className="mt-4 text-xs text-slate-500">تماس مستقیم: {siteConfig.contact.phone}</p>
      </motion.form>
    </div>
  );
}

function Spec({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof BedDouble;
  value: string;
  label: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={IOS_TAP_SPRING}
      className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.02] px-2 py-3.5 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
    >
      <Icon className="mx-auto mb-1.5 h-4 w-4 text-cyan-300" strokeWidth={1.75} />
      <p className="font-vazirmatn text-base font-bold tabular-nums text-white">{value}</p>
      <p className="mt-0.5 text-[10px] tracking-wide text-white/45">{label}</p>
    </motion.div>
  );
}
