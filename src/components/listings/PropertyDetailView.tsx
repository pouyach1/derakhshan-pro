"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Bath, BedDouble, MapPin, Ruler, ShieldCheck, Sparkles } from "lucide-react";
import { api } from "@/lib/api";
import { fallbackImage, listingTypeLabel, propertyStatusLabel } from "@/lib/money";
import { listPropertyImages } from "@/lib/property-images";
import { siteConfig } from "@/config/siteConfig";
import AgentProfileLink from "@/components/agents/AgentProfileLink";
import PropertyAparatVideos from "@/components/listings/PropertyAparatVideos";
import PropertyPrice from "@/components/listings/PropertyPrice";
import PublicLoadError from "@/components/listings/PublicLoadError";
import MobilePropertyDetail from "@/components/mobile/MobilePropertyDetail";
import { IOS_PAGE_SPRING, IOS_TAP_SPRING } from "@/lib/motion/ios";
import type { PropertyWithAgent } from "@/server/services/agents-public";

const PropertyLightbox = dynamic(
  () => import("@/components/listings/PropertyLightbox"),
  { ssr: false },
);

function logDetailError(error: unknown) {
  if (process.env.NODE_ENV === "development") {
    console.error("[listings/detail]", error);
  }
}

export default function PropertyDetailView({ id }: { id: string }) {
  const [item, setItem] = useState<PropertyWithAgent | null>(null);
  const [failed, setFailed] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("مایل به بازدید و مشاوره برای این فایل هستم.");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [formError, setFormError] = useState("");
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  useEffect(() => setMounted(true), []);
  const motionReady = mounted && !reduceMotion;

  const gallery = useMemo(() => (item ? listPropertyImages(item) : []), [item]);

  const load = useCallback(async () => {
    setFailed(false);
    setItem(null);
    try {
      const res = await api<PropertyWithAgent>(`/api/properties/${id}?view=1`);
      if (!res.ok) {
        logDetailError(res.error);
        setFailed(true);
        return;
      }
      setItem(res.data);
    } catch (error) {
      logDetailError(error);
      setFailed(true);
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

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
        logDetailError(res.error);
        setStatus("error");
        setFormError("ثبت درخواست انجام نشد. لطفاً دوباره تلاش کنید.");
        return;
      }
      setStatus("success");
      setName("");
      setPhone("");
    } catch (error) {
      logDetailError(error);
      setStatus("error");
      setFormError("ارتباط با سرور برقرار نشد. لطفاً دوباره تلاش کنید.");
    }
  }

  if (failed) {
    return (
      <>
        <MobilePropertyDetail item={null} failed onRetry={() => void load()} />
        <div className="hidden bg-[#F3F7FB] px-4 py-28 text-[#0B3A5C] sm:px-6 lg:block">
          <div className="mx-auto max-w-xl">
            <PublicLoadError
              onRetry={() => void load()}
              title="این فایل در حال حاضر در دسترس نیست"
              message="ممکن است موقتاً حذف شده یا ارتباط قطع شده باشد. دوباره تلاش کنید یا به آرشیو برگردید."
            />
            <div className="mt-4 text-center">
              <Link href="/listings" className="text-sm text-sky-700 hover:text-sky-800">
                بازگشت به آرشیو
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!item) {
    return (
      <>
        <MobilePropertyDetail item={null} failed={false} onRetry={() => void load()} />
        <div className="hidden min-h-[70vh] bg-[#F3F7FB] px-4 py-32 text-center text-[#0B3A5C]/50 lg:block">
          <div className="mx-auto h-1.5 w-40 animate-pulse rounded-full bg-sky-300/50" />
          <p className="mt-6 text-sm tracking-[0.18em]">در حال آماده‌سازی فایل...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <MobilePropertyDetail item={item} failed={false} onRetry={() => void load()} />
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
      <div className="hidden bg-[#F3F7FB] text-[#0B3A5C] lg:block">
        <div className="relative h-[68vh] min-h-[400px] max-h-[780px] overflow-hidden">
          <button
            type="button"
            aria-label={`مشاهده گالری ${item.title}`}
            className="absolute inset-0 cursor-pointer"
            onClick={() => {
              setGalleryIndex(0);
              setGalleryOpen(true);
            }}
          >
            <motion.span
              className="absolute inset-0 block"
              initial={false}
              animate={motionReady ? { scale: 1 } : { scale: 1 }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <Image
                src={fallbackImage(item.imageUrl)}
                alt={item.title}
                fill
                className="object-cover"
                priority
                sizes="100vw"
              />
            </motion.span>
          </button>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0B3A5C]/80 via-[#0B3A5C]/35 to-[#0B3A5C]/20" />

          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 mx-auto max-w-7xl px-6 pb-14 xl:px-10">
            <motion.div initial={false} animate={{ opacity: 1, y: 0 }} transition={IOS_PAGE_SPRING}>
              <Link
                href="/listings"
                className="pointer-events-auto mb-5 inline-flex items-center gap-2 rounded-full bg-black/35 px-3 py-1.5 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-black/45"
              >
                <ArrowRight className="h-4 w-4" />
                بازگشت به آرشیو
              </Link>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-white/50 bg-white px-3 py-1 text-[11px] font-bold tracking-wide text-[#0B3A5C]">
                  {listingTypeLabel(item.listingType)}
                </span>
                <span className="rounded-full bg-black/45 px-3 py-1 font-mono text-[11px] font-semibold text-white backdrop-blur-md">
                  {item.code}
                </span>
                <span className="rounded-full bg-sky-500 px-3 py-1 text-[11px] font-bold text-white">
                  {propertyStatusLabel(item.status)}
                </span>
                {item.isFeatured ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold text-[#0B3A5C]">
                    <Sparkles className="h-3 w-3 text-sky-600" />
                    ویژه
                  </span>
                ) : null}
              </div>
              <h1 className="mt-5 max-w-4xl font-vazirmatn text-[clamp(1.9rem,4vw,3.4rem)] font-black leading-[1.25] tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)]">
                {item.title}
              </h1>
              <p className="mt-4 inline-flex items-center gap-2 text-base font-semibold text-white">
                <MapPin className="h-4 w-4 text-sky-200" />
                {item.location}
                {item.neighborhood ? ` · ${item.neighborhood}` : ""}
              </p>
              <div className="mt-5 inline-flex rounded-2xl bg-white px-4 py-2 font-vazirmatn text-2xl font-bold text-sky-700 shadow-lg sm:text-3xl">
                <PropertyPrice
                  price={item.price}
                  listingType={item.listingType}
                  priceVisible={item.priceVisible}
                  className="text-2xl font-bold text-sky-700 sm:text-3xl"
                />
              </div>
              {item.agent ? (
                <div className="pointer-events-auto mt-5">
                  <AgentProfileLink agent={item.agent} tone="onMedia" />
                </div>
              ) : null}
            </motion.div>
          </div>
        </div>

        <section className="relative z-10 mx-auto grid max-w-7xl gap-8 px-6 pb-28 lg:grid-cols-[1.25fr_0.75fr] lg:-mt-8 xl:px-10">
          <motion.div
            className="rounded-[2rem] border border-[#0B3A5C]/8 bg-white p-8 shadow-[0_28px_80px_-48px_rgba(11,58,92,0.4)] sm:p-10"
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...IOS_PAGE_SPRING, delay: 0.1 }}
          >
            <p className="text-[11px] font-semibold tracking-[0.2em] text-sky-600">درباره فایل</p>
            <p className="mt-4 text-base font-medium leading-9 text-[#0B3A5C]">{item.description}</p>
            {item.agent ? (
              <div className="mt-6">
                <p className="mb-2 text-[11px] font-semibold tracking-[0.16em] text-sky-600">
                  مشاور مسئول فایل
                </p>
                <AgentProfileLink agent={item.agent} />
              </div>
            ) : null}

            <div className="mt-10 grid grid-cols-3 gap-3">
              <LuxurySpec
                icon={BedDouble}
                value={item.bedrooms.toLocaleString("fa-IR")}
                label="خواب"
                delay={0.15}
              />
              <LuxurySpec
                icon={Bath}
                value={item.bathrooms.toLocaleString("fa-IR")}
                label="سرویس"
                delay={0.2}
              />
              <LuxurySpec
                icon={Ruler}
                value={item.areaSqm.toLocaleString("fa-IR")}
                label="متر مربع"
                delay={0.25}
              />
            </div>

            {item.features.length > 0 ? (
              <div className="mt-10">
                <p className="text-[11px] font-semibold tracking-[0.2em] text-sky-600">امکانات</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {item.features.map((feature) => (
                    <span
                      key={feature}
                      className="rounded-full border border-[#0B3A5C]/10 bg-[#F3F7FB] px-4 py-2 text-xs font-semibold text-[#0B3A5C]"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {gallery.length > 1 ? (
              <div className="mt-10">
                <p className="text-[11px] font-semibold tracking-[0.2em] text-sky-600">گالری</p>
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {gallery.slice(0, 6).map((src, i) => (
                    <motion.button
                      key={`${src}-${i}`}
                      type="button"
                      aria-label={`مشاهده تصویر ${i + 1}`}
                      className="relative aspect-[4/3] cursor-pointer overflow-hidden rounded-2xl border border-[#0B3A5C]/8"
                      initial={false}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ ...IOS_PAGE_SPRING, delay: i * 0.04 }}
                      whileHover={motionReady ? { scale: 1.02 } : undefined}
                      onClick={() => {
                        setGalleryIndex(i);
                        setGalleryOpen(true);
                      }}
                    >
                      <Image src={src} alt="" fill className="object-cover" sizes="220px" />
                    </motion.button>
                  ))}
                </div>
              </div>
            ) : null}

            <PropertyAparatVideos videos={item.videos} className="mt-10" />
          </motion.div>

          <motion.form
            onSubmit={onSubmit}
            className="h-fit rounded-[2rem] border border-sky-200/70 bg-white p-7 shadow-[0_24px_70px_-40px_rgba(0,163,255,0.45)]"
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...IOS_PAGE_SPRING, delay: 0.18 }}
          >
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-sky-700">
              <ShieldCheck className="h-4 w-4" />
              درخواست بازدید محرمانه
            </p>
            <p className="mt-2 text-sm leading-7 text-[#0B3A5C]/70">
              مشخصات شما برای مشاور مسئول این فایل در پنل دفتر ثبت می‌شود.
              {item.agent ? ` · مسئول: ${item.agent.name}` : ""}
            </p>
            <label className="mt-6 block text-xs text-[#0B3A5C]/55">
              نام
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1.5 h-12 w-full rounded-2xl border border-[#0B3A5C]/12 bg-[#F3F7FB] px-4 text-sm text-[#0B3A5C] outline-none transition focus:border-sky-400"
              />
            </label>
            <label className="mt-3 block text-xs text-[#0B3A5C]/55">
              موبایل
              <input
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1.5 h-12 w-full rounded-2xl border border-[#0B3A5C]/12 bg-[#F3F7FB] px-4 text-sm text-[#0B3A5C] outline-none transition focus:border-sky-400"
              />
            </label>
            <label className="mt-3 block text-xs text-[#0B3A5C]/55">
              پیام
              <textarea
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="mt-1.5 w-full rounded-2xl border border-[#0B3A5C]/12 bg-[#F3F7FB] px-4 py-3 text-sm text-[#0B3A5C] outline-none transition focus:border-sky-400"
              />
            </label>
            <motion.button
              type="submit"
              disabled={status === "loading"}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={IOS_TAP_SPRING}
              className="mt-6 w-full rounded-full bg-sky-500 py-3.5 text-sm font-bold text-white shadow-[0_16px_40px_-16px_rgba(0,163,255,0.9)] disabled:opacity-60"
            >
              {status === "loading" ? "در حال ارسال..." : "ثبت درخواست بازدید"}
            </motion.button>
            {status === "success" ? (
              <p className="mt-3 text-sm text-sky-700">درخواست ثبت شد. مشاور دفتر به‌زودی تماس می‌گیرد.</p>
            ) : null}
            {formError ? <p className="mt-3 text-sm text-rose-600">{formError}</p> : null}
            <p className="mt-5 text-xs text-[#0B3A5C]/45">تماس مستقیم: {siteConfig.contact.phone}</p>
          </motion.form>
        </section>
      </div>
    </>
  );
}

function LuxurySpec({
  icon: Icon,
  value,
  label,
  delay,
}: {
  icon: typeof BedDouble;
  value: string;
  label: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...IOS_PAGE_SPRING, delay }}
      className="rounded-2xl border border-[#0B3A5C]/8 bg-[#F3F7FB] px-3 py-5 text-center"
    >
      <Icon className="mx-auto mb-3 h-5 w-5 text-sky-500" strokeWidth={1.75} />
      <p className="font-vazirmatn text-xl font-bold tabular-nums text-[#0B3A5C]">{value}</p>
      <p className="mt-1 text-[11px] font-semibold tracking-wide text-[#0B3A5C]/65">{label}</p>
    </motion.div>
  );
}
