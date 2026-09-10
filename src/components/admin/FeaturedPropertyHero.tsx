"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FEATURED_PROPERTY } from "@/config/admin";

export default function FeaturedPropertyHero() {
  const property = FEATURED_PROPERTY;

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-[1.75rem] bg-admin-sky text-white shadow-xl shadow-sky-500/20"
    >
      <div className="absolute inset-0">
        <Image
          src={property.image}
          alt={property.title}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 70vw"
          className="object-cover object-center opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-admin-sky via-admin-sky/85 to-admin-sky/35" />
      </div>

      <div className="relative z-10 grid gap-6 p-5 sm:p-7 lg:grid-cols-[1.1fr_0.9fr] lg:p-8">
        <div className="flex min-h-[18rem] flex-col justify-between sm:min-h-[22rem]">
          <div className="flex items-start justify-between gap-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 backdrop-blur-md ring-1 ring-white/25">
              <Image
                src={property.agent.avatar}
                alt={property.agent.name}
                width={28}
                height={28}
                className="h-7 w-7 rounded-full object-cover"
              />
              <span className="text-xs font-medium sm:text-sm">
                {property.agent.name} · {property.agent.role}
              </span>
            </div>
            <div className="flex gap-2">
              <IconButton label="Bookmark">
                <BookmarkIcon />
              </IconButton>
              <IconButton label="Share">
                <ShareIcon />
              </IconButton>
            </div>
          </div>

          <div>
            <h1 className="max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
              {property.title}
            </h1>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/90 sm:text-base">
              {property.address}
            </p>
          </div>

          <div className="flex items-end justify-between gap-4">
            <div className="flex items-center gap-2">
              {[0, 1, 2, 3].map((dot) => (
                <span
                  key={dot}
                  className={`h-2 w-2 rounded-full ${dot === 0 ? "bg-white" : "bg-white/40"}`}
                />
              ))}
            </div>
            <span className="rounded-full bg-admin-navy px-3.5 py-2 text-xs font-semibold text-white shadow-lg sm:text-sm">
              {property.area}
            </span>
          </div>
        </div>

        <div className="relative hidden min-h-[22rem] overflow-hidden rounded-[1.35rem] ring-1 ring-white/30 lg:block">
          <Image
            src={property.image}
            alt={`${property.title} showcase`}
            fill
            sizes="40vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-admin-navy/40 to-transparent" />
        </div>
      </div>
    </motion.section>
  );
}

function IconButton({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md ring-1 ring-white/25 transition hover:bg-white/25"
    >
      {children}
    </button>
  );
}

function BookmarkIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M7 4h10v17l-5-3-5 3V4Z" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="18" cy="5" r="2.5" />
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="19" r="2.5" />
      <path d="m8.2 13.2 7.5 4.3M15.7 6.5l-7.5 4.3" />
    </svg>
  );
}
