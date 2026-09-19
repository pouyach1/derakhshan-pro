"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Bath, BedDouble, MapPin, Ruler, ShieldCheck, Sparkles } from "lucide-react";
import { api } from "@/lib/api";
import { fallbackImage, formatToman, listingTypeLabel, propertyStatusLabel } from "@/lib/money";
import { siteConfig } from "@/config/siteConfig";
import PublicLoadError from "@/components/listings/PublicLoadError";
import MobilePropertyDetail from "@/components/mobile/MobilePropertyDetail";
import { IOS_PAGE_SPRING, IOS_TAP_SPRING } from "@/lib/motion/ios";
import type { PropertyRecord } from "@/server/db/store";

function logDetailError(error: unknown) {
  if (process.env.NODE_ENV === "development") {
    console.error("[listings/detail]", error);
  }
}

export default function PropertyDetailView({ id }: { id: string }) {
  const [item, setItem] = useState<PropertyRecord | null>(null);
  const [failed, setFailed] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("مایل به بازدید و مشاوره برای این فایل هستم.");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [formError, setFormError] = useState("");
  const reduceMotion = useReducedMotion();

  const gallery = useMemo(() => {
    if (!item) return [];
    const list = item.gallery?.length ? item.gallery : [item.imageUrl];
    return list.filter(Boolean).map(fallbackImage);
  }, [item]);

  const load = useCallback(async () => {
    setFailed(false);
    setItem(null);
    try {
      const res = await api<PropertyRecord>(`/api/properties/${id}?view=1`);
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
        <div className="hidden bg-[#050B14] px-4 py-28 text-white sm:px-6 lg:block">
          <div className="mx-auto max-w-xl">
            <PublicLoadError
              onRetry={() => void load()}
              title="این فایل در حال حاضر در دسترس نیست"
              message="ممکن است موقتاً حذف شده یا ارتباط قطع شده باشد. دوباره تلاش کنید یا به آرشیو برگردید."
            />
            <div className="mt-4 text-center">
              <Link href="/listings" className="text-sm text-cyan-300 hover:text-cyan-200">
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
        <div className="hidden min-h-[70vh] bg-[#050B14] px-4 py-32 text-center text-slate-400 lg:block">
          <div className="mx-auto h-1.5 w-40 animate-pulse rounded-full bg-cyan-400/30" />
          <p className="mt-6 text-sm tracking-[0.18em]">در حال آماده‌سازی فایل...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <MobilePropertyDetail item={item} failed={false} onRetry={() => void load()} />
      <div className="hidden bg-[#050B14] text-white lg:block">
        {/* Full-bleed cinematic hero */}
        <div className="relative h-[72vh] min-h-[420px] max-h-[820px] overflow-hidden">
          <motion.div
            className="absolute inset-0"
            initial={reduceMotion ? false : { scale: 1.12 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <Image
              src={fallbackImage(item.imageUrl)}
              alt={item.title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#050B14] via-[#050B14]/45 to-black/25" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,163,255,0.18),transparent_45%)]" />

          <div className="absolute inset-x-0 bottom-0 z-10 mx-auto max-w-7xl px-6 pb-16 xl:px-10">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }}
              transition={IOS_PAGE_SPRING}
            >
              <Link
                href="/listings"
                className="mb-6 inline-flex items-center gap-2 text-sm text-white/70 transition hover:text-cyan-200"
              >
                <ArrowRight className="h-4 w-4" />
                بازگشت به آرشیو
              </Link>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-white/15 bg-black/40 px-3 py-1 text-[11px] font-semibold tracking-wide text-cyan-200 backdrop-blur-md">
                  {listingTypeLabel(item.listingType)}
                </span>
                <span className="rounded-full border border-white/10 bg-black/35 px-3 py-1 font-mono text-[11px] text-white/70 backdrop-blur-md">
                  {item.code}
                </span>
                <span className="rounded-full border border-sky-300/25 bg-sky-400/15 px-3 py-1 text-[11px] text-sky-100 backdrop-blur-md">
                  {propertyStatusLabel(item.status)}
                </span>
                {item.isFeatured ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-cyan-300/30 bg-cyan-400/15 px-3 py-1 text-[11px] font-bold text-cyan-100 backdrop-blur-md">
                    <Sparkles className="h-3 w-3" />
                    ویژه
                  </span>
                ) : null}
              </div>
              <h1 className="mt-5 max-w-4xl font-vazirmatn text-[clamp(2rem,4.5vw,3.75rem)] font-black leading-[1.2] tracking-tight drop-shadow-lg">
                {item.title}
              </h1>
              <p className="mt-4 inline-flex items-center gap-2 text-base text-white/75">
                <MapPin className="h-4 w-4 text-cyan-300" />
                {item.location}
                {item.neighborhood ? ` · ${item.neighborhood}` : ""}
              </p>
              <p className="mt-5 font-vazirmatn text-2xl font-bold text-cyan-300 sm:text-3xl">
                {formatToman(item.price, item.listingType)}
              </p>
            </motion.div>
          </div>
        </div>

        <section className="relative z-10 mx-auto grid max-w-7xl gap-8 px-6 pb-28 lg:grid-cols-[1.25fr_0.75fr] lg:-mt-10 xl:px-10">
          <motion.div
            className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 shadow-[0_40px_100px_-60px_rgba(0,0,0,0.85)] backdrop-blur-xl sm:p-10"
            initial={reduceMotion ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...IOS_PAGE_SPRING, delay: 0.1 }}
          >
            <p className="text-[11px] font-semibold tracking-[0.2em] text-cyan-300">درباره فایل</p>
            <p className="mt-4 text-base leading-9 text-slate-300">{item.description}</p>

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
                <p className="text-[11px] font-semibold tracking-[0.2em] text-cyan-300">امکانات</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {item.features.map((feature, i) => (
                    <motion.span
                      key={feature}
                      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ ...IOS_PAGE_SPRING, delay: 0.28 + i * 0.03 }}
                      className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs text-slate-200"
                    >
                      {feature}
                    </motion.span>
                  ))}
                </div>
              </div>
            ) : null}

            {gallery.length > 1 ? (
              <div className="mt-10">
                <p className="text-[11px] font-semibold tracking-[0.2em] text-cyan-300">گالری</p>
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {gallery.slice(0, 6).map((src, i) => (
                    <motion.div
                      key={`${src}-${i}`}
                      className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10"
                      initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ ...IOS_PAGE_SPRING, delay: i * 0.04 }}
                      whileHover={reduceMotion ? undefined : { scale: 1.02 }}
                    >
                      <Image src={src} alt="" fill className="object-cover" sizes="220px" />
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : null}
          </motion.div>

          <motion.form
            onSubmit={onSubmit}
            className="h-fit rounded-[2rem] border border-cyan-400/25 bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-7 shadow-[0_0_60px_-20px_rgba(0,163,255,0.45)] backdrop-blur-xl"
            initial={reduceMotion ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...IOS_PAGE_SPRING, delay: 0.18 }}
          >
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-200">
              <ShieldCheck className="h-4 w-4" />
              درخواست بازدید محرمانه
            </p>
            <p className="mt-2 text-sm leading-7 text-slate-400">
              مشخصات شما برای مشاور مسئول این فایل در پنل دفتر ثبت می‌شود.
            </p>
            <label className="mt-6 block text-xs text-slate-400">
              نام
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1.5 h-12 w-full rounded-2xl border border-white/10 bg-black/35 px-4 text-sm outline-none transition focus:border-cyan-400"
              />
            </label>
            <label className="mt-3 block text-xs text-slate-400">
              موبایل
              <input
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1.5 h-12 w-full rounded-2xl border border-white/10 bg-black/35 px-4 text-sm outline-none transition focus:border-cyan-400"
              />
            </label>
            <label className="mt-3 block text-xs text-slate-400">
              پیام
              <textarea
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="mt-1.5 w-full rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-sm outline-none transition focus:border-cyan-400"
              />
            </label>
            <motion.button
              type="submit"
              disabled={status === "loading"}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={IOS_TAP_SPRING}
              className="mt-6 w-full rounded-full bg-gradient-to-l from-cyan-300 via-sky-400 to-cyan-400 py-3.5 text-sm font-bold text-slate-950 shadow-[0_16px_40px_-16px_rgba(0,163,255,0.9)] disabled:opacity-60"
            >
              {status === "loading" ? "در حال ارسال..." : "ثبت درخواست بازدید"}
            </motion.button>
            {status === "success" ? (
              <p className="mt-3 text-sm text-cyan-300">درخواست ثبت شد. مشاور دفتر به‌زودی تماس می‌گیرد.</p>
            ) : null}
            {formError ? <p className="mt-3 text-sm text-rose-300">{formError}</p> : null}
            <p className="mt-5 text-xs text-slate-500">تماس مستقیم: {siteConfig.contact.phone}</p>
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
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...IOS_PAGE_SPRING, delay }}
      className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.02] px-3 py-5 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
    >
      <Icon className="mx-auto mb-3 h-5 w-5 text-cyan-300" strokeWidth={1.75} />
      <p className="font-vazirmatn text-xl font-bold tabular-nums text-white">{value}</p>
      <p className="mt-1 text-[11px] tracking-wide text-white/50">{label}</p>
    </motion.div>
  );
}
