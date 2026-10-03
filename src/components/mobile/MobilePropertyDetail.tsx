"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { FormEvent, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Bath, BedDouble, MapPin, Ruler, ShieldCheck, Sparkles } from "lucide-react";
import PropertyGallery from "@/components/mobile/PropertyGallery";
import IosTap from "@/components/mobile/IosTap";
import LikeButton from "@/components/mobile/LikeButton";
import { PropertyDetailSkeleton } from "@/components/mobile/PropertySkeletons";
import { SharedPropertyTitle } from "@/components/mobile/SharedPropertyHero";
import AgentProfileLink from "@/components/agents/AgentProfileLink";
import PropertyAparatVideos from "@/components/listings/PropertyAparatVideos";
import PublicLoadError from "@/components/listings/PublicLoadError";
import { listPropertyImages } from "@/lib/property-images";
import { siteConfig } from "@/config/siteConfig";
import { useHaptic } from "@/hooks/useHaptic";
import { api } from "@/lib/api";
import { listingTypeLabel, propertyStatusLabel } from "@/lib/money";
import PropertyPrice from "@/components/listings/PropertyPrice";
import { IOS_PAGE_SPRING, IOS_TAP_SPRING } from "@/lib/motion/ios";
import type { PropertyWithAgent } from "@/server/services/agents-public";

const PropertyLightbox = dynamic(
  () => import("@/components/listings/PropertyLightbox"),
  { ssr: false },
);

type MobilePropertyDetailProps = {
  item: PropertyWithAgent | null;
  failed: boolean;
  onRetry: () => void;
};

/**
 * جزئیات ملک موبایل — تم سفید / آبی کم‌رنگ برند.
 */
export default function MobilePropertyDetail({ item, failed, onRetry }: MobilePropertyDetailProps) {
  const vibrate = useHaptic();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("مایل به بازدید و مشاوره برای این فایل هستم.");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [formError, setFormError] = useState("");
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

  const gallery = useMemo(() => (item ? listPropertyImages(item) : []), [item]);

  if (failed) {
    return (
      <div className="bg-[#F3F7FB] px-4 py-28 text-[#0B3A5C] lg:hidden">
        <PublicLoadError
          onRetry={onRetry}
          title="این فایل در حال حاضر در دسترس نیست"
          message="دوباره تلاش کنید یا به آرشیو برگردید."
        />
        <div className="mt-4 text-center">
          <Link href="/listings" className="text-sm text-sky-700">
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
    <div className="bg-[#F3F7FB] pb-24 text-[#0B3A5C] lg:hidden">
      <div className="relative px-4 pt-24">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(ellipse_at_top,rgba(0,163,255,0.12),transparent_70%)]"
        />
        <PropertyGallery
          images={gallery}
          alt={item.title}
          propertyId={item.id}
          onOpen={(index) => {
            setGalleryIndex(index);
            setGalleryOpen(true);
          }}
        />
        {galleryOpen ? (
          <PropertyLightbox
            open={galleryOpen}
            images={gallery}
            title={item.title}
            code={item.code}
            startIndex={galleryIndex}
            onClose={() => setGalleryOpen(false)}
          />
        ) : null}
        <LikeButton propertyId={item.id} className="absolute end-7 top-28 z-10" />
      </div>

      <motion.section
        className="space-y-4 px-4 pt-5"
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={IOS_PAGE_SPRING}
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-[#0B3A5C]/10 bg-white px-2.5 py-1 text-[10px] font-semibold tracking-wide text-[#0B3A5C] shadow-sm">
            {listingTypeLabel(item.listingType)}
          </span>
          <span className="rounded-full border border-[#0B3A5C]/10 bg-white px-2.5 py-1 font-mono text-[10px] text-[#0B3A5C]/65">
            {item.code}
          </span>
          <span className="rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 text-[10px] text-sky-700">
            {propertyStatusLabel(item.status)}
          </span>
          {item.isFeatured ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-sky-500 px-2.5 py-1 text-[10px] font-bold text-white">
              <Sparkles className="h-3 w-3" />
              ویژه
            </span>
          ) : null}
        </div>

        <SharedPropertyTitle
          id={item.id}
          title={item.title}
          as="h1"
          className="text-2xl font-black leading-9 text-[#0B3A5C]"
        />
        <p className="inline-flex items-center gap-2 text-sm font-semibold text-[#0B3A5C]/80">
          <MapPin className="h-4 w-4 text-sky-600" />
          {item.location}
        </p>
        <PropertyPrice
          price={item.price}
          listingType={item.listingType}
          priceVisible={item.priceVisible}
          className="font-vazirmatn text-xl font-bold text-sky-700"
        />
        {item.agent ? <AgentProfileLink agent={item.agent} /> : null}
        <p className="text-sm font-medium leading-8 text-[#0B3A5C]">{item.description}</p>

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
                className="rounded-full border border-[#0B3A5C]/10 bg-white px-3 py-1.5 text-xs font-semibold text-[#0B3A5C]"
              >
                {feature}
              </span>
            ))}
          </div>
        ) : null}

        <PropertyAparatVideos videos={item.videos} className="pt-3" compact />
      </motion.section>

      <motion.form
        onSubmit={onSubmit}
        className="mx-4 mt-8 rounded-[1.65rem] border border-sky-200/70 bg-white p-5 shadow-[0_18px_50px_-30px_rgba(0,163,255,0.4)]"
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...IOS_PAGE_SPRING, delay: 0.1 }}
      >
        <p className="inline-flex items-center gap-2 text-sm font-semibold text-sky-700">
          <ShieldCheck className="h-4 w-4" />
          درخواست بازدید
        </p>
        <label className="mt-4 block text-xs text-[#0B3A5C]/55">
          نام
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1.5 h-11 w-full rounded-2xl border border-[#0B3A5C]/12 bg-[#F3F7FB] px-4 text-sm outline-none focus:border-sky-400"
          />
        </label>
        <label className="mt-3 block text-xs text-[#0B3A5C]/55">
          موبایل
          <input
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1.5 h-11 w-full rounded-2xl border border-[#0B3A5C]/12 bg-[#F3F7FB] px-4 text-sm outline-none focus:border-sky-400"
          />
        </label>
        <label className="mt-3 block text-xs text-[#0B3A5C]/55">
          پیام
          <textarea
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            className="mt-1.5 w-full rounded-2xl border border-[#0B3A5C]/12 bg-[#F3F7FB] px-4 py-3 text-sm outline-none focus:border-sky-400"
          />
        </label>
        <IosTap
          haptic
          type="submit"
          disabled={status === "loading"}
          className="mt-5 w-full rounded-full bg-sky-500 py-3 text-sm font-bold text-white shadow-[0_14px_36px_-16px_rgba(0,163,255,0.9)] disabled:opacity-60"
        >
          {status === "loading" ? "در حال ارسال..." : "ثبت درخواست بازدید"}
        </IosTap>
        {status === "success" ? (
          <p className="mt-3 text-sm text-sky-700">درخواست ثبت شد. مشاور دفتر به‌زودی تماس می‌گیرد.</p>
        ) : null}
        {formError ? <p className="mt-3 text-sm text-rose-600">{formError}</p> : null}
        <p className="mt-4 text-xs text-[#0B3A5C]/45">تماس مستقیم: {siteConfig.contact.phone}</p>
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
      className="rounded-2xl border border-[#0B3A5C]/8 bg-white px-2 py-3.5 text-center shadow-sm"
    >
      <Icon className="mx-auto mb-1.5 h-4 w-4 text-sky-500" strokeWidth={1.75} />
      <p className="font-vazirmatn text-base font-bold tabular-nums text-[#0B3A5C]">{value}</p>
      <p className="mt-0.5 text-[10px] font-semibold tracking-wide text-[#0B3A5C]/65">{label}</p>
    </motion.div>
  );
}
