"use client";

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bath, BedDouble, MapPin, Ruler, ShieldCheck } from "lucide-react";
import { api } from "@/lib/api";
import { fallbackImage, formatToman, listingTypeLabel, propertyStatusLabel } from "@/lib/money";
import { siteConfig } from "@/config/siteConfig";
import type { PropertyRecord } from "@/server/db/store";

export default function PropertyDetailView({ id }: { id: string }) {
  const [item, setItem] = useState<PropertyRecord | null>(null);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("مایل به بازدید و مشاوره برای این فایل هستم.");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await api<PropertyRecord>(`/api/properties/${id}?view=1`);
      if (cancelled) return;
      if (!res.ok) {
        setError(res.error.message);
        return;
      }
      setItem(res.data);
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!item) return;
    setStatus("loading");
    setFormError("");
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
      setStatus("error");
      setFormError(res.error.message);
      return;
    }
    setStatus("success");
    setName("");
    setPhone("");
  }

  if (error) {
    return (
      <div className="bg-[#070C18] px-4 py-32 text-center text-slate-300">
        <p>{error}</p>
        <Link href="/listings" className="mt-4 inline-block text-cyan-300">
          بازگشت به آرشیو
        </Link>
      </div>
    );
  }

  if (!item) {
    return <div className="bg-[#070C18] px-4 py-32 text-center text-slate-400">در حال بارگذاری فایل...</div>;
  }

  return (
    <div className="bg-[#070C18] text-white">
      <div className="relative h-[52vh] min-h-[320px]">
        <Image src={fallbackImage(item.imageUrl)} alt={item.title} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070C18] via-[#070C18]/30 to-black/20" />
      </div>

      <section className="relative z-10 mx-auto grid max-w-6xl gap-8 px-4 pb-24 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:-mt-24">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl sm:p-8">
          <p className="text-xs tracking-[0.18em] text-cyan-300">
            {item.code} · {listingTypeLabel(item.listingType)} · {propertyStatusLabel(item.status)}
          </p>
          <h1 className="mt-3 text-3xl font-black sm:text-4xl">{item.title}</h1>
          <p className="mt-3 inline-flex items-center gap-2 text-slate-400">
            <MapPin className="h-4 w-4 text-cyan-300" />
            {item.location}
          </p>
          <p className="mt-5 text-2xl font-semibold text-cyan-300">{formatToman(item.price, item.listingType)}</p>
          <p className="mt-5 text-sm leading-8 text-slate-300">{item.description}</p>

          <div className="mt-8 grid grid-cols-3 gap-3">
            <Spec icon={BedDouble} label={`${item.bedrooms.toLocaleString("fa-IR")} خواب`} />
            <Spec icon={Bath} label={`${item.bathrooms.toLocaleString("fa-IR")} سرویس`} />
            <Spec icon={Ruler} label={`${item.areaSqm.toLocaleString("fa-IR")} متر`} />
          </div>

          {item.features.length > 0 ? (
            <div className="mt-8 flex flex-wrap gap-2">
              {item.features.map((feature) => (
                <span key={feature} className="rounded-full bg-white/5 px-3 py-1.5 text-xs text-slate-300 ring-1 ring-white/10">
                  {feature}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        <form
          onSubmit={onSubmit}
          className="h-fit rounded-[2rem] border border-cyan-400/20 bg-gradient-to-b from-white/[0.07] to-white/[0.02] p-6 shadow-[0_0_40px_-16px_rgba(0,240,255,0.45)]"
        >
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-200">
            <ShieldCheck className="h-4 w-4" />
            درخواست بازدید محرمانه
          </p>
          <p className="mt-2 text-sm text-slate-400">
            مشخصات شما برای مشاور مسئول این فایل در پنل دفتر ثبت می‌شود.
          </p>
          <label className="mt-5 block text-xs text-slate-400">
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
              rows={4}
              className="mt-1.5 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none focus:border-cyan-400"
            />
          </label>
          <button
            type="submit"
            disabled={status === "loading"}
            className="mt-5 w-full rounded-full bg-cyan-400 py-3 text-sm font-semibold text-slate-950 disabled:opacity-60"
          >
            {status === "loading" ? "در حال ارسال..." : "ثبت درخواست بازدید"}
          </button>
          {status === "success" ? (
            <p className="mt-3 text-sm text-cyan-300">درخواست ثبت شد. مشاور دفتر به‌زودی تماس می‌گیرد.</p>
          ) : null}
          {formError ? <p className="mt-3 text-sm text-rose-300">{formError}</p> : null}
          <p className="mt-4 text-xs text-slate-500">
            تماس مستقیم: {siteConfig.contact.phone}
          </p>
        </form>
      </section>
    </div>
  );
}

function Spec({ icon: Icon, label }: { icon: typeof BedDouble; label: string }) {
  return (
    <div className="rounded-2xl bg-white/5 px-3 py-4 text-center text-sm text-slate-200">
      <Icon className="mx-auto mb-2 h-4 w-4 text-cyan-300" />
      {label}
    </div>
  );
}
