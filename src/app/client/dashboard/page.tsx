"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { readClientSession } from "@/lib/auth";
import { api } from "@/lib/api";
import { fallbackImage, formatToman } from "@/lib/money";
import { siteConfig } from "@/config/siteConfig";
import type { PropertyRecord } from "@/server/db/store";

export default function ClientDashboardPage() {
  const [name, setName] = useState("");
  const [items, setItems] = useState<PropertyRecord[]>([]);

  useEffect(() => {
    const session = readClientSession();
    setName(session?.clientProfile?.fullName || session?.name || "موکل");
    void (async () => {
      const res = await api<{ items: PropertyRecord[] }>("/api/properties?pageSize=12");
      if (res.ok) setItems(res.data.items);
    })();
  }, []);

  const picks = useMemo(() => items.slice(0, 6), [items]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <p className="text-xs font-semibold tracking-[0.16em] text-emerald-700">پنل موکل</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">سلام {name}</h1>
        <p className="mt-2 text-sm leading-7 text-slate-600">
          فایل‌های منتشرشده {siteConfig.brand.nameFa} بر اساس پروفایل شما اینجا دیده می‌شوند. برای بازدید، روی هر فایل درخواست بگذارید.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link href="/listings" className="rounded-full bg-emerald-600 px-4 py-2.5 text-sm text-white">آرشیو کامل</Link>
          <Link href="/contact" className="rounded-full bg-slate-100 px-4 py-2.5 text-sm text-slate-700">مشاوره اختصاصی</Link>
        </div>
      </motion.section>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {picks.map((item) => (
          <Link key={item.id} href={`/listings/${item.id}`} className="overflow-hidden rounded-[1.5rem] bg-white shadow-sm ring-1 ring-slate-200">
            <div className="relative h-40">
              <Image src={fallbackImage(item.imageUrl)} alt={item.title} fill className="object-cover" />
            </div>
            <div className="p-4">
              <h2 className="font-semibold text-slate-900">{item.title}</h2>
              <p className="mt-1 text-sm text-emerald-700">{formatToman(item.price, item.listingType)}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
