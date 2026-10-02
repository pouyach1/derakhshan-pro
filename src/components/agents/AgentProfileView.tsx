"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { BadgeCheck, Building2, Phone, Sparkles } from "lucide-react";
import { api } from "@/lib/api";
import { fallbackImage } from "@/lib/money";
import BackButton from "@/components/navigation/BackButton";
import CompactPropertyCard from "@/components/mobile/CompactPropertyCard";
import type { PublicAgentProfile } from "@/lib/agents-public";
import type { PropertyWithAgent } from "@/server/services/agents-public";
import { siteConfig } from "@/config/siteConfig";

export default function AgentProfileView({ id }: { id: string }) {
  const [agent, setAgent] = useState<PublicAgentProfile | null>(null);
  const [files, setFiles] = useState<PropertyWithAgent[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    void (async () => {
      const [agentRes, propsRes] = await Promise.all([
        api<PublicAgentProfile>(`/api/agents/${id}`),
        api<{ items: PropertyWithAgent[] }>(`/api/properties?pageSize=12&status=published`),
      ]);
      if (!agentRes.ok) {
        setError(agentRes.error.message || "مشاور یافت نشد");
        return;
      }
      setAgent(agentRes.data);
      if (propsRes.ok) {
        setFiles(propsRes.data.items.filter((p) => p.agentId === agentRes.data.id));
      }
    })();
  }, [id]);

  if (error) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <p className="text-sm text-rose-600">{error}</p>
        <Link href="/listings" className="mt-4 inline-block text-sm text-sky-700">
          بازگشت به آرشیو
        </Link>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="px-4 py-28 text-center text-sm text-[#0B3A5C]/45">
        در حال آماده‌سازی پرونده مشاور…
      </div>
    );
  }

  return (
    <div className="bg-[#F3F7FB] text-[#0B3A5C]" dir="rtl">
      <div className="rio-container py-6 md:py-10">
        <BackButton fallbackHref="/listings" label="بازگشت به آرشیو" tone="light" />

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-5 overflow-hidden rounded-[2rem] bg-white shadow-[0_28px_80px_-48px_rgba(11,58,92,0.4)] ring-1 ring-[#0B3A5C]/8"
        >
          <div className="grid gap-0 lg:grid-cols-[280px_minmax(0,1fr)]">
            <div className="relative min-h-[18rem] bg-[#0B3A5C] lg:min-h-full">
              <Image
                src={fallbackImage(agent.avatarUrl)}
                alt={agent.name}
                fill
                className="object-cover opacity-90"
                sizes="320px"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B3A5C] via-[#0B3A5C]/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold text-sky-100 backdrop-blur">
                  <Sparkles className="h-3.5 w-3.5" />
                  {agent.badge}
                </p>
              </div>
            </div>

            <div className="p-6 sm:p-8 md:p-10">
              <p className="text-[11px] font-semibold tracking-[0.18em] text-sky-600">
                رزومه و پروفایل مشاور
              </p>
              <h1 className="mt-2 font-vazirmatn text-3xl font-bold tracking-tight md:text-4xl">
                {agent.name}
              </h1>
              <p className="mt-2 text-base font-semibold text-[#0B3A5C]/75">{agent.title}</p>
              <p className="mt-1 text-sm text-[#0B3A5C]/55">{agent.department}</p>

              <p className="mt-6 text-base leading-9 text-[#0B3A5C]/85">{agent.bio}</p>
              <p className="mt-4 rounded-2xl bg-[#F3F7FB] px-4 py-3 text-sm leading-8 text-[#0B3A5C]/75">
                «{agent.philosophy}»
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {agent.specialties.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-800 ring-1 ring-sky-100"
                  >
                    <BadgeCheck className="h-3.5 w-3.5" />
                    {item}
                  </span>
                ))}
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {agent.stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-[#0B3A5C]/8 bg-[#F3F7FB] px-4 py-4 text-center"
                  >
                    <p className="font-vazirmatn text-lg font-bold text-[#0B3A5C]">{stat.value}</p>
                    <p className="mt-1 text-[11px] text-[#0B3A5C]/55">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={`tel:${agent.phone}`}
                  className="inline-flex items-center gap-2 rounded-full bg-sky-500 px-5 py-2.5 text-sm font-bold text-white shadow-[0_14px_36px_-18px_rgba(0,163,255,0.9)]"
                >
                  <Phone className="h-4 w-4" />
                  تماس با مشاور
                </a>
                <Link
                  href="/listings"
                  className="inline-flex items-center gap-2 rounded-full bg-[#0B3A5C] px-5 py-2.5 text-sm font-bold text-white"
                >
                  <Building2 className="h-4 w-4" />
                  فایل‌های {siteConfig.brand.shortNameFa}
                </Link>
              </div>
            </div>
          </div>
        </motion.section>

        <section className="mt-10 pb-20">
          <div className="mb-5 flex items-end justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.18em] text-sky-600">فایل‌های مسئول</p>
              <h2 className="mt-1 font-vazirmatn text-xl font-bold md:text-2xl">
                املاک تحت مسئولیت {agent.name}
              </h2>
            </div>
            <p className="text-xs text-[#0B3A5C]/45">
              {files.length.toLocaleString("fa-IR")} فایل فعال
            </p>
          </div>

          {files.length === 0 ? (
            <p className="rounded-[1.5rem] bg-white px-6 py-12 text-center text-sm text-[#0B3A5C]/45 ring-1 ring-[#0B3A5C]/8">
              فعلاً فایل منتشرشده‌ای برای این مشاور نیست.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {files.map((item) => (
                <CompactPropertyCard key={item.id} item={item} variant="featured" />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
