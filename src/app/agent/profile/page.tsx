"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { CalendarDays, ExternalLink, Phone } from "lucide-react";
import AdvisorAvatar from "@/components/agents/AdvisorAvatar";
import AgentVisitManager from "@/components/agent/visits/AgentVisitManager";
import {
  ROLE_LABELS,
  displayNameForSession,
  readClientSession,
  type AuthSession,
} from "@/lib/auth";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

type AgentRow = {
  id: string;
  userId?: string;
  name: string;
  phone: string;
  email: string | null;
  avatarUrl: string | null;
};

/**
 * Agent profile hub — photo identity + visit management (account menu entry).
 * Mobile-first: prominent face, clear actions, no fake stats.
 */
export default function AgentProfilePage() {
  const reduceMotion = useReducedMotion();
  const [session, setSession] = useState<AuthSession | null>(null);
  const [agent, setAgent] = useState<AgentRow | null>(null);

  useEffect(() => {
    setSession(readClientSession());
    void (async () => {
      const me = await api<{ session: AuthSession }>("/api/auth/me");
      if (me.ok) setSession(me.data.session);
      const sessionNow = me.ok ? me.data.session : readClientSession();
      const scopeId = sessionNow?.agentId || sessionNow?.id;
      const agents = await api<{ items: AgentRow[] }>("/api/agents");
      if (!agents.ok) return;
      const mine =
        agents.data.items.find(
          (row) => row.id === scopeId || row.userId === scopeId || row.userId === sessionNow?.id,
        ) ||
        agents.data.items[0] ||
        null;
      setAgent(mine);
    })();
  }, []);

  const name = agent?.name || (session ? displayNameForSession(session) : "مشاور");
  const roleLabel = session ? ROLE_LABELS[session.role] : "مشاور";
  const phone = agent?.phone || session?.phone || "";
  const publicId = agent?.id || session?.agentId || "";
  const avatarUrl = agent?.avatarUrl || null;

  return (
    <div className="space-y-6">
      <motion.section
        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22 }}
        className="overflow-hidden rounded-[1.5rem] border border-slate-200/70 bg-white/90 shadow-sm backdrop-blur-md sm:rounded-[1.75rem]"
      >
        {/* Mobile-first identity block */}
        <div className="flex flex-col items-center px-5 pb-5 pt-6 text-center sm:flex-row sm:items-center sm:gap-5 sm:px-6 sm:pb-6 sm:pt-6 sm:text-start">
          <AdvisorAvatar
            name={name}
            avatarUrl={avatarUrl}
            size="hero"
            className="ring-[3px] ring-sky-100"
          />
          <div className="mt-4 min-w-0 sm:mt-0 sm:flex-1">
            <h1 className="truncate font-vazirmatn text-xl font-bold text-slate-900 sm:text-2xl">
              {name}
            </h1>
            <p className="mt-1 text-sm text-slate-500">{roleLabel}</p>
            {phone ? (
              <p className="mt-1 text-sm tabular-nums text-slate-500" dir="ltr">
                {phone}
              </p>
            ) : null}
            {agent?.email ? (
              <p className="mt-0.5 truncate text-xs text-slate-400" dir="ltr">
                {agent.email}
              </p>
            ) : null}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 border-t border-slate-100 px-4 py-3 sm:flex sm:flex-wrap sm:px-6">
          {phone ? (
            <a
              href={`tel:${phone}`}
              className="ios-tap-target inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#0B3A5C] px-3 text-sm font-semibold text-white transition duration-150 hover:bg-[#0a314d] sm:px-4"
            >
              <Phone className="h-4 w-4" />
              تماس
            </a>
          ) : null}
          {publicId ? (
            <Link
              href={`/agents/${publicId}`}
              className="ios-tap-target inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-sky-50 px-3 text-sm font-semibold text-sky-800 ring-1 ring-sky-100 transition duration-150 hover:bg-sky-100 sm:px-4"
            >
              <ExternalLink className="h-4 w-4" />
              رزومه عمومی
            </Link>
          ) : null}
          <a
            href="#agent-visits"
            className={cn(
              "ios-tap-target inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-slate-100 px-3 text-sm font-semibold text-slate-700 transition duration-150 hover:bg-slate-200 sm:px-4",
              phone || publicId ? "col-span-2 sm:col-span-1" : "col-span-2",
            )}
          >
            <CalendarDays className="h-4 w-4" />
            بازدیدها
          </a>
        </div>
      </motion.section>

      <div id="agent-visits">
        <AgentVisitManager embedded />
      </div>
    </div>
  );
}
