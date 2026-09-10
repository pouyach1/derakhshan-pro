"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ADMIN_CONTACTS, type ContactRole } from "@/config/admin";
import { cn } from "@/lib/utils";

const CATEGORIES = ["All", "Realtors", "Builders", "Clients"] as const;

const ROLE_MAP: Record<(typeof CATEGORIES)[number], ContactRole | "All"> = {
  All: "All",
  Realtors: "Realtor",
  Builders: "Builder",
  Clients: "Client",
};

export default function ContactsSidebar() {
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("All");
  const [activeId, setActiveId] = useState(ADMIN_CONTACTS[0]?.id ?? "");

  const contacts = useMemo(() => {
    const role = ROLE_MAP[category];
    if (role === "All") return ADMIN_CONTACTS;
    return ADMIN_CONTACTS.filter((contact) => contact.role === role);
  }, [category]);

  const cityCount = ADMIN_CONTACTS.filter((c) => c.city === "San Francisco").length;

  return (
    <aside className="flex h-full min-h-[32rem] flex-col rounded-[1.75rem] bg-admin-card p-4 shadow-sm ring-1 ring-slate-200/70 lg:p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-admin-navy">Contacts</h2>
        <button
          type="button"
          aria-label="Filter contacts"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-admin-soft text-slate-600 transition hover:text-admin-sky"
        >
          <FilterIcon />
        </button>
      </div>

      <div className="mb-3 flex flex-wrap gap-1.5">
        {CATEGORIES.map((item) => {
          const active = category === item;
          return (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-medium transition",
                active
                  ? "bg-admin-navy text-white"
                  : "bg-admin-soft text-slate-600 hover:bg-slate-200/80",
              )}
            >
              {item}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        className="mb-4 inline-flex w-full items-center justify-between rounded-2xl bg-admin-soft px-3 py-2.5 text-left text-sm text-admin-navy"
      >
        <span className="inline-flex items-center gap-2">
          <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-admin-sky ring-1 ring-sky-100">
            {cityCount}
          </span>
          San Francisco
        </span>
        <ChevronIcon />
      </button>

      <div className="flex-1 space-y-2.5 overflow-y-auto pr-1">
        <AnimatePresence mode="popLayout">
          {contacts.map((contact) => {
            const active = contact.id === activeId;
            return (
              <motion.article
                key={contact.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25 }}
                className={cn(
                  "rounded-2xl p-3 transition",
                  active
                    ? "bg-admin-sky text-white shadow-lg shadow-sky-500/25"
                    : "bg-admin-soft/80 text-admin-navy hover:bg-admin-soft",
                )}
              >
                <div className="flex items-start gap-3">
                  <button type="button" className="shrink-0" onClick={() => setActiveId(contact.id)}>
                    <Image
                      src={contact.avatar}
                      alt={contact.name}
                      width={44}
                      height={44}
                      className="h-11 w-11 rounded-full object-cover ring-2 ring-white/70"
                    />
                  </button>
                  <div className="min-w-0 flex-1">
                    <button type="button" className="w-full text-left" onClick={() => setActiveId(contact.id)}>
                      <p className="truncate text-sm font-semibold">{contact.name}</p>
                      <p className={cn("text-xs", active ? "text-white/85" : "text-slate-500")}>
                        {contact.role}
                      </p>
                    </button>
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        type="button"
                        aria-label={`Call ${contact.name}`}
                        className={cn(
                          "inline-flex h-8 w-8 items-center justify-center rounded-full transition",
                          active ? "bg-white/20 text-white" : "bg-white text-slate-600",
                        )}
                      >
                        <PhoneIcon />
                      </button>
                      <button
                        type="button"
                        aria-label={`Open ${contact.name}`}
                        className={cn(
                          "inline-flex h-8 w-8 items-center justify-center rounded-full transition",
                          active ? "bg-white/20 text-white" : "bg-white text-slate-600",
                        )}
                      >
                        <ExternalIcon />
                      </button>
                      <button
                        type="button"
                        className={cn(
                          "ml-auto rounded-full px-3 py-1.5 text-xs font-medium transition",
                          active
                            ? "bg-white text-admin-sky"
                            : "bg-white text-admin-navy ring-1 ring-slate-200 hover:ring-admin-sky/40",
                        )}
                      >
                        Send letter
                      </button>
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </AnimatePresence>
      </div>
    </aside>
  );
}

function FilterIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 5h16M7 12h10M10 19h4" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6.5 4.5h3l1.5 4-2 1.5a12 12 0 0 0 5.5 5.5l1.5-2 4 1.5v3A2 2 0 0 1 18 20 14 14 0 0 1 4 6a2 2 0 0 1 2.5-1.5Z" />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  );
}
